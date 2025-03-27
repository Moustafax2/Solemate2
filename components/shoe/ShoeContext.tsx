import React, { createContext, useState, useContext } from 'react';
import { identifyShoe } from './ShoeIdentificationService';
import { ShoeData } from './GeminiService';

interface ShoeContextType {
  shoeData: ShoeData | null;
  imageUri: string | null;
  isLoading: boolean;
  error: string | null;
  captureImage: (uri: string) => Promise<void>;
  resetShoeData: () => void;
}

const ShoeContext = createContext<ShoeContextType>({
  shoeData: null,
  imageUri: null,
  isLoading: false,
  error: null,
  captureImage: async () => {},
  resetShoeData: () => {},
});

export const useShoe = () => useContext(ShoeContext);

export const ShoeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shoeData, setShoeData] = useState<ShoeData | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureImage = async (uri: string) => {
    try {
      setImageUri(uri);
      setIsLoading(true);
      setError(null);
      
      const result = await identifyShoe(uri);
      setShoeData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to identify shoe');
      console.error('Error in captureImage:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetShoeData = () => {
    setShoeData(null);
    setImageUri(null);
    setError(null);
  };

  return (
    <ShoeContext.Provider
      value={{
        shoeData,
        imageUri,
        isLoading,
        error,
        captureImage,
        resetShoeData,
      }}
    >
      {children}
    </ShoeContext.Provider>
  );
}; 