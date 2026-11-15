import React from 'react';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-slate-800 bg-[#05070d] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-display font-bold text-sm text-white tracking-wider">
              {data.personal.name}
            </div>
            <p className="text-slate-400 font-mono text-xs">
              Data Analyst | Aspiring Data Scientist
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a
              href={data.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500 transition-colors"
              title="LinkedIn"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <a
              href={data.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500 transition-colors"
              title="GitHub"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href={`mailto:${data.personal.email}`}
              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500 transition-colors"
              title="Email"
              aria-label="Send Direct Email"
            >
              <Mail className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors ml-2"
              title="Back to Top"
              aria-label="Scroll Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 text-center md:text-left text-slate-400 text-xs font-mono">
          © {new Date().getFullYear()} Shivanya Mishra. All rights reserved. Built with React, Three.js &amp; Tailwind CSS.
        </div>
      </div>
    </footer>
  );
};
