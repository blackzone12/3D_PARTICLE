import * as THREE from 'three';

/**
 * Creates procedural high-clarity particle textures.
 * Uses pure grayscale alpha channels so vertex theme colors (cyan, magenta, emerald, amber)
 * are rendered faithfully without artificial white washing or color bleeding.
 */
export function createParticleTexture(
  style: 'glow_disc' | 'quantum_ring' | 'star_sparkle' | 'crisp_dot' = 'crisp_dot'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const cx = 64;
  const cy = 64;

  ctx.clearRect(0, 0, 128, 128);

  if (style === 'crisp_dot') {
    // Ultra-sharp discrete particle dot with subtle anti-aliased edge
    // Allows every single particle in dense clouds to be individually resolved
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.95)');
    grad.addColorStop(0.88, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();

    // Subtle dark outer rim for high contrast separation against neighboring particles
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 31, 0, Math.PI * 2);
    ctx.stroke();
  } else if (style === 'glow_disc') {
    // Compact luminous bead with tight falloff (radius 36 instead of 60)
    // Avoids massive additive blowout while preserving a sleek jewel-like luminescence
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 36);
    gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.85)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.35)');
    gradient.addColorStop(0.9, 'rgba(255, 255, 255, 0.08)');
    gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'quantum_ring') {
    // Sharp holographic quantum torus ring with distinct center pinpoint
    // Inner dot
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    // Ring band
    const gradient = ctx.createRadialGradient(cx, cy, 14, cx, cy, 32);
    gradient.addColorStop(0.0, 'rgba(255, 255, 255, 0.0)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.85)');
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 4-point diamond star pinpoint with sharp diffraction tips
    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
    radGrad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    radGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
    radGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fill();

    // Slender diffraction cross
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, 16); ctx.lineTo(cx, 112);
    ctx.moveTo(16, cy); ctx.lineTo(112, cy);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
