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
 * Types for assistant actions and navigation
 * These types represent the structured data that the assistant can return
 * to trigger navigation or UI changes in the app
 */

// Base action type
export interface AssistantAction {
  type: string;
  message?: string;
}

// Navigate to a quote flow
export interface NavigateToQuoteFlowAction extends AssistantAction {
  type: 'navigate_to_quote_flow';
  category: 'travel' | 'pet' | 'auto' | 'health';
  preload?: Record<string, any>;
}

// Open the comparison tool
export interface OpenComparisonToolAction extends AssistantAction {
  type: 'open_comparison_tool';
  category: 'travel' | 'pet' | 'auto' | 'health';
  planIds?: string[];
}

// Filter plan results
export interface FilterPlanResultsAction extends AssistantAction {
  type: 'filter_plan_results';
  category: 'travel' | 'pet' | 'auto' | 'health';
  filters: Record<string, any>;
}

// Show a glossary term
export interface ShowGlossaryTermAction extends AssistantAction {
  type: 'show_glossary_term';
  term: string;
  definition?: string;
}

// Redirect to account settings
export interface RedirectToAccountSettingsAction extends AssistantAction {
  type: 'redirect_to_account_settings';
  section?: string;
}

// Union type of all possible actions
export type AssistantActionType = 
  | NavigateToQuoteFlowAction
  | OpenComparisonToolAction
  | FilterPlanResultsAction
  | ShowGlossaryTermAction
  | RedirectToAccountSettingsAction;

/**
 * Send a user message to the AI assistant and get a response
 * Optionally include user context for personalized responses
 */
export interface AskAssistantResponseWithAction extends AskAssistantResponse {
  action?: AssistantActionType;
}

/**
 * Attempts to parse any structured action data from the assistant response
 */
export function parseAssistantAction(response: string): AssistantActionType | null {
  try {
    // Look for specially formatted JSON in the response
    // The format we're looking for is: [ACTION_JSON]{ ... }[/ACTION_JSON]
    const actionMatch = response.match(/\[ACTION_JSON\](.*?)\[\/ACTION_JSON\]/s);
    
    if (actionMatch && actionMatch[1]) {
      const actionData = JSON.parse(actionMatch[1].trim());
      
      // Validate that it's a proper action
      if (actionData && actionData.type) {
        // Return the action with the appropriate type
        return actionData as AssistantActionType;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing assistant action:', error);
    return null;
  }
}

/**
 * Clean the response by removing any action JSON
 */
export function cleanAssistantResponse(response: string): string {
  // Remove the action JSON from the response
  return response.replace(/\[ACTION_JSON\](.*?)\[\/ACTION_JSON\]/gs, '').trim();
}

export async function askAssistant(message: string, context?: Record<string, any>): Promise<AskAssistantResponseWithAction> {
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
    
    // Check if the response contains an action
    const action = parseAssistantAction(data.response);
    
    // Clean the response if an action was found
    const cleanedResponse = action ? cleanAssistantResponse(data.response) : data.response;
    
    return {
      ...data,
      response: cleanedResponse,
      action,
    };
  } catch (error) {
    console.error('Error in AI assistant service:', error);
    return { 
      response: 'I apologize, but I encountered an issue processing your request. Please try again.',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}