import { ParametricParams } from '../types';
import { TopologyData } from './topologies';

/**
 * Superformula radius calculator
 * r(phi) = ( |cos(m*phi/4)/a|^n2 + |sin(m*phi/4)/b|^n3 ) ^ (-1/n1)
 */
function superformulaRadius(
  phi: number,
  m: number,
  n1: number,
  n2: number,
  n3: number,
  a: number = 1,
  b: number = 1
): number {
  const t1 = Math.abs(Math.cos((m * phi) / 4) / a);
  const t2 = Math.abs(Math.sin((m * phi) / 4) / b);
  const sum = Math.pow(t1, n2) + Math.pow(t2, n3);
  if (sum === 0) return 0;
  return Math.pow(sum, -1 / n1);
}

/**
 * Generates particles based on 3D Superformula (spherical product of two superformulas)
 */
export function generateSuperformula(
  params: ParametricParams,
  count: number,
  scaleFactor: number = 24
): TopologyData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const radBase = scaleFactor * 0.55;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const u = ((i % 500) / 500) * Math.PI * 2 - Math.PI; // longitude [-PI, PI]
    const v = (Math.floor(i / 500) / (count / 500)) * Math.PI - Math.PI / 2; // latitude [-PI/2, PI/2]

    const r1 = superformulaRadius(u, params.m, params.n1, params.n2, params.n3);
    const r2 = superformulaRadius(v, params.m, params.n1, params.n2, params.n3);

    // Helical twist & pinch
    const twistAngle = (v / Math.PI) * params.twist;
    const pinchFactor = 1.0 - Math.abs(v / (Math.PI / 2)) * params.pinch * 0.7;

    const x = radBase * r1 * Math.cos(u + twistAngle) * r2 * Math.cos(v) * pinchFactor;
    const y = radBase * r1 * Math.sin(u + twistAngle) * r2 * Math.cos(v) * pinchFactor;
    const z = radBase * r2 * Math.sin(v) * params.aspectRatio;

    // Harmonic wave modulation
    const wave = Math.sin(x * params.freqX * 0.1) * Math.cos(y * params.freqY * 0.1) * params.noiseDisplace;

    positions[i3] = x + (Math.random() - 0.5) * 0.4;
    positions[i3 + 1] = y + (Math.random() - 0.5) * 0.4;
    positions[i3 + 2] = z + wave + (Math.random() - 0.5) * 0.4;

    const normR = Math.sqrt(x * x + y * y + z * z) / (radBase * 1.5);
    colors[i3] = 0.4 + 0.6 * Math.sin(u * 2);
    colors[i3 + 1] = 0.5 + 0.5 * Math.cos(v * 2);
    colors[i3 + 2] = 0.9 - 0.5 * normR;

    scales[i] = 0.7 + 0.6 * Math.sin(u * params.m);
  }

  return { positions, colors, scales };
}

/**
 * Generates 3D Mobius Strip
 */
export function generateMobiusStrip(count: number, scaleFactor: number = 24): TopologyData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const R = scaleFactor * 0.55;
  const w = scaleFactor * 0.22;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const u = (i / count) * Math.PI * 2 * 3; // multiple loops for density
    const v = (Math.random() * 2 - 1) * w;

    const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
    const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
    const z = v * Math.sin(u / 2);

    positions[i3] = x + (Math.random() - 0.5) * 0.3;
    positions[i3 + 1] = y + (Math.random() - 0.5) * 0.3;
    positions[i3 + 2] = z + (Math.random() - 0.5) * 0.3;

    colors[i3] = 0.5 + 0.5 * Math.cos(u);
    colors[i3 + 1] = 0.6 + 0.4 * Math.sin(u / 2);
    colors[i3 + 2] = 0.9;
    scales[i] = 0.8 + 0.4 * (v / w);
  }

  return { positions, colors, scales };
}

/**
 * Generates 4D Klein Bottle immersion in 3D
 */
