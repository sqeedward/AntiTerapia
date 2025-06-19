import { useState } from 'react';
import InputForm from './components/InputForm';
import RoastOutput from './components/RoastOutput';
import MemeDisplay from './components/MemeDisplay';
import HistoryView from './components/HistoryView';
import { getRoast } from './utils/geminiApi';

function App() {
  const [roast, setRoast] = useState(null);
  const [meme, setMeme] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (input, roastLevel, noGoTopics) => {
    const response = await getRoast(input, roastLevel, noGoTopics, history);
    setRoast(response.textRoast);
    setMeme(response.meme);
    setHistory([...history, { input, output: response }]); 
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center">RoastMyLife</h1>
      <InputForm onSubmit={handleSubmit} />
      <RoastOutput roast={roast} />
      <MemeDisplay meme={meme} />
      <HistoryView history={history} />
    </div>
  );
}

export default App; 