import NetInfo from '@react-native-community/netinfo';
import { identifyShoeWithGemini, getMockShoeData, ShoeData } from './GeminiService';
import { identifyShoeWithOpenAI } from './OpenaiService';

export async function identifyShoe(imageUri: string): Promise<ShoeData> {
  try {
    // Check network connectivity
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      throw new Error('No internet connection');
    }

    console.log('Starting identification with both OpenAI and Gemini...');
    
    // Run both API calls in parallel using Promise.allSettled
    const [openaiResult, geminiResult] = await Promise.allSettled([
      identifyShoeWithOpenAI(imageUri),
      identifyShoeWithGemini(imageUri)
    ]);
    
    let geminiData: ShoeData | null = null;
    let openaiData: ShoeData | null = null;
    
    // Process Gemini result
    if (geminiResult.status === 'fulfilled') {
      // Only consider the result if it's not "Unknown"
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
      // Only consider the result if it's not "Unknown"
      if (openaiResult.value.brand !== "Unknown") {
        openaiData = openaiResult.value;
        console.log('OpenAI successfully identified the shoe with confidence:', openaiData.confidence);
      } else {
        console.log('OpenAI returned an Unknown shoe');
      }
    } else {
      console.error('Error with OpenAI API:', openaiResult.reason);
    }
    
    // If both APIs fail or return unknown, return mock data
    if (!geminiData && !openaiData) {
      console.log('Both APIs failed or returned Unknown, using mock data');
      return getMockShoeData();
    }
    
    // If both succeeded, choose the one with higher confidence
    if (geminiData && openaiData) {
      console.log('Both APIs succeeded, selecting the one with higher confidence');
      return geminiData.confidence >= openaiData.confidence ? geminiData : openaiData;
    }
    
    // If only one succeeded, return that one
    if (geminiData) {
      console.log('Only Gemini succeeded, returning its result');
      return geminiData;
    }
    
    if (openaiData) {
      console.log('Only OpenAI succeeded, returning its result');
      return openaiData;
    }
    
    // Fallback (should never reach here due to previous conditions)
    console.log('Unexpected path - using mock data as fallback');
    return getMockShoeData();
  } catch (error) {
    console.error('Error identifying shoe:', error);
    throw error;
  }
}

// Future implementation could include:
// 1. AI model selection based on user preference
// 2. Caching results for offline use
// 3. More advanced image preprocessing
// 4. User feedback for improving accuracy