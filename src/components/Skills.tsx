import React, { useState } from 'react';
import { Terminal, Database, LineChart, Cpu, Wrench, CheckCircle2 } from 'lucide-react';
import { SkillsConstellation3D } from './3d/SkillsConstellation3D';
import { usePortfolio } from '../context/PortfolioContext';

export const Skills: React.FC = () => {
  const { data } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedSkill, setSelectedSkill] = useState<string | null>('Python');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('PROGRAMMING & ANALYSIS');

  const categoryIcons: Record<string, React.ElementType> = {
    'PROGRAMMING & ANALYSIS': Terminal,
    'BI & TOOLS': LineChart,
    'DATA CONCEPTS': Database,
    'MACHINE LEARNING': Cpu,
    'OTHER': Wrench,
  };

  const handleSelectSkill = (skill: string, category: string) => {
    setSelectedSkill(skill);
    setSelectedSkillCategory(category);
  };

  const categories = [
    'ALL',
    'PROGRAMMING & ANALYSIS',
    'BI & TOOLS',
    'DATA CONCEPTS',
    'MACHINE LEARNING',
    'OTHER',
  ];

  return (
    <section id="skills" className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              02 // COMPETENCIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              SKILLS &amp; TECHNOLOGIES
            </h2>
            <div className="h-0.5 w-16 bg-cyan-500/80 mt-3" />
          </div>

          <p className="text-sm text-slate-300 max-w-md">
            Interactive 3D network mapping core tools across programming, business intelligence, data concepts, machine learning, and automation.
          </p>
        </div>

        {/* Category Filter Controls */}
        <div className="flex items-center gap-2 p-1.5 bg-[#080d19] border border-slate-800 rounded-xl overflow-x-auto mb-8 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {cat === 'ALL' ? 'ALL SKILLS' : cat}
            </button>
          ))}
        </div>

        {/* 3D Visualizer & Skill Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3D Constellation Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <SkillsConstellation3D
              selectedSkill={selectedSkill}
              onSelectSkill={handleSelectSkill}
              activeCategory={activeCategory}
            />

            {/* Currently Selected Skill Callout */}
            {selectedSkill && (
              <div className="p-4 bg-[#090e1c] border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-slate-400">Selected Technology:</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {selectedSkill}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-slate-400">Category:</div>
                  <div className="text-cyan-300 font-semibold mt-0.5">
                    {selectedSkillCategory}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Grouped Skills List by Category (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {data.skills
              .filter((group) => activeCategory === 'ALL' || group.title === activeCategory)
              .map((group) => {
                const Icon = categoryIcons[group.title] || Terminal;
                return (
                  <div
                    key={group.id}
                    className="p-5 rounded-xl bg-[#080d19]/90 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-2.5 mb-3.5 pb-2 border-b border-slate-800">
                      <div className="p-1 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-mono font-bold text-slate-200 tracking-wider">
                        {group.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => {
                        const isSelected = selectedSkill?.toLowerCase() === skill.toLowerCase();
                        return (
                          <button
                            key={skill}
                            onClick={() => handleSelectSkill(skill, group.title)}
                            className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all text-left ${
                              isSelected
                                ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-sm'
                                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};
