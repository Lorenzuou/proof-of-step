import React, { useState } from 'react';
import { Footprints } from 'lucide-react';

interface StepInputProps {
  onSubmit: (steps: number) => void;
  isRegistered: boolean;
}

export const StepInput: React.FC<StepInputProps> = ({
  onSubmit,
  isRegistered,
}) => {
  const [steps, setSteps] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stepsNumber = parseInt(steps);
    if (stepsNumber > 0) {
      onSubmit(stepsNumber);
      setSteps('');
    }
  };

  if (!isRegistered) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
    >
      <div className="flex items-center gap-2">
        <Footprints className="text-purple-600" size={24} />
        <h2 className="text-2xl font-bold">Record Steps</h2>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          min="1"
          placeholder="Enter number of steps"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </form>
  );
};