import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ParticleUniverse } from './engine/particleSystem';
import { KineticAudioEngine } from './audio/synthEngine';
import {
  ParticleConfig,
  AudioConfig,
  InteractionMode,
  CameraMode,
  TelemetryData,
  TopologyType,
  ColorTheme,
  ParametricParams,
} from './types';
import { HeaderBar } from './components/HeaderBar';
import { TopologyDock } from './components/TopologyDock';
import { KineticInspector } from './components/KineticInspector';
import { InteractionDock } from './components/InteractionDock';
import { TelemetryHUD } from './components/TelemetryHUD';
import { SnapshotModal } from './components/SnapshotModal';
import { ShapeSculptorStudio } from './components/ShapeSculptorStudio';

const INITIAL_PARAMETRIC: ParametricParams = {
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

const INITIAL_PARTICLE_CONFIG: ParticleConfig = {
  count: 30000,
  size: 0.75, // Scaled for clean particle separation
  morphSpeed: 1.0,
  noiseStrength: 0.15,
  gravityStrength: 1.6,
  damping: 0.94,
  timeScale: 1.0,
  colorTheme: 'nebula_cosmos',
  topology: 'lorenz',
  pointStyle: 'crisp_dot', // Discrete pinpoint dots: each particle is distinct and sharp
  bloomIntensity: 0.35, // Subdued bloom to prevent blinding overexposure
  audioReactivity: 0.5,
  customText: 'HACKATHON',
  parametric: INITIAL_PARAMETRIC,
  brightness: 0.7, // Comfortable, calibrated luminance
  blendMode: 'normal', // Normal blending prevents 30,000 particles from fusing into a blinding white blob
};

const INITIAL_AUDIO_CONFIG: AudioConfig = {
  enabled: false,
  volume: 0.18,
  droneFrequency: 65.41, // C2
  scale: 'celestial',
  micReactive: false,
  tempo: 120,
  reverbDecay: 2.5,
};

const TOPOLOGY_LIST: TopologyType[] = [
  'lorenz',
  'torus_knot',
  'calabi_yau',
  'black_hole',
  'galaxy_spiral',
  'cardioid_heart',
  'neural_connectome',
  'double_helix',
  'superformula',
  'metatron_cube',
  'quantum_vortex',
];

const THEME_LIST: ColorTheme[] = [
  'nebula_cosmos',
  'cyberpunk',
  'solar_flare',
  'bioluminescence',
  'obsidian_chrome',
  'quantum_spectrum',
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const universeRef = useRef<ParticleUniverse | null>(null);
  const audioRef = useRef<KineticAudioEngine | null>(null);

  // States
  const [particleConfig, setParticleConfig] = useState<ParticleConfig>(INITIAL_PARTICLE_CONFIG);
  const [audioConfig, setAudioConfig] = useState<AudioConfig>(INITIAL_AUDIO_CONFIG);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('attract');
  const [cameraMode, setCameraMode] = useState<CameraMode>('free');
  const [micActive, setMicActive] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isDockOpen, setIsDockOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isTouring, setIsTouring] = useState(false);
  const [isShapeStudioOpen, setIsShapeStudioOpen] = useState(false);

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    fps: 60,
    particleCount: INITIAL_PARTICLE_CONFIG.count,
    kineticEnergy: 12,
    spatialEntropy: 18,
    activeHarmonic: 'LORENZ ATTRACTOR',
    fieldSingularities: 1,
  });

  // Initialize Three.js Universe & Audio Engine
  useEffect(() => {
    if (!containerRef.current) return;

    // Create universe
    const universe = new ParticleUniverse(containerRef.current, particleConfig);
    universeRef.current = universe;

    // Create audio engine
    const audio = new KineticAudioEngine(audioConfig);
    audioRef.current = audio;

    // Connect spatial audio feedback
    universe.onAudioModulation = (normX, kinetic, entropy) => {
      audio.modulateFromKineticField(normX, kinetic, entropy);
    };

    universe.onTelemetryUpdate = (data) => {
      setTelemetry(data);
    };

    return () => {
      universe.dispose();
      audio.dispose();
    };
  }, []);

  // Update audio parameters
  const handleAudioChange = useCallback(async (cfg: Partial<AudioConfig>) => {
    setAudioConfig((prev) => {
      const updated = { ...prev, ...cfg };
      if (cfg.enabled && audioRef.current) {
        audioRef.current.init().then(() => {
          audioRef.current?.updateConfig(updated);
        });
      } else {
        audioRef.current?.updateConfig(updated);
      }
      return updated;
    });
  }, []);

  // Toggle mic reactivity
  const handleToggleMic = useCallback(async () => {
    if (!audioRef.current) return;
    const nextState = !micActive;
    const success = await audioRef.current.toggleMicrophone(nextState);
    setMicActive(success);
  }, [micActive]);

  // Handle particle parameter changes
  const handleParticleChange = useCallback((cfg: Partial<ParticleConfig>) => {
    setParticleConfig((prev) => {
      const next = { ...prev, ...cfg };
      if (universeRef.current) {
        universeRef.current.config = next;
        if (cfg.size !== undefined) {
          universeRef.current.setParticleSize(cfg.size);
        }
        if (cfg.pointStyle !== undefined) {
          universeRef.current.updatePointStyle(cfg.pointStyle);
        }
        if (cfg.blendMode !== undefined) {
          universeRef.current.setBlendingMode(cfg.blendMode);
        }
        if (cfg.brightness !== undefined) {
          universeRef.current.setBrightness(cfg.brightness);
        }
      }
      return next;
    });
  }, []);

  // Topology selection
  const handleSelectTopology = useCallback((t: TopologyType) => {
    setParticleConfig((prev) => ({ ...prev, topology: t }));
    universeRef.current?.morphToTopology(t);
    // Chime upon morphing
    audioRef.current?.triggerHarmonicChime(0.8, 1);
  }, []);

  // Color theme selection
  const handleSelectColorTheme = useCallback((th: ColorTheme) => {
    setParticleConfig((prev) => ({ ...prev, colorTheme: th }));
    universeRef.current?.updateTheme(th);
  }, []);

  // Rebuild buffer particles
  const handleRebuildParticles = useCallback(() => {
    universeRef.current?.rebuildParticles();
    audioRef.current?.triggerHarmonicChime(0.6);
  }, []);

  // Change interaction mode
  const handleChangeInteractionMode = useCallback((mode: InteractionMode) => {
    setInteractionMode(mode);
    if (universeRef.current) {
      universeRef.current.interactionMode = mode;
    }
  }, []);

  // Change camera mode
  const handleCameraChange = useCallback((mode: CameraMode) => {
    setCameraMode(mode);
    universeRef.current?.setCameraPreset(mode);
  }, []);

  // Triggers
  const handleShockwave = useCallback(() => {
    universeRef.current?.triggerSupernovaShockwave();
    audioRef.current?.triggerShockwave();
  }, []);

  const handleFluctuation = useCallback(() => {
    universeRef.current?.triggerQuantumFluctuation();
    audioRef.current?.triggerHarmonicChime(0.9, 2);
  }, []);

  // Take screenshot
  const handleScreenshot = useCallback(() => {
    if (!universeRef.current) return;
    const url = universeRef.current.takeScreenshot();
    setSnapshotUrl(url);
  }, []);

  // Infinite Topological Mutation
  const handleMutateInfinite = useCallback(() => {
    if (!universeRef.current) return;
    const params = universeRef.current.mutateInfiniteShape();
    setParticleConfig((prev) => ({
      ...prev,
      topology: 'infinite_mutation',
      parametric: params,
    }));
    audioRef.current?.triggerHarmonicChime(1.0, 3);
  }, []);

  // Freehand 3D Air Drawing
  const handleStartDrawing = useCallback(() => {
    setInteractionMode('draw_3d');
    if (universeRef.current) {
      universeRef.current.interactionMode = 'draw_3d';
    }
  }, []);

  const handleClearDrawing = useCallback(() => {
    universeRef.current?.clearDrawnPoints();
    audioRef.current?.triggerHarmonicChime(0.7, 1);
  }, []);

  // Automated Choreography Tour loop
  useEffect(() => {
    if (!isTouring) return;

    let topoIndex = 0;
    let themeIndex = 0;

    // Enable cinematic camera mode during tour
    handleCameraChange('cinematic_drift');

    const interval = setInterval(() => {
      topoIndex = (topoIndex + 1) % TOPOLOGY_LIST.length;
      themeIndex = (themeIndex + 1) % THEME_LIST.length;

      const nextTopo = TOPOLOGY_LIST[topoIndex];
      const nextTheme = THEME_LIST[themeIndex];

      handleSelectTopology(nextTopo);
      handleSelectColorTheme(nextTheme);
      universeRef.current?.triggerSupernovaShockwave();
      audioRef.current?.triggerShockwave();
    }, 7000);

    return () => {
      clearInterval(interval);
    };
  }, [isTouring, handleCameraChange, handleSelectTopology, handleSelectColorTheme]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030712] font-sans select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />

      {/* Top Header Control Surface */}
      <HeaderBar
        audioConfig={audioConfig}
        onAudioChange={handleAudioChange}
        onToggleMic={handleToggleMic}
        micActive={micActive}
        cameraMode={cameraMode}
        onCameraChange={handleCameraChange}
        onScreenshot={handleScreenshot}
        onOpenShapeStudio={() => setIsShapeStudioOpen(true)}
      />

      {/* Left Dock: Manifold & Color Palette Selector */}
      <TopologyDock
        currentTopology={particleConfig.topology}
        onSelectTopology={handleSelectTopology}
        currentColorTheme={particleConfig.colorTheme}
        onSelectColorTheme={handleSelectColorTheme}
        isOpen={isDockOpen}
        onToggleOpen={() => setIsDockOpen(!isDockOpen)}
        onOpenShapeStudio={() => setIsShapeStudioOpen(true)}
        onMutateInfinite={handleMutateInfinite}
      />

      {/* Right Panel: Parametric Particle & Harmonics Synthesizer */}
      <KineticInspector
        particleConfig={particleConfig}
        onParticleChange={handleParticleChange}
        onRebuildParticles={handleRebuildParticles}
        audioConfig={audioConfig}
        onAudioChange={handleAudioChange}
        isOpen={isInspectorOpen}
        onToggleOpen={() => setIsInspectorOpen(!isInspectorOpen)}
        onOpenShapeStudio={() => setIsShapeStudioOpen(true)}
        onMutateInfinite={handleMutateInfinite}
      />

      {/* Bottom Floating Dock: Interaction Modes & Dynamic Triggers */}
      <InteractionDock
        interactionMode={interactionMode}
        onChangeInteractionMode={handleChangeInteractionMode}
        onShockwave={handleShockwave}
        onFluctuation={handleFluctuation}
        isTouring={isTouring}
        onToggleTour={() => setIsTouring(!isTouring)}
      />

      {/* Real-time Telemetry & Performance Gauges */}
      <TelemetryHUD telemetry={telemetry} />

      {/* Infinite Shape Sculptor Studio Modal */}
      <ShapeSculptorStudio
        isOpen={isShapeStudioOpen}
        onClose={() => setIsShapeStudioOpen(false)}
        currentTopology={particleConfig.topology}
        onSelectTopology={handleSelectTopology}
        customText={particleConfig.customText}
        onChangeText={(txt) => {
          handleParticleChange({ customText: txt, topology: 'text_glyph' });
          universeRef.current?.morphToTopology('text_glyph');
          audioRef.current?.triggerHarmonicChime(0.8, 2);
        }}
        parametric={particleConfig.parametric}
        onChangeParametric={(p) => {
          const next = { ...particleConfig.parametric, ...p };
          handleParticleChange({ topology: 'parametric_custom', parametric: next });
          universeRef.current?.morphToTopology('parametric_custom');
        }}
        onMutateInfinite={handleMutateInfinite}
        onStartDrawing={handleStartDrawing}
        onClearDrawing={handleClearDrawing}
        drawnPointsCount={universeRef.current?.drawnPoints.length || 0}
      />

      {/* High-Resolution Frame Snapshot Modal */}
      <SnapshotModal
        imageUrl={snapshotUrl}
        onClose={() => setSnapshotUrl(null)}
      />
    </div>
  );
}
