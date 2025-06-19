import { useState } from 'react';

function HistoryView({ history, darkMode = false }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) return null;

  const displayedHistory = isExpanded ? history : history.slice(-3);

  return (
    <div className={`rounded-2xl shadow-2xl border overflow-hidden transform transition-all duration-300 hover:shadow-3xl ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
        : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h2 className="text-2xl font-bold">Roast History</h2>
              <p className="text-purple-100 text-sm">{history.length} roasts generated</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl">🔥</div>
          </div>
        </div>
      </div>

      {/* History Content */}
      <div className="p-6">
        <div className="space-y-4">
          {displayedHistory.map((entry, index) => (
            <div 
              key={index} 
              className={`rounded-xl p-4 shadow-lg border transform transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">#{history.length - index}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {entry.input.text ? 'Text' : ''}
                    {entry.input.photo ? (entry.input.text ? ' + ' : '') + 'Photo' : ''}
                    {entry.input.audio ? (entry.input.text || entry.input.photo ? ' + ' : '') + 'Audio' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                    {entry.output?.meme?.template?.replace(/_/g, ' ') || 'Meme'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {/* Input Summary */}
                {entry.input.text && (
                  <div className={`rounded-lg p-3 transition-colors duration-300 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <p className={`text-sm line-clamp-2 transition-colors duration-300 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <span className="font-medium">Input:</span> {entry.input.text}
                    </p>
                  </div>
                )}
                
                {/* Roast Preview */}
                <div className={`rounded-lg p-3 border-l-4 border-red-400 transition-colors duration-300 ${
                  darkMode ? 'bg-red-900/20' : 'bg-red-50'
                }`}>
                  <p className={`text-sm line-clamp-3 transition-colors duration-300 ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    <span className="font-medium text-red-700">Roast:</span> {entry.output?.textRoast || 'No roast available'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        {history.length > 3 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                {isExpanded ? '👆 Show Less' : '👇 Show All'}
                <span className="text-sm">
                  ({isExpanded ? '3' : history.length} of {history.length})
                </span>
              </span>
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-lg p-4 text-center shadow-md border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="text-2xl font-bold text-purple-600">{history.length}</div>
            <div className={`text-sm transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Total Roasts</div>
          </div>
          <div className={`rounded-lg p-4 text-center shadow-md border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="text-2xl font-bold text-red-600">
              {history.filter(h => h.input.photo).length}
            </div>
            <div className={`text-sm transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>With Photos</div>
          </div>
          <div className={`rounded-lg p-4 text-center shadow-md border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="text-2xl font-bold text-blue-600">
              {history.filter(h => h.input.audio).length}
            </div>
            <div className={`text-sm transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>With Audio</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryView; 