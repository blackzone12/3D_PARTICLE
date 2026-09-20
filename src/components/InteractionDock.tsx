import React from 'react';
import {
  Magnet,
  ShieldAlert,
  RotateCw,
  Waves,
  Hand,
  Bomb,
  Sparkles,
  Play,
  Pause,
  PenTool,
  Compass,
  Music,
} from 'lucide-react';
import { InteractionMode } from '../types';

interface InteractionDockProps {
  interactionMode: InteractionMode;
  onChangeInteractionMode: (mode: InteractionMode) => void;
  onShockwave: () => void;
  onFluctuation: () => void;
  isTouring: boolean;
  onToggleTour: () => void;
  onToggleSynesthesiaKeys?: () => void;
  isSynesthesiaOpen?: boolean;
  onOpenSingularities?: () => void;
  singularitiesCount?: number;
}

export const InteractionDock: React.FC<InteractionDockProps> = ({
  interactionMode,
  onChangeInteractionMode,
  onShockwave,
  onFluctuation,
  isTouring,
  onToggleTour,
  onToggleSynesthesiaKeys,
  isSynesthesiaOpen,
  onOpenSingularities,
  singularitiesCount = 0,
}) => {
  const modes: { id: InteractionMode; label: string; icon: React.FC<{ size?: number }>; desc: string }[] = [
    { id: 'attract', label: 'Attract', icon: Magnet, desc: 'Gravity well singularity' },
    { id: 'repel', label: 'Repel', icon: ShieldAlert, desc: 'Kinetic repulsor blast' },
    { id: 'vortex', label: 'Vortex', icon: RotateCw, desc: 'Angular swirl whirlpool' },
    { id: 'wave', label: 'Ripple', icon: Waves, desc: 'Harmonic oscillation' },
    { id: 'draw_3d', label: '3D Draw', icon: PenTool, desc: 'Sculpt 3D particle path in air' },
    { id: 'none', label: 'Orbit', icon: Hand, desc: 'Camera navigation only' },
  ];

  return (
    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none max-w-[98vw] sm:max-w-[96vw] flex flex-col items-center space-y-1 sm:space-y-1.5 pb-[env(safe-area-inset-bottom,0px)]">
      {/* 3D Viewport Controls & Interaction Navigation Guide (Unblocked & Centered) */}
      <div
        id="viewport-navigation-guide"
        className="hud-glass px-2.5 sm:px-3 py-1 rounded-full border border-slate-700/80 text-[10px] text-slate-300 flex items-center space-x-1.5 sm:space-x-2 pointer-events-auto shadow-lg backdrop-blur-md"
      >
        <Compass size={11} className="text-cyan-400 shrink-0" />
        <span className="font-mono tracking-tight whitespace-nowrap hidden sm:inline">
          <span className="text-cyan-300 font-semibold">Drag</span>: Interact
          <span className="text-slate-500 mx-1.5">•</span>
          <span className="text-cyan-300 font-semibold">Right-Drag</span>: Orbit / Pan
          <span className="text-slate-500 mx-1.5">•</span>
          <span className="text-cyan-300 font-semibold">Wheel</span>: Zoom
        </span>
        <span className="font-mono tracking-tight whitespace-nowrap sm:hidden text-[9.5px]">
          <span className="text-cyan-300 font-semibold">Touch</span>: Interact
          <span className="text-slate-500 mx-1">•</span>
          <span className="text-cyan-300 font-semibold">Pinch</span>: Zoom
          <span className="text-slate-500 mx-1">•</span>
          <span className="text-cyan-300 font-semibold">2-Finger</span>: Orbit
        </span>
      </div>

      <div className="hud-glass px-1.5 sm:px-3 py-1 sm:py-2 rounded-2xl flex flex-wrap items-center justify-center gap-1 sm:gap-2 pointer-events-auto border border-cyan-500/20 shadow-2xl max-w-full">
        {/* Interaction Modes */}
        <div className="flex items-center space-x-0.5 sm:space-x-1 bg-slate-900/60 p-0.5 sm:p-1 rounded-xl border border-slate-800/80 shrink-0">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = interactionMode === m.id;
            return (
              <button
                key={m.id}
                id={`interaction-mode-${m.id}`}
                type="button"
                onClick={() => onChangeInteractionMode(m.id)}
                className={`p-2 sm:px-2.5 sm:py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer min-h-[38px] min-w-[38px] ${
                  isSelected
                    ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-sm font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
                title={`${m.label}: ${m.desc}`}
              >
                <Icon size={14} />
                <span className={`text-xs font-mono ${isSelected ? 'inline' : 'hidden lg:inline'}`}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden sm:block w-[1px] h-6 bg-slate-700/60 shrink-0" />

        {/* Dynamic Shockwave, Quantum Kick & Automated Tour triggers */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
          {/* Automated Choreography Tour - Highlighted and prominent */}
          <button
            id="tour-toggle-btn"
            type="button"
            onClick={onToggleTour}
            className={`px-2 sm:px-3 py-1.5 rounded-xl flex items-center space-x-1 sm:space-x-1.5 transition-all cursor-pointer text-xs font-mono font-medium shadow-md shrink-0 min-h-[38px] ${
              isTouring
                ? 'bg-purple-500/40 text-purple-100 border border-purple-300 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-purple-900/30 hover:bg-purple-800/40 text-purple-200 border border-purple-500/50 hover:border-purple-400'
            }`}
            title="Automated 3D Choreography & Soundscape Odyssey (Shortcut: T)"
          >
            {isTouring ? (
              <Pause size={14} className="text-purple-300" />
            ) : (
              <Play size={14} className="text-purple-300 fill-purple-300/40" />
            )}
            <span className="font-semibold whitespace-nowrap text-[11px] sm:text-xs">
              {isTouring ? 'Touring...' : 'Auto Tour'}
            </span>
          </button>

          <button
            id="trigger-shockwave-btn"
            type="button"
            onClick={onShockwave}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer text-xs font-mono font-medium shadow-sm active:scale-95 shrink-0 min-h-[38px]"
            title="Detonate Supernova Shockwave (Shortcut: Space)"
          >
            <Bomb size={14} />
            <span className="hidden sm:inline">Shockwave</span>
          </button>

          <button
            id="trigger-fluctuation-btn"
            type="button"
            onClick={onFluctuation}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer text-xs font-mono font-medium shadow-sm active:scale-95 shrink-0 min-h-[38px]"
            title="Inject Quantum Thermal Kick (Shortcut: Q)"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Quantum Kick</span>
          </button>

          {/* Musical Synesthesia Keyboard Toggle */}
          {onToggleSynesthesiaKeys && (
            <button
              id="dock-synesthesia-keyboard-btn"
              type="button"
              onClick={onToggleSynesthesiaKeys}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer text-xs font-mono font-medium shadow-sm active:scale-95 shrink-0 min-h-[38px] ${
                isSynesthesiaOpen
                  ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400'
                  : 'bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-600/40'
              }`}
              title="Toggle Resonant Synesthesia Keys (Keys 1-8)"
            >
              <Music size={14} />
              <span className="hidden sm:inline">Keys</span>
            </button>
          )}

          {/* Gravitational Singularities Quick Access */}
          {onOpenSingularities && (
            <button
              id="dock-singularities-btn"
              type="button"
              onClick={onOpenSingularities}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-cyan-900/20 hover:bg-cyan-800/30 text-cyan-200 border border-cyan-500/30 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer text-xs font-mono font-medium shadow-sm active:scale-95 shrink-0 min-h-[38px]"
              title="Manage Gravitational Singularities"
            >
              <Magnet size={14} />
              <span className="hidden sm:inline">Wells</span>
              {singularitiesCount > 0 && (
                <span className="text-[10px] font-mono px-1 py-0.2 rounded-full bg-cyan-500 text-gray-950 font-bold">
                  {singularitiesCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
