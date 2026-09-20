import React, { useState } from 'react';
import { Activity, Gauge, Flame, Compass, ChevronDown, ChevronUp } from 'lucide-react';
import { TelemetryData } from '../types';

interface TelemetryHUDProps {
  telemetry: TelemetryData;
  isDockOpen?: boolean;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ telemetry, isDockOpen = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fpsColor =
    telemetry.fps >= 50
      ? 'text-emerald-400'
      : telemetry.fps >= 30
      ? 'text-amber-400'
      : 'text-rose-400';

  return (
    <div
      className={`absolute bottom-4 z-20 transition-all duration-300 pointer-events-none hidden md:flex flex-col space-y-1.5 font-mono text-[11px] ${
        isDockOpen ? 'left-[284px]' : 'left-4'
      }`}
    >
      {/* Compact Mini Badge when collapsed */}
      {isCollapsed ? (
        <button
          id="expand-telemetry-btn"
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="hud-glass px-2.5 py-1.5 rounded-xl border border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-colors pointer-events-auto flex items-center space-x-2 cursor-pointer shadow-lg"
          title="Expand Telemetry HUD"
        >
          <Activity size={13} className="text-cyan-400" />
          <span className={`font-bold ${fpsColor}`}>{telemetry.fps} FPS</span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-300 font-semibold">{telemetry.particleCount.toLocaleString()} pts</span>
          <ChevronUp size={13} className="text-slate-400 ml-0.5" />
        </button>
      ) : (
        /* Full Telemetry panel */
        <div className="hud-glass p-2.5 rounded-xl border border-cyan-500/20 shadow-lg space-y-1.5 w-52 pointer-events-auto">
          <div className="flex justify-between items-center pb-1 border-b border-slate-800">
            <span className="text-slate-400 flex items-center space-x-1">
              <Activity size={12} className="text-cyan-400" />
              <span>Telemetry</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <span className={`font-bold ${fpsColor}`}>{telemetry.fps} FPS</span>
              <button
                id="collapse-telemetry-btn"
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="text-slate-500 hover:text-slate-300 p-0.5 rounded cursor-pointer transition-colors"
                title="Minimize Telemetry HUD"
              >
                <ChevronDown size={12} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Particles</span>
            <span className="font-semibold text-cyan-300">
              {telemetry.particleCount.toLocaleString()}
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 flex items-center space-x-1">
                <Flame size={11} className="text-amber-400" />
                <span>Kinetic Energy</span>
              </span>
              <span className="text-amber-300">{telemetry.kineticEnergy}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-0.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, telemetry.kineticEnergy)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 flex items-center space-x-1">
                <Gauge size={11} className="text-indigo-400" />
                <span>Entropy Index</span>
              </span>
              <span className="text-indigo-300">{telemetry.spatialEntropy}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-0.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, telemetry.spatialEntropy)}%` }}
              />
            </div>
          </div>

          <div className="pt-1 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
            <span className="truncate">Manifold</span>
            <span className="text-cyan-200 truncate font-semibold ml-1">
              {telemetry.activeHarmonic}
            </span>
          </div>
        </div>
      )}

      {/* Navigation hints */}
      {!isCollapsed && (
        <div className="hud-glass px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 flex items-center space-x-1.5 pointer-events-auto">
          <Compass size={12} className="text-cyan-400 shrink-0" />
          <span>Drag: Interact • Right-Drag: Pan • Wheel: Zoom</span>
        </div>
      )}
    </div>
  );
};
