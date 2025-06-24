import { apiRequest } from '@/lib/api';
import type { APIMessage, AIResponse, AssistantMemory } from '@/types/chat';

/**
 * Send a message to the AI assistant backend
 */
export async function sendMessageToAI(
  message: string, 
  conversationHistory: APIMessage[] = [],
  memory: AssistantMemory = {},
  resetContext: boolean = false
): Promise<AIResponse> {
  console.log('🚀 sendMessageToAI called with:', { message, historyLength: conversationHistory.length, resetContext });
  
  try {
    console.log('📡 Making API request to /api/ai/chat...');
    const response = await apiRequest('POST', '/api/ai/chat', {
      message,
      conversationHistory,
      memory,
      resetContext,
    });

    console.log('✅ API response received, status:', response.status);

    if (!response.ok) {
      console.error('❌ API response not ok:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      throw new Error(errorData.details || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 AI Response data:', data);
    return data;
  } catch (error) {
    console.error('💥 Error sending message to AI:', error);
    throw error;
  }
}
