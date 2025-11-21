import React, { useState } from 'react';
import { StudyGuide } from '../types';
import { generateStudyGuideFromNotes } from '../services/geminiService';
import { IconBookOpen, IconSparkles, IconRefresh } from './Icons';

export const GuideView: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [guide, setGuide] = useState<StudyGuide | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!notes.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await generateStudyGuideFromNotes(notes);
      setGuide(result);
    } catch (err) {
      setError('No se pudo generar la guía. Intenta simplificar tus notas.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGuide(null);
    setNotes('');
    setError(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <IconBookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Guía de Estudio</h2>
        </div>
         {guide && (
            <button onClick={handleReset} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                <IconRefresh className="w-4 h-4" />
                Crear nueva
            </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!guide ? (
          <div className="max-w-2xl mx-auto mt-10 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Convierte tus apuntes en Guías</h3>
              <p className="text-slate-600 mb-6">Pega tus notas desordenadas y la IA las organizará en una guía de estudio estructurada y fácil de leer.</p>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Pega aquí tus notas de clase..."
                className="w-full h-60 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none mb-4 text-slate-800"
                disabled={isLoading}
              />

              {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isLoading || !notes.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                   <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Organizando...</span>
                  </>
                ) : (
                  <>
                    <IconSparkles className="w-5 h-5" />
                    <span>Generar Guía</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-50 p-8 border-b border-blue-100">
                <h1 className="text-3xl font-bold text-blue-900">{guide.topic}</h1>
                <p className="text-blue-600 mt-2">Guía de estudio personalizada</p>
            </div>
            <div className="p-8 space-y-8">
                {guide.sections.map((section, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">{section.title}</h3>
                        <ul className="space-y-3">
                            {section.content.map((point, pIdx) => (
                                <li key={pIdx} className="text-slate-600 leading-relaxed flex items-start gap-3">
                                    <span className="mt-2 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-200 text-center">
                <p className="text-slate-500 text-sm italic">Generado por Universidad Lux AI</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};