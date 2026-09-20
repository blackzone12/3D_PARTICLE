import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ParticleUniverse } from './engine/particleSystem';
import { KineticAudioEngine } from './audio/synthEngine';
import { UniverseVideoRecorder } from './engine/videoRecorder';
import { MASTER_PRESETS, loadUserPresets, saveUserPresets } from './engine/presets';
import {
  ParticleConfig,
  AudioConfig,
  InteractionMode,
  CameraMode,
  TelemetryData,
  TopologyType,
  ColorTheme,
  ParametricParams,
  GravitationalSingularity,
  AccessibilityConfig,
  RecordingState,
  Preset,
} from './types';
import { HeaderBar } from './components/HeaderBar';
import { TopologyDock } from './components/TopologyDock';
import { KineticInspector } from './components/KineticInspector';
import { InteractionDock } from './components/InteractionDock';
import { SnapshotModal } from './components/SnapshotModal';
import { ShapeSculptorStudio } from './components/ShapeSculptorStudio';
import { UserGuideModal } from './components/UserGuideModal';
import { SingularityManager } from './components/SingularityManager';
import { SynesthesiaKeyboard } from './components/SynesthesiaKeyboard';
import { RecordingStudioModal } from './components/RecordingStudioModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { PresetDrawer } from './components/PresetDrawer';

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
  droneGain: 0.5,
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
  const videoRecorderRef = useRef<UniverseVideoRecorder | null>(null);

  // States
  const [particleConfig, setParticleConfig] = useState<ParticleConfig>(INITIAL_PARTICLE_CONFIG);
  const [audioConfig, setAudioConfig] = useState<AudioConfig>(INITIAL_AUDIO_CONFIG);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('attract');
  const [cameraMode, setCameraMode] = useState<CameraMode>('free');
  const [micActive, setMicActive] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isDockOpen, setIsDockOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const [isInspectorOpen, setIsInspectorOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1280);
  const [isTouring, setIsTouring] = useState(false);
  const [isShapeStudioOpen, setIsShapeStudioOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Advanced Feature States
  const [userPresets, setUserPresets] = useState<Preset[]>(() => loadUserPresets());
  const [activePresetId, setActivePresetId] = useState<string>('lorenz-harmony');
  const [isPresetDrawerOpen, setIsPresetDrawerOpen] = useState(false);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [isSingularitiesOpen, setIsSingularitiesOpen] = useState(false);
  const [isSynesthesiaOpen, setIsSynesthesiaOpen] = useState(false);
  const [hasLowFpsWarning, setHasLowFpsWarning] = useState(false);
  const [singularities, setSingularities] = useState<GravitationalSingularity[]>([]);
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    mimeType: '',
  });
  const [accessibilityConfig, setAccessibilityConfig] = useState<AccessibilityConfig>({
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    colorBlindMode: 'none',
    soundDescriptions: true,
    screenReaderMode: false,
  });

  // Responsive dock toggles preventing mutual screen occlusion
  const handleToggleDock = () => {
    setIsDockOpen((prev) => {
      const next = !prev;
      if (next && typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsInspectorOpen(false);
      }
      return next;
    });
  };

  const handleToggleInspector = () => {
    setIsInspectorOpen((prev) => {
      const next = !prev;
      if (next && typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsDockOpen(false);
      }
      return next;
    });
  };

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    fps: 60,
    particleCount: INITIAL_PARTICLE_CONFIG.count,
    kineticEnergy: 12,
    spatialEntropy: 18,
    activeHarmonic: 'LORENZ ATTRACTOR',
    fieldSingularities: 1,
  });

  // Initialize Three.js Universe & Audio Engine & Video Recorder
  useEffect(() => {
    if (!containerRef.current) return;

    // Create universe
    const universe = new ParticleUniverse(containerRef.current, particleConfig);
    universeRef.current = universe;

    // Create audio engine
    const audio = new KineticAudioEngine(audioConfig);
    audioRef.current = audio;

    // Create video recorder and wire audio destination
    const canvasEl = universe.getCanvasElement();
    const audioStreamDest = audio.getMediaStreamDestination();
    const recorder = new UniverseVideoRecorder(canvasEl, audioStreamDest, (st) => setRecordingState(st));
    videoRecorderRef.current = recorder;

    // Wire singularity state sync
    universe.onSingularitiesChanged = (sings: GravitationalSingularity[]) => {
      setSingularities([...sings]);
    };

    // Wire low FPS watchdog
    universe.onLowFpsDetected = () => {
      setHasLowFpsWarning(true);
    };

    // Connect bidirectional spatial audio feedback and live microphone reactivity
    universe.onAudioModulation = (normX, kinetic, entropy) => {
      if (audioRef.current) {
        audioRef.current.modulateFromKineticField(normX, kinetic, entropy);
        const isMic = audioRef.current.isMicActive();
        const react = audioRef.current.getAudioReactivity();
        universe.setAudioReactivity(react, isMic);
      }
    };

    universe.onTelemetryUpdate = (data) => {
      setTelemetry(data);
    };

    return () => {
      recorder.dispose();
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
        if (cfg.customText !== undefined) {
          if (next.topology === 'text_glyph') {
            universeRef.current.updateCustomText(cfg.customText);
          }
        }
        if (cfg.topology !== undefined && cfg.customText === undefined) {
          universeRef.current.morphToTopology(cfg.topology);
        }
      }
      return next;
    });
  }, []);

  // Frame text camera
  const handleFrameText = useCallback(() => {
    universeRef.current?.frameTextCamera();
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

  // Synesthesia Musical Note Trigger (Audio + Visual shockwave wave)
  const handlePlaySynesthesiaNote = useCallback((noteIndex: number) => {
    if (!audioRef.current) return;
    const ratio = audioRef.current.triggerSynesthesiaNote(noteIndex);
    if (universeRef.current) {
      universeRef.current.triggerHarmonicWave(ratio, noteIndex);
    }
  }, []);

  // Singularity Gravitational Management
  const handleAddSingularity = useCallback((s: GravitationalSingularity) => {
    universeRef.current?.addSingularity(s);
    audioRef.current?.triggerHarmonicChime(0.85, 2);
  }, []);

  const handleRemoveSingularity = useCallback((id: string) => {
    universeRef.current?.removeSingularity(id);
    audioRef.current?.triggerHarmonicChime(0.6, 1);
  }, []);

  const handleToggleSingularityPolarity = useCallback((id: string) => {
    universeRef.current?.toggleSingularityPolarity(id);
    audioRef.current?.triggerHarmonicChime(0.7, 3);
  }, []);

  const handleClearSingularities = useCallback(() => {
    universeRef.current?.clearSingularities();
  }, []);

  // Video Recording & 4K Frame Capture
  const handleStartRecording = useCallback((_fps = 60) => {
    videoRecorderRef.current?.start();
  }, []);

  const handleStopRecording = useCallback(() => {
    videoRecorderRef.current?.stop();
  }, []);

  const handlePauseRecording = useCallback(() => {
    videoRecorderRef.current?.pause();
  }, []);

  const handleResumeRecording = useCallback(() => {
    videoRecorderRef.current?.resume();
  }, []);

  const handleCapture4KSnapshot = useCallback((_width = 3840, _height = 2160) => {
    if (!universeRef.current) return null;
    return universeRef.current.take4KSnapshot(2);
  }, []);

  // Accessibility configuration
  const handleUpdateAccessibility = useCallback((cfg: AccessibilityConfig) => {
    setAccessibilityConfig(cfg);
    universeRef.current?.setAccessibility(cfg);
  }, []);

  // Preset management
  const handleApplyPreset = useCallback((preset: Preset) => {
    setActivePresetId(preset.id);
    handleParticleChange(preset.particleConfig);
    handleAudioChange(preset.audioConfig);
    if (universeRef.current) {
      universeRef.current.clearSingularities();
      if (preset.singularities && preset.singularities.length > 0) {
        preset.singularities.forEach((s) => universeRef.current?.addSingularity(s));
      }
    }
    audioRef.current?.triggerHarmonicChime(0.9, 2);
  }, [handleParticleChange, handleAudioChange]);

  const handleSaveCurrentPreset = useCallback((name: string, description: string) => {
    const newPreset: Preset = {
      id: `user-${Date.now()}`,
      name,
      description,
      category: 'user',
      createdAt: Date.now(),
      particleConfig: { ...particleConfig },
      audioConfig: { ...audioConfig },
      singularities: [...singularities],
    };
    const updated = [newPreset, ...userPresets];
    setUserPresets(updated);
    saveUserPresets(updated);
    setActivePresetId(newPreset.id);
    audioRef.current?.triggerHarmonicChime(1.0, 3);
  }, [particleConfig, audioConfig, singularities, userPresets]);

  const handleDeleteUserPreset = useCallback((id: string) => {
    const updated = userPresets.filter((p) => p.id !== id);
    setUserPresets(updated);
    saveUserPresets(updated);
  }, [userPresets]);

  const handleExportPresets = useCallback(() => {
    const dataStr = JSON.stringify({ version: '1.0', presets: userPresets }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aetheria-cosmic-presets-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [userPresets]);

  const handleImportPresets = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const importedPresets: Preset[] = Array.isArray(parsed.presets)
          ? parsed.presets
          : (Array.isArray(parsed) ? parsed : []);
        if (importedPresets.length > 0) {
          const combined = [...importedPresets, ...userPresets];
          setUserPresets(combined);
          saveUserPresets(combined);
          audioRef.current?.triggerHarmonicChime(1.0, 2);
        }
      } catch (err) {
        console.error('Failed to import preset file', err);
      }
    };
    reader.readAsText(file);
  }, [userPresets]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(e.key)) {
        const noteIdx = parseInt(e.key, 10) - 1;
        handlePlaySynesthesiaNote(noteIdx);
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleShockwave();
      } else if (key === 'q') {
        handleFluctuation();
      } else if (key === 't') {
        setIsTouring((prev) => !prev);
      } else if (key === 'k') {
        setIsSynesthesiaOpen((prev) => !prev);
      } else if (key === 'p') {
        setIsPresetDrawerOpen((prev) => !prev);
      } else if (key === 'r') {
        setIsRecordingModalOpen((prev) => !prev);
      } else if (key === 'a') {
        setIsAccessibilityModalOpen((prev) => !prev);
      } else if (key === 'm') {
        handleAudioChange({ enabled: !audioConfig.enabled });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlaySynesthesiaNote, handleShockwave, handleFluctuation, handleAudioChange, audioConfig.enabled]);

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
        onOpenGuide={() => setIsGuideOpen(true)}
        telemetry={telemetry}
        isTouring={isTouring}
        onToggleTour={() => setIsTouring(!isTouring)}
        onOpenPresets={() => setIsPresetDrawerOpen(true)}
        onOpenRecordingStudio={() => setIsRecordingModalOpen(true)}
        isRecording={recordingState.isRecording}
        onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
        onOpenSingularities={() => setIsSingularitiesOpen(true)}
        singularitiesCount={singularities.length}
        hasLowFpsWarning={hasLowFpsWarning}
        onToggleSynesthesiaKeys={() => setIsSynesthesiaOpen((prev) => !prev)}
        isSynesthesiaOpen={isSynesthesiaOpen}
      />

      {/* Mobile Backdrop Scrim when a drawer is open */}
      {(isDockOpen || isInspectorOpen) && (
        <div
          id="mobile-drawer-backdrop-scrim"
          className="fixed inset-0 z-15 bg-black/40 backdrop-blur-[2px] md:hidden cursor-pointer pointer-events-auto"
          onClick={() => {
            setIsDockOpen(false);
            setIsInspectorOpen(false);
          }}
          title="Tap to close drawer"
        />
      )}

      {/* Left Dock: Manifold & Color Palette Selector */}
      <TopologyDock
        currentTopology={particleConfig.topology}
        onSelectTopology={handleSelectTopology}
        currentColorTheme={particleConfig.colorTheme}
        onSelectColorTheme={handleSelectColorTheme}
        isOpen={isDockOpen}
        onToggleOpen={handleToggleDock}
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
        micActive={micActive}
        onToggleMic={handleToggleMic}
        isOpen={isInspectorOpen}
        onToggleOpen={handleToggleInspector}
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
        onToggleSynesthesiaKeys={() => setIsSynesthesiaOpen(!isSynesthesiaOpen)}
        isSynesthesiaOpen={isSynesthesiaOpen}
        onOpenSingularities={() => setIsSingularitiesOpen(true)}
        singularitiesCount={singularities.length}
      />

      {/* Musical Synesthesia Resonant Floating Keyboard */}
      <SynesthesiaKeyboard
        isOpen={isSynesthesiaOpen}
        onToggle={() => setIsSynesthesiaOpen(!isSynesthesiaOpen)}
        onPlayNote={handlePlaySynesthesiaNote}
        scaleName={audioConfig.scale}
        isAudioEnabled={audioConfig.enabled}
        onEnableAudio={() => handleAudioChange({ enabled: true })}
      />

      {/* Gravitational Singularities & Energy Wells Manager Modal */}
      {isSingularitiesOpen && (
        <div
          id="singularity-manager-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm cursor-pointer"
          onClick={() => setIsSingularitiesOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm cursor-default">
            <SingularityManager
              isOpen={true}
              onClose={() => setIsSingularitiesOpen(false)}
              singularities={singularities}
              onAddCenter={() =>
                handleAddSingularity({
                  id: `sing_${Date.now()}`,
                  position: {
                    x: (Math.random() - 0.5) * 15,
                    y: (Math.random() - 0.5) * 15,
                    z: (Math.random() - 0.5) * 15,
                  },
                  strength: 2.2,
                  radius: 14.0,
                  createdAt: Date.now(),
                  color: '#06b6d4',
                })
              }
              onRemove={handleRemoveSingularity}
              onTogglePolarity={handleToggleSingularityPolarity}
              onClear={handleClearSingularities}
            />
          </div>
        </div>
      )}

      {/* Video Capture & 4K Recording Studio Modal */}
      <RecordingStudioModal
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
        recordingState={recordingState}
        onStartRecording={() => handleStartRecording(60)}
        onPauseRecording={handlePauseRecording}
        onResumeRecording={handleResumeRecording}
        onStopRecording={handleStopRecording}
        onCaptureSnapshot={(mult = 2) => handleCapture4KSnapshot(1920 * mult, 1080 * mult)}
      />

      {/* Accessibility & Sensory Adaptation Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        config={accessibilityConfig}
        onChange={handleUpdateAccessibility}
        isLowFpsDetected={hasLowFpsWarning}
        onAutoOptimize={() => {
          setParticleConfig((prev) => ({
            ...prev,
            count: Math.max(10000, Math.floor(prev.count * 0.6)),
            bloomIntensity: 0.1,
          }));
          universeRef.current?.rebuildParticles();
          setHasLowFpsWarning(false);
        }}
      />

      {/* Cosmological Presets Drawer */}
      <PresetDrawer
        isOpen={isPresetDrawerOpen}
        onClose={() => setIsPresetDrawerOpen(false)}
        masterPresets={MASTER_PRESETS}
        userPresets={userPresets}
        onApplyPreset={handleApplyPreset}
        onSaveCurrentPreset={handleSaveCurrentPreset}
        onDeleteUserPreset={handleDeleteUserPreset}
        onExportPresets={handleExportPresets}
        onImportPresets={handleImportPresets}
        activePresetId={activePresetId}
      />

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
        onFrameText={handleFrameText}
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

      {/* Interactive In-App User Guide & Readme */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
