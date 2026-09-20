import * as THREE from 'three';
import { ParticleConfig, InteractionMode, TelemetryData, CameraMode } from '../types';
import { generateTopology, TopologyData } from './topologies';
import { applyThemeToColor, COLOR_THEMES } from './colorThemes';
import { createParticleTexture } from './textures';
import { generateInfiniteMutation } from './parametricBuilder';

export interface Shockwave {
  origin: THREE.Vector3;
  radius: number;
  maxRadius: number;
  speed: number;
  strength: number;
}

export class ParticleUniverse {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private container: HTMLElement;

  // Particles
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.PointsMaterial | null = null;
  private particleSystem: THREE.Points | null = null;

  // Buffers
  private positions!: Float32Array;
  private velocities!: Float32Array;
  private targetPositions!: Float32Array;
  private colors!: Float32Array;
  private targetColors!: Float32Array;
  private scales!: Float32Array;

  // Active configuration
  public config: ParticleConfig;
  public interactionMode: InteractionMode = 'attract';
  public cameraMode: CameraMode = 'free';

  // 3D Drawing Points
  public drawnPoints: THREE.Vector3[] = [];

  // Raycasting & 3D Pointer
  private raycaster = new THREE.Raycaster();
  private mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  public mouse3D = new THREE.Vector3(0, 0, 0);
  public isInteracting = false;
  public normalizedMouseX = 0; // -1 to 1

  // Shockwaves
  private shockwaves: Shockwave[] = [];

  // Camera Orbit State
  private camDistance = 38;
  private targetCamDistance = 38;
  private camRotX = 0.25;
  private camRotY = 0.0;
  private targetRotX = 0.25;
  private targetRotY = 0.0;
  private camPan = new THREE.Vector3(0, 0, 0);
  private targetCamPan = new THREE.Vector3(0, 0, 0);

  // Drag interaction
  private isPointerDown = false;
  private pointerButton = 0; // 0: left, 2: right
  private lastPointerX = 0;
  private lastPointerY = 0;

  // Simulation time & FPS
  private clock = new THREE.Clock();
  private frameCount = 0;
  private lastFpsTime = 0;
  private currentFps = 60;
  private animationId: number | null = null;

  // Telemetry callback
  public onTelemetryUpdate?: (data: TelemetryData) => void;
  public onAudioModulation?: (normX: number, kineticEnergy: number, spatialEntropy: number) => void;

  // Audio reactivity
  public audioReactivity: { bass: number; mid: number; high: number; level: number } = {
    bass: 0,
    mid: 0,
    high: 0,
    level: 0,
  };
  public isAudioReactive: boolean = false;
  private smoothedBass: number = 0;
  private smoothedMid: number = 0;
  private smoothedHigh: number = 0;
  private smoothedLevel: number = 0;
  private lastAudioBeatTime: number = 0;

  constructor(container: HTMLElement, config: ParticleConfig) {
    this.container = container;
    this.config = config;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030712, 0.008);

