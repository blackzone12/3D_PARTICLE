import React from 'react';
import {
  Orbit,
  Zap,
  Atom,
  Disc,
  GitBranch,
  Dna,
  Box,
  Wind,
  Palette,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Dices,
  Type,
  Infinity as InfinityIcon,
  Heart,
} from 'lucide-react';
import { TopologyType, ColorTheme } from '../types';

interface TopologyDockProps {
  currentTopology: TopologyType;
  onSelectTopology: (t: TopologyType) => void;
  currentColorTheme: ColorTheme;
  onSelectColorTheme: (th: ColorTheme) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onOpenShapeStudio: () => void;
  onMutateInfinite: () => void;
}

const TOPOLOGIES: { id: TopologyType; name: string; icon: React.FC<{ size?: number }>; desc: string }[] = [
  { id: 'lorenz', name: 'Lorenz Attractor', icon: Zap, desc: 'Chaotic strange attractor flow' },
  { id: 'torus_knot', name: 'Torus Knot (3,7)', icon: Orbit, desc: 'Braided topological ribbon' },
  { id: 'calabi_yau', name: 'Calabi-Yau 6D', icon: Atom, desc: 'String theory manifold cross-section' },
  { id: 'black_hole', name: 'Gargantua Singularity', icon: Disc, desc: 'Accretion disk & relativistic jets' },
  { id: 'galaxy_spiral', name: 'Spiral Galaxy', icon: InfinityIcon, desc: 'Galactic core & spiral arms' },
  { id: 'cardioid_heart', name: 'Cardioid 3D Heart', icon: Heart, desc: 'Volumetric pulsating heart' },
  { id: 'neural_connectome', name: 'Neural Connectome', icon: GitBranch, desc: 'Cybernetic synaptic pathways' },
  { id: 'double_helix', name: 'DNA Double Helix', icon: Dna, desc: 'Genetic intertwined lattice' },
  { id: 'superformula', name: 'Superformula Flora', icon: Sparkles, desc: 'Infinite biological morphs' },
  { id: 'metatron_cube', name: 'Metatron Cube 4D', icon: Box, desc: 'Sacred hypercube projection' },
  { id: 'quantum_vortex', name: 'Quantum Vortex', icon: Wind, desc: 'Logarithmic tornado pinch flow' },
];

