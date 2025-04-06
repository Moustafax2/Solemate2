import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

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
}

// Use this shared API key for the SoleMate app
// IMPORTANT: In a real production app, this would be better handled through a backend
const CLAUDE_API_KEY = ''; // DO NOT commit real API key to GitHub

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
 * Identify a shoe using Claude's API
 */
export async function identifyShoeWithClaude(imageUri: string): Promise<ShoeData> {
  try {
    // Convert the image to base64
    const base64Image = await imageToBase64(imageUri);
    
    // Prepare the prompt for shoe identification
    const prompt = `Identify this shoe in the image. Provide detailed information in the following JSON format only:
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

    // Make API call to Claude
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image
                }
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    // Extract the response text
    const responseText = response.data.content[0].text;
    
    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response");
    }
    
    // Parse the JSON
    const shoeData: ShoeData = JSON.parse(jsonMatch[0]);
    return shoeData;
    
  } catch (error) {
    console.error('Error identifying shoe with Claude:', error);
    
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

// For testing purposes when API is unavailable
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