import React from 'react';
import { Wallet } from 'lucide-react';

interface ConnectWalletProps {
  onConnect: () => void;
  isConnected: boolean;
  account?: string;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  onConnect,
  isConnected,
  account,
}) => {
  return (
    <button
      onClick={onConnect}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
    >
      <Wallet size={20} />
      {isConnected
        ? `${account?.slice(0, 6)}...${account?.slice(-4)}`
        : 'Connect Wallet'}
    </button>
  );
};