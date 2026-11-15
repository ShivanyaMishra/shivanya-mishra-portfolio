import React from 'react';
import { X, Github, ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import { ProjectItem } from '../types/portfolio';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0f1d] border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>PROJECT CASE STUDY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            {project.name}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Technologies - Unboxed text with typographic separators */}
        <div className="pt-2 pb-3 border-y border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-slate-400 uppercase tracking-wider">Technologies:</span>
          {project.technologies.map((tech, i) => (
            <React.Fragment key={tech}>
              <span className="text-cyan-300">{tech}</span>
              {i < project.technologies.length - 1 && <span className="text-slate-600">/</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Problem vs Approach Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              The Problem
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Technical Approach
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.approach}
            </p>
          </div>
        </div>

        {/* Key Features if present */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Key Features
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
              {project.keyFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 shrink-0">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Result */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            Key Outcome &amp; Metric
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {project.keyResult}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Github className="w-4 h-4 text-cyan-400" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ) : (
              <span className="text-xs font-mono text-slate-400">
                GitHub: Repository Link on Request
              </span>
            )}

            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{project.demoLabel || 'Live Demo'}</span>
              </a>
            ) : (
              <span className="text-xs font-mono text-slate-300 px-3 py-2 rounded bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{project.demoLabel || 'Live Demo: Standalone Script / Dashboard File'}</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
