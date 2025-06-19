// Placeholder for audio processing utilities (e.g., audio-to-text, text-to-speech)
export async function processAudio(audioFile) {
  // Mock implementation - replace with actual audio processing
  // In a real implementation, this would:
  // 1. Convert audio to text using speech-to-text API
  // 2. Analyze tone/sentiment
  // 3. Extract roastable content
  
  return { 
    text: 'Transcribed audio text would go here',
    tone: 'uncertain', // confident, uncertain, nervous, excited, etc.
    duration: audioFile.size, // Mock duration
    roastableContent: ['voice quality', 'speaking pace', 'word choice']
  };
}

export async function analyzeAudioTone(audioBlob) {
  // Mock tone analysis
  const tones = ['nervous', 'confident', 'uncertain', 'excited', 'monotone', 'dramatic'];
  return tones[Math.floor(Math.random() * tones.length)];
}

export function formatAudioDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Text-to-Speech functionality using Web Speech API
class RoastTTS {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.utterance = null;
    this.isPlaying = false;
  }

  // Get available voices
  getVoices() {
    return new Promise((resolve) => {
      let voices = this.synthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        this.synthesis.onvoiceschanged = () => {
          voices = this.synthesis.getVoices();
          resolve(voices);
        };
      }
    });
  }

  // Find a suitable voice for roasting (preferably male, English)
  async getRoastVoice() {
    const voices = await this.getVoices();
    
    // Try to find a male English voice first
    let roastVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      voice.name.toLowerCase().includes('male')
    );
    
    // Fallback to any English voice
    if (!roastVoice) {
      roastVoice = voices.find(voice => voice.lang.includes('en'));
    }
    
    // Final fallback to any available voice
    if (!roastVoice && voices.length > 0) {
      roastVoice = voices[0];
    }
    
    return roastVoice;
  }

  // Speak the roast text
  async speakRoast(text, roastLevel = 'Medium') {
    if (this.isPlaying) {
      this.stop();
    }

    const voice = await this.getRoastVoice();
    
    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings based on roast level
    if (voice) {
      this.utterance.voice = voice;
    }
    
    // Adjust speech parameters based on roast intensity
    switch (roastLevel) {
      case 'Light':
        this.utterance.rate = 0.9;
        this.utterance.pitch = 1.1;
        this.utterance.volume = 0.8;
        break;
      case 'Medium':
        this.utterance.rate = 1.0;
        this.utterance.pitch = 1.0;
        this.utterance.volume = 0.9;
        break;
      case 'Brutal':
        this.utterance.rate = 1.1;
        this.utterance.pitch = 0.9;
        this.utterance.volume = 1.0;
        break;
      default:
        this.utterance.rate = 1.0;
        this.utterance.pitch = 1.0;
        this.utterance.volume = 0.9;
    }

    // Add some attitude to the voice
    this.utterance.rate = Math.max(0.8, this.utterance.rate);
    this.utterance.pitch = Math.max(0.8, this.utterance.pitch);

    // Event handlers
    this.utterance.onstart = () => {
      this.isPlaying = true;
      console.log('🎤 Roast audio started');
    };

    this.utterance.onend = () => {
      this.isPlaying = false;
      console.log('🎤 Roast audio finished');
    };

    this.utterance.onerror = (event) => {
      this.isPlaying = false;
      console.error('🎤 Roast audio error:', event.error);
    };

    // Start speaking
    this.synthesis.speak(this.utterance);
  }

  // Stop current speech
  stop() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
      this.isPlaying = false;
    }
  }

  // Check if currently playing
  isCurrentlyPlaying() {
    return this.isPlaying;
  }

  // Pause speech
  pause() {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  // Resume speech
  resume() {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }
}

// Create a singleton instance
export const roastTTS = new RoastTTS();

// Convenience function to speak roast
export async function speakRoast(text, roastLevel = 'Medium') {
  return roastTTS.speakRoast(text, roastLevel);
}

// Convenience function to stop roast audio
export function stopRoastAudio() {
  roastTTS.stop();
} 