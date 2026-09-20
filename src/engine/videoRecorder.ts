import { RecordingState } from '../types';

export class UniverseVideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private canvas: HTMLCanvasElement;
  private audioDestination: MediaStreamAudioDestinationNode | null = null;
  private timerInterval: number | null = null;
  private durationSeconds = 0;
  private isPaused = false;
  private onStateChange?: (state: RecordingState) => void;

  constructor(
    canvas: HTMLCanvasElement,
    audioDestination: MediaStreamAudioDestinationNode | null,
    onStateChange?: (state: RecordingState) => void
  ) {
    this.canvas = canvas;
    this.audioDestination = audioDestination;
    this.onStateChange = onStateChange;
  }

  public setAudioDestination(dest: MediaStreamAudioDestinationNode | null) {
    this.audioDestination = dest;
  }

  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof (this.canvas as any).captureStream === 'function' &&
      typeof window.MediaRecorder !== 'undefined'
    );
  }

  public start(): boolean {
    if (!this.isSupported()) {
      console.warn('Canvas captureStream or MediaRecorder is not supported in this browser.');
      return false;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      return false;
    }

    this.recordedChunks = [];
    this.durationSeconds = 0;
    this.isPaused = false;

    try {
      // 1. Capture 60fps canvas stream
      const canvasStream = (this.canvas as any).captureStream(60) as MediaStream;

      // 2. Combine with audio stream if available
      const combinedTracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];
      if (this.audioDestination && this.audioDestination.stream) {
        const audioTracks = this.audioDestination.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          combinedTracks.push(audioTracks[0]);
        }
      }

      const combinedStream = new MediaStream(combinedTracks);

      // 3. Negotiate supported mime type
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ];
      let selectedMime = '';
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      const options: MediaRecorderOptions = selectedMime ? { mimeType: selectedMime } : {};
      this.mediaRecorder = new MediaRecorder(combinedStream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.finishAndDownload();
      };

      // Request data in 1000ms timeslices for safety
      this.mediaRecorder.start(1000);

      // Start duration timer
      this.timerInterval = window.setInterval(() => {
        if (!this.isPaused) {
          this.durationSeconds++;
          this.notifyState();
        }
      }, 1000);

      this.notifyState();
      return true;
    } catch (err) {
      console.error('Failed to start MediaRecorder:', err);
      return false;
    }
  }

  public pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.isPaused = true;
      this.notifyState();
    }
  }

  public resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.isPaused = false;
      this.notifyState();
    }
  }

  public stop(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    this.notifyState(false);
  }

  private finishAndDownload(): void {
    if (this.recordedChunks.length === 0) return;

    const mime = this.mediaRecorder?.mimeType || 'video/webm';
    const blob = new Blob(this.recordedChunks, { type: mime });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    a.download = `aetheria-performance-${dateStr}.webm`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 200);

    this.recordedChunks = [];
  }

  private notifyState(active: boolean = true): void {
    if (this.onStateChange) {
      this.onStateChange({
        isRecording: active && this.mediaRecorder?.state !== 'inactive',
        duration: this.durationSeconds,
        isPaused: this.isPaused,
      });
    }
  }

  public dispose(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;
    this.recordedChunks = [];
  }
}
