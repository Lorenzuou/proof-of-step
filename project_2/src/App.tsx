import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Toaster, toast } from 'react-hot-toast';
import { ConnectWallet } from './components/ConnectWallet';
import { LeaderBoard } from './components/LeaderBoard';
import { StepInput } from './components/StepInput';
import { Trophy } from 'lucide-react';
import type { Participant } from './contracts/types';

// Note: Replace these with your actual contract addresses and ABIs
const FACTORY_ADDRESS = 'YOUR_FACTORY_CONTRACT_ADDRESS';
const COMPETITION_ADDRESS = 'YOUR_COMPETITION_CONTRACT_ADDRESS';

function App() {
  const [account, setAccount] = useState<string>();
  const [isRegistered, setIsRegistered] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        checkRegistration(accounts[0]);
      } else {
        toast.error('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const checkRegistration = async (address: string) => {
    try {
      // Implementation needed: Check if user is registered
      // This would involve calling the contract
      setIsRegistered(false); // Placeholder
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const registerUser = async () => {
    try {
      // Implementation needed: Register user in the contract
      toast.success('Successfully registered!');
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Failed to register');
    }
  };

  const submitSteps = async (steps: number) => {
    try {
      // Implementation needed: Submit steps to the contract
      toast.success(`Successfully recorded ${steps} steps!`);
    } catch (error) {
      console.error('Error submitting steps:', error);
      toast.error('Failed to submit steps');
    }
  };

  useEffect(() => {
    // Implementation needed: Listen for contract events
    // Update participants when new steps are registered
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="text-purple-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">
              Step Competition
            </h1>
          </div>
          <ConnectWallet
            onConnect={connectWallet}
            isConnected={!!account}
            account={account}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          {account && !isRegistered && (
            <button
              onClick={registerUser}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Register for Competition
            </button>
          )}

          <StepInput onSubmit={submitSteps} isRegistered={isRegistered} />
          <LeaderBoard participants={participants} />
        </div>
      </main>
    </div>
  );
}

export default App;