import React from 'react';
import { HelpCircle } from 'lucide-react';
import { ActiveView } from '../../types';
import logoItca from '../img/logo.jpeg'; 


interface HeaderProps {
  activeView: ActiveView;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onOpenHelp,
}) => {
  const getBreadcrumb = () => {
    switch (activeView) {
      case 'home':
        return (
          <>
            <span className="text-slate-400">Portal de simuladores</span>
            <span className="text-slate-400 mx-2">›</span>
            <span className="text-slate-700 font-medium">Inicio</span>
          </>
        );
      case 'vectors':
        return (
          <>
            <span className="text-slate-400">Portal de simuladores</span>
            <span className="text-slate-400 mx-2">›</span>
            <span className="text-slate-700 font-medium">Análisis vectorial</span>
          </>
        );
      case 'ohm':
        return (
          <>
            <span className="text-slate-400">Portal de simuladores</span>
            <span className="text-slate-400 mx-2">›</span>
            <span className="text-slate-700 font-medium">Ley de Ohm y circuitos</span>
          </>
        );
      case 'designers':
        return (
          <>
            <span className="text-slate-400">Portal de simuladores</span>
            <span className="text-slate-400 mx-2">›</span>
            <span className="text-slate-700 font-medium">Diseñadores</span>
          </>
        );
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Breadcrumb */}
      <div className="flex items-center text-xs tracking-wide">
        {getBreadcrumb()}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        

      {/* Logo ITCA */}
      <div className="w-full flex justify-center items-center py-4">
        <img 
          src={logoItca} 
          alt="Logo Itca" 
          className="h-10 w-auto object-contain mx-auto"
        />
      </div>
        {/* Help button */}
        <button
          onClick={onOpenHelp}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Ayuda del sistema"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
