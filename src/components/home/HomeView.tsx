import React from 'react';
import { ArrowUpRight, Compass, Zap, Target, Layers, FileCheck } from 'lucide-react';
import { ActiveView } from '../../types';

interface HomeViewProps {
  onNavigate: (view: ActiveView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-12 animate-fade-in">
      {/* Hero Header */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Aprende física experimentando.
        </h1>

        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          Explora principios fundamentales con simulaciones visuales, cálculos en tiempo real y análisis detallados.
        </p>
      </div>

      {/* Simulator Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Vector Analysis */}
        <div 
          onClick={() => onNavigate('vectors')}
          className="group cursor-pointer rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-400 transition-all duration-300 overflow-hidden flex flex-col justify-between"
        >
          {/* Visual Canvas Area */}
          <div className="h-56 bg-gradient-to-br from-[#0c1527] to-[#122340] relative p-6 flex flex-col justify-between overflow-hidden">
            {/* Tag */}
            <div className="z-10">
              <span className="px-3 py-1 rounded text-[11px] font-bold tracking-wider uppercase bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Mecánica
              </span>
            </div>

            {/* Dynamic Vector Graphic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90 group-hover:scale-105 transition-transform duration-500">
              <svg className="w-full h-full max-w-xs" viewBox="0 0 280 180" fill="none">
                {/* Grid */}
                <line x1="20" y1="150" x2="260" y2="150" stroke="#334155" strokeWidth="1.5" />
                <line x1="40" y1="20" x2="40" y2="160" stroke="#334155" strokeWidth="1.5" />
                <line x1="40" y1="100" x2="260" y2="100" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="160" y1="20" x2="160" y2="150" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Angle arc */}
                <path d="M 80 150 A 40 40 0 0 0 74 130" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
                <text x="86" y="140" fill="#38bdf8" fontSize="11" fontFamily="sans-serif">θ</text>

                {/* Projections dashed */}
                <line x1="40" y1="60" x2="190" y2="60" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="190" y1="150" x2="190" y2="60" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Main Vector Arrow */}
                <line x1="40" y1="150" x2="186" y2="63" stroke="#2dd4bf" strokeWidth="3.5" strokeLinecap="round" />
                <polygon points="192,60 180,62 185,73" fill="#2dd4bf" />

                {/* Dots */}
                <circle cx="40" cy="150" r="4" fill="#ffffff" />
                <circle cx="190" cy="60" r="3" fill="#2dd4bf" />
              </svg>
            </div>

            <div className="z-10 self-end">
              <span className="text-xs font-medium text-slate-400">Simulador 01</span>
            </div>
          </div>

          {/* Description Area */}
          <div className="p-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                Análisis vectorial
              </h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Descompón fuerzas, visualiza vectores y calcula la resultante de un sistema.
            </p>

            <div className="pt-2 flex items-center text-sm font-semibold text-teal-700 group-hover:text-teal-800">
              <span>Abrir simulador</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>
        </div>

        {/* Card 2: Ohm's Law & Circuits */}
        <div 
          onClick={() => onNavigate('ohm')}
          className="group cursor-pointer rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 overflow-hidden flex flex-col justify-between"
        >
          {/* Visual Schematic Area */}
          <div className="h-56 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-amber-50/30 relative p-6 flex flex-col justify-between overflow-hidden border-b border-slate-100">
            {/* Tag */}
            <div className="z-10">
              <span className="px-3 py-1 rounded text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-800 border border-amber-400/40">
                Electricidad
              </span>
            </div>

            {/* Circuit Graphic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-105 transition-transform duration-500">
              <svg className="w-full h-full max-w-xs" viewBox="0 0 280 180" fill="none">
                {/* Battery Source */}
                <line x1="50" y1="60" x2="50" y2="120" stroke="#0f766e" strokeWidth="2.5" />
                <line x1="42" y1="75" x2="42" y2="105" stroke="#0f766e" strokeWidth="4" />
                <line x1="30" y1="90" x2="42" y2="90" stroke="#0f766e" strokeWidth="2.5" />
                <line x1="50" y1="90" x2="90" y2="90" stroke="#0f766e" strokeWidth="2.5" />

                {/* Branch splits */}
                <line x1="90" y1="50" x2="90" y2="130" stroke="#0f766e" strokeWidth="2.5" />
                <line x1="90" y1="50" x2="130" y2="50" stroke="#0f766e" strokeWidth="2.5" />
                <line x1="90" y1="130" x2="130" y2="130" stroke="#0f766e" strokeWidth="2.5" />

                {/* Resistor 1 Zigzag */}
                <path d="M 130 50 L 140 40 L 150 60 L 160 40 L 170 60 L 180 50 L 210 50" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Resistor 2 Zigzag */}
                <path d="M 130 130 L 140 120 L 150 140 L 160 120 L 170 140 L 180 130 L 210 130" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Branch merges */}
                <line x1="210" y1="50" x2="210" y2="130" stroke="#0f766e" strokeWidth="2.5" />
                <line x1="210" y1="90" x2="250" y2="90" stroke="#0f766e" strokeWidth="2.5" />
                <line x1="250" y1="90" x2="250" y2="160" stroke="#0f766e" strokeWidth="2.5" />
                <line x1="250" y1="160" x2="30" y2="160" stroke="#0f766e" strokeWidth="2.5" />
                <line x1="30" y1="160" x2="30" y2="90" stroke="#0f766e" strokeWidth="2.5" />

                {/* Current dots */}
                <circle cx="110" cy="50" r="3" fill="#0284c7" />
                <circle cx="110" cy="130" r="3" fill="#0284c7" />
                <circle cx="195" cy="50" r="3" fill="#0284c7" />
                <circle cx="195" cy="130" r="3" fill="#0284c7" />
                <circle cx="140" cy="160" r="3" fill="#0284c7" />
              </svg>
            </div>

            <div className="z-10 self-end">
              <span className="text-xs font-medium text-slate-500">Simulador 02</span>
            </div>
          </div>

          {/* Description Area */}
          <div className="p-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Ley de Ohm y circuitos
              </h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Construye circuitos interactivos en la mesa de trabajo, mide con voltímetro y amperímetro virtuales, y calcula parámetros con criterios de diseño.
            </p>

            <div className="pt-2 flex items-center text-sm font-semibold text-amber-700 group-hover:text-amber-800">
              <span>Abrir simulador</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200/80">
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Cálculos precisos</h4>
            <p className="text-xs text-slate-500 mt-0.5">Resultados actualizados en tiempo real</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Visualización clara</h4>
            <p className="text-xs text-slate-500 mt-0.5">Gráficos interactivos y didácticos</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Análisis detallado</h4>
            <p className="text-xs text-slate-500 mt-0.5">Procedimiento y unidades del SI</p>
          </div>
        </div>
      </div>
    </div>
  );
};
