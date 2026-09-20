import React from 'react';
import { GravitationalSingularity } from '../types';
import { Magnet, Trash2, Plus, Sparkles, RefreshCw, X } from 'lucide-react';

interface SingularityManagerProps {
  singularities: GravitationalSingularity[];
  onTogglePolarity: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onAddCenter: () => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export const SingularityManager: React.FC<SingularityManagerProps> = ({
  singularities,
  onTogglePolarity,
  onRemove,
  onClear,
  onAddCenter,
  onClose,
  isOpen = true,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="singularity-manager-panel"
      className="bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl text-white w-full max-w-sm"
    >
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Magnet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-2">
              Gravitational Anomalies
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-1.5 py-0.5 rounded-full border border-cyan-500/30">
                {singularities.length} Active
              </span>
            </h3>
            <p className="text-[11px] text-gray-400">Pinned spatial force anchors</p>
          </div>
        </div>

        {onClose && (
          <button
            id="close-singularity-manager-btn"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
            aria-label="Close Singularity Manager"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Instructional Banner */}
      <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200/90 leading-relaxed flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-cyan-300">Spatial Genesis:</span> Double-click
          anywhere in the 3D cosmos to cast a new singularity at that depth plane.
        </div>
      </div>

      {/* Singularities List */}
      <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
        {singularities.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-500">
            No singularities active. Double-click in the viewport or spawn one below.
          </div>
        ) : (
          singularities.map((sing, idx) => {
            const isAttractor = sing.strength > 0;
            return (
              <div
                key={sing.id}
                id={`singularity-item-${sing.id}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/60 hover:border-gray-600 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isAttractor
                        ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-mono font-medium text-gray-200">
                      Singularity #{idx + 1}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {isAttractor ? 'Attractor' : 'Repulsor'} ({Math.abs(sing.strength).toFixed(1)}x)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`toggle-singularity-btn-${sing.id}`}
                    onClick={() => onTogglePolarity(sing.id)}
                    title={isAttractor ? 'Switch to Repulsor' : 'Switch to Attractor'}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono transition border ${
                      isAttractor
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                    }`}
                  >
                    <RefreshCw className="w-3 h-3 inline mr-1" />
                    {isAttractor ? 'Attract' : 'Repel'}
                  </button>

                  <button
                    id={`remove-singularity-btn-${sing.id}`}
                    onClick={() => onRemove(sing.id)}
                    title="Collapse Singularity"
                    className="p-1 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    aria-label="Delete Singularity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Control Actions */}
      <div className="mt-3 pt-3 border-t border-gray-800/80 flex items-center gap-2">
        <button
          id="add-center-singularity-btn"
          onClick={onAddCenter}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition shadow-lg shadow-cyan-900/30"
        >
          <Plus className="w-3.5 h-3.5" />
          Spawn at Center
        </button>

        {singularities.length > 0 && (
          <button
            id="clear-all-singularities-btn"
            onClick={onClear}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-800 hover:bg-rose-900/40 text-gray-300 hover:text-rose-300 text-xs font-medium transition border border-gray-700 hover:border-rose-700/50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
