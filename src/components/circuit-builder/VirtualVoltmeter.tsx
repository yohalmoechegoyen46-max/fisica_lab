import React from 'react';

interface VirtualVoltmeterProps {
  measuredVoltage: number | null;
  redProbe: { x: number; y: number };
  blackProbe: { x: number; y: number };
  meterPos: { x: number; y: number };
  onRedProbeMouseDown: (e: React.MouseEvent) => void;
  onBlackProbeMouseDown: (e: React.MouseEvent) => void;
  onMeterMouseDown: (e: React.MouseEvent) => void;
  onClose: () => void;
}

export const VirtualVoltmeter: React.FC<VirtualVoltmeterProps> = ({
  measuredVoltage,
  redProbe,
  blackProbe,
  meterPos,
  onRedProbeMouseDown,
  onBlackProbeMouseDown,
  onMeterMouseDown,
  onClose,
}) => {
  // Coordenadas de los bornes en el cuerpo del multímetro
  const redJack = { x: meterPos.x + 35, y: meterPos.y + 115 };
  const blackJack = { x: meterPos.x + 85, y: meterPos.y + 115 };

  // Curvas de los cables flexibles
  const redPath = `M ${redJack.x} ${redJack.y} Q ${(redJack.x + redProbe.x) / 2} ${Math.max(redJack.y, redProbe.y) + 60} ${redProbe.x} ${redProbe.y}`;
  const blackPath = `M ${blackJack.x} ${blackJack.y} Q ${(blackJack.x + blackProbe.x) / 2} ${Math.max(blackJack.y, blackProbe.y) + 60} ${blackProbe.x} ${blackProbe.y}`;

  const formattedValue = measuredVoltage !== null
    ? `${measuredVoltage >= 0 ? '+' : ''}${measuredVoltage.toFixed(2)} V`
    : '0.00 V';

  return (
    <g className="select-none">
      {/* Cable Rojo Flexible */}
      <path
        d={redPath}
        fill="none"
        stroke="#ef4444"
        strokeWidth="3.5"
        strokeLinecap="round"
        className="pointer-events-none opacity-90 drop-shadow-sm"
      />
      {/* Cable Negro Flexible */}
      <path
        d={blackPath}
        fill="none"
        stroke="#1e293b"
        strokeWidth="3.5"
        strokeLinecap="round"
        className="pointer-events-none opacity-90 drop-shadow-sm"
      />

      {/* Cuerpo del Multímetro */}
      <g
        transform={`translate(${meterPos.x}, ${meterPos.y})`}
        onMouseDown={onMeterMouseDown}
        className="cursor-move"
      >
        {/* Carcasa amarilla de multímetro industrial */}
        <rect
          x="0"
          y="0"
          width="120"
          height="140"
          rx="12"
          fill="#f59e0b"
          stroke="#d97706"
          strokeWidth="3"
          className="drop-shadow-lg"
        />
        {/* Bisel interno oscuro */}
        <rect
          x="6"
          y="6"
          width="108"
          height="128"
          rx="8"
          fill="#0f172a"
        />

        {/* Encabezado y botón cerrar */}
        <text
          x="14"
          y="22"
          fill="#94a3b8"
          fontSize="9"
          fontWeight="700"
          letterSpacing="0.5"
        >
          VOLTÍMETRO DC
        </text>
        <circle
          cx="102"
          cy="19"
          r="6"
          fill="#ef4444"
          className="cursor-pointer hover:opacity-80"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
        <text
          x="102"
          y="22"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="9"
          fontWeight="bold"
          className="pointer-events-none"
        >
          ×
        </text>

        {/* Pantalla LCD retroiluminada */}
        <rect
          x="12"
          y="30"
          width="96"
          height="38"
          rx="4"
          fill="#132a13"
          stroke="#31572c"
          strokeWidth="1.5"
        />
        <text
          x="102"
          y="56"
          textAnchor="end"
          fill="#90e0ef"
          fontSize="18"
          fontFamily="monospace"
          fontWeight="900"
          filter="drop-shadow(0 0 2px #00b4d8)"
        >
          {formattedValue}
        </text>

        {/* Selector rotativo central */}
        <circle cx="60" cy="85" r="14" fill="#334155" stroke="#64748b" strokeWidth="2" />
        <line x1="60" y1="85" x2="60" y2="74" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

        {/* Bornes de conexión Jack */}
        <g transform="translate(35, 115)">
          <circle cx="0" cy="0" r="7" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill="#1e293b" />
          <text x="0" y="-10" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">
            V (+)
          </text>
        </g>
        <g transform="translate(85, 115)">
          <circle cx="0" cy="0" r="7" fill="#475569" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill="#020617" />
          <text x="0" y="-10" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
            COM (-)
          </text>
        </g>
      </g>

      {/* Sonda Roja (+) */}
      <g
        transform={`translate(${redProbe.x}, ${redProbe.y})`}
        onMouseDown={onRedProbeMouseDown}
        className="cursor-grab active:cursor-grabbing group"
      >
        {/* Punta metálica */}
        <polygon points="0,0 -3,-16 3,-16" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
        {/* Mango aislante rojo */}
        <rect x="-5" y="-50" width="10" height="34" rx="3" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
        {/* Protector de dedos */}
        <circle cx="0" cy="-30" r="8" fill="#b91c1c" />
        <text x="0" y="-27" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
          +
        </text>
        {/* Área de impacto generosa */}
        <circle cx="0" cy="0" r="14" fill="transparent" className="hover:stroke-red-400 hover:stroke-2" />
      </g>

      {/* Sonda Negra (-) */}
      <g
        transform={`translate(${blackProbe.x}, ${blackProbe.y})`}
        onMouseDown={onBlackProbeMouseDown}
        className="cursor-grab active:cursor-grabbing group"
      >
        {/* Punta metálica */}
        <polygon points="0,0 -3,-16 3,-16" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
        {/* Mango aislante negro */}
        <rect x="-5" y="-50" width="10" height="34" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
        {/* Protector de dedos */}
        <circle cx="0" cy="-30" r="8" fill="#0f172a" />
        <text x="0" y="-27" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
          -
        </text>
        {/* Área de impacto generosa */}
        <circle cx="0" cy="0" r="14" fill="transparent" className="hover:stroke-slate-500 hover:stroke-2" />
      </g>
    </g>
  );
};
