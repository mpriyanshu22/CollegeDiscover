'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type CompareContextType = {
  compareIds: string[];
  addCompareId: (id: string) => void;
  removeCompareId: (id: string) => void;
  clearCompare: () => void;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem('compareIds');
    if (saved) {
      setCompareIds(JSON.parse(saved));
    }
  }, []);

  const addCompareId = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 3) {
        alert('You can only compare up to 3 colleges at a time.');
        return prev;
      }
      const newIds = [...prev, id];
      localStorage.setItem('compareIds', JSON.stringify(newIds));
      return newIds;
    });
  };

  const removeCompareId = (id: string) => {
    setCompareIds(prev => {
      const newIds = prev.filter(cid => cid !== id);
      localStorage.setItem('compareIds', JSON.stringify(newIds));
      return newIds;
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
    localStorage.removeItem('compareIds');
  };

  return (
    <CompareContext.Provider value={{ compareIds, addCompareId, removeCompareId, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
