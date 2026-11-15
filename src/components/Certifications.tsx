import React, { useState, useRef } from 'react';
import { ShieldCheck, Eye } from 'lucide-react';
import { certificatesList, Certificate } from '../data/certificates';
import { CertificateModal } from './CertificateModal';

interface CertCardProps {
  cert: Certificate;
  index: number;
  onOpen: (cert: Certificate) => void;
}

const CertCard: React.FC<CertCardProps> = ({ cert, index, onOpen }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleClickOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpen(cert);
  };

  return (
    <div
      className="relative transition-transform duration-200 ease-out flex flex-col h-full"
      style={{
        perspective: '1000px',
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow on hover */}
      <div
        className={`absolute -inset-1 bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl blur-lg transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Certificate Card Content */}
      <div className="relative flex-1 p-5 rounded-2xl bg-[#080d19]/90 border border-slate-800 hover:border-cyan-500/60 transition-all flex flex-col justify-between space-y-4 shadow-xl shadow-black/30 backdrop-blur-md">
        <div className="space-y-3.5">
          {/* Top Index & Badge */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-cyan-400 font-bold">0{index + 1}</span>
            {cert.distinction && (
              <span className="px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-700/50 text-[10px] text-indigo-300">
                {cert.distinction}
              </span>
            )}
          </div>

          {/* Actual Certificate Thumbnail Box */}
          <div
            onClick={handleClickOpen}
            className="group/img relative w-full h-44 rounded-xl overflow-hidden bg-[#070b16] border border-slate-800 hover:border-cyan-400/50 transition-colors flex items-center justify-center cursor-pointer shadow-inner"
            title={`View ${cert.title}`}
          >
            <img
              src={cert.image}
              alt={`${cert.title} - ${cert.issuer}`}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/img:scale-105"
              loading="eager"
              referrerPolicy="no-referrer"
            />

            {/* Hover preview sheen */}
            <div className="absolute inset-0 bg-cyan-950/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-mono text-cyan-300 font-semibold backdrop-blur-[1px]">
              <Eye className="w-4 h-4" />
              <span>View Certificate</span>
            </div>
          </div>

          {/* Certificate Details */}
          <div>
            <h3 className="text-base font-bold text-white font-display leading-snug">
              {cert.title}
            </h3>
            <div className="text-xs font-mono text-cyan-400 mt-1">
              {cert.issuer} {cert.distinction ? `– ${cert.distinction}` : ''}
            </div>
            {cert.date && (
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Issued: {cert.date}
              </div>
            )}
          </div>
        </div>

        {/* Action Button: [ OPEN CERTIFICATE ] */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleClickOpen}
            className="w-full py-2.5 px-4 text-xs font-mono font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-cyan-600 border border-slate-700 hover:border-cyan-500 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-sm active:translate-y-0.5 group/btn cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:text-white transition-colors" />
            <span>OPEN CERTIFICATE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const Certifications: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const scrollPositionRef = useRef<number>(0);

  const handleOpenCert = (cert: Certificate) => {
    scrollPositionRef.current = window.scrollY;
    setSelectedCert(cert);
  };

  const handleCloseCert = () => {
    const savedY = scrollPositionRef.current;
    setSelectedCert(null);
    requestAnimationFrame(() => {
      if (typeof window !== 'undefined' && savedY > 0) {
        window.scrollTo({ top: savedY, behavior: 'instant' as ScrollBehavior });
      }
    });
  };

  return (
    <section id="certifications" className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              06 // CREDENTIALS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              CERTIFICATIONS
            </h2>
            <div className="h-0.5 w-16 bg-cyan-500/80 mt-3" />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-3 py-1.5 rounded-lg self-start">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Course &amp; Assessment Credentials</span>
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificatesList.map((cert, idx) => (
            <CertCard
              key={cert.id}
              cert={cert}
              index={idx}
              onOpen={handleOpenCert}
            />
          ))}
        </div>
      </div>

      {/* Large Lightbox Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={handleCloseCert}
      />
    </section>
  );
};
