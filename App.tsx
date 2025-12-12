import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Feed } from './components/Feed';
import { Profile } from './components/Profile';
import { Navigation } from './components/Navigation';
import { AppView, GolferProfile } from './types';
import { MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<GolferProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.ONBOARDING);

  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('linksconnect_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentView(AppView.FEED);
    }
  }, []);

  const handleOnboardingComplete = (profile: GolferProfile) => {
    setCurrentUser(profile);
    localStorage.setItem('linksconnect_user', JSON.stringify(profile));
    setCurrentView(AppView.FEED);
  };

  const handleLogout = () => {
    localStorage.removeItem('linksconnect_user');
    setCurrentUser(null);
    setCurrentView(AppView.ONBOARDING);
  };

  const renderContent = () => {
    if (!currentUser) return <Onboarding onComplete={handleOnboardingComplete} />;

    switch (currentView) {
      case AppView.FEED:
        return <Feed userProfile={currentUser} />;
      case AppView.PROFILE:
        return <Profile profile={currentUser} onLogout={handleLogout} />;
      case AppView.MESSAGES:
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
            <div className="bg-white p-6 rounded-full shadow-md mb-4">
              <MessageCircle size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No messages yet</h2>
            <p className="text-gray-500">Connect with golfers in the Feed to start a conversation!</p>
          </div>
        );
      default:
        return <Feed userProfile={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {renderContent()}
      
      {/* Show navigation only if logged in */}
      {currentUser && (
        <Navigation 
          currentView={currentView} 
          onChangeView={setCurrentView} 
        />
      )}
    </div>
  );
};

export default App;
