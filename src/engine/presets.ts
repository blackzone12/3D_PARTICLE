import { Preset, ParticleConfig, AudioConfig } from '../types';

export const MASTER_PRESETS: Preset[] = [
  {
    id: 'cosmic_singularity',
    name: 'Cosmic Singularity',
    description: 'A dense gravitational event horizon with high-density black hole geometry and obsidian-amber event rings.',
    category: 'master',
    createdAt: 1710000000000,
    cameraMode: 'free',
    interactionMode: 'attract',
    particleConfig: {
      count: 35000,
      size: 0.8,
      morphSpeed: 1.2,
      noiseStrength: 0.12,
      gravityStrength: 2.2,
      damping: 0.93,
      timeScale: 1.0,
      colorTheme: 'solar_flare',
      topology: 'black_hole',
      pointStyle: 'crisp_dot',
      bloomIntensity: 0.4,
      audioReactivity: 0.6,
      customText: 'AETHERIA',
      parametric: {
        m: 6, n1: 1.0, n2: 1.7, n3: 1.7, twist: 2.0, pinch: 0.3, aspectRatio: 1.0, noiseDisplace: 0.8, freqX: 2, freqY: 3, freqZ: 2,
      },
      brightness: 0.8,
      blendMode: 'normal',
    },
    audioConfig: {
      enabled: true,
      volume: 0.22,
      droneGain: 0.65,
      droneFrequency: 55.0, // A1 deep drone
      scale: 'dorian',
      micReactive: false,
      tempo: 108,
      reverbDecay: 3.2,
    },
  },
  {
    id: 'cyber_neural_matrix',
    name: 'Cyber Neural Grid',
    description: 'High-frequency synaptogenesis connecting deep neural nodes with glowing cyberpunk luminescence and rapid arpeggiation.',
    category: 'master',
    createdAt: 1710000001000,
    cameraMode: 'cinematic_drift',
    interactionMode: 'vortex',
    particleConfig: {
      count: 32000,
      size: 0.75,
      morphSpeed: 1.1,
      noiseStrength: 0.2,
      gravityStrength: 1.8,
      damping: 0.94,
      timeScale: 1.15,
      colorTheme: 'cyberpunk',
      topology: 'neural_connectome',
      pointStyle: 'quantum_ring',
      bloomIntensity: 0.5,
      audioReactivity: 0.7,
      customText: 'NEURAL',
      parametric: {
        m: 8, n1: 1.2, n2: 2.0, n3: 2.0, twist: 3.5, pinch: 0.4, aspectRatio: 1.0, noiseDisplace: 1.0, freqX: 3, freqY: 4, freqZ: 2,
      },
      brightness: 0.75,
      blendMode: 'normal',
    },
    audioConfig: {
      enabled: true,
      volume: 0.2,
      droneGain: 0.45,
      droneFrequency: 73.42, // D2
      scale: 'celestial',
      micReactive: false,
      tempo: 130,
      reverbDecay: 2.2,
    },
  },
  {
    id: 'celestial_harp',
    name: 'Celestial Harp',
    description: 'Calabi-Yau 6D compactification manifold producing shimmering crystalline arpeggios in celestial Lydian mode.',
    category: 'master',
    createdAt: 1710000002000,
    cameraMode: 'free',
    interactionMode: 'wave',
    particleConfig: {
      count: 30000,
      size: 0.7,
      morphSpeed: 0.9,
      noiseStrength: 0.1,
      gravityStrength: 1.4,
      damping: 0.96,
      timeScale: 0.9,
      colorTheme: 'quantum_spectrum',
      topology: 'calabi_yau',
      pointStyle: 'star_sparkle',
      bloomIntensity: 0.45,
      audioReactivity: 0.5,
      customText: 'CELESTIAL',
      parametric: {
        m: 6, n1: 1.0, n2: 1.7, n3: 1.7, twist: 1.5, pinch: 0.2, aspectRatio: 1.0, noiseDisplace: 0.6, freqX: 2, freqY: 3, freqZ: 2,
      },
      brightness: 0.7,
      blendMode: 'normal',
    },
    audioConfig: {
      enabled: true,
      volume: 0.2,
      droneGain: 0.5,
      droneFrequency: 65.41, // C2
      scale: 'lydian',
      micReactive: false,
      tempo: 110,
      reverbDecay: 3.6,
    },
  },
  {
    id: 'bio_luminescence_deep',
    name: 'Abyssal Bioluminescence',
    description: 'Fluid underwater vortex inspired by deep oceanic siphonophores with cyan, teal, and emerald tidal harmonics.',
    category: 'master',
    createdAt: 1710000003000,
    cameraMode: 'core_dive',
    interactionMode: 'vortex',
    particleConfig: {
      count: 28000,
      size: 0.85,
      morphSpeed: 0.85,
      noiseStrength: 0.22,
      gravityStrength: 1.5,
      damping: 0.95,
      timeScale: 0.85,
      colorTheme: 'bioluminescence',
      topology: 'quantum_vortex',
      pointStyle: 'glow_disc',
      bloomIntensity: 0.35,
      audioReactivity: 0.65,
      customText: 'ABYSS',
      parametric: {
        m: 5, n1: 0.8, n2: 1.4, n3: 1.4, twist: 4.0, pinch: 0.6, aspectRatio: 1.2, noiseDisplace: 1.2, freqX: 3, freqY: 2, freqZ: 3,
      },
      brightness: 0.72,
      blendMode: 'normal',
    },
    audioConfig: {
      enabled: true,
      volume: 0.18,
      droneGain: 0.6,
      droneFrequency: 58.27, // A#1
      scale: 'akebono',
      micReactive: false,
      tempo: 96,
      reverbDecay: 4.0,
    },
  },
  {
    id: 'lorenz_chaos_attractor',
    name: 'Lorenz Butterfly Chaos',
    description: 'Dynamic strange attractor system exhibiting non-linear deterministic chaos and sensitive atmospheric turbulence.',
    category: 'master',
    createdAt: 1710000004000,
    cameraMode: 'free',
    interactionMode: 'attract',
    particleConfig: {
      count: 32000,
      size: 0.72,
      morphSpeed: 1.0,
      noiseStrength: 0.14,
      gravityStrength: 1.7,
      damping: 0.94,
      timeScale: 1.0,
      colorTheme: 'nebula_cosmos',
      topology: 'lorenz',
      pointStyle: 'crisp_dot',
      bloomIntensity: 0.38,
      audioReactivity: 0.55,
      customText: 'CHAOS',
      parametric: {
        m: 6, n1: 1.0, n2: 1.7, n3: 1.7, twist: 2.0, pinch: 0.3, aspectRatio: 1.0, noiseDisplace: 0.8, freqX: 2, freqY: 3, freqZ: 2,
      },
      brightness: 0.75,
      blendMode: 'normal',
    },
    audioConfig: {
      enabled: true,
      volume: 0.2,
      droneGain: 0.5,
      droneFrequency: 65.41,
      scale: 'cosmic_pentatonic',
      micReactive: false,
      tempo: 124,
      reverbDecay: 2.8,
    },
  },
  {
    id: 'metatron_sacred_crystal',
    name: "Metatron's Sacred Crystal",
    description: 'Multi-dimensional sacred geometry lattice projecting Platonic solid harmonic lines in obsidian chrome.',
    category: 'master',
    createdAt: 1710000005000,
    cameraMode: 'top_down',
    interactionMode: 'repel',
    particleConfig: {
      count: 30000,
      size: 0.78,
      morphSpeed: 1.2,
      noiseStrength: 0.08,
      gravityStrength: 1.6,
      damping: 0.95,
      timeScale: 0.95,
      colorTheme: 'obsidian_chrome',
      topology: 'metatron_cube',
      pointStyle: 'crisp_dot',
      bloomIntensity: 0.3,
      audioReactivity: 0.45,
      customText: 'METATRON',
      parametric: {
        m: 6, n1: 1.0, n2: 1.0, n3: 1.0, twist: 0.0, pinch: 0.0, aspectRatio: 1.0, noiseDisplace: 0.2, freqX: 2, freqY: 2, freqZ: 2,
      },
      brightness: 0.82,
      blendMode: 'normal',
    },
    audioConfig: {
      enabled: true,
      volume: 0.18,
      droneGain: 0.4,
      droneFrequency: 82.41, // E2
      scale: 'dorian',
      micReactive: false,
      tempo: 116,
      reverbDecay: 3.0,
    },
  },
];

