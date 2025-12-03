import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only if the key exists
const getAiClient = () => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getUnlockResistanceMessage = async (): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Focus is the key to freedom.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a short, sharp, 'tough love' sentence (max 15 words) convincing the user NOT to unlock their phone and to keep working. Be harsh but motivating.",
      config: {
        temperature: 1.2,
      }
    });
    return response.text || "Don't give up on your goals now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Discipline equals freedom.";
  }
};

export const getLockedStatusMessage = async (): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "DEVICE LOCKED";
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Generate a very short, robotic, cyberpunk-style status message (max 5 words) indicating the device is locked for focus.",
      });
      return response.text?.toUpperCase() || "SYSTEM LOCKED";
    } catch (error) {
      return "ACCESS DENIED";
    }
  };
