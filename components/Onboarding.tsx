import React, { useState } from 'react';
import { GolferProfile } from '../types';
import { fetchGhinData } from '../services/mockGhinService';
import { enhanceBio } from '../services/geminiService';
import { MapPin, Check, Loader2, Wand2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: GolferProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  
  const [formData, setFormData] = useState<Partial<GolferProfile>>({
    name: '',
    location: '',
    homeCourse: '',
    ghinNumber: '',
    handicap: 0,
    bio: '',
    playStyle: 'Weekend Warrior',
  });

  const handleGhinImport = async () => {
    if (!formData.ghinNumber) return;
    setLoading(true);
    try {
      const data = await fetchGhinData(formData.ghinNumber);
      setFormData(prev => ({ ...prev, handicap: data.handicap }));
    } catch (e) {
      alert("Could not find GHIN number. Please enter handicap manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceBio = async () => {
    if (!formData.bio || !formData.playStyle) return;
    setEnhancing(true);
    try {
      const newBio = await enhanceBio(formData.bio, formData.playStyle);
      setFormData(prev => ({ ...prev, bio: newBio }));
    } catch (e) {
      console.error(e);
    } finally {
      setEnhancing(false);
    }
  };

  const handleFinish = () => {
    if (formData.name && formData.location) {
      onComplete({
        id: crypto.randomUUID(),
        name: formData.name,
        age: 30, // Default for onboarding simplification
        location: formData.location,
        homeCourse: formData.homeCourse || 'Public Links',
        handicap: formData.handicap || 0,
        bio: formData.bio || 'Ready to play!',
        playStyle: formData.playStyle as any,
        ghinNumber: formData.ghinNumber,
        avatarUrl: `https://picsum.photos/seed/${formData.name}/200/200`
      });
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-6 flex flex-col justify-center max-w-md mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-800">LinksConnect</h1>
          <p className="text-emerald-600">Find your perfect playing partner</p>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-semibold text-gray-800">Let's get to know you</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Tiger Woods"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location (City, State)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input 
                  type="text" 
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="San Diego, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Home Course</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Torrey Pines"
                value={formData.homeCourse}
                onChange={(e) => setFormData({...formData, homeCourse: e.target.value})}
              />
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.location}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Handicap & GHIN */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-semibold text-gray-800">Golf Details</h2>

            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <label className="block text-sm font-medium text-emerald-800 mb-1">GHIN Number (Optional)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="1234567"
                  value={formData.ghinNumber}
                  onChange={(e) => setFormData({...formData, ghinNumber: e.target.value})}
                />
                <button 
                  onClick={handleGhinImport}
                  disabled={loading || !formData.ghinNumber}
                  className="bg-emerald-600 text-white px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                >
                  {loading ? <Loader2 className="animate-spin" size={20}/> : 'Import'}
                </button>
              </div>
              <p className="text-xs text-emerald-600 mt-2">
                We'll verify your handicap directly from the USGA GHIN network.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Handicap Index</label>
              <input 
                type="number" 
                step="0.1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.handicap}
                onChange={(e) => setFormData({...formData, handicap: parseFloat(e.target.value)})}
              />
            </div>
            
             <div className="flex gap-3 mt-6">
               <button 
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Bio & Persona */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <h2 className="text-xl font-semibold text-gray-800">Your Persona</h2>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Play Style</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                value={formData.playStyle}
                onChange={(e) => setFormData({...formData, playStyle: e.target.value as any})}
              >
                <option value="Casual">Casual (Here for the beer)</option>
                <option value="Weekend Warrior">Weekend Warrior</option>
                <option value="Competitive">Competitive</option>
                <option value="Pro">Pro / Scratch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <div className="relative">
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none"
                  placeholder="Tell others about your game..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
                <button
                  onClick={handleEnhanceBio}
                  disabled={enhancing || !formData.bio}
                  className="absolute bottom-3 right-3 p-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors"
                  title="Enhance with AI"
                >
                  {enhancing ? <Loader2 className="animate-spin" size={16}/> : <Wand2 size={16}/>}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Tap the wand to let AI polish your bio.</p>
            </div>

            <button 
              onClick={handleFinish}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors mt-4 flex items-center justify-center gap-2"
            >
              Complete Profile <Check size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
