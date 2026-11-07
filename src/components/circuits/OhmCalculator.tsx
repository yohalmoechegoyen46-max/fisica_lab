import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, RotateCcw, Layers } from 'lucide-react';
import { formatNumber } from '../../utils/physics';

type CalcMode = 'ohm' | 'series' | 'parallel' | 'mixed';
type UnknownVariable = 'V' | 'I' | 'R';

export const OhmCalculator: React.FC = () => {
  const [calcMode, setCalcMode] = useState<CalcMode>('mixed');

  // ==========================================
  // 1. MODO LEY DE OHM BÁSICA
  // ==========================================
  const [unknown, setUnknown] = useState<UnknownVariable>('I');
  const [voltage, setVoltage] = useState<number>(12);
  const [current, setCurrent] = useState<number>(0.02);
  const [resistance, setResistance] = useState<number>(600);

  let calculatedV = voltage;
  let calculatedI = current;
  let calculatedR = resistance;

  if (unknown === 'V') {
    calculatedV = current * resistance;
  } else if (unknown === 'I') {
    calculatedI = resistance > 0 ? voltage / resistance : 0;
  } else if (unknown === 'R') {
    calculatedR = current > 0 ? voltage / current : 0;
  }

  // ==========================================
  // 2. MODO SERIE (DINÁMICO)
  // ==========================================
  const [circuitVoltage, setCircuitVoltage] = useState<number>(12);
  const [resistorsList, setResistorsList] = useState<number[]>([100, 200, 300]);

  const seriesRTotal = resistorsList.reduce((acc, r) => acc + r, 0);
  const seriesCurrent = seriesRTotal > 0 ? circuitVoltage / seriesRTotal : 0;
  const seriesVoltages = resistorsList.map(r => seriesCurrent * r);

  const handleAddResistor = () => {
    if (resistorsList.length >= 10) return;
    setResistorsList(prev => [...prev, 150]);
  };

  const handleRemoveResistor = (index: number) => {
    if (resistorsList.length <= 1) return;
    setResistorsList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateResistor = (index: number, val: number) => {
    setResistorsList(prev => prev.map((r, idx) => (idx === index ? Math.max(1, val) : r)));
  };

  // ==========================================
  // 3. MODO PARALELO (DINÁMICO)
  // ==========================================
  const parallelInvR = resistorsList.reduce((acc, r) => acc + (r > 0 ? 1 / r : 0), 0);
  const parallelRTotal = parallelInvR > 0 ? 1 / parallelInvR : 0;
  const parallelCurrents = resistorsList.map(r => (r > 0 ? circuitVoltage / r : 0));
  const parallelCurrentTotal = parallelCurrents.reduce((acc, i) => acc + i, 0);

  // ==========================================
  // 4. MODO CIRCUITO MIXTO (SERIE DINÁMICO + PARALELO DINÁMICO)
  // ==========================================
  const [mixedVoltage, setMixedVoltage] = useState<number>(50);
  const [mixedSeriesList, setMixedSeriesList] = useState<number[]>([10, 50]); // Resistencias en serie (R1, R2...)
  const [mixedParallelList, setMixedParallelList] = useState<number[]>([40, 60, 60]); // Ramas en paralelo (R3, R4, R5...)

  // Handlers para Resistencias en Serie
  const handleAddMixedSeriesResistor = () => {
    if (mixedSeriesList.length >= 10) return;
    setMixedSeriesList(prev => [...prev, 25]);
  };

  const handleRemoveMixedSeriesResistor = (index: number) => {
    if (mixedSeriesList.length <= 1) return;
    setMixedSeriesList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateMixedSeriesResistor = (index: number, val: number) => {
    setMixedSeriesList(prev => prev.map((r, idx) => (idx === index ? Math.max(1, val) : r)));
  };

  // Handlers para Resistencias en Paralelo
  const handleAddMixedParallelBranch = () => {
    if (mixedParallelList.length >= 10) return;
    setMixedParallelList(prev => [...prev, 60]);
  };

  const handleRemoveMixedParallelBranch = (index: number) => {
    if (mixedParallelList.length <= 1) return;
    setMixedParallelList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateMixedParallelBranch = (index: number, val: number) => {
    setMixedParallelList(prev => prev.map((r, idx) => (idx === index ? Math.max(1, val) : r)));
  };

  // Restablecer al ejercicio típico de clase (R1=10, R2=50, R3=40, R4=60, R5=60, V=50)
  const handleResetMixedCircuit = () => {
    setMixedVoltage(50);
    setMixedSeriesList([10, 50]);
    setMixedParallelList([40, 60, 60]);
  };

  // Cálculos del Circuito Mixto
  const mixedSeriesTotal = mixedSeriesList.reduce((acc, r) => acc + (r > 0 ? r : 0), 0);
  const mixedInvRp = mixedParallelList.reduce((acc, r) => acc + (r > 0 ? 1 / r : 0), 0);
  const mixedRp = mixedInvRp > 0 ? 1 / mixedInvRp : 0;
  const mixedRTotal = mixedSeriesTotal + mixedRp;
  const mixedITotal = mixedRTotal > 0 ? mixedVoltage / mixedRTotal : 0;

  // Tensiones individuales en cada resistor serie: V(Ri) = iT * Ri
  const mixedSeriesVoltages = mixedSeriesList.map(r => mixedITotal * r);

  // Tensión común en el bloque paralelo: Vp = iT * Rp
  const mixedVParallel = mixedITotal * mixedRp;

  // Corrientes individuales por rama en paralelo: i(Rj) = Vp / Rj
  const mixedBranches = mixedParallelList.map((r, idx) => {
    const i = r > 0 ? mixedVParallel / r : 0;
    const id = mixedSeriesList.length + idx + 1;
    return {
      id,
      name: `R${id}`,
      r,
      v: mixedVParallel,
      i,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Selector superior de Modo de Cálculo */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500">Tipo de circuito a calcular:</span>
          <div className="flex flex-wrap rounded-lg bg-slate-100 p-1 border border-slate-200 gap-1">
            <button
              onClick={() => setCalcMode('ohm')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                calcMode === 'ohm'
                  ? 'bg-white text-teal-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ley de Ohm
            </button>
            <button
              onClick={() => setCalcMode('series')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                calcMode === 'series'
                  ? 'bg-white text-teal-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Circuito en Serie
            </button>
            <button
              onClick={() => setCalcMode('parallel')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                calcMode === 'parallel'
                  ? 'bg-white text-teal-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Circuito en Paralelo
            </button>
            <button
              onClick={() => setCalcMode('mixed')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                calcMode === 'mixed'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Circuito Mixto
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. MODO LEY DE OHM (SOLO CALCULADORA DIRECTA) */}
      {/* ======================================================== */}
      {calcMode === 'ohm' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">¿Qué variable deseas calcular?</h3>
              <p className="text-xs text-slate-500">Selecciona la incógnita para realizar el despeje y cálculo automático</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200">
              V = I × R
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setUnknown('V')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                unknown === 'V' ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono font-bold">V</span>
                {unknown === 'V' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
              </div>
              <span className="text-sm font-bold text-slate-800 mt-1 block">Voltaje (V)</span>
            </button>

            <button
              onClick={() => setUnknown('I')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                unknown === 'I' ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono font-bold">I</span>
                {unknown === 'I' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
              </div>
              <span className="text-sm font-bold text-slate-800 mt-1 block">Corriente (I)</span>
            </button>

            <button
              onClick={() => setUnknown('R')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                unknown === 'R' ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono font-bold">R</span>
                {unknown === 'R' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
              </div>
              <span className="text-sm font-bold text-slate-800 mt-1 block">Resistencia (R)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {unknown !== 'V' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Voltaje de la fuente (V)</label>
                <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <input
                    type="number"
                    step="0.5"
                    value={voltage}
                    onChange={(e) => setVoltage(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none font-mono"
                  />
                  <span className="px-3.5 py-2.5 bg-slate-50 border-l border-slate-100 text-xs font-bold text-slate-500 flex items-center">V</span>
                </div>
              </div>
            )}

            {unknown !== 'I' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Corriente eléctrica (I)</label>
                <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <input
                    type="number"
                    step="0.005"
                    value={current}
                    onChange={(e) => setCurrent(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none font-mono"
                  />
                  <span className="px-3.5 py-2.5 bg-slate-50 border-l border-slate-100 text-xs font-bold text-slate-500 flex items-center">A</span>
                </div>
              </div>
            )}

            {unknown !== 'R' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Resistencia equivalente (R)</label>
                <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <input
                    type="number"
                    step="10"
                    value={resistance}
                    onChange={(e) => setResistance(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none font-mono"
                  />
                  <span className="px-3.5 py-2.5 bg-slate-50 border-l border-slate-100 text-xs font-bold text-slate-500 flex items-center">Ω</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-teal-800 tracking-wider uppercase block">
                {unknown === 'V' ? 'VOLTAJE CALCULADO' : unknown === 'I' ? 'CORRIENTE CALCULADA' : 'RESISTENCIA CALCULADA'}
              </span>
              <div className="text-3xl font-black text-teal-700 tracking-tight mt-0.5 font-mono">
                {unknown === 'V' && `${formatNumber(calculatedV, 2)} V`}
                {unknown === 'I' && `${formatNumber(calculatedI, 4)} A (${formatNumber(calculatedI * 1000, 1)} mA)`}
                {unknown === 'R' && `${formatNumber(calculatedR, 2)} Ω`}
              </div>
            </div>
            <div className="text-xs font-mono font-semibold text-teal-800 bg-white/80 px-4 py-2.5 rounded-xl border border-teal-200 shadow-2xs">
              {unknown === 'V' && 'V = I × R'}
              {unknown === 'I' && 'I = V / R'}
              {unknown === 'R' && 'R = V / I'}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MODO CIRCUITO EN SERIE (ESQUEMA ESTÁTICO LIMPIO) */}
      {/* ======================================================== */}
      {calcMode === 'series' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inputs */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">
                    Parámetros en Serie
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">Fuente y Resistencias</h3>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Voltaje Total (V)</label>
                  <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={circuitVoltage}
                      onChange={(e) => setCircuitVoltage(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3.5 py-2 text-sm font-semibold text-slate-800 focus:outline-none font-mono"
                    />
                    <span className="px-3 py-2 bg-slate-50 border-l border-slate-100 text-xs font-bold text-slate-500 flex items-center">V</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Resistencias ({resistorsList.length})</span>
                    <button
                      onClick={handleAddResistor}
                      disabled={resistorsList.length >= 10}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                    {resistorsList.map((rVal, idx) => (
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
                        {resistorsList.length > 1 && (
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

              <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/60 text-xs text-teal-900 leading-relaxed">
                ℹ En serie, la resistencia total es la suma directa y circula la misma corriente por todos los elementos.
              </div>
            </div>

            {/* Diagrama Esquemático con Cálculos (Estático y sin advertencias) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">Diagrama interactivo</span>
                    <h3 className="text-base font-bold text-slate-900">Circuito en Serie con magnitudes en cada resistor</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    {resistorsList.length} elementos
                  </span>
                </div>

                {/* Diagrama SVG Serie Estático y Limpio */}
                <div className="w-full h-56 bg-slate-50/70 rounded-xl border border-slate-200/60 p-2 flex items-center justify-center relative">
                  <svg viewBox="0 0 540 180" className="w-full h-full">
                    {/* Cableado estático */}
                    <rect x="50" y="30" width="440" height="120" fill="none" stroke="#0d9488" strokeWidth="2.5" rx="6" />

                    {/* Fuente */}
                    <g transform="translate(50, 90)">
                      <circle cx="0" cy="0" r="20" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
                      <text x="0" y="-4" fill="#0d9488" fontSize="13" fontWeight="bold" textAnchor="middle">+</text>
                      <line x1="-6" y1="7" x2="6" y2="7" stroke="#0d9488" strokeWidth="2.5" />
                      <text x="-28" y="4" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="end">{circuitVoltage} V</text>
                    </g>

                    {/* Resistores con color uniforme teal */}
                    {resistorsList.map((r, idx) => {
                      const spacing = 440 / (resistorsList.length + 1);
                      const posX = 50 + spacing * (idx + 1);
                      const vDrop = seriesVoltages[idx] || 0;
                      return (
                        <g key={idx} transform={`translate(${posX}, 30)`}>
                          <rect x="-24" y="-12" width="48" height="24" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" rx="3" />
                          <text x="0" y="-18" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle">R{idx + 1}</text>
                          <text x="0" y="3" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">{r} Ω</text>
                          <text x="0" y="24" fill="#0d9488" fontSize="8" fontWeight="bold" textAnchor="middle">{formatNumber(vDrop, 1)} V</text>
                        </g>
                      );
                    })}

                    {/* Corriente central */}
                    <g transform="translate(270, 90)">
                      <rect x="-80" y="-12" width="160" height="24" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                      <text x="0" y="4" fill="#0284c7" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        iT = i₁ = i₂ = i₃ =  {formatNumber(seriesCurrent, 3)} A
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Resumen Final */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200/80 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Voltaje Total (VT)</span>
                    <span className="text-base font-extrabold text-slate-900 font-mono">{circuitVoltage} V</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Resistencia Total (RT)</span>
                    <span className="text-base font-extrabold text-slate-900 font-mono">{formatNumber(seriesRTotal, 1)} Ω</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-teal-800 uppercase block">Corriente Total (iT)</span>
                    <span className="text-base font-extrabold text-teal-700 font-mono">{formatNumber(seriesCurrent, 3)} A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Criterios de Diseño (Serie) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Criterios de diseño (Circuito en Serie)
                  </h4>
                  <p className="text-xs text-slate-500">Demostración analítica de los 3 criterios de diseño de la Ley de Ohm</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {/* Criterio 1: VT = V1 + V2 + V3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-slate-500 font-sans font-bold block text-[11px] uppercase">
                    1. Criterio de Tensión (VT)
                  </span>
                  <p className="text-teal-700 font-sans font-bold text-sm mt-1">
                    VT = V₁ + V₂ + ... + Vn
                  </p>
                  <p className="text-slate-600 font-sans text-xs mt-1">
                    La tensión total suministrada es la suma de las tensiones en cada resistencia:
                  </p>
                  <div className="text-slate-700 mt-2 text-[11px] space-y-1.5 font-mono">
                    {resistorsList.map((r, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-white border border-slate-200/70">
                        <div>• V{idx + 1} = iT × R{idx + 1}</div>
                        <div>• V{idx + 1} = {formatNumber(seriesCurrent, 4)} A × {r} Ω</div>
                        <div className="font-bold text-teal-700">V{idx + 1} = {formatNumber(seriesVoltages[idx], 2)} V</div>
                      </div>
                    ))}
                    <div className="pt-1 text-slate-800 font-bold">
                      VT = ({seriesVoltages.map(v => `${formatNumber(v, 2)}`).join(' + ')}) V
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 font-bold text-teal-700 text-sm">
                  VT = {circuitVoltage} V
                </div>
              </div>

              {/* Criterio 2: RT = R1 + R2 + R3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-slate-500 font-sans font-bold block text-[11px] uppercase">
                    2. Criterio de Resistencia (RT)
                  </span>
                  <p className="text-teal-700 font-sans font-bold text-sm mt-1">
                    RT = R₁ + R₂ + ... + Rn
                  </p>
                  <p className="text-slate-600 font-sans text-xs mt-1">
                    La resistencia total equivalente es la suma directa de todas las resistencias:
                  </p>
                  <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-700 mt-2 text-[11px] space-y-1">
                    <div>Fórmula: RT = Σ Ri</div>
                    <div>Sustitución con valores:</div>
                    <div className="text-slate-900 font-bold">
                      RT = {resistorsList.map((r, idx) => `R${idx + 1}(${r} Ω)`).join(' + ')}
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 font-bold text-teal-700 text-sm">
                  RT = {formatNumber(seriesRTotal, 1)} Ω
                </div>
              </div>

              {/* Criterio 3: iT = i1 = i2 = i3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-slate-500 font-sans font-bold block text-[11px] uppercase">
                    3. Criterio de Corriente (iT)
                  </span>
                  <p className="text-teal-700 font-sans font-bold text-sm mt-1">
                    iT = i₁ = i₂ = ... = in
                  </p>
                  <p className="text-slate-600 font-sans text-xs mt-1">
                    La corriente es constante e idéntica en toda la trayectoria cerrada:
                  </p>
                  <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-700 mt-2 text-[11px] space-y-1 font-mono">
                    <div>Ley de Ohm: iT = VT / RT</div>
                    <div>Sustitución: iT = {circuitVoltage} V / {formatNumber(seriesRTotal, 1)} Ω</div>
                    <div className="font-bold text-teal-800">iT = {formatNumber(seriesCurrent, 4)} A</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 font-bold text-teal-700 text-sm">
                  iT = {formatNumber(seriesCurrent, 4)} A
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MODO CIRCUITO EN PARALELO (ESQUEMA ESTÁTICO LIMPIO) */}
      {/* ======================================================== */}
      {calcMode === 'parallel' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inputs */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">
                    Parámetros en Paralelo
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">Fuente y Ramas</h3>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Voltaje Común (V)</label>
                  <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={circuitVoltage}
                      onChange={(e) => setCircuitVoltage(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3.5 py-2 text-sm font-semibold text-slate-800 focus:outline-none font-mono"
                    />
                    <span className="px-3 py-2 bg-slate-50 border-l border-slate-100 text-xs font-bold text-slate-500 flex items-center">V</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Ramas ({resistorsList.length})</span>
                    <button
                      onClick={handleAddResistor}
                      disabled={resistorsList.length >= 10}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                    {resistorsList.map((rVal, idx) => (
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
                        {resistorsList.length > 1 && (
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

              <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/60 text-xs text-teal-900 leading-relaxed">
                ℹ En paralelo, todas las ramas están sometidas a la misma tensión y la corriente total se divide entre ellas.
              </div>
            </div>

            {/* Diagrama Esquemático Paralelo (Estático y sin advertencias) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">Diagrama interactivo</span>
                    <h3 className="text-base font-bold text-slate-900">Circuito en Paralelo con corrientes por rama</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    {resistorsList.length} ramas
                  </span>
                </div>

                {/* Diagrama SVG Paralelo Estático y Limpio */}
                <div className="w-full h-56 bg-slate-50/70 rounded-xl border border-slate-200/60 p-2 flex items-center justify-center relative">
                  <svg viewBox="0 0 540 180" className="w-full h-full">
                    <line x1="60" y1="30" x2="480" y2="30" stroke="#0d9488" strokeWidth="2.5" />
                    <line x1="60" y1="150" x2="480" y2="150" stroke="#0d9488" strokeWidth="2.5" />
                    <line x1="60" y1="30" x2="60" y2="150" stroke="#0d9488" strokeWidth="2.5" />

                    {/* Fuente */}
                    <g transform="translate(60, 90)">
                      <circle cx="0" cy="0" r="20" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
                      <text x="0" y="-4" fill="#0d9488" fontSize="13" fontWeight="bold" textAnchor="middle">+</text>
                      <line x1="-6" y1="7" x2="6" y2="7" stroke="#0d9488" strokeWidth="2.5" />
                      <text x="-26" y="4" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="end">{circuitVoltage} V</text>
                    </g>

                    {/* Ramas verticales con datos */}
                    {resistorsList.map((r, idx) => {
                      const spacing = 420 / (resistorsList.length + 1);
                      const posX = 60 + spacing * (idx + 1);
                      const branchI = parallelCurrents[idx] || 0;
                      return (
                        <g key={idx}>
                          <line x1={posX} y1="30" x2={posX} y2="150" stroke="#0d9488" strokeWidth="2" />
                          <circle cx={posX} cy="30" r="3" fill="#0d9488" />
                          <circle cx={posX} cy="150" r="3" fill="#0d9488" />

                          {/* Corriente sobre la rama */}
                          <text x={posX} y="20" fill="#0284c7" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                            i{idx + 1} = {formatNumber(branchI, 3)} A
                          </text>

                          {/* Resistor en la rama con color uniforme teal */}
                          <g transform={`translate(${posX}, 90)`}>
                            <rect x="-11" y="-18" width="22" height="36" fill="#ffffff" stroke="#0d9488" strokeWidth="2" rx="3" />
                            <text x="15" y="-5" fill="#0f172a" fontSize="9" fontWeight="bold">R{idx + 1}</text>
                            <text x="15" y="6" fill="#64748b" fontSize="8" fontFamily="monospace">{r} Ω</text>
                            <text x="15" y="17" fill="#0d9488" fontSize="7" fontWeight="bold">{circuitVoltage} V</text>
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Resumen Final */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200/80 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Voltaje Total (VT)</span>
                    <span className="text-base font-extrabold text-slate-900 font-mono">{circuitVoltage} V</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Resistencia Total (RT)</span>
                    <span className="text-base font-extrabold text-slate-900 font-mono">{formatNumber(parallelRTotal, 2)} Ω</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-teal-800 uppercase block">Corriente Total (iT)</span>
                    <span className="text-base font-extrabold text-teal-700 font-mono">{formatNumber(parallelCurrentTotal, 3)} A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Criterios de Diseño (Paralelo) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Criterios de diseño (Circuito en Paralelo)
                  </h4>
                  <p className="text-xs text-slate-500">Desarrollo analítico de los 3 criterios de diseño de la Ley de Ohm en ramas paralelas</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {/* Criterio 1: VT = V1 = V2 = ... */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-slate-500 font-sans font-bold block text-[11px] uppercase">
                    1. Criterio de Tensión (VT)
                  </span>
                  <p className="text-teal-700 font-sans font-bold text-sm mt-1">
                    VT = V₁ = V₂ = ... = Vn
                  </p>
                  <p className="text-slate-600 font-sans text-xs mt-1">
                    De los criterios de diseño, todas las ramas comparten los mismos nodos principales:
                  </p>
                  <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-700 mt-2 text-[11px] space-y-1 font-mono">
                    <div>VT = V_fuente = {circuitVoltage} V</div>
                    <div className="space-y-0.5 pt-1">
                      {resistorsList.map((_, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>• V{idx + 1} (Rama {idx + 1}):</span>
                          <strong className="text-teal-700">{circuitVoltage} V</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 font-bold text-teal-700 text-sm">
                  VT = {circuitVoltage} V (Común)
                </div>
              </div>

              {/* Criterio 2: 1/RT = 1/R1 + 1/R2 + ... */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-slate-500 font-sans font-bold block text-[11px] uppercase">
                    2. Criterio de Resistencia (Re / RT)
                  </span>
                  <p className="text-teal-700 font-sans font-bold text-sm mt-1">
                    1/Re = 1/R₁ + 1/R₂ + ... + 1/Rn
                  </p>
                  <p className="text-slate-600 font-sans text-xs mt-1">
                    Sustitución analítica y artificio matemático:
                  </p>
                  <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-700 mt-2 text-[11px] space-y-1 font-mono">
                    <div>1/Re = {resistorsList.map(r => `1/${r}`).join(' + ')}</div>
                    <div>1/Re = {formatNumber(parallelInvR, 5)} S (Ω⁻¹)</div>
                    <div className="italic text-[10px] text-slate-500 pt-1">
                      Nos vamos a auxiliar del artificio matemático de inversión:
                    </div>
                    <div className="font-bold text-teal-800">
                      Re = 1 / ({formatNumber(parallelInvR, 5)}) = {formatNumber(parallelRTotal, 2)} Ω
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 font-bold text-teal-700 text-sm">
                  Re = {formatNumber(parallelRTotal, 2)} Ω
                </div>
              </div>

              {/* Criterio 3: iT = i1 + i2 + ... */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-slate-500 font-sans font-bold block text-[11px] uppercase">
                    3. Criterio de Corriente (iT)
                  </span>
                  <p className="text-teal-700 font-sans font-bold text-sm mt-1">
                    iT = i₁ + i₂ + ... + in
                  </p>
                  <p className="text-slate-600 font-sans text-xs mt-1">
                    Intensidad de corriente en cada una de las resistencias:
                  </p>
                  <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-700 mt-2 text-[11px] space-y-1.5 font-mono">
                    {resistorsList.map((r, idx) => (
                      <div key={idx} className="border-b border-slate-100 pb-1 last:border-none last:pb-0">
                        <div>• i{idx + 1} = V{idx + 1} / R{idx + 1}</div>
                        <div>• i{idx + 1} = {circuitVoltage} V / {r} Ω = <strong className="text-teal-700">{formatNumber(parallelCurrents[idx], 3)} A</strong></div>
                      </div>
                    ))}
                    <div className="pt-1 text-slate-900 font-bold">
                      iT = ({parallelCurrents.map(i => formatNumber(i, 3)).join(' + ')}) A
                    </div>
                    <div className="font-bold text-teal-800">
                      iT = {formatNumber(parallelCurrentTotal, 3)} A
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 font-bold text-teal-700 text-sm">
                  iT = {formatNumber(parallelCurrentTotal, 3)} A
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODO CIRCUITO MIXTO (ESQUEMA ESTÁTICO Y SIN ADVERTENCIAS) */}
      {/* ======================================================== */}
      {calcMode === 'mixed' && (
        <div className="space-y-6">
          {/* Fila Principal: Panel de Configuración + Diagrama Esquemático Claro */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Panel de Configuración */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">
                      Parámetros Mixtos
                    </span>
                    <h3 className="text-base font-bold text-slate-900">Fuente y Resistencias</h3>
                  </div>
                  <button
                    onClick={handleResetMixedCircuit}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 text-xs font-semibold transition-colors"
                    title="Restablecer al ejercicio de referencia (R1 a R5)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ejemplo R1-R5</span>
                  </button>
                </div>

                {/* Voltaje de la fuente */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Voltaje de la Fuente (V)</label>
                  <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={mixedVoltage}
                      onChange={(e) => setMixedVoltage(Math.max(1, parseFloat(e.target.value) || 1))}
                      className="w-full px-3.5 py-2 text-sm font-semibold text-slate-800 focus:outline-none font-mono"
                    />
                    <span className="px-3 py-2 bg-slate-50 border-l border-slate-100 text-xs font-bold text-slate-500 flex items-center">V</span>
                  </div>
                </div>

                {/* 1. Resistencias en Serie (Dinámicas) */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        1. Resistencias en Serie ({mixedSeriesList.length})
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Atraviesan la corriente total del circuito
                      </span>
                    </div>
                    <button
                      onClick={handleAddMixedSeriesResistor}
                      disabled={mixedSeriesList.length >= 10}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-[11px] font-bold transition-all disabled:opacity-50"
                      title="Añadir resistor en serie"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Añadir Serie</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {mixedSeriesList.map((rVal, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-700 font-mono w-9">R{idx + 1}</span>
                        <div className="flex-1 flex rounded-md border border-slate-200 bg-white overflow-hidden">
                          <input
                            type="number"
                            min="1"
                            step="5"
                            value={rVal}
                            onChange={(e) => handleUpdateMixedSeriesResistor(idx, parseFloat(e.target.value) || 1)}
                            className="w-full px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none font-mono"
                          />
                          <span className="px-2 py-1 bg-slate-50 border-l border-slate-100 text-[11px] font-bold text-slate-500 flex items-center">Ω</span>
                        </div>
                        {mixedSeriesList.length > 1 && (
                          <button
                            onClick={() => handleRemoveMixedSeriesResistor(idx)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                            title="Eliminar resistor serie"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-teal-800 font-mono pt-1 border-t border-slate-200/60">
                    <span>Suma Serie (R_serie):</span>
                    <strong className="text-teal-700">{mixedSeriesTotal.toFixed(2)} Ω</strong>
                  </div>
                </div>

                {/* 2. Bloque en Paralelo (Dinámico) */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        2. Bloque en Paralelo ({mixedParallelList.length} ramas)
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Comparten la misma tensión común (Vp)
                      </span>
                    </div>
                    <button
                      onClick={handleAddMixedParallelBranch}
                      disabled={mixedParallelList.length >= 10}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-[11px] font-bold transition-all disabled:opacity-50"
                      title="Añadir rama en paralelo"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Añadir Paralelo</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {mixedParallelList.map((rVal, idx) => {
                      const branchNum = mixedSeriesList.length + idx + 1;
                      return (
                        <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-xs font-bold text-slate-700 font-mono w-9">R{branchNum}</span>
                          <div className="flex-1 flex rounded-md border border-slate-200 bg-white overflow-hidden">
                            <input
                              type="number"
                              min="1"
                              step="5"
                              value={rVal}
                              onChange={(e) => handleUpdateMixedParallelBranch(idx, parseFloat(e.target.value) || 1)}
                              className="w-full px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none font-mono"
                            />
                            <span className="px-2 py-1 bg-slate-50 border-l border-slate-100 text-[11px] font-bold text-slate-500 flex items-center">Ω</span>
                          </div>
                          {mixedParallelList.length > 1 && (
                            <button
                              onClick={() => handleRemoveMixedParallelBranch(idx)}
                              className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                              title="Eliminar rama paralela"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-teal-800 font-mono pt-1 border-t border-slate-200/60">
                    <span>Equivalente Rp:</span>
                    <strong className="text-teal-700">{formatNumber(mixedRp, 2)} Ω</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel del Diagrama Visual Esquemático */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">
                      Diagrama interactivo
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      Circuito Mixto con magnitudes en cada resistor
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 font-mono">
                    It = {formatNumber(mixedITotal, 3)} A
                  </span>
                </div>

                {/* Lienzo SVG Mixto Adaptable */}
                <div className="w-full h-64 sm:h-72 bg-slate-50/70 rounded-xl border border-slate-200/60 p-2 flex items-center justify-center relative">
                  <svg viewBox="0 0 680 230" className="w-full h-full">
                    {(() => {
                      const numSeries = mixedSeriesList.length;
                      const topSeriesCount = Math.ceil(numSeries / 2);
                      const bottomSeriesCount = numSeries - topSeriesCount;

                      // Posicionamiento de inicio y fin del bloque paralelo
                      const xParallelStart = topSeriesCount === 1 ? 210 : topSeriesCount === 2 ? 270 : 320;
                      const numBranches = mixedParallelList.length;
                      const maxAvailable = 640 - xParallelStart;
                      const branchSpacing =
                        numBranches <= 1
                          ? 0
                          : Math.min(100, Math.max(65, (maxAvailable - 20) / (numBranches - 1)));
                      const xParallelEnd =
                        numBranches <= 1 ? xParallelStart + 70 : xParallelStart + (numBranches - 1) * branchSpacing;

                      // Línea principal superior y retorno inferior
                      const yTop = 45;
                      const yBottom = 185;

                      // Coordenadas x para resistores serie superiores
                      const topPositions: number[] = [];
                      for (let i = 0; i < topSeriesCount; i++) {
                        const step = (xParallelStart - 50) / (topSeriesCount + 1);
                        topPositions.push(50 + step * (i + 1));
                      }

                      // Coordenadas x para resistores serie inferiores
                      const bottomPositions: number[] = [];
                      for (let j = 0; j < bottomSeriesCount; j++) {
                        const step = (xParallelStart - 50) / (bottomSeriesCount + 1);
                        bottomPositions.push(50 + step * (j + 1));
                      }

                      return (
                        <g>
                          {/* Cableado general */}
                          {/* Riel superior continuo */}
                          <line x1="50" y1={yTop} x2={xParallelEnd} y2={yTop} stroke="#0d9488" strokeWidth="2.5" />
                          {/* Riel inferior continuo */}
                          <line x1="50" y1={yBottom} x2={xParallelEnd} y2={yBottom} stroke="#0d9488" strokeWidth="2.5" />

                          {/* Conexión vertical de la fuente en el lado izquierdo */}
                          <line x1="50" y1={yTop} x2="50" y2="92" stroke="#0d9488" strokeWidth="2.5" />
                          <line x1="50" y1="138" x2="50" y2={yBottom} stroke="#0d9488" strokeWidth="2.5" />

                          {/* Ramas verticales en paralelo */}
                          {mixedBranches.map((branch, idx) => {
                            const xBranch = numBranches <= 1 ? xParallelStart : xParallelStart + idx * branchSpacing;
                            return (
                              <g key={`branch-wire-${idx}`}>
                                <line x1={xBranch} y1={yTop} x2={xBranch} y2={yBottom} stroke="#0d9488" strokeWidth="2" />
                                {/* Nodos de conexión (superior e inferior) */}
                                <circle cx={xBranch} cy={yTop} r="3.5" fill="#0d9488" />
                                <circle cx={xBranch} cy={yBottom} r="3.5" fill="#0d9488" />
                              </g>
                            );
                          })}

                          {/* Fuente de Voltaje (x=50, y=115) */}
                          <g transform="translate(50, 115)">
                            <circle cx="0" cy="0" r="19" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
                            <text x="0" y="-3" fill="#0d9488" fontSize="13" fontWeight="bold" textAnchor="middle">+</text>
                            <line x1="-6" y1="7" x2="6" y2="7" stroke="#0d9488" strokeWidth="2.5" />
                            <text x="-25" y="4" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="end">{mixedVoltage} V</text>
                          </g>

                          {/* Resistores en Serie Superiores */}
                          {topPositions.map((xPos, i) => {
                            const rVal = mixedSeriesList[i];
                            const vVal = mixedSeriesVoltages[i];
                            return (
                              <g key={`top-series-${i}`} transform={`translate(${xPos}, ${yTop})`}>
                                <rect
                                  x="-26"
                                  y="-12"
                                  width="52"
                                  height="24"
                                  fill="#ffffff"
                                  stroke="#0d9488"
                                  strokeWidth="2.5"
                                  rx="3"
                                />
                                <text x="0" y="-17" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">
                                  R{i + 1} (Serie)
                                </text>
                                <text x="0" y="3" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">
                                  {rVal} Ω
                                </text>
                                <text x="0" y="22" fill="#0d9488" fontSize="8" fontWeight="bold" textAnchor="middle">
                                  {formatNumber(vVal, 1)} V
                                </text>
                              </g>
                            );
                          })}

                          {/* Resistores en Serie Inferiores */}
                          {bottomPositions.map((xPos, j) => {
                            const actualIdx = topSeriesCount + j;
                            const rVal = mixedSeriesList[actualIdx];
                            const vVal = mixedSeriesVoltages[actualIdx];
                            return (
                              <g key={`bottom-series-${j}`} transform={`translate(${xPos}, ${yBottom})`}>
                                <rect
                                  x="-26"
                                  y="-12"
                                  width="52"
                                  height="24"
                                  fill="#ffffff"
                                  stroke="#0d9488"
                                  strokeWidth="2.5"
                                  rx="3"
                                />
                                <text x="0" y="-17" fill="#0d9488" fontSize="8" fontWeight="bold" textAnchor="middle">
                                  {formatNumber(vVal, 1)} V
                                </text>
                                <text x="0" y="3" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">
                                  {rVal} Ω
                                </text>
                                <text x="0" y="23" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">
                                  R{actualIdx + 1} (Serie)
                                </text>
                              </g>
                            );
                          })}

                          {/* Resistores en las Ramas del Bloque en Paralelo */}
                          {mixedBranches.map((branch, idx) => {
                            const xBranch = numBranches <= 1 ? xParallelStart : xParallelStart + idx * branchSpacing;
                            return (
                              <g key={`branch-res-${idx}`} transform={`translate(${xBranch}, 115)`}>
                                <rect
                                  x="-26"
                                  y="-11"
                                  width="52"
                                  height="22"
                                  fill="#ffffff"
                                  stroke="#0d9488"
                                  strokeWidth="2"
                                  rx="3"
                                />
                                <text x="0" y="-16" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">
                                  {branch.name} ({branch.r} Ω)
                                </text>
                                <text x="0" y="3" fill="#0284c7" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                  {formatNumber(branch.i, 3)} A
                                </text>
                                <text x="0" y="21" fill="#0d9488" fontSize="7" fontWeight="bold" textAnchor="middle">
                                  {formatNumber(mixedVParallel, 1)} V
                                </text>
                              </g>
                            );
                          })}

                          {/* Indicador inferior de valores equivalentes */}
                          <g transform="translate(340, 215)">
                            <rect x="-170" y="-10" width="340" height="20" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                            <text x="0" y="3" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                              Vp = {formatNumber(mixedVParallel, 2)} V · Rp = {formatNumber(mixedRp, 2)} Ω · R_serie = {mixedSeriesTotal.toFixed(1)} Ω · RT = {formatNumber(mixedRTotal, 1)} Ω
                            </text>
                          </g>
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                {/* Resumen Final de 3 Métricas */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200/80 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Resistencia Total</span>
                    <span className="text-base font-extrabold text-slate-900 font-mono">{formatNumber(mixedRTotal, 1)} Ω</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-teal-800 uppercase block">Corriente Total</span>
                    <span className="text-base font-extrabold text-teal-700 font-mono">{formatNumber(mixedITotal, 3)} A</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Voltaje de Fuente</span>
                    <span className="text-base font-extrabold text-slate-900 font-mono">{mixedVoltage} V</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Criterios de Diseño (Circuito Mixto) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Criterios de diseño (Circuito Mixto)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Desarrollo analítico de los 3 criterios de diseño de la Ley de Ohm combinando serie y paralelo
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {/* Criterio 1: VT = Σ V(serie) + Vp */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-slate-500 font-sans font-bold block text-[11px] uppercase">
                    1. Criterio de Tensión (VT)
                  </span>
                  <p className="text-teal-700 font-sans font-bold text-sm mt-1">
                    VT = Σ V(serie) + Vp
                  </p>
                  <p className="text-slate-600 font-sans text-xs mt-1">
                    Tensión calculada en cada etapa:
                  </p>
                  <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-700 mt-2 text-[11px] space-y-1.5 font-mono">
                    {mixedSeriesList.map((r, i) => (
                      <div key={i}>
                        • V(R{i + 1}) = iT × R{i + 1} = {formatNumber(mixedITotal, 4)} A × {r} Ω = <strong className="text-teal-700">{formatNumber(mixedSeriesVoltages[i], 2)} V</strong>
                      </div>
                    ))}
                    <div>
                      • Vp = iT × Rp = {formatNumber(mixedITotal, 4)} A × {formatNumber(mixedRp, 2)} Ω = <strong className="text-teal-700">{formatNumber(mixedVParallel, 2)} V</strong>
                    </div>
                    <div className="pt-1 text-slate-900 font-bold border-t border-slate-100">
                      VT = ({mixedSeriesVoltages.map(v => formatNumber(v, 2)).join(' + ')} + {formatNumber(mixedVParallel, 2)}) V
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 font-bold text-teal-700 text-sm">
                  VT = {mixedVoltage} V (Balance Verificado)
                </div>
              </div>

              {/* Criterio 2: RT = R_serie + Rp */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-slate-500 font-sans font-bold block text-[11px] uppercase">
                    2. Criterio de Resistencia (RT)
                  </span>
                  <p className="text-teal-700 font-sans font-bold text-sm mt-1">
                    RT = R_serie + Rp
                  </p>
                  <p className="text-slate-600 font-sans text-xs mt-1">
                    Procedimiento de reducción paso a paso:
                  </p>
                  <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-700 mt-2 text-[11px] space-y-1.5 font-mono">
                    <div>1. Bloque Paralelo (Rp):</div>
                    <div className="text-[10px] text-slate-600">
                      1/Rp = {mixedParallelList.map(r => `1/${r}`).join(' + ')}
                    </div>
                    <div>
                      Rp = 1 / ({formatNumber(mixedInvRp, 5)}) = <strong className="text-teal-700">{formatNumber(mixedRp, 2)} Ω</strong>
                    </div>
                    <div className="pt-1 border-t border-slate-100">2. Suma en Serie:</div>
                    <div className="text-slate-900 font-bold">
                      R_serie = {mixedSeriesList.map((r, i) => `R${i + 1}(${r} Ω)`).join(' + ')} = {formatNumber(mixedSeriesTotal, 2)} Ω
                    </div>
                    <div className="pt-1 border-t border-slate-100">3. Resistencia Total Equivalente:</div>
                    <div className="text-teal-800 font-bold">
                      RT = {formatNumber(mixedSeriesTotal, 2)} + {formatNumber(mixedRp, 2)} = {formatNumber(mixedRTotal, 2)} Ω
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 font-bold text-teal-700 text-sm">
                  RT = {formatNumber(mixedRTotal, 2)} Ω
                </div>
              </div>

              {/* Criterio 3: iT = VT / RT */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-slate-500 font-sans font-bold block text-[11px] uppercase">
                    3. Criterio de Corriente (iT)
                  </span>
                  <p className="text-teal-700 font-sans font-bold text-sm mt-1">
                    iT = VT / RT
                  </p>
                  <p className="text-slate-600 font-sans text-xs mt-1">
                    Corriente total y distribución en ramas:
                  </p>
                  <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-700 mt-2 text-[11px] space-y-1 font-mono">
                    <div>
                      iT = {mixedVoltage} V / {formatNumber(mixedRTotal, 2)} Ω = <strong className="text-teal-800">{formatNumber(mixedITotal, 4)} A</strong>
                    </div>
                    <div className="pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                      Corriente en resistores serie = {formatNumber(mixedITotal, 4)} A
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Corrientes por rama paralela (Vp / Ri):
                    </div>
                    {mixedBranches.map((b, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• i({b.name}): {formatNumber(mixedVParallel, 2)} V / {b.r} Ω</span>
                        <strong className="text-teal-700">{formatNumber(b.i, 4)} A</strong>
                      </div>
                    ))}
                    <div className="pt-1 text-[10px] text-slate-600 border-t border-slate-100">
                      • Σ i_ramas = {formatNumber(mixedBranches.reduce((acc, b) => acc + b.i, 0), 4)} A ≅ iT
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 font-bold text-teal-700 text-sm">
                  iT = {formatNumber(mixedITotal, 4)} A
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
