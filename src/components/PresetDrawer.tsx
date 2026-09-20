import React, { useState, useRef } from 'react';
import { Preset, ParticleConfig, AudioConfig } from '../types';
import { Bookmark, Sparkles, Plus, Trash2, Download, Upload, X, Check, Globe } from 'lucide-react';

interface PresetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  masterPresets: Preset[];
  userPresets: Preset[];
  onApplyPreset: (preset: Preset) => void;
  onSaveCurrentPreset: (name: string, description: string) => void;
  onDeleteUserPreset: (id: string) => void;
  onExportPresets: () => void;
  onImportPresets: (file: File) => void;
  activePresetId?: string;
}

export const PresetDrawer: React.FC<PresetDrawerProps> = ({
  isOpen,
  onClose,
  masterPresets,
  userPresets,
  onApplyPreset,
  onSaveCurrentPreset,
  onDeleteUserPreset,
  onExportPresets,
  onImportPresets,
  activePresetId,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveCurrentPreset(name.trim(), description.trim());
    setName('');
    setDescription('');
    setIsCreating(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportPresets(e.target.files[0]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      id="preset-drawer-overlay"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="preset-drawer-content"
        className="bg-gray-900 border-l border-cyan-500/30 w-full max-w-md h-full p-5 sm:p-6 shadow-2xl text-white flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-100">Universe Presets</h3>
                <p className="text-xs text-gray-400">Curated master cosmologies & saved states</p>
              </div>
            </div>

            <button
              id="close-preset-drawer-btn"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              aria-label="Close Presets"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar: Create Custom & Export/Import */}
          <div className="flex items-center gap-2 mt-4">
            <button
              id="open-save-preset-dialog-btn"
              onClick={() => setIsCreating(!isCreating)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition shadow-md shadow-cyan-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>Save Current Cosmos</span>
            </button>

            <button
              id="export-presets-btn"
              onClick={onExportPresets}
              title="Export all presets as JSON"
              className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              id="import-presets-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Import presets from JSON"
              className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />
          </div>

          {/* Creation Form */}
          {isCreating && (
            <form
              onSubmit={handleSave}
              className="mt-3 p-3.5 rounded-xl bg-gray-950/80 border border-cyan-500/30 space-y-2.5 animate-fadeIn"
            >
              <div>
                <label className="text-[11px] text-gray-400 font-medium">Preset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Violet Singularity Drift"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 font-medium">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. High vortex speed with celestial drone"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-2.5 py-1 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium"
                >
                  Save Preset
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Presets List */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 custom-scrollbar">
          {/* Section: Master Presets */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400/80 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Curated Master Cosmologies
            </div>

            <div className="space-y-2">
              {masterPresets.map((preset) => {
                const isActive = activePresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    id={`preset-card-${preset.id}`}
                    onClick={() => onApplyPreset(preset)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/50 border-cyan-500 shadow-md shadow-cyan-900/30'
                        : 'bg-gray-950/60 border-gray-800 hover:border-gray-700 hover:bg-gray-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                        {preset.name}
                        {isActive && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                        {preset.particleConfig?.topology}
                      </span>
                    </div>
                    {preset.description && (
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                        {preset.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: User Saved Presets */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400/80 mb-2 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" />
              Your Custom Cosmologies ({userPresets.length})
            </div>

            {userPresets.length === 0 ? (
              <div className="p-4 rounded-xl bg-gray-950/40 border border-gray-800/60 text-center text-xs text-gray-500">
                No custom presets saved yet. Click "Save Current Cosmos" above to save your physics, colors, and audio setup!
              </div>
            ) : (
              <div className="space-y-2">
                {userPresets.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      id={`user-preset-card-${preset.id}`}
                      className={`p-3 rounded-xl border transition flex items-center justify-between ${
                        isActive
                          ? 'bg-cyan-950/50 border-cyan-500'
                          : 'bg-gray-950/60 border-gray-800 hover:border-gray-700 hover:bg-gray-800/40'
                      }`}
                    >
                      <div
                        onClick={() => onApplyPreset(preset)}
                        className="flex-1 cursor-pointer pr-2"
                      >
                        <div className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                          {preset.name}
                          {isActive && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        {preset.description && (
                          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                            {preset.description}
                          </p>
                        )}
                      </div>

                      <button
                        id={`delete-user-preset-btn-${preset.id}`}
                        onClick={() => onDeleteUserPreset(preset.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition shrink-0"
                        title="Delete custom preset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-gray-800/80 text-center text-[11px] text-gray-500">
          Cosmological states persist in local storage and JSON backups
        </div>
      </div>
    </div>
  );
};
