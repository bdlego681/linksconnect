export interface GolferProfile {
  id: string;
  name: string;
  age: number;
  handicap: number;
  location: string;
  homeCourse: string;
  bio: string;
  avatarUrl?: string;
  ghinNumber?: string;
  playStyle?: 'Casual' | 'Competitive' | 'Weekend Warrior' | 'Pro';
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  FEED = 'FEED',
  PROFILE = 'PROFILE',
  MESSAGES = 'MESSAGES'
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}
