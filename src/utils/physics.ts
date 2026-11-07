import { CircuitParameters, CircuitAnalysisResult, SystemResultant, VectorForce } from '../types';

/**
 * Convierte grados a radianes
 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Convierte radianes a grados y normaliza a [0, 360)
 */
export function radToDeg(rad: number): number {
  let deg = (rad * 180) / Math.PI;
  deg = (deg % 360 + 360) % 360;
  return deg;
}

/**
 * Redondeo con signo explícito opcional para presentación didáctica
 */
export function formatSigned(val: number, decimals: number = 2): string {
  const rounded = val.toFixed(decimals).replace('.', ',');
  return val >= 0 ? `+${rounded}` : `${rounded}`;
}

/**
 * Formateo en español (coma decimal)
 */
export function formatNumber(val: number, decimals: number = 2): string {
  return val.toFixed(decimals).replace('.', ',');
}

/**
 * Determina el cuadrante en base al ángulo en grados [0, 360)
 */
export function getQuadrant(angleDeg: number): string {
  const norm = (angleDeg % 360 + 360) % 360;
  if (norm === 0 || norm === 360) return 'Eje +X';
  if (norm > 0 && norm < 90) return 'Cuadrante I';
  if (norm === 90) return 'Eje +Y';
  if (norm > 90 && norm < 180) return 'Cuadrante II';
  if (norm === 180) return 'Eje -X';
  if (norm > 180 && norm < 270) return 'Cuadrante III';
  if (norm === 270) return 'Eje -Y';
  return 'Cuadrante IV';
}

/**
 * Calcula proyecciones rectangulares Fx y Fy de una fuerza
 */
export function calculateComponents(magnitude: number, angleDeg: number): { fx: number; fy: number } {
  const rad = degToRad(angleDeg);
  let fx = magnitude * Math.cos(rad);
  let fy = magnitude * Math.sin(rad);

  if (Math.abs(fx) < 1e-10) fx = 0;
  if (Math.abs(fy) < 1e-10) fy = 0;

  return { fx, fy };
}

/**
 * Calcula la fuerza resultante del sistema de vectores concurrentes
 */
export function calculateResultant(vectors: VectorForce[]): SystemResultant {
  const visibleVectors = vectors.filter(v => v.visible);
  
  let sumFx = 0;
  let sumFy = 0;

  for (const vec of visibleVectors) {
    const { fx, fy } = calculateComponents(vec.magnitude, vec.angle);
    sumFx += fx;
    sumFy += fy;
  }

  if (Math.abs(sumFx) < 1e-10) sumFx = 0;
  if (Math.abs(sumFy) < 1e-10) sumFy = 0;

  const magnitude = Math.sqrt(sumFx * sumFx + sumFy * sumFy);
  
  let angle = 0;
  let directionDescription = 'Vector nulo (magnitud 0)';

  if (magnitude > 1e-6) {
    const rad = Math.atan2(sumFy, sumFx);
    angle = radToDeg(rad);

    if (sumFx >= 0 && sumFy >= 0) {
      directionDescription = 'Desde +X, en sentido antihorario. La resultante apunta hacia arriba y a la derecha ↗.';
    } else if (sumFx < 0 && sumFy >= 0) {
      directionDescription = 'Desde +X, en sentido antihorario. La resultante apunta hacia arriba y a la izquierda ↖.';
    } else if (sumFx < 0 && sumFy < 0) {
      directionDescription = 'Desde +X, en sentido antihorario. La resultante apunta hacia abajo y a la izquierda ↙.';
    } else {
      directionDescription = 'Desde +X, en sentido antihorario. La resultante apunta hacia abajo y a la derecha ↘.';
    }
  }

  return {
    sumFx,
    sumFy,
    magnitude,
    angle,
    quadrant: magnitude > 1e-6 ? getQuadrant(angle) : 'Origen (0,0)',
    directionDescription,
  };
}

/**
 * Análisis de circuito en serie con array dinámico de resistencias
 */
export function analyzeSeriesArray(voltage: number, rValues: number[], nominalPower: number = 0.5): CircuitAnalysisResult {
  const req = rValues.reduce((acc, r) => acc + r, 0);
  const it = req > 0 ? voltage / req : 0;
  const pt = voltage * it;

  const subscripts = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₁₀'];

  let overloadCount = 0;
  const resistors = rValues.map((r, idx) => {
    const name = `R${subscripts[idx] || (idx + 1)}`;
    const v = it * r;
    const i = it;
    const p = v * i;
    const pPercent = nominalPower > 0 ? (p / nominalPower) * 100 : 0;
    const isOverloaded = p > nominalPower;
    if (isOverloaded) overloadCount++;

    return {
      name,
      r,
      v,
      i,
      p,
      pNominal: nominalPower,
      pPercent,
      isOverloaded,
    };
  });

  const sumV = resistors.reduce((acc, curr) => acc + curr.v, 0);
  const kvlBalance = voltage - sumV;
  const powerBalance = pt - resistors.reduce((acc, curr) => acc + curr.p, 0);

  return {
    mode: 'series',
    req,
    it,
    pt,
    resistors,
    overloadCount,
    kclBalance: 0,
    kvlBalance: Math.abs(kvlBalance) < 1e-6 ? 0 : kvlBalance,
    powerBalance: Math.abs(powerBalance) < 1e-6 ? 0 : powerBalance,
  };
}

export function analyzeSeriesCircuit(params: CircuitParameters): CircuitAnalysisResult {
  const { voltage, r1, r2, r3, nominalPower } = params;
  return analyzeSeriesArray(voltage, [r1, r2, r3], nominalPower);
}

/**
 * Análisis de circuito en paralelo con array dinámico de resistencias
 */
export function analyzeParallelArray(voltage: number, rValues: number[], nominalPower: number = 0.5): CircuitAnalysisResult {
  const invReq = rValues.reduce((acc, r) => acc + (r > 0 ? 1 / r : 0), 0);
  const req = invReq > 0 ? 1 / invReq : 0;

  const subscripts = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₁₀'];

  let overloadCount = 0;
  const resistors = rValues.map((r, idx) => {
    const name = `R${subscripts[idx] || (idx + 1)}`;
    const v = voltage;
    const i = r > 0 ? v / r : 0;
    const p = v * i;
    const pPercent = nominalPower > 0 ? (p / nominalPower) * 100 : 0;
    const isOverloaded = p > nominalPower;
    if (isOverloaded) overloadCount++;

    return {
      name,
      r,
      v,
      i,
      p,
      pNominal: nominalPower,
      pPercent,
      isOverloaded,
    };
  });

  const sumI = resistors.reduce((acc, curr) => acc + curr.i, 0);
  const it = sumI;
  const pt = voltage * it;

  const kclBalance = it - sumI;
  const powerBalance = pt - resistors.reduce((acc, curr) => acc + curr.p, 0);

  return {
    mode: 'parallel',
    req,
    it,
    pt,
    resistors,
    overloadCount,
    kclBalance: Math.abs(kclBalance) < 1e-6 ? 0 : kclBalance,
    kvlBalance: 0,
    powerBalance: Math.abs(powerBalance) < 1e-6 ? 0 : powerBalance,
  };
}

export function analyzeParallelCircuit(params: CircuitParameters): CircuitAnalysisResult {
  const { voltage, r1, r2, r3, nominalPower } = params;
  return analyzeParallelArray(voltage, [r1, r2, r3], nominalPower);
}
