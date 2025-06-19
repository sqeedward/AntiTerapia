import { useState } from 'react';
import InputForm from './components/InputForm';
import RoastOutput from './components/RoastOutput';
import MemeDisplay from './components/MemeDisplay';
import HistoryView from './components/HistoryView';
import { getRoast, testGeminiConnection } from './utils/geminiApi';

function App() {
  const [roast, setRoast] = useState(null);
  const [meme, setMeme] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (input, roastLevel, noGoTopics) => {
    setIsLoading(true);
    setError(null);
    
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
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">🔥 RoastMyLife 🔥</h1>
      
      {/* API Test Button */}
      <div className="text-center mb-4">
        <button 
          onClick={handleTestAPI}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Gemini API'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className={`mb-4 p-3 rounded text-center ${
          error.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {error}
        </div>
      )}

      <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      <RoastOutput roast={roast} />
      <MemeDisplay meme={meme} />
      <HistoryView history={history} />
    </div>
  );
}

export default App; 