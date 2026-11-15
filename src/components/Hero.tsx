import React, { useState } from 'react';
import { ArrowDown, FileText, Github, Linkedin, Mail, Check, ExternalLink } from 'lucide-react';
import { HeroAnalytics3D } from './3d/HeroAnalytics3D';
import { usePortfolio } from '../context/PortfolioContext';
import { downloadResume } from '../utils/downloadResume';

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const { data, isEditMode, updatePersonal } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleResumeClick = () => {
    downloadResume();
    onOpenResume();
  };

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Text & Actions (col-span-7) */}
          <div className="lg:col-span-7 space-y-6 z-10">
            {/* Status indicator */}
            <div className="flex items-center gap-2.5 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-semibold">Available for Entry-Level Data Analyst Roles</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">MCA Candidate</span>
            </div>

            {/* Main Headings */}
            <div className="space-y-1.5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display uppercase">
                {data.personal.name}
              </h1>

              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono tracking-tight">
                {data.personal.professionalTitle}
              </div>

              <div className="text-base sm:text-lg font-medium text-indigo-400 font-mono tracking-wider">
                {data.personal.secondaryTitle}
              </div>
            </div>

            {/* Hero Description */}
            <div className="max-w-2xl">
              {isEditMode ? (
                <textarea
                  value={data.personal.heroDescription}
                  onChange={(e) => updatePersonal({ heroDescription: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-900 border border-cyan-500 rounded p-2 text-sm text-slate-200"
                />
              ) : (
                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed text-balance">
                  {data.personal.heroDescription}
                </p>
              )}
            </div>

            {/* Core Tech Stack indicators (Unboxed, strictly zero fake percentages) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 pt-1">
              <span className="text-slate-400">Core Tools:</span>
              <span className="text-cyan-300">Python</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-300">SQL</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-300">Power BI</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-300">Excel</span>
              <span className="text-slate-600">·</span>
              <span className="text-indigo-300">Machine Learning Basics</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="px-6 py-3 text-xs font-mono font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all duration-150 flex items-center gap-2 shadow-lg shadow-cyan-950/40 active:translate-y-0.5 tracking-wider"
              >
                <span>VIEW PROJECTS</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <button
                onClick={handleResumeClick}
                className="px-6 py-3 text-xs font-mono font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 rounded-lg transition-all duration-150 flex items-center gap-2 active:translate-y-0.5 tracking-wider cursor-pointer"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>DOWNLOAD RESUME</span>
              </button>
            </div>

            {/* Social Links: LinkedIn, GitHub, Email */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-300">
              <span className="text-slate-400 uppercase tracking-wider">Connect:</span>

              <a
                href={data.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4 text-cyan-400" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={data.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4 text-indigo-400" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${data.personal.email}`}
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                  title="Direct Email"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>{data.personal.email}</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Copy email address"
                >
                  {copiedEmail ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    'Copy'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Visualization (col-span-5) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg bg-[#080d19]/80 border border-slate-800 rounded-2xl p-2 shadow-2xl backdrop-blur-md overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  3D Analytics Dashboard &amp; Nodes
                </span>
                <span className="text-[11px] text-slate-400">WebGL Interactive</span>
              </div>

              <HeroAnalytics3D />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
