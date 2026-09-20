import React, { useState } from 'react';
import { Sparkles, X, Wand2, Compass, Music, Atom, Play, BookmarkCheck, ArrowRight, Loader2 } from 'lucide-react';
import { GeminiUniverseSynthesis, ParticleConfig, AudioConfig, InteractionMode, CameraMode } from '../types';

interface GeminiCosmicOracleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyUniverse: (synthesis: GeminiUniverseSynthesis) => void;
  onSaveAsPreset: (name: string, description: string, synthesis: GeminiUniverseSynthesis) => void;
}

const INSPIRATION_PROMPTS = [
  'Bioluminescent deep-sea abyssal jellyfish with tranquil pentatonic waves',
  'Kerr rotating black hole with relativistic accretion disk and dorian drone',
  'Cybernetic neural network firing with high-voltage neon yellow sparks',
  'Solar flare corona eruption with hyper-dimensional magnetic twists',
  'Calabi-Yau compactified 6D manifold with celestial ambient resonance',
  'Sacred geometry Metatron cube folding through quantum spatial entropy',
];

export const GeminiCosmicOracleModal: React.FC<GeminiCosmicOracleModalProps> = ({
  isOpen,
  onClose,
  onApplyUniverse,
  onSaveAsPreset,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [result, setResult] = useState<GeminiUniverseSynthesis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);

  if (!isOpen) return null;

  const handleSynthesize = async (promptToUse?: string) => {
    const text = (promptToUse || prompt).trim();
    if (!text) return;

    setIsSynthesizing(true);
    setError(null);
    setHasSaved(false);

    try {
      const res = await fetch('/api/gemini/synthesize-universe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: GeminiUniverseSynthesis = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Failed to synthesize universe:', err);
      setError('Connection disrupted. Retrying with local cosmological synthesis engine.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApplyUniverse(result);
    onClose();
  };

  const handleSave = () => {
    if (!result) return;
    onSaveAsPreset(result.name, result.lore, result);
    setHasSaved(true);
  };

  return (
    <div
      id="gemini-oracle-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gemini-oracle-title"
    >
      <div
        id="gemini-oracle-modal-card"
        className="bg-gray-950 border border-cyan-500/40 rounded-3xl w-full max-w-2xl p-6 sm:p-7 shadow-[0_0_60px_rgba(6,182,212,0.25)] text-white relative max-h-[90vh] overflow-y-auto custom-scrollbar ring-1 ring-cyan-400/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-gemini-oracle-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800/80 transition cursor-pointer"
          aria-label="Close Gemini Oracle"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-gray-800/90">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-purple-600/30 text-cyan-300 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="gemini-oracle-title" className="text-lg font-bold text-gray-100 font-sans tracking-tight">
                Gemini AI Cosmic Oracle
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Generative AI topological synthesis & spatial soundscape architect
            </p>
          </div>
        </div>

        {/* Prompt Input Section */}
        <div className="mt-5 space-y-3">
          <label htmlFor="gemini-prompt-input" className="block text-xs font-mono font-medium text-cyan-300 uppercase tracking-wider">
            Cosmic Prompt & Vision
          </label>
          <div className="relative">
            <textarea
              id="gemini-prompt-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe a universe, feeling, or scientific concept (e.g. 'A pulsating neon cybernetic jellyfish with high frequency waves')..."
              className="w-full px-4 py-3 bg-gray-900/90 border border-gray-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 rounded-2xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none transition resize-none custom-scrollbar font-sans"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSynthesize();
                }
              }}
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <span className="text-[11px] font-mono text-gray-500 hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-400">Ctrl+Enter</kbd> to synthesize
            </span>
            <button
              id="synthesize-universe-btn"
              onClick={() => handleSynthesize()}
              disabled={isSynthesizing || !prompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-gray-950 font-semibold text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {isSynthesizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Quantum Fields...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Materialize with Gemini AI</span>
                </>
              )}
            </button>
          </div>

          {/* Inspiration Seeds */}
          <div className="pt-2">
            <span className="text-[11px] font-mono text-gray-400 block mb-2">
              Inspire your imagination:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {INSPIRATION_PROMPTS.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setPrompt(sample);
                    handleSynthesize(sample);
                  }}
                  className="text-left px-2.5 py-1 rounded-xl bg-gray-900/80 hover:bg-cyan-950/40 hover:border-cyan-500/50 border border-gray-800 text-[11px] text-gray-300 hover:text-cyan-200 transition cursor-pointer truncate max-w-full"
                >
                  ✨ {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Notice if any */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200">
            {error}
          </div>
        )}

        {/* Generated Universe Card */}
        {result && (
          <div
            id="gemini-universe-result-card"
            className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-cyan-500/50 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-200">
                    {result.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                    {result.particleConfig?.topology || 'Cosmic Superformula'}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-sans italic">
                  "{result.lore}"
                </p>
              </div>
            </div>

            {/* Spec Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-800/80 font-mono text-[11px]">
              <div className="p-2 rounded-xl bg-gray-950/80 border border-gray-800">
                <span className="text-gray-500 block text-[10px]">COLOR THEME</span>
                <span className="text-cyan-300 font-semibold capitalize">
                  {result.particleConfig?.colorTheme?.replace('_', ' ') || 'Nebula'}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-gray-950/80 border border-gray-800">
                <span className="text-gray-500 block text-[10px]">HARMONIC SCALE</span>
                <span className="text-purple-300 font-semibold capitalize">
                  {result.audioConfig?.scale || 'Celestial'}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-gray-950/80 border border-gray-800">
                <span className="text-gray-500 block text-[10px]">FORCE FIELD</span>
                <span className="text-emerald-300 font-semibold capitalize">
                  {result.interactionMode || 'Vortex'}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-gray-950/80 border border-gray-800">
                <span className="text-gray-500 block text-[10px]">PARTICLES</span>
                <span className="text-amber-300 font-semibold">
                  {(result.particleConfig?.count || 45000).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Execution Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                id="save-gemini-preset-btn"
                type="button"
                onClick={handleSave}
                disabled={hasSaved}
                className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>{hasSaved ? 'Saved to Presets' : 'Save as Preset'}</span>
              </button>

              <button
                id="apply-gemini-universe-btn"
                type="button"
                onClick={handleApply}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition cursor-pointer"
              >
                <span>Materialize Universe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
