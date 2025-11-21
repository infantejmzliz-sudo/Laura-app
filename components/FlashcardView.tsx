import React, { useState } from 'react';
import { Flashcard } from '../types';
import { generateFlashcardsFromText } from '../services/geminiService';
import { IconLayers, IconSparkles, IconRefresh } from './Icons';

const FlashcardItem: React.FC<{ card: Flashcard; index: number }> = ({ card, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group perspective-1000 h-64 w-full cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Pregunta</span>
          <p className="text-lg font-medium text-slate-800">{card.front}</p>
        </div>
        
        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-600 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm text-white">
          <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">Respuesta</span>
          <p className="text-lg font-medium">{card.back}</p>
        </div>
      </div>
    </div>
  );
};

export const FlashcardView: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateFlashcardsFromText(inputText);
      setCards(result);
    } catch (err) {
      setError('Error al generar las tarjetas. Por favor intenta de nuevo con un texto más corto o diferente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCards([]);
    setInputText('');
    setError(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <IconLayers className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Tarjetas de Estudio</h2>
        </div>
        {cards.length > 0 && (
            <button onClick={handleReset} className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                <IconRefresh className="w-4 h-4" />
                Nueva sesión
            </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {cards.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-10 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Generador Automático</h3>
              <p className="text-slate-600 mb-6">Pega tus apuntes, un resumen o simplemente un tema, y la IA creará tarjetas de memoria para que practiques.</p>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ej: La fotosíntesis es el proceso mediante el cual las plantas..."
                className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none mb-4 text-slate-800"
                disabled={isLoading}
              />
              
              {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isLoading || !inputText.trim()}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <IconSparkles className="w-5 h-5" />
                    <span>Generar Tarjetas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto animate-fade-in">
            {cards.map((card, idx) => (
              <FlashcardItem key={idx} card={card} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};