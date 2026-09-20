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
  const [activeSection, setActiveSection] = useState<'quickstart' | 'forces' | 'shapes' | 'optics' | 'audio' | 'shortcuts'>('quickstart');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="hud-glass w-full max-w-2xl max-h-[85vh] rounded-2xl border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <BookOpen size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">Aetheria User Guide & Manual</h2>
              <p className="text-[11px] text-slate-400 font-mono">3D Spatial Particle Laboratory & Synthesizer</p>
            </div>
          </div>
          <button
            id="close-user-guide-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/40 px-4 py-2 overflow-x-auto space-x-1">
          {[
            { id: 'quickstart', label: 'Quick Start', icon: MousePointer },
            { id: 'forces', label: 'Force Fields', icon: Zap },
            { id: 'shapes', label: 'Infinite Shapes', icon: Sparkles },
            { id: 'optics', label: 'Optics & Brightness', icon: SunMedium },
            { id: 'audio', label: 'Spatial Synth', icon: Music },
            { id: 'shortcuts', label: 'Controls Reference', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as typeof activeSection)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap cursor-pointer transition-colors ${
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
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300 custom-scrollbar flex-1">
          {activeSection === 'quickstart' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                <h3 className="text-sm font-medium text-cyan-200 mb-1">Welcome to Aetheria</h3>
                <p className="text-slate-300">
                  Aetheria is an interactive 3D laboratory simulating up to 75,000 discrete particles guided by mathematical attractors, quantum fields, parametric equations, and real-time spatial generative audio synthesis.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-mono text-slate-200 text-xs font-semibold uppercase tracking-wider">How to Navigate the 3D Space:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="font-mono text-cyan-300 font-semibold mb-1">Orbit Rotate</div>
                    <p className="text-slate-400">Left-click and drag across the viewport to orbit around the active topology.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="font-mono text-cyan-300 font-semibold mb-1">Pan View</div>
                    <p className="text-slate-400">Right-click and drag (or hold <kbd className="px-1 bg-slate-800 rounded">Shift</kbd> + Left-click drag) to pan the camera laterally.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="font-mono text-cyan-300 font-semibold mb-1">Zoom</div>
                    <p className="text-slate-400">Scroll the mouse wheel or pinch trackpad to smoothly zoom in and out.</p>
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
                    <span>Toggle Synthesizer</span>
                    <span className="text-cyan-300">Header &gt; SYNTH ON/OFF</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Microphone Reactivity</span>
                    <span className="text-cyan-300">Header &gt; MIC REACT</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Infinite Shapes Studio</span>
                    <span className="text-cyan-300">Header &gt; Infinite Shapes Button</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>Supernova Blast</span>
                    <span className="text-cyan-300">Bottom Dock &gt; Supernova</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span>High-Res Screenshot</span>
                    <span className="text-cyan-300">Header &gt; Camera Icon (Lossless PNG)</span>
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
