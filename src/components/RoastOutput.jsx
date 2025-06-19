function RoastOutput({ roast }) {
  if (!roast) return null;
  return (
    <div className="my-6 p-4 bg-white rounded shadow text-lg font-mono border-l-4 border-red-500">
      <h2 className="font-bold text-2xl mb-2 text-red-600">🔥 Your Roast</h2>
      <p className="mb-4">{roast}</p>
      {/* Audio roast playback can be added here in the future */}
    </div>
  );
}

export default RoastOutput; 