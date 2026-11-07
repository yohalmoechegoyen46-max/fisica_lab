import React, { useState, useEffect } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle, Plus, Trash2, Info } from 'lucide-react';
import { analyzeSeriesArray, formatNumber } from '../../utils/physics';

export const SeriesCircuitView: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(12);
  const [resistors, setResistors] = useState<number[]>([100, 200, 300]);
  const [nominalPower] = useState<number>(0.50);
  const [animateCurrent, setAnimateCurrent] = useState<boolean>(true);
  const [animOffset, setAnimOffset] = useState<number>(0);

  const analysis = analyzeSeriesArray(voltage, resistors, nominalPower);

  useEffect(() => {
    if (!animateCurrent || analysis.it <= 0) return;
    const speed = Math.max(0.5, Math.min(4, analysis.it * 80));
    const interval = setInterval(() => {
      setAnimOffset(prev => (prev + speed) % 1000);
    }, 30);
    return () => clearInterval(interval);
  }, [animateCurrent, analysis.it]);

  const handleAddResistor = () => {
    if (resistors.length >= 6) return;
    setResistors(prev => [...prev, 150]);
  };

  const handleRemoveResistor = (index: number) => {
    if (resistors.length <= 1) return;
    setResistors(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateResistor = (index: number, val: number) => {
    setResistors(prev => prev.map((r, idx) => (idx === index ? Math.max(1, val) : r)));
  };

  const handleReset = () => {
    setVoltage(12);
    setResistors([100, 200, 300]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      {/* Panel de Inputs y Control de Resistencias */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6 flex flex-col justify-between">
        <div className="space-y-5">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase block">
              Parámetros del circuito
            </span>
            <h3 className="text-base font-bold text-slate-800">Circuito en Serie</h3>
          </div>

          {/* Fuente de Tensión Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Fuente de tensión (V)</label>
            <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
              <input
                type="number"
                min="1"
                max="48"
                step="0.5"
                value={voltage}
                onChange={(e) => setVoltage(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3.5 py-2 text-sm font-semibold text-slate-800 focus:outline-none font-mono"
              />
              <span className="px-3 py-2 bg-slate-50 border-l border-slate-100 text-xs font-bold text-slate-500 flex items-center">V</span>
            </div>
          </div>

          {/* Lista dinámica de resistencias */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Resistencias ({resistors.length})</span>
              <button
                onClick={handleAddResistor}
                disabled={resistors.length >= 6}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-bold transition-all disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {resistors.map((rVal, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700 font-mono w-8">R{idx + 1}</span>
                  <div className="flex-1 flex rounded-lg border border-slate-200 bg-white overflow-hidden">
                    <input
                      type="number"
                      min="1"
                      step="10"
                      value={rVal}
                      onChange={(e) => handleUpdateResistor(idx, parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none font-mono"
                    />
                    <span className="px-2.5 py-1.5 bg-slate-50 border-l border-slate-100 text-xs font-bold text-slate-500 flex items-center">Ω</span>
                  </div>
                  {resistors.length > 1 && (
                    <button
                      onClick={() => handleRemoveResistor(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 mt-4"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Restablecer valores</span>
        </button>
      </div>

      {/* Visualización del Circuito e Indicadores de Cálculo */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Circuito en serie (Dinámico)</h3>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAnimateCurrent(!animateCurrent)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                animateCurrent ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${animateCurrent ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>Flujo de corriente</span>
            </button>

            {analysis.overloadCount === 0 ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>Sin sobrecarga</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                <span>{analysis.overloadCount} sobrecarga</span>
              </span>
            )}
          </div>
        </div>

        {/* Diagrama SVG Dinámico en Serie */}
        <div className="p-6 bg-slate-50/50 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl h-64 relative">
            <svg viewBox="0 0 540 220" className="w-full h-full">
              <rect x="60" y="40" width="420" height="140" fill="none" stroke="#0d9488" strokeWidth="2.5" rx="6" />

              {animateCurrent && (
                <rect
                  x="60"
                  y="40"
                  width="420"
                  height="140"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  strokeDasharray="8 28"
                  strokeDashoffset={-animOffset}
                  rx="6"
                />
              )}

              {/* Fuente */}
              <g transform="translate(60, 110)">
                <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
                <text x="0" y="-5" fill="#0d9488" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>
                <line x1="-7" y1="8" x2="7" y2="8" stroke="#0d9488" strokeWidth="2.5" />
                <text x="-32" y="5" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="end">{voltage} V</text>
              </g>

              {/* Resistores distribuidos dinámicamente */}
              {analysis.resistors.map((res, idx) => {
                const spacing = 420 / (analysis.resistors.length + 1);
                const posX = 60 + spacing * (idx + 1);
                return (
                  <g key={idx} transform={`translate(${posX}, 40)`}>
                    <rect x="-24" y="-12" width="48" height="24" fill="#ffffff" stroke={res.isOverloaded ? '#e11d48' : '#0d9488'} strokeWidth="2.5" rx="3" />
                    <text x="0" y="-18" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">{res.name}</text>
                    <text x="0" y="2" fill="#0f172a" fontSize="9" fontWeight="semibold" textAnchor="middle">{res.r} Ω</text>
                    <text x="0" y="26" fill="#0d9488" fontSize="9" fontWeight="bold" textAnchor="middle">{formatNumber(res.v, 1)} V</text>
                  </g>
                );
              })}

              {/* Corriente central */}
              <g transform="translate(270, 110)">
                <rect x="-100" y="-14" width="200" height="28" rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <text x="0" y="5" fill="#0284c7" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  I = {formatNumber(analysis.it, 3)} A
                </text>
              </g>
            </svg>
          </div>

          <div className="w-full flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-3 border-t border-slate-200/60">
            <span>Flujo convencional: polo + al polo -</span>
            <div className="flex items-center gap-3 font-mono font-medium">
              {analysis.resistors.map((res, idx) => (
                <span key={idx} className={res.isOverloaded ? 'text-rose-600 font-bold' : ''}>
                  {res.name}: {formatNumber(res.p, 3)} W
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Metric Cards inferiores */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-white">
          <div className="p-4">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">Resistencia Total</span>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight font-mono">{formatNumber(analysis.req, 1)} Ω</span>
          </div>
          <div className="p-4">
            <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">Corriente Total</span>
            <span className="text-xl font-extrabold text-teal-600 tracking-tight font-mono">{formatNumber(analysis.it, 3)} A</span>
          </div>
          <div className="p-4">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">Voltaje Total</span>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight font-mono">{voltage} V</span>
          </div>
        </div>
      </div>
    </div>
  );
};
