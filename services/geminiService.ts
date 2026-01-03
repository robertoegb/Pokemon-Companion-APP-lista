import { GoogleGenAI } from "@google/genai";

// Always initialize with process.env.API_KEY directly
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

export const narrateBattleAction = async (
  attackerName: string,
  moveName: string,
  damageDealt: number,
  isCritical: boolean,
  isFainted: boolean
): Promise<string> => {
  // Prompt for narrating Pokémon battle actions in anime style
  const prompt = `
    Narra brevemente (máximo 15 palabras) una acción de batalla Pokémon estilo anime.
    Atacante: ${attackerName}
    Movimiento: ${moveName}
    Daño: ${damageDealt}
    Critico: ${isCritical}
    Debilitado: ${isFainted}
    Idioma: Español.
    Hazlo emocionante.
  `;

  try {
    // Correct way to call generateContent for text answers
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Access the text property directly (it's not a method)
    const text = response.text;
    return text?.trim() || `${attackerName} ataca con ${moveName}!`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `${attackerName} ataca con ${moveName}!`;
  }
};