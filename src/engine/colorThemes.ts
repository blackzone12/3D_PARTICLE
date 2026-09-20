import { ColorTheme } from '../types';
import * as THREE from 'three';

export interface ThemeColors {
  primary: THREE.Color;
  secondary: THREE.Color;
  accent: THREE.Color;
  background: string;
  glow: string;
}

export const COLOR_THEMES: Record<ColorTheme, ThemeColors> = {
  nebula_cosmos: {
    primary: new THREE.Color(0x38bdf8), // Sky cyan
    secondary: new THREE.Color(0xa855f7), // Electric purple
    accent: new THREE.Color(0xec4899), // Pink
    background: '#030712',
    glow: 'rgba(56, 189, 248, 0.4)',
  },
  cyberpunk: {
    primary: new THREE.Color(0x06b6d4), // Cyan
    secondary: new THREE.Color(0xf43f5e), // Rose red
    accent: new THREE.Color(0xfacc15), // High-volt yellow
    background: '#020617',
    glow: 'rgba(244, 63, 94, 0.4)',
  },
  solar_flare: {
    primary: new THREE.Color(0xf59e0b), // Amber
    secondary: new THREE.Color(0xef4444), // Fire red
    accent: new THREE.Color(0xfef08a), // Solar core yellow
    background: '#090503',
    glow: 'rgba(245, 158, 11, 0.45)',
  },
  bioluminescence: {
    primary: new THREE.Color(0x10b981), // Emerald
    secondary: new THREE.Color(0x06b6d4), // Cyan marine
    accent: new THREE.Color(0x84cc16), // Phosphor lime
    background: '#020b08',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  obsidian_chrome: {
    primary: new THREE.Color(0xe2e8f0), // Platinum
    secondary: new THREE.Color(0x64748b), // Slate chrome
    accent: new THREE.Color(0xf8fafc), // Pure white
    background: '#040508',
    glow: 'rgba(226, 232, 240, 0.3)',
  },
  quantum_spectrum: {
    primary: new THREE.Color(0x6366f1), // Indigo
    secondary: new THREE.Color(0x14b8a6), // Teal
    accent: new THREE.Color(0xf97316), // Orange
    background: '#050510',
    glow: 'rgba(99, 102, 241, 0.45)',
  },
};

/**
 * Apply color palette transformation to raw color channels
 */
export function applyThemeToColor(
  theme: ColorTheme,
  baseR: number,
  baseG: number,
  baseB: number,
  outColor: THREE.Color,
  velocityFactor: number = 0
): void {
  const t = COLOR_THEMES[theme];

  // Lerp across primary -> secondary -> accent based on base color components
  const mixFactor = (baseR * 0.4 + baseG * 0.4 + baseB * 0.2);
  
  if (theme === 'quantum_spectrum') {
    // Dynamic spectral cycling
    const hue = (mixFactor + velocityFactor * 0.5) % 1.0;
    outColor.setHSL(hue, 0.9, 0.55 + velocityFactor * 0.2);
  } else {
    if (mixFactor < 0.5) {
      outColor.copy(t.primary).lerp(t.secondary, mixFactor * 2.0);
    } else {
      outColor.copy(t.secondary).lerp(t.accent, (mixFactor - 0.5) * 2.0);
    }
    // High velocity flashes whiter/hotter
    if (velocityFactor > 0.1) {
      outColor.lerp(new THREE.Color(1, 1, 1), Math.min(1.0, velocityFactor * 0.8));
    }
  }
}
