import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const LeaderBoard = () => {
  const { data: leaderboardData = [] } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await axios.get("/leaderboard.json");
      return res.data;
    }
  });

  const topThree = leaderboardData.slice(0, 3);
  const remainingPlayers = leaderboardData.slice(3);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 text-hair-color">
      <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12">Leaderboard</h2>
      
      {/* Top 3 Players */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {topThree.map((player) => (
          <div
            key={player._id}
            className="relative bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-hair-color font-bold
                ${player.rank === 1 ? 'bg-yellow-400' : 
                  player.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'}`}>
                {player.rank}
              </div>
            </div>
            <img
              src={player.image}
              alt={player.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-hair-color"
            />
            <h3 className="text-xl font-bold text-hair-color mb-2">{player.name}</h3>
            <p className="text-gray-600">Score: {player.score}</p>
          </div>
        ))}
      </div>

      {/* Remaining Players */}
      <div className="space-y-4">
        {remainingPlayers.map((player) => (
          <div
            key={player._id}
            className="bg-white rounded-lg shadow p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-hair-color">
                {player.rank}
              </span>
              <img
                src={player.image}
                alt={player.name}
                className="w-12 h-12 rounded-full"
              />
              <h3 className="font-semibold text-hair-color">{player.name}</h3>
            </div>
            <p className="font-bold text-hair-color">Score: {player.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderBoard;
