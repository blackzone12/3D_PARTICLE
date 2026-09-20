import React, { useState } from 'react';
import {
  Sliders,
  Activity,
  Music,
  ChevronRight,
  ChevronLeft,
  Gauge,
  Sparkles,
  RefreshCw,
  Type,
  Dices,
} from 'lucide-react';
import { ParticleConfig, AudioConfig, ParametricParams } from '../types';

interface KineticInspectorProps {
  particleConfig: ParticleConfig;
  onParticleChange: (cfg: Partial<ParticleConfig>) => void;
  onRebuildParticles: () => void;
  audioConfig: AudioConfig;
  onAudioChange: (cfg: Partial<AudioConfig>) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onOpenShapeStudio: () => void;
  onMutateInfinite: () => void;
}

export const KineticInspector: React.FC<KineticInspectorProps> = ({
  particleConfig,
  onParticleChange,
  onRebuildParticles,
  audioConfig,
  onAudioChange,
  isOpen,
  onToggleOpen,
  onOpenShapeStudio,
  onMutateInfinite,
}) => {
  const [activeTab, setActiveTab] = useState<'shape' | 'physics' | 'optics' | 'synth'>('shape');

  return (
    <div
      className={`absolute right-3 top-16 bottom-20 z-20 flex transition-all duration-300 pointer-events-none ${
        isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-12px)]'
      }`}
    >
      {/* Collapse / Expand Tab Button */}
      <button
        id="kinetic-inspector-toggle-btn"
        type="button"
        onClick={onToggleOpen}
        className="pointer-events-auto self-center mr-1 hud-glass p-1.5 rounded-l-lg text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer border-r-0"
        title={isOpen ? 'Collapse Inspector' : 'Expand Inspector'}
      >
        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="hud-glass rounded-2xl p-3.5 w-72 flex flex-col justify-between overflow-y-auto pointer-events-auto border border-cyan-500/20 shadow-2xl">
        <div>
          {/* Header & Tabs */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-700/50">
            <span className="text-[11px] font-mono tracking-wider text-cyan-300 font-semibold uppercase flex items-center space-x-1.5">
              <Sliders size={13} />
              <span>Parametric Synthesizer</span>
            </span>
          </div>

          <div className="flex items-center bg-slate-900/60 p-1 rounded-xl mb-3 border border-slate-800">
            {(
              [
                { id: 'shape', label: 'Shape', icon: Sparkles },
                { id: 'physics', label: 'Physics', icon: Activity },
                { id: 'optics', label: 'Optics', icon: Gauge },
                { id: 'synth', label: 'Synth', icon: Music },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`inspector-tab-${tab.id}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-1 rounded-lg text-xs font-mono flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-200 font-medium border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 0: SHAPE & UNLIMITED TOPOLOGIES */}
          {activeTab === 'shape' && (
            <div className="space-y-3 text-xs">
              {/* Full Studio Trigger */}
              <button
                id="inspector-open-studio-btn"
                type="button"
                onClick={onOpenShapeStudio}
                className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/40 text-cyan-200 font-mono font-medium flex items-center justify-between cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center space-x-1.5">
                  <Sparkles size={13} className="text-cyan-300" />
                  <span>Open Sculptor Studio</span>
                </div>
                <span className="text-[10px] bg-cyan-400/20 px-1.5 py-0.5 rounded text-cyan-300">
                  Unlimited
                </span>
              </button>

              {/* Instant Genetic Mutator */}
              <button
                id="inspector-mutate-btn"
                type="button"
                onClick={onMutateInfinite}
                className="w-full py-2 px-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-mono font-medium flex items-center justify-center space-x-2 cursor-pointer transition-colors active:scale-95"
              >
                <Dices size={14} className="text-purple-300" />
                <span>Mutate Infinite Shape</span>
              </button>

              {/* 3D Text morph input */}
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-mono text-[10px] text-slate-400 block mb-1.5 flex items-center space-x-1">
                  <Type size={11} className="text-cyan-300" />
                  <span>Morph into 3D Words:</span>
                </span>
                <div className="flex gap-1.5">
                  <input
                    id="inspector-custom-text"
                    type="text"
                    maxLength={14}
                    value={particleConfig.customText}
                    onChange={(e) => onParticleChange({ customText: e.target.value })}
                    placeholder="e.g. HACKATHON"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    id="inspector-apply-text-btn"
                    type="button"
                    onClick={() => onParticleChange({ topology: 'text_glyph' })}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-semibold text-[11px] cursor-pointer"
                  >
                    Morph
                  </button>
                </div>
              </div>

              {/* Superformula Sliders */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <div className="flex justify-between items-center text-slate-300 mb-1">
                    <span className="font-mono text-[11px]">Symmetry Folds (m)</span>
                    <span className="font-mono text-[10px] text-cyan-300 font-bold">
                      {particleConfig.parametric.m}
                    </span>
                  </div>
                  <input
                    id="param-m-inline"
                    type="range"
                    min="1"
                    max="16"
                    step="1"
                    value={particleConfig.parametric.m}
                    onChange={(e) =>
                      onParticleChange({
                        topology: 'parametric_custom',
                        parametric: { ...particleConfig.parametric, m: parseInt(e.target.value) },
                      })
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-slate-300 mb-1">
                    <span className="font-mono text-[11px]">Helical Twist</span>
                    <span className="font-mono text-[10px] text-cyan-300 font-bold">
                      {particleConfig.parametric.twist.toFixed(1)}
                    </span>
                  </div>
                  <input
                    id="param-twist-inline"
                    type="range"
                    min="-6"
                    max="6"
                    step="0.5"
                    value={particleConfig.parametric.twist}
                    onChange={(e) =>
                      onParticleChange({
                        topology: 'parametric_custom',
                        parametric: { ...particleConfig.parametric, twist: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-slate-300 mb-1">
                    <span className="font-mono text-[11px]">Waist Pinch</span>
                    <span className="font-mono text-[10px] text-cyan-300 font-bold">
                      {(particleConfig.parametric.pinch * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    id="param-pinch-inline"
                    type="range"
                    min="0"
                    max="1.2"
                    step="0.05"
                    value={particleConfig.parametric.pinch}
                    onChange={(e) =>
                      onParticleChange({
                        topology: 'parametric_custom',
                        parametric: { ...particleConfig.parametric, pinch: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: PHYSICS */}
          {activeTab === 'physics' && (
            <div className="space-y-3 text-xs">
              {/* Particle Count selection */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span className="font-mono text-[11px]">Particle Density</span>
                  <span className="font-mono text-[10px] text-cyan-300">
                    {particleConfig.count.toLocaleString()} pts
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[15000, 30000, 50000, 75000].map((num) => (
                    <button
                      key={num}
                      id={`particle-count-${num}`}
                      type="button"
                      onClick={() => {
                        onParticleChange({ count: num });
                        setTimeout(onRebuildParticles, 10);
                      }}
                      className={`py-1 rounded text-[10px] font-mono cursor-pointer border ${
                        particleConfig.count === num
                          ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-semibold'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      {num / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Scale / Bullet-Time */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span className="font-mono text-[11px]">Time Warp (Speed)</span>
                  <span className="font-mono text-[10px] text-cyan-300">
                    {particleConfig.timeScale.toFixed(2)}x
                  </span>
                </div>
                <input
                  id="param-time-scale"
                  type="range"
                  min="0.05"
                  max="2.5"
                  step="0.05"
                  value={particleConfig.timeScale}
                  onChange={(e) => onParticleChange({ timeScale: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                  <span>Freeze</span>
                  <span>1.0x Real</span>
                  <span>Hyper</span>
                </div>
              </div>

              {/* 3D Curl Turbulence */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span className="font-mono text-[11px]">Curl Turbulence</span>
                  <span className="font-mono text-[10px] text-cyan-300">
                    {(particleConfig.noiseStrength * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  id="param-noise-strength"
                  type="range"
                  min="0.0"
                  max="0.8"
                  step="0.02"
                  value={particleConfig.noiseStrength}
                  onChange={(e) => onParticleChange({ noiseStrength: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Gravitational Field Power */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span className="font-mono text-[11px]">Gravity Singularity</span>
                  <span className="font-mono text-[10px] text-cyan-300">
                    {particleConfig.gravityStrength.toFixed(1)} G
                  </span>
                </div>
                <input
                  id="param-gravity-strength"
                  type="range"
                  min="0.2"
                  max="4.0"
                  step="0.1"
                  value={particleConfig.gravityStrength}
                  onChange={(e) => onParticleChange({ gravityStrength: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Morph Restitution Speed */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span className="font-mono text-[11px]">Morph Restitution</span>
                  <span className="font-mono text-[10px] text-cyan-300">
                    {(particleConfig.morphSpeed * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  id="param-morph-speed"
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={particleConfig.morphSpeed}
                  onChange={(e) => onParticleChange({ morphSpeed: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Damping */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span className="font-mono text-[11px]">Kinetic Damping</span>
                  <span className="font-mono text-[10px] text-cyan-300">
                    {particleConfig.damping.toFixed(2)}
                  </span>
                </div>
                <input
                  id="param-damping"
                  type="range"
                  min="0.85"
                  max="0.99"
                  step="0.01"
                  value={particleConfig.damping}
                  onChange={(e) => onParticleChange({ damping: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 2: OPTICS */}
          {activeTab === 'optics' && (
            <div className="space-y-3 text-xs">
              {/* Blending Mode: Discrete Particle Clarity vs Cosmic Additive */}
              <div>
                <span className="font-mono text-[11px] text-slate-300 block mb-1.5">
                  Particle Blending Mode
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    id="blend-mode-normal"
                    type="button"
                    onClick={() => onParticleChange({ blendMode: 'normal' })}
                    className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                      particleConfig.blendMode === 'normal'
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                        : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-semibold font-mono">Discrete Points</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">High clarity, zero blowout</div>
                  </button>

                  <button
                    id="blend-mode-additive"
                    type="button"
                    onClick={() => onParticleChange({ blendMode: 'additive' })}
                    className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                      particleConfig.blendMode === 'additive'
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                        : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-semibold font-mono">Cosmic Glow</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Additive luminescence</div>
                  </button>
                </div>
              </div>

              {/* Particle Luminance & Brightness Slider */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span className="font-mono text-[11px]">Luminance & Brightness</span>
                  <span className="font-mono text-[10px] text-cyan-300 font-bold">
                    {((particleConfig.brightness ?? 0.7) * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  id="param-particle-brightness"
                  type="range"
                  min="0.2"
                  max="1.5"
                  step="0.05"
                  value={particleConfig.brightness ?? 0.7}
                  onChange={(e) => onParticleChange({ brightness: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                  <span>Subdued</span>
                  <span>Balanced</span>
                  <span>Vivid</span>
                </div>
              </div>

              {/* Particle Scale / Size */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span className="font-mono text-[11px]">Particle Size</span>
                  <span className="font-mono text-[10px] text-cyan-300">
                    {particleConfig.size.toFixed(2)} px
                  </span>
                </div>
                <input
                  id="param-particle-size"
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={particleConfig.size}
                  onChange={(e) => onParticleChange({ size: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                  <span>Fine Dust</span>
                  <span>Crisp Points</span>
                  <span>Beads</span>
                </div>
              </div>

              {/* Point Sprite Style */}
              <div>
                <span className="font-mono text-[11px] text-slate-300 block mb-1.5">
                  Particle Geometry Sprite
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { id: 'crisp_dot', label: 'Crisp Dots', desc: 'Ultra-clear definition' },
                      { id: 'glow_disc', label: 'Soft Disc', desc: 'Sleek celestial beads' },
                      { id: 'quantum_ring', label: 'Quantum Ring', desc: 'Holographic torus' },
                      { id: 'star_sparkle', label: 'Prism Star', desc: '4-axis diffraction' },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      id={`point-style-${st.id}`}
                      type="button"
                      onClick={() => onParticleChange({ pointStyle: st.id })}
                      className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                        particleConfig.pointStyle === st.id
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                          : 'border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/60 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-medium">{st.label}</div>
                      <div className="text-[9px] text-slate-400">{st.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bloom / Atmosphere */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span className="font-mono text-[11px]">Atmospheric Bloom</span>
                  <span className="font-mono text-[10px] text-cyan-300">
                    {(particleConfig.bloomIntensity * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  id="param-bloom-intensity"
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={particleConfig.bloomIntensity}
                  onChange={(e) => onParticleChange({ bloomIntensity: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 3: HARMONICS / AUDIO */}
          {activeTab === 'synth' && (
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-mono text-[11px] text-slate-300 block mb-1.5">
                  Generative Scale
                </span>
                <div className="space-y-1">
                  {(
                    [
                      { id: 'celestial', label: 'Celestial Lydian', desc: 'Elevated ethereal major' },
                      { id: 'dorian', label: 'Deep Dorian', desc: 'Mysterious sci-fi resonance' },
                      { id: 'akebono', label: 'Akebono Pentatonic', desc: 'Zen cryptographic frequencies' },
                      { id: 'cosmic_pentatonic', label: 'Cosmic Pentatonic', desc: 'Open starlight harmonics' },
                    ] as const
                  ).map((sc) => (
                    <button
                      key={sc.id}
                      id={`scale-select-${sc.id}`}
                      type="button"
                      onClick={() => onAudioChange({ scale: sc.id })}
                      className={`w-full p-2 rounded-xl text-left transition-all cursor-pointer border ${
                        audioConfig.scale === sc.id
                          ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200'
                          : 'border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/60 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-medium">{sc.label}</div>
                      <div className="text-[10px] text-slate-400">{sc.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drone Fundamental */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span className="font-mono text-[11px]">Sub-Drone Root</span>
                  <span className="font-mono text-[10px] text-indigo-300">
                    {audioConfig.droneFrequency.toFixed(1)} Hz
                  </span>
                </div>
                <input
                  id="param-drone-freq"
                  type="range"
                  min="45.0"
                  max="110.0"
                  step="1.0"
                  value={audioConfig.droneFrequency}
                  onChange={(e) => onAudioChange({ droneFrequency: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                  <span>F1 (43Hz)</span>
                  <span>C2 (65Hz)</span>
                  <span>A2 (110Hz)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 leading-relaxed font-mono">
                ✦ Spatial Sonification: Particle speed, turbulence & 3D cursor position actively modulate filter resonance, stereo panning & generative chimes in real-time.
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2 mt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>GPU Compute Ready</span>
          <button
            id="reset-particles-btn"
            type="button"
            onClick={onRebuildParticles}
            className="flex items-center space-x-1 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
          >
            <RefreshCw size={11} />
            <span>Reset Flow</span>
          </button>
        </div>
      </div>
    </div>
  );
};
