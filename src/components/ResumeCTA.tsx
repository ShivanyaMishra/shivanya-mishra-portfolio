import React from 'react';
import { FileText, Download, CheckCircle2 } from 'lucide-react';
import { downloadResume } from '../utils/downloadResume';

interface ResumeCTAProps {
  onOpenResume: () => void;
}

export const ResumeCTA: React.FC<ResumeCTAProps> = ({ onOpenResume }) => {
  const handleClick = () => {
    downloadResume();
    onOpenResume();
  };
  return (
    <section className="py-16 border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0a1020] via-[#080d19] to-[#060912] border border-cyan-500/30 p-8 sm:p-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <FileText className="w-4 h-4" />
                <span>OFFICIAL CURRICULUM VITAE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
                Download My Resume
              </h2>

              <p className="text-base text-slate-300 leading-relaxed">
                Interested in my experience and projects? View or download my resume.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> ATS-Formatted
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Print &amp; PDF Export
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 100% Verified Information
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <button
                onClick={handleClick}
                className="px-8 py-4 text-xs font-mono font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all duration-150 flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-950/50 active:translate-y-0.5 tracking-wider cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD CV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
