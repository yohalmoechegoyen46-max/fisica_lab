import React, { useState, useRef, useEffect } from 'react';
import { 
  PlacedComponent, 
  CircuitWire, 
  CurrentFlowMode, 
  CircuitSimulationResult, 
  CircuitComponentType,
  ValueZoomScale
} from '../../types/circuitBuilder';
import { getComponentTerminals, SNAP_DISTANCE } from '../../utils/circuitEngine';
import { VirtualVoltmeter } from './VirtualVoltmeter';
import { VirtualAmmeter } from './VirtualAmmeter';
import { RotateCw, Trash2, Sliders, X, Search, ZoomIn } from 'lucide-react';

interface CanvasWorkspaceProps {
  components: PlacedComponent[];
  wires: CircuitWire[];
  simulation: CircuitSimulationResult;
  flowMode: CurrentFlowMode;
  showLabels: boolean;
  showValues: boolean;
  showGrid: boolean;
  valueScale: ValueZoomScale;
  isMagnifierActive: boolean;
  setIsMagnifierActive: (active: boolean) => void;
  isVoltmeterActive: boolean;
  setIsVoltmeterActive: (active: boolean) => void;
  isAmmeterActive: boolean;
  setIsAmmeterActive: (active: boolean) => void;
  onUpdateComponent: (id: string, updates: Partial<PlacedComponent>) => void;
  onRemoveComponent: (id: string) => void;
  onAddWire: (fromTerminalId: string, toTerminalId: string) => void;
  onRemoveWire: (wireId: string) => void;
  onToggleSwitch: (componentId: string) => void;
  redProbe: { x: number; y: number };
  setRedProbe: (pos: { x: number; y: number }) => void;
  blackProbe: { x: number; y: number };
  setBlackProbe: (pos: { x: number; y: number }) => void;
  voltmeterPos: { x: number; y: number };
  setVoltmeterPos: (pos: { x: number; y: number }) => void;
  ammeterPos: { x: number; y: number };
  setAmmeterPos: (pos: { x: number; y: number }) => void;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  components,
  wires,
  simulation,
  flowMode,
  showLabels,
  showValues,
  showGrid,
  valueScale,
  isMagnifierActive,
  setIsMagnifierActive,
  isVoltmeterActive,
  setIsVoltmeterActive,
  isAmmeterActive,
  setIsAmmeterActive,
  onUpdateComponent,
  onRemoveComponent,
  onAddWire,
  onRemoveWire,
  onToggleSwitch,
  redProbe,
  setRedProbe,
  blackProbe,
  setBlackProbe,
  voltmeterPos,
  setVoltmeterPos,
  ammeterPos,
  setAmmeterPos,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Estados de interacción
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [dragItem, setDragItem] = useState<{
    type: 'component' | 'redProbe' | 'blackProbe' | 'voltmeter' | 'ammeter';
    id?: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  // Creación interactiva de cables
  const [wireDrawingStart, setWireDrawingStart] = useState<{
    terminalId: string;
    x: number;
    y: number;
  } | null>(null);
  const [wireDrawingCurrent, setWireDrawingCurrent] = useState<{ x: number; y: number } | null>(null);

  // Animación de partículas de corriente
  const [particleOffset, setParticleOffset] = useState<number>(0);

  // Coordenadas del cursor para la herramienta de Lupa de Inspección
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number } | null>(null);

  // Configuración de escala de tamaño para la lupa / visualización de valores numéricos
  const scaleConfig = {
    normal: {
      valFontSize: 12,
      labelFontSize: 11,
      badgeHeight: 22,
      badgePadding: 16,
      subBadge: false,
      glow: false,
    },
    large: {
      valFontSize: 16,
      labelFontSize: 13,
      badgeHeight: 28,
      badgePadding: 20,
      subBadge: true,
      glow: false,
    },
    xlarge: {
      valFontSize: 21,
      labelFontSize: 15,
      badgeHeight: 36,
      badgePadding: 26,
      subBadge: true,
      glow: true,
    },
  }[valueScale] || {
    valFontSize: 16,
    labelFontSize: 13,
    badgeHeight: 28,
    badgePadding: 20,
    subBadge: true,
    glow: false,
  };

