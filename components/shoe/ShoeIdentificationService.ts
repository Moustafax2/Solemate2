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
      return getMockShoeData();
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
      return highestConfidenceResult;
    }
    
    // If we get here, something unexpected happened - return mock data
    console.log('Unexpected path - using mock data as fallback');
    return getMockShoeData();
  } catch (error) {
    console.error('Error identifying shoe:', error);
    throw error;
  }
}
