/**
 * Tipos para el módulo de Construcción de Circuitos
 */

export type CircuitComponentType = 'battery' | 'resistor' | 'bulb' | 'switch' | 'wire';

export type CurrentFlowMode = 'electrons' | 'conventional' | 'off';

export type ValueZoomScale = 'normal' | 'large' | 'xlarge';

export interface TerminalRef {
  id: string; // ej: `${componentId}-t1`
  componentId: string;
  terminalIndex: 0 | 1; // 0 = A / (+), 1 = B / (-)
  label: string;
  offsetX: number; // offset relativo al centro del componente
  offsetY: number;
}

export interface PlacedComponent {
  id: string;
  type: CircuitComponentType;
  x: number;
  y: number;
  rotation: number; // 0, 90, 180, 270 grados
  value: number; // Voltios para batería, Ohmios para resistencia o bombilla, longitud para cable
  isOpen?: boolean; // Para interruptor (true = abierto, false = cerrado)
  label: string;
}

export interface CircuitWire {
  id: string;
  fromTerminalId: string;
  toTerminalId: string;
}

export interface VoltmeterProbe {
  x: number;
  y: number;
  active: boolean;
  snappedTerminalId: string | null;
}

export interface AmmeterProbe {
  x: number;
  y: number;
  active: boolean;
  snappedComponentId: string | null;
}

export interface SolvedComponentResult {
  componentId: string;
  voltageDrop: number; // V
  current: number; // A
  power: number; // W
  isOverloaded: boolean;
  isGlowing?: boolean;
  glowIntensity?: number; // 0 a 1
}

export interface CircuitSimulationResult {
  isClosed: boolean;
  isShortCircuit: boolean;
  totalResistance: number; // Req en Ohmios
  totalCurrent: number; // It en Amperios
  totalVoltage: number; // Vfuente en Voltios
  totalPower: number; // Pt en Vatios
  statusMessage: string;
  components: Record<string, SolvedComponentResult>;
  nodeVoltages: Record<string, number>; // terminalId -> potencial respecto a masa
}
