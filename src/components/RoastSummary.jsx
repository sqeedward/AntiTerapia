import React from 'react';

function RoastSummary({ tip, lookScore, productivityScore, roastScore, beautifiedPhoto }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700 mt-4">
      {beautifiedPhoto && (
        <div className="flex justify-center mb-4">
          <img src={beautifiedPhoto} alt="Beautified with Google Merch" className="max-h-48 rounded-lg border border-gray-600 shadow" />
        </div>
      )}
      {tip && (
        <div className="mb-4 text-green-300 text-center italic">💡 Quick Tip: {tip}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-2">
        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">How you look today</div>
          <div className="text-2xl font-bold text-blue-300">{lookScore}</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Productivity</div>
          <div className="text-2xl font-bold text-purple-300">{productivityScore}</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Roast Score</div>
          <div className="text-2xl font-bold text-red-300">{roastScore}</div>
        </div>
      </div>
    </div>
  );
}

export default RoastSummary;
