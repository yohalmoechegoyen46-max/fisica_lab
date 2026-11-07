import React, { useState, useMemo } from 'react';
import { VectorForce, VectorSubTab } from '../../types';
import { calculateResultant } from '../../utils/physics';
import { CartesianCanvas } from './CartesianCanvas';
import { VectorControls } from './VectorControls';
import { DclBreakdown } from './DclBreakdown';

interface VectorSimulatorProps {
  subTab: VectorSubTab;
  setSubTab: (tab: VectorSubTab) => void;
}

const DEFAULT_VECTORS: VectorForce[] = [
  {
    id: 'f1',
    name: 'F₁',
    label: 'Fuerza aplicada',
    magnitude: 100,
    angle: 30,
    color: '#0284c7',
    visible: true,
  },
  {
    id: 'f2',
    name: 'F₂',
    label: 'Fuerza aplicada',
    magnitude: 80,
    angle: 150,
    color: '#4f46e5',
    visible: true,
  },
];

const PALETTE = ['#0284c7', '#4f46e5', '#059669', '#d97706', '#dc2626'];

export const VectorSimulator: React.FC<VectorSimulatorProps> = ({
  subTab,
  setSubTab,
}) => {
  const [vectors, setVectors] = useState<VectorForce[]>(DEFAULT_VECTORS);
  const [showProjections, setShowProjections] = useState<boolean>(true);

  // Cálculo memoizado de la resultante
  const resultant = useMemo(() => calculateResultant(vectors), [vectors]);

  const handleUpdateVector = (id: string, updates: Partial<VectorForce>) => {
    setVectors(prev =>
      prev.map(v => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const handleAddVector = () => {
    if (vectors.length >= 10) return;
    const nextIdx = vectors.length + 1;
    const subIndices = ['₁', '₂', '₃', '₄', '₅'];
    const newVector: VectorForce = {
      id: `f${Date.now()}`,
      name: `F${subIndices[nextIdx - 1] || nextIdx}`,
      label: 'Fuerza adicional',
      magnitude: 60,
      angle: 60 * (nextIdx - 1),
      color: PALETTE[(nextIdx - 1) % PALETTE.length],
      visible: true,
    };
    setVectors(prev => [...prev, newVector]);
  };

  const handleRemoveVector = (id: string) => {
    if (vectors.length <= 1) return;
    setVectors(prev => prev.filter(v => v.id !== id));
  };

  const handleReset = () => {
    setVectors(DEFAULT_VECTORS);
    setShowProjections(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6 animate-fade-in">
      {/* Simulator Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">
            SIMULADOR 01 / MECÁNICA
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {subTab === 'cartesian' ? 'Análisis vectorial' : 'Desglose vectorial'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {subTab === 'cartesian'
              ? 'Define tus fuerzas y explora cómo se combinan en el plano.'
              : 'Comprende cada proyección y reconstruye la fuerza resultante, paso a paso.'}
          </p>
        </div>

        {/* Tab switch navigation */}
        <div className="flex items-center gap-2 border-b-2 sm:border-b-0 border-slate-200">
          <button
            onClick={() => setSubTab('cartesian')}
            className={`pb-2 sm:pb-1.5 px-3.5 text-sm font-semibold transition-all relative ${
              subTab === 'cartesian'
                ? 'text-teal-600 border-b-2 border-teal-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Plano cartesiano
          </button>
          <button
            onClick={() => setSubTab('dcl')}
            className={`pb-2 sm:pb-1.5 px-3.5 text-sm font-semibold transition-all relative ${
              subTab === 'dcl'
                ? 'text-teal-600 border-b-2 border-teal-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Desglose y DCL
          </button>
        </div>
      </div>

      {/* View Content */}
      {subTab === 'cartesian' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <VectorControls
              vectors={vectors}
              showProjections={showProjections}
              setShowProjections={setShowProjections}
              onUpdateVector={handleUpdateVector}
              onAddVector={handleAddVector}
              onRemoveVector={handleRemoveVector}
              onReset={handleReset}
              onCalculate={() => {}}
            />
          </div>
          <div className="lg:col-span-8">
            <CartesianCanvas
              vectors={vectors}
              resultant={resultant}
              showProjections={showProjections}
              onUpdateVector={handleUpdateVector}
            />
          </div>
        </div>
      ) : (
        <DclBreakdown vectors={vectors} resultant={resultant} />
      )}
    </div>
  );
};