const STORAGE_KEY = 'aetheria_user_presets_v1';

export function loadUserPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(p => p && p.id && p.name && p.particleConfig);
    }
    return [];
  } catch (err) {
    console.warn('Failed to load user presets from localStorage', err);
    return [];
  }
}

export function saveUserPresets(presets: Preset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (err) {
    console.warn('Failed to write user presets to localStorage', err);
  }
}

export function saveUserPreset(preset: Omit<Preset, 'id' | 'category' | 'createdAt'>): Preset {
  const current = loadUserPresets();
  const newPreset: Preset = {
    ...preset,
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    category: 'user',
    createdAt: Date.now(),
  };
  const updated = [newPreset, ...current.slice(0, 19)]; // Keep up to 20 user presets
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to write user preset to localStorage', err);
  }
  return newPreset;
}

export function deleteUserPreset(id: string): boolean {
  const current = loadUserPresets();
  const filtered = current.filter(p => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.warn('Failed to delete user preset', err);
    return false;
  }
}

export function exportPresetAsJSON(preset: Preset): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(preset, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const cleanName = preset.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadAnchor.setAttribute('download', `aetheria_preset_${cleanName}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseImportedPresetJSON(jsonString: string): Preset | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.particleConfig || !parsed.particleConfig.topology) return null;

    const validPreset: Preset = {
      id: `imported_${Date.now()}`,
      name: typeof parsed.name === 'string' ? parsed.name : 'Imported Preset',
      description: typeof parsed.description === 'string' ? parsed.description : 'User imported configuration',
      category: 'user',
      createdAt: Date.now(),
      particleConfig: parsed.particleConfig,
      audioConfig: parsed.audioConfig || {
        enabled: true,
        volume: 0.18,
        droneFrequency: 65.41,
        scale: 'celestial',
        micReactive: false,
        tempo: 120,
        reverbDecay: 2.5,
      },
      cameraMode: parsed.cameraMode || 'free',
      interactionMode: parsed.interactionMode || 'attract',
    };
    return validPreset;
  } catch (err) {
    console.warn('Invalid JSON format for preset import', err);
    return null;
  }
}
