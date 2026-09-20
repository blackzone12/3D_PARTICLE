# Aetheria — 3D Kinetic Particle Laboratory & Spatial Audio Synthesizer

> A high-performance, real-time 3D spatial particle laboratory and kinetic audio-reactive synthesizer engineered for modern browsers. Built with Three.js, WebGL, Web Audio API, React 19, and Tailwind CSS.

---

## 🌟 Overview

**Aetheria** is an interactive spatial environment where thousands of discrete, high-clarity particles coalesce into parametric topologies, chaotic attractors, custom 3D typography, and user-drawn 3D sculptures. The motion and spatial entropy of the particle field dynamically modulate a microtonal spatial sound synthesizer in real time.

---

## 🎮 Quick Start & Interactive Controls

### 1. 3D Camera Navigation
- **Orbit Rotate**: Left-click + Drag (in `FREE` camera or `NONE` interaction mode).
- **Pan Camera**: Right-click + Drag, or `Shift` + Left-click + Drag.
- **Zoom In / Out**: Mouse Scroll Wheel or trackpad pinch (ranges smoothly between 6 and 110 units).
- **Camera View Presets**:
  - `FREE`: Unconstrained orbit with smooth spherical damping.
  - `CINEMATIC`: Continuous, slow orbital drift around the active topology.
  - `DIVE`: Plunges the camera into the core singularity of the particle cluster.
  - `TOP`: Top-down orthographic perspective for examining symmetry patterns.

### 2. Kinetic Force Fields (Bottom Dock)
Switch between 5 interactive physics forces using the bottom dock:
- **ATTRACT (Gravity Well)**: Pulls particles into a high-density vortex around the cursor.
- **REPEL (Dispersal Field)**: Deflects particles away with an inverse-square force.
- **VORTEX (Tornado)**: Induces tangential angular momentum around the cursor axis.
- **WAVE (Sinusoidal Ripples)**: Creates oscillating transverse harmonic ripples through the particle cloud.
- **DRAW 3D (Air Sculpting)**: Draw freehand 3D trajectories directly in space.

### 3. Instant Energy Impulse Triggers
- **Supernova Shockwave**: Spawns an expanding blast wave that propels particles outward with real-time radial wave physics.
- **Quantum Fluctuation**: Injects high-energy Brownian thermal noise across all particles, breaking symmetric clusters into chaos.

---

## 🔮 Infinite Shape Sculptor Studio

Click the **Infinite Shapes** button in the header bar or inspector to access the dynamic shape generator:

### 1. Text-to-3D Glyph Extrusion
- Type any word, name, or hackathon team title.
- High-resolution off-screen rasterization samples letterforms and maps thousands of particles along vector contours and depth layers.

### 2. Parametric Superformula (Gielis Equation)
- Explore infinite geometric topologies by tweaking:
  - **Symmetry Folds ($m$)**: Creates starfishes, snowflakes, polygons, and multifaceted prisms (1 to 16 lobes).
  - **Shape Exponents ($n_1, n_2, n_3$)**: Morphs between pinch curves, hyper-ellipses, and crystalline edges.
  - **Helical Twist**: Spirals the 3D mesh along the Z axis.
  - **Waist Pinch**: Constricts or flares the equatorial band.
- **Random Topology Mutator**: One-click procedural mutation with harmonious randomized parameters.

### 3. 3D Freehand Air Sculpting
- Select the `DRAW 3D` tool and click-drag in the viewport.
- Particles continuously migrate and align themselves to your custom 3D brushstrokes.

### 4. Mathematical Attractors & Manifolds
- **Lorenz Strange Attractor**: Chaotic atmospheric convection attractor.
- **Calabi-Yau Manifold**: 6-dimensional compactified string theory projection.
- **Black Hole Accretion Disk**: Relativistic Keplerian orbit with event horizon singularity.
- **Torus Knot & Lissajous**: Multi-harmonic knotted geometries.
- **Neural Connectome**: Synaptic branching network with axonal pathways.
- **Klein Bottle & Möbius Strip**: Non-orientable 4D topology immersions.
- **Gyroid**: Triply periodic minimal surface.

---

## 🔬 Discrete Optics & Anti-Glare Calibration

