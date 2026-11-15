import React, { useState } from 'react';
import { X, Download, Printer, CheckCircle2, ChevronRight, FileCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { data } = usePortfolio();
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/Shivanya_Mishra_Resume.pdf');
      if (!response.ok) throw new Error('File fetch failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Shivanya_Mishra_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      // Fallback
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = '/Shivanya_Mishra_Resume.pdf';
      a.download = 'Shivanya_Mishra_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[94vh] h-[92vh] flex flex-col bg-[#070a12] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#050810] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs font-mono">
              <span className="text-white font-semibold">Shivanya_Mishra_Resume.pdf</span>
              <span className="text-slate-400 hidden sm:inline"> · 2 Pages (Latest Updated Version)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-mono font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print Resume or Save via Browser"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-1.5 text-xs font-mono font-semibold bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-950/60 cursor-pointer"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>DOWNLOADED!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloading ? 'PREPARING...' : 'DOWNLOAD RESUME'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              aria-label="Close resume preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Realistic PDF Page Viewer (Page 1 & Page 2) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 bg-[#04060b] flex flex-col items-center space-y-8 print:p-0 print:bg-white">
          
          {/* ==================== PAGE 1 ==================== */}
          <div className="w-full max-w-[760px] bg-white text-slate-900 rounded-sm shadow-2xl p-7 sm:p-10 md:p-12 font-serif text-[13px] leading-[1.4] border border-slate-200 relative print:border-0 print:shadow-none print:m-0 print:p-8">
            <div className="text-[10px] font-sans font-semibold tracking-widest uppercase text-slate-400 mb-3 print:hidden flex justify-between">
              <span>RESUME PREVIEW // PAGE 1 OF 2</span>
              <span className="text-emerald-600">● VERIFIED ATS-FORMATTED</span>
            </div>

            {/* Header: Name, Contact & Photo */}
            <div className="flex justify-between items-start gap-4 pb-3 border-b-2 border-slate-900">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black font-serif uppercase">
                  SHIVANYA MISHRA
                </h1>

                <div className="text-[12px] space-y-0.5 text-slate-800 font-sans">
                  <p><strong className="font-semibold text-black">Email:</strong> shivanyamishra84@gmail.com</p>
                  <p><strong className="font-semibold text-black">Phone:</strong> +91 8447402891</p>
                  <p><strong className="font-semibold text-black">LinkedIn:</strong> linkedin.com/in/shivanya-mishra</p>
                  <p><strong className="font-semibold text-black">GitHub:</strong> github.com/ShivanyaMishra</p>
                  <p><strong className="font-semibold text-black">Portfolio:</strong> shivanya-mishra-data-analyst-portfolio</p>
                </div>
              </div>

              {/* Portrait Photo in Top Right with neat border */}
              <div className="shrink-0">
                <img
                  src="/shivi.png"
                  alt="Shivanya Mishra"
                  className="w-20 sm:w-24 h-26 sm:h-30 object-cover rounded-sm border border-slate-400 shadow-sm"
                />
              </div>
            </div>

            {/* OBJECTIVE */}
            <div className="mt-4">
              <h2 className="text-[13px] font-bold tracking-wider text-black font-sans uppercase border-b border-slate-800 pb-0.5 mb-1.5">
                OBJECTIVE
              </h2>
              <p className="text-[12px] text-slate-800 text-justify leading-relaxed font-serif">
                Detail-oriented Data Analyst with hands-on experience in Python, SQL, Power BI, and Excel for data cleaning, data analysis, data validation, and dashboarding. Proven ability to automate data preparation and reporting workflows, track KPIs, perform exploratory data analysis (EDA), and deliver data-driven insights that support business decision-making.
              </p>
            </div>

            {/* SKILLS */}
            <div className="mt-4">
              <h2 className="text-[13px] font-bold tracking-wider text-black font-sans uppercase border-b border-slate-800 pb-0.5 mb-1.5">
                SKILLS
              </h2>
              <ul className="text-[12px] text-slate-800 space-y-1 pl-3 font-serif">
                <li className="list-disc">
                  <strong className="text-black font-semibold">Programming &amp; Analysis:</strong> Python (Pandas, NumPy, Matplotlib), SQL (MySQL, Joins, Aggregations, Subqueries, GROUP BY, CASE WHEN)
                </li>
                <li className="list-disc">
                  <strong className="text-black font-semibold">BI &amp; Tools:</strong> Power BI (DAX, Power Query, Data Modeling, Dashboards, Data Visualization), MS Excel (Pivot Tables, VLOOKUP, Data Validation, Data Visualization)
                </li>
                <li className="list-disc">
                  <strong className="text-black font-semibold">Data Analysis:</strong> Data Cleaning, Data Transformation, Data Validation, Data Quality, EDA, KPI Tracking, Reporting, Statistical Analysis
                </li>
                <li className="list-disc">
                  <strong className="text-black font-semibold">Data Visualization:</strong> Power BI Dashboards, Interactive Dashboards, Data Visualization, KPI Reporting
                </li>
                <li className="list-disc">
                  <strong className="text-black font-semibold">Machine Learning:</strong> Regression, Classification, Model Evaluation (Basics)
                </li>
              </ul>
            </div>

            {/* EDUCATION */}
            <div className="mt-4">
              <h2 className="text-[13px] font-bold tracking-wider text-black font-sans uppercase border-b border-slate-800 pb-0.5 mb-1.5">
                EDUCATION
              </h2>
              <div className="space-y-2 text-[12px] pl-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-black">• Master of Computer Applications (MCA)</span>
                    <div className="text-slate-700 pl-3">
                      Dr. Preeti Global University, Shivpuri, Madhya Pradesh, India
                    </div>
                  </div>
                  <span className="font-bold text-black font-sans">2023 – 2026</span>
                </div>

                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-black">• Bachelor of Arts (BA)</span>
                    <div className="text-slate-700 pl-3">
                      Chhatrapati Shahu Ji Maharaj University, Kanpur, India
                    </div>
                  </div>
                  <span className="font-bold text-black font-sans">2020 – 2023</span>
                </div>
              </div>
            </div>

            {/* PROFESSIONAL EXPERIENCE (Reverse Chronological) */}
            <div className="mt-4">
              <h2 className="text-[13px] font-bold tracking-wider text-black font-sans uppercase border-b border-slate-800 pb-0.5 mb-1.5">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-2.5 text-[12px] font-serif">
                {/* 1. Helpdesk Executive */}
                <div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-black">
                      Helpdesk Executive <span className="font-normal text-slate-700">| 1Point1 Solutions (ICEGATE Process)</span>
                    </span>
                    <span className="font-bold text-black font-sans">Feb 2026–Present</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-800 mt-0.5 space-y-0.5 pl-1">
                    <li>Resolved customer queries and service requests while maintaining accurate records of issues, interactions, and resolutions.</li>
                    <li>Tracked tickets, follow-ups, escalations, and resolution status to ensure timely issue closure and SLA adherence.</li>
                    <li>Maintained operational data using MS Excel and internal systems to support reporting, data accuracy, and performance tracking.</li>
                  </ul>
                </div>

                {/* 2. Data Tool Developer */}
                <div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-black">
                      Data Tool Developer <span className="font-normal text-slate-700">| Aashi Realty</span>
                    </span>
                    <span className="font-bold text-black font-sans">Jun 2025–Aug 2025</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-800 mt-0.5 space-y-0.5 pl-1">
                    <li>Automated data cleaning and reporting pipelines using Python (Pandas, openpyxl), reducing manual effort by 50%</li>
                    <li>Developed DataBook, a Python-based tool to clean and standardize messy CSV datasets</li>
                    <li>Built Power BI data visualization dashboards for YoY growth and pricing insights</li>
                    <li>Worked with business teams to define KPIs and improve reporting accuracy</li>
                  </ul>
                </div>

                {/* 3. Data Analyst Intern */}
                <div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-black">
                      Data Analyst Intern <span className="font-normal text-slate-700">| Limbhas &amp; Associates</span>
                    </span>
                    <span className="font-bold text-black font-sans">Nov 2024–Feb 2025</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-800 mt-0.5 space-y-0.5 pl-1">
                    <li>Prepared an Expense Tracker using Python and SQL for automated reporting</li>
                    <li>Performed data validation and analysis using Excel and SQL, improving accuracy by 30%</li>
                    <li>Created visual reports tracking project timelines, budget utilization, and resources</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* PROJECTS (Part 1 on Page 1) */}
            <div className="mt-4">
              <h2 className="text-[13px] font-bold tracking-wider text-black font-sans uppercase border-b border-slate-800 pb-0.5 mb-1.5">
                PROJECTS
              </h2>
              <div className="space-y-2 text-[12px] font-serif">
                <div>
                  <span className="font-bold text-black">
                    DataBook – Data Cleaning Tool
                  </span>{' '}
                  <span className="italic text-slate-700 font-sans text-[11px]">(Python, Pandas, NumPy, Openpyxl)</span>
                  <ul className="list-disc list-inside text-slate-800 mt-0.5 space-y-0.5 pl-1">
                    <li>Automated cleaning and standardization of CSV/TXT files</li>
                    <li>Reduced data preparation time by 70%</li>
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-black">
                    Real Estate Price Dashboard
                  </span>{' '}
                  <span className="italic text-slate-700 font-sans text-[11px]">(Power BI, MS Excel)</span>
                  <ul className="list-disc list-inside text-slate-800 mt-0.5 space-y-0.5 pl-1">
                    <li>Analyzed real estate data for 5 cities</li>
                    <li>Developed interactive dashboards showing price trends and YoY growth</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>


          {/* ==================== PAGE 2 ==================== */}
          <div className="w-full max-w-[760px] bg-white text-slate-900 rounded-sm shadow-2xl p-7 sm:p-10 md:p-12 font-serif text-[13px] leading-[1.4] border border-slate-200 relative print:border-0 print:shadow-none print:m-0 print:p-8">
            <div className="text-[10px] font-sans font-semibold tracking-widest uppercase text-slate-400 mb-3 print:hidden flex justify-between">
              <span>RESUME PREVIEW // PAGE 2 OF 2</span>
              <span className="text-cyan-600">● PROJECTS CONT. &amp; CERTIFICATIONS</span>
            </div>

            {/* PROJECTS CONTINUED */}
            <div className="space-y-3.5 text-[12px] font-serif">
              {/* Project 3: SCORPIO */}
              <div>
                <span className="font-bold text-black">
                  SCORPIO – AI Desktop Virtual Assistant
                </span>{' '}
                <span className="italic text-slate-700 font-sans text-[11px]">(Python, Flask, SpeechRecognition, NLP, Automation)</span>
                <ul className="list-disc list-inside text-slate-800 mt-1 space-y-1 pl-1">
                  <li>Built a Python-based voice-controlled desktop assistant that processes spoken commands to perform system operations, file management, web searches, internet-based tasks, and other automated actions.</li>
                  <li>Implemented SpeechRecognition and basic NLP-based command processing to interpret user instructions and execute predefined desktop and utility operations.</li>
                  <li>Integrated capabilities for basic conversational interaction, Google/web search, translation, and task automation through command-driven Python modules.</li>
                </ul>
              </div>

              {/* Project 4: AetherFinance */}
              <div>
                <span className="font-bold text-black">
                  AetherFinance – AI Personal Finance Tracker
                </span>{' '}
                <span className="italic text-slate-700 font-sans text-[11px]">(HTML, Tailwind CSS, JavaScript, Three.js, Gemini API, Python)</span>
                <ul className="list-disc list-inside text-slate-800 mt-1 space-y-1 pl-1">
                  <li>Developed a futuristic AI-powered personal finance application for expense tracking, spending analysis, budgeting, and savings management.</li>
                  <li>Integrated the Gemini API and Python to provide conversational financial assistance, personalized spending insights, money-saving tips, and analysis of high-spending categories and expenses.</li>
                  <li>Built interactive financial visualizations using Three.js and implemented budget tracking, savings goals, transaction analysis, and smart spending notifications.</li>
                  <li>Designed a responsive fintech interface using HTML, Tailwind CSS, and JavaScript with interactive dashboards and financial analytics.</li>
                </ul>
                <div className="mt-1 font-sans text-[11px] font-bold text-cyan-700">
                  Live: <a href="https://aetherfinance-app.ai.studio" target="_blank" rel="noopener noreferrer" className="hover:underline">aetherfinance-app.ai.studio</a>
                </div>
              </div>
            </div>

            {/* CERTIFICATIONS */}
            <div className="mt-6">
              <h2 className="text-[13px] font-bold tracking-wider text-black font-sans uppercase border-b border-slate-800 pb-0.5 mb-2">
                CERTIFICATIONS
              </h2>
              <ul className="list-disc list-inside text-[12px] text-slate-800 space-y-1 pl-1 font-serif">
                <li><strong className="text-black font-semibold">Data Analysis (Top 10%)</strong> – TestDome</li>
                <li><strong className="text-black font-semibold">Data Analysis (Top 25%)</strong> – TestDome</li>
                <li><strong className="text-black font-semibold">micro1 AI Interview Certification</strong> – Outstanding Performance</li>
                <li><strong className="text-black font-semibold">Advanced Excel for Job &amp; Real World</strong> – Udemy</li>
                <li><strong className="text-black font-semibold">Python Programming</strong> – Aptech Learning, Gurugram</li>
                <li><strong className="text-black font-semibold">Java Programming</strong> – Aptech Learning, Gurugram</li>
                <li><strong className="text-black font-semibold">Hands-On Python Data Science</strong> – Udemy</li>
              </ul>
            </div>

            {/* LANGUAGES */}
            <div className="mt-6">
              <h2 className="text-[13px] font-bold tracking-wider text-black font-sans uppercase border-b border-slate-800 pb-0.5 mb-2">
                LANGUAGES
              </h2>
              <div className="text-[12px] text-slate-800 pl-1 font-serif flex items-center gap-6">
                <span>• <strong className="text-black font-semibold">English</strong> (Professional)</span>
                <span>• <strong className="text-black font-semibold">Hindi</strong> (Professional)</span>
              </div>
            </div>

            {/* Footer stamp inside Page 2 */}
            <div className="mt-12 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500 font-sans">
              Shivanya Mishra · Professional Data Analyst &amp; Aspiring Data Scientist Portfolio
            </div>
          </div>

          {/* Quick Bottom Action within modal */}
          <div className="w-full max-w-[760px] flex items-center justify-between pb-6 text-xs font-mono text-slate-400">
            <span>Official Curriculum Vitae</span>
            <button
              onClick={handleDownloadPDF}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Download PDF Copy</span>
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
