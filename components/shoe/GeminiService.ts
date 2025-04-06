import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
// Import from .env file - NOTE: This doesn't seem to be working correctly
// import { GEMINI_API_KEY } from '@env';

// Define types for shoe data
export interface ShoeData {
  brand: string;
  model: string;
  price: {
    usd: number;
    range: string;
  };
  releaseYear: number;
  type: string;
  colors: string[];
  popularity: string;
  description: string;
  confidence: number;
  rarity?: {
    level: 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare' | 'Legendary';
    description: string;
    collectorValue: number;
  };
}

// Use this shared API key for the SoleMate app
// IMPORTANT: In a real production app, this would be better handled through a backend
// to avoid exposing API keys in client-side code
// DEVELOPMENT: For GitHub, replace the key with PLACEHOLDER before committing
const API_KEY = ''; // DO NOT commit real API key to GitHub

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Convert a local image URI to a base64 string
 */
async function imageToBase64(uri: string): Promise<string> {
  // Resize and compress the image for better upload
  const processedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );

  // Read the file as base64
  const base64 = await FileSystem.readAsStringAsync(processedImage.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  
  return base64;
}

/**
 * Identify a shoe using Gemini Vision
 */
export async function identifyShoeWithGemini(imageUri: string): Promise<ShoeData> {
  try {
    // Convert the image to base64
    const base64Image = await imageToBase64(imageUri);
    
    // Create a model instance with the new Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Prepare the prompt for shoe identification
    const prompt = `Identify this shoe in the image.
    Provide detailed information in the following JSON format only:
    {
      "brand": "Brand name",
      "model": "Model name",
      "price": {
        "usd": approximate price in USD as a number,
        "range": "Price range as a string"
      },
      "releaseYear": year of release as a number,
      "type": "Type of shoe (e.g., Running, Basketball, Casual)",
      "colors": ["Primary color", "Secondary color", ...],
      "popularity": "High/Medium/Low",
      "description": "Brief description of the shoe",
      "confidence": your confidence in this identification from 0.0 to 1.0
    }
    
    If you cannot identify the shoe, provide your best guess and set confidence accordingly.
    DO NOT include any other text in your response, only valid JSON.`;
    
    // Create image part
    const imagePart: Part = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg',
      },
    };
    
    // Generate content
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from response
    // Extract JSON part from the response (in case there's extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response");
    }
    
    const shoeData: ShoeData = JSON.parse(jsonMatch[0]);
    
    return shoeData;
  } catch (error) {
    console.error('Error identifying shoe with Gemini:', error);
    
    // Return a fallback response if there's an error
    return {
      brand: "Unknown",
      model: "Could not identify",
      price: {
        usd: 0,
        range: "Unknown",
      },
      releaseYear: 0,
      type: "Unknown",
      colors: ["Unknown"],
      popularity: "Unknown",
      description: "Sorry, we couldn't identify this shoe. Please try again with a clearer image.",
      confidence: 0,
    };
  }
}

// For testing purposes or when API is unavailable, use this mock function
export function getMockShoeData(): ShoeData {
  return {
    brand: "Nike",
    model: "Air Jordan 1 Retro High OG",
    price: {
      usd: 170,
      range: "$160-$180",
    },
    releaseYear: 2021,
    type: "Basketball/Lifestyle",
    colors: ["University Blue", "White", "Black"],
    popularity: "High",
    description: "The Air Jordan 1 Retro High OG 'University Blue' features a University Blue leather upper with black and white accents throughout the shoe. A white midsole and black outsole complete the design.",
    confidence: 0.92,
  };
} 