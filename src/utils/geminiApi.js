// Mock implementation for now - replace with actual Firebase AI Logic SDK later
// import { initializeApp } from 'firebase/app';
// import { getAI } from 'firebase/ai';

// const firebaseConfig = {
//   // Add your Firebase config here
// };

// const app = initializeApp(firebaseConfig);
// const ai = getAI(app);

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createMemePrompt, getMemeByName, suggestMemes } from "./memeDatabase";

// Use your Gemini API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper to convert File/Blob to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Mock audio transcription (replace with real STT if needed)
async function transcribeAudio(audioFile) {
  // TODO: Integrate with Google Speech-to-Text or Gemini audio if available
  return "[Transcribed audio text goes here]";
}

// Test function to verify API connection
export async function testGeminiConnection() {
  try {
    if (!API_KEY) {
      console.error("Gemini API key not found. Please check your .env file.");
      return false;
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say 'Hello, RoastMyLife!'");
    const response = await result.response;
    console.log("Gemini API Test Success:", response.text());
    return true;
  } catch (error) {
    console.error("Gemini API Test Failed:", error);
    return false;
  }
}

export async function getRoast(input, roastLevel, noGoTopics, history) {
  const { text, photo, audio } = input;
  
  // Check if API key is available
  if (!API_KEY) {
    console.error("Gemini API key not found. Please check your .env file.");
    throw new Error("API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
  }
  
  // System prompt for Gemini with meme instructions
  let systemPrompt = `You are a savage, witty roastmaster for the RoastMyLife app. Analyze user inputs (text, photo, audio) for sentiment (boastful, sad, cringe, etc.) and roastable content (job, hobbies, style, fails). Deliver a humorous roast in a snarky tone, matching the user's chosen intensity (Light, Medium, Brutal). Avoid sensitive topics (e.g., family) if flagged. 

Generate TWO separate roasts:
1. TEXT_ROAST: A detailed written roast (100-200 words) with clever wordplay and references
2. AUDIO_ROAST: A short, punchy roast (20-40 words) optimized for speech delivery - use shorter sentences, repetition, and dramatic pauses

${createMemePrompt()}`;

  // Build user prompt
  let userPrompt = "";
  if (text) userPrompt += `Text: ${text}\n`;
  if (photo) userPrompt += `Photo: [User uploaded a photo]\n`;
  if (audio) userPrompt += `Audio: [User uploaded/recorded audio]\n`;
  userPrompt += `Roast level: ${roastLevel}. Avoid: ${noGoTopics}. History: ${JSON.stringify(history)}.`;

  try {
    // Prepare parts for Gemini API
    let parts = [{ text: systemPrompt + "\n" + userPrompt }];

    // If photo, add as image part
    if (photo) {
      const base64Image = await fileToBase64(photo);
      parts.push({ inlineData: { mimeType: photo.type, data: base64Image } });
    }

    // If audio, transcribe and add as text (Gemini multimodal audio is not public yet)
    if (audio) {
      const audioText = await transcribeAudio(audio);
      parts.push({ text: `Audio transcript: ${audioText}` });
    }

    // Call Gemini API with correct model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const response = await result.response;
    const fullResponse = response.text();

    // Parse the response to extract text roast, audio roast, and meme
    let textRoast = "";
    let audioRoast = "";
    let meme = { template: "crying", caption: "When life roasts you back" };

    // Try to extract TEXT_ROAST and AUDIO_ROAST sections
    const textRoastMatch = fullResponse.match(/TEXT_ROAST[:\s]*(.*?)(?=AUDIO_ROAST|Meme:|$)/is);
    const audioRoastMatch = fullResponse.match(/AUDIO_ROAST[:\s]*(.*?)(?=Meme:|$)/is);
    
    if (textRoastMatch) {
      textRoast = textRoastMatch[1].trim();
    } else {
      // Fallback: use the full response as text roast
      textRoast = fullResponse;
    }

    if (audioRoastMatch) {
      audioRoast = audioRoastMatch[1].trim();
    } else {
      // Fallback: create a short audio roast from the text roast
      const sentences = textRoast.split(/[.!?]+/).filter(s => s.trim().length > 0);
      audioRoast = sentences.slice(0, 2).join('. ').trim() + '.';
      if (audioRoast.length > 100) {
        audioRoast = audioRoast.substring(0, 100) + '...';
      }
    }

    // Parse meme selection from response
    const memeMatch = fullResponse.match(/Meme:\s*([\w_]+),\s*Caption:\s*['"](.+?)['"]/i);
    
    if (memeMatch) {
      const memeName = memeMatch[1].toLowerCase();
      const caption = memeMatch[2].trim();
      const memeData = getMemeByName(memeName);
      
      if (memeData) {
        meme = {
          template: memeName,
          caption: caption,
          file: memeData.file
        };
      }
    } else {
      // Fallback: suggest memes based on content
      const suggestions = suggestMemes(textRoast, roastLevel);
      if (suggestions.length > 0) {
        const memeData = getMemeByName(suggestions[0]);
        meme = {
          template: suggestions[0],
          caption: "AI couldn't pick a caption, but this meme fits!",
          file: memeData.file
        };
      }
    }

    return {
      textRoast: textRoast,
      audioRoast: audioRoast,
      meme,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Fallback to mock response if API fails
    const fallbackRoasts = {
      Light: {
        text: "Oh honey, that's... interesting. At least you're trying! Your life choices are like a choose-your-own-adventure book where every choice leads to chaos. But hey, at least you're consistent in your... unique approach to life.",
        audio: "Oh honey, that's interesting. At least you're trying!"
      },
      Medium: {
        text: "Your life choices are giving me second-hand embarrassment. It's like watching a train wreck in slow motion, but the train is your decision-making process and the wreck is your entire existence.",
        audio: "Your life choices are giving me second-hand embarrassment. What were you thinking?"
      },
      Brutal: {
        text: "Your existence is a cosmic joke and the universe is laughing at you. Every decision you've ever made has been wrong, and somehow you keep finding new ways to disappoint everyone around you.",
        audio: "Your existence is a cosmic joke. The universe is laughing at you."
      }
    };
    
    const fallback = fallbackRoasts[roastLevel] || fallbackRoasts.Medium;
    const fallbackMeme = getMemeByName("crying");
    
    return {
      textRoast: fallback.text,
      audioRoast: fallback.audio,
      meme: { 
        template: "crying", 
        caption: "When the AI fails but you still get roasted",
        file: fallbackMeme.file
      },
    };
  }
} 