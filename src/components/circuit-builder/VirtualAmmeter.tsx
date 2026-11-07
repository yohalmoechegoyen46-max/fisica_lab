import React from 'react';

interface VirtualAmmeterProps {
  measuredCurrent: number | null;
  targetName: string | null;
  pos: { x: number; y: number };
  onMouseDown: (e: React.MouseEvent) => void;
  onClose: () => void;
}

export const VirtualAmmeter: React.FC<VirtualAmmeterProps> = ({
  measuredCurrent,
  targetName,
  pos,
  onMouseDown,
  onClose,
}) => {
  const formattedCurrent = measuredCurrent !== null
    ? `${measuredCurrent.toFixed(3)} A`
    : '--- A';

  const formattedMilliAmps = measuredCurrent !== null
    ? `${(measuredCurrent * 1000).toFixed(1)} mA`
    : '';

  return (
    <g
      transform={`translate(${pos.x}, ${pos.y})`}
      onMouseDown={onMouseDown}
      className="select-none cursor-grab active:cursor-grabbing group drop-shadow-xl"
    >
      {/* Sensor de pinza/clamp en la parte superior */}
      <path
        d="M 25 15 C 25 -20 75 -20 75 15"
        fill="none"
        stroke="#0284c7"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Indicador de campo magnético */}
      <circle cx="50" cy="-5" r="14" fill="#0284c7" opacity="0.15" />
      <circle cx="50" cy="-5" r="4" fill="#0284c7" />

      {/* Cuerpo principal del Amperímetro */}
      <rect
        x="0"
        y="12"
        width="100"
        height="115"
        rx="10"
        fill="#0369a1"
        stroke="#075985"
        strokeWidth="2.5"
      />

      {/* Título y botón cerrar */}
      <text
        x="10"
        y="30"
        fill="#bae6fd"
        fontSize="8"
        fontWeight="800"
        letterSpacing="0.5"
      >
        AMPERÍMETRO
      </text>
      <circle
        cx="88"
        cy="26"
        r="5.5"
        fill="#ef4444"
        className="cursor-pointer hover:opacity-80"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <text
        x="88"
        y="29"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="8"
        fontWeight="bold"
        className="pointer-events-none"
      >
        ×
      </text>

      {/* Pantalla digital LCD */}
      <rect
        x="10"
        y="38"
        width="80"
        height="36"
        rx="4"
        fill="#082f49"
        stroke="#0e7490"
        strokeWidth="1.5"
      />
      <text
        x="84"
        y="60"
        textAnchor="end"
        fill="#38bdf8"
        fontSize="16"
        fontFamily="monospace"
        fontWeight="bold"
        filter="drop-shadow(0 0 2px #38bdf8)"
      >
        {formattedCurrent}
      </text>
      {formattedMilliAmps && (
        <text
          x="84"
          y="70"
          textAnchor="end"
          fill="#7dd3fc"
          fontSize="9"
          fontFamily="monospace"
        >
          {formattedMilliAmps}
        </text>
      )}

      {/* Rótulo del elemento detectado */}
      <rect
        x="10"
        y="80"
        width="80"
        height="20"
        rx="4"
        fill="#0c4a6e"
      />
      <text
        x="50"
        y="94"
        textAnchor="middle"
        fill="#e0f2fe"
        fontSize="8"
        fontWeight="600"
      >
        {targetName ? targetName : 'Acerca a un cable'}
      </text>

      {/* Marca de agarre en la base */}
      <rect x="35" y="106" width="30" height="3" rx="1.5" fill="#38bdf8" opacity="0.6" />
      <rect x="40" y="112" width="20" height="2" rx="1" fill="#38bdf8" opacity="0.4" />
    </g>
  );
};
