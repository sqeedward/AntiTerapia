// Meme database for RoastMyLife
// This teaches Gemini about available memes and when to use them

export const memeDatabase = {
  "crying": {
    file: "/crying.jpg",
    description: "Crying face - use for sad, pathetic, or pitiful situations",
    useCases: ["sad stories", "pathetic life choices", "crying about problems", "woe is me"]
  },
  "side_eye": {
    file: "/side_eye.jpg", 
    description: "Side eye look - use for suspicious, doubtful, or judgmental reactions",
    useCases: ["suspicious behavior", "doubtful claims", "judgmental reactions", "side eye moments"]
  },
  "blinking_meme": {
    file: "/blinking_meme.jpg",
    description: "Blinking guy - use for confusion, disbelief, or processing information",
    useCases: ["confusion", "disbelief", "processing bad decisions", "what just happened"]
  },
  "cat_laughing_at_you": {
    file: "/cat_laughing_at_you.jpg",
    description: "Cat laughing - use for mocking, laughing at someone's expense",
    useCases: ["mocking someone", "laughing at failures", "ridiculous situations", "you're a joke"]
  },
  "chill_guys": {
    file: "/chill_guys.jpg",
    description: "Chill guys - use for overreactions, dramatic responses",
    useCases: ["overreactions", "dramatic responses", "calm down", "it's not that serious"]
  },
  "no_god_please_no": {
    file: "/no_god_please_no.jpg",
    description: "No God please no - use for desperate situations, begging, or dramatic despair",
    useCases: ["desperate situations", "begging", "dramatic despair", "please no"]
  },
  "this_is_fine": {
    file: "/this_is_fine.jpg",
    description: "This is fine dog - use for denial, pretending everything is okay when it's not",
    useCases: ["denial", "pretending everything is fine", "ignoring problems", "this is fine"]
  },
  "man_what": {
    file: "/man_what.jpg",
    description: "Man what - use for confusion, disbelief, or what did you just say",
    useCases: ["confusion", "disbelief", "what did you just say", "man what"]
  },
  "sponge_bob_chicken": {
    file: "/sponge_bob_chicken.jpg",
    description: "SpongeBob chicken - use for cowardice, being afraid, or backing down",
    useCases: ["cowardice", "being afraid", "backing down", "chicken behavior"]
  },
  "what": {
    file: "/what.jpg",
    description: "What - use for confusion, disbelief, or what are you talking about",
    useCases: ["confusion", "disbelief", "what are you talking about", "what"]
  },
  "think": {
    file: "/think.jpg",
    description: "Think - use for deep thoughts, contemplation, or thinking about life choices",
    useCases: ["deep thoughts", "contemplation", "thinking about life choices", "philosophical moments"]
  },
  "doge_side_eye": {
    file: "/doge_side_eye.jpg",
    description: "Doge side eye - use for suspicious dog reactions, cute judgment",
    useCases: ["suspicious dog reactions", "cute judgment", "doge moments", "side eye"]
  }
};

// Function to get a meme by name
export function getMemeByName(name) {
  return memeDatabase[name.toLowerCase()] || null;
}

// Function to get all available memes
export function getAllMemes() {
  return Object.keys(memeDatabase);
}

// Function to get meme suggestions based on content
export function suggestMemes(content, roastLevel) {
  const suggestions = [];
  const contentLower = content.toLowerCase();
  
  // Analyze content and suggest appropriate memes
  for (const [name, meme] of Object.entries(memeDatabase)) {
    let score = 0;
    
    // Check if any use cases match the content
    for (const useCase of meme.useCases) {
      if (contentLower.includes(useCase)) {
        score += 2;
      }
    }
    
    // Check for specific keywords in content
    const keywords = {
      'crying': ['sad', 'cry', 'tears', 'pathetic', 'depressing', 'miserable'],
      'side_eye': ['suspicious', 'doubt', 'judge', 'side eye', 'questionable'],
      'blinking_meme': ['confused', 'what', 'huh', 'disbelief', 'processing'],
      'cat_laughing_at_you': ['laugh', 'funny', 'ridiculous', 'joke', 'mocking'],
      'chill_guys': ['calm', 'relax', 'overreact', 'dramatic', 'chill'],
      'no_god_please_no': ['desperate', 'please', 'no', 'begging', 'despair'],
      'this_is_fine': ['fine', 'okay', 'denial', 'ignore', 'pretend'],
      'man_what': ['what', 'confused', 'disbelief', 'man what'],
      'sponge_bob_chicken': ['afraid', 'scared', 'chicken', 'coward', 'back down'],
      'what': ['what', 'confused', 'disbelief', 'huh'],
      'think': ['think', 'thought', 'contemplate', 'philosophy', 'deep'],
      'doge_side_eye': ['suspicious', 'cute', 'doge', 'side eye', 'judgment']
    };
    
    if (keywords[name]) {
      for (const keyword of keywords[name]) {
        if (contentLower.includes(keyword)) {
          score += 1;
        }
      }
    }
    
    // Adjust score based on roast level
    if (roastLevel === 'Brutal') {
      if (name.includes('laughing') || name.includes('crying') || name.includes('side_eye')) {
        score += 1;
      }
    } else if (roastLevel === 'Light') {
      if (name.includes('think') || name.includes('blinking') || name.includes('what')) {
        score += 1;
      }
    }
    
    // Add some randomness to prevent always picking the same meme
    score += Math.random() * 0.5;
    
    if (score > 0) {
      suggestions.push({ name, meme, score });
    }
  }
  
  // Sort by score and return top suggestions
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) // Return more suggestions for variety
    .map(s => s.name);
}

// Function to create meme prompt for Gemini
export function createMemePrompt() {
  const memeList = Object.entries(memeDatabase)
    .map(([name, meme]) => `${name}: ${meme.description}`)
    .join('\n');
    
  return `Available memes:\n${memeList}\n\nChoose the most appropriate meme based on the roast content and provide a short, funny caption (max 50 characters). Format your response as: "Meme: [meme_name], Caption: [caption]"`;
} 