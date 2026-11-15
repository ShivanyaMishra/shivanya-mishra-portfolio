import React from 'react';
import { Github, ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { DataCleaningPipeline3D } from './3d/DataCleaningPipeline3D';
import { RealEstateDashboard3D } from './3d/RealEstateDashboard3D';
import { AssistantCore3D } from './3d/AssistantCore3D';
import { AetherFinance3D } from './3d/AetherFinance3D';

export const Projects: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="projects" className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              04 // BUILT SOLUTIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              FEATURED PROJECTS
            </h2>
            <div className="h-0.5 w-16 bg-cyan-500/80 mt-3" />
          </div>

          <p className="text-sm text-slate-300 max-w-md">
            Production-grade implementations solving real data cleaning, multi-city business intelligence, and voice desktop automation challenges.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="space-y-12">
          {data.projects.map((project, idx) => (
            <div
              key={project.id}
              className="p-6 sm:p-10 rounded-2xl bg-[#080d19]/90 border border-slate-800 hover:border-slate-700 transition-all shadow-xl shadow-black/20"
            >
              {/* Top Row: Index & Name */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    PROJECT 0{idx + 1}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                    {project.name}
                  </h3>
                  <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                    {project.description}
                  </p>
                </div>

                {/* Technologies List (Unboxed, strict zero-pill discipline) */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 self-start">
                  <span className="text-slate-400 uppercase">Tech:</span>
                  {project.technologies.map((tech, tIdx) => (
                    <React.Fragment key={tech}>
                      <span className="text-cyan-300">{tech}</span>
                      {tIdx < project.technologies.length - 1 && (
                        <span className="text-slate-600">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Middle Row: Two-Column Problem vs Approach & Interactive 3D */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
                {/* Text breakdown (6 cols) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-mono uppercase tracking-wider text-rose-400 block font-semibold">
                      Problem:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {project.problem}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block font-semibold">
                      Approach:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {project.approach}
                    </p>
                  </div>

                  {/* Key Features (if present) */}
                  {project.keyFeatures && project.keyFeatures.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block font-semibold">
                        Key Features:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                        {project.keyFeatures.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5">
                            <span className="text-cyan-400 shrink-0">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Result */}
                  <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-slate-200">
                      <strong className="text-cyan-300 font-semibold font-mono">Key Result: </strong>
                      <span>{project.keyResult}</span>
                    </div>
                  </div>
                </div>

                {/* 3D Visualizer (6 cols) */}
                <div className="lg:col-span-6">
                  {project.type === 'pipeline' && <DataCleaningPipeline3D />}
                  {project.type === 'dashboard' && <RealEstateDashboard3D />}
                  {project.type === 'assistant' && <AssistantCore3D />}
                  {project.type === 'fintech' && <AetherFinance3D />}
                </div>
              </div>

              {/* Bottom Row: Actions */}
              <div className="pt-6 mt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-xs font-mono font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5 text-cyan-400" />
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ) : (
                    <span className="text-xs font-mono text-slate-400">
                      Repository available on request
                    </span>
                  )}

                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-xs font-mono font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{project.demoLabel || 'Live Demo'}</span>
                    </a>
                  ) : (
                    <span className="px-3 py-2 text-xs font-mono text-slate-300 bg-slate-900/60 border border-slate-800/80 rounded-lg flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{project.demoLabel || 'Live Demo: Local Tool Execution'}</span>
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-slate-400">
                  {project.footerNote || 'Verified Data & Engineering Implementation'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
