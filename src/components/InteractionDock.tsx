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
} from 'lucide-react';
import { InteractionMode } from '../types';

interface InteractionDockProps {
  interactionMode: InteractionMode;
  onChangeInteractionMode: (mode: InteractionMode) => void;
  onShockwave: () => void;
  onFluctuation: () => void;
  isTouring: boolean;
  onToggleTour: () => void;
}

export const InteractionDock: React.FC<InteractionDockProps> = ({
  interactionMode,
  onChangeInteractionMode,
  onShockwave,
  onFluctuation,
  isTouring,
  onToggleTour,
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
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none max-w-[94vw]">
      <div className="hud-glass px-3 py-2 rounded-2xl flex items-center space-x-2 pointer-events-auto border border-cyan-500/20 shadow-2xl">
        {/* Interaction Modes */}
        <div className="flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = interactionMode === m.id;
            return (
              <button
                key={m.id}
                id={`interaction-mode-${m.id}`}
                type="button"
                onClick={() => onChangeInteractionMode(m.id)}
                className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-sm font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
                title={`${m.label}: ${m.desc}`}
              >
                <Icon size={14} />
                <span className="text-xs font-mono">{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="w-[1px] h-6 bg-slate-700/60" />

        {/* Dynamic Shockwave & Quantum Kick triggers */}
        <div className="flex items-center space-x-1.5">
          <button
            id="trigger-shockwave-btn"
            type="button"
            onClick={onShockwave}
            className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 flex items-center space-x-1.5 transition-colors cursor-pointer text-xs font-mono font-medium shadow-sm active:scale-95"
            title="Detonate Supernova Shockwave"
          >
            <Bomb size={14} />
            <span className="hidden sm:inline">Shockwave</span>
          </button>

          <button
            id="trigger-fluctuation-btn"
            type="button"
            onClick={onFluctuation}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 flex items-center space-x-1.5 transition-colors cursor-pointer text-xs font-mono font-medium shadow-sm active:scale-95"
            title="Inject Quantum Thermal Kick"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Quantum Kick</span>
          </button>

          {/* Automated Choreography Tour */}
          <button
            id="tour-toggle-btn"
            type="button"
            onClick={onToggleTour}
            className={`px-2.5 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer text-xs font-mono font-medium shadow-sm ${
              isTouring
                ? 'bg-purple-500/30 text-purple-200 border border-purple-400 animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700'
            }`}
            title="Automated 3D Choreography & Soundscape Odyssey"
          >
            {isTouring ? <Pause size={14} /> : <Play size={14} />}
            <span>{isTouring ? 'Touring...' : 'Auto Tour'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
