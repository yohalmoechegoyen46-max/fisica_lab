import React, { useState } from 'react';
import { 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Table, 
  Calculator, 
  Compass,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownLeft,
  ArrowDownRight
} from 'lucide-react';
import { VectorForce, SystemResultant } from '../../types';
import { calculateComponents, formatNumber, formatSigned, getQuadrant } from '../../utils/physics';

interface DclBreakdownProps {
  vectors: VectorForce[];
  resultant: SystemResultant;
}

export const DclBreakdown: React.FC<DclBreakdownProps> = ({ vectors, resultant }) => {
  const [isCalculationsOpen, setIsCalculationsOpen] = useState<boolean>(true);
  const visibleVectors = vectors.filter(v => v.visible);

  // Determinar flecha del sentido para la resultante
  const getDirectionArrow = () => {
    if (resultant.sumFx >= 0 && resultant.sumFy >= 0) return <ArrowUpRight className="w-5 h-5 text-teal-600" />;
    if (resultant.sumFx < 0 && resultant.sumFy >= 0) return <ArrowUpLeft className="w-5 h-5 text-teal-600" />;
    if (resultant.sumFx < 0 && resultant.sumFy < 0) return <ArrowDownLeft className="w-5 h-5 text-teal-600" />;
    return <ArrowDownRight className="w-5 h-5 text-teal-600" />;
  };

  // Coordenadas para el DCL de la resultante
  const resDclW = 320;
  const resDclH = 200;
  const resOriginX = 140;
  const resOriginY = 130;
  const resScale = Math.min(1.2, 110 / Math.max(1, resultant.magnitude || 1));
  const resTargetX = resOriginX + resultant.sumFx * resScale;
  const resTargetY = resOriginY - resultant.sumFy * resScale;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* SECCIÓN 1: DCLs individuales de las fuerzas y DCL de la resultante del sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DCLs de cada fuerza individual */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-base font-bold text-slate-800">
              Diagramas de Cuerpo Libre (DCL) individuales
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {visibleVectors.length} {visibleVectors.length === 1 ? 'fuerza activa' : 'fuerzas activas'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visibleVectors.map((vec) => {
              const { fx, fy } = calculateComponents(vec.magnitude, vec.angle);
              const quadrant = getQuadrant(vec.angle);
              
              const dclW = 260;
              const dclH = 160;
              const originX = 60;
              const originY = 120;
              const scale = 0.8;
              const targetX = originX + fx * scale;
              const targetY = originY - fy * scale;

              return (
                <div
                  key={vec.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3 flex flex-col justify-between"
                >
                  {/* DCL Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {Math.round(vec.magnitude)} N / θ = {vec.angle}°
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: vec.color }} />
                        <span>{vec.name} · {quadrant}</span>
                      </h4>
                    </div>
                  </div>

                  {/* Visual SVG Diagram */}
                  <div className="h-40 w-full bg-slate-50/70 rounded-xl border border-slate-100 relative overflow-hidden flex items-center justify-center">
                    <svg viewBox={`0 0 ${dclW} ${dclH}`} className="w-full h-full">
                      {/* Ejes */}
                      <line x1="15" y1={originY} x2={dclW - 15} y2={originY} stroke="#cbd5e1" strokeWidth="1.2" />
                      <line x1={originX} y1="15" x2={originX} y2={dclH - 15} stroke="#cbd5e1" strokeWidth="1.2" />
                      
                      <text x={dclW - 24} y={originY + 12} fontSize="9" fill="#94a3b8" fontWeight="bold">+X</text>
                      <text x={originX - 10} y="24" fontSize="9" fill="#94a3b8" fontWeight="bold">+Y</text>

                      {/* Componente Fx */}
                      <line
                        x1={originX}
                        y1={originY}
                        x2={targetX}
                        y2={originY}
                        stroke="#0284c7"
                        strokeWidth="2.5"
                      />
                      <polygon
                        points={`${targetX},${originY} ${targetX - (fx >= 0 ? 6 : -6)},${originY - 3.5} ${targetX - (fx >= 0 ? 6 : -6)},${originY + 3.5}`}
                        fill="#0284c7"
                      />

                      {/* Componente Fy proyección */}
                      <line
                        x1={targetX}
                        y1={originY}
                        x2={targetX}
                        y2={targetY}
                        stroke="#0d9488"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1={originX}
                        y1={originY}
                        x2={originX}
                        y2={targetY}
                        stroke="#0d9488"
                        strokeWidth="2.5"
                      />
                      <polygon
                        points={`${originX},${targetY} ${originX - 3.5},${targetY + (fy >= 0 ? 6 : -6)} ${originX + 3.5},${targetY + (fy >= 0 ? 6 : -6)}`}
                        fill="#0d9488"
                      />

                      {/* Vector principal */}
                      <line
                        x1={originX}
                        y1={originY}
                        x2={targetX}
                        y2={targetY}
                        stroke={vec.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx={originX} cy={originY} r="3" fill="#0f172a" />

                      {/* Valores */}
                      <text
                        x={(originX + targetX) / 2}
                        y={originY + (fy >= 0 ? 13 : -6)}
                        fontSize="9"
                        fill="#0284c7"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        Fx = {formatSigned(fx, 1)} N
                      </text>

                      <text
                        x={originX - 6}
                        y={(originY + targetY) / 2}
                        fontSize="9"
                        fill="#0d9488"
                        fontWeight="bold"
                        textAnchor="end"
                      >
                        {formatSigned(fy, 1)} N
                      </text>

                      <text
                        x={targetX}
                        y={targetY - 6}
                        fontSize="10"
                        fill={vec.color}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {vec.name}
                      </text>
                    </svg>
                  </div>

                  {/* Fórmulas */}
                  <div className="bg-slate-50/90 rounded-xl p-2.5 font-mono text-[11px] text-slate-700 space-y-1 border border-slate-200/60">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{vec.name}x = {Math.round(vec.magnitude)} cos({vec.angle}°)</span>
                      <span className="font-bold text-sky-700">{formatSigned(fx, 2)} N</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{vec.name}y = {Math.round(vec.magnitude)} sen({vec.angle}°)</span>
                      <span className="font-bold text-teal-700">{formatSigned(fy, 2)} N</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: DCL exclusivo de la Resultante del Sistema */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">
                  DCL de la Resultante
                </span>
                <h3 className="text-base font-bold text-slate-800">
                  Resultante del sistema (ΣF)
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                {resultant.quadrant}
              </span>
            </div>

            {/* Diagrama DCL dedicado para R */}
            <div className="h-44 w-full bg-[#f8fafc] rounded-xl border border-slate-200/80 relative overflow-hidden flex items-center justify-center">
              <svg viewBox={`0 0 ${resDclW} ${resDclH}`} className="w-full h-full">
                {/* Ejes X e Y */}
                <line x1="20" y1={resOriginY} x2={resDclW - 20} y2={resOriginY} stroke="#94a3b8" strokeWidth="1.5" />
                <line x1={resOriginX} y1="20" x2={resOriginX} y2={resDclH - 20} stroke="#94a3b8" strokeWidth="1.5" />
                <text x={resDclW - 24} y={resOriginY + 14} fontSize="10" fill="#64748b" fontWeight="bold">+X</text>
                <text x={resOriginX - 10} y="30" fontSize="10" fill="#64748b" fontWeight="bold">+Y</text>

                {/* Proyecciones de R */}
                {/* ΣFx */}
                <line
                  x1={resOriginX}
                  y1={resOriginY}
                  x2={resTargetX}
                  y2={resOriginY}
                  stroke="#0284c7"
                  strokeWidth="3"
                />
                <polygon
                  points={`${resTargetX},${resOriginY} ${resTargetX - (resultant.sumFx >= 0 ? 8 : -8)},${resOriginY - 4.5} ${resTargetX - (resultant.sumFx >= 0 ? 8 : -8)},${resOriginY + 4.5}`}
                  fill="#0284c7"
                />

                {/* ΣFy */}
                <line
                  x1={resTargetX}
                  y1={resOriginY}
                  x2={resTargetX}
                  y2={resTargetY}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1={resOriginX}
                  y1={resOriginY}
                  x2={resOriginX}
                  y2={resTargetY}
                  stroke="#0d9488"
                  strokeWidth="3"
                />
                <polygon
                  points={`${resOriginX},${resTargetY} ${resOriginX - 4.5},${resTargetY + (resultant.sumFy >= 0 ? 8 : -8)} ${resOriginX + 4.5},${resTargetY + (resultant.sumFy >= 0 ? 8 : -8)}`}
                  fill="#0d9488"
                />

                {/* Vector Resultante R */}
                {resultant.magnitude > 1e-4 && (
                  <>
                    <line
                      x1={resOriginX}
                      y1={resOriginY}
                      x2={resTargetX}
                      y2={resTargetY}
                      stroke="#0f172a"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx={resTargetX} cy={resTargetY} r="4" fill="#0f172a" />
                    
                    {/* Arco del ángulo θR */}
                    <text
                      x={resOriginX + 18}
                      y={resOriginY - 8}
                      fill="#0f172a"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {formatNumber(resultant.angle, 1)}°
                    </text>

                    {/* Etiqueta R */}
                    <g transform={`translate(${resTargetX + 6}, ${resTargetY - 6})`}>
                      <rect x="-2" y="-12" width="75" height="18" rx="4" fill="#0f172a" />
                      <text x="4" y="1" fill="#ffffff" fontSize="10" fontWeight="bold">
                        R = {formatNumber(resultant.magnitude, 2)} N
                      </text>
                    </g>
                  </>
                )}

                <circle cx={resOriginX} cy={resOriginY} r="4" fill="#0f172a" />

                {/* Etiquetas de las componentes */}
                <text
                  x={(resOriginX + resTargetX) / 2}
                  y={resOriginY + (resultant.sumFy >= 0 ? 15 : -8)}
                  fontSize="10"
                  fill="#0284c7"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ΣFx = {formatSigned(resultant.sumFx, 2)} N
                </text>

                <text
                  x={resOriginX - 8}
                  y={(resOriginY + resTargetY) / 2}
                  fontSize="10"
                  fill="#0d9488"
                  fontWeight="bold"
                  textAnchor="end"
                >
                  ΣFy = {formatSigned(resultant.sumFy, 2)} N
                </text>
              </svg>
            </div>

            {/* Sumas y resultados numéricos */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">
                  ΣFx (Eje X)
                </span>
                <span className="text-base font-bold text-sky-700">
                  {formatSigned(resultant.sumFx, 2)} N
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">
                  ΣFy (Eje Y)
                </span>
                <span className="text-base font-bold text-teal-700">
                  {formatSigned(resultant.sumFy, 2)} N
                </span>
              </div>
            </div>

            {/* Módulo y Dirección */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  Módulo |R|
                </span>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {formatNumber(resultant.magnitude, 2)} N
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  Dirección θR
                </span>
                <div className="text-3xl font-extrabold text-teal-600 tracking-tight">
                  {resultant.magnitude > 1e-4 ? `${formatNumber(resultant.angle, 2)}°` : '0°'}
                </div>
              </div>
            </div>

            {/* Sentido con icono físico */}
            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-teal-200 flex items-center justify-center shrink-0 shadow-2xs">
                {getDirectionArrow()}
              </div>
              <div className="text-xs text-teal-900">
                <strong className="block">Sentido de la resultante:</strong>
                <span>{resultant.directionDescription}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: TABLA PARA LA SUMA DE Fx Y Fy */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Tabla analítica de descomposición y suma de componentes (Fx y Fy)
              </h3>
              <p className="text-xs text-slate-500">
                Cálculo de cada fuerza en el plano y sumatoria algebraica total
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 self-start sm:self-auto font-mono">
            Unidades: Newtons (N) y grados (°)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] text-slate-400 font-semibold font-sans">
                <th className="pb-3">Fuerza</th>
                <th className="pb-3">Módulo (N)</th>
                <th className="pb-3">Ángulo θ (°)</th>
                <th className="pb-3">Cuadrante</th>
                <th className="pb-3">Fórmula Fx</th>
                <th className="pb-3 text-sky-700">Valor Fx (N)</th>
                <th className="pb-3">Fórmula Fy</th>
                <th className="pb-3 text-teal-700">Valor Fy (N)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleVectors.map((v) => {
                const { fx, fy } = calculateComponents(v.magnitude, v.angle);
                const quad = getQuadrant(v.angle);
                return (
                  <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 font-sans font-bold flex items-center gap-2 text-slate-800">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.color }} />
                      <span>{v.name}</span>
                    </td>
                    <td className="py-3 font-bold text-slate-800">{v.magnitude}</td>
                    <td className="py-3 text-slate-600">{v.angle}°</td>
                    <td className="py-3 font-sans text-slate-500">{quad}</td>
                    <td className="py-3 text-slate-500">{v.magnitude} · cos({v.angle}°)</td>
                    <td className="py-3 font-bold text-sky-700">{formatSigned(fx, 2)}</td>
                    <td className="py-3 text-slate-500">{v.magnitude} · sen({v.angle}°)</td>
                    <td className="py-3 font-bold text-teal-700">{formatSigned(fy, 2)}</td>
                  </tr>
                );
              })}

              {/* Fila de Totales: Sumatorias ΣFx y ΣFy */}
              <tr className="border-t-2 border-slate-300 bg-slate-50/80 font-bold text-sm">
                <td className="py-3 font-sans text-slate-900">Total ΣF</td>
                <td className="py-3 text-slate-500">—</td>
                <td className="py-3 text-slate-500">—</td>
                <td className="py-3 font-sans text-slate-900">{resultant.quadrant}</td>
                <td className="py-3 font-sans text-slate-600 text-xs">ΣFx = Σ(F · cos θ)</td>
                <td className="py-3 text-sky-700 font-extrabold text-base">
                  {formatSigned(resultant.sumFx, 2)} N
                </td>
                <td className="py-3 font-sans text-slate-600 text-xs">ΣFy = Σ(F · sen θ)</td>
                <td className="py-3 text-teal-700 font-extrabold text-base">
                  {formatSigned(resultant.sumFy, 2)} N
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECCIÓN 3: APARTADO DESPLEGABLE CON LOS CÁLCULOS PASO A PASO */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
        {/* Cabecera desplegable interactiva */}
        <button
          onClick={() => setIsCalculationsOpen(!isCalculationsOpen)}
          className="w-full p-5 bg-slate-50/80 hover:bg-slate-100/70 border-b border-slate-200/80 flex items-center justify-between transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Memoria de cálculo paso a paso: Módulo, Dirección y Sentido
              </h4>
              <p className="text-xs text-slate-500">
                Desglose detallado de sustitución de valores, fórmulas trigonométricas y análisis vectorial
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-700">
              {isCalculationsOpen ? 'Ocultar detalles' : 'Mostrar detalles'}
            </span>
            {isCalculationsOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </div>
        </button>

        {/* Contenido desplegable */}
        {isCalculationsOpen && (
          <div className="p-6 space-y-6 text-xs text-slate-700 animate-fade-in font-mono">
            {/* Paso 1: Fórmulas de cada fuerza */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs font-sans">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">1</span>
                <span>Descomposición ortogonal de cada fuerza aplicada</span>
              </div>
              <div className="space-y-2 pl-7 text-slate-600">
                {visibleVectors.map(v => {
                  const { fx, fy } = calculateComponents(v.magnitude, v.angle);
                  return (
                    <div key={v.id} className="border-b border-slate-200/60 pb-2">
                      <div className="text-slate-900 font-bold font-sans">{v.name} (Módulo = {v.magnitude} N, Ángulo θ = {v.angle}°):</div>
                      <div className="pl-3 space-y-0.5 mt-1">
                        <div>{v.name}x = {v.magnitude} × cos({v.angle}°) = <strong className="text-sky-700">{formatSigned(fx, 2)} N</strong></div>
                        <div>{v.name}y = {v.magnitude} × sen({v.angle}°) = <strong className="text-teal-700">{formatSigned(fy, 2)} N</strong></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Paso 2: Sumatorias de componentes */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs font-sans">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">2</span>
                <span>Sumatoria algebraica en los ejes X e Y</span>
              </div>
              <div className="space-y-2 pl-7 text-slate-700">
                <div>
                  <span className="text-slate-500 font-sans block mb-1">Eje X:</span>
                  <div>ΣFx = {visibleVectors.map(v => `${v.name}x`).join(' + ')}</div>
                  <div>ΣFx = {visibleVectors.map(v => formatSigned(calculateComponents(v.magnitude, v.angle).fx, 2)).join(' + ')}</div>
                  <div className="font-bold text-sky-700 text-sm mt-1">ΣFx = {formatSigned(resultant.sumFx, 2)} N</div>
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-sans block mb-1">Eje Y:</span>
                  <div>ΣFy = {visibleVectors.map(v => `${v.name}y`).join(' + ')}</div>
                  <div>ΣFy = {visibleVectors.map(v => formatSigned(calculateComponents(v.magnitude, v.angle).fy, 2)).join(' + ')}</div>
                  <div className="font-bold text-teal-700 text-sm mt-1">ΣFy = {formatSigned(resultant.sumFy, 2)} N</div>
                </div>
              </div>
            </div>

            {/* Paso 3: Módulo de la resultante */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs font-sans">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">3</span>
                <span>Cálculo del Módulo de la Resultante |R| (Teorema de Pitágoras)</span>
              </div>
              <div className="pl-7 space-y-1.5 text-slate-700">
                <div>|R| = √((ΣFx)² + (ΣFy)²)</div>
                <div>|R| = √(({formatNumber(resultant.sumFx, 2)})² + ({formatNumber(resultant.sumFy, 2)})²)</div>
                <div>|R| = √({formatNumber(resultant.sumFx * resultant.sumFx, 2)} + {formatNumber(resultant.sumFy * resultant.sumFy, 2)})</div>
                <div>|R| = √({formatNumber(resultant.sumFx * resultant.sumFx + resultant.sumFy * resultant.sumFy, 2)})</div>
                <div className="text-base font-extrabold text-teal-700 font-sans pt-1">
                  |R| = {formatNumber(resultant.magnitude, 2)} N
                </div>
              </div>
            </div>

            {/* Paso 4: Dirección */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs font-sans">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">4</span>
                <span>Cálculo de la Dirección angular θR</span>
              </div>
              <div className="pl-7 space-y-1.5 text-slate-700">
                <div>θR = atan2(ΣFy, ΣFx)</div>
                <div>θR = atan2({formatNumber(resultant.sumFy, 2)}, {formatNumber(resultant.sumFx, 2)})</div>
                <div className="text-base font-extrabold text-slate-900 font-sans pt-1">
                  θR = {formatNumber(resultant.angle, 2)}° (medido desde +X en sentido antihorario)
                </div>
              </div>
            </div>

            {/* Paso 5: Sentido físico y análisis cuadrantal */}
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80 space-y-3">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-xs font-sans">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">5</span>
                <span>Determinación del Sentido vectorial y Cuadrante</span>
              </div>
              <div className="pl-7 space-y-1.5 text-teal-950 font-sans text-xs">
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <strong>Componente horizontal:</strong> ΣFx = {formatSigned(resultant.sumFx, 2)} N ({resultant.sumFx >= 0 ? 'Signo positivo: apunta hacia la derecha / este' : 'Signo negativo: apunta hacia la izquierda / oeste'}).
                  </li>
                  <li>
                    <strong>Componente vertical:</strong> ΣFy = {formatSigned(resultant.sumFy, 2)} N ({resultant.sumFy >= 0 ? 'Signo positivo: apunta hacia arriba / norte' : 'Signo negativo: apunta hacia abajo / sur'}).
                  </li>
                  <li>
                    <strong>Ubicación espacial:</strong> Pertenece al <strong>{resultant.quadrant}</strong>.
                  </li>
                  <li>
                    <strong>Sentido físico:</strong> {resultant.directionDescription}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