Engineered to eliminate washed-out white blobs and keep every individual particle crisp and distinctly resolved:

1. **Discrete Point Blending (`NormalBlending`)**:
   - Overlapping particles preserve individual boundaries and rich thematic colors instead of over-saturating into a solid white wash.
   - Switch to `Cosmic Glow` (Additive) anytime via the **Optics** tab for ethereal neon aesthetics.
2. **Luminance & Brightness Slider**:
   - Tune particle brightness between 20% and 150% for optimal contrast on your display.
3. **Pure-Alpha Particle Textures**:
   - `Crisp Dots`: High-contrast discrete points with anti-aliased rims.
   - `Soft Disc`: Luminous beads with tight, calibrated falloff.
   - `Quantum Ring`: Holographic diffraction rings with center pinpoints.
   - `Prism Star`: 4-axis diamond star diffraction spikes.
4. **Color Palettes**:
   - **Nebula Cosmos**: Sky cyan, electric violet, and deep pink.
   - **Cyberpunk**: Radiant neon cyan, rose red, and high-volt yellow.
   - **Solar Flare**: Molten amber, solar core yellow, and fire red.
   - **Bioluminescence**: Emerald green, marine cyan, and phosphor lime.
   - **Obsidian Chrome**: Monochromatic platinum and slate steel.
   - **Quantum Spectrum**: Continuous velocity-dependent rainbow chromatic cycling.

---

## 🎵 Generative Spatial Audio Engine

Aetheria features a built-in procedural synthesizer powered by the browser's Web Audio API:

- **Spatial Synesthesia**: Synthesizer harmonic frequencies and filter sweeps are driven directly by real-time particle kinetic energy, cursor coordinates, and spatial entropy.
- **Musical Scales**:
  - *Celestial Ambient*
  - *Dorian Void*
  - *Lydian Dreams*
  - *Akebono Mystic*
  - *Cosmic Pentatonic*
- **Microphone Reactivity**:
  - Toggle **MIC LIVE** in the header to feed ambient voice, music, or claps into the 3D physics engine via real-time Web Audio FFT analysis.

---

## 📊 Live Telemetry HUD

Located in the bottom-left corner of the interface:
- **FPS Counter**: Hardware frame-rate diagnostic with 60 FPS stabilization.
- **Particle Counter**: Active buffer count (15,000 to 75,000 live particles).
- **Kinetic Energy Meter**: Real-time aggregate physical velocity of the universe.
- **Spatial Entropy**: Measure of disorder, turbulence, and dispersion.
- **Active Harmonic Topology**: Name of the active manifold or superformula.

---

## ⌨️ Shortcut & Feature Reference

| Action | Control / Shortcut |
| :--- | :--- |
| **Orbit Camera** | Left-Click + Drag |
| **Pan Camera** | Right-Click + Drag or `Shift` + Drag |
| **Zoom View** | Mouse Scroll Wheel / Trackpad Pinch |
| **Trigger Force Field** | Select dock icon (`ATTRACT`, `REPEL`, `VORTEX`, `WAVE`, `DRAW 3D`) |
| **Supernova Blast** | Bottom dock `Supernova` button |
| **Quantum Thermal Jolt** | Bottom dock `Quantum Jolt` button |
| **Toggle Audio Synth** | Header bar `SYNTH ON / OFF` button |
| **Microphone Input** | Header bar `MIC REACT` button |
| **High-Res Snapshot** | Header bar `Camera` button (exports lossless PNG) |
| **Fullscreen Mode** | Header bar `Maximize` button |
| **Shape Studio** | Header bar `Infinite Shapes` or Inspector `Shape` tab |

---

## 🛠️ Architecture & Technologies

- **Rendering Engine**: Three.js `WebGLRenderer` utilizing customized `BufferGeometry` and `PointsMaterial`.
- **Procedural Shader/Texture Generator**: In-memory Canvas API procedural alpha masks.
- **Audio Engine**: Native `AudioContext` with custom stereo panners, biquad resonant filters, sub-bass drones, and harmonic oscillators.
- **UI & HUD Framework**: React 19, Motion (`framer-motion`), Lucide Icons, and Tailwind CSS.
- **Build System**: Vite with TypeScript strict mode.
