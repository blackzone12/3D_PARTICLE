import { TopologyData } from './topologies';

/**
 * Converts any user text/string or symbol into high-density 3D extruded particle coordinates
 */
export function generateTextParticles(
  text: string,
  count: number,
  scaleFactor: number = 24
): TopologyData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const cleanText = (text || 'AETHERIA').trim().toUpperCase();

  // 1. Off-screen canvas
  const canvas = document.createElement('canvas');
  const width = 512;
  const height = 256;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Dynamic font sizing
  const maxLen = Math.max(1, cleanText.length);
  const fontSize = Math.min(100, Math.floor((width * 0.85) / (maxLen * 0.58)));
  ctx.font = `900 ${fontSize}px "JetBrains Mono", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(cleanText, width / 2, height / 2);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Collect filled pixels
  const activePixels: { x: number; y: number; brightness: number }[] = [];
  const step = 2; // sample resolution
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const b = data[idx];
      if (b > 60) {
        activePixels.push({
          x: (x - width / 2) / (width / 2),
          y: -(y - height / 2) / (height / 2),
          brightness: b / 255.0,
        });
      }
    }
  }

  // Fallback if no pixels found
  if (activePixels.length === 0) {
    activePixels.push({ x: 0, y: 0, brightness: 1 });
  }

  const pxCount = activePixels.length;
  const depthZ = scaleFactor * 0.16;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const pixel = activePixels[i % pxCount];

    // Add 3D extrusion along Z with volumetric bevel
    const normI = i / count;
    const zOffset = (Math.random() - 0.5) * depthZ;
    const jitter = (Math.random() - 0.5) * 0.35;

    positions[i3] = (pixel.x + jitter * 0.05) * (scaleFactor * 1.05);
    positions[i3 + 1] = (pixel.y + jitter * 0.05) * (scaleFactor * 0.55);
    positions[i3 + 2] = zOffset + Math.sin(pixel.x * 4) * (scaleFactor * 0.08);

    // Color gradient based on X & Z depth
    colors[i3] = 0.3 + 0.7 * (pixel.x * 0.5 + 0.5);
    colors[i3 + 1] = 0.5 + 0.5 * Math.sin(normI * Math.PI * 4);
    colors[i3 + 2] = 0.9 - 0.4 * (zOffset / depthZ);

    scales[i] = 0.8 + 0.5 * pixel.brightness;
  }

  return { positions, colors, scales };
}