export function generateKleinBottle(count: number, scaleFactor: number = 24): TopologyData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const sf = scaleFactor * 0.12;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const u = Math.random() * Math.PI;
    const v = Math.random() * Math.PI * 2;

    const cosU = Math.cos(u);
    const sinU = Math.sin(u);
    const cosV = Math.cos(v);
    const sinV = Math.sin(v);

    let x = 0, y = 0, z = 0;

    if (u < Math.PI) {
      x = 6 * cosU * (1 + sinU) + 4 * (1 - cosU / 2) * cosU * cosV;
      y = 16 * sinU + 4 * (1 - cosU / 2) * sinU * cosV;
    } else {
      x = 6 * cosU * (1 + sinU) - 4 * (1 - cosU / 2) * cosV;
      y = 16 * sinU;
    }
    z = 4 * (1 - cosU / 2) * sinV;

    positions[i3] = x * sf;
    positions[i3 + 1] = (y - 8) * sf;
    positions[i3 + 2] = z * sf;

    colors[i3] = 0.3 + 0.7 * (u / Math.PI);
    colors[i3 + 1] = 0.5 + 0.5 * Math.sin(v);
    colors[i3 + 2] = 0.8;
    scales[i] = 0.9;
  }

  return { positions, colors, scales };
}

/**
 * Generates Gyroid minimal surface point cloud
 */
export function generateGyroid(count: number, scaleFactor: number = 24): TopologyData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const L = scaleFactor * 0.7;
  let filled = 0;
  let attempts = 0;

  while (filled < count && attempts < count * 20) {
    attempts++;
    const rx = (Math.random() * 2 - 1) * Math.PI * 2;
    const ry = (Math.random() * 2 - 1) * Math.PI * 2;
    const rz = (Math.random() * 2 - 1) * Math.PI * 2;

    // Gyroid surface: sin(x)cos(y) + sin(y)cos(z) + sin(z)cos(x) = 0
    const val = Math.sin(rx) * Math.cos(ry) + Math.sin(ry) * Math.cos(rz) + Math.sin(rz) * Math.cos(rx);

    if (Math.abs(val) < 0.18) {
      const i3 = filled * 3;
      positions[i3] = (rx / (Math.PI * 2)) * L;
      positions[i3 + 1] = (ry / (Math.PI * 2)) * L;
      positions[i3 + 2] = (rz / (Math.PI * 2)) * L;

      colors[i3] = 0.5 + 0.5 * Math.sin(rx);
      colors[i3 + 1] = 0.5 + 0.5 * Math.cos(ry);
      colors[i3 + 2] = 0.5 + 0.5 * Math.sin(rz);

      scales[filled] = 0.8;
      filled++;
    }
  }

  // If unfilled, duplicate
  for (let i = filled; i < count; i++) {
    const src = (i % Math.max(1, filled)) * 3;
    const i3 = i * 3;
    positions[i3] = positions[src] + (Math.random() - 0.5) * 0.2;
    positions[i3 + 1] = positions[src + 1] + (Math.random() - 0.5) * 0.2;
    positions[i3 + 2] = positions[src + 2] + (Math.random() - 0.5) * 0.2;
    colors[i3] = colors[src];
    colors[i3 + 1] = colors[src + 1];
    colors[i3 + 2] = colors[src + 2];
    scales[i] = 0.8;
  }

  return { positions, colors, scales };
}

/**
 * Generates 4D Clifford Torus projected stereographically into 3D
 */
export function generateCliffordTorus(count: number, scaleFactor: number = 24): TopologyData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const rad = scaleFactor * 0.55;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;

    // 4D unit coordinates on S3
    const x1 = Math.cos(theta) / Math.SQRT2;
    const y1 = Math.sin(theta) / Math.SQRT2;
    const x2 = Math.cos(phi) / Math.SQRT2;
    const y2 = Math.sin(phi) / Math.SQRT2;

    // Stereographic projection from 4D to 3D
    const denom = Math.max(0.2, 1 - y2);
    positions[i3] = (x1 / denom) * rad;
    positions[i3 + 1] = (y1 / denom) * rad;
    positions[i3 + 2] = (x2 / denom) * rad;

    colors[i3] = 0.3 + 0.7 * (x1 * 0.5 + 0.5);
    colors[i3 + 1] = 0.4 + 0.6 * (y1 * 0.5 + 0.5);
    colors[i3 + 2] = 0.9;
    scales[i] = 0.8;
  }

  return { positions, colors, scales };
}

/**
 * Generates 3D Cardioid Heart Manifold
 */
