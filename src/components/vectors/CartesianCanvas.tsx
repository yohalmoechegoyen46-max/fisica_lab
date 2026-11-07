import React, { useRef, useState, useEffect, useId } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { VectorForce, SystemResultant } from '../../types';
import { calculateComponents, formatNumber, formatSigned, radToDeg } from '../../utils/physics';

interface CartesianCanvasProps {
  vectors: VectorForce[];
  resultant: SystemResultant;
  showProjections: boolean;
  onUpdateVector: (id: string, updates: Partial<VectorForce>) => void;
}

export const CartesianCanvas: React.FC<CartesianCanvasProps> = ({
  vectors,
  resultant,
  showProjections,
  onUpdateVector,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Dimensiones lógicas del canvas SVG
  const width = 640;
  const height = 440;
  const cx = width / 2;
  const cy = height / 2;

  // Escala: píxeles por Newton
  // En zoom = 1, 25 N = 40 px aprox
  const baseScale = 1.6;
  const scale = baseScale * zoom;

  // Manejo fluido de arrastre con event listeners globales
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDraggingId(id);
  };

  useEffect(() => {
    if (!draggingId) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * width;
      const svgY = ((e.clientY - rect.top) / rect.height) * height;

      // Convertir de SVG a plano cartesiano físico (en Newtons)
      const physX = (svgX - cx) / scale;
      const physY = (cy - svgY) / scale;

      const newMag = Math.round(Math.sqrt(physX * physX + physY * physY));
      let newAngle = Math.round(radToDeg(Math.atan2(physY, physX)));
      if (newAngle < 0) newAngle += 360;

      // Limitar magnitud mínima y máxima
      const clampedMag = Math.max(0, Math.min(250, newMag));

      onUpdateVector(draggingId, {
        magnitude: clampedMag,
        angle: newAngle,
      });
    };

    const handleWindowPointerUp = () => {
      setDraggingId(null);
    };

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [draggingId, scale, cx, cy, width, height, onUpdateVector]);

  // Crear marcas de cuadrícula de 25 en 25 N
  const gridSteps = [-125, -100, -75, -50, -25, 25, 50, 75, 100, 125];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Header toolbar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase block">
            Sistema de fuerzas concurrentes
          </span>
          <h3 className="text-base font-bold text-slate-800">Plano cartesiano</h3>
        </div>

        <div className="flex items-center gap-3">
          

          <div className="flex items-center bg-slate-100/90 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setZoom(z => Math.max(0.6, z - 0.2))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors"
              title="Alejar"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-slate-700 px-2 min-w-14 text-center">
              {Math.round(zoom * 100)} %
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.8, z + 0.2))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors"
              title="Acercar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setZoom(1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            title="Restablecer zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div 
        ref={containerRef}
        className={`relative w-full h-[410px] bg-[#f8fafc] select-none overflow-hidden flex items-center justify-center ${
          draggingId ? 'cursor-grabbing' : 'cursor-crosshair'
        }`}
      >
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Marcadores de flecha para vectores */}
            <marker id="arrow-resultant" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M 0 0 L 9 4.5 L 0 9 z" fill="#0f172a" />
            </marker>
            <marker id="arrow-f1" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M 0 0 L 9 4.5 L 0 9 z" fill="#0284c7" />
            </marker>
            <marker id="arrow-f2" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M 0 0 L 9 4.5 L 0 9 z" fill="#4f46e5" />
            </marker>
            <marker id="arrow-generic" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M 0 0 L 9 4.5 L 0 9 z" fill="#059669" />
            </marker>
          </defs>

          {/* Grid lines (no interceptan eventos de ratón) */}
          <g stroke="#e2e8f0" strokeWidth="1" className="pointer-events-none">
            {gridSteps.map(step => {
              const xPos = cx + step * scale;
              const yPos = cy - step * scale;
              return (
                <React.Fragment key={step}>
                  <line x1={xPos} y1={0} x2={xPos} y2={height} />
                  <line x1={0} y1={yPos} x2={width} y2={yPos} />
                </React.Fragment>
              );
            })}
          </g>

          {/* Ejes principales Cartesiano */}
          <g stroke="#94a3b8" strokeWidth="1.5" className="pointer-events-none">
            {/* Eje X */}
            <line x1={15} y1={cy} x2={width - 15} y2={cy} />
            {/* Eje Y */}
            <line x1={cx} y1={height - 15} x2={cx} y2={15} />
          </g>

          {/* Etiquetas numéricas en los ejes */}
          <g fill="#94a3b8" fontSize="10" fontFamily="sans-serif" className="pointer-events-none select-none">
            {[-100, -50, 50, 100].map(val => {
              const x = cx + val * scale;
              const y = cy - val * scale;
              return (
                <React.Fragment key={val}>
                  {/* Marcas eje X */}
                  <line x1={x} y1={cy - 3} x2={x} y2={cy + 3} stroke="#64748b" strokeWidth="1.5" />
                  <text x={x} y={cy + 15} textAnchor="middle">{val}</text>
                  
                  {/* Marcas eje Y */}
                  <line x1={cx - 3} y1={y} x2={cx + 3} y2={y} stroke="#64748b" strokeWidth="1.5" />
                  <text x={cx - 10} y={y + 3} textAnchor="end">{val}</text>
                </React.Fragment>
              );
            })}
            <text x={cx - 8} y={cy + 14} textAnchor="end" fill="#64748b" fontWeight="600">0</text>
            <text x={width - 30} y={cy + 16} fill="#475569" fontWeight="700">+X (N)</text>
            <text x={cx + 10} y={22} fill="#475569" fontWeight="700">+Y (N)</text>
          </g>

          {/* Vectores componentes y proyecciones */}
          {vectors.filter(v => v.visible).map((vec) => {
            const { fx, fy } = calculateComponents(vec.magnitude, vec.angle);
            const targetX = cx + fx * scale;
            const targetY = cy - fy * scale;

            return (
              <g key={vec.id}>
                {/* Proyecciones sobre los ejes (si están activadas) */}
                {showProjections && vec.magnitude > 5 && (
                  <g stroke={vec.color} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" className="pointer-events-none">
                    <line x1={targetX} y1={cy} x2={targetX} y2={targetY} />
                    <line x1={cx} y1={targetY} x2={targetX} y2={targetY} />
                  </g>
                )}

                {/* Arco del ángulo θ */}
                {vec.magnitude > 15 && vec.angle > 2 && (
                  <g className="pointer-events-none select-none">
                    <path
                      d={describeArc(cx, cy, 26, 0, vec.angle)}
                      fill="none"
                      stroke={vec.color}
                      strokeWidth="1.5"
                    />
                    <text
                      x={cx + 34 * Math.cos(((vec.angle / 2) * Math.PI) / 180)}
                      y={cy - 34 * Math.sin(((vec.angle / 2) * Math.PI) / 180)}
                      fill={vec.color}
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {vec.angle}°
                    </text>
                  </g>
                )}

                {/* Línea invisible más ancha para facilitar agarrar el vector sin lag */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={targetX}
                  y2={targetY}
                  stroke="transparent"
                  strokeWidth="14"
                  className="cursor-grab active:cursor-grabbing"
                  onPointerDown={(e) => handlePointerDown(vec.id, e)}
                />

                {/* Línea visible del Vector */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={targetX}
                  y2={targetY}
                  stroke={vec.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="pointer-events-none"
                />

                {/* Cabeza de flecha SVG dibujada con rotación precisa */}
                {vec.magnitude > 5 && (
                  <polygon
                    points={calculateArrowHead(cx, cy, targetX, targetY, 11, 7)}
                    fill={vec.color}
                    className="pointer-events-none"
                  />
                )}

                {/* Etiqueta del Vector */}
                <g transform={`translate(${targetX + 8}, ${targetY - 8})`} className="pointer-events-none select-none">
                  <rect
                    x="-2"
                    y="-13"
                    width={vec.name.length * 8 + 55}
                    height="18"
                    rx="4"
                    fill="rgba(255, 255, 255, 0.95)"
                    stroke={vec.color}
                    strokeWidth="1"
                  />
                  <text
                    x="4"
                    y="0"
                    fill={vec.color}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {vec.name} · {Math.round(vec.magnitude)} N
                  </text>
                </g>

                {/* Manija interactiva en la punta: hitbox transparente + punto visual sin CSS transform lag */}
                <g className="cursor-grab active:cursor-grabbing">
                  {/* Hitbox generosa e invisible (32px) para agarre táctil y ratón */}
                  <circle
                    cx={targetX}
                    cy={targetY}
                    r="16"
                    fill="transparent"
                    onPointerDown={(e) => handlePointerDown(vec.id, e)}
                  />
                  {/* Halo indicador durante arrastre activo */}
                  {draggingId === vec.id && (
                    <circle
                      cx={targetX}
                      cy={targetY}
                      r="12"
                      fill={vec.color}
                      opacity="0.25"
                      className="pointer-events-none"
                    />
                  )}
                  {/* Manija central visible */}
                  <circle
                    cx={targetX}
                    cy={targetY}
                    r={draggingId === vec.id ? 8 : 6.5}
                    fill="#ffffff"
                    stroke={vec.color}
                    strokeWidth={draggingId === vec.id ? "3.5" : "2.5"}
                    className="pointer-events-none"
                  />
                </g>
              </g>
            );
          })}

          {/* Punto de origen central */}
          <circle cx={cx} cy={cy} r="4" fill="#0f172a" className="pointer-events-none" />
        </svg>

        {/* Legend bar underneath the canvas */}
        <div className="absolute bottom-2 left-4 right-4 flex flex-wrap items-center justify-between bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-lg border border-slate-200/80 text-[11px] font-medium shadow-2xs">
          <div className="flex flex-wrap items-center gap-4">
            {vectors.filter(v => v.visible).map(v => (
              <div key={v.id} className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: v.color }} />
                <span className="text-slate-700 font-semibold">{v.name}</span>
                <span className="text-slate-500">· {Math.round(v.magnitude)} N a {v.angle}°</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span>DCL de la Resultante R disponible en la pestaña <strong>Desglose y DCL</strong></span>
          </div>
        </div>
      </div>

      {/* 4 Bottom metric indicator boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 border-t border-slate-100 bg-white">
        <div className="p-4">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
            ΣFx
          </span>
          <span className="text-xl font-extrabold text-slate-800 tracking-tight">
            {formatNumber(resultant.sumFx, 2)} N
          </span>
        </div>

        <div className="p-4">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
            ΣFy
          </span>
          <span className="text-xl font-extrabold text-slate-800 tracking-tight">
            {formatNumber(resultant.sumFy, 2)} N
          </span>
        </div>

        <div className="p-4">
          <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">
            Módulo |R|
          </span>
          <span className="text-xl font-extrabold text-teal-600 tracking-tight">
            {formatNumber(resultant.magnitude, 2)} N
          </span>
        </div>

        <div className="p-4">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
            Dirección θR
          </span>
          <span className="text-xl font-extrabold text-slate-800 tracking-tight">
            {resultant.magnitude > 1e-4 ? `${formatNumber(resultant.angle, 2)}°` : 'Indefinida'}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Función auxiliar para generar el arco SVG
 */
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY - radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  // Asegurar que no supere 359.99 para evitar cerrar círculo erróneo
  const safeEndAngle = Math.min(endAngle, 359.9);
  const start = polarToCartesian(x, y, radius, safeEndAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = safeEndAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y
  ].join(' ');
}

/**
 * Genera las coordenadas poligonales de una punta de flecha en la dirección del vector
 */
function calculateArrowHead(
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number, 
  length: number = 10, 
  width: number = 6
): string {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const xLeft = x2 - length * Math.cos(angle - Math.PI / 6);
  const yLeft = y2 - length * Math.sin(angle - Math.PI / 6);
  const xRight = x2 - length * Math.cos(angle + Math.PI / 6);
  const yRight = y2 - length * Math.sin(angle + Math.PI / 6);

  return `${x2},${y2} ${xLeft},${yLeft} ${xRight},${yRight}`;
}
