/**
 * Motor de física eléctrica para el constructor de circuitos.
 * Resuelve circuitos de corriente continua (DC) utilizando Análisis Nodal Modificado (MNA).
 */

import {
  PlacedComponent,
  CircuitWire,
  CircuitSimulationResult,
  SolvedComponentResult,
} from '../types/circuitBuilder';

// Distancia en píxeles para snap automático entre terminales
export const SNAP_DISTANCE = 28;

// Calcula la posición absoluta de los dos terminales de un componente
export function getComponentTerminals(comp: PlacedComponent): [
  { id: string; x: number; y: number; index: 0; polarity: '+' | 'A' },
  { id: string; x: number; y: number; index: 1; polarity: '-' | 'B' }
] {
  const rad = (comp.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  let halfLength = 50;
  if (comp.type === 'battery') halfLength = 55;
  if (comp.type === 'bulb') halfLength = 45;
  if (comp.type === 'switch') halfLength = 50;
  if (comp.type === 'resistor') halfLength = 50;
  if (comp.type === 'wire') halfLength = 40;

  // Terminal 0 (Izquierda o Arriba según rotación)
  const t0X = comp.x - halfLength * cos;
  const t0Y = comp.y - halfLength * sin;

  // Terminal 1 (Derecha o Abajo según rotación)
  const t1X = comp.x + halfLength * cos;
  const t1Y = comp.y + halfLength * sin;

  return [
    {
      id: `${comp.id}-t0`,
      x: Math.round(t0X),
      y: Math.round(t0Y),
      index: 0,
      polarity: comp.type === 'battery' ? '+' : 'A',
    },
    {
      id: `${comp.id}-t1`,
      x: Math.round(t1X),
      y: Math.round(t1Y),
      index: 1,
      polarity: comp.type === 'battery' ? '-' : 'B',
    },
  ];
}

// Resuelve el sistema lineal Ax = b con eliminación gaussiana y pivoteo parcial
function solveLinearSystem(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  // Copia profunda
  const M = A.map(row => [...row]);
  const x = [...b];

  for (let i = 0; i < n; i++) {
    // Buscar pivote máximo
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }

    if (Math.abs(M[maxRow][i]) < 1e-12) {
      return null; // Matriz singular
    }

    // Intercambiar filas
    if (maxRow !== i) {
      [M[i], M[maxRow]] = [M[maxRow], M[i]];
      [x[i], x[maxRow]] = [x[maxRow], x[i]];
    }

    // Normalizar fila pivote
    const pivot = M[i][i];
    for (let j = i; j < n; j++) {
      M[i][j] /= pivot;
    }
    x[i] /= pivot;

    // Eliminar columna en otras filas
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = M[k][i];
        for (let j = i; j < n; j++) {
          M[k][j] -= factor * M[i][j];
        }
        x[k] -= factor * x[i];
      }
    }
  }

  return x;
}

/**
 * Resuelve el circuito completo
 */
