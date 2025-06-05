import { apiRequest } from '@/lib/api';

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
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory
      })
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