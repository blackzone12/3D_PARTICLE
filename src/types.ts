export type TopologyType =
  | 'lorenz'
  | 'torus_knot'
  | 'calabi_yau'
  | 'black_hole'
  | 'neural_connectome'
  | 'double_helix'
  | 'metatron_cube'
  | 'quantum_vortex'
  | 'superformula'
  | 'mobius_strip'
  | 'klein_bottle'
  | 'gyroid'
  | 'clifford_torus'
  | 'cardioid_heart'
  | 'galaxy_spiral'
  | 'lissajous_knot'
  | 'text_glyph'
  | 'parametric_custom'
  | 'drawn_3d'
  | 'infinite_mutation';

export interface ParametricParams {
  m: number; // Symmetry folds (1 to 16)
  n1: number; // Corner shape power
  n2: number; // Primary lobe power
  n3: number; // Secondary lobe power
  twist: number; // Z-axis helical twist
  pinch: number; // Waist constriction
  aspectRatio: number;
  noiseDisplace: number;
  freqX: number;
  freqY: number;
  freqZ: number;
}

export type ColorTheme =
  | 'nebula_cosmos'
  | 'cyberpunk'
  | 'solar_flare'
  | 'bioluminescence'
  | 'obsidian_chrome'
  | 'quantum_spectrum';

export type InteractionMode =
  | 'attract'
  | 'repel'
  | 'vortex'
  | 'wave'
  | 'draw_3d'
  | 'none';

export type CameraMode =
  | 'free'
  | 'cinematic_drift'
  | 'top_down'
  | 'side_view'
  | 'core_dive';

export interface ParticleConfig {
  count: number;
  size: number;
  morphSpeed: number;
  noiseStrength: number;
  gravityStrength: number;
  damping: number;
  timeScale: number;
  colorTheme: ColorTheme;
  topology: TopologyType;
  pointStyle: 'glow_disc' | 'quantum_ring' | 'star_sparkle' | 'crisp_dot';
  bloomIntensity: number;
  audioReactivity: number;
  customText: string;
  parametric: ParametricParams;
  brightness: number; // 0.2 to 1.5, default calibrated for crisp visibility
  blendMode: 'normal' | 'additive'; // 'normal' ensures particles are clearly visible without overblown white wash
}

export interface AudioConfig {
  enabled: boolean;
  volume: number;
  droneGain?: number;
  droneFrequency: number;
  scale: 'celestial' | 'dorian' | 'lydian' | 'akebono' | 'cosmic_pentatonic';
  micReactive: boolean;
  tempo: number;
  reverbDecay: number;
}

export interface TelemetryData {
  fps: number;
  particleCount: number;
  kineticEnergy: number;
  spatialEntropy: number;
  activeHarmonic: string;
  fieldSingularities: number;
}

export interface GravitationalSingularity {
  id: string;
  position: { x: number; y: number; z: number };
  strength: number; // positive = attractor, negative = repulsor
  radius: number;
  createdAt: number;
  color: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  category: 'master' | 'user';
  createdAt: number;
  particleConfig: ParticleConfig;
  audioConfig: AudioConfig;
  cameraMode?: CameraMode;
  interactionMode?: InteractionMode;
  singularities?: GravitationalSingularity[];
}

export interface RecordingState {
  isRecording: boolean;
  duration: number; // seconds
  isPaused: boolean;
  mimeType?: string;
}

export interface AccessibilityConfig {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode?: boolean;
  performanceQuality?: 'eco' | 'balanced' | 'ultra' | 'quantum';
  announceLive?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
  colorBlindMode?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  soundDescriptions?: boolean;
}