export function solveCircuit(
  components: PlacedComponent[],
  wires: CircuitWire[]
): CircuitSimulationResult {
  const result: CircuitSimulationResult = {
    isClosed: false,
    isShortCircuit: false,
    totalResistance: 0,
    totalCurrent: 0,
    totalVoltage: 0,
    totalPower: 0,
    statusMessage: 'Circuito vacío',
    components: {},
    nodeVoltages: {},
  };

  if (components.length === 0) return result;

  // 1. Obtener todas las terminales con sus coordenadas
  const terminalMap = new Map<string, { id: string; x: number; y: number; compId: string; index: number }>();
  for (const c of components) {
    const [t0, t1] = getComponentTerminals(c);
    terminalMap.set(t0.id, { id: t0.id, x: t0.x, y: t0.y, compId: c.id, index: 0 });
    terminalMap.set(t1.id, { id: t1.id, x: t1.x, y: t1.y, compId: c.id, index: 1 });
  }

  // 2. Agrupar terminales en Nodos Eléctricos (Union-Find)
  const parent: Record<string, string> = {};
  function find(i: string): string {
    if (!parent[i]) parent[i] = i;
    if (parent[i] === i) return i;
    parent[i] = find(parent[i]);
    return parent[i];
  }
  function union(i: string, j: string) {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) parent[rootI] = rootJ;
  }

  // Inicializar cada terminal
  for (const tid of terminalMap.keys()) {
    parent[tid] = tid;
  }

  // A. Uniones por cables explícitos
  for (const w of wires) {
    if (terminalMap.has(w.fromTerminalId) && terminalMap.has(w.toTerminalId)) {
      union(w.fromTerminalId, w.toTerminalId);
    }
  }

  // B. Uniones por proximidad geométrica (snap)
  const allTerms = Array.from(terminalMap.values());
  for (let i = 0; i < allTerms.length; i++) {
    for (let j = i + 1; j < allTerms.length; j++) {
      const tA = allTerms[i];
      const tB = allTerms[j];
      const dist = Math.hypot(tA.x - tB.x, tA.y - tB.y);
      if (dist <= SNAP_DISTANCE) {
        union(tA.id, tB.id);
      }
    }
  }

  // C. Uniones internas para componentes de resistencia cero:
  // - Interruptor CERRADO une t0 y t1 directamente
  // - Componente Cable une t0 y t1 directamente
  for (const c of components) {
    if (c.type === 'switch' && !c.isOpen) {
      union(`${c.id}-t0`, `${c.id}-t1`);
    } else if (c.type === 'wire') {
      union(`${c.id}-t0`, `${c.id}-t1`);
    }
  }

  // Mapear cada terminal a un ID de super-nodo eléctrico
  const terminalToNode: Record<string, string> = {};
  const uniqueNodes = new Set<string>();
  for (const tid of terminalMap.keys()) {
    const root = find(tid);
    terminalToNode[tid] = root;
    uniqueNodes.add(root);
  }

  // Buscar baterías
  const batteries = components.filter(c => c.type === 'battery');
  if (batteries.length === 0) {
    result.statusMessage = 'Sin fuente de tensión (agrega una batería)';
    return result;
  }

  const mainBattery = batteries[0];
  const batPlusNode = terminalToNode[`${mainBattery.id}-t0`];
  const batMinusNode = terminalToNode[`${mainBattery.id}-t1`];

  // Si no hay continuidad entre polo positivo y negativo a través del circuito exterior
  if (!batPlusNode || !batMinusNode) {
    result.statusMessage = 'Batería desconectada';
    return result;
  }

  // 3. Crear matriz MNA para resolver tensiones de nodo
  const nodeArray = Array.from(uniqueNodes);
  // El polo negativo de la batería principal es la Referencia (GND / 0V)
  const gndNode = batMinusNode;
  const activeNodes = nodeArray.filter(n => n !== gndNode);
  const nodeIndexMap = new Map<string, number>();
  activeNodes.forEach((node, idx) => nodeIndexMap.set(node, idx));

  const numActiveNodes = activeNodes.length;
  const numVoltageSources = batteries.length;
  const totalDim = numActiveNodes + numVoltageSources;

  if (totalDim === 0) {
    result.statusMessage = 'Circuito abierto';
    return result;
  }

  const G: number[][] = Array.from({ length: totalDim }, () => Array(totalDim).fill(0));
  const I_vec: number[] = Array(totalDim).fill(0);

  // Helper para estampar conductancia entre terminales
  function stampResistor(t0: string, t1: string, R: number) {
    const nA = terminalToNode[t0];
    const nB = terminalToNode[t1];
    if (nA === nB) return; // Mismo nodo, no fluye corriente externa

    const conductance = 1 / Math.max(0.001, R);
    const idxA = nodeIndexMap.get(nA);
    const idxB = nodeIndexMap.get(nB);

    if (idxA !== undefined) {
      G[idxA][idxA] += conductance;
    }
    if (idxB !== undefined) {
      G[idxB][idxB] += conductance;
    }
    if (idxA !== undefined && idxB !== undefined) {
      G[idxA][idxB] -= conductance;
      G[idxB][idxA] -= conductance;
    }
  }

  // Estampar resistencias y bombillas
  for (const c of components) {
    if (c.type === 'resistor') {
      stampResistor(`${c.id}-t0`, `${c.id}-t1`, c.value || 100);
    } else if (c.type === 'bulb') {
      stampResistor(`${c.id}-t0`, `${c.id}-t1`, c.value || 25);
    } else if (c.type === 'switch' && c.isOpen) {
      // Interruptor abierto: no estampa conductancia (resistencia infinita)
    }
  }

  // Estampar baterías (fuentes de tensión ideales)
  for (let bIdx = 0; bIdx < batteries.length; bIdx++) {
    const bat = batteries[bIdx];
    const plusN = terminalToNode[`${bat.id}-t0`];
    const minusN = terminalToNode[`${bat.id}-t1`];
    const mnaRow = numActiveNodes + bIdx;

    const plusIdx = nodeIndexMap.get(plusN);
    const minusIdx = nodeIndexMap.get(minusN);

    if (plusIdx !== undefined) {
      G[plusIdx][mnaRow] += 1;
      G[mnaRow][plusIdx] += 1;
    }
    if (minusIdx !== undefined) {
      G[minusIdx][mnaRow] -= 1;
      G[mnaRow][minusIdx] -= 1;
    }

    I_vec[mnaRow] = bat.value || 12; // Tensión de la batería
  }

  // Verificar si hay cortocircuito directo entre bornes de la batería (+ y - en el mismo supernodo)
  if (batPlusNode === batMinusNode) {
    result.isShortCircuit = true;
    result.isClosed = true;
    result.totalVoltage = mainBattery.value;
    result.totalResistance = 0.01;
    result.totalCurrent = 1200; // Simulación de corriente extrema
    result.totalPower = result.totalVoltage * result.totalCurrent;
    result.statusMessage = '¡CORTOCIRCUITO DIRECTO EN LA BATERÍA!';

    for (const c of components) {
      result.components[c.id] = {
        componentId: c.id,
        voltageDrop: 0,
        current: 0,
        power: 0,
        isOverloaded: true,
      };
    }
    return result;
  }

  // Resolver el sistema lineal
  const solution = solveLinearSystem(G, I_vec);

  // Mapear potenciales de nodo
  const nodeVoltages: Record<string, number> = { [gndNode]: 0 };
  if (solution) {
    activeNodes.forEach((node, idx) => {
      nodeVoltages[node] = solution[idx];
    });
  }

  // Calcular magnitudes en cada componente
  let totalBatCurrent = 0;
  for (let bIdx = 0; bIdx < batteries.length; bIdx++) {
    if (solution) {
      const batCurr = Math.abs(solution[numActiveNodes + bIdx]);
      totalBatCurrent += batCurr;
    }
  }

  result.totalVoltage = mainBattery.value;
  result.nodeVoltages = {};

  // Asignar voltaje a cada terminal para medición con voltímetro
  for (const tid of terminalMap.keys()) {
    const n = terminalToNode[tid];
    const volt = nodeVoltages[n] ?? 0;
    result.nodeVoltages[tid] = volt;
  }

  let circuitHasFlow = totalBatCurrent > 0.0001;

  for (const c of components) {
    const v0 = result.nodeVoltages[`${c.id}-t0`] ?? 0;
    const v1 = result.nodeVoltages[`${c.id}-t1`] ?? 0;
    const vDrop = Math.abs(v0 - v1);

    if (c.type === 'battery') {
      const batCurrent = totalBatCurrent;
      result.components[c.id] = {
        componentId: c.id,
        voltageDrop: c.value,
        current: batCurrent,
        power: c.value * batCurrent,
        isOverloaded: batCurrent > 50,
      };
    } else if (c.type === 'resistor') {
      const rVal = Math.max(0.1, c.value || 100);
      const curr = vDrop / rVal;
      const power = vDrop * curr;
      result.components[c.id] = {
        componentId: c.id,
        voltageDrop: vDrop,
        current: curr,
        power,
        isOverloaded: power > 0.6, // Típico resistor de 0.5W
      };
    } else if (c.type === 'bulb') {
      const rVal = Math.max(0.1, c.value || 25);
      const curr = vDrop / rVal;
      const power = vDrop * curr;
      // Brillo proporcional a la potencia (1W = brillo pleno)
      const nominalPower = Math.pow(mainBattery.value, 2) / rVal;
      const glow = Math.min(1, Math.max(0, power / Math.max(1, nominalPower * 0.8)));
      result.components[c.id] = {
        componentId: c.id,
        voltageDrop: vDrop,
        current: curr,
        power,
        isOverloaded: power > 30,
        isGlowing: glow > 0.02,
        glowIntensity: glow,
      };
    } else if (c.type === 'switch') {
      result.components[c.id] = {
        componentId: c.id,
        voltageDrop: c.isOpen ? vDrop : 0,
        current: c.isOpen ? 0 : totalBatCurrent,
        power: 0,
        isOverloaded: false,
      };
    } else if (c.type === 'wire') {
      result.components[c.id] = {
        componentId: c.id,
        voltageDrop: 0,
        current: totalBatCurrent,
        power: 0,
        isOverloaded: totalBatCurrent > 50,
      };
    }
  }

  // Detección de estados generales
  if (totalBatCurrent > 50) {
    result.isShortCircuit = true;
    result.isClosed = true;
    result.totalCurrent = totalBatCurrent;
    result.totalResistance = totalBatCurrent > 0 ? result.totalVoltage / totalBatCurrent : 0.01;
    result.totalPower = result.totalVoltage * result.totalCurrent;
    result.statusMessage = '¡Advertencia de Cortocircuito! Corriente excesiva.';
  } else if (circuitHasFlow) {
    result.isClosed = true;
    result.totalCurrent = totalBatCurrent;
    result.totalResistance = result.totalVoltage / Math.max(1e-6, totalBatCurrent);
    result.totalPower = result.totalVoltage * totalBatCurrent;
    result.statusMessage = 'Circuito Cerrado y Activo';
  } else {
    // Si algún interruptor está abierto en la trayectoria
    const anyOpenSwitch = components.some(c => c.type === 'switch' && c.isOpen);
    result.isClosed = false;
    result.totalCurrent = 0;
    result.totalResistance = Infinity;
    result.totalPower = 0;
    result.statusMessage = anyOpenSwitch
      ? 'Circuito Abierto (Interruptor apagado)'
      : 'Circuito Abierto o Incompleto';
  }

  return result;
}
