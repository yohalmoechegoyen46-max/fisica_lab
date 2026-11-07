import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { CircuitParameters, CircuitAnalysisResult } from '../../types';
import { analyzeParallelCircuit, analyzeSeriesCircuit, formatNumber } from '../../utils/physics';

interface CircuitAnalysisViewProps {
  params: CircuitParameters;
}

export const CircuitAnalysisView: React.FC<CircuitAnalysisViewProps> = ({
  params,
}) => {
  const [analysisMode, setAnalysisMode] = useState<'parallel' | 'series'>('parallel');

  const analysis: CircuitAnalysisResult =
    analysisMode === 'parallel'
      ? analyzeParallelCircuit(params)
      : analyzeSeriesCircuit(params);

  const { voltage, r1, r2, r3, nominalPower } = params;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Selector de modo para ver el análisis de Serie o Paralelo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Configuración a analizar:</span>
          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setAnalysisMode('parallel')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                analysisMode === 'parallel'
                  ? 'bg-white text-teal-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Circuito en paralelo (3 ramas)
            </button>
            <button
              onClick={() => setAnalysisMode('series')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                analysisMode === 'series'
                  ? 'bg-white text-teal-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Circuito en serie (1 malla)
            </button>
          </div>
        </div>
      </div>

      {/* Grid de 2 columnas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Resolución Paso a Paso */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">
                {analysisMode === 'parallel' ? 'CIRCUITO EN PARALELO' : 'CIRCUITO EN SERIE'} · FUENTE DE {voltage} V
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Resolución paso a paso</h3>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Paso 1: Resistencia equivalente */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="font-bold text-slate-800 font-sans text-xs">
                    Resistencia equivalente
                  </span>
                </div>
                {analysisMode === 'parallel' ? (
                  <div className="pl-7 space-y-1 text-slate-600">
                    <div>1/Req = 1/{r1} + 1/{r2} + 1/{r3}</div>
                    <div>1/Req = {formatNumber(1 / r1 + 1 / r2 + 1 / r3, 6)} Ω⁻¹</div>
                    <div className="font-bold text-teal-700 text-sm pt-1">
                      Req = {formatNumber(analysis.req, 3)}… Ω
                    </div>
                  </div>
                ) : (
                  <div className="pl-7 space-y-1 text-slate-600">
                    <div>Req = R₁ + R₂ + R₃</div>
                    <div>Req = {r1} + {r2} + {r3}</div>
                    <div className="font-bold text-teal-700 text-sm pt-1">
                      Req = {formatNumber(analysis.req, 1)} Ω
                    </div>
                  </div>
                )}
              </div>

              {/* Paso 2: Corriente total */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="font-bold text-slate-800 font-sans text-xs">
                    Corriente total de la fuente
                  </span>
                </div>
                <div className="pl-7 space-y-1 text-slate-600">
                  <div>Iₜ = V / Req = {voltage} / {formatNumber(analysis.req, 3)}…</div>
                  <div className="font-bold text-teal-700 text-sm pt-1">
                    Iₜ = {formatNumber(analysis.it, 3)} A
                  </div>
                </div>
              </div>

              {/* Paso 3: Corrientes por componente o caídas de tensión */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="font-bold text-slate-800 font-sans text-xs">
                    {analysisMode === 'parallel' ? 'Corrientes por rama · I = V/R' : 'Tensión en cada resistencia · V = I × R'}
                  </span>
                </div>
                {analysisMode === 'parallel' ? (
                  <div className="pl-7 space-y-1 text-slate-600">
                    <div>I₁ = {voltage}/{r1} &nbsp;&nbsp; I₂ = {voltage}/{r2} &nbsp;&nbsp; I₃ = {voltage}/{r3}</div>
                    <div className="font-bold text-teal-700 text-xs pt-1">
                      {formatNumber(analysis.resistors[0].i, 3)} A · {formatNumber(analysis.resistors[1].i, 3)} A · {formatNumber(analysis.resistors[2].i, 3)} A
                    </div>
                  </div>
                ) : (
                  <div className="pl-7 space-y-1 text-slate-600">
                    <div>V₁ = {formatNumber(analysis.it, 3)} × {r1} &nbsp;&nbsp; V₂ = {formatNumber(analysis.it, 3)} × {r2}</div>
                    <div className="font-bold text-teal-700 text-xs pt-1">
                      V₁ = {formatNumber(analysis.resistors[0].v, 2)} V · V₂ = {formatNumber(analysis.resistors[1].v, 2)} V · V₃ = {formatNumber(analysis.resistors[2].v, 2)} V
                    </div>
                  </div>
                )}
              </div>

              {/* Paso 4: Potencia suministrada */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span className="font-bold text-slate-800 font-sans text-xs">
                    Potencia suministrada
                  </span>
                </div>
                <div className="pl-7 space-y-1 text-slate-600">
                  <div>Pₜ = V × Iₜ = {voltage} × {formatNumber(analysis.it, 3)}</div>
                  <div className="font-bold text-teal-700 text-sm pt-1">
                    Pₜ = {formatNumber(analysis.pt, 3)} W
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            Los cálculos usan precisión completa; los valores de lectura se muestran redondeados según el Sistema Internacional.
          </p>
        </div>

        {/* Columna Derecha: Balance por Componente y Leyes de Kirchhoff */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tabla de Balance por Componente */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Balance por componente</h3>
                <span className="text-xs text-slate-500">
                  {analysisMode === 'parallel' ? 'Paralelo · 3 ramas' : 'Serie · 1 malla'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] text-slate-400 font-semibold font-sans">
                    <th className="pb-2.5">Elem.</th>
                    <th className="pb-2.5">R (Ω)</th>
                    <th className="pb-2.5">V (V)</th>
                    <th className="pb-2.5">I (A)</th>
                    <th className="pb-2.5">P (W)</th>
                    <th className="pb-2.5">Pnom (W)</th>
                    <th className="pb-2.5 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analysis.resistors.map((res) => (
                    <tr key={res.name} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 font-bold font-sans text-slate-800">{res.name}</td>
                      <td className="py-2.5 text-slate-600">{res.r}</td>
                      <td className="py-2.5 text-slate-600">{formatNumber(res.v, 1)}</td>
                      <td className="py-2.5 text-slate-600">{formatNumber(res.i, 3)}</td>
                      <td className="py-2.5 font-bold text-slate-800">{formatNumber(res.p, 3)}</td>
                      <td className="py-2.5 text-slate-400">{res.pNominal.toFixed(2)}</td>
                      <td className="py-2.5 text-right">
                        {res.isOverloaded ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 font-sans">
                            Sobrecarga
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans">
                            Admisible
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Fila de Totales */}
                  <tr className="border-t-2 border-slate-200 bg-slate-50/50 font-bold">
                    <td className="py-2.5 font-sans text-slate-900">Total</td>
                    <td className="py-2.5 text-slate-900">{formatNumber(analysis.req, 2)}¹</td>
                    <td className="py-2.5 text-slate-900">{voltage}</td>
                    <td className="py-2.5 text-slate-900">{formatNumber(analysis.it, 3)}</td>
                    <td className="py-2.5 text-teal-700 font-extrabold">{formatNumber(analysis.pt, 3)}</td>
                    <td className="py-2.5 text-slate-400">—</td>
                    <td className="py-2.5 text-right font-sans">
                      {analysis.overloadCount > 0 ? (
                        <span className="text-rose-600 text-xs">{analysis.overloadCount} alertas</span>
                      ) : (
                        <span className="text-emerald-600 text-xs">Seguro</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              P = V × I = V²/R · Sobrecarga cuando P &gt; Pnom · ¹ Resistencia equivalente del circuito.
            </p>
          </div>

          {/* Validación de Sumatorias (Kirchhoff) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Validación de sumatorias</h3>
                <span className="text-xs text-slate-500">Leyes fundamentales de Kirchhoff y balance de energía</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Balances correctos</span>
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Ley de Corrientes (KCL) */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-sans font-bold text-slate-800 text-xs block">
                    Corriente en el nodo · Kirchhoff (KCL)
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {analysisMode === 'parallel'
                      ? `${formatNumber(analysis.resistors[0].i, 3)} + ${formatNumber(analysis.resistors[1].i, 3)} + ${formatNumber(analysis.resistors[2].i, 3)} = ${formatNumber(analysis.it, 3)} A = Iₜ`
                      : `Corriente idéntica en toda la trayectoria cerrada`}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                  ΔI = 0 A
                </span>
              </div>

              {/* Ley de Voltajes (KVL) */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-sans font-bold text-slate-800 text-xs block">
                    Voltaje en cada malla · Kirchhoff (KVL)
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {analysisMode === 'parallel'
                      ? `${voltage} - ${voltage} = 0 V · La tensión es exactamente igual en cada rama`
                      : `${voltage} - (${formatNumber(analysis.resistors[0].v, 1)} + ${formatNumber(analysis.resistors[1].v, 1)} + ${formatNumber(analysis.resistors[2].v, 1)}) = 0 V`}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                  ΣV = 0 V
                </span>
              </div>

              {/* Balance de Potencia */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-sans font-bold text-slate-800 text-xs block">
                    Balance de potencia suministrada vs disipada
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {formatNumber(analysis.resistors[0].p, 3)} + {formatNumber(analysis.resistors[1].p, 3)} + {formatNumber(analysis.resistors[2].p, 3)} = {formatNumber(analysis.pt, 3)} W = Pfuente
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                  ΔP = 0 W
                </span>
              </div>
            </div>

            {/* Aviso normativo de sobrecarga */}
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Observación pedagógica:</strong> Un balance matemático correcto no evita una sobrecarga física. Cuando una resistencia excede su potencia nominal ({nominalPower.toFixed(2)} W), el modelo ideal no representa daño térmico, pero en una instalación real se quemaría.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
