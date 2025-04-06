import React, { createContext, useState, useContext } from 'react';
import { ShoeData } from './GeminiService';

interface CommunityFind {
  shoeData: ShoeData;
  imageUri: string;
  timestamp: number;
  userId: string;
  username: string;
}

interface CommunityFindsContextType {
  communityFinds: CommunityFind[];
  addCommunityFind: (shoeData: ShoeData, imageUri: string, userId: string, username: string) => void;
  clearCommunityFinds: () => void;
}

const CommunityFindsContext = createContext<CommunityFindsContextType>({
  communityFinds: [],
  addCommunityFind: () => {},
  clearCommunityFinds: () => {},
});

export const useCommunityFinds = () => useContext(CommunityFindsContext);

export const CommunityFindsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [communityFinds, setCommunityFinds] = useState<CommunityFind[]>([
    {
      shoeData: {
        brand: "Nike",
        model: "Air Force 1",
        price: {
          usd: 100,
          range: "$90-$110",
        },
        releaseYear: 2021,
        type: "Lifestyle",
        colors: ["White", "Black"],
        popularity: "High",
        description: "The Nike Air Force 1 is a classic sneaker that has been a staple in streetwear since its release in 1982.",
        confidence: 0.95,
      },
      imageUri: require('@/assets/images/airforce1.png'),
      timestamp: Date.now() - 86400000, // 1 day ago
      userId: "user1",
      username: "SneakerHead",
    },
    {
      shoeData: {
        brand: "Adidas",
        model: "Samba",
        price: {
          usd: 80,
          range: "$70-$90",
        },
        releaseYear: 2020,
        type: "Indoor Soccer",
        colors: ["Black", "White"],
        popularity: "Medium",
        description: "The Adidas Samba is a classic indoor soccer shoe that has become a popular casual sneaker.",
        confidence: 0.92,
      },
      imageUri: require('@/assets/images/adidassamba.png'),
      timestamp: Date.now() - 172800000, // 2 days ago
      userId: "user2",
      username: "ShoeCollector",
    },
    {
      shoeData: {
        brand: "Nike",
        model: "Air Max 97",
        price: {
          usd: 170,
          range: "$160-$180",
        },
        releaseYear: 2022,
        type: "Running",
        colors: ["Silver", "Red"],
        popularity: "High",
        description: "The Nike Air Max 97 features a full-length Air unit and a sleek, futuristic design inspired by Japanese bullet trains.",
        confidence: 0.94,
      },
      imageUri: require('@/assets/images/airmax97.png'),
      timestamp: Date.now() - 259200000, // 3 days ago
      userId: "user3",
      username: "SneakerEnthusiast",
    },
  ]);

  const addCommunityFind = (shoeData: ShoeData, imageUri: string, userId: string, username: string) => {
    setCommunityFinds(prev => {
      const newFind = { 
        shoeData, 
        imageUri, 
        timestamp: Date.now(),
        userId,
        username
      };
      // Add new find at the beginning and keep only the last 10
      return [newFind, ...prev].slice(0, 10);
    });
  };

  const clearCommunityFinds = () => {
    setCommunityFinds([]);
  };

  return (
    <CommunityFindsContext.Provider
      value={{
        communityFinds,
        addCommunityFind,
        clearCommunityFinds,
      }}
    >
      {children}
    </CommunityFindsContext.Provider>
  );
}; 