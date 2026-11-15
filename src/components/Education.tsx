import React from 'react';
import { GraduationCap, Calendar, MapPin, Building } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Education: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="education" className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              05 // ACADEMICS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              EDUCATION
            </h2>
            <div className="h-0.5 w-16 bg-cyan-500/80 mt-3" />
          </div>

          <p className="text-sm text-slate-300 max-w-md">
            Academic credentials in Computer Applications and Arts.
          </p>
        </div>

        {/* Education Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.education.map((edu, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-[#080d19]/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                    DEGREE 0{idx + 1}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{edu.period}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-display">
                  {edu.degree}
                </h3>
                <div className="text-sm font-semibold text-slate-300 mt-1 font-mono flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>{edu.institution}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{edu.location}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Languages section from resume */}
        <div className="mt-8 p-5 rounded-xl bg-[#080d19]/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Languages:
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-200">
            {data.personal.languages.map((lang, lIdx) => (
              <span key={lIdx} className="text-cyan-300 font-medium">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
