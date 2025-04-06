import React, { createContext, useState, useContext } from 'react';
import { ShoeData } from './GeminiService';

interface RecentFind {
  shoeData: ShoeData;
  imageUri: string;
  timestamp: number;
}

interface RecentFindsContextType {
  recentFinds: RecentFind[];
  addRecentFind: (shoeData: ShoeData, imageUri: string) => void;
  clearRecentFinds: () => void;
}

const RecentFindsContext = createContext<RecentFindsContextType>({
  recentFinds: [],
  addRecentFind: () => {},
  clearRecentFinds: () => {},
});

export const useRecentFinds = () => useContext(RecentFindsContext);

export const RecentFindsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentFinds, setRecentFinds] = useState<RecentFind[]>([]);

  const addRecentFind = (shoeData: ShoeData, imageUri: string) => {
    setRecentFinds(prev => {
      const newFind = { shoeData, imageUri, timestamp: Date.now() };
      // Add new find at the beginning and keep only the last 5
      return [newFind, ...prev].slice(0, 5);
    });
  };

  const clearRecentFinds = () => {
    setRecentFinds([]);
  };

  return (
    <RecentFindsContext.Provider
      value={{
        recentFinds,
        addRecentFind,
        clearRecentFinds,
      }}
    >
      {children}
    </RecentFindsContext.Provider>
  );
}; 