function MemeDisplay({ meme }) {
  if (!meme) return null;
  return (
    <div className="my-6 flex flex-col items-center">
      <h2 className="font-bold text-xl mb-2 text-yellow-500">Meme of the Moment</h2>
      <img src={meme.url || `https://via.placeholder.com/400x400?text=${encodeURIComponent(meme.template)}`} alt={meme.template} className="rounded shadow-lg max-w-xs" />
      <div className="mt-2 text-center font-meme text-lg bg-yellow-100 p-2 rounded">
        {meme.caption}
      </div>
    </div>
  );
}

export default MemeDisplay; 