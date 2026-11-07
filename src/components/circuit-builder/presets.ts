import { PlacedComponent, CircuitWire } from '../../types/circuitBuilder';

export interface CircuitPreset {
  id: string;
  name: string;
  description: string;
  components: PlacedComponent[];
  wires: CircuitWire[];
}

export const CIRCUIT_PRESETS: CircuitPreset[] = [
  {
    id: 'basic-bulb',
    name: 'Circuito Básico con Bombilla',
    description: 'Batería de 12V conectada a un interruptor y una bombilla de 25Ω.',
    components: [
      { id: 'bat-1', type: 'battery', x: 200, y: 300, rotation: 270, value: 12, label: 'Batería 12V' },
      { id: 'sw-1', type: 'switch', x: 360, y: 190, rotation: 0, value: 0, isOpen: false, label: 'Interruptor' },
      { id: 'bulb-1', type: 'bulb', x: 520, y: 300, rotation: 90, value: 25, label: 'Bombilla 25Ω' },
    ],
    wires: [
      { id: 'w-1', fromTerminalId: 'bat-1-t0', toTerminalId: 'sw-1-t0' },
      { id: 'w-2', fromTerminalId: 'sw-1-t1', toTerminalId: 'bulb-1-t0' },
      { id: 'w-3', fromTerminalId: 'bulb-1-t1', toTerminalId: 'bat-1-t1' },
    ],
  },
  {
    id: 'series-two-bulbs',
    name: 'Dos Bombillas en Serie',
    description: 'La corriente es la misma en ambas bombillas; cada una recibe la mitad del voltaje (6V c/u).',
    components: [
      { id: 'bat-1', type: 'battery', x: 180, y: 300, rotation: 270, value: 12, label: 'Batería 12V' },
      { id: 'sw-1', type: 'switch', x: 320, y: 180, rotation: 0, value: 0, isOpen: false, label: 'Interruptor' },
      { id: 'bulb-1', type: 'bulb', x: 480, y: 180, rotation: 0, value: 25, label: 'Bombilla 1 (25Ω)' },
      { id: 'bulb-2', type: 'bulb', x: 620, y: 300, rotation: 90, value: 25, label: 'Bombilla 2 (25Ω)' },
    ],
    wires: [
      { id: 'w-1', fromTerminalId: 'bat-1-t0', toTerminalId: 'sw-1-t0' },
      { id: 'w-2', fromTerminalId: 'sw-1-t1', toTerminalId: 'bulb-1-t0' },
      { id: 'w-3', fromTerminalId: 'bulb-1-t1', toTerminalId: 'bulb-2-t0' },
      { id: 'w-4', fromTerminalId: 'bulb-2-t1', toTerminalId: 'bat-1-t1' },
    ],
  },
  {
    id: 'parallel-two-bulbs',
    name: 'Dos Bombillas en Paralelo',
    description: 'Ambas bombillas reciben los 12V completos y brillan a máxima intensidad.',
    components: [
      { id: 'bat-1', type: 'battery', x: 180, y: 300, rotation: 270, value: 12, label: 'Batería 12V' },
      { id: 'bulb-1', type: 'bulb', x: 380, y: 300, rotation: 90, value: 25, label: 'Bombilla 1 (25Ω)' },
      { id: 'bulb-2', type: 'bulb', x: 560, y: 300, rotation: 90, value: 25, label: 'Bombilla 2 (25Ω)' },
    ],
    wires: [
      { id: 'w-1', fromTerminalId: 'bat-1-t0', toTerminalId: 'bulb-1-t0' },
      { id: 'w-2', fromTerminalId: 'bulb-1-t0', toTerminalId: 'bulb-2-t0' },
      { id: 'w-3', fromTerminalId: 'bat-1-t1', toTerminalId: 'bulb-1-t1' },
      { id: 'w-4', fromTerminalId: 'bulb-1-t1', toTerminalId: 'bulb-2-t1' },
    ],
  },
  {
    id: 'resistor-bulb',
    name: 'Resistencia Limitadora y Bombilla',
    description: 'Resistencia de 50Ω en serie con una bombilla de 25Ω para limitar la corriente.',
    components: [
      { id: 'bat-1', type: 'battery', x: 180, y: 300, rotation: 270, value: 12, label: 'Batería 12V' },
      { id: 'res-1', type: 'resistor', x: 350, y: 190, rotation: 0, value: 50, label: 'Resistor 50Ω' },
      { id: 'bulb-1', type: 'bulb', x: 540, y: 300, rotation: 90, value: 25, label: 'Bombilla 25Ω' },
    ],
    wires: [
      { id: 'w-1', fromTerminalId: 'bat-1-t0', toTerminalId: 'res-1-t0' },
      { id: 'w-2', fromTerminalId: 'res-1-t1', toTerminalId: 'bulb-1-t0' },
      { id: 'w-3', fromTerminalId: 'bulb-1-t1', toTerminalId: 'bat-1-t1' },
    ],
  },
  {
    id: 'short-circuit-demo',
    name: 'Demostración de Cortocircuito',
    description: 'Conecta directamente los polos de la batería con un cable sin resistencia.',
    components: [
      { id: 'bat-1', type: 'battery', x: 260, y: 300, rotation: 270, value: 9, label: 'Batería 9V' },
      { id: 'sw-1', type: 'switch', x: 440, y: 300, rotation: 90, value: 0, isOpen: true, label: 'Interruptor (Cierra para cortocircuito)' },
    ],
    wires: [
      { id: 'w-1', fromTerminalId: 'bat-1-t0', toTerminalId: 'sw-1-t0' },
      { id: 'w-2', fromTerminalId: 'bat-1-t1', toTerminalId: 'sw-1-t1' },
    ],
  },
];
