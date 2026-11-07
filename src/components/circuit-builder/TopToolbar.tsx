import React from 'react';
import { 
  Pause, 
  Tag, 
  Hash, 
  Grid, 
  Gauge, 
  Activity, 
  Zap,
  RotateCcw,
  Search,
  ZoomIn
} from 'lucide-react';
import { CurrentFlowMode, ValueZoomScale } from '../../types/circuitBuilder';

interface TopToolbarProps {
  flowMode: CurrentFlowMode;
  setFlowMode: (mode: CurrentFlowMode) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  showValues: boolean;
  setShowValues: (show: boolean) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  valueScale: ValueZoomScale;
  setValueScale: (scale: ValueZoomScale) => void;
  isMagnifierActive: boolean;
  setIsMagnifierActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  isVoltmeterActive: boolean;
  setIsVoltmeterActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  isAmmeterActive: boolean;
  setIsAmmeterActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  onResetProbes: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  flowMode,
  setFlowMode,
  showLabels,
  setShowLabels,
  showValues,
  setShowValues,
  showGrid,
  setShowGrid,
  valueScale,
  setValueScale,
  isMagnifierActive,
  setIsMagnifierActive,
  isVoltmeterActive,
  setIsVoltmeterActive,
  isAmmeterActive,
  setIsAmmeterActive,
  onResetProbes,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
      {/* 1. Sentido de la Corriente */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-teal-600" />
          <span>Flujo de Corriente:</span>
        </span>
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setFlowMode('electrons')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              flowMode === 'electrons'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Electrones (fluyen del polo negativo al positivo)"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-300 inline-block" />
            <span>Electrones (e⁻)</span>
          </button>
          <button
            onClick={() => setFlowMode('conventional')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              flowMode === 'conventional'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Convencional (fluye del polo positivo al negativo)"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-200 inline-block" />
            <span>Convencional (+)</span>
          </button>
          <button
            onClick={() => setFlowMode('off')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              flowMode === 'off'
                ? 'bg-slate-700 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Pausar animación de partículas"
          >
            <Pause className="w-3 h-3" />
            <span>Sin flujo</span>
          </button>
        </div>
      </div>

      {/* 2. Opciones de Visualización */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Ver:</span>
        
        {/* Toggle Etiquetas */}
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
            showLabels
              ? 'bg-teal-50 border-teal-300 text-teal-800'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="Mostrar nombres de los componentes"
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Etiquetas</span>
        </button>

        {/* Toggle Valores */}
        <button
          onClick={() => setShowValues(!showValues)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
            showValues
              ? 'bg-teal-50 border-teal-300 text-teal-800'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="Mostrar valores numéricos (Ohmios, Voltios, etc.)"
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Valores</span>
        </button>

        {/* Toggle Cuadrícula */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
            showGrid
              ? 'bg-teal-50 border-teal-300 text-teal-800'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="Mostrar cuadrícula milimétrica de alineación"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Rejilla</span>
        </button>
      </div>

      {/* 3. Lupa y Tamaño de Valores (Magnifier / Zoom) */}
      <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200/90">
        {/* Botón Lupa de Inspección */}
        <button
          onClick={() => {
            setIsMagnifierActive(prev => !prev);
            if (!showValues) setShowValues(true);
          }}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            isMagnifierActive
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
          }`}
          title="Activar lupa interactiva para inspeccionar componentes y ver sus valores ampliados"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Lupa</span>
        </button>

        {/* Selector de Tamaño de Valores en el Lienzo */}
        <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 hidden md:inline flex items-center gap-1">
            <ZoomIn className="w-3 h-3 text-slate-400" />
            <span>Tamaño:</span>
          </span>
          <div className="flex bg-white p-0.5 rounded-lg border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => {
                setValueScale('normal');
                if (!showValues) setShowValues(true);
              }}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                valueScale === 'normal'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tamaño normal de valores (100%)"
            >
              1x
            </button>
            <button
              onClick={() => {
                setValueScale('large');
                if (!showValues) setShowValues(true);
              }}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                valueScale === 'large'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tamaño aumentado con lupa (150%)"
            >
              1.5x
            </button>
            <button
              onClick={() => {
                setValueScale('xlarge');
                if (!showValues) setShowValues(true);
              }}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                valueScale === 'xlarge'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tamaño gigante amplificado con lupa (200%)"
            >
              2x
            </button>
          </div>
        </div>
      </div>

      {/* 4. Instrumentos de Medición Virtuales */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          <span>Instrumentos:</span>
        </span>

        {/* Voltímetro */}
        <button
          onClick={() => setIsVoltmeterActive(prev => !prev)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
            isVoltmeterActive
              ? 'bg-rose-500 text-white border-rose-600 shadow-2xs scale-102'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>Voltímetro</span>
        </button>

        {/* Amperímetro */}
        <button
          onClick={() => setIsAmmeterActive(prev => !prev)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
            isAmmeterActive
              ? 'bg-amber-500 text-white border-amber-600 shadow-2xs scale-102'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Amperímetro</span>
        </button>

        {(isVoltmeterActive || isAmmeterActive) && (
          <button
            onClick={onResetProbes}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Restablecer posición de sondas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
