import React from 'react';
import { AccessibilityConfig } from '../types';
import { Eye, ShieldAlert, Zap, Keyboard, X, Check, Activity } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AccessibilityConfig;
  onChange: (config: AccessibilityConfig) => void;
  isLowFpsDetected?: boolean;
  onAutoOptimize?: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
  isLowFpsDetected,
  onAutoOptimize,
}) => {
  if (!isOpen) return null;

  const toggleReducedMotion = () => {
    onChange({ ...config, reducedMotion: !config.reducedMotion });
  };

  const toggleHighContrast = () => {
    onChange({ ...config, highContrast: !config.highContrast });
  };

  const toggleScreenReaderMode = () => {
    onChange({ ...config, screenReaderMode: !config.screenReaderMode });
  };

  return (
    <div
      id="accessibility-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        id="accessibility-modal-card"
        className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl text-white relative max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-accessibility-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
          aria-label="Close Accessibility Settings"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-100">Accessibility & Assistive Tuning</h3>
            <p className="text-xs text-gray-400">Sensory sensitivity, contrast, and navigation controls</p>
          </div>
        </div>

        {/* Low FPS Advisory if detected */}
        {isLowFpsDetected && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-amber-300">GPU Frame Rate Warning</h4>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  The rendering frame rate dropped below 30 FPS. You can auto-optimize particle count and shaders for smooth playback.
                </p>
              </div>
            </div>
            {onAutoOptimize && (
              <button
                id="auto-optimize-fps-btn"
                onClick={onAutoOptimize}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-semibold rounded-lg shrink-0 transition"
              >
                Optimize
              </button>
            )}
          </div>
        )}

        {/* Toggles */}
        <div className="mt-5 space-y-3">
          {/* Reduced Motion */}
          <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 flex items-center justify-between">
            <div className="space-y-0.5 max-w-[80%]">
              <div className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                Reduced Motion Mode (Vestibular Safe)
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Damps violent shockwaves, disables autonomous camera drift, and softens velocity fluctuations.
              </p>
            </div>
            <button
              id="toggle-reduced-motion-btn"
              onClick={toggleReducedMotion}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                config.reducedMotion ? 'bg-cyan-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  config.reducedMotion ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* High Contrast */}
          <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 flex items-center justify-between">
            <div className="space-y-0.5 max-w-[80%]">
              <div className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                High-Contrast Mode (WCAG AAA)
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Applies bold contrasting borders, high luminance particle colors, and dark pitch canvas for maximum visibility.
              </p>
            </div>
            <button
              id="toggle-high-contrast-btn"
              onClick={toggleHighContrast}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                config.highContrast ? 'bg-cyan-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  config.highContrast ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Screen Reader & Touch Target Boost */}
          <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 flex items-center justify-between">
            <div className="space-y-0.5 max-w-[80%]">
              <div className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Enlarged Touch Targets (48px+)
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Expands button interactive paddings and highlights focus outlines for easier mobile and stylus control.
              </p>
            </div>
            <button
              id="toggle-screen-reader-btn"
              onClick={toggleScreenReaderMode}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                config.screenReaderMode ? 'bg-cyan-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  config.screenReaderMode ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Keyboard Navigation Reference Guide */}
        <div className="mt-5 p-4 rounded-xl bg-gray-950/80 border border-gray-800">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
            <Keyboard className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-semibold text-gray-200">Keyboard Navigation Map</h4>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-gray-400">Keys 1 – 8</span>
              <span className="font-mono text-cyan-300">Play Synesthesia Notes</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-gray-400">Spacebar</span>
              <span className="font-mono text-cyan-300">Supernova Shockwave</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-gray-400">Key M</span>
              <span className="font-mono text-cyan-300">Mute / Audio Toggle</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-gray-400">Key R</span>
              <span className="font-mono text-cyan-300">Reset Camera Orbit</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-gray-400">Key C</span>
              <span className="font-mono text-cyan-300">Cinematic Drift</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-gray-400">Key Q</span>
              <span className="font-mono text-cyan-300">Quantum Fluctuation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
