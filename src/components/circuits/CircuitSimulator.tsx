import React, { useState } from 'react';
import { OhmSubTab } from '../../types';
import { OhmCalculator } from './OhmCalculator';
import { CircuitBuilderView } from '../circuit-builder/CircuitBuilderView';

interface CircuitSimulatorProps {
  subTab?: OhmSubTab;
  setSubTab?: (tab: OhmSubTab) => void;
}

export const CircuitSimulator: React.FC<CircuitSimulatorProps> = ({
  subTab,
  setSubTab,
}) => {
  // Estado local de respaldo si no es gestionado por el componente padre
  const [internalTab, setInternalTab] = useState<OhmSubTab>('builder');

  const activeTab = subTab || internalTab;
  const handleTabChange = (tab: OhmSubTab) => {
    if (setSubTab) {
      setSubTab(tab);
    } else {
      setInternalTab(tab);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Simulator Section Header */}
      <div className="border-b border-slate-200/80 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">
            SIMULADOR 02 / ELECTRICIDAD
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Laboratorio de Electricidad y Ley de Ohm
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Construye circuitos interactivos en la mesa de trabajo o calcula circuitos en serie, paralelo y mixtos con criterios de diseño.
          </p>
        </div>

        {/* Selector de Pestañas Principales */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl self-start md:self-auto border border-slate-300/60 shadow-2xs">
          <button
            onClick={() => handleTabChange('builder')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
            }`}
          >
            Construcción de Circuitos
          </button>

          <button
            onClick={() => handleTabChange('calculator')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab !== 'builder'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
            }`}
          >
            Calculadora y Criterios
          </button>
        </div>
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'builder' ? (
        <CircuitBuilderView />
      ) : (
        <OhmCalculator />
      )}
    </div>
  );
};
