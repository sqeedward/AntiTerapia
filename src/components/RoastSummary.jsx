import React from 'react';

function RoastSummary({ tip, lookScore, productivityScore, roastScore, beautifiedPhoto }) {
  // Generate motivational message based on scores
  const getMotivationalMessage = () => {
    const avgScore = (lookScore + productivityScore + roastScore) / 3;
    
    if (avgScore >= 8) {
      return {
        message: "🌟 You're absolutely crushing it! Keep that energy up!",
        emoji: "🚀",
        color: "text-green-300"
      };
    } else if (avgScore >= 6) {
      return {
        message: "💪 You've got potential! Small steps lead to big changes!",
        emoji: "⭐",
        color: "text-yellow-300"
      };
    } else {
      return {
        message: "🔥 Every expert was once a beginner. Your comeback story starts now!",
        emoji: "💎",
        color: "text-orange-300"
      };
    }
  };

  const motivation = getMotivationalMessage();

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700 mt-4">
      {beautifiedPhoto && (
        <div className="flex justify-center mb-4">
          <img src={beautifiedPhoto} alt="Beautified with Google Merch" className="max-h-48 rounded-lg border border-gray-600 shadow" />
        </div>
      )}
      {tip && (
        <div className="mb-4 text-green-300 text-center italic">
          💡 Reverse Psychology Tip: {tip}
        </div>
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
      
      {/* Motivational Section */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg border border-gray-600">
        <div className="text-center">
          <div className={`text-lg font-semibold mb-2 ${motivation.color}`}>
            {motivation.emoji} Motivational Boost {motivation.emoji}
          </div>
          <div className={`text-sm ${motivation.color} mb-3`}>
            {motivation.message}
          </div>
          <div className="text-xs text-gray-400 italic">
            Remember: The best revenge is massive success! 💪✨
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoastSummary;
