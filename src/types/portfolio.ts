export interface ProjectItem {
  id: string;
  name: string;
  technologies: string[];
  description: string;
  problem: string;
  approach: string;
  keyResult: string;
  keyFeatures?: string[];
  githubUrl?: string;
  demoUrl?: string;
  demoLabel?: string;
  footerNote?: string;
  type: 'pipeline' | 'dashboard' | 'assistant' | 'fintech';
}

export interface SkillItem {
  name: string;
  category: string;
  related?: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  process?: string;
  responsibilities: string[];
  type: 'pipeline' | 'dashboard' | 'operational';
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  distinction?: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    professionalTitle: string;
    secondaryTitle: string;
    heroDescription: string;
    aboutHeading: string;
    aboutParagraph1: string;
    aboutParagraph2: string;
    careerDirection: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    profileImage?: string;
    languages: string[];
  };
  skills: SkillGroup[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}
