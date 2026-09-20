import { TopologyData } from './topologies';

interface TextPoint {
  x: number;
  y: number;
  isEdge: boolean;
  intensity: number;
}

/**
 * Converts any user text, word, or symbol into high-definition 3D extruded particle typography.
 * Implements:
 * 1. High-resolution canvas rasterization (1600x600) with dynamic font-scaling to perfectly fit bounds.
 * 2. Tight bounding-box detection to center the text exactly at (0, 0, 0) with true isotropic aspect ratio.
 * 3. Edge-detection kernel to place high-density particles along sharp typographic glyph contours.
 * 4. Structured 3D volumetric extrusion (crisp front face, extruded depth sidewalls, rear face)
 *    rather than a blurry random mist.
 */
export function generateTextParticles(
  text: string,
  count: number,
  scaleFactor: number = 24
): TopologyData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const cleanText = (text || 'AETHERIA').trim();
  const displayText = cleanText.length > 0 ? cleanText : 'AETHERIA';

  // 1. High-resolution off-screen canvas for crisp anti-aliased typography
  const canvasWidth = 1600;
  const canvasHeight = 600;
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 2. Iterative Font Sizing to ensure perfect fit within the raster canvas
  const paddingX = canvasWidth * 0.08;
  const paddingY = canvasHeight * 0.12;
  const maxRenderW = canvasWidth - paddingX * 2;
  const maxRenderH = canvasHeight - paddingY * 2;

  let fontSize = 280;
  const fontFamily = '"JetBrains Mono", "Plus Jakarta Sans", "Arial Black", system-ui, sans-serif';

  // Measure and decrease font size until text fits comfortably
  for (let s = fontSize; s >= 36; s -= 8) {
    ctx.font = `900 ${s}px ${fontFamily}`;
    const metrics = ctx.measureText(displayText);
    const measuredW = metrics.width;
    if (measuredW <= maxRenderW && s <= maxRenderH) {
      fontSize = s;
      break;
    }
  }

  // Draw the text in high-contrast solid white
  ctx.font = `900 ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(displayText, canvasWidth / 2, canvasHeight / 2);

  // 3. Scan pixels and determine exact bounding box
  const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const data = imgData.data;

  let minX = canvasWidth;
  let maxX = 0;
  let minY = canvasHeight;
  let maxY = 0;

  // First pass: find non-empty pixel bounding box
  for (let y = 0; y < canvasHeight; y += 2) {
    for (let x = 0; x < canvasWidth; x += 2) {
      const idx = (y * canvasWidth + x) * 4;
      if (data[idx] > 40) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Safety fallback if no pixels were rendered
  if (maxX <= minX || maxY <= minY) {
    minX = canvasWidth * 0.2;
    maxX = canvasWidth * 0.8;
    minY = canvasHeight * 0.3;
    maxY = canvasHeight * 0.7;
  }

  const textWidthPx = Math.max(1, maxX - minX);
  const textHeightPx = Math.max(1, maxY - minY);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // Determine uniform isotropic scaling in 3D world space
  // Target 3D text width: ~38 units (perfectly framed in 45-degree FOV at distance 36)
  const target3DWidth = 36.0;
  const target3DHeightMax = 18.0;

  let unitScale = target3DWidth / textWidthPx;
  if (textHeightPx * unitScale > target3DHeightMax) {
    unitScale = target3DHeightMax / textHeightPx;
  }

  // 4. Sample active pixels and classify into:
  //    - Inner Solid Fills
  //    - Sharp Outer & Inner Contours (Edges)
  const solidPoints: TextPoint[] = [];
  const edgePoints: TextPoint[] = [];

  // Sampling step: dynamically adjust for resolution
  const sampleStep = Math.max(2, Math.floor(Math.sqrt((textWidthPx * textHeightPx) / 6000)));

  for (let y = minY; y <= maxY; y += sampleStep) {
    for (let x = minX; x <= maxX; x += sampleStep) {
      const idx = (y * canvasWidth + x) * 4;
      const val = data[idx];

      if (val > 50) {
        // Check 4-neighbor connectivity for contour/edge detection
        let isEdge = false;
        if (x - sampleStep < minX || x + sampleStep > maxX || y - sampleStep < minY || y + sampleStep > maxY) {
          isEdge = true;
        } else {
          const left = data[(y * canvasWidth + (x - sampleStep)) * 4];
          const right = data[(y * canvasWidth + (x + sampleStep)) * 4];
          const top = data[((y - sampleStep) * canvasWidth + x) * 4];
          const bottom = data[((y + sampleStep) * canvasWidth + x) * 4];

          if (left < 50 || right < 50 || top < 50 || bottom < 50) {
            isEdge = true;
          }
        }

        // World coordinates centered at (0, 0)
        const posX = (x - centerX) * unitScale;
        const posY = -(y - centerY) * unitScale; // Invert Y for 3D world space
        const intensity = val / 255.0;

        const pt: TextPoint = { x: posX, y: posY, isEdge, intensity };

        if (isEdge) {
          edgePoints.push(pt);
        } else {
          solidPoints.push(pt);
        }
      }
    }
  }

  // Combine pools with fallback
  if (edgePoints.length === 0 && solidPoints.length === 0) {
    solidPoints.push({ x: 0, y: 0, isEdge: false, intensity: 1.0 });
  }

  const allPoints = edgePoints.length > 0 ? [...edgePoints, ...solidPoints] : solidPoints;
  const totalSampled = allPoints.length;
  const totalEdges = edgePoints.length > 0 ? edgePoints.length : totalSampled;

  // 5. 3D Volumetric Extrusion Configuration
  // Extrusion depth along Z (scaled proportionally to font size)
  const extrusionDepth = Math.max(1.8, Math.min(3.6, textHeightPx * unitScale * 0.3));
  const halfDepth = extrusionDepth * 0.5;

  // Partition particle count:
  // 45% Front face: crisp text surface facing camera
  // 25% Back face: rear closure
  // 30% Extruded sidewalls & bevel contours along the glyph edges
  const countFront = Math.floor(count * 0.45);
  const countBack = Math.floor(count * 0.25);
  const countSides = count - countFront - countBack;

  let pIdx = 0;

  // A. Front Face Generation (Z = +halfDepth)
  for (let i = 0; i < countFront; i++) {
    const i3 = pIdx * 3;
    const pt = allPoints[i % totalSampled];

    // High fidelity front face with micro-subpixel anti-aliasing
    const subJitterX = (Math.random() - 0.5) * (sampleStep * unitScale * 0.6);
    const subJitterY = (Math.random() - 0.5) * (sampleStep * unitScale * 0.6);
    const bevelZ = pt.isEdge ? -0.15 * Math.random() : 0.0;

    positions[i3] = pt.x + subJitterX;
    positions[i3 + 1] = pt.y + subJitterY;
    positions[i3 + 2] = halfDepth + bevelZ;

    // Front face highlight color (brighter, vivid)
    const normX = (pt.x / target3DWidth) + 0.5;
    colors[i3] = 0.5 + 0.5 * Math.sin(normX * Math.PI * 2);
    colors[i3 + 1] = 0.8 + 0.2 * pt.intensity;
    colors[i3 + 2] = 1.0;

    scales[pIdx] = pt.isEdge ? 1.15 : 0.95;
    pIdx++;
  }

  // B. Back Face Generation (Z = -halfDepth)
  for (let i = 0; i < countBack; i++) {
    const i3 = pIdx * 3;
    const pt = allPoints[i % totalSampled];

    const subJitterX = (Math.random() - 0.5) * (sampleStep * unitScale * 0.8);
    const subJitterY = (Math.random() - 0.5) * (sampleStep * unitScale * 0.8);

    positions[i3] = pt.x + subJitterX;
    positions[i3 + 1] = pt.y + subJitterY;
    positions[i3 + 2] = -halfDepth;

    // Back face slightly darker for 3D depth perception
    const normX = (pt.x / target3DWidth) + 0.5;
    colors[i3] = 0.3 + 0.4 * Math.sin(normX * Math.PI * 2);
    colors[i3 + 1] = 0.4 + 0.3 * pt.intensity;
    colors[i3 + 2] = 0.75;

    scales[pIdx] = 0.8;
    pIdx++;
  }

  // C. Extruded Sidewalls & Bevels (Connecting front and back along the glyph perimeter)
  const edgePool = edgePoints.length > 0 ? edgePoints : allPoints;
  for (let i = 0; i < countSides; i++) {
    const i3 = pIdx * 3;
    const pt = edgePool[i % totalEdges];

    // Uniformly distribute across the depth Z from -halfDepth to +halfDepth
    const zFrac = Math.random();
    const posZ = -halfDepth + zFrac * extrusionDepth;

    const subJitterX = (Math.random() - 0.5) * (sampleStep * unitScale * 0.4);
    const subJitterY = (Math.random() - 0.5) * (sampleStep * unitScale * 0.4);

    positions[i3] = pt.x + subJitterX;
    positions[i3 + 1] = pt.y + subJitterY;
    positions[i3 + 2] = posZ;

    // Gradient along Z extrusion: adds distinct rim lighting to the letters
    const normX = (pt.x / target3DWidth) + 0.5;
    colors[i3] = 0.4 + 0.5 * Math.sin(normX * Math.PI * 2);
    colors[i3 + 1] = 0.6 + 0.3 * (1.0 - zFrac);
    colors[i3 + 2] = 0.9;

    scales[pIdx] = 1.0;
    pIdx++;
  }

  return { positions, colors, scales };
}
