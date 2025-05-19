/**
 * Service for AI Assistant API calls
 */

export interface AskAssistantRequest {
  message: string;
  context?: Record<string, any>;
}

export interface AskAssistantResponse {
  response: string;
  error?: string;
}

/**
 * Send a user message to the AI assistant and get a response
 * Optionally include user context for personalized responses
 */
export async function askAssistant(message: string, context?: Record<string, any>): Promise<AskAssistantResponse> {
  if (!message || message.trim() === '') {
    throw new Error("Message cannot be empty");
  }
  
  try {
    const response = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: message.trim(),
        context: context || {}
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('AI Assistant API error:', errorData);
      throw new Error(errorData.error || 'Failed to get response from assistant');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in AI assistant service:', error);
    return { 
      response: 'I apologize, but I encountered an issue processing your request. Please try again.',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}