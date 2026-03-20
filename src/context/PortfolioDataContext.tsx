import React, { createContext, useContext } from 'react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import type { PortfolioData } from '../hooks/usePortfolioData';

interface PortfolioDataContextType {
  data: PortfolioData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, loading, error, refetch } = usePortfolioData();
  return (
    <PortfolioDataContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioDataContext = () => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioDataContext must be used within PortfolioDataProvider');
  }
  return context;
};
