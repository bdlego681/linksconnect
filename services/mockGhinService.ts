// This service simulates fetching data from the GHIN network
// Since we don't have a real GHIN API key, we simulate the delay and return realistic data

export const fetchGhinData = async (ghinNumber: string): Promise<{ handicap: number; name: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ghinNumber.length < 5) {
        reject(new Error("Invalid GHIN Number"));
        return;
      }
      
      // Deterministic "random" handicap based on the number so it feels consistent
      const num = parseInt(ghinNumber.replace(/\D/g, '').substring(0, 5)) || 12345;
      const rawHandicap = (num % 360) / 10; // 0.0 to 36.0
      const handicap = Math.round(rawHandicap * 10) / 10;
      
      // Fake name generator if needed, but usually we just want the handicap
      resolve({
        handicap: handicap,
        name: `Golfer #${ghinNumber}`
      });
    }, 1500); // 1.5s delay to simulate network request
  });
};
