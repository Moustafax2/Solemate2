import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Rating {
  shoeId: string;  // Unique identifier for the shoe (brand-model-price)
  rating: number;  // 1-5 stars
  timestamp: number;
}

interface RatingsContextType {
  ratings: Rating[];
  addRating: (shoeId: string, rating: number) => Promise<void>;
  getRating: (shoeId: string) => number | null;
}

const RatingsContext = createContext<RatingsContextType>({
  ratings: [],
  addRating: async () => {},
  getRating: () => null,
});

export const useRatings = () => useContext(RatingsContext);

export const RatingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ratings, setRatings] = useState<Rating[]>([]);

  // Load ratings from storage when component mounts
  React.useEffect(() => {
    const loadRatings = async () => {
      try {
        const storedRatings = await AsyncStorage.getItem('shoe_ratings');
        if (storedRatings) {
          setRatings(JSON.parse(storedRatings));
        }
      } catch (error) {
        console.error('Failed to load ratings:', error);
      }
    };
    loadRatings();
  }, []);

  const addRating = async (shoeId: string, rating: number) => {
    try {
      const newRating: Rating = {
        shoeId,
        rating,
        timestamp: Date.now(),
      };

      // Update state
      setRatings(prevRatings => {
        const existingIndex = prevRatings.findIndex(r => r.shoeId === shoeId);
        if (existingIndex >= 0) {
          // Replace existing rating
          const updatedRatings = [...prevRatings];
          updatedRatings[existingIndex] = newRating;
          return updatedRatings;
        }
        // Add new rating
        return [...prevRatings, newRating];
      });

      // Save to storage
      await AsyncStorage.setItem('shoe_ratings', JSON.stringify(ratings));
    } catch (error) {
      console.error('Failed to save rating:', error);
    }
  };

  const getRating = (shoeId: string): number | null => {
    const rating = ratings.find(r => r.shoeId === shoeId);
    return rating ? rating.rating : null;
  };

  return (
    <RatingsContext.Provider
      value={{
        ratings,
        addRating,
        getRating,
      }}
    >
      {children}
    </RatingsContext.Provider>
  );
}; 