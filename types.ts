export enum ViewState {
  CHAT = 'CHAT',
  GUIDE = 'GUIDE',
  FLASHCARDS = 'FLASHCARDS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface StudyGuideSection {
  title: string;
  content: string[];
}

export interface StudyGuide {
  topic: string;
  sections: StudyGuideSection[];
}

// API Response Types
export interface FlashcardResponseItem {
  pregunta: string;
  respuesta: string;
}

export interface StudyGuideResponse {
  tema: string;
  secciones: {
    titulo: string;
    puntos_clave: string[];
  }[];
}