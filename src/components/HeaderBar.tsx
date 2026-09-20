import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  Maximize2,
  Minimize2,
  Sparkles,
  Eye,
  Radio,
  HelpCircle,
  Activity,
  Flame,
  Gauge,
  X,
  Play,
  Pause,
  Menu,
  Sliders,
} from 'lucide-react';
import { CameraMode, AudioConfig, TelemetryData } from '../types';

interface HeaderBarProps {
  audioConfig: AudioConfig;
  onAudioChange: (cfg: Partial<AudioConfig>) => void;
  onToggleMic: () => Promise<void>;
  micActive: boolean;
  cameraMode: CameraMode;
  onCameraChange: (mode: CameraMode) => void;
  onScreenshot: () => void;
  onOpenShapeStudio: () => void;
  onOpenGuide: () => void;
  telemetry: TelemetryData;
  isTouring?: boolean;
  onToggleTour?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  audioConfig,
  onAudioChange,
  onToggleMic,
  micActive,
  cameraMode,
  onCameraChange,
  onScreenshot,
  onOpenShapeStudio,
  onOpenGuide,
  telemetry,
  isTouring = false,
  onToggleTour,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fpsColor =
    telemetry.fps >= 50
      ? 'text-emerald-400'
      : telemetry.fps >= 30
      ? 'text-amber-400'
      : 'text-rose-400';

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header className="absolute top-2.5 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-30 flex items-center justify-between pointer-events-none">
      {/* Brand & Telemetry Badge */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5 pointer-events-auto">
        <div className="hud-glass px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl flex items-center space-x-2 border border-cyan-500/20 shadow-lg">
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 animate-ping absolute" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 relative" />
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-100 font-mono">
              AETHERIA
            </span>
            <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-medium border border-cyan-500/30 hidden md:inline">
              3D Kinetic Synth
            </span>
          </div>
        </div>

        {/* Infinite Shape Studio Quick Launch Button (Visible on sm+) */}
        <button
          id="header-open-shape-studio-btn"
          type="button"
          onClick={onOpenShapeStudio}
          className="hidden sm:flex hud-glass px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl items-center space-x-1.5 border border-cyan-500/30 hover:border-cyan-400 text-cyan-200 hover:text-white bg-cyan-950/20 hover:bg-cyan-900/30 transition-all cursor-pointer shadow-md group"
          title="Open Infinite Shape Sculptor Studio (Text, Mutator, Superformula)"
        >
          <Sparkles size={14} className="text-cyan-300 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono font-medium hidden lg:inline">Infinite Shapes</span>
        </button>

        {/* Real-time Telemetry Diagnostics Badge & Popover */}
        <div className="relative">
          <button
            id="header-telemetry-badge-btn"
            type="button"
            onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
            className={`hud-glass px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl border text-[11px] sm:text-xs font-mono flex items-center space-x-1 sm:space-x-1.5 cursor-pointer transition-all shadow-md ${
              isTelemetryOpen
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                : 'border-cyan-500/25 hover:border-cyan-400/60 text-slate-300'
            }`}
            title="Real-time Performance & Telemetry Diagnostics"
          >
            <Activity size={12} className="text-cyan-400 shrink-0" />
            <span className={`font-bold ${fpsColor}`}>{telemetry.fps} FPS</span>
            <span className="text-slate-600 hidden xl:inline">•</span>
            <span className="text-cyan-300 font-semibold hidden xl:inline">
              {telemetry.particleCount.toLocaleString()} pts
            </span>
          </button>

          {/* Telemetry Popover Dropdown */}
          {isTelemetryOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 hud-glass p-3 rounded-2xl border border-cyan-500/30 shadow-2xl space-y-2.5 w-56 sm:w-60 animate-in fade-in slide-in-from-top-1">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                <span className="text-slate-300 font-mono text-[11px] font-semibold flex items-center space-x-1.5">
                  <Activity size={13} className="text-cyan-400" />
                  <span>Performance Diagnostics</span>
                </span>
                <button
                  id="close-telemetry-popover-btn"
                  type="button"
                  onClick={() => setIsTelemetryOpen(false)}
                  className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                  title="Close diagnostics"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-slate-300">
                <span className="text-slate-400">FPS Rate</span>
                <span className={`font-bold ${fpsColor}`}>
                  {telemetry.fps} FPS
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-slate-300">
                <span className="text-slate-400">Active Particles</span>
                <span className="font-semibold text-cyan-300">
                  {telemetry.particleCount.toLocaleString()}
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-300 mb-0.5">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Flame size={11} className="text-amber-400" />
                    <span>Kinetic Energy</span>
                  </span>
                  <span className="text-amber-300">{telemetry.kineticEnergy}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, telemetry.kineticEnergy)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-300 mb-0.5">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Gauge size={11} className="text-indigo-400" />
                    <span>Spatial Entropy</span>
                  </span>
                  <span className="text-indigo-300">{telemetry.spatialEntropy}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, telemetry.spatialEntropy)}%` }}
                  />
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Manifold</span>
                <span className="text-cyan-200 font-semibold truncate ml-1">
                  {telemetry.activeHarmonic}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop & Tablet Center Controls */}
      <div className="pointer-events-auto hidden sm:flex items-center space-x-2">
        {/* Audio Synthesizer Toggle */}
        <div className="hud-glass px-2.5 py-1.5 rounded-xl flex items-center space-x-2">
          <button
            id="audio-synth-toggle-btn"
            type="button"
            onClick={() => onAudioChange({ enabled: !audioConfig.enabled })}
            className={`p-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-colors cursor-pointer ${
              audioConfig.enabled
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title={audioConfig.enabled ? 'Mute Spatial Synthesizer' : 'Enable Spatial Synthesizer'}
          >
            {audioConfig.enabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="text-xs font-mono font-medium hidden md:inline">
              {audioConfig.enabled ? 'SYNTH ON' : 'SYNTH OFF'}
            </span>
          </button>

          {audioConfig.enabled && (
            <input
              id="audio-volume-slider"
              type="range"
              min="0.0"
              max="0.4"
              step="0.01"
              value={audioConfig.volume}
              onChange={(e) => onAudioChange({ volume: parseFloat(e.target.value) })}
              className="w-14 sm:w-16 h-1 bg-slate-700 rounded-lg cursor-pointer"
              title="Synth Master Volume"
            />
          )}

          <div className="w-[1px] h-4 bg-slate-700/60" />

          {/* Microphone reactivity */}
          <button
            id="mic-reactive-btn"
            type="button"
            onClick={onToggleMic}
            className={`px-2 py-1 rounded-lg text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer ${
              micActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Toggle Microphone Audio Reactivity"
          >
            {micActive ? <Mic size={14} className="text-emerald-400 animate-pulse" /> : <MicOff size={14} />}
            <span className="text-[11px] font-semibold hidden md:inline">
              {micActive ? 'MIC LIVE' : 'MIC REACT'}
            </span>
          </button>
        </div>

        {/* Camera Preset Selector */}
        <div className="hud-glass px-2 py-1.5 rounded-xl flex items-center space-x-1 text-xs font-mono">
          <Eye size={14} className="text-slate-400 ml-1 mr-0.5" />
          <div className="hidden lg:flex items-center space-x-1">
            {(
              [
                { mode: 'free', label: 'FREE' },
                { mode: 'cinematic_drift', label: 'CINEMA' },
                { mode: 'core_dive', label: 'DIVE' },
                { mode: 'top_down', label: 'TOP' },
              ] as const
            ).map((item) => (
              <button
                key={item.mode}
                id={`camera-mode-${item.mode}`}
                type="button"
                onClick={() => onCameraChange(item.mode)}
                className={`px-2 py-1 rounded text-[11px] cursor-pointer transition-colors ${
                  cameraMode === item.mode
                    ? 'bg-indigo-500/25 text-indigo-200 font-medium border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          {/* Compact cyclic button on tablet screens */}
          <button
            id="camera-mode-cycle-mobile-btn"
            type="button"
            onClick={() => {
              const modes: CameraMode[] = ['free', 'cinematic_drift', 'core_dive', 'top_down'];
              const idx = modes.indexOf(cameraMode);
              const next = modes[(idx + 1) % modes.length];
              onCameraChange(next);
            }}
            className="lg:hidden px-2 py-1 rounded text-[11px] bg-indigo-500/25 text-indigo-200 font-medium border border-indigo-500/40 cursor-pointer"
            title="Cycle Camera Preset"
          >
            {cameraMode === 'cinematic_drift' ? 'CINEMA' : cameraMode.toUpperCase()}
          </button>
        </div>

        {/* Global Auto Tour Choreography Button */}
        {onToggleTour && (
          <button
            id="header-tour-toggle-btn"
            type="button"
            onClick={onToggleTour}
            className={`hud-glass px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs font-mono font-medium transition-all cursor-pointer shadow-md shrink-0 ${
              isTouring
                ? 'bg-purple-500/35 text-purple-200 border border-purple-400 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 border border-purple-500/40'
            }`}
            title="Automated 3D Choreography & Soundscape Odyssey (Shortcut: T)"
          >
            {isTouring ? (
              <Pause size={14} className="text-purple-300" />
            ) : (
              <Play size={14} className="text-purple-300 fill-purple-300/40" />
            )}
            <span className="font-semibold">{isTouring ? 'Touring...' : 'Auto Tour'}</span>
          </button>
        )}
      </div>

      {/* Desktop Right Utility Buttons */}
      <div className="pointer-events-auto hidden sm:flex items-center space-x-1.5 sm:space-x-2">
        <button
          id="header-user-guide-btn"
          type="button"
          onClick={onOpenGuide}
          className="hud-glass px-2.5 py-1.5 sm:py-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center space-x-1.5"
          title="User Readme & Interaction Manual"
        >
          <HelpCircle size={15} className="text-cyan-300" />
          <span className="text-xs font-mono hidden md:inline">Guide</span>
        </button>

        <button
          id="screenshot-capture-btn"
          type="button"
          onClick={onScreenshot}
          className="hud-glass p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
          title="Capture High-Resolution 3D Snapshot (PNG)"
        >
          <Camera size={16} />
        </button>

        <button
          id="fullscreen-toggle-btn"
          type="button"
          onClick={toggleFullscreen}
          className="hud-glass p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Mobile-Only Quick Action Cluster (< 640px) */}
      <div className="pointer-events-auto flex sm:hidden items-center space-x-1.5">
        {/* Quick Synth Toggle */}
        <button
          id="mobile-audio-synth-btn"
          type="button"
          onClick={() => onAudioChange({ enabled: !audioConfig.enabled })}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            audioConfig.enabled
              ? 'hud-glass bg-cyan-500/25 text-cyan-300 border border-cyan-400'
              : 'hud-glass text-slate-400 border border-slate-700'
          }`}
          title={audioConfig.enabled ? 'Mute Synthesizer' : 'Enable Synthesizer'}
        >
          {audioConfig.enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Quick Auto Tour Toggle */}
        {onToggleTour && (
          <button
            id="mobile-tour-toggle-btn"
            type="button"
            onClick={onToggleTour}
            className={`p-2 rounded-xl transition-all cursor-pointer shadow-md ${
              isTouring
                ? 'hud-glass bg-purple-500/40 text-purple-200 border border-purple-400 animate-pulse'
                : 'hud-glass text-purple-300 border border-purple-500/40 hover:bg-purple-500/20'
            }`}
            title="Auto 3D Tour"
          >
            {isTouring ? <Pause size={16} /> : <Play size={16} />}
          </button>
        )}

        {/* Mobile Menu Button */}
        <div className="relative">
          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-xl transition-all cursor-pointer shadow-md ${
              isMobileMenuOpen
                ? 'hud-glass bg-cyan-500/25 text-white border border-cyan-400'
                : 'hud-glass text-slate-300 border border-cyan-500/30 hover:border-cyan-400'
            }`}
            title="Open Quick Tools Menu"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* Mobile Dropdown Panel */}
          {isMobileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 hud-glass p-3.5 rounded-2xl border border-cyan-500/40 shadow-2xl space-y-3 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-mono text-xs font-semibold text-cyan-300 flex items-center space-x-1.5">
                  <Sliders size={13} />
                  <span>Device Quick Controls</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Infinite Shapes Studio Button */}
              <button
                id="mobile-shape-studio-btn"
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenShapeStudio();
                }}
                className="w-full p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 text-cyan-200 flex items-center justify-between font-mono text-xs cursor-pointer hover:text-white"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles size={14} className="text-cyan-300" />
                  <span className="font-semibold">Infinite Shapes Studio</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-200">
                  Open
                </span>
              </button>

              {/* Audio Controls */}
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-300 flex items-center space-x-1.5">
                    <Volume2 size={13} className="text-cyan-400" />
                    <span>Synth Master Volume</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">
                    {Math.round(audioConfig.volume * 250)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.4"
                  step="0.01"
                  value={audioConfig.volume}
                  onChange={(e) => onAudioChange({ volume: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />

                {/* Mic Reactivity */}
                <button
                  type="button"
                  onClick={onToggleMic}
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-mono flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
                    micActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {micActive ? <Mic size={14} className="text-emerald-400" /> : <MicOff size={14} />}
                  <span>{micActive ? 'Microphone Active' : 'Enable Mic Reactivity'}</span>
                </button>
              </div>

              {/* Camera Presets */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block px-1">
                  Camera Presets
                </span>
                <div className="grid grid-cols-2 gap-1 font-mono text-xs">
                  {(
                    [
                      { mode: 'free', label: 'Free Orbit' },
                      { mode: 'cinematic_drift', label: 'Cinematic' },
                      { mode: 'core_dive', label: 'Core Dive' },
                      { mode: 'top_down', label: 'Top-Down' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => onCameraChange(item.mode)}
                      className={`p-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                        cameraMode === item.mode
                          ? 'bg-indigo-500/30 text-indigo-200 border-indigo-500/50 font-semibold'
                          : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Utility Tools */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenGuide();
                  }}
                  className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-slate-300 flex flex-col items-center justify-center space-y-1 cursor-pointer"
                >
                  <HelpCircle size={15} className="text-cyan-300" />
                  <span className="text-[10px]">Guide</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onScreenshot();
                  }}
                  className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-slate-300 flex flex-col items-center justify-center space-y-1 cursor-pointer"
                >
                  <Camera size={15} className="text-cyan-300" />
                  <span className="text-[10px]">Snapshot</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    toggleFullscreen();
                  }}
                  className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-slate-300 flex flex-col items-center justify-center space-y-1 cursor-pointer"
                >
                  {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  <span className="text-[10px]">Screen</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

