import { PortfolioData } from '../types/portfolio';

export const initialPortfolioData: PortfolioData = {
  personal: {
    name: 'SHIVANYA MISHRA',
    professionalTitle: 'DATA ANALYST',
    secondaryTitle: 'ASPIRING DATA SCIENTIST',
    heroDescription:
      'Detail-oriented Data Analyst with hands-on experience in Python, SQL, Power BI, and Excel for data cleaning, analysis, and dashboarding.',
    aboutHeading: 'Turning Data Into Meaningful Insights',
    aboutParagraph1:
      'I am a detail-oriented Data Analyst with hands-on experience in Python, SQL, Power BI, and Excel. My work focuses on data cleaning, analysis, dashboarding, KPI tracking, reporting, and automation.',
    aboutParagraph2:
      'Alongside analytics, I am developing my foundation in Machine Learning, including regression, classification, and model evaluation.',
    careerDirection: 'Currently building toward a career in Data Analytics and Data Science.',
    email: 'shivanyamishra84@gmail.com',
    phone: '+91 8447402891',
    location: 'India',
    linkedin: 'https://linkedin.com/in/shivanya-mishra',
    github: 'https://github.com/ShivanyaMishra',
    profileImage: '/shivi.png',
    languages: ['English (Professional)', 'Hindi (Professional)'],
  },
  skills: [
    {
      id: 'programming-analysis',
      title: 'PROGRAMMING & ANALYSIS',
      skills: [
        'Python',
        'Pandas',
        'NumPy',
        'Matplotlib',
        'SQL',
        'Joins',
        'Aggregations',
        'Subqueries',
      ],
    },
    {
      id: 'bi-tools',
      title: 'BI & TOOLS',
      skills: [
        'Power BI',
        'Microsoft Excel',
        'Pivot Tables',
        'VLOOKUP',
        'Dashboards',
        'Data Validation',
        'Data Visualization',
      ],
    },
    {
      id: 'data-concepts',
      title: 'DATA CONCEPTS',
      skills: [
        'Data Cleaning',
        'Exploratory Data Analysis',
        'KPI Tracking',
        'Reporting',
        'Statistical Analysis',
      ],
    },
    {
      id: 'machine-learning',
      title: 'MACHINE LEARNING',
      skills: [
        'Regression',
        'Classification',
        'Model Evaluation',
        'Machine Learning Fundamentals',
      ],
    },
    {
      id: 'other',
      title: 'OTHER',
      skills: [
        'OpenPyXL',
        'Flask',
        'HTML',
        'CSS',
        'JavaScript',
        'MySQL',
      ],
    },
  ],
  experience: [
    {
      id: 'exp-01',
      title: 'Helpdesk Executive',
      company: '1Point1 Solutions',
      process: 'ICEGATE Process',
      period: 'Feb 2026 – Present',
      type: 'operational',
      responsibilities: [
        'Resolved customer queries and service requests while maintaining accurate records of issues, interactions, and resolutions.',
        'Tracked tickets, follow-ups, escalations, and resolution status to ensure timely issue closure and SLA adherence.',
        'Maintained operational data using MS Excel and internal systems to support reporting, data accuracy, and performance tracking.',
      ],
    },
    {
      id: 'exp-02',
      title: 'Data Tool Developer',
      company: 'Aashi Realty',
      period: 'Jun 2025 – Aug 2025',
      type: 'pipeline',
      responsibilities: [
        'Automated data cleaning and reporting pipelines using Python, Pandas, and OpenPyXL, reducing manual effort by 50%.',
        'Developed DataBook, a Python-based tool to clean and standardize messy CSV datasets.',
        'Built Power BI data visualization dashboards for YoY growth and pricing insights.',
        'Worked with business teams to define KPIs and improve reporting accuracy.',
      ],
    },
    {
      id: 'exp-03',
      title: 'Data Analyst Intern',
      company: 'Limbhas & Associates',
      period: 'Nov 2024 – Feb 2025',
      type: 'dashboard',
      responsibilities: [
        'Prepared an Expense Tracker using Python and SQL for automated reporting.',
        'Performed data validation and analysis using Excel and SQL, improving accuracy by 30%.',
        'Created visual reports tracking project timelines, budget utilization, and resources.',
      ],
    },
  ],
  projects: [
    {
      id: 'databook',
      name: 'DataBook – Data Cleaning Tool',
      technologies: ['Python', 'Pandas', 'NumPy', 'OpenPyXL'],
      description: 'Automated cleaning and standardization of CSV/TXT files.',
      problem:
        'Raw CSV and TXT datasets commonly arrived with inconsistent delimiters, null anomalies, mismatched encoding, and formatting errors that required hours of manual spreadsheet preparation before downstream analysis.',
      approach:
        'Developed DataBook, a dedicated Python utility utilizing Pandas, NumPy, and OpenPyXL to ingest, validate, sanitize, and standardize datasets through an automated cleaning pipeline.',
      keyResult: 'Reduced data preparation time by 70%.',
      githubUrl: 'https://github.com/ShivanyaMishra',
      type: 'pipeline',
    },
    {
      id: 'real-estate-dashboard',
      name: 'Real Estate Price Dashboard',
      technologies: ['Power BI', 'Microsoft Excel'],
      description:
        'Analyzed real estate data for 5 cities and developed interactive dashboards showing price trends and YoY growth.',
      problem:
        'Business stakeholders required visibility across 5 major urban housing markets to evaluate regional price movement, YoY trajectory, and comparative city metrics without navigating disconnected spreadsheets.',
      approach:
        'Constructed analytical data models in Excel and Power BI, establishing calculated measures to track YoY growth, pricing distributions, and interactive city-level cross-filtering.',
      keyResult:
        'Delivered interactive dashboards enabling instant city-by-city price trend analysis and KPI exploration for decision-makers.',
      githubUrl: 'https://github.com/ShivanyaMishra',
      type: 'dashboard',
    },
    {
      id: 'desktop-virtual-assistant',
      name: 'SCORPIO — AI Desktop Virtual Assistant',
      technologies: ['Python', 'SpeechRecognition', 'NLP', 'Python Automation', 'System Control'],
      description:
        'A Python-based voice-controlled desktop assistant that processes spoken commands and performs automated system and utility tasks.',
      problem:
        'Performing repetitive desktop operations, file management, web searches, and utility tasks manually can be time-consuming.',
      approach:
        'Built a Python backend that captures voice commands, interprets them using SpeechRecognition and basic NLP-based command processing, and executes the requested system or utility operation.',
      keyFeatures: [
        'Automatic system voice control',
        'File and folder management',
        'Desktop/system operations',
        'Basic conversational interaction',
        'Internet/web surfing',
        'Google search',
        'Translation',
        'Command-based task automation',
        'Other utility actions triggered through voice commands',
      ],
      keyResult:
        'Built a functional Python-based voice automation backend capable of converting spoken commands into real desktop, web, and utility actions.',
      githubUrl: 'https://github.com/ShivanyaMishra',
      demoLabel: 'Live Demo: Backend / Local Execution',
      footerNote: 'Python Backend • AI Automation • Voice Interaction',
      type: 'assistant',
    },
    {
      id: 'aetherfinance',
      name: 'AetherFinance — AI Personal Finance Management',
      technologies: ['HTML', 'Tailwind CSS', 'JavaScript', 'Three.js', 'Gemini API'],
      description:
        'An AI-powered personal finance application designed to help users track expenses, analyze spending patterns, manage budgets, set savings goals, and receive personalized financial insights.',
      problem:
        'Managing personal expenses, identifying unnecessary spending, tracking budgets, and understanding monthly financial behavior can be difficult when financial data is scattered across transactions and spreadsheets.',
      approach:
        'Built an interactive fintech application that combines expense tracking, financial analytics, AI-powered insights, budgeting, savings goals, notifications, and interactive 3D data visualization.',
      keyFeatures: [
        'AI Financial Assistant',
        'Expense and transaction tracking',
        'Spending analysis',
        'Category and product-level expense analysis',
        'Budget management with smart warnings',
        'Savings goals and monthly savings tracking',
        'Spending trend analysis',
        'Unnecessary spending detection',
        'Financial insights and recommendations',
        'Interactive 3D financial visualization using Three.js',
        'Financial reports and data export',
        'Profile and financial preferences',
        'Smart notifications',
      ],
      keyResult:
        'Created an interactive AI-powered personal finance platform that combines financial tracking, analytics, budgeting, savings management, and conversational AI in a single application.',
      githubUrl: 'https://github.com/ShivanyaMishra',
      demoUrl: 'https://aetherfinance-app.ai.studio',
      demoLabel: 'Live Demo',
      footerNote: 'Gemini AI Integration • Interactive 3D Visualization • FinTech Analytics',
      type: 'fintech',
    },
  ],
  education: [
    {
      degree: 'Master of Computer Applications (MCA)',
      institution: 'Dr. Preeti Global University',
      location: 'Shivpuri, Madhya Pradesh, India',
      period: '2023 – 2026',
    },
    {
      degree: 'Bachelor of Arts (BA)',
      institution: 'Chhatrapati Shahu Ji Maharaj University, Kanpur, India',
      location: 'Kanpur, India',
      period: '2020 – 2023',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Data Analysis (Top 10%)',
      issuer: 'TestDome',
      distinction: 'Top 10%',
    },
    {
      id: 'cert-2',
      name: 'Data Analysis (Top 25%)',
      issuer: 'TestDome',
      distinction: 'Top 25%',
    },
    {
      id: 'cert-3',
      name: 'micro1 AI Interview Certification',
      issuer: 'micro1',
      distinction: 'Outstanding Performance',
    },
    {
      id: 'cert-4',
      name: 'Advanced Excel for Job & Real World',
      issuer: 'Udemy',
    },
    {
      id: 'cert-5',
      name: 'Python Programming',
      issuer: 'Aptech Learning, Gurugram',
    },
    {
      id: 'cert-6',
      name: 'Java Programming',
      issuer: 'Aptech Learning, Gurugram',
    },
    {
      id: 'cert-7',
      name: 'Hands-On Python Data Science',
      issuer: 'Udemy',
    },
  ],
};
