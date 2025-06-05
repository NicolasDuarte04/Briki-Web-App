import { apiRequest } from '@/lib/queryClient';

export interface APIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface AIResponse {
  response: string;
  suggestedPlans?: any[];
  category?: string;
  userContext?: any;
}

/**
 * Send a message to the AI assistant backend
 */
export async function sendMessageToAI(
  message: string, 
  conversationHistory: APIMessage[] = []
): Promise<AIResponse> {
  try {
    const response = await apiRequest('/api/ai/chat', {
      method: 'POST',
      data: {
        message,
        conversationHistory
      }
    });

    return response;
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