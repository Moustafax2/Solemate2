import NetInfo from '@react-native-community/netinfo';
import { identifyShoeWithGemini, getMockShoeData, ShoeData } from './GeminiService';
import { identifyShoeWithOpenAI } from './OpenaiService';
import { identifyShoeWithClaude } from './ClaudeService';

export async function identifyShoe(imageUri: string): Promise<ShoeData> {
  try {
    // Check network connectivity
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      throw new Error('No internet connection');
    }

    console.log('Starting identification with OpenAI, Gemini, and Claude...');
    
    // Run all API calls in parallel using Promise.allSettled
    const [openaiResult, geminiResult, claudeResult] = await Promise.allSettled([
      identifyShoeWithOpenAI(imageUri),
      identifyShoeWithGemini(imageUri),
      identifyShoeWithClaude(imageUri)
    ]);
    
    let geminiData: ShoeData | null = null;
    let openaiData: ShoeData | null = null;
    let claudeData: ShoeData | null = null;
    
    // Process Gemini result
    if (geminiResult.status === 'fulfilled') {
      if (geminiResult.value.brand !== "Unknown") {
        geminiData = geminiResult.value;
        console.log('Gemini successfully identified the shoe with confidence:', geminiData.confidence);
      } else {
        console.log('Gemini returned an Unknown shoe');
      }
    } else {
      console.error('Error with Gemini API:', geminiResult.reason);
    }
    
    // Process OpenAI result
    if (openaiResult.status === 'fulfilled') {
      if (openaiResult.value.brand !== "Unknown") {
        openaiData = openaiResult.value;
        console.log('OpenAI successfully identified the shoe with confidence:', openaiData.confidence);
      } else {
        console.log('OpenAI returned an Unknown shoe');
      }
    } else {
      console.error('Error with OpenAI API:', openaiResult.reason);
    }
    
    // Process Claude result
    if (claudeResult.status === 'fulfilled') {
      if (claudeResult.value.brand !== "Unknown") {
        claudeData = claudeResult.value;
        console.log('Claude successfully identified the shoe with confidence:', claudeData.confidence);
      } else {
        console.log('Claude returned an Unknown shoe');
      }
    } else {
      console.error('Error with Claude API:', claudeResult.reason);
    }
    
    // If all APIs fail or return unknown, return mock data
    if (!geminiData && !openaiData && !claudeData) {
      console.log('All APIs failed or returned Unknown, using mock data');
      const mockData = getMockShoeData();
      
      // Add rarity information to mock data
      mockData.rarity = {
        level: 'Common',
        description: 'This is a common shoe model that is widely available in retail stores.',
        collectorValue: mockData.price.usd * 1.2
      };
      
      return mockData;
    }
    
    // Find the result with the highest confidence
    let highestConfidenceResult: ShoeData | null = null;
    let highestConfidence = 0;
    
    if (geminiData && geminiData.confidence > highestConfidence) {
      highestConfidenceResult = geminiData;
      highestConfidence = geminiData.confidence;
      console.log('Gemini has highest confidence so far:', highestConfidence);
    }
    
    if (openaiData && openaiData.confidence > highestConfidence) {
      highestConfidenceResult = openaiData;
      highestConfidence = openaiData.confidence;
      console.log('OpenAI has highest confidence so far:', highestConfidence);
    }
    
    if (claudeData && claudeData.confidence > highestConfidence) {
      highestConfidenceResult = claudeData;
      highestConfidence = claudeData.confidence;
      console.log('Claude has highest confidence so far:', highestConfidence);
    }
    
    if (highestConfidenceResult) {
      console.log('Returning result with highest confidence:', highestConfidence);
      
      // Add rarity information based on price and popularity
      const price = highestConfidenceResult.price.usd;
      const popularity = highestConfidenceResult.popularity.toLowerCase();
      
      let rarityLevel = 'Common';
      let rarityDescription = '';
      let collectorValue = price;
      
      if (price > 500 || (price > 300 && popularity === 'low')) {
        rarityLevel = 'Legendary';
        rarityDescription = 'This is an extremely rare and highly sought-after shoe. Collectors would pay a premium for this model.';
        collectorValue = price * 2.5;
      } else if (price > 300 || (price > 200 && popularity === 'low')) {
        rarityLevel = 'Ultra Rare';
        rarityDescription = 'This is a very rare shoe that is difficult to find in retail stores.';
        collectorValue = price * 2.0;
      } else if (price > 200 || (price > 150 && popularity === 'low')) {
        rarityLevel = 'Rare';
        rarityDescription = 'This is a rare shoe that may be limited in availability.';
        collectorValue = price * 1.5;
      } else if (price > 150 || popularity === 'low') {
        rarityLevel = 'Uncommon';
        rarityDescription = 'This is an uncommon shoe that might not be available in all stores.';
        collectorValue = price * 1.3;
      } else {
        rarityLevel = 'Common';
        rarityDescription = 'This is a common shoe model that is widely available in retail stores.';
        collectorValue = price * 1.2;
      }
      
      highestConfidenceResult.rarity = {
        level: rarityLevel as 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare' | 'Legendary',
        description: rarityDescription,
        collectorValue: Math.round(collectorValue)
      };
      
      return highestConfidenceResult;
    }
    
    // If we get here, something unexpected happened - return mock data
    console.log('Unexpected path - using mock data as fallback');
    const mockData = getMockShoeData();
    
    // Add rarity information to mock data
    mockData.rarity = {
      level: 'Common',
      description: 'This is a common shoe model that is widely available in retail stores.',
      collectorValue: mockData.price.usd * 1.2
    };
    
    return mockData;
  } catch (error) {
    console.error('Error identifying shoe:', error);
    throw error;
  }
}