  useEffect(() => {
    if (flowMode === 'off' || !simulation.isClosed || simulation.totalCurrent <= 0) return;

    let animId: number;
    const speed = simulation.isShortCircuit ? 3.0 : Math.min(2.5, Math.max(0.4, simulation.totalCurrent * 4));

    const step = () => {
      setParticleOffset((prev) => (prev + speed) % 100);
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [flowMode, simulation.isClosed, simulation.totalCurrent, simulation.isShortCircuit]);

  // Obtener todas las terminales con sus coordenadas
  const allTerminals = components.flatMap((c) => getComponentTerminals(c));
  const terminalMap = new Map(allTerminals.map((t) => [t.id, t]));

  // Convertir coordenadas del evento a SVG local
  const getSvgCoordinates = (e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    };
  };

  // Medición del voltímetro: comprobar si las sondas están cerca de terminales
  const getTerminalNear = (pos: { x: number; y: number }, maxDist = 30) => {
    for (const t of allTerminals) {
      if (Math.hypot(t.x - pos.x, t.y - pos.y) <= maxDist) {
        return t;
      }
    }
    return null;
  };

  const snappedRedTerminal = isVoltmeterActive ? getTerminalNear(redProbe) : null;
  const snappedBlackTerminal = isVoltmeterActive ? getTerminalNear(blackProbe) : null;

  let measuredVoltage: number | null = null;
  if (isVoltmeterActive) {
    if (snappedRedTerminal && snappedBlackTerminal) {
      const vRed = simulation.nodeVoltages[snappedRedTerminal.id] ?? 0;
      const vBlack = simulation.nodeVoltages[snappedBlackTerminal.id] ?? 0;
      measuredVoltage = vRed - vBlack;
    } else if (snappedRedTerminal) {
      measuredVoltage = simulation.nodeVoltages[snappedRedTerminal.id] ?? 0;
    } else if (snappedBlackTerminal) {
      measuredVoltage = -(simulation.nodeVoltages[snappedBlackTerminal.id] ?? 0);
    } else {
      measuredVoltage = 0;
    }
  }

  // Medición del amperímetro: comprobar si el clamp está sobre un componente
  let measuredCurrent: number | null = null;
  let ammeterTargetName: string | null = null;
  if (isAmmeterActive) {
    const clampTip = { x: ammeterPos.x + 50, y: ammeterPos.y };
    for (const c of components) {
      if (Math.hypot(c.x - clampTip.x, c.y - clampTip.y) <= 65) {
        const solved = simulation.components[c.id];
        measuredCurrent = solved ? solved.current : 0;
        ammeterTargetName = c.label || c.type.toUpperCase();
        break;
      }
    }
  }

  // Manejadores del ratón
  const handleMouseDown = (e: React.MouseEvent) => {
    // Si hace clic en el fondo deselecciona
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'canvas-bg') {
      setSelectedCompId(null);
      setWireDrawingStart(null);
      setWireDrawingCurrent(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getSvgCoordinates(e);
    setMouseCoords(coords);

    if (wireDrawingStart) {
      setWireDrawingCurrent(coords);
    }

    if (!dragItem) return;

    if (dragItem.type === 'component' && dragItem.id) {
      // Snapping a rejilla de 10px
      const newX = Math.round((coords.x - dragItem.offsetX) / 10) * 10;
      const newY = Math.round((coords.y - dragItem.offsetY) / 10) * 10;
      onUpdateComponent(dragItem.id, {
        x: Math.max(50, Math.min(880, newX)),
        y: Math.max(50, Math.min(540, newY)),
      });
    } else if (dragItem.type === 'redProbe') {
      setRedProbe({
        x: Math.max(10, Math.min(940, coords.x - dragItem.offsetX)),
        y: Math.max(10, Math.min(590, coords.y - dragItem.offsetY)),
      });
    } else if (dragItem.type === 'blackProbe') {
      setBlackProbe({
        x: Math.max(10, Math.min(940, coords.x - dragItem.offsetX)),
        y: Math.max(10, Math.min(590, coords.y - dragItem.offsetY)),
      });
    } else if (dragItem.type === 'voltmeter') {
      setVoltmeterPos({
        x: Math.max(10, Math.min(820, coords.x - dragItem.offsetX)),
        y: Math.max(10, Math.min(460, coords.y - dragItem.offsetY)),
      });
    } else if (dragItem.type === 'ammeter') {
      setAmmeterPos({
        x: Math.max(10, Math.min(840, coords.x - dragItem.offsetX)),
        y: Math.max(10, Math.min(470, coords.y - dragItem.offsetY)),
      });
    }
  };

  const handleMouseUp = () => {
    setDragItem(null);
  };

  // Clic en un terminal para conectar cable
  const handleTerminalClick = (e: React.MouseEvent, terminalId: string, x: number, y: number) => {
    e.stopPropagation();

    if (!wireDrawingStart) {
      setWireDrawingStart({ terminalId, x, y });
      setWireDrawingCurrent({ x, y });
    } else {
      if (wireDrawingStart.terminalId !== terminalId) {
        onAddWire(wireDrawingStart.terminalId, terminalId);
      }
      setWireDrawingStart(null);
      setWireDrawingCurrent(null);
    }
  };

  const selectedComp = components.find((c) => c.id === selectedCompId);

  // Componente que está siendo inspeccionado actualmente bajo la lupa
  const hoveredComponent = mouseCoords
    ? components.find((c) => Math.hypot(c.x - mouseCoords.x, c.y - mouseCoords.y) <= 55)
    : null;

  return (
    <div className="relative w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden select-none">
      {/* Indicador Flotante cuando el Modo Lupa de Inspección está activo */}
      {isMagnifierActive && (
        <div className="absolute top-3 left-3 bg-indigo-950/95 backdrop-blur-md text-indigo-200 border border-indigo-500/50 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2 z-10 text-xs animate-fade-in">
          <Search className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="font-bold text-white">Modo Lupa Activo:</span>
          <span className="hidden sm:inline text-indigo-200">Pasa el cursor sobre cualquier componente para ver sus valores ampliados</span>
          <button
            onClick={() => setIsMagnifierActive(false)}
            className="ml-2 text-indigo-300 hover:text-white underline cursor-pointer font-bold text-[11px]"
          >
            Cerrar Lupa
          </button>
        </div>
      )}

      {/* SVG Canvas Principal */}
      <svg
        ref={svgRef}
        viewBox="0 0 940 600"
        className={`w-full h-[520px] sm:h-[600px] bg-slate-900 ${
          isMagnifierActive ? 'cursor-crosshair' : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setMouseCoords(null)}
      >
        <defs>
          {/* Patrón de Rejilla Técnica */}
          <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#334155" opacity="0.6" />
          </pattern>
          <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1e293b" strokeWidth="1" />
          </pattern>

          {/* Gradiente Resplandor Bombilla */}
          <radialGradient id="bulb-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#facc15" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>

          {/* Gradiente Chispas Cortocircuito */}
          <radialGradient id="spark-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#fde047" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#ef4444" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
          </radialGradient>

          {/* Filtro Drop Shadow Suave */}
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Fondo interactivo */}
        <rect
          id="canvas-bg"
          x="0"
          y="0"
          width="940"
          height="600"
          fill="#0a0f1d"
        />

        {/* Rejilla técnica opcional */}
        {showGrid && (
          <>
            <rect x="0" y="0" width="940" height="600" fill="url(#grid-pattern)" className="pointer-events-none" />
            <rect x="0" y="0" width="940" height="600" fill="url(#grid-major)" className="pointer-events-none" />
          </>
        )}

        {/* ======================================================== */}
        {/* 1. CABLES DE CONEXIÓN */}
        {/* ======================================================== */}
        <g id="wires-layer">
          {wires.map((w) => {
            const tFrom = terminalMap.get(w.fromTerminalId);
            const tTo = terminalMap.get(w.toTerminalId);
            if (!tFrom || !tTo) return null;

            // Coordenadas con curvatura suave si no son ortogonales
            const dx = tTo.x - tFrom.x;
            const dy = tTo.y - tFrom.y;
            const midX = (tFrom.x + tTo.x) / 2;
            const midY = (tFrom.y + tTo.y) / 2;
            const pathD = `M ${tFrom.x} ${tFrom.y} Q ${midX} ${midY} ${tTo.x} ${tTo.y}`;

            return (
              <g key={w.id} className="group cursor-pointer">
                {/* Cable base (cobre/aislante) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="transition-colors group-hover:stroke-teal-400"
                />
                {/* Alma de cobre */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="pointer-events-none"
                />

                {/* Partículas de corriente a lo largo del cable */}
                {flowMode !== 'off' && simulation.isClosed && simulation.totalCurrent > 0.0001 && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke={flowMode === 'electrons' ? '#38bdf8' : '#fbbf24'}
                    strokeWidth="3.5"
                    strokeDasharray="6 14"
                    strokeDashoffset={flowMode === 'electrons' ? particleOffset : -particleOffset}
                    strokeLinecap="round"
                    className="pointer-events-none"
                    filter="drop-shadow(0 0 2px rgba(56, 189, 248, 0.8))"
                  />
                )}

                {/* Área de clic generosa con botón eliminar cable */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="18"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveWire(w.id);
                  }}
                  className="cursor-pointer"
                />
                {/* Cruz de eliminar al pasar el cursor */}
                <circle
                  cx={midX}
                  cy={midY}
                  r="7"
                  fill="#ef4444"
                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveWire(w.id);
                  }}
                />
                <text
                  x={midX}
                  y={midY + 3}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="bold"
                  className="pointer-events-none opacity-0 group-hover:opacity-100"
                >
                  ×
                </text>
              </g>
            );
          })}

          {/* Cable en proceso de dibujo */}
          {wireDrawingStart && wireDrawingCurrent && (
            <line
              x1={wireDrawingStart.x}
              y1={wireDrawingStart.y}
              x2={wireDrawingCurrent.x}
              y2={wireDrawingCurrent.y}
              stroke="#14b8a6"
              strokeWidth="4"
              strokeDasharray="6 4"
              strokeLinecap="round"
              className="pointer-events-none"
            />
          )}
        </g>

        {/* ======================================================== */}
        {/* 2. COMPONENTES DEL CIRCUITO */}
        {/* ======================================================== */}
        <g id="components-layer">
          {components.map((c) => {
            const [t0, t1] = getComponentTerminals(c);
            const isSelected = selectedCompId === c.id;
            const solved = simulation.components[c.id];

            return (
              <g
                key={c.id}
                transform={`translate(${c.x}, ${c.y}) rotate(${c.rotation})`}
                className="cursor-move select-none"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setSelectedCompId(c.id);
                  const coords = getSvgCoordinates(e);
                  setDragItem({
                    type: 'component',
                    id: c.id,
                    offsetX: coords.x - c.x,
                    offsetY: coords.y - c.y,
                  });
                }}
              >
                {/* Resaltado de selección */}
                {isSelected && (
                  <rect
                    x="-65"
                    y="-35"
                    width="130"
                    height="70"
                    rx="8"
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="pointer-events-none animate-pulse"
                  />
                )}

                {/* ---------------- BATERÍA ---------------- */}
                {c.type === 'battery' && (
                  <g>
                    {/* Chispas y fuego en caso de cortocircuito */}
                    {simulation.isShortCircuit && (
                      <g className="animate-pulse">
                        <circle cx="0" cy="0" r="45" fill="url(#spark-glow)" />
                        <circle cx="-50" cy="0" r="16" fill="#facc15" opacity="0.8" />
                        <circle cx="50" cy="0" r="16" fill="#facc15" opacity="0.8" />
                      </g>
                    )}

                    {/* Terminales metálicas conductoras salientes */}
                    <line x1="-55" y1="0" x2="-35" y2="0" stroke="#94a3b8" strokeWidth="4" />
                    <line x1="35" y1="0" x2="55" y2="0" stroke="#94a3b8" strokeWidth="4" />

                    {/* Cuerpo de la celda de batería */}
                    <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                    {/* Banda dorada / polo positivo */}
                    <rect x="-35" y="-18" width="22" height="36" rx="4" fill="#f59e0b" />
                    {/* Botón positivo saliente */}
                    <rect x="-40" y="-8" width="5" height="16" rx="2" fill="#d97706" />

                    {/* Símbolos de Polaridad */}
                    <text x="-24" y="5" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                      +
                    </text>
                    <text x="22" y="5" fill="#94a3b8" fontSize="15" fontWeight="900" textAnchor="middle">
                      -
                    </text>

                    {/* Valor numérico en el centro */}
                    <text x="0" y="4" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {c.value}V
                    </text>
                  </g>
                )}

                {/* ---------------- RESISTENCIA ---------------- */}
                {c.type === 'resistor' && (
                  <g>
                    {/* Terminales salientes */}
                    <line x1="-50" y1="0" x2="-28" y2="0" stroke="#94a3b8" strokeWidth="3" />
                    <line x1="28" y1="0" x2="50" y2="0" stroke="#94a3b8" strokeWidth="3" />

                    {/* Cuerpo cerámico beige de resistencia */}
                    <rect x="-28" y="-12" width="56" height="24" rx="6" fill="#d6c5a5" stroke="#9a8661" strokeWidth="1.5" />

                    {/* Bandas de código de color IEC */}
                    <rect x="-18" y="-12" width="4" height="24" fill="#854d0e" />
                    <rect x="-8" y="-12" width="4" height="24" fill="#000000" />
                    <rect x="2" y="-12" width="4" height="24" fill="#dc2626" />
                    <rect x="14" y="-12" width="4" height="24" fill="#eab308" />

                    {/* Efecto de sobrecarga térmica */}
                    {solved?.isOverloaded && (
                      <rect x="-30" y="-14" width="60" height="28" rx="8" fill="#ef4444" opacity="0.3" className="animate-pulse" />
                    )}
                  </g>
                )}

                {/* ---------------- BOMBILLA ---------------- */}
                {c.type === 'bulb' && (
                  <g>
                    {/* Resplandor luminoso dinámico cuando circula corriente */}
                    {solved?.isGlowing && (
                      <circle
                        cx="0"
                        cy="0"
                        r={30 + (solved.glowIntensity || 0.5) * 45}
                        fill="url(#bulb-glow)"
                        className="pointer-events-none animate-pulse"
                      />
                    )}

                    {/* Terminales de conexión */}
                    <line x1="-45" y1="0" x2="-18" y2="0" stroke="#94a3b8" strokeWidth="3" />
                    <line x1="18" y1="0" x2="45" y2="0" stroke="#94a3b8" strokeWidth="3" />

                    {/* Casquillo roscado metálico */}
                    <rect x="-18" y="-8" width="10" height="16" rx="2" fill="#64748b" stroke="#475569" strokeWidth="1" />
                    <line x1="-16" y1="-4" x2="-8" y2="-4" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="-16" y1="0" x2="-8" y2="0" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="-16" y1="4" x2="-8" y2="4" stroke="#94a3b8" strokeWidth="1.5" />

                    {/* Bulbo de cristal transparente */}
                    <circle
                      cx="5"
                      cy="0"
                      r="18"
                      fill={solved?.isGlowing ? '#fef08a' : '#1e293b'}
                      fillOpacity={solved?.isGlowing ? 0.85 : 0.4}
                      stroke={solved?.isGlowing ? '#facc15' : '#475569'}
                      strokeWidth="2"
                    />

                    {/* Filamento incandescente de tungsteno */}
                    <path
                      d="M -7 -4 L -2 -1 M -7 4 L -2 1 M -2 -1 Q 3 -7 8 -1 Q 13 4 8 4"
                      fill="none"
                      stroke={solved?.isGlowing ? '#ffffff' : '#64748b'}
                      strokeWidth={solved?.isGlowing ? '2.5' : '1.5'}
                      strokeLinecap="round"
                      filter={solved?.isGlowing ? 'drop-shadow(0 0 3px #fbbf24)' : undefined}
                    />
                  </g>
                )}

                {/* ---------------- INTERRUPTOR (SWITCH) ---------------- */}
                {c.type === 'switch' && (
                  <g
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSwitch(c.id);
                    }}
                    className="cursor-pointer"
                  >
                    {/* Base aislante */}
                    <rect x="-35" y="-14" width="70" height="28" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />

                    {/* Bornes de contacto de bronce */}
                    <circle cx="-25" cy="0" r="5" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                    <circle cx="25" cy="0" r="5" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />

                    {/* Terminales salientes */}
                    <line x1="-50" y1="0" x2="-25" y2="0" stroke="#94a3b8" strokeWidth="3" />
                    <line x1="25" y1="0" x2="50" y2="0" stroke="#94a3b8" strokeWidth="3" />

                    {/* Cuchilla basculante interactiva */}
                    {c.isOpen ? (
                      /* Estado ABIERTO: palanca levantada en ángulo */
                      <g className="transition-transform">
                        <line x1="-25" y1="0" x2="18" y2="-25" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="18" cy="-25" r="4.5" fill="#ef4444" />
                      </g>
                    ) : (
                      /* Estado CERRADO: palanca haciendo contacto continuo */
                      <g className="transition-transform">
                        <line x1="-25" y1="0" x2="25" y2="0" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="0" cy="0" r="3" fill="#ffffff" />
                      </g>
                    )}

                    {/* Indicador de estado */}
                    <text
                      x="0"
                      y="-18"
                      textAnchor="middle"
                      fill={c.isOpen ? '#f87171' : '#34d399'}
                      fontSize="8"
                      fontWeight="bold"
                    >
                      {c.isOpen ? 'ABIERTO' : 'CERRADO'}
                    </text>
                  </g>
                )}

                {/* ---------------- CABLE INDIVIDUAL ---------------- */}
                {c.type === 'wire' && (
                  <g>
                    <line x1="-40" y1="0" x2="40" y2="0" stroke="#0d9488" strokeWidth="6" strokeLinecap="round" />
                    <line x1="-40" y1="0" x2="40" y2="0" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                )}

                {/* ---------------- ETIQUETAS Y VALORES (SIEMPRE HORIZONTALES Y AMPLIADOS CON LUPA) ---------------- */}
                <g transform={`rotate(${-c.rotation})`}>
                  {/* Etiquetas de texto opcionales */}
                  {showLabels && (
                    <g transform={`translate(0, -${scaleConfig.valFontSize > 15 ? 32 : 26})`}>
                      <rect
                        x="-48"
                        y="-10"
                        width="96"
                        height="18"
                        rx="4"
                        fill="#0f172a"
                        fillOpacity="0.85"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="3"
                        fill="#cbd5e1"
                        fontSize={scaleConfig.labelFontSize}
                        fontWeight="700"
                        textAnchor="middle"
                        className="pointer-events-none tracking-wide select-none"
                      >
                        {c.label || c.type.toUpperCase()}
                      </text>
                    </g>
                  )}

                  {/* Valores numéricos opcionales ampliados según la escala de la Lupa */}
                  {showValues && (
                    <g transform={`translate(0, ${scaleConfig.valFontSize > 15 ? 32 : 26})`}>
                      {c.type === 'switch' ? (
                        <g>
                          <rect
                            x={c.isOpen ? -46 : -48}
                            y={-scaleConfig.badgeHeight / 2}
                            width={c.isOpen ? 92 : 96}
                            height={scaleConfig.badgeHeight}
                            rx={scaleConfig.badgeHeight / 2}
                            fill={c.isOpen ? '#450a0a' : '#064e3b'}
                            stroke={c.isOpen ? '#f87171' : '#34d399'}
                            strokeWidth={scaleConfig.valFontSize > 15 ? 2 : 1.5}
                          />
                          <text
                            x="0"
                            y={scaleConfig.valFontSize / 3.2}
                            fill={c.isOpen ? '#fca5a5' : '#6ee7b7'}
                            fontSize={scaleConfig.valFontSize}
                            fontWeight="800"
                            textAnchor="middle"
                            className="pointer-events-none font-mono tracking-wider select-none"
                          >
                            {c.isOpen ? 'ABIERTO' : 'CERRADO'}
                          </text>
                        </g>
                      ) : c.type !== 'wire' ? (
                        <g>
                          {/* Glow sutil para escala xlarge */}
                          {scaleConfig.glow && (
                            <rect
                              x={-60}
                              y={-scaleConfig.badgeHeight / 2}
                              width={120}
                              height={scaleConfig.badgeHeight}
                              rx={scaleConfig.badgeHeight / 2}
                              fill="#0284c7"
                              opacity="0.35"
                              filter="blur(5px)"
                            />
                          )}

                          {/* Cápsula de alto contraste */}
                          <rect
                            x={-scaleConfig.badgePadding * 2.8}
                            y={-scaleConfig.badgeHeight / 2}
                            width={scaleConfig.badgePadding * 5.6}
                            height={scaleConfig.badgeHeight}
                            rx={scaleConfig.badgeHeight / 2}
                            fill="#020617"
                            stroke={scaleConfig.glow ? '#38bdf8' : '#0ea5e9'}
                            strokeWidth={scaleConfig.valFontSize > 15 ? 2.5 : 1.5}
                          />

                          {/* Texto de Valor Numérico Principal */}
                          <text
                            x="0"
                            y={scaleConfig.subBadge && solved && (solved.current > 0 || solved.voltageDrop > 0) ? -2 : scaleConfig.valFontSize / 3.2}
                            fill="#38bdf8"
                            fontSize={scaleConfig.valFontSize}
                            fontWeight="900"
                            textAnchor="middle"
                            className="pointer-events-none font-mono drop-shadow-sm select-none"
                          >
                            {c.type === 'battery' ? `${c.value} V` : `${c.value} Ω`}
                          </text>

                          {/* Sub-badge de telemetría en tiempo real si escala grande o xlarge */}
                          {scaleConfig.subBadge && solved && (solved.current > 0 || solved.voltageDrop > 0) && (
                            <text
                              x="0"
                              y={scaleConfig.valFontSize > 18 ? 12 : 9}
                              fill="#a5f3fc"
                              fontSize={scaleConfig.valFontSize > 18 ? 10 : 8.5}
                              fontWeight="700"
                              textAnchor="middle"
                              className="pointer-events-none font-mono select-none"
                            >
                              {c.type === 'battery'
                                ? `I = ${solved.current.toFixed(2)} A`
                                : `${solved.voltageDrop.toFixed(1)}V · ${(solved.current * 1000).toFixed(0)}mA`}
                            </text>
                          )}
                        </g>
                      ) : null}
                    </g>
                  )}
                </g>
              </g>
            );
          })}
        </g>

        {/* ======================================================== */}
        {/* 3. TERMINALES DE CONEXIÓN (BORNES MAGNÉTICOS) */}
        {/* ======================================================== */}
        <g id="terminals-layer">
          {allTerminals.map((t) => {
            const isNearRedProbe = snappedRedTerminal?.id === t.id;
            const isNearBlackProbe = snappedBlackTerminal?.id === t.id;
            const isWireOrigin = wireDrawingStart?.terminalId === t.id;

            return (
              <g
                key={t.id}
                transform={`translate(${t.x}, ${t.y})`}
                className="cursor-crosshair group"
                onClick={(e) => handleTerminalClick(e, t.id, t.x, t.y)}
              >
                {/* Halo de snap para sondas o cable */}
                {(isNearRedProbe || isNearBlackProbe || isWireOrigin) && (
                  <circle
                    cx="0"
                    cy="0"
                    r="14"
                    fill={isNearRedProbe ? '#ef4444' : isNearBlackProbe ? '#475569' : '#14b8a6'}
                    opacity="0.3"
                    className="animate-ping"
                  />
                )}

                {/* Borne físico */}
                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill="#0f172a"
                  stroke={isWireOrigin ? '#14b8a6' : '#2dd4bf'}
                  strokeWidth="2.5"
                  className="transition-transform group-hover:scale-125"
                />
                <circle cx="0" cy="0" r="2.5" fill="#f8fafc" />

                {/* Área de clic ampliada para facilitar conexión en pantallas táctiles o mouse */}
                <circle cx="0" cy="0" r="16" fill="transparent" />
              </g>
            );
          })}
        </g>

        {/* ======================================================== */}
        {/* 4. INSTRUMENTOS VIRTUALES (VOLTÍMETRO Y AMPERÍMETRO) */}
        {/* ======================================================== */}
        {isVoltmeterActive && (
          <VirtualVoltmeter
            measuredVoltage={measuredVoltage}
            redProbe={redProbe}
            blackProbe={blackProbe}
            meterPos={voltmeterPos}
            onRedProbeMouseDown={(e) => {
              e.stopPropagation();
              const coords = getSvgCoordinates(e);
              setDragItem({
                type: 'redProbe',
                offsetX: coords.x - redProbe.x,
                offsetY: coords.y - redProbe.y,
              });
            }}
            onBlackProbeMouseDown={(e) => {
              e.stopPropagation();
              const coords = getSvgCoordinates(e);
              setDragItem({
                type: 'blackProbe',
                offsetX: coords.x - blackProbe.x,
                offsetY: coords.y - blackProbe.y,
              });
            }}
            onMeterMouseDown={(e) => {
              e.stopPropagation();
              const coords = getSvgCoordinates(e);
              setDragItem({
                type: 'voltmeter',
                offsetX: coords.x - voltmeterPos.x,
                offsetY: coords.y - voltmeterPos.y,
              });
            }}
            onClose={() => setIsVoltmeterActive(false)}
          />
        )}

        {isAmmeterActive && (
          <VirtualAmmeter
            measuredCurrent={measuredCurrent}
            targetName={ammeterTargetName}
            pos={ammeterPos}
            onMouseDown={(e) => {
              e.stopPropagation();
              const coords = getSvgCoordinates(e);
              setDragItem({
                type: 'ammeter',
                offsetX: coords.x - ammeterPos.x,
                offsetY: coords.y - ammeterPos.y,
              });
            }}
            onClose={() => setIsAmmeterActive(false)}
          />
        )}

        {/* ======================================================== */}
        {/* 5. LUPA DE INSPECCIÓN INTERACTIVA (LOUPE Y HUD EN VIVO) */}
        {/* ======================================================== */}
        {isMagnifierActive && mouseCoords && (
          <g id="magnifier-lens-layer" className="pointer-events-none select-none">
            {/* Sombra proyectada del lente */}
            <circle
              cx={mouseCoords.x}
              cy={mouseCoords.y}
              r="48"
              fill="#000000"
              opacity="0.25"
            />

            {/* Lente circular con cristal y aro exterior */}
            <circle
              cx={mouseCoords.x}
              cy={mouseCoords.y}
              r="44"
              fill="#0f172a"
              fillOpacity="0.45"
              stroke="#6366f1"
              strokeWidth="4"
            />
            {/* Anillo de enfoque de precisión */}
            <circle
              cx={mouseCoords.x}
              cy={mouseCoords.y}
              r="38"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.8"
            />

            {/* Retícula cruzada */}
            <line
              x1={mouseCoords.x - 12}
              y1={mouseCoords.y}
              x2={mouseCoords.x + 12}
              y2={mouseCoords.y}
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <line
              x1={mouseCoords.x}
              y1={mouseCoords.y - 12}
              x2={mouseCoords.x}
              y2={mouseCoords.y + 12}
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <circle cx={mouseCoords.x} cy={mouseCoords.y} r="2" fill="#ffffff" />

            {/* Mango metálico ergonómico de la lupa */}
            <line
              x1={mouseCoords.x + 31}
              y1={mouseCoords.y + 31}
              x2={mouseCoords.x + 58}
              y2={mouseCoords.y + 58}
              stroke="#334155"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <line
              x1={mouseCoords.x + 31}
              y1={mouseCoords.y + 31}
              x2={mouseCoords.x + 58}
              y2={mouseCoords.y + 58}
              stroke="#6366f1"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* HUD flotante ampliado con todos los cálculos en grande */}
            {(() => {
              const hudX = mouseCoords.x > 620 ? mouseCoords.x - 245 : mouseCoords.x + 65;
              const hudY = Math.min(420, Math.max(25, mouseCoords.y - 65));
              const hudSolved = hoveredComponent ? simulation.components[hoveredComponent.id] : null;

              return (
                <g transform={`translate(${hudX}, ${hudY})`}>
                  <rect
                    x="0"
                    y="0"
                    width="230"
                    height={hoveredComponent ? 128 : 62}
                    rx="12"
                    fill="#020617"
                    fillOpacity="0.96"
                    stroke="#6366f1"
                    strokeWidth="2"
                  />

                  {/* Cabecera HUD */}
                  <g transform="translate(14, 20)">
                    <text fill="#818cf8" fontSize="10" fontWeight="800" letterSpacing="0.8">
                      LUPA DE VALORES AMPLIADOS
                    </text>
                  </g>

                  {hoveredComponent ? (
                    <g transform="translate(14, 38)">
                      <text fill="#94a3b8" fontSize="11" fontWeight="bold">
                        {hoveredComponent.label || hoveredComponent.type.toUpperCase()}
                      </text>

                      {/* Valor Numérico Gigante */}
                      <text
                        x="0"
                        y="28"
                        fill="#38bdf8"
                        fontSize="23"
                        fontWeight="900"
                        fontFamily="monospace"
                      >
                        {hoveredComponent.type === 'battery'
                          ? `${hoveredComponent.value} V`
                          : hoveredComponent.type === 'switch'
                          ? (hoveredComponent.isOpen ? 'ABIERTO' : 'CERRADO')
                          : `${hoveredComponent.value} Ω`}
                      </text>

                      {/* Cálculos en tiempo real */}
                      {hudSolved && (
                        <g transform="translate(0, 48)">
                          <text fill="#e2e8f0" fontSize="11" fontFamily="monospace">
                            Tensión: <tspan fill="#38bdf8" fontWeight="bold">{(hudSolved.voltageDrop).toFixed(2)} V</tspan>
                          </text>
                          <text x="0" y="17" fill="#e2e8f0" fontSize="11" fontFamily="monospace">
                            Corriente: <tspan fill="#34d399" fontWeight="bold">{(hudSolved.current).toFixed(3)} A</tspan> ({((hudSolved.current) * 1000).toFixed(1)} mA)
                          </text>
                        </g>
                      )}
                    </g>
                  ) : (
                    <g transform="translate(14, 42)">
                      <text fill="#94a3b8" fontSize="11">
                        Pasa la lupa sobre un componente
                      </text>
                    </g>
                  )}
                </g>
              );
            })()}
          </g>
        )}
      </svg>

      {/* ======================================================== */}
      {/* 5. TOOLBAR FLOTANTE PARA EL COMPONENTE SELECCIONADO */}
      {/* ======================================================== */}
      {selectedComp && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in z-20">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-3">
            <span className="text-xs font-bold text-teal-400 capitalize">
              {selectedComp.label || selectedComp.type}
            </span>
          </div>

          {/* Rotar */}
          <button
            onClick={() => onUpdateComponent(selectedComp.id, { rotation: (selectedComp.rotation + 90) % 360 })}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
            title="Rotar 90 grados"
          >
            <RotateCw className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Rotar</span>
          </button>

          {/* Ajuste de valor (Ohmios o Voltios) */}
          {selectedComp.type === 'battery' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Tensión:</span>
              <input
                type="number"
                min="1"
                max="48"
                step="0.5"
                value={selectedComp.value}
                onChange={(e) => onUpdateComponent(selectedComp.id, { value: parseFloat(e.target.value) || 1 })}
                className="w-16 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-teal-300 text-xs font-mono font-bold text-center"
              />
              <span className="text-xs text-slate-400">V</span>
            </div>
          )}

          {(selectedComp.type === 'resistor' || selectedComp.type === 'bulb') && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Resistencia:</span>
              <input
                type="number"
                min="1"
                max="2000"
                step="5"
                value={selectedComp.value}
                onChange={(e) => onUpdateComponent(selectedComp.id, { value: parseFloat(e.target.value) || 1 })}
                className="w-16 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-teal-300 text-xs font-mono font-bold text-center"
              />
              <span className="text-xs text-slate-400">Ω</span>
            </div>
          )}

          {/* Eliminar componente */}
          <button
            onClick={() => {
              onRemoveComponent(selectedComp.id);
              setSelectedCompId(null);
            }}
            className="p-1.5 rounded-lg hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-colors cursor-pointer ml-1"
            title="Eliminar elemento"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Cerrar barra */}
          <button
            onClick={() => setSelectedCompId(null)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
