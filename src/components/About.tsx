import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { profileConfig } from '../config/profile';
import { Upload, Sparkles, UserCheck } from 'lucide-react';

export const About: React.FC = () => {
  const { data, updatePersonal } = usePortfolio();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [imgError, setImgError] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  // Active image priority:
  // 1. User configured in portfolio data (e.g. uploaded or custom URL)
  // 2. profileConfig.imageSrc (/shivi.png)
  const configuredSrc = data.personal.profileImage || profileConfig.imageSrc;

  // If primary image fails, try verified fallback, or trigger SVG badge
  const displaySrc = !imgError ? configuredSrc : (!fallbackFailed ? profileConfig.fallbackUrl : null);

  const handleSavePhoto = (dataUrl: string) => {
    updatePersonal({ profileImage: dataUrl });
    setImgError(false);
    setFallbackFailed(false);

    // Also persist directly to server filesystem if dev server middleware is available
    fetch('/api/upload-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: dataUrl }),
    }).catch(() => {
      // offline / static deployment fallback
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleSavePhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleSavePhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 3D Parallax tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Canvas ambient particles
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles = Array.from({ length: 22 }, () => ({
      x: Math.random() * 320,
      y: Math.random() * 420,
      radius: Math.random() * 1.5 + 0.5,
      speedY: Math.random() * 0.35 + 0.1,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section id="about" className="py-20 border-t border-slate-800/80 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT COLUMN: ~55% (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section Tag & Main Headings */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>PROFILE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-display tracking-tight uppercase">
                ABOUT ME
              </h2>

              <div className="h-0.5 w-16 bg-cyan-500/80 mt-2 mb-4" />

              <h3 className="text-xl sm:text-2xl font-semibold text-cyan-300 font-sans tracking-tight pt-1">
                Turning Data Into Meaningful Insights
              </h3>
            </div>

            {/* 4 Exact Paragraphs with Subtle Keyword Highlights */}
            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
              <p>
                I’m a Data Analyst with a strong foundation in{' '}
                <strong className="text-cyan-300 font-medium">Python</strong>,{' '}
                <strong className="text-cyan-300 font-medium">SQL</strong>,{' '}
                <strong className="text-cyan-300 font-medium">Excel</strong>,{' '}
                <strong className="text-cyan-300 font-medium">Power BI</strong>, and data visualization,
                passionate about turning raw and messy data into meaningful insights and actionable business decisions.
              </p>

              <p>
                I enjoy working across the data analytics lifecycle — from data cleaning and transformation to exploratory
                analysis, dashboard development, and insight generation. I’ve also worked on projects involving
                real-estate data automation, data parsing,{' '}
                <strong className="text-cyan-300 font-medium">GIS</strong> datasets, and interactive dashboards,
                giving me hands-on experience with real-world data challenges.
              </p>

              <p>
                Currently, I’m pursuing my MCA and continuously strengthening my skills in{' '}
                <strong className="text-cyan-300 font-medium">Python</strong>,{' '}
                <strong className="text-cyan-300 font-medium">Pandas</strong>,{' '}
                <strong className="text-cyan-300 font-medium">NumPy</strong>,{' '}
                <strong className="text-cyan-300 font-medium">SQL</strong>, statistics, and{' '}
                <strong className="text-indigo-300 font-medium">Machine Learning</strong>. My long-term goal is to grow
                into a <strong className="text-cyan-300 font-medium">Data Scientist</strong>, combining analytical
                thinking, technology, and business understanding to solve complex problems with data.
              </p>

              {/* Visually Emphasized Final Sentence */}
              <div className="pt-2">
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-transparent border-l-4 border-cyan-400 shadow-sm">
                  <p className="text-base sm:text-lg font-medium text-white italic tracking-wide font-display">
                    &ldquo;I don’t just want to analyze data — I want to understand the story behind it.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ~45% (5 cols on lg) - 3D Futuristic Glassmorphism Portrait Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className="relative w-full max-w-sm sm:max-w-md transition-transform duration-200 ease-out select-none"
              style={{
                perspective: '1000px',
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Backlight Soft Glow (Blue & Purple) */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/25 via-indigo-500/25 to-purple-600/25 rounded-3xl blur-2xl opacity-75 pointer-events-none" />

              {/* Glassmorphism Card Container */}
              <div className="relative rounded-2xl bg-[#080d19]/85 border border-cyan-500/40 p-5 sm:p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
                {/* Canvas for subtle floating particles */}
                <canvas
                  ref={particleCanvasRef}
                  width={340}
                  height={440}
                  className="absolute inset-0 pointer-events-none z-10 opacity-70"
                />

                {/* Top Holographic Header Bar */}
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-800 text-xs font-mono relative z-20">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="font-semibold tracking-wider">PROFILE IDENTIFIER</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2 py-0.5 text-[10px] font-mono text-cyan-400 hover:text-white bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 rounded transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                      title="Upload or change shivi.png"
                    >
                      <Upload className="w-3 h-3 text-cyan-400" />
                      <span>Attach Photo</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Futuristic Vertical Framing Container for Portrait */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-xl overflow-hidden border ${
                    isDragging ? 'border-cyan-400 scale-[1.01]' : 'border-cyan-400/40'
                  } bg-slate-950/90 shadow-2xl group cursor-pointer transition-all min-h-[320px] flex items-center justify-center`}
                  title="Click or drag & drop your photo here"
                >
                  {/* Holographic corner brackets */}
                  <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
                  <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
                  <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
                  <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

                  {/* Profile Image or Cybernetic Data Badge Fallback */}
                  {displaySrc ? (
                    <img
                      src={displaySrc}
                      alt="Shivanya Mishra - Profile"
                      onError={() => {
                        if (!imgError) {
                          setImgError(true);
                        } else {
                          setFallbackFailed(true);
                        }
                      }}
                      className="w-full h-auto object-cover object-center rounded-lg transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      loading="eager"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    /* Futuristic Data Analyst Badge (No fake AI faces) */
                    <div className="w-full aspect-[3/4] p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-900/90 via-[#070b16] to-[#040710] relative">
                      {/* Ambient grid lines */}
                      <div className="w-24 h-24 rounded-full border border-cyan-400/40 flex items-center justify-center relative mb-4 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                        <div className="w-20 h-20 rounded-full border border-dashed border-cyan-500/60 animate-spin" style={{ animationDuration: '18s' }} />
                        <span className="absolute font-display font-bold text-2xl text-cyan-300 tracking-wider">
                          SM
                        </span>
                      </div>

                      <div className="space-y-1.5 z-10">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-cyan-400">
                          <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>SHIVANYA MISHRA</span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                          Data Analyst // MCA Scholar
                        </p>
                      </div>

                      <div className="mt-4 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>Click to attach shivi.png</span>
                      </div>
                    </div>
                  )}

                  {/* Drag overlay hint */}
                  {isDragging && (
                    <div className="absolute inset-0 bg-cyan-950/80 backdrop-blur-sm z-30 flex items-center justify-center text-xs font-mono text-cyan-300 font-semibold border-2 border-dashed border-cyan-400">
                      Drop shivi.png here
                    </div>
                  )}
                </div>

                {/* Below Image Labels */}
                <div className="pt-4 text-center space-y-1 relative z-20">
                  <h4 className="text-lg font-bold text-white font-display tracking-wider">
                    SHIVANYA MISHRA
                  </h4>
                  <p className="text-xs font-mono font-medium text-cyan-400">
                    Data Analyst | Aspiring Data Scientist
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
