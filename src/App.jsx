import { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import RoastOutput from './components/RoastOutput';
import RoastSummary from './components/RoastSummary';
import HistoryView from './components/HistoryView';
import AudioSettings from './components/AudioSettings';
import { getRoast, testGeminiConnection } from './utils/geminiApi';
import { suggestMemes, memeDatabase } from './utils/memeDatabase';

function App() {
  const [roast, setRoast] = useState(null);
  const [meme, setMeme] = useState(null);
  const [memeName, setMemeName] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRoastLevel, setCurrentRoastLevel] = useState('Medium');
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [summary, setSummary] = useState({ tip: '', lookScore: '', productivityScore: '', roastScore: '' });

  // Always enable dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleSubmit = async (input, roastLevel, noGoTopics) => {
    setIsLoading(true);
    setError(null);
    setCurrentRoastLevel(roastLevel);
    setPhoto(input.photo || null);
    try {
      const response = await getRoast(input, roastLevel, noGoTopics, history);
      setRoast(response.textRoast);
      setMeme(response.meme);
      setHistory([...history, { input, output: response }]);
      // Meme selection based on feeling of prompt/roast
      const content = input.text || response.textRoast || '';
      const memeSuggestions = suggestMemes(content, roastLevel);
      setMemeName(memeSuggestions.length > 0 ? memeSuggestions[0] : null);
      // --- AI PROMPT GENERATION PLACEHOLDER ---
      // Replace the following with your AI backend call to generate these values:
      setSummary({
        tip: 'Remember to take breaks and drink water!',
        lookScore: '8/10',
        productivityScore: '7/10',
        roastScore: '🔥 9/10',
      });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      <div className="relative z-10 flex flex-col flex-1 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-4 mt-4">
          <div className="inline-block">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-2 animate-pulse">
              🔥 AntiTerapia 🔥
            </h1>
            <div className="h-1 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 rounded-full"></div>
          </div>
          <p className="mt-2 text-base font-medium text-gray-300">
            Let AI roast your life with savage humor, memes, and audio!
          </p>
        </div>
        {/* Error Display */}
        {error && (
          <div className="mb-2 p-2 rounded-xl text-center shadow-lg bg-gradient-to-r from-red-900 to-pink-900 text-red-200 border border-red-700">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">{error.includes('✅') ? '🎉' : '⚠️'}</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
        {/* Output/History Scrollable Area */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-gray-900/80 border border-gray-800 p-4 mb-2 shadow-inner">
          {/* Results */}
          {(roast || photo) && (
            <div className="space-y-4 animate-fadeIn">
              {photo && (
                <div className="flex justify-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Uploaded or captured"
                    className="max-h-64 rounded-xl border border-gray-700 shadow-lg object-contain bg-black"
                  />
                </div>
              )}
              {roast && <RoastOutput roast={roast} roastLevel={currentRoastLevel} darkMode={true} audioUrl={meme && meme.audioUrl ? meme.audioUrl : (typeof roast === 'object' && roast.audioUrl ? roast.audioUrl : null)} />}
              {/* Meme from database based on feeling */}
              {memeName && (
                <div className="flex flex-col items-center my-4">
                  <img
                    src={memeDatabase[memeName].file}
                    alt={memeDatabase[memeName].description}
                    className="max-h-48 rounded-lg border border-gray-600 shadow mb-2"
                  />
                  <div className="text-gray-300 text-sm italic">{memeDatabase[memeName].description}</div>
                </div>
              )}
              <RoastSummary tip={summary.tip} lookScore={summary.lookScore} productivityScore={summary.productivityScore} roastScore={summary.roastScore} />
            </div>
          )}
          {/* History */}
          <HistoryView history={history} darkMode={true} />
        </div>
        {/* Control Buttons */}
        <div className="flex flex-row gap-2 justify-center items-center mb-2">
          <button 
            onClick={handleTestAPI}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow hover:scale-105 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '🔄 Testing...' : '🧪 Test Gemini API'}
          </button>
          <button
            onClick={() => setShowSettings((prev) => !prev)}
            className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full font-semibold shadow hover:scale-105 transition-all duration-200 text-sm"
          >
            ⚙️ Settings
          </button>
        </div>
        {/* Collapsible Settings Panel */}
        {showSettings && (
          <div className="mb-2 p-4 rounded-2xl shadow-xl border bg-gray-900/90 border-gray-700 animate-fadeIn"> 
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <button
                onClick={() => setShowAudioSettings(true)}
                className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-semibold shadow hover:scale-105 transition-all duration-200"
              >
                🎵 Audio Settings
              </button>
            </div>
          </div>
        )}
        {/* Footer */}
        <div className="text-center mt-2 mb-2">
          <p className="text-xs text-gray-500">
            Built with ❤️ for the Google Hackathon | Powered by Gemini AI
          </p>
        </div>
      </div>
      {/* Fixed Bottom Input Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-950/95 border-t border-gray-800 shadow-2xl z-50 py-3">
        <div className="max-w-4xl mx-auto px-2">
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
      {/* Audio Settings Modal */}
      <AudioSettings 
        isOpen={showAudioSettings} 
        onClose={() => setShowAudioSettings(false)} 
        darkMode={true}
      />
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-2xl p-8 shadow-2xl text-center bg-gray-800 text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2 text-white">🔥 Roasting in Progress...</h3>
            <p className="text-gray-300">
              AI is analyzing your content and preparing the perfect roast!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;