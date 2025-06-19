// Mock implementation for now - replace with actual Firebase AI Logic SDK later
// import { initializeApp } from 'firebase/app';
// import { getAI } from 'firebase/ai';

// const firebaseConfig = {
//   // Add your Firebase config here
// };

// const app = initializeApp(firebaseConfig);
// const ai = getAI(app);

import { GoogleGenerativeAI } from "@google/generative-ai";

// Use your Gemini API key here (store securely in production!)
const API_KEY = ""; // TODO: Replace with your real key or use env variable
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
  
  // System prompt for Gemini
  let systemPrompt = `You are a savage, witty roastmaster for the RoastMyLife app. Analyze user inputs (text, photo, audio) for sentiment (boastful, sad, cringe, etc.) and roastable content (job, hobbies, style, fails). Deliver a humorous roast in a snarky tone, matching the user's chosen intensity (Light, Medium, Brutal). Avoid sensitive topics (e.g., family) if flagged. Generate a text roast (100-200 words), suggest a meme template (e.g., Drake Hotline Bling for boastful) with caption, and provide audio roast text for text-to-speech. Reference past inputs (if provided) for callbacks.`;

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
    const roastText = response.text();

    // Simple meme extraction (look for 'Meme:' in response)
    let meme = { template: "Drake Hotline Bling", caption: "When you think you're cool but..." };
    const memeMatch = roastText.match(/Meme:\s*([\w\s]+),\s*['"](.+?)['"]/i);
    if (memeMatch) {
      meme = { template: memeMatch[1].trim(), caption: memeMatch[2].trim() };
    }

    return {
      textRoast: roastText,
      audioRoast: roastText, // For TTS
      meme,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Fallback to mock response if API fails
    const fallbackRoasts = {
      Light: "Oh honey, that's... interesting. At least you're trying!",
      Medium: "Your life choices are giving me second-hand embarrassment.",
      Brutal: "Your existence is a cosmic joke and the universe is laughing at you."
    };
    
    return {
      textRoast: fallbackRoasts[roastLevel] || fallbackRoasts.Medium,
      audioRoast: fallbackRoasts[roastLevel] || fallbackRoasts.Medium,
      meme: { template: "Drake Hotline Bling", caption: "When you think you're cool but..." },
    };
  }
} 