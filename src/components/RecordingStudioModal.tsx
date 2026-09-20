import React, { useState } from 'react';
import { RecordingState } from '../types';
import { Video, Camera, Square, Play, Pause, Download, X, Film, CheckCircle2 } from 'lucide-react';

interface RecordingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordingState: RecordingState;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onStopRecording: () => void;
  onCaptureSnapshot: (multiplier?: number) => void;
}

export const RecordingStudioModal: React.FC<RecordingStudioModalProps> = ({
  isOpen,
  onClose,
  recordingState,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
  onCaptureSnapshot,
}) => {
  const [snapshotMultiplier, setSnapshotMultiplier] = useState<number>(2);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSnapshot = () => {
    onCaptureSnapshot(snapshotMultiplier);
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2500);
  };

  return (
    <div
      id="recording-studio-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        id="recording-studio-card"
        className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-recording-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
          aria-label="Close Studio"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-100">Capture & Recording Studio</h3>
            <p className="text-xs text-gray-400">High-definition WebM video & 4K still frame exporter</p>
          </div>
        </div>

        {/* Section 1: Live Video Recording */}
        <div className="mt-5 p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-gray-200">Live Video Capture</span>
            </div>

            {recordingState.isRecording && (
              <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-800/80">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[11px] font-mono text-red-300 font-medium">
                  REC {formatDuration(recordingState.duration)}
                </span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Records smooth 60fps canvas animation synchronized with harmonic spatial audio into WebM format.
          </p>

          <div className="flex items-center gap-2 pt-1">
            {!recordingState.isRecording ? (
              <button
                id="start-recording-btn"
                onClick={onStartRecording}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition shadow-lg shadow-red-900/30"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
                Start Video Recording
              </button>
            ) : (
              <>
                {recordingState.isPaused ? (
                  <button
                    id="resume-recording-btn"
                    onClick={onResumeRecording}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Resume
                  </button>
                ) : (
                  <button
                    id="pause-recording-btn"
                    onClick={onPauseRecording}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition border border-gray-700"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    Pause
                  </button>
                )}

                <button
                  id="stop-save-recording-btn"
                  onClick={onStopRecording}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-lg shadow-emerald-900/30"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  Stop & Download
                </button>
              </>
            )}
          </div>
        </div>

        {/* Section 2: High Resolution Still Snapshot */}
        <div className="mt-4 p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-gray-200">Ultra-HD Snapshot</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-900 p-0.5 rounded-lg border border-gray-800">
              <button
                id="snapshot-scale-1x-btn"
                onClick={() => setSnapshotMultiplier(1)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                  snapshotMultiplier === 1
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                1x View
              </button>
              <button
                id="snapshot-scale-2x-btn"
                onClick={() => setSnapshotMultiplier(2)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                  snapshotMultiplier === 2
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                2x Ultra 4K
              </button>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Instant lossless PNG render preserving current camera angle, particle lighting, and color palette.
          </p>

          <button
            id="capture-snapshot-btn"
            onClick={handleSnapshot}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition shadow-lg shadow-cyan-900/30"
          >
            {snapshotTaken ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Captured & Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Capture {snapshotMultiplier === 2 ? '4K Ultra PNG' : 'Direct Frame'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
