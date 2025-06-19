function HistoryView({ history }) {
  if (!history || history.length === 0) return null;
  return (
    <div className="my-8">
      <h2 className="font-bold text-xl mb-4 text-gray-700">Conversation History</h2>
      <ul className="space-y-4">
        {history.map((entry, idx) => (
          <li key={idx} className="bg-gray-50 p-4 rounded shadow">
            <div className="mb-2 text-gray-600"><strong>Input:</strong> {entry.input.text || '[Photo/Audio]'}</div>
            <div className="text-gray-900"><strong>Roast:</strong> {entry.output.textRoast}</div>
            {entry.output.meme && (
              <div className="mt-2"><strong>Meme:</strong> {entry.output.meme.caption}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryView; 