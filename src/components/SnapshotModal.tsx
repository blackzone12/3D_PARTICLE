import React from 'react';
import { Download, X, Check } from 'lucide-react';

interface SnapshotModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `aetheria-3d-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="hud-glass p-4 rounded-2xl max-w-2xl w-full border border-cyan-500/40 shadow-2xl space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-sm font-semibold text-slate-100 font-mono">
              3D High-Res Frame Captured
            </span>
          </div>
          <button
            id="close-snapshot-btn"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-700 max-h-[60vh] flex items-center justify-center bg-slate-950">
          <img
            src={imageUrl}
            alt="3D Particle Render Snapshot"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-1">
          <button
            id="download-snapshot-btn"
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Download size={14} />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