const COLOR_PALETTES: { id: ColorTheme; name: string; preview: string }[] = [
  { id: 'nebula_cosmos', name: 'Nebula Cosmos', preview: 'from-sky-400 via-purple-500 to-pink-500' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', preview: 'from-cyan-400 via-rose-500 to-yellow-400' },
  { id: 'solar_flare', name: 'Solar Flare', preview: 'from-amber-400 via-red-500 to-yellow-200' },
  { id: 'bioluminescence', name: 'Bioluminescence', preview: 'from-emerald-400 via-cyan-500 to-lime-400' },
  { id: 'obsidian_chrome', name: 'Obsidian & Platinum', preview: 'from-slate-200 via-slate-400 to-zinc-600' },
  { id: 'quantum_spectrum', name: 'Prismatic HSL', preview: 'from-indigo-500 via-teal-400 to-orange-400' },
];

export const TopologyDock: React.FC<TopologyDockProps> = ({
  currentTopology,
  onSelectTopology,
  currentColorTheme,
  onSelectColorTheme,
  isOpen,
  onToggleOpen,
  onOpenShapeStudio,
  onMutateInfinite,
}) => {
  return (
    <div
      className={`fixed sm:absolute left-0 sm:left-3 top-14 sm:top-16 bottom-24 sm:bottom-20 z-20 flex items-center transition-transform duration-300 pointer-events-none ${
        isOpen ? 'translate-x-0' : '-translate-x-[calc(100%-36px)]'
      }`}
    >
      <div className="hud-glass rounded-r-2xl sm:rounded-2xl p-3 w-64 max-w-[80vw] h-full flex flex-col justify-between overflow-y-auto pointer-events-auto border border-cyan-500/20 shadow-2xl">
        {/* Top: Manifolds */}
        <div>
          {/* Infinite Shapes Banner Button */}
          <div className="mb-2.5">
            <button
              id="open-shape-sculptor-banner-btn"
              type="button"
              onClick={onOpenShapeStudio}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/25 via-purple-500/25 to-pink-500/25 hover:from-cyan-500/35 hover:to-pink-500/35 border border-cyan-400/40 text-left transition-all cursor-pointer shadow-lg shadow-cyan-950/50 group"
            >
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-lg bg-cyan-400/20 text-cyan-300">
                  <Sparkles size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono font-bold text-cyan-200 group-hover:text-white flex items-center justify-between">
                    <span>Infinite Shapes</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300">
                      Studio
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300/80 truncate">
                    Custom 3D Text & Unlimited Shapes
                  </div>
                </div>
              </div>
            </button>

            {/* Quick Mutator Button */}
            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
              <button
                id="quick-mutate-shape-btn"
                type="button"
                onClick={onMutateInfinite}
                className="px-2 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-[11px] font-mono flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                title="Generate novel random mathematical topology"
              >
                <Dices size={12} />
                <span>Mutate Shape</span>
              </button>

              <button
                id="quick-3d-text-btn"
                type="button"
                onClick={onOpenShapeStudio}
                className="px-2 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-[11px] font-mono flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                title="Morph particles into any 3D word or text"
              >
                <Type size={12} />
                <span>3D Text</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-700/50">
            <span className="text-[10px] font-mono tracking-wider text-cyan-300 font-semibold uppercase">
              Quantum Manifolds
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              16+ Shapes
            </span>
          </div>

          <div className="space-y-1">
            {TOPOLOGIES.map((topo) => {
              const Icon = topo.icon;
              const isSelected = currentTopology === topo.id;
              return (
                <button
                  key={topo.id}
                  id={`topology-select-${topo.id}`}
                  type="button"
                  onClick={() => onSelectTopology(topo.id)}
                  className={`w-full text-left p-1.5 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-cyan-400/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400 group-hover:text-cyan-300'
                    }`}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium tracking-tight truncate">
                      {topo.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {topo.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom: Color Themes */}
        <div className="pt-2 mt-2 border-t border-slate-700/50">
          <div className="flex items-center justify-between pb-1 mb-1">
            <span className="text-[10px] font-mono tracking-wider text-indigo-300 font-semibold uppercase flex items-center space-x-1.5">
              <Palette size={11} />
              <span>Spectral Palette</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {COLOR_PALETTES.map((pal) => {
              const isSelected = currentColorTheme === pal.id;
              return (
                <button
                  key={pal.id}
                  id={`palette-select-${pal.id}`}
                  type="button"
                  onClick={() => onSelectColorTheme(pal.id)}
                  className={`p-1.5 rounded-lg text-left transition-all cursor-pointer flex items-center space-x-2 border ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-500/20'
                      : 'border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/60'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${pal.preview} shrink-0 ring-1 ring-white/20`}
                  />
                  <span className="text-[10px] text-slate-300 truncate font-mono">
                    {pal.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Collapse / Expand Tab Button */}
      <button
        id="topology-dock-toggle-btn"
        type="button"
        onClick={onToggleOpen}
        className="pointer-events-auto hud-glass py-3.5 px-1.5 sm:px-2 rounded-r-xl text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer border-l-0 border border-cyan-500/30 flex flex-col items-center justify-center space-y-1 shadow-xl bg-slate-950/80 min-h-[48px] min-w-[34px] group"
        title={isOpen ? 'Collapse Manifold Dock' : 'Expand Manifold & Theme Dock'}
      >
        {isOpen ? (
          <ChevronLeft size={16} />
        ) : (
          <ChevronRight size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
        )}
        {!isOpen && (
          <span className="text-[9px] font-mono tracking-widest text-cyan-400/80 [writing-mode:vertical-lr] uppercase select-none hidden sm:inline">
            Shapes
          </span>
        )}
      </button>
    </div>
  );
};

