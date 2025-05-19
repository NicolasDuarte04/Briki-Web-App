import { apiRequest } from '@/lib/api';
import { AIResponse } from '@/types/assistant';

/**
 * Check if the OpenAI API is available
 */
export async function checkOpenAIStatus(): Promise<{ available: boolean; message?: string }> {
  try {
    const response = await apiRequest('/api/ai/status', {
      method: 'GET',
    });

    return response;
  } catch (error) {
    console.error('Error checking OpenAI API status:', error);
    return {
      available: false,
      message: error instanceof Error ? error.message : 'Failed to check API status',
    };
  }
}

/**
 * Send a message to the AI assistant
 * @param messages The conversation history
 * @returns The AI response
 */
export async function sendMessageToAssistant(
  messages: Array<{ role: string; content: string }>
): Promise<AIResponse> {
  try {
    const response = await apiRequest('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    return response;
  } catch (error) {
    console.error('Error sending message to assistant:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to get a response from the assistant'
    );
  }
}

/**
 * Get suggestions for the user input
 * @param input The user input
 * @returns An array of suggested completions
 */
export async function getAssistantSuggestions(input: string): Promise<string[]> {
  try {
    const response = await apiRequest('/api/ai/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    return response.suggestions || [];
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
}

/**
 * Submit feedback for a message
 * @param messageId The ID of the message
 * @param type The type of feedback (positive or negative)
 */
export async function submitAssistantFeedback(
  messageId: string,
  type: 'positive' | 'negative'
): Promise<{ success: boolean }> {
  try {
    const response = await apiRequest('/api/ai/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageId, feedbackType: type }),
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to submit feedback'
    );
  }
}