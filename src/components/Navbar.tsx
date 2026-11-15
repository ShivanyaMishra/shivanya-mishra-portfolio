import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Edit3, Inbox } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useMessages } from '../context/MessagesContext';
import { downloadResume } from '../utils/downloadResume';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenEditModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenEditModal }) => {
  const { data, isEditMode, setIsEditMode } = usePortfolio();
  const { unreadCount, messages, setIsInboxOpen } = useMessages();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleResumeClick = () => {
    downloadResume();
    onOpenResume();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#home' },
    { name: 'ABOUT', href: '#about' },
    { name: 'SKILLS', href: '#skills' },
    { name: 'EXPERIENCE', href: '#experience' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'EDUCATION', href: '#education' },
    { name: 'CERTIFICATIONS', href: '#certifications' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#070a14]/95 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-xl shadow-black/30'
          : 'bg-transparent py-4 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Monogram: SM */}
          <a
            href="#home"
            className="flex items-center gap-2.5 text-white hover:text-cyan-400 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-xs text-cyan-300 group-hover:border-cyan-400 transition-colors shadow-sm">
              SM
            </div>
            <span className="font-display font-semibold tracking-wider text-sm hidden sm:inline text-slate-200">
              SHIVANYA MISHRA
            </span>
          </a>

          {/* Navigation links */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-mono font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-cyan-400 transition-colors tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Inbox / Received Messages Button */}
            <button
              onClick={() => setIsInboxOpen(true)}
              className="relative px-3 py-1.5 text-xs font-mono rounded bg-[#081224] hover:bg-cyan-950/80 text-cyan-300 hover:text-white border border-cyan-500/40 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="View Received Messages (Inbox)"
            >
              <Inbox className="w-3.5 h-3.5 text-cyan-400" />
              <span>INBOX</span>
              {unreadCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950 animate-pulse">
                  {unreadCount}
                </span>
              ) : (
                <span className="text-slate-400 text-[10px]">({messages.length})</span>
              )}
            </button>

            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-2.5 py-1.5 text-xs font-mono rounded transition-colors flex items-center gap-1.5 border cursor-pointer ${
                isEditMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
              title="Toggle Edit Mode"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Editing On' : 'Edit'}</span>
            </button>

            <button
              onClick={handleResumeClick}
              className="px-4 py-2 text-xs font-mono font-medium text-white bg-cyan-600 hover:bg-cyan-500 border border-cyan-500 rounded transition-all duration-150 flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>DOWNLOAD RESUME</span>
            </button>
          </div>

          {/* Mobile hamburger & quick actions */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setIsInboxOpen(true)}
              className="px-2 py-1 text-xs font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 rounded flex items-center gap-1"
              title="View Received Messages"
            >
              <Inbox className="w-3.5 h-3.5 text-cyan-400" />
              <span>{unreadCount > 0 ? unreadCount : messages.length}</span>
            </button>

            <button
              onClick={handleResumeClick}
              className="px-2.5 py-1 text-xs font-mono text-cyan-400 bg-slate-900 border border-slate-800 rounded flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CV</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070a14] border-b border-slate-800 px-4 pt-3 pb-5 space-y-1.5 mt-2">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsInboxOpen(true);
            }}
            className="w-full py-2.5 px-3 rounded text-xs font-mono bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 flex items-center justify-between mb-2"
          >
            <span className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold">VIEW RECEIVED MESSAGES</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500 text-slate-950">
              {unreadCount > 0 ? `${unreadCount} NEW` : `${messages.length} total`}
            </span>
          </button>

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-900"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleResumeClick();
              }}
              className="w-full py-2 text-xs font-mono font-medium text-center rounded bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>DOWNLOAD RESUME</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
