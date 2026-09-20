import React, { useState } from 'react';
import {
  Sparkles,
  Type,
  Sliders,
  Dices,
  PenTool,
  Grid,
  X,
  Check,
  RotateCcw,
  Zap,
  Layers,
  Heart,
  Orbit,
  Disc,
  Atom,
  GitBranch,
  Dna,
  Box,
  Wind,
  Infinity as InfinityIcon,
  Compass,
} from 'lucide-react';
import { TopologyType, ParametricParams, ColorTheme } from '../types';

interface ShapeSculptorStudioProps {
  currentTopology: TopologyType;
  onSelectTopology: (t: TopologyType) => void;
  customText: string;
  onChangeText: (text: string) => void;
  onFrameText?: () => void;
  parametric: ParametricParams;
  onChangeParametric: (p: Partial<ParametricParams>) => void;
  onMutateInfinite: () => void;
  isOpen: boolean;
  onClose: () => void;
  onStartDrawing: () => void;
  onClearDrawing: () => void;
  drawnPointsCount: number;
}

const PRESET_TOPOLOGIES: {
  id: TopologyType;
  name: string;
  category: 'cosmos' | 'bio' | 'geometry';
  desc: string;
}[] = [
  // Cosmos & Physics
  { id: 'lorenz', name: 'Lorenz Attractor', category: 'cosmos', desc: 'Strange attractor chaos' },
  { id: 'black_hole', name: 'Gargantua Singularity', category: 'cosmos', desc: 'Relativistic accretion & jets' },
  { id: 'galaxy_spiral', name: 'Barred Spiral Galaxy', category: 'cosmos', desc: 'Galactic core & spiral arms' },
  { id: 'quantum_vortex', name: 'Quantum Tornado', category: 'cosmos', desc: 'Pinched logarithmic funnel' },

  // Biology & Living Forms
  { id: 'neural_connectome', name: 'Neural Connectome', category: 'bio', desc: 'Cortex hubs & synapses' },
  { id: 'double_helix', name: 'DNA Double Helix', category: 'bio', desc: 'Intertwined genetic lattice' },
  { id: 'cardioid_heart', name: 'Cardioid 3D Heart', category: 'bio', desc: 'Volumetric pulsating heart' },
  { id: 'superformula', name: 'Natural Superformula', category: 'bio', desc: 'Biological starfish & flora' },

  // Higher Geometry & 4D Projections
  { id: 'torus_knot', name: 'Torus Knot (3,7)', category: 'geometry', desc: 'Braided topological ribbon' },
  { id: 'calabi_yau', name: 'Calabi-Yau 6D', category: 'geometry', desc: 'String theory manifold' },
  { id: 'mobius_strip', name: 'Möbius Strip', category: 'geometry', desc: 'Non-orientable continuous loop' },
  { id: 'klein_bottle', name: 'Klein Bottle 4D', category: 'geometry', desc: '4D surface immersion in 3D' },
  { id: 'gyroid', name: 'Gyroid Minimal Surface', category: 'geometry', desc: 'Triply periodic lattice' },
  { id: 'clifford_torus', name: 'Clifford Torus 4D', category: 'geometry', desc: 'Hyper-torus stereographic projection' },
  { id: 'metatron_cube', name: 'Metatron Cube', category: 'geometry', desc: 'Sacred hypercube projection' },
  { id: 'lissajous_knot', name: 'Lissajous Knot (3,4,7)', category: 'geometry', desc: '3D harmonic frequency knot' },
];

const TEXT_QUICK_PRESETS = [
  'HACKATHON',
  'AETHERIA',
  '3D SYNTH',
  'QUANTUM',
  'INFINITY',
  'FUTURE',
  'COSMOS',
  'NEBULA',
];

