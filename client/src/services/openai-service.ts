import { apiRequest } from '@/lib/queryClient';

export interface APIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface AIResponse {
  message?: string;
  response?: string;
  suggestedPlans?: any[];
  category?: string;
  userContext?: any;
  needsMoreContext?: boolean;
  suggestedQuestions?: string[];
}

/**
 * Send a message to the AI assistant backend
 */
export async function sendMessageToAI(
  message: string, 
  conversationHistory: APIMessage[] = []
): Promise<AIResponse> {
  try {
    const response = await apiRequest('POST', '/api/ai/chat', {
      message,
      conversationHistory
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error;
  }
}

/**
 * Mock response function for fallback - should not be used in production
 */
export function getMockResponse(): AIResponse {
  return {
    response: "I'm having trouble connecting to the AI service. Please try again.",
    suggestedPlans: [],
    category: undefined
  };
}