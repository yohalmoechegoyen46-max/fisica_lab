import React from 'react';
import { Plus, Eye, EyeOff, RotateCcw, Calculator, Info, Trash2 } from 'lucide-react';
import { VectorForce } from '../../types';

interface VectorControlsProps {
  vectors: VectorForce[];
  showProjections: boolean;
  setShowProjections: (show: boolean) => void;
  onUpdateVector: (id: string, updates: Partial<VectorForce>) => void;
  onAddVector: () => void;
  onRemoveVector: (id: string) => void;
  onReset: () => void;
  onCalculate: () => void;
}

export const VectorControls: React.FC<VectorControlsProps> = ({
  vectors,
  showProjections,
  setShowProjections,
  onUpdateVector,
  onAddVector,
  onRemoveVector,
  onReset,
  onCalculate,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6 flex flex-col justify-between">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase block">
              Entradas del sistema
            </span>
            <h3 className="text-base font-bold text-slate-800">Define los vectores</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
            {vectors.length} {vectors.length === 1 ? 'vector' : 'vectores'}
          </span>
        </div>

        {/* Vector Cards list */}
        <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
          {vectors.map((vec, index) => (
            <div
              key={vec.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: vec.color }}
                  />
                  <span className="text-sm font-bold text-slate-800">
                    {vec.name}
                  </span>
                  <span className="text-xs text-slate-400 font-normal">
                    · {vec.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  

                  {vectors.length > 1 && (
                    <button
                      onClick={() => onRemoveVector(vec.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Eliminar vector"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Magnitud y Ángulo inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">
                    Magnitud
                  </label>
                  <div className="flex rounded-lg border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 overflow-hidden">
                    <input
                      type="number"
                      min="0"
                      max="400"
                      step="1"
                      value={vec.magnitude}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        onUpdateVector(vec.id, { magnitude: isNaN(val) ? 0 : Math.max(0, val) });
                      }}
                      className="w-full px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none"
                    />
                    <span className="px-2.5 py-1.5 bg-slate-50 border-l border-slate-100 text-xs font-semibold text-slate-500 flex items-center">
                      N
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">
                    Ángulo θ
                  </label>
                  <div className="flex rounded-lg border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-1 focus-fail focus-within:ring-teal-500 overflow-hidden">
                    <input
                      type="number"
                      min="0"
                      max="360"
                      step="1"
                      value={vec.angle}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        onUpdateVector(vec.id, { angle: isNaN(val) ? 0 : Math.max(0, Math.min(360, val)) });
                      }}
                      className="w-full px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none"
                    />
                    <span className="px-2.5 py-1.5 bg-slate-50 border-l border-slate-100 text-xs font-semibold text-slate-500 flex items-center">
                      °
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Botón Añadir Vector */}
          {vectors.length < 10 && (
            <button
              onClick={onAddVector}
              className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-xl text-xs font-semibold text-slate-600 hover:text-teal-700 flex items-center justify-center gap-1.5 transition-colors bg-white hover:bg-teal-50/20"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir vector</span>
            </button>
          )}
        </div>

        {/* Toggle Proyecciones */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs font-medium text-slate-600">Mostrar proyecciones</span>
          <button
            onClick={() => setShowProjections(!showProjections)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              showProjections
                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            {showProjections ? 'Activadas' : 'Desactivadas'}
          </button>
        </div>

        {/* Tip Box */}
        <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100/90 flex gap-2.5 text-xs text-sky-800 leading-relaxed">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p>
            Los ángulos se miden desde +X en sentido antihorario. Arrastra la punta de cada vector directamente en el plano cartesiano.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Restablecer</span>
        </button>

        
      </div>
    </div>
  );
};
