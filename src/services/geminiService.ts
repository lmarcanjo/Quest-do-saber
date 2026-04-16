import { GoogleGenAI } from "@google/genai";
import { UserProfile, Challenge, GameState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const FALLBACK_CHALLENGES: Record<string, Challenge[]> = {
  'Matemática': [
    {
      subject: 'Matemática',
      context: 'Desafio de Lógica',
      question: 'Se um trem sai às 14h e viaja por 3 horas e 45 minutos, a que horas ele chega?',
      options: ['17h15', '17h45', '18h15', '18h45'],
      correctAnswer: '17h45',
      explanation: '14h + 3h = 17h. Adicionando os 45 minutos, temos 17h45.',
      reward: { xp: 15 }
    },
    {
      subject: 'Matemática',
      context: 'Geometria Básica',
      question: 'Quantos lados tem um hexágono?',
      options: ['4', '5', '6', '8'],
      correctAnswer: '6',
      explanation: 'Um hexágono é um polígono de 6 lados.',
      reward: { xp: 15 }
    }
  ],
  'Português': [
    {
      subject: 'Português',
      context: 'Gramática',
      question: 'Qual é o antônimo de "Efêmero"?',
      options: ['Passageiro', 'Duradouro', 'Rápido', 'Curto'],
      correctAnswer: 'Duradouro',
      explanation: 'Efêmero significa algo que dura pouco, seu oposto é duradouro.',
      reward: { xp: 15 }
    }
  ],
  'Geral': [
    {
      subject: 'Geral',
      context: 'Conhecimentos Gerais',
      question: 'Qual é o maior planeta do nosso sistema solar?',
      options: ['Terra', 'Marte', 'Júpiter', 'Saturno'],
      correctAnswer: 'Júpiter',
      explanation: 'Júpiter é o maior planeta, com mais de 11 vezes o diâmetro da Terra.',
      reward: { xp: 15 }
    }
  ]
};

export async function generateChallenge(
  profile: UserProfile,
  gameState: GameState
): Promise<Challenge> {
  const isAdventure = profile.mode === 'adventure';
  const adventureContext = isAdventure 
    ? `Estamos em uma aventura do tipo ${profile.adventureType}. A história atual é: ${gameState.currentMission || 'Início da jornada'}.`
    : 'Modo simples, foco direto no exercício.';

  const recentQuestions = gameState.history.slice(-10).join(' | ');

  const prompt = `
    Você é um instrutor de um app educacional gamificado altamente criativo.
    
    Perfil do Usuário:
    - Idade: ${profile.age}
    - Objetivo: ${profile.objective}
    - Nível: ${profile.level}
    - Matéria Selecionada: ${profile.selectedSubject || 'Geral'}
    - Modo: ${profile.mode}
    ${adventureContext}

    HISTÓRICO DE QUESTÕES RECENTES (EVITE REPETIR TEMAS OU ESTRUTURAS PARECIDAS):
    ${recentQuestions}

    DIRETRIZES DE QUALIDADE:
    1. NÃO use templates repetitivos. Varie a estrutura gramatical.
    2. Use contextos reais e interessantes.
    3. O nível de dificuldade deve ser progressivo baseado no nível ${profile.level} e idade ${profile.age}.
    4. No modo AVENTURA, a pergunta DEVE fazer parte da narrativa.

    Retorne APENAS um JSON no seguinte formato:
    {
      "subject": "${profile.selectedSubject || 'Geral'}",
      "context": "Breve contexto imersivo",
      "question": "A pergunta desafiadora",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctAnswer": "A opção correta exatamente como escrita",
      "explanation": "Explicação pedagógica clara e motivadora",
      "reward": {
        "xp": 15,
        "item": "Opcional: nome de um item temático se for aventura"
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    const challenge = JSON.parse(text) as Challenge;
    if (!challenge.subject) challenge.subject = profile.selectedSubject || 'Geral';
    return challenge;
  } catch (error: any) {
    console.warn("Gemini API limit or error, using fallback:", error?.message);
    
    const subject = profile.selectedSubject || 'Geral';
    const fallbacks = FALLBACK_CHALLENGES[subject] || FALLBACK_CHALLENGES['Geral'];
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    return {
      ...randomFallback,
      context: `[Modo Offline] ${randomFallback.context}`
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
      model: "gemini-flash-latest",
      contents: prompt,
    });
    return response.text || "Sua jornada começa agora!";
  } catch (error) {
    return "Sua jornada épica de conhecimento começa hoje!";
  }
}
