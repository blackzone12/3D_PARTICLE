import { AudioConfig } from '../types';

// Musical scale frequency ratios based on fundamental root
const SCALES = {
  celestial: [1, 9/8, 5/4, 3/2, 5/3, 15/8, 2], // Major Lydian resonance
  dorian: [1, 9/8, 6/5, 4/3, 3/2, 5/3, 9/5, 2],
  lydian: [1, 9/8, 5/4, 45/32, 3/2, 5/3, 15/8, 2],
  akebono: [1, 9/8, 6/5, 3/2, 8/5, 2], // Japanese enigmatic pentatonic
  cosmic_pentatonic: [1, 9/8, 81/64, 3/2, 27/16, 2],
};

export class KineticAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private panner: StereoPannerNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;

  // Drone oscillators
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  // Microphone analysis
  private micStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private freqData: Uint8Array | null = null;

  private isRunning: boolean = false;
  private lastArpTime: number = 0;
  private config: AudioConfig;

  constructor(initialConfig: AudioConfig) {
    this.config = initialConfig;
  }

  public async init(): Promise<void> {
    if (this.ctx) return;

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.config.enabled ? this.config.volume : 0, this.ctx.currentTime);

    // Spatial Panner
    this.panner = this.ctx.createStereoPanner();

    // Warm Lowpass Filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    // Cosmic Space Delay Network
    this.delayNode = this.ctx.createDelay(1.0);
    this.delayNode.delayTime.setValueAtTime(0.38, this.ctx.currentTime);
    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.setValueAtTime(0.45, this.ctx.currentTime);

    // Connect Delay loop
    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);
    this.delayFeedback.connect(this.masterGain);

    // Routing
    this.filter.connect(this.panner);
    this.panner.connect(this.masterGain);
    this.panner.connect(this.delayNode);
    this.masterGain.connect(this.ctx.destination);

    // Setup Continuous Ambient Drone
    this.startDrone();
    this.isRunning = true;
  }

  private startDrone(): void {
    if (!this.ctx || !this.filter) return;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    const rootFreq = this.config.droneFrequency || 65.41; // C2 deep warm tone

    // Osc 1: Soft Sine sub-bass
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(rootFreq, this.ctx.currentTime);

    // Osc 2: Detuned Triangle warm harmonic
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(rootFreq * 1.501, this.ctx.currentTime); // Perfect fifth with gentle beating

    this.droneOsc1.connect(this.droneGain);
    this.droneOsc2.connect(this.droneGain);
    this.droneGain.connect(this.filter);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  public updateConfig(newConfig: Partial<AudioConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    if (this.config.enabled) {
      this.masterGain.gain.setTargetAtTime(this.config.volume, t, 0.05);
    } else {
      this.masterGain.gain.setTargetAtTime(0, t, 0.05);
    }

    if (this.droneOsc1 && this.droneOsc2 && newConfig.droneFrequency) {
      this.droneOsc1.frequency.setTargetAtTime(newConfig.droneFrequency, t, 0.1);
      this.droneOsc2.frequency.setTargetAtTime(newConfig.droneFrequency * 1.501, t, 0.1);
    }
  }

  /**
   * Modulate spatial audio dynamically from 3D particle state & mouse movement
   */
  public modulateFromKineticField(
    normalizedMouseX: number, // -1 to 1
    kineticEnergy: number,    // 0 to 1
    spatialEntropy: number    // 0 to 1
  ): void {
    if (!this.ctx || !this.isRunning || !this.config.enabled) return;

    const t = this.ctx.currentTime;

    // Pan audio according to 3D interaction center
    if (this.panner) {
      const targetPan = Math.max(-0.9, Math.min(0.9, normalizedMouseX));
      this.panner.pan.setTargetAtTime(targetPan, t, 0.1);
    }

    // Filter opening with kinetic excitement
    if (this.filter) {
      const baseFreq = 450 + kineticEnergy * 3500 + spatialEntropy * 1500;
      this.filter.frequency.setTargetAtTime(Math.min(8000, baseFreq), t, 0.08);
    }

    // Algorithmic Arpeggiator Trigger when kinetic energy peaks or user interacts
    const now = performance.now();
    const triggerInterval = Math.max(120, 480 - kineticEnergy * 320);
    if (now - this.lastArpTime > triggerInterval && kineticEnergy > 0.08) {
      this.lastArpTime = now;
      this.triggerHarmonicChime(kineticEnergy, spatialEntropy);
    }
  }

  /**
   * Trigger a crystalline generative chime
   */
  public triggerHarmonicChime(energy: number = 0.5, octaveShift: number = 0): void {
    if (!this.ctx || !this.filter || !this.config.enabled) return;

    const scale = SCALES[this.config.scale] || SCALES.celestial;
    const root = (this.config.droneFrequency || 65.41) * 4; // Mid-high register
    const noteRatio = scale[Math.floor(Math.random() * scale.length)];
    const octave = Math.pow(2, Math.floor(Math.random() * 3) + (octaveShift > 0.6 ? 1 : 0));
    const freq = root * noteRatio * octave;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = Math.random() > 0.4 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    // Subtle pitch envelope for glass-like attack
    osc.frequency.exponentialRampToValueAtTime(freq * 0.998, t + 0.3);

    const hitVolume = Math.min(0.22, 0.04 + energy * 0.18);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(hitVolume, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8 + energy * 0.6);

    osc.connect(gain);
    gain.connect(this.filter);

    osc.start(t);
    osc.stop(t + 1.5);
  }

  /**
   * Blast shockwave sound effect
   */
  public triggerShockwave(): void {
    if (!this.ctx || !this.filter || !this.config.enabled) return;
    const t = this.ctx.currentTime;

    // Sub drop oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.8);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(t);
    osc.stop(t + 1.0);
  }

  /**
   * Connect or disconnect real-time microphone input for audio reactivity
   */
  public async toggleMicrophone(enable: boolean): Promise<boolean> {
    if (!enable) {
      if (this.micStream) {
        this.micStream.getTracks().forEach((tr) => tr.stop());
        this.micStream = null;
      }
      this.analyser = null;
      this.freqData = null;
      return false;
    }

    try {
      if (!this.ctx) await this.init();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micStream = stream;

      const source = this.ctx!.createMediaStreamSource(stream);
      this.analyser = this.ctx!.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

      source.connect(this.analyser);
      // Analyser is not connected to output to prevent feedback
      return true;
    } catch (err) {
      console.warn('Microphone access unavailable or denied:', err);
      return false;
    }
  }

  /**
   * Sample microphone audio frequency bands (bass, mids, highs)
   */
  public getAudioReactivity(): { bass: number; mid: number; high: number; level: number } {
    if (!this.analyser || !this.freqData) {
      return { bass: 0, mid: 0, high: 0, level: 0 };
    }

    (this.analyser as AnalyserNode).getByteFrequencyData(this.freqData as any);
    const bins = this.freqData.length;
    let bSum = 0, mSum = 0, hSum = 0, tot = 0;

    const bEnd = Math.floor(bins * 0.12);
    const mEnd = Math.floor(bins * 0.5);

    for (let i = 0; i < bins; i++) {
      const v = this.freqData[i] / 255.0;
      tot += v;
      if (i < bEnd) bSum += v;
      else if (i < mEnd) mSum += v;
      else hSum += v;
    }

    return {
      bass: bSum / Math.max(1, bEnd),
      mid: mSum / Math.max(1, mEnd - bEnd),
      high: hSum / Math.max(1, bins - mEnd),
      level: tot / bins,
    };
  }

  public dispose(): void {
    if (this.micStream) {
      this.micStream.getTracks().forEach((tr) => tr.stop());
    }
    if (this.ctx) {
      this.ctx.close();
    }
    this.ctx = null;
    this.isRunning = false;
  }
}
