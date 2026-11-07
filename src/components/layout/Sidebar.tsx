import React from 'react';
import logoItca from '../img/logo.jpeg'; 

import { 
  Home, 
  Compass, 
  Activity, 
  BookOpen, 
  Layers, 
  ChevronRight, 
  Sparkles,
  GitCommit,
  Cpu,
  Calculator,
  Users
} from 'lucide-react';
import { ActiveView, VectorSubTab, OhmSubTab } from '../../types';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  vectorSubTab: VectorSubTab;
  setVectorSubTab: (tab: VectorSubTab) => void;
  ohmSubTab: OhmSubTab;
  setOhmSubTab: (tab: OhmSubTab) => void;
  onOpenHelp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  vectorSubTab,
  setVectorSubTab,
  ohmSubTab,
  setOhmSubTab,
  onOpenHelp,
}) => {
  return (
    <aside className="w-64 bg-[#0c1527] text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto border-r border-slate-800/80 shadow-xl select-none z-40">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20">
            <svg className="w-6 h-6 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M3 12a9 9 0 0 1 18 0" />
              <path d="M5.5 17.5 18.5 6.5" />
              <path d="M18.5 17.5 5.5 6.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              FísicaLab
            </h1>
            <span className="text-[10px] font-semibold text-teal-400 tracking-[0.25em] block uppercase">
              Simuladores
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5 text-sm font-medium">
          {/* Inicio */}
          <button
            onClick={() => setActiveView('home')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all ${
              activeView === 'home'
                ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Home className={`w-4 h-4 ${activeView === 'home' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span>Inicio</span>
            </div>
            {activeView === 'home' && (
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            )}
          </button>

          {/* Análisis Vectorial */}
          <div className="pt-2">
            <button
              onClick={() => {
                setActiveView('vectors');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all ${
                activeView === 'vectors'
                  ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className={`w-4 h-4 ${activeView === 'vectors' ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>Análisis vectorial</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeView === 'vectors' ? 'rotate-90 text-teal-400' : 'text-slate-500'}`} />
            </button>

            {/* Sub-items for Vector */}
            {activeView === 'vectors' && (
              <div className="ml-8 mt-1.5 space-y-1 border-l border-slate-800 pl-3">
                <button
                  onClick={() => setVectorSubTab('cartesian')}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded transition-all block ${
                    vectorSubTab === 'cartesian'
                      ? 'text-teal-300 font-semibold bg-slate-800/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Plano cartesiano
                </button>
                <button
                  onClick={() => setVectorSubTab('dcl')}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded transition-all block ${
                    vectorSubTab === 'dcl'
                      ? 'text-teal-300 font-semibold bg-slate-800/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Desglose y DCL
                </button>
              </div>
            )}
          </div>

          {/* Ley de Ohm y circuitos */}
          <div className="pt-2">
            <button
              onClick={() => setActiveView('ohm')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all ${
                activeView === 'ohm'
                  ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className={`w-4 h-4 ${activeView === 'ohm' ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>Ley de Ohm</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeView === 'ohm' ? 'rotate-90 text-teal-400' : 'text-slate-500'}`} />
            </button>

            {/* Sub-items for Ohm */}
            {activeView === 'ohm' && (
              <div className="ml-8 mt-1.5 space-y-1 border-l border-slate-800 pl-3">
                <button
                  onClick={() => setOhmSubTab('builder')}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded transition-all block ${
                    ohmSubTab === 'builder'
                      ? 'text-teal-300 font-semibold bg-slate-800/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Construcción de circuitos
                </button>
                <button
                  onClick={() => setOhmSubTab('calculator')}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded transition-all block ${
                    ohmSubTab !== 'builder'
                      ? 'text-teal-300 font-semibold bg-slate-800/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Calculadora
                </button>
              </div>
            )}
          </div>

          {/* Diseñadores */}
          <div className="pt-2">
            <button
              onClick={() => setActiveView('designers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all ${
                activeView === 'designers'
                  ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 ${activeView === 'designers' ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>Desarolladores</span>
              </div>
              {activeView === 'designers' && (
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Footer Center Card */}
      <div className="w-full flex justify-center items-center py-4">
        <img 
          src={logoItca} 
          alt="Logo Itca" 
          className="h-10 w-auto object-contain mx-auto"
        />
      </div>
    </aside>
  );
};
