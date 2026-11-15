export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  distinction?: string;
  image: string;
  file: string;
  isUploaded: boolean;
  date?: string;
}

export const certificatesList: Certificate[] = [
  {
    id: 'cert-1',
    title: 'Data Analysis (Top 10%)',
    issuer: 'TestDome',
    distinction: 'Top 10%',
    image: '/certificates/testdome-top10.svg',
    file: '/certificates/testdome-top10.svg',
    isUploaded: true,
    date: 'Jul 30, 2026',
  },
  {
    id: 'cert-2',
    title: 'Data Analysis (Top 25%)',
    issuer: 'TestDome',
    distinction: 'Top 25%',
    image: '/certificates/testdome-top25.svg',
    file: '/certificates/testdome-top25.svg',
    isUploaded: true,
    date: 'Apr 6, 2026',
  },
  {
    id: 'cert-3',
    title: 'micro1 AI Interview Certification',
    issuer: 'micro1',
    distinction: 'Outstanding Performance',
    image: '/certificates/micro1-ai-interview.svg',
    file: '/certificates/micro1-ai-interview.svg',
    isUploaded: true,
    date: 'Aug 5, 2026',
  },
  {
    id: 'cert-4',
    title: 'Advanced Excel for Job & Real World',
    issuer: 'Udemy',
    distinction: 'Advanced Real-World Excel',
    image: '/certificates/udemy-advanced-excel.svg',
    file: '/certificates/udemy-advanced-excel.svg',
    isUploaded: true,
    date: 'May 24, 2025',
  },
  {
    id: 'cert-5',
    title: 'Python Programming',
    issuer: 'Aptech Learning, Gurugram',
    distinction: 'Grade: Distinction',
    image: '/certificates/aptech-python.svg',
    file: '/certificates/aptech-python.svg',
    isUploaded: true,
    date: 'Jan 24, 2025',
  },
  {
    id: 'cert-6',
    title: 'Java Programming',
    issuer: 'Aptech Learning, Gurugram',
    distinction: 'Grade: Distinction',
    image: '/certificates/aptech-java.svg',
    file: '/certificates/aptech-java.svg',
    isUploaded: true,
    date: 'Feb 28, 2025',
  },
  {
    id: 'cert-7',
    title: 'Hands-On Python Data Science',
    issuer: 'Udemy',
    distinction: 'Data Science & Analytics',
    image: '/certificates/udemy-python-datascience.svg',
    file: '/certificates/udemy-python-datascience.svg',
    isUploaded: true,
    date: 'May 24, 2025',
  },
];
