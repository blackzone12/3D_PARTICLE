import React, { useEffect, useState } from 'react';
import { Music, Volume2, X, ArrowDown, ArrowUp, Sparkles } from 'lucide-react';

interface SynesthesiaKeyboardProps {
  onPlayNote: (noteIndex: number) => void;
  scaleName: string;
  isOpen: boolean;
  onToggle: () => void;
  isAudioEnabled: boolean;
  onEnableAudio: () => void;
}

const NOTES_METADATA = [
  { note: 'Do', label: '1', key: '1', color: 'from-blue-500/30 to-cyan-500/40', border: 'border-cyan-500/50' },
  { note: 'Re', label: '2', key: '2', color: 'from-cyan-500/30 to-teal-500/40', border: 'border-teal-500/50' },
  { note: 'Mi', label: '3', key: '3', color: 'from-teal-500/30 to-emerald-500/40', border: 'border-emerald-500/50' },
  { note: 'Fa', label: '4', key: '4', color: 'from-emerald-500/30 to-lime-500/40', border: 'border-lime-500/50' },
  { note: 'Sol', label: '5', key: '5', color: 'from-amber-500/30 to-orange-500/40', border: 'border-amber-500/50' },
  { note: 'La', label: '6', key: '6', color: 'from-rose-500/30 to-pink-500/40', border: 'border-pink-500/50' },
  { note: 'Ti', label: '7', key: '7', color: 'from-purple-500/30 to-violet-500/40', border: 'border-purple-500/50' },
  { note: "Do'", label: '8', key: '8', color: 'from-indigo-500/30 to-cyan-500/40', border: 'border-cyan-400/60' },
];

export const SynesthesiaKeyboard: React.FC<SynesthesiaKeyboardProps> = ({
  onPlayNote,
  scaleName,
  isOpen,
  onToggle,
  isAudioEnabled,
  onEnableAudio,
}) => {
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [position, setPosition] = useState<'top' | 'bottom'>(() => {
    try {
      return (localStorage.getItem('aetheria_synth_pos') as 'top' | 'bottom') || 'top';
    } catch {
      return 'top';
    }
  });

  // Switch position and remember in localStorage
  const handleTogglePosition = () => {
    const nextPos = position === 'top' ? 'bottom' : 'top';
    setPosition(nextPos);
    try {
      localStorage.setItem('aetheria_synth_pos', nextPos);
    } catch {}
  };

  // Keyboard shortcut listener for keys 1 through 8
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= 8) {
        e.preventDefault();
        const noteIdx = keyNum - 1;
        setActiveNote(noteIdx);
        onPlayNote(noteIdx);
        setTimeout(() => setActiveNote(null), 250);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayNote]);

  const handleTrigger = (idx: number) => {
    if (!isAudioEnabled) {
      onEnableAudio();
    }
    setActiveNote(idx);
    onPlayNote(idx);
    setTimeout(() => setActiveNote(null), 250);
  };

  // If closed, unmount cleanly so no orphaned button sits in between other UI menus
  if (!isOpen) {
    return null;
  }

  const positionClasses =
    position === 'top'
      ? 'top-16 sm:top-20'
      : 'bottom-28 sm:bottom-32';

  return (
    <div
      id="synesthesia-keyboard-container"
      className={`fixed ${positionClasses} left-1/2 -translate-x-1/2 z-30 max-w-xl w-[94vw] sm:w-auto transition-all duration-300 pointer-events-auto`}
    >
      <div
        id="synesthesia-keyboard-panel"
        className="bg-gray-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl p-3 sm:p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-white ring-1 ring-cyan-500/20"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-800/90 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0">
              <Music className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-gray-100 flex items-center gap-1.5 flex-wrap">
                <span>Harmonic Synth Keys</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                  {scaleName}
                </span>
                <span className="text-[9px] font-mono text-gray-400 hidden md:inline">
                  [Keys 1–8]
                </span>
              </h4>
              <p className="text-[10px] text-gray-400 truncate hidden sm:block">
                Trigger resonant polyphonic tones & light kinetic shockwaves
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!isAudioEnabled && (
              <button
                id="enable-audio-prompt-btn"
                onClick={onEnableAudio}
                className="px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] rounded-lg font-mono flex items-center gap-1 hover:bg-amber-500/30 transition cursor-pointer"
                title="Enable Web Audio Synthesizer"
              >
                <Volume2 className="w-3 h-3" />
                <span className="hidden sm:inline">Enable Sound</span>
              </button>
            )}

            {/* Position Switcher: Top Ribbon vs Bottom Docked */}
            <button
              id="switch-keyboard-position-btn"
              onClick={handleTogglePosition}
              className="px-2 py-1 text-[10px] font-mono text-cyan-300 bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 rounded-lg flex items-center gap-1 transition cursor-pointer"
              title={
                position === 'top'
                  ? 'Move Harmonic Keys to Bottom Dock'
                  : 'Move Harmonic Keys to Top Ribbon'
              }
            >
              {position === 'top' ? (
                <>
                  <ArrowDown className="w-3 h-3 text-cyan-400" />
                  <span className="hidden sm:inline">Dock Bottom</span>
                </>
              ) : (
                <>
                  <ArrowUp className="w-3 h-3 text-cyan-400" />
                  <span className="hidden sm:inline">Dock Top</span>
                </>
              )}
            </button>

            {/* Close / Dismiss button */}
            <button
              id="close-synesthesia-keyboard-btn"
              onClick={onToggle}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
              title="Close Harmonic Keys (Shortcut: K)"
              aria-label="Close Harmonic Keys"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 8-Key Visual Surface */}
        <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
          {NOTES_METADATA.map((meta, idx) => {
            const isActive = activeNote === idx;
            return (
              <button
                key={meta.note}
                id={`piano-key-${idx + 1}`}
                onClick={() => handleTrigger(idx)}
                className={`relative flex flex-col items-center justify-between py-2.5 sm:py-3.5 px-1 sm:px-2.5 rounded-xl border transition-all duration-150 select-none cursor-pointer min-h-[52px] sm:min-h-[62px] active:scale-90 ${
                  isActive
                    ? `scale-95 bg-gradient-to-t ${meta.color} ${meta.border} shadow-[0_0_18px_rgba(6,182,212,0.9)]`
                    : `bg-gray-900/90 hover:bg-gray-800/90 border-gray-700/80 hover:${meta.border}`
                }`}
                title={`Play note ${meta.note} (${meta.key})`}
              >
                <span className="text-[10px] font-mono text-gray-400 font-bold">{meta.key}</span>
                <div
                  className={`w-1.5 h-1.5 rounded-full my-1 transition-all ${
                    isActive ? 'bg-white scale-150 shadow-[0_0_8px_white]' : 'bg-gray-600'
                  }`}
                />
                <span
                  className={`text-xs font-semibold font-mono ${
                    isActive ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  {meta.note}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