export const ShapeSculptorStudio: React.FC<ShapeSculptorStudioProps> = ({
  currentTopology,
  onSelectTopology,
  customText,
  onChangeText,
  onFrameText,
  parametric,
  onChangeParametric,
  onMutateInfinite,
  isOpen,
  onClose,
  onStartDrawing,
  onClearDrawing,
  drawnPointsCount,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'mutate' | 'catalog' | 'parametric' | 'draw'>('text');
  const [inputText, setInputText] = useState(customText || 'HACKATHON');

  if (!isOpen) return null;

  const handleApplyText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onChangeText(inputText.trim());
    onSelectTopology('text_glyph');
    onFrameText?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
      <div className="hud-glass rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col border border-cyan-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
                <span className="text-sm sm:text-base font-semibold text-slate-100 font-mono tracking-tight truncate">
                  Shape Sculptor Studio
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                  Infinite Morphing
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Transform 3D particles into custom text, infinite mathematical mutations, parametric formulas, or freehand 3D sculptures.
              </p>
            </div>
          </div>
          <button
            id="close-shape-studio-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 bg-slate-900/50 px-4 pt-2 gap-1 overflow-x-auto shrink-0 font-mono text-xs">
          {(
            [
              { id: 'text', label: 'Text & Typography', icon: Type },
              { id: 'mutate', label: 'Infinite Mutator', icon: Dices },
              { id: 'parametric', label: 'Parametric Synthesizer', icon: Sliders },
              { id: 'catalog', label: 'Shape Catalog (16+)', icon: Grid },
              { id: 'draw', label: '3D Air Sculptor', icon: PenTool },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`sculptor-tab-${tab.id}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-t-xl flex items-center space-x-2 transition-all cursor-pointer border-t border-x ${
                  isActive
                    ? 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
                }`}
              >
                <Icon size={14} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Studio Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: TEXT & WORDS */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-mono text-cyan-300 font-medium block mb-2">
                  Enter Any Text, Name, or Symbol to Morph Particles:
                </span>
                <form onSubmit={handleApplyText} className="flex gap-2">
                  <input
                    id="custom-text-input"
                    type="text"
                    maxLength={16}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type words, e.g. HACKATHON, 2026..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    id="morph-text-btn"
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    Morph into 3D Text
                  </button>
                  {onFrameText && (
                    <button
                      id="frame-text-camera-btn"
                      type="button"
                      onClick={onFrameText}
                      title="Auto-align camera to face 3D text"
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <Compass size={14} />
                      <span className="hidden sm:inline">Frame Camera</span>
                    </button>
                  )}
                </form>

                <div className="mt-3">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                    Quick Preset Words:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {TEXT_QUICK_PRESETS.map((txt) => (
                      <button
                        key={txt}
                        id={`text-preset-${txt}`}
                        type="button"
                        onClick={() => {
                          setInputText(txt);
                          onChangeText(txt);
                          onSelectTopology('text_glyph');
                          onFrameText?.();
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                          currentTopology === 'text_glyph' && customText === txt
                            ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 shadow-sm shadow-cyan-500/30'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {txt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200/90 font-mono leading-relaxed">
                ✦ High-Resolution 3D Extrusion: The engine rasterizes your typography into tens of thousands of volumetric 3D particle vertices with bevel and spatial depth.
              </div>
            </div>
          )}

          {/* TAB 2: INFINITE MUTATOR */}
          {activeTab === 'mutate' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/30 via-slate-900/60 to-cyan-950/30 border border-purple-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
                  <Dices size={24} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100 font-mono">
                    Infinite Genetic Topological Mutator
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    Randomizes multi-frequency harmonic coefficients, trigonometric powers, helical twists, and fractal pinch factors to generate an infinite universe of shapes.
                  </p>
                </div>
                <button
                  id="mutate-infinite-btn"
                  type="button"
                  onClick={onMutateInfinite}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-slate-950 font-mono font-bold text-sm transition-transform active:scale-95 cursor-pointer shadow-xl shadow-purple-500/25 inline-flex items-center space-x-2"
                >
                  <Sparkles size={16} />
                  <span>Generate New Infinite Shape</span>
                </button>
              </div>

              {/* Current genetic parameters readout */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-purple-300 font-semibold block">
                  Active Genetic Coefficients:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-slate-300">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Symmetry Folds (m)</span>
                    <span className="text-cyan-300 font-bold">{parametric.m}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Twist Factor</span>
                    <span className="text-cyan-300 font-bold">{parametric.twist.toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Waist Pinch</span>
                    <span className="text-cyan-300 font-bold">{parametric.pinch.toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Harmonics (X:Y:Z)</span>
                    <span className="text-cyan-300 font-bold">
                      {parametric.freqX}:{parametric.freqY}:{parametric.freqZ}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PARAMETRIC SYNTHESIZER */}
          {activeTab === 'parametric' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-cyan-300 font-semibold">
                  Custom Superformula & Harmonic Dials:
                </span>
                <button
                  id="apply-parametric-shape-btn"
                  type="button"
                  onClick={() => onSelectTopology('parametric_custom')}
                  className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 cursor-pointer"
                >
                  Apply to Universe
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Symmetry M */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Symmetry Folds (m)</span>
                    <span className="text-cyan-300 font-bold">{parametric.m}</span>
                  </div>
                  <input
                    id="param-m-slider"
                    type="range"
                    min="1"
                    max="16"
                    step="1"
                    value={parametric.m}
                    onChange={(e) => {
                      onChangeParametric({ m: parseInt(e.target.value) });
                      onSelectTopology('parametric_custom');
                    }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Helical Twist */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Helical Twist Angle</span>
                    <span className="text-cyan-300 font-bold">{parametric.twist.toFixed(1)} rad</span>
                  </div>
                  <input
                    id="param-twist-slider"
                    type="range"
                    min="-8"
                    max="8"
                    step="0.5"
                    value={parametric.twist}
                    onChange={(e) => {
                      onChangeParametric({ twist: parseFloat(e.target.value) });
                      onSelectTopology('parametric_custom');
                    }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Waist Pinch */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Waist Pinch</span>
                    <span className="text-cyan-300 font-bold">{(parametric.pinch * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    id="param-pinch-slider"
                    type="range"
                    min="0"
                    max="1.2"
                    step="0.05"
                    value={parametric.pinch}
                    onChange={(e) => {
                      onChangeParametric({ pinch: parseFloat(e.target.value) });
                      onSelectTopology('parametric_custom');
                    }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Harmonics Multipliers */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Harmonic Frequencies (X:Y)</span>
                    <span className="text-cyan-300 font-bold">
                      {parametric.freqX}x : {parametric.freqY}y
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      id="param-freqx-slider"
                      type="range"
                      min="1"
                      max="8"
                      step="1"
                      value={parametric.freqX}
                      onChange={(e) => {
                        onChangeParametric({ freqX: parseInt(e.target.value) });
                        onSelectTopology('parametric_custom');
                      }}
                      className="w-1/2 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <input
                      id="param-freqy-slider"
                      type="range"
                      min="1"
                      max="8"
                      step="1"
                      value={parametric.freqY}
                      onChange={(e) => {
                        onChangeParametric({ freqY: parseInt(e.target.value) });
                        onSelectTopology('parametric_custom');
                      }}
                      className="w-1/2 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPLETE CATALOG (16+ Shapes) */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_TOPOLOGIES.map((item) => {
                  const isSelected = currentTopology === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`catalog-select-${item.id}`}
                      type="button"
                      onClick={() => {
                        onSelectTopology(item.id);
                        onClose();
                      }}
                      className={`p-3 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                          : 'border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold font-mono">{item.name}</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: 3D AIR DRAWING */}
          {activeTab === 'draw' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-cyan-300">
                  <PenTool size={16} />
                  <span className="text-xs font-mono font-semibold">
                    Freehand 3D Air Sculpting
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Click the button below to enter 3D Draw Mode. Then, drag your mouse or touch across the 3D canvas to draw ribbons, signatures, or sculptures in mid-air. Tens of thousands of particles will instantly arrange along your drawn paths.
                </p>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    id="start-draw-3d-btn"
                    type="button"
                    onClick={() => {
                      onStartDrawing();
                      onClose();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-semibold text-xs cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    Enter 3D Draw Mode
                  </button>

                  <button
                    id="clear-drawn-3d-btn"
                    type="button"
                    onClick={onClearDrawing}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer border border-slate-700 flex items-center space-x-1.5"
                  >
                    <RotateCcw size={13} />
                    <span>Clear Path ({drawnPointsCount} pts)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex justify-between items-center text-xs font-mono text-slate-400">
          <span>Active Topology: <strong className="text-cyan-300">{currentTopology.toUpperCase()}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
