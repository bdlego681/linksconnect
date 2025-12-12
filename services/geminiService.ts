import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GolferProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Gemini 2.5 Flash for speed and structured JSON output
const MODEL_ID = "gemini-2.5-flash";

export const generateLocalGolfers = async (userLocation: string, count: number = 5): Promise<GolferProfile[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        age: { type: Type.INTEGER },
        handicap: { type: Type.NUMBER },
        location: { type: Type.STRING },
        homeCourse: { type: Type.STRING },
        bio: { type: Type.STRING },
        playStyle: { type: Type.STRING, enum: ['Casual', 'Competitive', 'Weekend Warrior', 'Pro'] }
      },
      required: ['id', 'name', 'age', 'handicap', 'location', 'homeCourse', 'bio', 'playStyle']
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: `Generate ${count} fictional golfer profiles located in or near ${userLocation}. 
      Make them diverse in terms of age (20-60), handicap (-2 to 30), and gender. 
      The bio should be short (1-2 sentences) and golf-focused.
      Ensure the location is realistically close to ${userLocation}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const jsonStr = response.text || "[]";
    const profiles = JSON.parse(jsonStr) as GolferProfile[];
    
    // Augment with random images since AI doesn't generate URLs
    return profiles.map((p, i) => ({
      ...p,
      avatarUrl: `https://picsum.photos/seed/${p.id}/200/200`
    }));

  } catch (error) {
    console.error("Error generating local golfers:", error);
    // Fallback data if API fails
    return [
      {
        id: 'fallback-1',
        name: 'Tiger Woods (Clone)',
        age: 45,
        handicap: 0.0,
        location: userLocation,
        homeCourse: 'Augusta National',
        bio: 'Just looking for a quick 9 holes after work.',
        playStyle: 'Pro',
        avatarUrl: 'https://picsum.photos/200'
      }
    ];
  }
};

export const enhanceBio = async (currentBio: string, playStyle: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: `Rewrite the following golfer bio to be more engaging, witty, and social. 
      The player describes themselves as "${playStyle}".
      Current Bio: "${currentBio}"
      Keep it under 30 words.`,
    });
    return response.text?.trim() || currentBio;
  } catch (error) {
    console.error("Error enhancing bio:", error);
    return currentBio;
  }
};
