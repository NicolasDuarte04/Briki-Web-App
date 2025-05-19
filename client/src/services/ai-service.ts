import { apiPost } from '@/lib/api';
import { AssistantWidgetData, Message, UserMemory } from '@/types/assistant';
import { trackError } from '@/lib/analytics';
import { v4 as uuidv4 } from 'uuid';

/**
 * Response from the OpenAI API
 */
export interface AIResponse {
  text: string;
  widgetData?: AssistantWidgetData;
}

/**
 * Service for interacting with the AI assistant
 */
export class AIService {
  private baseUrl = '/api/ai';

  /**
   * Get a response from the AI assistant
   * @param message The message to send to the assistant
   * @param messageHistory Previous messages for context
   * @param userMemory User information for personalization
   * @returns The assistant's response
   */
  async getAssistantResponse(
    message: string,
    messageHistory: Message[],
    userMemory?: UserMemory
  ): Promise<AIResponse> {
    try {
      // Format the message history for the API
      const formattedHistory = messageHistory.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      // Make the API request to our backend
      const response = await apiPost(`${this.baseUrl}/chat`, {
        message,
        history: formattedHistory,
        userMemory,
      });

      // Handle response
      if (!response) {
        throw new Error('No response received from AI service');
      }

      return {
        text: response.text || 'I apologize, but I couldn\'t generate a response at this time.',
        widgetData: response.widgetData,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      trackError(`AI chat error: ${errorMessage}`);
      
      throw new Error(`Failed to get AI response: ${errorMessage}`);
    }
  }

  /**
   * Generate a new message object
   * @param sender The sender of the message
   * @param content The content of the message
   * @param isLoading Whether the message is loading
   * @param error Whether there was an error
   * @param widgetData Optional widget data for rich responses
   * @returns A formatted message object
   */
  generateMessage(
    sender: 'user' | 'assistant',
    content: string,
    isLoading = false,
    error = false,
    widgetData?: AssistantWidgetData | null
  ): Message {
    return {
      id: uuidv4(),
      sender,
      content,
      timestamp: new Date().toISOString(),
      isLoading,
      error,
      widgetData,
    };
  }

  /**
   * Check if the OpenAI API is available
   * @returns True if the API is available, false otherwise
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await apiPost(`${this.baseUrl}/health`);
      return response && response.status === 'ok';
    } catch (error) {
      return false;
    }
  }
}

// Create a singleton instance
export const aiService = new AIService();