import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Lazy initialization of Gemini client to prevent crashes if API key is missing
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Procedural cosmological fallback generator for offline or keyless environments
function generateProceduralFallback(prompt: string) {
  const p = prompt.toLowerCase();

  let topology = 'superformula';
  let colorTheme = 'nebula_cosmos';
  let scale = 'celestial';
  let interactionMode = 'vortex';
  let pointStyle = 'quantum_ring';
  let m = 6;
  let twist = 0.8;
  let noiseStrength = 0.25;
  let damping = 0.94;
  let droneFreq = 65.4; // C2

  if (p.includes('black hole') || p.includes('singularity') || p.includes('gravity') || p.includes('dark')) {
    topology = 'black_hole';
    colorTheme = 'obsidian_chrome';
    scale = 'dorian';
    interactionMode = 'attract';
    pointStyle = 'crisp_dot';
    m = 4;
    twist = 1.4;
    noiseStrength = 0.15;
    damping = 0.92;
    droneFreq = 43.65; // F1
  } else if (p.includes('cyber') || p.includes('neon') || p.includes('pulse') || p.includes('matrix')) {
    topology = 'neural_connectome';
    colorTheme = 'cyberpunk';
    scale = 'akebono';
    interactionMode = 'repel';
    pointStyle = 'star_sparkle';
    m = 8;
    twist = 0.5;
    noiseStrength = 0.35;
    droneFreq = 73.42; // D2
  } else if (p.includes('solar') || p.includes('sun') || p.includes('fire') || p.includes('warm') || p.includes('star')) {
    topology = 'quantum_vortex';
    colorTheme = 'solar_flare';
    scale = 'lydian';
    interactionMode = 'vortex';
    pointStyle = 'glow_disc';
    m = 5;
    twist = 1.2;
    noiseStrength = 0.4;
    droneFreq = 82.41; // E2
  } else if (p.includes('bio') || p.includes('jellyfish') || p.includes('ocean') || p.includes('nature')) {
    topology = 'gyroid';
    colorTheme = 'bioluminescence';
    scale = 'cosmic_pentatonic';
    interactionMode = 'wave';
    pointStyle = 'quantum_ring';
    m = 7;
    twist = 0.9;
    noiseStrength = 0.3;
    droneFreq = 55.0; // A1
  } else if (p.includes('dna') || p.includes('helix') || p.includes('gene')) {
    topology = 'double_helix';
    colorTheme = 'quantum_spectrum';
    scale = 'celestial';
    interactionMode = 'vortex';
    m = 4;
  } else if (p.includes('string') || p.includes('quantum') || p.includes('manifold') || p.includes('calabi')) {
    topology = 'calabi_yau';
    colorTheme = 'nebula_cosmos';
    scale = 'celestial';
    interactionMode = 'wave';
    m = 6;
    twist = 1.6;
  }

  const cleanPromptTitle = prompt.trim().slice(0, 32);
  const capitalizedTitle = cleanPromptTitle
    ? cleanPromptTitle.charAt(0).toUpperCase() + cleanPromptTitle.slice(1)
    : 'Harmonic Cosmos';

  return {
    name: `${capitalizedTitle} Convergence`,
    lore: `Synthesized from quantum vacuum fluctuations. Harmonizing spatial entropy with ${scale} resonances and a high-order ${topology} manifold.`,
    particleConfig: {
      topology,
      colorTheme,
      pointStyle,
      count: 45000,
      size: 2.2,
      morphSpeed: 0.05,
      noiseStrength,
      damping,
      timeScale: 1.0,
      brightness: 1.15,
      blendMode: 'normal',
      parametric: {
        m,
        n1: 1.2,
        n2: 2.0,
        n3: 2.0,
        twist,
        pinch: 0.25,
        aspectRatio: 1.0,
        noiseDisplace: 0.15,
        freqX: 1,
        freqY: 1,
        freqZ: 1,
      },
    },
    audioConfig: {
      enabled: true,
      scale,
      droneFrequency: droneFreq,
      volume: 0.18,
      tempo: 90,
      reverbDecay: 3.5,
    },
    interactionMode,
    cameraMode: 'cinematic_drift',
    singularities: [
      {
        id: `singularity-core-${Date.now()}`,
        position: { x: 0, y: 0, z: 0 },
        strength: interactionMode === 'repel' ? -25 : 35,
        radius: 4.5,
        createdAt: Date.now(),
        color: '#06b6d4',
      },
    ],
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'aetheria-fullstack',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  });

  // Gemini AI Cosmic Universe Synthesizer API
  app.post('/api/gemini/synthesize-universe', async (req, res) => {
    const { prompt = '' } = req.body;
    const userPrompt = String(prompt).trim();

    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAI();

    // If no Gemini API key configured, use procedural fallback seamlessly
    if (!ai) {
      const fallback = generateProceduralFallback(userPrompt);
      return res.json({
        ...fallback,
        source: 'procedural_fallback',
        notice: 'Gemini API key not detected; generated via high-entropy cosmological procedural engine.',
      });
    }

    try {
      const systemInstruction = `You are the Aetheria Celestial Intelligence, an advanced mathematical astrophysicist and spatial sound architect.
Your mission is to translate user creative concepts or natural language queries into a complete, mathematically coherent 3D particle universe and spatial audio configuration.

Return a STRICT valid JSON object with:
- "name": An evocative, celestial title (e.g. "Hyperion Event Horizon", "Bioluminescent Abyssal Singularity").
- "lore": A 2-sentence poetic astrophysical genesis story describing the topology, resonance, and geometry.
- "particleConfig":
    - "topology": one of ["lorenz", "torus_knot", "calabi_yau", "black_hole", "neural_connectome", "double_helix", "metatron_cube", "quantum_vortex", "superformula", "mobius_strip", "klein_bottle", "gyroid", "clifford_torus", "galaxy_spiral"]
    - "colorTheme": one of ["nebula_cosmos", "cyberpunk", "solar_flare", "bioluminescence", "obsidian_chrome", "quantum_spectrum"]
    - "pointStyle": one of ["glow_disc", "quantum_ring", "star_sparkle", "crisp_dot"]
    - "count": number between 30000 and 60000
    - "size": number between 1.5 and 3.5
    - "morphSpeed": number between 0.03 and 0.08
    - "noiseStrength": number between 0.1 and 0.6
    - "damping": number between 0.90 and 0.98
    - "brightness": number between 0.9 and 1.4
    - "blendMode": one of ["normal", "additive"]
    - "parametric":
        - "m": integer between 1 and 16 (symmetry lobes)
        - "n1": number between 0.5 and 4.0
        - "n2": number between 0.5 and 4.0
        - "n3": number between 0.5 and 4.0
        - "twist": number between 0.0 and 3.0
        - "pinch": number between 0.0 and 1.0
- "audioConfig":
    - "scale": one of ["celestial", "dorian", "lydian", "akebono", "cosmic_pentatonic"]
    - "droneFrequency": number between 40.0 and 110.0 (Hz)
    - "volume": number between 0.15 and 0.25
    - "tempo": integer between 70 and 120
    - "reverbDecay": number between 2.0 and 5.0
- "interactionMode": one of ["attract", "repel", "vortex", "wave"]
- "cameraMode": one of ["free", "cinematic_drift", "core_dive", "top_down"]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Synthesize a unique 3D particle cosmos for the prompt: "${userPrompt}"`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsed = JSON.parse(responseText);

      return res.json({
        ...parsed,
        source: 'gemini-3.8-flash',
      });
    } catch (err) {
      console.error('Gemini synthesis error:', err);
      // Seamless graceful fallback
      const fallback = generateProceduralFallback(userPrompt);
      return res.json({
        ...fallback,
        source: 'procedural_fallback_on_error',
        errorDetails: (err as Error).message,
      });
    }
  });

  // Community & Curated Presets API
  app.get('/api/presets', (req, res) => {
    res.json({
      status: 'ok',
      count: 0,
      presets: [],
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌌 Aetheria Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
