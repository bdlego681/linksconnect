import React, { useEffect, useState } from 'react';
import { GolferProfile } from '../types';
import { generateLocalGolfers } from '../services/geminiService';
import { MapPin, Navigation, MessageCircle, UserPlus, Loader, Filter, ArrowUp, ArrowDown } from 'lucide-react';

interface FeedProps {
  userProfile: GolferProfile;
}

type FilterRange = 'all' | 'low' | 'mid' | 'high';
type SortOrder = 'asc' | 'desc';

export const Feed: React.FC<FeedProps> = ({ userProfile }) => {
  const [profiles, setProfiles] = useState<GolferProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRange, setFilterRange] = useState<FilterRange>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    let isMounted = true;
    const loadProfiles = async () => {
      setLoading(true);
      try {
        // Fetch more profiles (10) to make filtering more effective
        const data = await generateLocalGolfers(userProfile.location, 10);
        if (isMounted) {
          setProfiles(data);
        }
      } catch (error) {
        console.error("Failed to load feed", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProfiles();
    return () => { isMounted = false; };
  }, [userProfile.location]);

  const displayedProfiles = profiles
    .filter(p => {
      if (filterRange === 'low') return p.handicap < 10;
      if (filterRange === 'mid') return p.handicap >= 10 && p.handicap < 20;
      if (filterRange === 'high') return p.handicap >= 20;
      return true;
    })
    .sort((a, b) => {
      return sortOrder === 'asc' ? a.handicap - b.handicap : b.handicap - a.handicap;
    });

  const formatHandicap = (hcp: number) => {
    // In data, better than scratch is usually negative. In display, it's "+".
    // Normal handicaps are positive.
    if (hcp < 0) return `+${Math.abs(hcp)}`;
    return hcp.toString();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-emerald-600">
        <Loader className="animate-spin mb-4" size={48} />
        <p className="text-lg font-medium">Scouting the course for players...</p>
      </div>
    );
  }

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Nearby Golfers</h2>
        <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <MapPin size={14} />
          {userProfile.location}
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="mb-6 flex items-center justify-between gap-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 flex-1">
           <button 
             onClick={() => setFilterRange('all')}
             className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
               filterRange === 'all' 
                 ? 'bg-emerald-600 text-white shadow-sm' 
                 : 'bg-white text-gray-600 border border-gray-200'
             }`}
           >
             All
           </button>
           <button 
             onClick={() => setFilterRange('low')}
             className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
               filterRange === 'low' 
                 ? 'bg-emerald-600 text-white shadow-sm' 
                 : 'bg-white text-gray-600 border border-gray-200'
             }`}
           >
             Low (&lt;10)
           </button>
           <button 
             onClick={() => setFilterRange('mid')}
             className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
               filterRange === 'mid' 
                 ? 'bg-emerald-600 text-white shadow-sm' 
                 : 'bg-white text-gray-600 border border-gray-200'
             }`}
           >
             Mid (10-20)
           </button>
           <button 
             onClick={() => setFilterRange('high')}
             className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
               filterRange === 'high' 
                 ? 'bg-emerald-600 text-white shadow-sm' 
                 : 'bg-white text-gray-600 border border-gray-200'
             }`}
           >
             High (20+)
           </button>
        </div>

        <button 
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-1 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50 shrink-0"
        >
          HCP 
          {sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        </button>
      </div>

      <div className="space-y-6">
        {displayedProfiles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Filter className="mx-auto mb-2 opacity-20" size={48} />
            <p>No golfers found in this range.</p>
            <button 
              onClick={() => setFilterRange('all')}
              className="text-emerald-600 font-medium mt-2 text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          displayedProfiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex p-4">
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{profile.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                         <Navigation size={12} /> {profile.homeCourse}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-sm font-bold border ${
                      profile.handicap < 10 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : profile.handicap < 20 
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-orange-50 text-orange-700 border-orange-100'
                    }`}>
                      {formatHandicap(profile.handicap)} HCP
                    </span>
                  </div>
                  
                  <div className="mt-2 flex gap-2">
                     <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                       {profile.playStyle}
                     </span>
                  </div>
                </div>
              </div>
              
              <div className="px-4 pb-3">
                 <p className="text-gray-600 text-sm italic">"{profile.bio}"</p>
              </div>

              <div className="bg-gray-50 p-3 flex gap-3 border-t border-gray-100">
                <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <UserPlus size={16} /> Connect
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={16} /> Message
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};