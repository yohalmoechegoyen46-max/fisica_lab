import React, { useState } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  HelpCircle,
  TrendingUp,
  Activity,
  ChevronDown
} from 'lucide-react';
import { CircuitSimulationResult } from '../../types/circuitBuilder';

interface CircuitStatusFooterProps {
  simulation: CircuitSimulationResult;
}

export const CircuitStatusFooter: React.FC<CircuitStatusFooterProps> = ({
  simulation,
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { isClosed, isShortCircuit, totalResistance, totalCurrent, totalVoltage, totalPower, statusMessage } = simulation;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Alerta de Cortocircuito si está activa */}
      {isShortCircuit && (
        <div className="bg-red-500 text-white p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-md animate-pulse">
          <div className="flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-yellow-300 animate-bounce" />
            <div>
              <h4 className="font-extrabold text-sm tracking-wide">
                ¡ALERTA CRÍTICA: CORTOCIRCUITO DETECTADO!
              </h4>
              <p className="text-xs text-red-100">
                La resistencia equivalente es prácticamente nula ({totalResistance < 0.05 ? '< 0.05' : totalResistance.toFixed(2)} Ω). La corriente se eleva descontroladamente superando el límite de seguridad.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-black bg-white/20 px-2.5 py-1 rounded-lg">
            I &gt; 50 A
          </span>
        </div>
      )}

      {/* Grid de magnitudes Ley de Ohm (V, R, I) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Tensión Total */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Tensión Fuente (V)</span>
            <span className="font-mono text-teal-600 font-bold">V = I · R</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {totalVoltage.toFixed(2)}{' '}
            <span className="text-xs font-semibold text-slate-500">V</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Fuerza electromotriz total
          </p>
        </div>

        {/* Resistencia Equivalente */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Resistencia Eq (Req)</span>
            <span className="font-mono text-teal-600 font-bold">R = V / I</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {totalResistance === Infinity
              ? '∞'
              : totalResistance > 1000
              ? `${(totalResistance / 1000).toFixed(2)} kΩ`
              : `${totalResistance.toFixed(2)} Ω`}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isClosed ? 'Oposición total al flujo' : 'Circuito abierto (R infinita)'}
          </p>
        </div>

        {/* Corriente Total */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Corriente Total (iT)</span>
            <span className="font-mono text-teal-600 font-bold">iT = V / Req</span>
          </div>
          <div className={`text-xl sm:text-2xl font-black tracking-tight ${
            isShortCircuit ? 'text-red-600' : totalCurrent > 0 ? 'text-teal-700' : 'text-slate-700'
          }`}>
            {isShortCircuit ? '¡EXTREMA!' : `${totalCurrent.toFixed(3)} A`}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Medida en Amperios (A)
          </p>
        </div>
      </div>

      {/* Estado y diagnóstico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Estado del Circuito:</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-xs ${
            isShortCircuit
              ? 'bg-red-100 text-red-700 border border-red-200'
              : isClosed
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}>
            {isShortCircuit ? (
              <>
                <Flame className="w-3.5 h-3.5 text-red-600" />
                <span>Cortocircuito</span>
              </>
            ) : isClosed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bucle Cerrado Activo</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Circuito Abierto</span>
              </>
            )}
          </span>
          <span className="text-slate-500 italic hidden md:inline">
            — {statusMessage}
          </span>
        </div>

        <div className="text-slate-400 text-[11px] flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          <span>Motor MNA en tiempo real (Ley de Ohm y Kirchhoff)</span>
        </div>
      </div>

      {/* Botón Desplegable para Cálculos Detallados Paso a Paso */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-700 font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-serif italic font-black text-xs">
              f(x)
            </span>
            <span className="text-slate-800">
              {isDetailsOpen ? 'Ocultar' : 'Ver'} Cálculos Detallados de los Criterios de Diseño (Paso a Paso)
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
              isDetailsOpen ? 'rotate-180 text-teal-600' : ''
            }`}
          />
        </button>

        {/* Panel Desplegable con Desarrollo Analítico Completo */}
        {isDetailsOpen && (
          <div className="mt-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 animate-fade-in font-sans">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Desarrollo Matemático y Analítico del Circuito</span>
                <span className="text-[10px] font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200 font-bold">
                  Ley de Ohm Paso a Paso
                </span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Cálculos analíticos completos aplicando los criterios de diseño sobre los componentes en la mesa de trabajo
              </p>
            </div>

            {isClosed && totalResistance < Infinity && !isShortCircuit ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* a) Resistencia Total */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      a) Resistencia total equivalente (Re):
                    </span>
                    <div className="font-mono text-slate-700 space-y-1 pl-2 border-l-2 border-teal-500 text-xs mt-2">
                      <div>Fórmula general de despeje:</div>
                      <div className="font-bold text-slate-900">Re = VT / iT</div>
                      <div>Sustituyendo valores de la fuente y corriente total:</div>
                      <div>Re = {totalVoltage.toFixed(2)} V / {totalCurrent.toFixed(3)} A</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 font-bold text-teal-800 text-sm font-mono">
                    Re = {totalResistance.toFixed(2)} Ω
                  </div>
                </div>

                {/* b) Tensión Total */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      b) Tensión total del circuito (VT):
                    </span>
                    <div className="font-mono text-slate-700 space-y-1 pl-2 border-l-2 border-teal-500 text-xs mt-2">
                      <div>De los criterios de diseño:</div>
                      <div className="font-bold text-slate-900">VT = {totalVoltage.toFixed(2)} V</div>
                      <div className="text-[11px] text-slate-500 pt-1 font-sans">
                        Fuerza electromotriz total suministrada por la fuente al circuito.
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 font-bold text-teal-800 text-sm font-mono">
                    VT = {totalVoltage.toFixed(2)} V
                  </div>
                </div>

                {/* c) Intensidad de Corriente Total */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      c) Intensidad de corriente total (iT):
                    </span>
                    <div className="font-mono text-slate-700 space-y-1 pl-2 border-l-2 border-teal-500 text-xs mt-2">
                      <div>Aplicando la Ley de Ohm:</div>
                      <div className="font-bold text-slate-900">iT = VT / Re</div>
                      <div>Sustitución directa con valores calculados:</div>
                      <div>iT = {totalVoltage.toFixed(2)} V / {totalResistance.toFixed(2)} Ω</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 font-bold text-teal-800 text-sm font-mono">
                    iT = {totalCurrent.toFixed(3)} A
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-xs">
                {isShortCircuit ? (
                  <span className="text-red-600 font-bold">
                    El circuito se encuentra en cortocircuito (resistencia nula). Conecta una carga resistiva para calcular los criterios.
                  </span>
                ) : (
                  <span>
                    El circuito está abierto o incompleto. Conecta los terminales formando un lazo cerrado con la batería para desplegar los cálculos numéricos paso a paso.
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
