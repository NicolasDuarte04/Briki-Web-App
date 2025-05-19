import { APIStatusResponse, AssistantRequest, AssistantResponse, AssistantWidgetType, UserMemory } from '@/types/assistant';
import { trackAssistantError, trackAssistantRequestSent, trackAssistantResponseReceived } from '@/lib/assistant-analytics';

/**
 * Checks if the OpenAI API is available
 * @returns Promise resolving to true if API is available, false otherwise
 */
export async function checkAPIStatus(): Promise<APIStatusResponse> {
  try {
    const response = await fetch('/api/ai/status');
    
    if (!response.ok) {
      return {
        available: false,
        message: `API check failed with status: ${response.status}`
      };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking API status:', error);
    return {
      available: false,
      message: error instanceof Error ? error.message : 'Unknown error checking API status'
    };
  }
}

/**
 * Sends a message to the AI assistant
 * @param message The user's message
 * @param userMemory Memory about the user's context
 * @returns Promise resolving to the assistant's response
 */
export async function sendMessage(
  message: string,
  userMemory: UserMemory = {}
): Promise<AssistantResponse> {
  try {
    // Track that we're sending a request
    trackAssistantRequestSent(message);
    
    // Prepare request
    const requestData: AssistantRequest = {
      message,
      userMemory
    };
    
    // Send request to API
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    // Handle non-OK response
    if (!response.ok) {
      let errorMessage = `Failed to get response from AI assistant (${response.status})`;
      
      // Try to get more detailed error message
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore JSON parse errors
      }
      
      // Track error
      trackAssistantError('api_error', errorMessage);
      
      // Return error response
      return {
        message: errorMessage
      };
    }
    
    // Parse response
    const assistantResponse: AssistantResponse = await response.json();
    
    // Track successful response
    trackAssistantResponseReceived(assistantResponse.message, !!assistantResponse.action);
    
    return assistantResponse;
  } catch (error) {
    // Handle any unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error sending message to AI assistant:', error);
    
    // Track error
    trackAssistantError('client_error', errorMessage);
    
    return {
      message: 'Sorry, I encountered an error while processing your request. Please try again.'
    };
  }
}

/**
 * Extract action from OpenAI response content
 * This is a fallback in case the backend didn't extract it properly
 * @param content The assistant message content
 * @returns AssistantWidgetType or null if no action found
 */
export function extractActionFromMessage(content: string): AssistantWidgetType | null {
  // Try to find JSON action pattern in the message
  try {
    // Look for JSON object pattern between triple backticks
    const jsonMatch = content.match(/```json\s*({[\s\S]*?})\s*```/) || 
                      content.match(/```\s*({[\s\S]*?})\s*```/) ||
                      content.match(/{[\s\S]*"type":\s*"[^"]*"[\s\S]*}/);
    
    if (jsonMatch && jsonMatch[1]) {
      const actionData = JSON.parse(jsonMatch[1]);
      
      // Check if it has a type field that matches our action types
      if (actionData.type && 
          ['recommend_plan', 'navigate_to_page', 'compare_plans', 'explain_term'].includes(actionData.type)) {
        
        // Basic validation based on action type
        switch (actionData.type) {
          case 'recommend_plan':
            if (actionData.category && actionData.planId) {
              return {
                type: 'recommend_plan',
                category: actionData.category,
                planId: actionData.planId
              };
            }
            break;
          
          case 'navigate_to_page':
            if (actionData.path && actionData.label) {
              return {
                type: 'navigate_to_page',
                path: actionData.path,
                label: actionData.label
              };
            }
            break;
          
          case 'compare_plans':
            if (actionData.category && Array.isArray(actionData.planIds)) {
              return {
                type: 'compare_plans',
                category: actionData.category,
                planIds: actionData.planIds
              };
            }
            break;
          
          case 'explain_term':
            if (actionData.term && actionData.explanation) {
              return {
                type: 'explain_term',
                term: actionData.term,
                explanation: actionData.explanation
              };
            }
            break;
        }
      }
    }
  } catch (error) {
    console.warn('Error extracting action from message:', error);
  }
  
  return null;
}