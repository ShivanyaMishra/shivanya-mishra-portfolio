import React from 'react';
import { Calendar, Building2, CheckCircle2, TrendingUp, Layers, FileSpreadsheet } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Experience: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="experience" className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              03 // TIMELINE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="h-0.5 w-16 bg-cyan-500/80 mt-3" />
          </div>

          <p className="text-sm text-slate-300 max-w-md">
            Hands-on technical roles spanning automated data tooling, analytics internships, and operational reporting.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l border-slate-800 ml-3 sm:ml-6 pl-6 sm:pl-8 space-y-12">
          {data.experience.map((item, index) => (
            <div key={item.id} className="relative group">
              {/* Timeline Node Point */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#070a14] border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors shadow-sm shadow-cyan-500/50" />

              <div className="p-6 sm:p-8 rounded-2xl bg-[#080d19]/90 border border-slate-800 hover:border-slate-700 transition-all space-y-5">
                {/* Header: Title, Company, Period */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                        EXPERIENCE 0{index + 1}
                      </span>
                      {item.process && (
                        <span className="text-[11px] font-mono text-slate-400">
                          · {item.process}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                      {item.title}
                    </h3>
                    <div className="text-sm font-semibold text-slate-300 flex items-center gap-1.5 mt-1 font-mono">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      <span>{item.company}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full self-start sm:self-center">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.period}</span>
                  </div>
                </div>

                {/* Responsibilities list */}
                <div className="space-y-2.5">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Key Responsibilities &amp; Outcomes:
                  </div>
                  <ul className="space-y-2.5 text-sm text-slate-300">
                    {item.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Experience 01: Subtle Data-Pipeline Animation Indicator */}
                {item.type === 'pipeline' && (
                  <div className="pt-3 border-t border-slate-800/80">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-800/30 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>Pipeline Architecture:</span>
                        <span className="text-cyan-300">CSV Ingestion → Python/Pandas Rules → OpenPyXL Automation</span>
                      </span>
                      <span className="text-emerald-400 font-semibold">50% Manual Effort Reduction</span>
                    </div>
                  </div>
                )}

                {/* Experience 02: Animated Dashboard / Analytics Visual Indicator */}
                {item.type === 'dashboard' && (
                  <div className="pt-3 border-t border-slate-800/80">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-indigo-800/30 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Reporting Analytics:</span>
                        <span className="text-indigo-300">Expense Tracker Engine · SQL Validation · Budget Tracking</span>
                      </span>
                      <span className="text-emerald-400 font-semibold">30% Accuracy Improvement</span>
                    </div>
                  </div>
                )}

                {/* Experience 03: Operational Reporting Indicator */}
                {item.type === 'operational' && (
                  <div className="pt-3 border-t border-slate-800/80">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-2">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Operational Focus:</span>
                        <span className="text-slate-300">MS Excel Tracking · Incident Records · SLA Adherence</span>
                      </span>
                      <span className="text-cyan-400">Accurate Audit Logging</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
