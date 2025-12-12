import React from 'react';
import { GolferProfile } from '../types';
import { MapPin, Award, Activity, Settings, LogOut } from 'lucide-react';

interface ProfileProps {
  profile: GolferProfile;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onLogout }) => {
  const formatHandicap = (hcp: number) => {
    if (hcp < 0) return `+${Math.abs(hcp)}`;
    return hcp.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header / Cover */}
      <div className="bg-emerald-600 h-40 relative">
        <div className="absolute top-4 right-4">
          <button onClick={onLogout} className="p-2 bg-emerald-700 rounded-full text-white hover:bg-emerald-800 transition">
             <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="px-4 -mt-16 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="relative inline-block">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-32 h-32 rounded-full border-4 border-white shadow-md mx-auto object-cover"
            />
             <div className="absolute bottom-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
               {formatHandicap(profile.handicap)}
             </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mt-3">{profile.name}</h1>
          <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-1">
            <MapPin size={14} /> {profile.location}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4">
             <div className="text-center">
               <p className="text-gray-500 text-xs uppercase tracking-wider">Play Style</p>
               <p className="font-semibold text-emerald-700">{profile.playStyle}</p>
             </div>
             <div className="text-center border-l border-gray-100">
               <p className="text-gray-500 text-xs uppercase tracking-wider">Home Course</p>
               <p className="font-semibold text-gray-800 truncate px-2">{profile.homeCourse}</p>
             </div>
          </div>

          <div className="mt-4 text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Stats / Extras */}
        <div className="mt-6 space-y-4">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">GHIN Status</h4>
                  <p className="text-xs text-gray-500">Connected: {profile.ghinNumber || 'N/A'}</p>
                </div>
              </div>
              <span className="text-green-500 font-bold text-sm">Active</span>
           </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Recent Rounds</h4>
                  <p className="text-xs text-gray-500">Last played 3 days ago</p>
                </div>
              </div>
              <span className="text-gray-400">
                <Settings size={18} />
              </span>
           </div>
        </div>
      </div>
    </div>
  );
};