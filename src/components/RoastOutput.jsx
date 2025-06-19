import { useState, useEffect } from 'react';
import { speakRoast, stopRoastAudio, roastTTS } from '../utils/audioProcessor';

function RoastOutput({ roast, roastLevel = 'Medium', darkMode = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  // Update playing state when roastTTS state changes
  useEffect(() => {
    const checkPlayingState = () => {
      setIsPlaying(roastTTS.isCurrentlyPlaying());
    };

    // Check state periodically
    const interval = setInterval(checkPlayingState, 100);

    return () => clearInterval(interval);
  }, []);

  // Auto-play when new roast is generated
  useEffect(() => {
    if (roast && autoPlay && !isPlaying) {
      handlePlayAudio();
    }
  }, [roast, autoPlay]);

  const handlePlayAudio = async () => {
    if (isPlaying) {
      stopRoastAudio();
      setIsPlaying(false);
      setIsPaused(false);
    } else {
      try {
        await speakRoast(roast, roastLevel);
        setIsPlaying(true);
        setIsPaused(false);
      } catch (error) {
        console.error('Error playing audio:', error);
        alert('Unable to play audio. Please check your browser settings.');
      }
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      roastTTS.resume();
      setIsPaused(false);
    } else {
      roastTTS.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    stopRoastAudio();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!roast) return null;

  return (
    <div className={`rounded-2xl shadow-2xl border overflow-hidden transform transition-all duration-300 hover:shadow-3xl ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
        : 'bg-gradient-to-br from-white to-red-50 border-red-100'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <h2 className="text-2xl font-bold">Your Roast</h2>
              <p className="text-red-100 text-sm">Level: {roastLevel} • AI Generated</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl">💀</div>
          </div>
        </div>
      </div>

      {/* Roast Content */}
      <div className="p-6">
        <div className={`rounded-xl p-6 shadow-inner border mb-6 ${
          darkMode 
            ? 'bg-gray-700 border-gray-600' 
            : 'bg-white border-gray-100'
        }`}>
          <p className={`text-lg leading-relaxed font-medium transition-colors duration-300 ${
            darkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>
            "{roast}"
          </p>
        </div>
        
        {/* Audio Controls */}
        <div className={`rounded-xl p-6 border transition-colors duration-300 ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600' 
            : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎤</span>
              <div>
                <h3 className={`font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Audio Roast</h3>
                <p className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Hear your roast spoken aloud</p>
              </div>
            </div>
            
            {/* Auto-play toggle */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  autoPlay ? 'bg-red-500' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    autoPlay ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </div>
              </div>
              <span className={`text-sm font-medium transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Auto-play</span>
            </label>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handlePlayAudio}
              className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                isPlaying 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <span className="flex items-center gap-2">
                {isPlaying ? '⏹️ Stop' : '▶️ Play Roast'}
              </span>
            </button>

            {isPlaying && (
              <>
                <button
                  onClick={handlePauseResume}
                  className="group px-6 py-3 rounded-xl font-semibold bg-yellow-600 text-white hover:bg-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                  </span>
                </button>
                
                <button
                  onClick={handleStop}
                  className="group px-6 py-3 rounded-xl font-semibold bg-gray-600 text-white hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    ⏹️ Stop
                  </span>
                </button>
              </>
            )}

            {/* Audio Status Indicator */}
            {isPlaying && (
              <div className="flex items-center gap-3 ml-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {isPaused ? '⏸️ Paused' : '🎵 Playing...'}
                </span>
              </div>
            )}
          </div>

          {/* Audio Settings Info */}
          <div className={`mt-4 p-3 rounded-lg border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>🎵 Voice: <span className="font-semibold">{roastLevel} intensity</span></span>
                <span className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>🎚️ Volume: <span className="font-semibold">Customizable</span></span>
              </div>
              <span className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>💡 Click "⚙️ Audio Settings" to customize</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoastOutput; 