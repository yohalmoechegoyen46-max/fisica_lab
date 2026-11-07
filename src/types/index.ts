/**
 * Tipos y definiciones de datos para FísicaLab
 */

export type ActiveView = 
  | 'home'
  | 'vectors'
  | 'ohm'
  | 'designers';

export interface Designer {
  id: string;
  name: string;
  career: string;
  studentId: string;
  institutionalEmail: string;
  personalEmail: string;
  avatarUrl: string;
  role: string;
  institution: string;
}

export type VectorSubTab = 'cartesian' | 'dcl';

export type OhmSubTab = 'calculator' | 'series' | 'parallel' | 'analysis' | 'builder';

export interface VectorForce {
  id: string;
  name: string; // Ej: F₁
  label: string; // Ej: Fuerza aplicada
  magnitude: number; // En Newtons (N)
  angle: number; // En grados (0 - 360°)
  color: string;
  visible: boolean;
}

export interface VectorAnalysisResult {
  fx: number;
  fy: number;
  quadrant: string;
}

export interface SystemResultant {
  sumFx: number;
  sumFy: number;
  magnitude: number;
  angle: number; // 0 - 360°
  quadrant: string;
  directionDescription: string;
}

export interface CircuitParameters {
  voltage: number; // V (1 - 24V)
  r1: number; // Ω (10 - 500Ω)
  r2: number; // Ω (10 - 500Ω)
  r3: number; // Ω (10 - 500Ω)
  nominalPower: number; // W (ej: 0.50 W)
}

export interface ResistorAnalysis {
  name: string;
  r: number;
  v: number;
  i: number;
  p: number;
  pNominal: number;
  pPercent: number;
  isOverloaded: boolean;
}

export interface CircuitAnalysisResult {
  mode: 'series' | 'parallel';
  req: number;
  it: number;
  pt: number;
  resistors: ResistorAnalysis[];
  overloadCount: number;
  kclBalance: number;
  kvlBalance: number;
  powerBalance: number;
}
