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
} from 'lucide-react';
import { CameraMode, AudioConfig } from '../types';

interface HeaderBarProps {
  audioConfig: AudioConfig;
  onAudioChange: (cfg: Partial<AudioConfig>) => void;
  onToggleMic: () => Promise<void>;
  micActive: boolean;
  cameraMode: CameraMode;
  onCameraChange: (mode: CameraMode) => void;
  onScreenshot: () => void;
  onOpenShapeStudio: () => void;
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
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
      {/* Brand & Badge */}
      <div className="flex items-center space-x-2.5 pointer-events-auto">
        <div className="hud-glass px-3.5 py-2 rounded-xl flex items-center space-x-2.5 border border-cyan-500/20 shadow-lg">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 relative" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-semibold tracking-wide text-slate-100">
                AETHERIA
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-medium border border-cyan-500/30">
                3D Kinetic Synth
              </span>
            </div>
          </div>
        </div>

        {/* Infinite Shape Studio Quick Launch Button */}
        <button
          id="header-open-shape-studio-btn"
          type="button"
          onClick={onOpenShapeStudio}
          className="hud-glass px-3 py-2 rounded-xl flex items-center space-x-1.5 border border-cyan-500/30 hover:border-cyan-400 text-cyan-200 hover:text-white bg-cyan-950/20 hover:bg-cyan-900/30 transition-all cursor-pointer shadow-md group"
          title="Open Infinite Shape Sculptor Studio (Text, Mutator, Superformula)"
        >
          <Sparkles size={14} className="text-cyan-300 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono font-medium hidden md:inline">Infinite Shapes</span>
        </button>
      </div>

      {/* Center Controls: Audio & Camera Bar */}
      <div className="pointer-events-auto flex items-center space-x-2">
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
            <span className="text-xs font-mono font-medium">
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
              className="w-16 h-1 bg-slate-700 rounded-lg cursor-pointer"
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
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Toggle Microphone Audio Reactivity"
          >
            {micActive ? <Mic size={14} /> : <MicOff size={14} />}
            <span className="text-[11px]">{micActive ? 'MIC LIVE' : 'MIC REACT'}</span>
          </button>
        </div>

        {/* Camera Preset Selector */}
        <div className="hud-glass px-2 py-1.5 rounded-xl flex items-center space-x-1 text-xs font-mono">
          <Eye size={14} className="text-slate-400 ml-1 mr-0.5" />
          {(
            [
              { mode: 'free', label: 'FREE' },
              { mode: 'cinematic_drift', label: 'CINEMATIC' },
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
      </div>

      {/* Right Utility Buttons */}
      <div className="pointer-events-auto flex items-center space-x-2">
        <button
          id="screenshot-capture-btn"
          type="button"
          onClick={onScreenshot}
          className="hud-glass p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
          title="Capture High-Resolution 3D Snapshot (PNG)"
        >
          <Camera size={16} />
        </button>

        <button
          id="fullscreen-toggle-btn"
          type="button"
          onClick={toggleFullscreen}
          className="hud-glass p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </header>
  );
};
