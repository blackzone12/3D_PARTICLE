import { TopologyType, ParametricParams } from '../types';
import { generateTextParticles } from './textToParticles';
import {
  generateSuperformula,
  generateMobiusStrip,
  generateKleinBottle,
  generateGyroid,
  generateCliffordTorus,
  generateCardioidHeart,
  generateGalaxySpiral,
  generateLissajousKnot,
} from './parametricBuilder';
import * as THREE from 'three';

export interface TopologyData {
  positions: Float32Array;
  colors: Float32Array;
  scales: Float32Array;
}

export interface TopologyExtraConfig {
  customText?: string;
  parametric?: ParametricParams;
  drawnPoints?: THREE.Vector3[];
}

/**
 * Computes 3D target coordinates and spectral tint coordinates for each topology
 */
export function generateTopology(
  type: TopologyType,
  count: number,
  scaleFactor: number = 24,
  extra?: TopologyExtraConfig
): TopologyData {
  // Delegate specialized shapes
  if (type === 'text_glyph') {
    return generateTextParticles(extra?.customText || 'AETHERIA', count, scaleFactor);
  }

  if (type === 'superformula' || type === 'parametric_custom' || type === 'infinite_mutation') {
    const defaultParams: ParametricParams = extra?.parametric || {
      m: 6,
      n1: 1.0,
      n2: 1.7,
      n3: 1.7,
      twist: 2.0,
      pinch: 0.3,
      aspectRatio: 1.0,
      noiseDisplace: 0.8,
      freqX: 2,
      freqY: 3,
      freqZ: 2,
    };
    return generateSuperformula(defaultParams, count, scaleFactor);
  }

  if (type === 'mobius_strip') {
    return generateMobiusStrip(count, scaleFactor);
  }

  if (type === 'klein_bottle') {
    return generateKleinBottle(count, scaleFactor);
  }

  if (type === 'gyroid') {
    return generateGyroid(count, scaleFactor);
  }

  if (type === 'clifford_torus') {
    return generateCliffordTorus(count, scaleFactor);
  }

  if (type === 'cardioid_heart') {
    return generateCardioidHeart(count, scaleFactor);
  }

  if (type === 'galaxy_spiral') {
    return generateGalaxySpiral(count, scaleFactor);
  }

  if (type === 'lissajous_knot') {
    return generateLissajousKnot(
      extra?.parametric?.freqX || 3,
      extra?.parametric?.freqY || 4,
      extra?.parametric?.freqZ || 7,
      count,
      scaleFactor
    );
  }

  if (type === 'drawn_3d') {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const pts = extra?.drawnPoints;

    if (!pts || pts.length < 2) {
      // Fallback to gentle ribbon spiral if no drawn points yet
      return generateGalaxySpiral(count, scaleFactor);
    }

    const pathLen = pts.length;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = (i / count) * (pathLen - 1);
      const idx = Math.floor(t);
      const frac = t - idx;
      const nextIdx = Math.min(pathLen - 1, idx + 1);

      const p0 = pts[idx];
      const p1 = pts[nextIdx];

      const spread = 0.6;
      const jx = (Math.random() - 0.5) * spread;
      const jy = (Math.random() - 0.5) * spread;
      const jz = (Math.random() - 0.5) * spread;

      positions[i3] = p0.x * (1 - frac) + p1.x * frac + jx;
      positions[i3 + 1] = p0.y * (1 - frac) + p1.y * frac + jy;
      positions[i3 + 2] = p0.z * (1 - frac) + p1.z * frac + jz;

      colors[i3] = 0.4 + 0.6 * (i / count);
      colors[i3 + 1] = 0.7 + 0.3 * Math.sin(i * 0.1);
      colors[i3 + 2] = 0.9;
      scales[i] = 0.8;
    }
    return { positions, colors, scales };
  }

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  switch (type) {
    case 'lorenz': {
      // Lorenz Strange Attractor ODE simulation
      const sigma = 10.0;
      const rho = 28.0;
      const beta = 8.0 / 3.0;
      const dt = 0.007;

      let x = 0.1, y = 0.0, z = 0.0;
      // Warm up
      for (let w = 0; w < 400; w++) {
        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;

        // Add subtle quantum jitter
        const jitter = 0.45;
        const jx = (Math.random() - 0.5) * jitter;
        const jy = (Math.random() - 0.5) * jitter;
        const jz = (Math.random() - 0.5) * jitter;

        positions[i3] = (x + jx) * (scaleFactor * 0.05);
        positions[i3 + 1] = (y + jy) * (scaleFactor * 0.05);
        positions[i3 + 2] = (z - 25 + jz) * (scaleFactor * 0.05);

        // Normalize speed / location for color coordinates
        const normZ = z / 50.0;
        colors[i3] = 0.2 + 0.8 * normZ;
        colors[i3 + 1] = 0.5 + 0.5 * Math.sin(x * 0.15);
        colors[i3 + 2] = 0.9 - 0.5 * normZ;

        scales[i] = 0.7 + 0.6 * Math.sin(i * 0.02);
      }
      break;
    }

    case 'torus_knot': {
      const p = 3;
      const q = 7;
      const majorR = scaleFactor * 0.45;
      const tubeR = scaleFactor * 0.18;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const u = (i / count) * Math.PI * 2 * p;
        const v = Math.random() * Math.PI * 2;
        const rSub = Math.sqrt(Math.random()) * tubeR;

        // Center curve of knot
        const rKnot = majorR * (0.6 + 0.4 * Math.cos(q * u / p));
        const cx = rKnot * Math.cos(u);
        const cy = rKnot * Math.sin(u);
        const cz = majorR * 0.5 * Math.sin(q * u / p);

        // Frenet-like cross section
        const nx = Math.cos(u) * Math.cos(v);
        const ny = Math.sin(u) * Math.cos(v);
        const nz = Math.sin(v);

        positions[i3] = cx + nx * rSub;
        positions[i3 + 1] = cy + ny * rSub;
        positions[i3 + 2] = cz + nz * rSub;

        colors[i3] = 0.5 + 0.5 * Math.cos(u * 0.5);
        colors[i3 + 1] = 0.6 + 0.4 * Math.sin(v);
        colors[i3 + 2] = 0.8 + 0.2 * Math.sin(u + v);

        scales[i] = 0.8 + 0.5 * Math.cos(v * 2);
      }
      break;
    }

    case 'calabi_yau': {
      // 6D complex manifold projected to 3D
      const n = 5; // manifold degree
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const z1_mag = Math.random();
        const z1_arg = Math.random() * Math.PI * 2;
        const alpha = (i % n) * (2 * Math.PI / n);
        
        const z2_mag = Math.pow(Math.max(0, 1 - Math.pow(z1_mag, n)), 1 / n);
        const z2_arg = (Math.PI - z1_arg + alpha) / n;

        // Stereographic / hyper-spatial projection
        const x1 = z1_mag * Math.cos(z1_arg);
        const y1 = z1_mag * Math.sin(z1_arg);
        const x2 = z2_mag * Math.cos(z2_arg);
        const y2 = z2_mag * Math.sin(z2_arg);

        const rad = scaleFactor * 0.6;
        positions[i3] = rad * (x1 * 0.8 + x2 * 0.5);
        positions[i3 + 1] = rad * (y1 * 0.8 + y2 * 0.5);
        positions[i3 + 2] = rad * (x1 * y2 - y1 * x2) * 1.5;

        colors[i3] = 0.4 + 0.6 * (x1 * 0.5 + 0.5);
        colors[i3 + 1] = 0.2 + 0.8 * (y1 * 0.5 + 0.5);
        colors[i3 + 2] = 0.7 + 0.3 * (z2_mag);

        scales[i] = 0.6 + 0.7 * (1 - z1_mag);
      }
      break;
    }

    case 'black_hole': {
      const eventHorizon = scaleFactor * 0.15;
      const maxDiskRadius = scaleFactor * 0.85;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // 80% accretion disk, 20% relativistic polar jets
        const isJet = i > count * 0.82;

        if (isJet) {
          // Polar relativistic jets
          const sign = Math.random() > 0.5 ? 1 : -1;
          const h = (Math.random() ** 1.8) * scaleFactor * 1.1;
          const coneR = (h / scaleFactor) * 1.8 + 0.2;
          const theta = Math.random() * Math.PI * 2;
          const spiral = h * 0.8;

          positions[i3] = coneR * Math.cos(theta + spiral);
          positions[i3 + 1] = coneR * Math.sin(theta + spiral);
          positions[i3 + 2] = sign * (eventHorizon + h);

          colors[i3] = 0.9;
          colors[i3 + 1] = 0.7 + 0.3 * Math.random();
          colors[i3 + 2] = 1.0;
          scales[i] = 1.2;
        } else {
          // Accretion disk with power-law density falling off
          const rNorm = Math.pow(Math.random(), 0.6);
          const r = eventHorizon + rNorm * (maxDiskRadius - eventHorizon);
          const theta = Math.random() * Math.PI * 2;
          const zDisp = (Math.random() - 0.5) * (0.8 + (r - eventHorizon) * 0.08);

          // Tilt disk for 3D presence
          const tiltAngle = 0.35;
          const rawX = r * Math.cos(theta);
          const rawY = r * Math.sin(theta);
          const rawZ = zDisp;

          positions[i3] = rawX;
          positions[i3 + 1] = rawY * Math.cos(tiltAngle) - rawZ * Math.sin(tiltAngle);
          positions[i3 + 2] = rawY * Math.sin(tiltAngle) + rawZ * Math.cos(tiltAngle);

          // Inner edge burns incandescent white/cyan, outer edge decays to deep crimson
          const heat = 1.0 - (r - eventHorizon) / (maxDiskRadius - eventHorizon);
          colors[i3] = 0.3 + 0.7 * heat;
          colors[i3 + 1] = 0.1 + 0.8 * (heat ** 2);
          colors[i3 + 2] = 0.4 + 0.6 * (heat ** 3);
          scales[i] = 0.5 + 1.2 * heat;
        }
      }
      break;
    }

    case 'neural_connectome': {
      // Dual-hemisphere brain structure with dense cortex & axonal bridges
      const brainWidth = scaleFactor * 0.5;
      const brainLength = scaleFactor * 0.65;
      const brainHeight = scaleFactor * 0.45;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const hemisphere = Math.random() > 0.5 ? 1 : -1;
        const u = Math.random() * Math.PI;
        const v = Math.random() * Math.PI * 2;

        // Cortical folded surface
        const fold = 0.15 * Math.sin(u * 8) * Math.cos(v * 8);
        const rad = 0.8 + fold + (Math.random() - 0.5) * 0.15;

        // Hemispheric separation
        const hOffset = hemisphere * (brainWidth * 0.38);
        const bx = hOffset + rad * (brainWidth * 0.42) * Math.sin(u) * Math.cos(v);
        const by = rad * (brainLength * 0.5) * Math.sin(u) * Math.sin(v);
        const bz = rad * (brainHeight * 0.5) * Math.cos(u);

        // Synaptic cluster probability
        const isCluster = i % 50 === 0;

        positions[i3] = bx;
        positions[i3 + 1] = by;
        positions[i3 + 2] = bz;

        colors[i3] = isCluster ? 1.0 : 0.2 + 0.6 * Math.abs(hemisphere);
        colors[i3 + 1] = isCluster ? 0.9 : 0.5 + 0.5 * Math.sin(u * 3);
        colors[i3 + 2] = isCluster ? 0.3 : 0.8;

        scales[i] = isCluster ? 2.2 : 0.6 + 0.5 * Math.random();
      }
      break;
    }

    case 'double_helix': {
      const length = scaleFactor * 1.5;
      const radius = scaleFactor * 0.28;
      const turns = 6.0;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const t = (i / count) * (Math.PI * 2 * turns);
        const z = ((i / count) - 0.5) * length;

        // 75% helices (Strand A & B), 25% base pairs
        const isRung = i % 4 === 0;

        if (isRung) {
          // Connecting rungs between strand 1 and 2
          const interp = Math.random() * 2.0 - 1.0; // [-1, 1]
          positions[i3] = interp * radius * Math.cos(t);
          positions[i3 + 1] = interp * radius * Math.sin(t);
          positions[i3 + 2] = z;

          colors[i3] = 1.0;
          colors[i3 + 1] = 0.8;
          colors[i3 + 2] = 0.2;
          scales[i] = 0.7;
        } else {
          // Double strands separated by PI
          const strand = i % 2 === 0 ? 0 : Math.PI;
          const angle = t + strand;
          const jitter = (Math.random() - 0.5) * 0.5;

          positions[i3] = (radius + jitter) * Math.cos(angle);
          positions[i3 + 1] = (radius + jitter) * Math.sin(angle);
          positions[i3 + 2] = z + (Math.random() - 0.5) * 0.4;

          colors[i3] = strand === 0 ? 0.2 : 0.9;
          colors[i3 + 1] = strand === 0 ? 0.7 : 0.3;
          colors[i3 + 2] = strand === 0 ? 1.0 : 0.8;
          scales[i] = 1.0;
        }
      }
      break;
    }

    case 'metatron_cube': {
      // Sacred geometry 4D hypercube lattice
      const boxSize = scaleFactor * 0.5;
      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
        // Inner dual vertices
        [0, 0, 1.4], [0, 0, -1.4], [1.4, 0, 0], [-1.4, 0, 0], [0, 1.4, 0], [0, -1.4, 0]
      ];

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const v1Idx = Math.floor(Math.random() * vertices.length);
        const v2Idx = Math.floor(Math.random() * vertices.length);
        const v1 = vertices[v1Idx];
        const v2 = vertices[v2Idx];

        // Interpolate along lattice edge
        const t = Math.random();
        const px = (v1[0] * (1 - t) + v2[0] * t) * boxSize * 0.5;
        const py = (v1[1] * (1 - t) + v2[1] * t) * boxSize * 0.5;
        const pz = (v1[2] * (1 - t) + v2[2] * t) * boxSize * 0.5;

        // Add spherical harmony shell
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const shellR = boxSize * 0.6;
        const isShell = i % 3 === 0;

        if (isShell) {
          positions[i3] = shellR * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = shellR * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = shellR * Math.cos(phi);
        } else {
          positions[i3] = px;
          positions[i3 + 1] = py;
          positions[i3 + 2] = pz;
        }

        colors[i3] = 0.4 + 0.6 * Math.sin(v1Idx);
        colors[i3 + 1] = 0.7 + 0.3 * Math.cos(v2Idx);
        colors[i3 + 2] = 0.9;
        scales[i] = 0.7 + 0.5 * Math.sin(i * 0.1);
      }
      break;
    }

    case 'quantum_vortex':
    default: {
      // Double logarithmic spiral vortex with magnetic confinement
      const maxR = scaleFactor * 0.75;
      const height = scaleFactor * 1.1;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const normH = (i / count); // [0, 1]
        const z = (normH - 0.5) * height;

        // Funnel waist pinch in center
        const pinch = Math.abs(normH - 0.5) * 2; // 1 at ends, 0 at waist
        const r = (0.2 + 0.8 * (pinch ** 1.5)) * maxR;

        // Spiral rotation
        const spiralSpeed = 14.0;
        const theta = normH * Math.PI * 2 * spiralSpeed;

        const jitter = (Math.random() - 0.5) * 0.6;
        positions[i3] = (r + jitter) * Math.cos(theta);
        positions[i3 + 1] = (r + jitter) * Math.sin(theta);
        positions[i3 + 2] = z;

        colors[i3] = 0.1 + 0.9 * pinch;
        colors[i3 + 1] = 0.4 + 0.6 * (1 - pinch);
        colors[i3 + 2] = 0.9;
        scales[i] = 0.6 + 0.8 * (1 - pinch);
      }
      break;
    }
  }

  return { positions, colors, scales };
}
