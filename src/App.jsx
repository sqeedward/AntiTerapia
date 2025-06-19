import { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import RoastOutput from './components/RoastOutput';
import MemeDisplay from './components/MemeDisplay';
import HistoryView from './components/HistoryView';
import AudioSettings from './components/AudioSettings';
import { getRoast, testGeminiConnection } from './utils/geminiApi';

function App() {
  const [roast, setRoast] = useState(null);
  const [meme, setMeme] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRoastLevel, setCurrentRoastLevel] = useState('Medium');
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Update document class when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = async (input, roastLevel, noGoTopics) => {
    setIsLoading(true);
    setError(null);
    setCurrentRoastLevel(roastLevel);
    
    try {
      const response = await getRoast(input, roastLevel, noGoTopics, history);
      setRoast(response.textRoast);
      setMeme(response.meme);
      setHistory([...history, { input, output: response }]);
    } catch (err) {
      console.error('Error getting roast:', err);
      setError('Failed to get roast. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAPI = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await testGeminiConnection();
      if (success) {
        setError('✅ Gemini API connection successful!');
      } else {
        setError('❌ Gemini API connection failed. Check console for details.');
      }
    } catch (err) {
      setError('❌ API test failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        darkMode ? 'opacity-10' : 'opacity-5'
      }`}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-2 animate-pulse">
              🔥 RoastMyLife 🔥
            </h1>
            <div className="h-1 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 rounded-full"></div>
          </div>
          <p className={`mt-4 text-lg font-medium transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Let AI roast your life with savage humor, memes, and audio!
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button 
            onClick={handleTestAPI}
            disabled={isLoading}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? '🔄 Testing...' : '🧪 Test Gemini API'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>

          <button
            onClick={() => setShowAudioSettings(true)}
            className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="relative z-10 flex items-center gap-2">
              ⚙️ Audio Settings
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>

          <button
            onClick={toggleDarkMode}
            className="group relative px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="relative z-10 flex items-center gap-2">
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl text-center shadow-lg transform transition-all duration-300 ${
            error.includes('✅') 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 dark:from-green-900 dark:to-emerald-900 dark:text-green-200 dark:border-green-700' 
              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 dark:from-red-900 dark:to-pink-900 dark:text-red-200 dark:border-red-700'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">{error.includes('✅') ? '🎉' : '⚠️'}</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Input Form */}
          <div className={`backdrop-blur-sm rounded-2xl shadow-xl border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800/80 border-gray-700/20' 
              : 'bg-white/80 border-white/20'
          } p-6`}>
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} darkMode={darkMode} />
          </div>

          {/* Results */}
          {roast && (
            <div className="space-y-6 animate-fadeIn">
              <RoastOutput roast={roast} roastLevel={currentRoastLevel} darkMode={darkMode} />
              <MemeDisplay meme={meme} darkMode={darkMode} />
            </div>
          )}

          {/* History */}
          <HistoryView history={history} darkMode={darkMode} />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 mb-6">
          <p className={`text-sm transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Built with ❤️ for the Google Hackathon | Powered by Gemini AI
          </p>
        </div>
      </div>

      {/* Audio Settings Modal */}
      <AudioSettings 
        isOpen={showAudioSettings} 
        onClose={() => setShowAudioSettings(false)} 
        darkMode={darkMode}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`rounded-2xl p-8 shadow-2xl text-center transition-colors duration-300 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
            <h3 className={`text-xl font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>🔥 Roasting in Progress...</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              AI is analyzing your content and preparing the perfect roast!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 