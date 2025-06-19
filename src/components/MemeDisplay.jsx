function MemeDisplay({ meme, darkMode = false }) {
  if (!meme) return null;

  // Get the meme image URL
  const memeUrl = meme.file || `/placeholder.jpg`;
  
  return (
    <div className={`rounded-2xl shadow-2xl border overflow-hidden transform transition-all duration-300 hover:shadow-3xl ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
        : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎭</span>
            <div>
              <h2 className="text-2xl font-bold">Meme of the Moment</h2>
              <p className="text-yellow-100 text-sm">AI-selected based on your roast</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl">😂</div>
          </div>
        </div>
      </div>

      {/* Meme Content */}
      <div className="p-6">
        <div className="flex flex-col items-center">
          {/* Meme Image Container */}
          <div className="relative max-w-sm w-full group">
            <div className="relative overflow-hidden rounded-xl shadow-2xl transform transition-all duration-300 group-hover:scale-105">
              <img 
                src={memeUrl} 
                alt={meme.template} 
                className="w-full h-auto border-2 border-gray-200"
                onError={(e) => {
                  e.target.src = '/crying.jpg'; // Fallback to crying meme
                  console.log('Meme image failed to load, using fallback');
                }}
              />
              
              {/* Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                <p className="text-center font-bold text-white text-lg leading-tight drop-shadow-lg">
                  "{meme.caption}"
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          
          {/* Meme Info */}
          <div className="mt-6 text-center">
            <div className={`rounded-xl p-4 shadow-lg border transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg">🎯</span>
                <h3 className={`font-bold text-lg transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {meme.template.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
              </div>
              <p className={`text-sm mb-3 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                AI-generated caption based on your roast content
              </p>
              <div className={`flex items-center justify-center gap-4 text-xs transition-colors duration-300 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                <span>🤖 AI Selected</span>
                <span>•</span>
                <span>🎨 Custom Caption</span>
                <span>•</span>
                <span>🔥 Perfect Match</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemeDisplay; 