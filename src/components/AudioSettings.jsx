import { useState, useEffect } from 'react';
import { roastTTS } from '../utils/audioProcessor';
import { memeDatabase } from '../utils/memeDatabase';

function AudioSettings({ isOpen, onClose, darkMode = false }) {
  const [autoPlay, setAutoPlay] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [activeTab, setActiveTab] = useState('audio'); // 'audio' or 'memes'

  useEffect(() => {
    // Load available voices
    const loadVoices = async () => {
      const voices = await roastTTS.getVoices();
      setAvailableVoices(voices);
      
      // Try to find a good default voice
      const defaultVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        voice.name.toLowerCase().includes('male')
      ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
      
      setSelectedVoice(defaultVoice);
    };

    loadVoices();
  }, []);

  const handleTestVoice = async () => {
    if (selectedVoice) {
      const testText = "This is a test of the roast voice. How does it sound?";
      const utterance = new SpeechSynthesisUtterance(testText);
      utterance.voice = selectedVoice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-3xl shadow-4xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-fadeIn transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚙️</span>
              <div>
                <h3 className="text-2xl font-bold">Settings</h3>
                <p className="text-purple-100 text-sm">Customize your roast experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-light transition-colors duration-200 hover:scale-110"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b transition-colors duration-300 ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 ${
              activeTab === 'audio' 
                ? 'border-b-4 border-purple-500 text-purple-600 bg-white dark:bg-gray-900' 
                : darkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              🎤 Audio Settings
            </span>
          </button>
          <button
            onClick={() => setActiveTab('memes')}
            className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 ${
              activeTab === 'memes' 
                ? 'border-b-4 border-purple-500 text-purple-600 bg-white dark:bg-gray-900' 
                : darkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              🎭 Available Memes
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {/* Audio Settings Tab */}
          {activeTab === 'audio' && (
            <div className="p-6 space-y-6">
              {/* Auto-play setting */}
              <div className={`rounded-xl p-6 transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold mb-1 transition-colors duration-300 ${
                      darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>Auto-play Roasts</h4>
                    <p className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Automatically play audio when a roast is generated
                    </p>
                  </div>
                  <label className="relative cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoPlay}
                      onChange={(e) => setAutoPlay(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-14 h-7 rounded-full transition-colors duration-200 ${
                      autoPlay ? 'bg-purple-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        autoPlay ? 'translate-x-7' : 'translate-x-1'
                      }`}></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Voice selection */}
              <div className={`rounded-xl p-6 transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <h4 className={`font-semibold text-gray-800 mb-3 transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Voice Selection</h4>
                <select
                  value={selectedVoice ? selectedVoice.name : ''}
                  onChange={(e) => {
                    const voice = availableVoices.find(v => v.name === e.target.value);
                    setSelectedVoice(voice);
                  }}
                  className={`w-full p-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-900' 
                      : 'border-gray-200 text-gray-800'
                  }`}
                >
                  {availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Volume control */}
              <div className={`rounded-xl p-6 transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <h4 className={`font-semibold mb-3 transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Volume: {Math.round(volume * 100)}%
                </h4>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Speed control */}
              <div className={`rounded-xl p-6 transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <h4 className={`font-semibold mb-3 transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Speed: {rate.toFixed(1)}x
                </h4>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x</span>
                  <span>1.0x</span>
                  <span>2.0x</span>
                </div>
              </div>

              {/* Pitch control */}
              <div className={`rounded-xl p-6 transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <h4 className={`font-semibold mb-3 transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Pitch: {pitch.toFixed(1)}x
                </h4>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>Normal</span>
                  <span>High</span>
                </div>
              </div>

              {/* Test button */}
              <div className="pt-4">
                <button
                  onClick={handleTestVoice}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    🎵 Test Voice Settings
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Memes Tab */}
          {activeTab === 'memes' && (
            <div className="p-6">
              <div className="mb-6">
                <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Available Memes</h4>
                <p className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  These are the memes available for AI selection. The AI will choose the most appropriate one based on your roast content.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(memeDatabase).map(([name, meme]) => (
                  <div key={name} className={`border-2 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <img 
                      src={meme.file} 
                      alt={name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        e.target.src = '/crying.jpg';
                      }}
                    />
                    <h5 className={`font-semibold mb-2 transition-colors duration-300 ${
                      darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h5>
                    <p className={`text-sm mb-3 transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {meme.description}
                    </p>
                    <div className={`text-xs transition-colors duration-300 ${
                      darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      <strong>Use cases:</strong> {meme.useCases.slice(0, 2).join(', ')}
                      {meme.useCases.length > 2 && '...'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Close Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioSettings; 