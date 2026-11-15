import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, ProjectItem, ExperienceItem } from '../types/portfolio';
import { initialPortfolioData } from '../data/defaultData';

interface PortfolioContextType {
  data: PortfolioData;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  updatePersonal: (personal: Partial<PortfolioData['personal']>) => void;
  updateProject: (project: ProjectItem) => void;
  updateExperience: (exp: ExperienceItem) => void;
  resetToDefault: () => void;
}

const STORAGE_KEY = 'shivanya_mishra_data_v6';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.personal && !parsed.personal.profileImage) {
          parsed.personal.profileImage = '/shivi.png';
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    return initialPortfolioData;
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Unable to persist data to localStorage', err);
    }
  }, [data]);

  const updatePersonal = (personal: Partial<PortfolioData['personal']>) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...personal },
    }));
  };

  const updateProject = (project: ProjectItem) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === project.id ? project : p)),
    }));
  };

  const updateExperience = (exp: ExperienceItem) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === exp.id ? exp : e)),
    }));
  };

  const resetToDefault = () => {
    setData(initialPortfolioData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isEditMode,
        setIsEditMode,
        updatePersonal,
        updateProject,
        updateExperience,
        resetToDefault,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
