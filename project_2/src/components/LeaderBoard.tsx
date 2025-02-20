import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import { Participant } from '../contracts/types';

interface LeaderBoardProps {
  participants: Participant[];
}

export const LeaderBoard: React.FC<LeaderBoardProps> = ({ participants }) => {
  const sortedParticipants = [...participants].sort((a, b) => b.steps - a.steps);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="text-yellow-500" size={24} />
        <h2 className="text-2xl font-bold">Leaderboard</h2>
      </div>
      <div className="space-y-4">
        {sortedParticipants.map((participant, index) => (
          <div
            key={participant.address}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg w-8">#{index + 1}</span>
              {index < 3 && (
                <Medal
                  className={`${
                    index === 0
                      ? 'text-yellow-500'
                      : index === 1
                      ? 'text-gray-400'
                      : 'text-amber-600'
                  }`}
                />
              )}
              <span className="font-medium">
                {participant.address.slice(0, 6)}...
                {participant.address.slice(-4)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-purple-600">
                {participant.steps.toLocaleString()}
              </span>
              <span className="text-gray-500">steps</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};