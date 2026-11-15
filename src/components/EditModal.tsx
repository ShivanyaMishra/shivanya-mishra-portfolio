import React, { useState } from 'react';
import { X, RotateCcw, Save, Check } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose }) => {
  const { data, updatePersonal, resetToDefault } = usePortfolio();
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#0b0f1a] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#080c14] border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Portfolio Customization Suite
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Live updates persist in your browser. Update fields anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {savedNotice && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Changes saved successfully to browser storage!</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-mono text-cyan-400 mb-1">Full Name:</label>
              <input
                type="text"
                value={data.personal.name}
                onChange={(e) => updatePersonal({ name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-cyan-400 mb-1">Professional Title:</label>
                <input
                  type="text"
                  value={data.personal.professionalTitle}
                  onChange={(e) => updatePersonal({ professionalTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-mono text-cyan-400 mb-1">Secondary Title:</label>
                <input
                  type="text"
                  value={data.personal.secondaryTitle}
                  onChange={(e) => updatePersonal({ secondaryTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-cyan-400 mb-1">Hero Description:</label>
              <textarea
                rows={2}
                value={data.personal.heroDescription}
                onChange={(e) => updatePersonal({ heroDescription: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-cyan-400 mb-1">Email Address:</label>
                <input
                  type="email"
                  value={data.personal.email}
                  onChange={(e) => updatePersonal({ email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-cyan-400 mb-1">Phone Number:</label>
                <input
                  type="text"
                  value={data.personal.phone}
                  onChange={(e) => updatePersonal({ phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-cyan-400 mb-1">GitHub Profile Link:</label>
                <input
                  type="url"
                  value={data.personal.github}
                  onChange={(e) => updatePersonal({ github: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block font-mono text-cyan-400 mb-1">LinkedIn Profile Link:</label>
                <input
                  type="url"
                  value={data.personal.linkedin}
                  onChange={(e) => updatePersonal({ linkedin: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-cyan-400 mb-1">
                Profile Photo Path or Image URL:
              </label>
              <input
                type="text"
                placeholder="/shivi.png or https://..."
                value={data.personal.profileImage || ''}
                onChange={(e) => updatePersonal({ profileImage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Set to <code className="text-cyan-300">/shivi.png</code> (when placed in the public folder) or any direct online image URL (e.g. from GitHub).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#080c14] border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Reset all portfolio entries to default initial values?')) {
                resetToDefault();
              }
            }}
            className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
