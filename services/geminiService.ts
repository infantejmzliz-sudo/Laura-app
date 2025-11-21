import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard, StudyGuide, FlashcardResponseItem, StudyGuideResponse } from "../types";

const MODEL_FLASH = "gemini-2.5-flash";

// Helper to get AI instance
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Chat with the AI Tutor
 */
export const streamChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: MODEL_FLASH,
    history: history,
    config: {
      systemInstruction: "Eres un tutor universitario experto. Tu prioridad es dar explicaciones breves, concisas y fáciles de entender. SIEMPRE utiliza analogías con la vida cotidiana (como cocina, deportes, tráfico) para explicar conceptos abstractos o complejos. Evita explicaciones largas o demasiado técnicas. Responde siempre en español. Utiliza formato Markdown.",
    },
  });

  return chat.sendMessageStream({ message: newMessage });
};

/**
 * Generate Flashcards from notes or topic
 */
export const generateFlashcardsFromText = async (text: string): Promise<Flashcard[]> => {
  const ai = getAI();
  
  const prompt = `Crea un set de tarjetas de estudio (flashcards) basadas en el siguiente texto o tema: "${text}".
  Genera entre 5 y 10 tarjetas.
  IMPORTANTE: Las preguntas deben ser claras. Las respuestas deben ser MUY CORTAS y DIRECTAS. Usa analogías simples en las respuestas para ayudar a la memoria.`;

  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            pregunta: { type: Type.STRING },
            respuesta: { type: Type.STRING },
          },
        },
      },
    },
  });

  const rawData = JSON.parse(response.text || "[]") as FlashcardResponseItem[];
  
  return rawData.map(item => ({
    front: item.pregunta,
    back: item.respuesta
  }));
};

/**
 * Generate Study Guide from notes
 */
export const generateStudyGuideFromNotes = async (notes: string): Promise<StudyGuide> => {
  const ai = getAI();

  const prompt = `Actúa como un experto en pedagogía. Crea una guía de estudio estructurada basada en las siguientes notas: "${notes}".
  Organiza la información en secciones lógicas. 
  REGLA CLAVE: Los puntos clave deben ser breves y sencillos. Utiliza analogías para explicar los conceptos más difíciles.`;

  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tema: { type: Type.STRING, description: "El tema principal de las notas" },
          secciones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                titulo: { type: Type.STRING, description: "Título de la sección" },
                puntos_clave: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Lista de conceptos explicados brevemente y con analogías"
                }
              }
            }
          }
        }
      }
    }
  });

  const rawData = JSON.parse(response.text || "{}") as StudyGuideResponse;

  return {
    topic: rawData.tema || "Guía de Estudio",
    sections: rawData.secciones?.map(s => ({
      title: s.titulo,
      content: s.puntos_clave
    })) || []
  };
};