export function generateCardioidHeart(count: number, scaleFactor: number = 24): TopologyData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const sf = scaleFactor * 0.045;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const t = Math.random() * Math.PI * 2;
    const u = Math.random() * Math.PI;

    // 3D Parametric Heart equation
    const x = 16 * Math.pow(Math.sin(t), 3) * Math.sin(u);
    const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * Math.sin(u);
    const z = 10 * Math.cos(u);

    // Internal volumetric shell
    const vol = Math.pow(Math.random(), 0.35);

    positions[i3] = x * sf * vol;
    positions[i3 + 1] = y * sf * vol;
    positions[i3 + 2] = z * sf * vol;

    colors[i3] = 1.0;
    colors[i3 + 1] = 0.2 + 0.4 * (y / 16);
    colors[i3 + 2] = 0.4 + 0.6 * Math.sin(t);
    scales[i] = 0.7 + 0.5 * vol;
  }

  return { positions, colors, scales };
}

/**
 * Generates Barred Double-Spiral Galaxy with galactic core
 */
export function generateGalaxySpiral(count: number, scaleFactor: number = 24): TopologyData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const arms = 3;
  const maxR = scaleFactor * 0.85;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // 30% core bulge, 70% spiral arms
    const isCore = i < count * 0.28;

    if (isCore) {
      const r = Math.pow(Math.random(), 2.0) * (maxR * 0.22);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi) * 0.6;

      colors[i3] = 1.0;
      colors[i3 + 1] = 0.85;
      colors[i3 + 2] = 0.5;
      scales[i] = 1.2;
    } else {
      const armIndex = i % arms;
      const rNorm = Math.pow(Math.random(), 0.5);
      const r = (maxR * 0.2) + rNorm * (maxR * 0.8);
      const armAngle = (armIndex * (Math.PI * 2 / arms));
      const spiralAngle = Math.log(r / (maxR * 0.2)) * 3.2;

      const spread = (Math.random() - 0.5) * (0.15 * r);
      const zDisp = (Math.random() - 0.5) * (maxR * 0.08 * (1 - r / maxR));

      const angle = armAngle + spiralAngle + spread;

      positions[i3] = r * Math.cos(angle);
      positions[i3 + 1] = r * Math.sin(angle);
      positions[i3 + 2] = zDisp;

      const normDist = r / maxR;
      colors[i3] = 0.2 + 0.7 * (1 - normDist);
      colors[i3 + 1] = 0.5 + 0.5 * normDist;
      colors[i3 + 2] = 0.9;
      scales[i] = 0.7 + 0.6 * (1 - normDist);
    }
  }

  return { positions, colors, scales };
}

/**
 * Generates Lissajous 3D Knot
 */
export function generateLissajousKnot(
  fx: number,
  fy: number,
  fz: number,
  count: number,
  scaleFactor: number = 24
): TopologyData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const rad = scaleFactor * 0.55;
  const tube = scaleFactor * 0.08;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const t = (i / count) * Math.PI * 2 * 6;
    const subAngle = Math.random() * Math.PI * 2;
    const subR = Math.sqrt(Math.random()) * tube;

    const cx = rad * Math.sin(fx * t);
    const cy = rad * Math.sin(fy * t);
    const cz = rad * Math.cos(fz * t);

    positions[i3] = cx + subR * Math.cos(subAngle);
    positions[i3 + 1] = cy + subR * Math.sin(subAngle);
    positions[i3 + 2] = cz + subR * Math.sin(subAngle * 2);

    colors[i3] = 0.5 + 0.5 * Math.sin(fx * t);
    colors[i3 + 1] = 0.5 + 0.5 * Math.cos(fy * t);
    colors[i3 + 2] = 0.8 + 0.2 * Math.sin(fz * t);
    scales[i] = 0.8;
  }

  return { positions, colors, scales };
}

/**
 * Generates random genetic infinite mutation
 */
export function generateInfiniteMutation(count: number, scaleFactor: number = 24): {
  data: TopologyData;
  params: ParametricParams;
} {
  const m = Math.floor(Math.random() * 12) + 2;
  const n1 = Math.random() * 2.5 + 0.2;
  const n2 = Math.random() * 2.5 + 0.2;
  const n3 = Math.random() * 2.5 + 0.2;
  const twist = (Math.random() - 0.5) * 8.0;
  const pinch = Math.random() * 1.4;
  const aspectRatio = 0.5 + Math.random() * 1.5;
  const noiseDisplace = Math.random() * 3.5;
  const freqX = Math.floor(Math.random() * 6) + 1;
  const freqY = Math.floor(Math.random() * 6) + 1;
  const freqZ = Math.floor(Math.random() * 6) + 1;

  const params: ParametricParams = {
    m, n1, n2, n3, twist, pinch, aspectRatio, noiseDisplace, freqX, freqY, freqZ
  };

  const data = generateSuperformula(params, count, scaleFactor);
  return { data, params };
}
