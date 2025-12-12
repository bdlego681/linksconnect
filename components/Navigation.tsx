import React from 'react';
import { AppView } from '../types';
import { Home, User, MessageCircle } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button
          onClick={() => onChangeView(AppView.FEED)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            currentView === AppView.FEED ? 'text-emerald-600' : 'text-gray-400'
          }`}
        >
          <Home size={24} />
          <span className="text-xs font-medium">Feed</span>
        </button>
        
        <button
          onClick={() => onChangeView(AppView.MESSAGES)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            currentView === AppView.MESSAGES ? 'text-emerald-600' : 'text-gray-400'
          }`}
        >
          <MessageCircle size={24} />
          <span className="text-xs font-medium">Chat</span>
        </button>

        <button
          onClick={() => onChangeView(AppView.PROFILE)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            currentView === AppView.PROFILE ? 'text-emerald-600' : 'text-gray-400'
          }`}
        >
          <User size={24} />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};
