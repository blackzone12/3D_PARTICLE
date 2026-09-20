import React, { useState } from 'react';
import {
  X,
  BookOpen,
  MousePointer,
  Sparkles,
  SunMedium,
  Music,
  Zap,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'quickstart' | 'gemini' | 'forces' | 'shapes' | 'optics' | 'audio' | 'shortcuts'>('quickstart');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-md">
      <div className="hud-glass w-full max-w-2xl max-h-[88vh] rounded-2xl border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
              <BookOpen size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide truncate">Aetheria User Guide & Manual</h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">3D Spatial Particle Laboratory & Synthesizer</p>
            </div>
          </div>
          <button
            id="close-user-guide-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/40 px-3 sm:px-4 py-2 overflow-x-auto space-x-1">
          {[
            { id: 'quickstart', label: 'Quick Start', icon: MousePointer },
            { id: 'gemini', label: '✨ Gemini AI', icon: Sparkles },
            { id: 'forces', label: 'Force Fields & Wells', icon: Zap },
            { id: 'shapes', label: 'Infinite Shapes', icon: Sparkles },
            { id: 'audio', label: 'Synesthesia & Audio', icon: Music },
            { id: 'optics', label: 'Optics & Studio', icon: SunMedium },
            { id: 'shortcuts', label: 'Controls Reference', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as typeof activeSection)}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300 custom-scrollbar flex-1">
          {activeSection === 'quickstart' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                <h3 className="text-sm font-medium text-cyan-200 mb-1">Welcome to Aetheria</h3>
                <p className="text-slate-300">
                  Aetheria is an interactive 3D laboratory simulating up to 75,000 discrete particles guided by mathematical attractors, quantum fields, parametric equations, and real-time spatial generative audio synthesis.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-mono text-slate-200 text-xs font-semibold uppercase tracking-wider">How to Navigate the 3D Space (Mouse & Touch):</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="font-mono text-cyan-300 font-semibold mb-1">Orbit / Rotate</div>
                    <p className="text-slate-400">Desktop: Left-drag in Orbit mode.<br />Touch: 2-finger drag anywhere to rotate the 3D universe.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="font-mono text-cyan-300 font-semibold mb-1">Force Interaction</div>
                    <p className="text-slate-400">Desktop: Click & drag to apply force.<br />Touch: 1-finger drag directly sculpts, attracts or repels particles.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="font-mono text-cyan-300 font-semibold mb-1">Zoom View</div>
                    <p className="text-slate-400">Desktop: Scroll mouse wheel.<br />Touch: 2-finger pinch in or out to smoothly scale camera distance.</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px]">
                <div className="font-mono text-slate-200 font-semibold mb-1">Camera Presets:</div>
                <div className="flex flex-wrap gap-2 text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">FREE</span> Unconstrained exploration
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">CINEMATIC</span> Autonomous orbital drift
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">DIVE</span> Singularity core dive
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">TOP</span> Symmetrical overhead view
                </div>
              </div>
            </div>
          )}

          {activeSection === 'gemini' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40 border border-indigo-500/40">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-200">
                    Gemini AI Cosmic Oracle (Gemini 3.8 Flash)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                    Generative Intelligence
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Translate natural language imagination, cosmological prompts, and poetic descriptions into mathematically coherent 3D particle topologies, parametric superformulas, and custom microtonal audio soundscapes in real-time.
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-mono text-slate-200 text-xs font-semibold uppercase tracking-wider">How to Synthesize a Universe:</h4>
                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-cyan-300 block mb-1">1. Click AI Oracle or Press 'G'</strong>
                    <p className="text-slate-400">Launch the Oracle modal from the HeaderBar or bottom Dock.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-purple-300 block mb-1">2. Provide Any Prompt or Click Inspiration Seeds</strong>
                    <p className="text-slate-400">Type concepts like <em>"A bioluminescent abyssal jellyfish with pentatonic drone"</em> or <em>"Kerr rotating black hole event horizon"</em>.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-emerald-300 block mb-1">3. Materialize &amp; Save</strong>
                    <p className="text-slate-400">Gemini generates parametric formulas, color themes, and harmonic chords. Click <strong>Materialize Universe</strong> to morph your canvas, or <strong>Save as Preset</strong> for later.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'forces' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                The dock at the bottom of the screen allows you to deploy interactive force fields directly onto the particle fabric in real time:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-cyan-300 font-semibold block mb-0.5">ATTRACT (Gravity Well)</span>
                  <p className="text-slate-400 text-[11px]">Concentrates particles into a high-density vortex around the cursor, accelerating particle velocities.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-rose-300 font-semibold block mb-0.5">REPEL (Dispersal Field)</span>
                  <p className="text-slate-400 text-[11px]">Deflects and scatters particles with an outward force field, clearing out negative space.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-indigo-300 font-semibold block mb-0.5">VORTEX (Tornado)</span>
                  <p className="text-slate-400 text-[11px]">Injects tangential rotational torque, spinning particles along a swirling vortex column.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-amber-300 font-semibold block mb-0.5">WAVE (Harmonic Ripple)</span>
                  <p className="text-slate-400 text-[11px]">Generates transverse undulating sinusoidal ripple waves across the coordinate lattice.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="font-mono text-slate-200 font-semibold mb-1">Explosive Energy Impulses:</div>
                <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
                  <li><strong className="text-cyan-300">Supernova Shockwave:</strong> Generates an expanding blast sphere pushing particles outward with fluid dynamics.</li>
                  <li><strong className="text-cyan-300">Quantum Jolt:</strong> Introduces high-velocity Brownian fluctuation to disperse ordered structures into chaotic states.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'shapes' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                Aetheria includes an <strong>Infinite Shape Sculptor Studio</strong> accessible from the header bar or inspector:
              </p>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-mono text-cyan-300 font-semibold mb-1 flex items-center space-x-1">
                    <span>1. Text-to-3D Particle Extrusion</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Type any custom word or phrase (e.g. your name, project name, or hackathon team). Particles immediately reorganize along the typographical vector paths and depth layers in 3D space.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-mono text-cyan-300 font-semibold mb-1 flex items-center space-x-1">
                    <span>2. Parametric Superformula (Gielis Equation)</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Adjust mathematical symmetry folds (<span className="font-mono text-cyan-200">m = 1 to 16</span>), curvature exponents (<span className="font-mono text-cyan-200">n1, n2, n3</span>), helical twist, and pinch to generate infinite organic and crystalline forms. Click <strong>Mutate Random Shape</strong> for immediate procedural generation.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-mono text-cyan-300 font-semibold mb-1 flex items-center space-x-1">
                    <span>3. 3D Freehand Air Drawing</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Select <span className="font-mono text-cyan-200">DRAW 3D</span> mode in the bottom dock and drag directly in the 3D viewport. The particle swarm aligns to follow your freehand brushstrokes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'optics' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <h3 className="text-sm font-medium text-emerald-200 mb-1">Discrete Particle Visibility & Anti-Glare</h3>
                <p className="text-slate-300 text-[11px]">
                  Engineered specifically so every individual particle is clearly visible without blowing out into blinding white light or blurry glare.
                </p>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-cyan-300 font-semibold block mb-0.5">Particle Blending Modes (Inspector &gt; Optics)</span>
                  <p className="text-slate-400">
                    <strong>Discrete Points (Normal Blending):</strong> Overlapping particles preserve their sharp individual silhouettes and deep theme hues. Prevents dense clusters from fusing into solid white blobs.<br />
                    <strong>Cosmic Glow (Additive Blending):</strong> Calibrated additive luminescence for ethereal, cosmic glows.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-cyan-300 font-semibold block mb-0.5">Luminance & Brightness Slider</span>
                  <p className="text-slate-400">
                    Tune overall luminance between 20% and 150% to match ambient room lighting and display contrast.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-cyan-300 font-semibold block mb-0.5">Particle Geometry Sprites</span>
                  <p className="text-slate-400">
                    Switch between <strong>Crisp Dots</strong> (ultra-sharp definition), <strong>Soft Disc</strong> (compact celestial beads), <strong>Quantum Ring</strong> (holographic torus), and <strong>Prism Star</strong> (diamond diffraction spikes).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'audio' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                Aetheria includes an embedded procedural synthesizer using the browser's native Web Audio API:
              </p>

              <div className="space-y-2 text-[11px]">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-cyan-300 font-semibold block mb-0.5">Spatial Kinetic Sonification</span>
                  <p className="text-slate-400">
                    The sound engine is dynamically coupled to the physics simulation: cursor position modulates stereo panning and harmonic overtone sweeps, while kinetic energy drives resonant biquad filters.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-cyan-300 font-semibold block mb-0.5">Musical Microtonal Scales</span>
                  <p className="text-slate-400">
                    Choose from <em>Celestial</em>, <em>Dorian</em>, <em>Lydian</em>, <em>Akebono</em>, or <em>Cosmic Pentatonic</em> tunings in the Inspector's Harmonics tab.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-cyan-300 font-semibold block mb-0.5">Microphone Reactivity</span>
                  <p className="text-slate-400">
                    Click <strong>MIC REACT</strong> in the header bar to allow ambient music, voice, or clapping to pulse the gravitational field in real time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'shortcuts' && (
            <div className="space-y-3">
              <div className="border border-slate-800 rounded-xl overflow-hidden font-mono text-[11px]">
                <div className="grid grid-cols-2 p-2.5 bg-slate-900/80 font-semibold text-slate-300 border-b border-slate-800">
                  <span>Action</span>
                  <span>Control / Trigger</span>
                </div>
                <div className="divide-y divide-slate-800/60 text-slate-400">
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Rotate View</span>
                    <span className="text-cyan-300">Left Click + Drag</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Pan View</span>
                    <span className="text-cyan-300">Right Click Drag / Shift + Drag</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Zoom In / Out</span>
                    <span className="text-cyan-300">Scroll Wheel / Pinch</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Spawn Gravitational Well</span>
                    <span className="text-cyan-300">Double Click 3D Canvas / Wells Manager</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Play Synesthesia Notes</span>
                    <span className="text-cyan-300">Keys 1 - 8 / Synesthesia Keyboard</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Supernova Shockwave</span>
                    <span className="text-cyan-300">Spacebar / Dock Button</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Quantum Thermal Kick</span>
                    <span className="text-cyan-300">Q / Dock Button</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Gemini AI Cosmic Oracle</span>
                    <span className="text-cyan-300">G / Header AI Oracle</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Auto Tour Choreography</span>
                    <span className="text-cyan-300">T / Header &amp; Dock Button</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Cosmic Presets Drawer</span>
                    <span className="text-cyan-300">P / Header Presets Button</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Video &amp; 4K Recording Studio</span>
                    <span className="text-cyan-300">R / Header Record Button</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Accessibility &amp; Watchdog</span>
                    <span className="text-cyan-300">A / Header A11y Button</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Toggle Synthesizer</span>
                    <span className="text-cyan-300">M / Header SYNTH ON/OFF</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Toggle Synesthesia Keys</span>
                    <span className="text-cyan-300">K / Dock Keys Button</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Infinite Shapes Studio</span>
                    <span className="text-cyan-300">Header &gt; Infinite Shapes</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Fullscreen</span>
                    <span className="text-cyan-300">Header &gt; Maximize Icon</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>WebGL 3D Core Active</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 font-medium transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
