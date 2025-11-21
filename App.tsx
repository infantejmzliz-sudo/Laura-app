import React, { useState } from 'react';
import { ViewState } from './types';
import { ChatView } from './components/ChatView';
import { FlashcardView } from './components/FlashcardView';
import { GuideView } from './components/GuideView';
import { IconMessageSquare, IconBookOpen, IconLayers, IconMenu } from './components/Icons';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.CHAT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (view) {
      case ViewState.CHAT:
        return <ChatView />;
      case ViewState.FLASHCARDS:
        return <FlashcardView />;
      case ViewState.GUIDE:
        return <GuideView />;
      default:
        return <ChatView />;
    }
  };

  const NavButton = ({ 
    active, 
    onClick, 
    icon: Icon, 
    label,
    colorClass
  }: { 
    active: boolean; 
    onClick: () => void; 
    icon: React.ElementType; 
    label: string;
    colorClass: string;
  }) => (
    <button
      onClick={() => {
        onClick();
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
        active 
          ? `${colorClass} font-medium shadow-sm` 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'opacity-100' : 'opacity-70'}`} />
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-100 relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-4">
          <div className="px-4 py-6 mb-6">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Universidad Lux
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">Tu asistente universitario</p>
          </div>

          <nav className="space-y-2 flex-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">Herramientas</div>
            <NavButton
              active={view === ViewState.CHAT}
              onClick={() => setView(ViewState.CHAT)}
              icon={IconMessageSquare}
              label="Tutor AI"
              colorClass="bg-indigo-50 text-indigo-700"
            />
            <NavButton
              active={view === ViewState.GUIDE}
              onClick={() => setView(ViewState.GUIDE)}
              icon={IconBookOpen}
              label="Guías de Estudio"
              colorClass="bg-blue-50 text-blue-700"
            />
            <NavButton
              active={view === ViewState.FLASHCARDS}
              onClick={() => setView(ViewState.FLASHCARDS)}
              icon={IconLayers}
              label="Flashcards"
              colorClass="bg-emerald-50 text-emerald-700"
            />
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs text-slate-500 text-center leading-relaxed">
                    "El aprendizaje nunca agota la mente." <br/>
                    <span className="font-medium text-slate-700">- Leonardo da Vinci</span>
                </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full w-full relative overflow-hidden">
        {/* Mobile Toggle */}
        <div className="lg:hidden absolute top-4 left-4 z-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600"
          >
            <IconMenu className="w-6 h-6" />
          </button>
        </div>

        {renderView()}
      </main>
    </div>
  );
};

export default App;