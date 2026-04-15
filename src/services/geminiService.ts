import { GoogleGenAI } from "@google/genai";
import { UserProfile, Challenge, GameState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateChallenge(
  profile: UserProfile,
  gameState: GameState
): Promise<Challenge> {
  const isAdventure = profile.mode === 'adventure';
  const adventureContext = isAdventure 
    ? `Estamos em uma aventura do tipo ${profile.adventureType}. A história atual é: ${gameState.currentMission || 'Início da jornada'}.`
    : 'Modo simples, foco direto no exercício.';

  const prompt = `
    Você é um instrutor de um app educacional gamificado.
    Perfil do Usuário:
    - Idade: ${profile.age}
    - Objetivo: ${profile.objective}
    - Nível: ${profile.level}
    - Modo: ${profile.mode}
    ${adventureContext}

    Gere um desafio educacional baseado na BNCC adequado para este perfil.
    Se for modo aventura, integre o desafio na narrativa.
    Se for modo simples, seja direto.

    Retorne APENAS um JSON no seguinte formato:
    {
      "context": "Breve contexto da missão ou do exercício",
      "question": "A pergunta ou desafio",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctAnswer": "A opção correta exatamente como escrita",
      "explanation": "Explicação positiva e simples do porquê desta ser a resposta",
      "reward": {
        "xp": 10,
        "item": "Opcional: nome de um item de recompensa se for aventura"
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || '{}') as Challenge;
  } catch (error) {
    console.error("Error generating challenge:", error);
    // Fallback challenge
    return {
      context: "Um desafio rápido para você!",
      question: "Quanto é 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
      explanation: "2 mais 2 é igual a 4!",
      reward: { xp: 5 }
    };
  }
}

export async function generateStoryIntro(profile: UserProfile): Promise<string> {
  if (profile.mode !== 'adventure') return "";

  const prompt = `
    Crie uma introdução curta e envolvente para uma aventura de aprendizado.
    Tipo: ${profile.adventureType}
    Objetivo: ${profile.objective}
    Idade: ${profile.age}
    
    A história deve motivar o usuário a começar a aprender.
    Máximo 3 parágrafos.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Sua jornada começa agora!";
  } catch (error) {
    return "Sua jornada épica de conhecimento começa hoje!";
  }
}