    // 2. Camera
    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    this.updateCameraPosition();

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true, // For 4K snapshots
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x030712, 1);
    container.appendChild(this.renderer.domElement);

    // 4. Initialize Particles
    this.rebuildParticles();

    // 5. Event Listeners
    this.setupEventListeners();

    // 6. Start Loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  public rebuildParticles(): void {
    const count = this.config.count;

    // Dispose previous
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem);
      this.geometry?.dispose();
      this.material?.dispose();
    }

    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    this.targetPositions = new Float32Array(count * 3);
    this.colors = new Float32Array(count * 3);
    this.targetColors = new Float32Array(count * 3);
    this.scales = new Float32Array(count);

    // Generate topology coordinates
    const topology = generateTopology(this.config.topology, count, 24, {
      customText: this.config.customText,
      parametric: this.config.parametric,
      drawnPoints: this.drawnPoints,
    });
    const theme = this.config.colorTheme;
    const tempCol = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spawn near topology or slight burst
      this.targetPositions[i3] = topology.positions[i3];
      this.targetPositions[i3 + 1] = topology.positions[i3 + 1];
      this.targetPositions[i3 + 2] = topology.positions[i3 + 2];

      this.positions[i3] = topology.positions[i3] + (Math.random() - 0.5) * 4;
      this.positions[i3 + 1] = topology.positions[i3 + 1] + (Math.random() - 0.5) * 4;
      this.positions[i3 + 2] = topology.positions[i3 + 2] + (Math.random() - 0.5) * 4;

      this.velocities[i3] = 0;
      this.velocities[i3 + 1] = 0;
      this.velocities[i3 + 2] = 0;

      this.scales[i] = topology.scales[i];

      // Map color theme
      applyThemeToColor(
        theme,
        topology.colors[i3],
        topology.colors[i3 + 1],
        topology.colors[i3 + 2],
        tempCol
      );

      this.colors[i3] = tempCol.r;
      this.colors[i3 + 1] = tempCol.g;
      this.colors[i3 + 2] = tempCol.b;

      this.targetColors[i3] = tempCol.r;
      this.targetColors[i3 + 1] = tempCol.g;
      this.targetColors[i3 + 2] = tempCol.b;
    }

    // Geometry
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    // Texture
    const texture = createParticleTexture(this.config.pointStyle);

    // Material - Tuned for crisp discrete particle visibility without blinding blowout
    const isNormal = this.config.blendMode === 'normal';
    const baseOpacity = isNormal ? 0.95 : 0.42;
    const brightness = this.config.brightness ?? 0.7;

    this.material = new THREE.PointsMaterial({
      size: this.config.size,
      vertexColors: true,
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: isNormal ? THREE.NormalBlending : THREE.AdditiveBlending,
      sizeAttenuation: true,
      opacity: THREE.MathUtils.clamp(baseOpacity * brightness, 0.1, 1.0),
    });

    this.particleSystem = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particleSystem);
  }

  public morphToTopology(newTopology?: ParticleConfig['topology']): void {
    if (newTopology) {
      this.config.topology = newTopology;
    }
    const count = this.config.count;
    const data = generateTopology(this.config.topology, count, 24, {
      customText: this.config.customText,
      parametric: this.config.parametric,
      drawnPoints: this.drawnPoints,
    });
    const tempCol = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      this.targetPositions[i3] = data.positions[i3];
      this.targetPositions[i3 + 1] = data.positions[i3 + 1];
      this.targetPositions[i3 + 2] = data.positions[i3 + 2];
      this.scales[i] = data.scales[i];

      applyThemeToColor(
        this.config.colorTheme,
        data.colors[i3],
        data.colors[i3 + 1],
        data.colors[i3 + 2],
        tempCol
      );

      this.targetColors[i3] = tempCol.r;
      this.targetColors[i3 + 1] = tempCol.g;
      this.targetColors[i3 + 2] = tempCol.b;
    }

    // When switching to 3D text glyph, auto-align camera for optimal legibility
    if (this.config.topology === 'text_glyph') {
      if (Math.abs(this.targetRotX) > 0.4 || Math.abs(this.targetRotY) > 0.4) {
        this.targetRotX = 0.12;
        this.targetRotY = 0.0;
        this.targetCamDistance = 38;
        this.targetCamPan.set(0, 0, 0);
      }
    }
  }

  public updateCustomText(newText: string): void {
    this.config.customText = newText;
    this.config.topology = 'text_glyph';
    this.morphToTopology('text_glyph');
  }

  public frameTextCamera(): void {
    this.targetRotX = 0.12;
    this.targetRotY = 0.0;
    this.targetCamDistance = 38;
    this.targetCamPan.set(0, 0, 0);
  }

  public mutateInfiniteShape(): any {
    const { data, params } = generateInfiniteMutation(this.config.count);
    this.config.parametric = params;
    this.config.topology = 'infinite_mutation';
    const count = this.config.count;
    const tempCol = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      this.targetPositions[i3] = data.positions[i3];
      this.targetPositions[i3 + 1] = data.positions[i3 + 1];
      this.targetPositions[i3 + 2] = data.positions[i3 + 2];
      this.scales[i] = data.scales[i];

      applyThemeToColor(
        this.config.colorTheme,
        data.colors[i3],
        data.colors[i3 + 1],
        data.colors[i3 + 2],
        tempCol
      );

      this.targetColors[i3] = tempCol.r;
      this.targetColors[i3 + 1] = tempCol.g;
      this.targetColors[i3 + 2] = tempCol.b;
    }
    return params;
  }

  public clearDrawnPoints(): void {
    this.drawnPoints = [];
    this.morphToTopology('drawn_3d');
  }

  public setAudioReactivity(
    data: { bass: number; mid: number; high: number; level: number },
    active: boolean
  ): void {
    this.audioReactivity = data;
    this.isAudioReactive = active;
  }

  public updateTheme(newTheme: ParticleConfig['colorTheme']): void {
    this.config.colorTheme = newTheme;
    const count = this.config.count;
    const topo = generateTopology(this.config.topology, count, 24, {
      customText: this.config.customText,
      parametric: this.config.parametric,
      drawnPoints: this.drawnPoints,
    });
    const tempCol = new THREE.Color();

    const tData = COLOR_THEMES[newTheme];
    if (tData) {
      this.scene.fog?.color.setStyle(tData.background);
      this.renderer.setClearColor(tData.background, 1);
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      applyThemeToColor(
        newTheme,
        topo.colors[i3],
        topo.colors[i3 + 1],
        topo.colors[i3 + 2],
        tempCol
      );

      this.targetColors[i3] = tempCol.r;
      this.targetColors[i3 + 1] = tempCol.g;
      this.targetColors[i3 + 2] = tempCol.b;
    }
  }

  public updatePointStyle(newStyle: ParticleConfig['pointStyle']): void {
    this.config.pointStyle = newStyle;
    if (this.material) {
      this.material.map?.dispose();
      this.material.map = createParticleTexture(newStyle);
      this.material.needsUpdate = true;
    }
  }

  public triggerSupernovaShockwave(): void {
    this.shockwaves.push({
      origin: this.mouse3D.clone(),
      radius: 0.1,
      maxRadius: 36.0,
      speed: 28.0,
      strength: 42.0,
    });
  }

  public triggerQuantumFluctuation(): void {
    const count = this.config.count;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const kick = 6.0;
      this.velocities[i3] += (Math.random() - 0.5) * kick;
      this.velocities[i3 + 1] += (Math.random() - 0.5) * kick;
      this.velocities[i3 + 2] += (Math.random() - 0.5) * kick;
    }
  }

  private setupEventListeners(): void {
    const dom = this.container;

    const onPointerMove = (e: PointerEvent) => {
      const rect = dom.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const normX = (clientX / rect.width) * 2 - 1;
      const normY = -(clientY / rect.height) * 2 + 1;
      this.normalizedMouseX = normX;

      // Project ray to virtual camera-facing plane
      this.raycaster.setFromCamera(new THREE.Vector2(normX, normY), this.camera);
      // Align plane perpendicular to camera direction passing through camPan
      const camDir = new THREE.Vector3();
      this.camera.getWorldDirection(camDir);
      this.mousePlane.setFromNormalAndCoplanarPoint(camDir.negate(), this.camPan);

      const hit = new THREE.Vector3();
      if (this.raycaster.ray.intersectPlane(this.mousePlane, hit)) {
        this.mouse3D.copy(hit);
      }

      // 3D Drawing in air
      if (this.isPointerDown && this.interactionMode === 'draw_3d') {
        const lastPt = this.drawnPoints[this.drawnPoints.length - 1];
        if (!lastPt || lastPt.distanceTo(this.mouse3D) > 0.35) {
          this.drawnPoints.push(this.mouse3D.clone());
          if (this.drawnPoints.length % 3 === 0) {
            this.morphToTopology('drawn_3d');
          }
        }
      }

      // Camera orbit drag
      if (this.isPointerDown) {
        const dx = e.clientX - this.lastPointerX;
        const dy = e.clientY - this.lastPointerY;

        if (this.pointerButton === 2 || (this.pointerButton === 0 && e.shiftKey)) {
          // Pan camera
          const panSpeed = this.camDistance * 0.0015;
          const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
          const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion);

          this.targetCamPan.addScaledVector(right, -dx * panSpeed);
          this.targetCamPan.addScaledVector(up, dy * panSpeed);
        } else if (this.pointerButton === 0 && this.interactionMode === 'none') {
          // Free Orbit rotate
          this.targetRotY += dx * 0.006;
          this.targetRotX = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, this.targetRotX + dy * 0.006));
        }

        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      this.isPointerDown = true;
      this.pointerButton = e.button;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
      this.isInteracting = true;
    };

    const onPointerUp = () => {
      this.isPointerDown = false;
      this.isInteracting = false;
      if (this.interactionMode === 'draw_3d' && this.drawnPoints.length >= 2) {
        this.morphToTopology('drawn_3d');
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.035;
      this.targetCamDistance = Math.max(6, Math.min(110, this.targetCamDistance + zoomDelta));
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Prevent right-click menu for panning
    };

    // Multi-touch gestures for mobile & tablet (pinch-to-zoom, two-finger orbit)
    let touchCount = 0;
    let prevTouchDist = 0;
    let prevTouchMidX = 0;
    let prevTouchMidY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchCount = e.touches.length;
      if (touchCount === 2) {
        this.isInteracting = false;
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        prevTouchDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        prevTouchMidX = (t0.clientX + t1.clientX) / 2;
        prevTouchMidY = (t0.clientY + t1.clientY) / 2;
      } else if (touchCount === 1) {
        const t0 = e.touches[0];
        this.lastPointerX = t0.clientX;
        this.lastPointerY = t0.clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Prevent page zoom on mobile
        e.preventDefault();
        this.isInteracting = false;
        const t0 = e.touches[0];
        const t1 = e.touches[1];

        // 1. Pinch-to-zoom
        const currDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        if (prevTouchDist > 0) {
          const pinchDelta = (prevTouchDist - currDist) * 0.12;
          this.targetCamDistance = Math.max(6, Math.min(110, this.targetCamDistance + pinchDelta));
        }
        prevTouchDist = currDist;

        // 2. Two-finger orbit rotation
        const currMidX = (t0.clientX + t1.clientX) / 2;
        const currMidY = (t0.clientY + t1.clientY) / 2;
        if (prevTouchMidX !== 0 || prevTouchMidY !== 0) {
          const dMidX = currMidX - prevTouchMidX;
          const dMidY = currMidY - prevTouchMidY;
          this.targetRotY += dMidX * 0.008;
          this.targetRotX = Math.max(
            -Math.PI / 2 + 0.05,
            Math.min(Math.PI / 2 - 0.05, this.targetRotX + dMidY * 0.008)
          );
        }
        prevTouchMidX = currMidX;
        prevTouchMidY = currMidY;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      touchCount = e.touches.length;
      if (touchCount < 2) {
        prevTouchDist = 0;
        prevTouchMidX = 0;
        prevTouchMidY = 0;
      }
    };

    dom.style.touchAction = 'none';
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: false });
    dom.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('contextmenu', onContextMenu);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    resizeObserver.observe(dom);
  }

  public handleResize(): void {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private updateCameraPosition(): void {
    // Smooth spherical orbit coordinates
    this.camRotX += (this.targetRotX - this.camRotX) * 0.12;
    this.camRotY += (this.targetRotY - this.camRotY) * 0.12;
    this.camDistance += (this.targetCamDistance - this.camDistance) * 0.12;
    this.camPan.lerp(this.targetCamPan, 0.12);

    const cosX = Math.cos(this.camRotX);
    const sinX = Math.sin(this.camRotX);
    const cosY = Math.cos(this.camRotY);
    const sinY = Math.sin(this.camRotY);

    this.camera.position.set(
      this.camPan.x + this.camDistance * cosX * sinY,
      this.camPan.y + this.camDistance * sinX,
      this.camPan.z + this.camDistance * cosX * cosY
    );
    this.camera.lookAt(this.camPan);
  }

  public setCameraPreset(mode: CameraMode): void {
    this.cameraMode = mode;
    switch (mode) {
      case 'top_down':
        this.targetRotX = Math.PI / 2 - 0.05;
        this.targetRotY = 0;
        this.targetCamDistance = 42;
        break;
      case 'side_view':
        this.targetRotX = 0;
        this.targetRotY = Math.PI / 2;
        this.targetCamDistance = 38;
        break;
      case 'core_dive':
        this.targetRotX = 0.15;
        this.targetRotY = 0.8;
        this.targetCamDistance = 14;
        break;
      case 'free':
      case 'cinematic_drift':
      default:
        this.targetRotX = 0.25;
        this.targetRotY = 0.0;
        this.targetCamDistance = 38;
        break;
    }
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(this.animate);

    const delta = Math.min(0.05, this.clock.getDelta());
    const elapsedTime = this.clock.getElapsedTime();
    const timeScale = this.config.timeScale;
    const scaledDelta = delta * timeScale;

    // Cinematic camera drift if enabled
    if (this.cameraMode === 'cinematic_drift') {
      this.targetRotY += 0.003 * timeScale;
      this.targetRotX = 0.2 + 0.12 * Math.sin(elapsedTime * 0.4);
    }

    this.updateCameraPosition();

    // Physics Simulation step
    this.stepPhysics(scaledDelta, elapsedTime);

    // Update Shockwaves
    this.updateShockwaves(scaledDelta);

    // Render
    this.renderer.render(this.scene, this.camera);

    // Telemetry & FPS measurement
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsTime >= 500) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = now;
      this.emitTelemetry();
    }
  }

  private stepPhysics(dt: number, time: number): void {
    if (!this.geometry) return;

    const count = this.config.count;
    const posAttr = this.geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = this.geometry.attributes.color as THREE.BufferAttribute;

    const morphSpeed = this.config.morphSpeed;
    const noiseStrength = this.config.noiseStrength;
    const damping = this.config.damping;
    const gravity = this.config.gravityStrength;

    const mouseActive = (this.isPointerDown || this.interactionMode !== 'none') && this.interactionMode !== 'none';
    const mouseX = this.mouse3D.x;
    const mouseY = this.mouse3D.y;
    const mouseZ = this.mouse3D.z;

    const isTextMode = this.config.topology === 'text_glyph';
    // For 3D text: damp curl turbulence so letterforms remain sharp, solid and legible
    const effectiveNoise = isTextMode ? noiseStrength * 0.08 : noiseStrength;
    const effectiveMorph = isTextMode ? 14.0 : 8.0;

    // Real-time audio reactivity smoothing and beat detection
    let bassPulse = 0;
    let midSwirl = 0;
    let highShimmer = 0;
    let audioGlow = 0;

    if (this.isAudioReactive && this.audioReactivity.level > 0.005) {
      const rawBass = this.audioReactivity.bass;
      const rawMid = this.audioReactivity.mid;
      const rawHigh = this.audioReactivity.high;
      const rawLevel = this.audioReactivity.level;

      this.smoothedBass += (rawBass - this.smoothedBass) * Math.min(1.0, dt * 14.0);
      this.smoothedMid += (rawMid - this.smoothedMid) * Math.min(1.0, dt * 10.0);
      this.smoothedHigh += (rawHigh - this.smoothedHigh) * Math.min(1.0, dt * 16.0);
      this.smoothedLevel += (rawLevel - this.smoothedLevel) * Math.min(1.0, dt * 12.0);

      bassPulse = this.smoothedBass;
      midSwirl = this.smoothedMid;
      highShimmer = this.smoothedHigh;
      audioGlow = this.smoothedLevel;

      // Dynamic Beat / Hand-clap / Kick Ripple Shockwave
      if (rawBass > 0.42 && (rawBass - this.smoothedBass) > 0.12 && (time - this.lastAudioBeatTime > 0.28)) {
        this.lastAudioBeatTime = time;
        this.shockwaves.push({
          origin: new THREE.Vector3(0, 0, 0),
          radius: 0.2,
          maxRadius: 36.0,
          speed: 38.0,
          strength: 24.0 * rawBass,
        });
      }
    } else {
      this.smoothedBass *= 0.88;
      this.smoothedMid *= 0.88;
      this.smoothedHigh *= 0.88;
      this.smoothedLevel *= 0.88;
    }

    // Dynamic point size pulse with audio
    if (this.material && this.isAudioReactive) {
      const sizeMultiplier = 1.0 + this.smoothedBass * 0.4 + this.smoothedHigh * 0.25;
      this.material.size = this.config.size * sizeMultiplier;
    }

    let totalKineticEnergy = 0;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let px = this.positions[i3];
      let py = this.positions[i3 + 1];
      let pz = this.positions[i3 + 2];

      let vx = this.velocities[i3];
      let vy = this.velocities[i3 + 1];
      let vz = this.velocities[i3 + 2];

      const tx = this.targetPositions[i3];
      const ty = this.targetPositions[i3 + 1];
      const tz = this.targetPositions[i3 + 2];

      // 1. Manifold Restitution force (lerp / spring towards active topology)
      const diffX = tx - px;
      const diffY = ty - py;
      const diffZ = tz - pz;

      vx += diffX * morphSpeed * effectiveMorph * dt;
      vy += diffY * morphSpeed * effectiveMorph * dt;
      vz += diffZ * morphSpeed * effectiveMorph * dt;

      // 2. 3D Curl Noise Turbulence field
      if (effectiveNoise > 0.005) {
        const freq = 0.08;
        const phase = time * 0.8 + i * 0.002;
        const nx = Math.sin(py * freq + phase) * Math.cos(pz * freq);
        const ny = Math.cos(px * freq + phase) * Math.sin(pz * freq);
        const nz = Math.sin(px * freq + phase) * Math.cos(py * freq);

        vx += nx * effectiveNoise * 12.0 * dt;
        vy += ny * effectiveNoise * 12.0 * dt;
        vz += nz * effectiveNoise * 12.0 * dt;
      }

      // 2b. Microphone Audio Forces (Volumetric Bass Pulse, Mid Swirl, High Shimmer)
      if (bassPulse > 0.03) {
        const pDist = Math.sqrt(px * px + py * py + pz * pz) + 0.1;
        const radialBass = bassPulse * 16.0 * Math.max(0.1, 1.0 - pDist / 38.0);
        vx += (px / pDist) * radialBass * dt;
        vy += (py / pDist) * radialBass * dt;
        vz += (pz / pDist) * radialBass * dt;
      }

      if (midSwirl > 0.04) {
        const swirlPower = midSwirl * 8.0;
        vx += -py * 0.08 * swirlPower * dt;
        vy += px * 0.08 * swirlPower * dt;
        vz += Math.sin(time * 6.0 + px * 0.25) * swirlPower * 0.3 * dt;
      }

      if (highShimmer > 0.05) {
        const jitter = highShimmer * 5.0;
        vx += (Math.random() - 0.5) * jitter * dt;
        vy += (Math.random() - 0.5) * jitter * dt;
        vz += (Math.random() - 0.5) * jitter * dt;
      }

      // 3. Mouse 3D Gravitational / Kinetic Field
      if (mouseActive) {
        const dx = px - mouseX;
        const dy = py - mouseY;
        const dz = pz - mouseZ;
        const distSq = dx * dx + dy * dy + dz * dz + 0.5;
        const dist = Math.sqrt(distSq);

        if (dist < 18.0) {
          const falloff = (1.0 - dist / 18.0);

          switch (this.interactionMode) {
            case 'attract': {
              // Gravitational well singularity
              const force = (gravity * 45.0 * falloff) / (dist + 0.8);
              vx -= (dx / dist) * force * dt;
              vy -= (dy / dist) * force * dt;
              vz -= (dz / dist) * force * dt;
              break;
            }
            case 'repel': {
              // High velocity repulsor shield
              const force = (gravity * 65.0 * falloff);
              vx += (dx / dist) * force * dt;
              vy += (dy / dist) * force * dt;
              vz += (dz / dist) * force * dt;
              break;
            }
            case 'vortex': {
              // 3D angular swirl around mouse axis
              const swirlSpeed = gravity * 38.0 * falloff;
              // Angular vector cross product
              vx += -dy * (swirlSpeed / dist) * dt;
              vy += dx * (swirlSpeed / dist) * dt;
              vz += Math.sin(dist * 2 - time * 6) * swirlSpeed * 0.4 * dt;
              break;
            }
            case 'wave': {
              // Ripple shock oscillation
              const wave = Math.sin(dist * 1.5 - time * 8) * gravity * 35.0 * falloff;
              vx += (dx / dist) * wave * dt;
              vy += (dy / dist) * wave * dt;
              vz += wave * 0.5 * dt;
              break;
            }
          }
        }
      }

      // 4. Damping & Integration
      vx *= Math.pow(damping, dt * 60);
      vy *= Math.pow(damping, dt * 60);
      vz *= Math.pow(damping, dt * 60);

      px += vx * dt;
      py += vy * dt;
      pz += vz * dt;

      this.positions[i3] = px;
      this.positions[i3 + 1] = py;
      this.positions[i3 + 2] = pz;

      this.velocities[i3] = vx;
      this.velocities[i3 + 1] = vy;
      this.velocities[i3 + 2] = vz;

      const speedSq = vx * vx + vy * vy + vz * vz;
      totalKineticEnergy += speedSq;

      // Dynamic color lerp towards target with bounded kinetic excitation & audio luminescence
      const speedNorm = Math.min(1.0, Math.sqrt(speedSq) * 0.12);
      const colSpeed = 4.0 * dt;
      const baseBright = this.config.brightness ?? 0.7;
      const bright = baseBright * (1.0 + audioGlow * 0.45 + highShimmer * 0.35);

      const targetR = Math.min(1.0, this.targetColors[i3] * bright + speedNorm * 0.06);
      const targetG = Math.min(1.0, this.targetColors[i3 + 1] * bright + speedNorm * 0.05);
      const targetB = Math.min(1.0, this.targetColors[i3 + 2] * bright + speedNorm * 0.1);

      this.colors[i3] += (targetR - this.colors[i3]) * colSpeed;
      this.colors[i3 + 1] += (targetG - this.colors[i3 + 1]) * colSpeed;
      this.colors[i3 + 2] += (targetB - this.colors[i3 + 2]) * colSpeed;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // Send spatial modulation values to generative audio synthesizer
    if (this.onAudioModulation) {
      const avgKinetic = Math.min(1.0, totalKineticEnergy / (count * 1.5));
      const spatialEntropy = Math.min(1.0, this.config.noiseStrength * 0.8 + (mouseActive ? 0.3 : 0));
      this.onAudioModulation(this.normalizedMouseX, avgKinetic, spatialEntropy);
    }
  }

  private updateShockwaves(dt: number): void {
    if (this.shockwaves.length === 0) return;

    const count = this.config.count;

    for (let s = this.shockwaves.length - 1; s >= 0; s--) {
      const sw = this.shockwaves[s];
      sw.radius += sw.speed * dt;

      if (sw.radius > sw.maxRadius) {
        this.shockwaves.splice(s, 1);
        continue;
      }

      const waveRadius = sw.radius;
      const waveThick = 2.4;
      const ox = sw.origin.x;
      const oy = sw.origin.y;
      const oz = sw.origin.z;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const dx = this.positions[i3] - ox;
        const dy = this.positions[i3 + 1] - oy;
        const dz = this.positions[i3 + 2] - oz;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const deltaR = Math.abs(d - waveRadius);
        if (deltaR < waveThick) {
          const factor = (1.0 - deltaR / waveThick) * (1.0 - waveRadius / sw.maxRadius);
          const impulse = (sw.strength * factor) / Math.max(1, d);

          this.velocities[i3] += (dx / Math.max(0.1, d)) * impulse;
          this.velocities[i3 + 1] += (dy / Math.max(0.1, d)) * impulse;
          this.velocities[i3 + 2] += (dz / Math.max(0.1, d)) * impulse;
        }
      }
    }
  }

  private emitTelemetry(): void {
    if (!this.onTelemetryUpdate) return;

    let energySum = 0;
    const count = this.config.count;
    // Sample a subset for performance
    const step = 20;
    for (let i = 0; i < count; i += step) {
      const i3 = i * 3;
      const vx = this.velocities[i3];
      const vy = this.velocities[i3 + 1];
      const vz = this.velocities[i3 + 2];
      energySum += vx * vx + vy * vy + vz * vz;
    }

    const kineticEnergy = Math.min(100, Math.round((energySum / (count / step)) * 8));
    const entropy = Math.min(100, Math.round(this.config.noiseStrength * 70 + (this.isInteracting ? 25 : 5)));

    this.onTelemetryUpdate({
      fps: this.currentFps,
      particleCount: count,
      kineticEnergy,
      spatialEntropy: entropy,
      activeHarmonic: this.config.topology.toUpperCase().replace('_', ' '),
      fieldSingularities: this.shockwaves.length + (this.interactionMode !== 'none' ? 1 : 0),
    });
  }

  public takeScreenshot(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  public setParticleSize(newSize: number): void {
    this.config.size = newSize;
    if (this.material) {
      this.material.size = newSize;
    }
  }

  public setBlendingMode(mode: 'normal' | 'additive'): void {
    this.config.blendMode = mode;
    if (this.material) {
      const isNormal = mode === 'normal';
      this.material.blending = isNormal ? THREE.NormalBlending : THREE.AdditiveBlending;
      const baseOpacity = isNormal ? 0.95 : 0.42;
      const brightness = this.config.brightness ?? 0.7;
      this.material.opacity = THREE.MathUtils.clamp(baseOpacity * brightness, 0.1, 1.0);
      this.material.needsUpdate = true;
    }
  }

  public setBrightness(brightness: number): void {
    this.config.brightness = brightness;
    if (this.material) {
      const isNormal = this.config.blendMode === 'normal';
      const baseOpacity = isNormal ? 0.95 : 0.42;
      this.material.opacity = THREE.MathUtils.clamp(baseOpacity * brightness, 0.1, 1.0);
      this.material.needsUpdate = true;
    }
  }

  public dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    this.geometry?.dispose();
    this.material?.dispose();
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
