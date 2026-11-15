import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { MessagesProvider } from './context/MessagesContext';
import { BackgroundDataGrid } from './components/3d/BackgroundDataGrid';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Education } from './components/Education';
import { Certifications } from './components/Certifications';
import { ResumeCTA } from './components/ResumeCTA';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { EditModal } from './components/EditModal';
import { MessagesInboxModal } from './components/MessagesInboxModal';
import { X } from 'lucide-react';

function PortfolioContent() {
  const { isEditMode, setIsEditMode } = usePortfolio();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 3D Ambient Particle Background */}
      <BackgroundDataGrid />

      {/* Floating Edit Banner when Edit Mode is active */}
      {isEditMode && (
        <div className="fixed bottom-5 right-5 z-40 bg-amber-950/95 border border-amber-500/60 text-amber-200 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Edit Mode Active (Changes Auto-Saved)</span>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-2.5 py-1 bg-amber-900/80 hover:bg-amber-800 text-white rounded border border-amber-600 transition-colors cursor-pointer"
          >
            Customizer Form
          </button>
          <button
            onClick={() => setIsEditMode(false)}
            className="p-1 text-amber-300 hover:text-white rounded cursor-pointer"
            title="Exit edit mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onOpenResume={() => setIsResumeModalOpen(true)}
        onOpenEditModal={() => setIsEditModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero onOpenResume={() => setIsResumeModalOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <ResumeCTA onOpenResume={() => setIsResumeModalOpen(true)} />
        <Contact onOpenResume={() => setIsResumeModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <MessagesInboxModal />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <MessagesProvider>
        <PortfolioContent />
      </MessagesProvider>
    </PortfolioProvider>
  );
}
