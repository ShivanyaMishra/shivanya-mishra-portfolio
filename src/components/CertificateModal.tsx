import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Award } from 'lucide-react';
import { Certificate } from '../data/certificates';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
}) => {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setZoom(1);
  }, [certificate]);

  // Handle ESC key press
  useEffect(() => {
    if (!certificate) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [certificate, onClose]);

  if (!certificate) return null;

  const currentFile = certificate.file || certificate.image;

  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.25, 0.6));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setZoom(1);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentFile) return;
    const link = document.createElement('a');
    link.href = currentFile;
    link.download = `${certificate.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Certificate`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose(e);
        }
      }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[94vh] flex flex-col bg-[#090d18] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-[#070b14] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/50 text-cyan-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                {certificate.title}
              </h3>
              <div className="text-xs font-mono text-cyan-400">
                {certificate.issuer} {certificate.distinction ? `· ${certificate.distinction}` : ''}
              </div>
            </div>
          </div>

          {/* Action & Zoom Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 px-2 select-none">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors ml-0.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-mono font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center gap-1.5 transition-colors"
              title="Download certificate"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DOWNLOAD</span>
            </button>

            {/* Close Button in Header */}
            <button
              type="button"
              onClick={handleClose}
              className="px-2.5 py-1.5 text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg flex items-center gap-1 transition-colors ml-1 cursor-pointer"
              aria-label="Close certificate modal"
            >
              <X className="w-4 h-4 text-cyan-400" />
              <span>CLOSE</span>
            </button>
          </div>
        </div>

        {/* Modal Body / Large Preview Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#050811] min-h-[380px] sm:min-h-[500px]">
          <div
            className="relative max-w-full transition-transform duration-150 ease-out flex items-center justify-center"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            <img
              src={currentFile}
              alt={`${certificate.title} – ${certificate.issuer}`}
              className="max-h-[72vh] w-auto object-contain rounded-xl border border-slate-800 shadow-2xl bg-white"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Modal Footer info with Close Button */}
        <div className="px-5 py-3 bg-[#070b14] border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Press ESC or click outside to return to Certifications</span>
          <button
            type="button"
            onClick={handleClose}
            className="px-3 py-1.5 text-xs font-mono font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-cyan-400" />
            <span>CLOSE PREVIEW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
