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
 * Types for assistant widgets and visualizations
 * These define the display components that can be embedded in responses
 */

// Base widget type
export interface WidgetData {
  type: string;
}

// Glossary term widget
export interface GlossaryWidgetData extends WidgetData {
  type: 'show_glossary';
  term: string;
  definition: string;
  icon?: string;
  source?: string;
  sourceUrl?: string;
}

// Visual comparison widget
export interface ComparisonItem {
  label: string;
  leftValue: string | boolean;
  rightValue: string | boolean;
}

export interface VisualComparisonWidgetData extends WidgetData {
  type: 'show_comparison';
  title: string;
  leftTitle: string;
  rightTitle: string;
  items: ComparisonItem[];
  leftColor?: string;
  rightColor?: string;
}

// Plan recommendation widget (already existed in some form)
export interface PlanRecommendationWidgetData extends WidgetData {
  type: 'show_plan_recommendations';
  category: 'travel' | 'pet' | 'auto' | 'health';
  filters?: Record<string, any>;
  planIds?: string[];
  message?: string;
}

// Union type for all possible widget types
export type AssistantWidgetType = 
  | GlossaryWidgetData
  | VisualComparisonWidgetData
  | PlanRecommendationWidgetData;

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
  widgetData?: AssistantWidgetType;
}

/**
 * Attempts to parse any structured action data from the assistant response
 */
export function parseAssistantAction(response: string): AssistantActionType | null {
  try {
    // Look for specially formatted JSON in the response
    // The format we're looking for is: [ACTION_JSON]{ ... }[/ACTION_JSON]
    const actionMatch = response.match(/\[ACTION_JSON\]([\s\S]*?)\[\/ACTION_JSON\]/);
    
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
 * Attempts to parse any structured widget data from the assistant response
 */
export function parseWidgetData(response: string): AssistantWidgetType | null {
  try {
    // Look for JSON data at the end of the message
    // Format: ```json { ... } ```
    const widgetMatch = response.match(/```json\s*([\s\S]*?)\s*```\s*$/);
    
    if (widgetMatch && widgetMatch[1]) {
      const widgetData = JSON.parse(widgetMatch[1].trim());
      
      // Validate that it's a proper widget with a type
      if (widgetData && widgetData.type) {
        // Return the widget data with the appropriate type
        return widgetData as AssistantWidgetType;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing widget data:', error);
    return null;
  }
}

/**
 * Clean the response by removing any action JSON and widget JSON
 */
export function cleanAssistantResponse(response: string): string {
  // Remove the action JSON from the response
  let cleaned = response.replace(/\[ACTION_JSON\]([\s\S]*?)\[\/ACTION_JSON\]/g, '');
  
  // Remove the widget JSON from the response (if at the end)
  cleaned = cleaned.replace(/```json\s*([\s\S]*?)\s*```\s*$/, '');
  
  return cleaned.trim();
}

export async function askAssistant(message: string, context?: Record<string, any>): Promise<AskAssistantResponseWithAction> {
  if (!message || message.trim() === '') {
    throw new Error("Message cannot be empty");
  }
  
  try {
    console.log('Sending message to assistant API...');
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
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('AI Assistant API error:', data);
      
      // Log detailed error information for debugging
      if (data.errorType) {
        console.error(`OpenAI error type: ${data.errorType}, code: ${data.errorCode}`);
      }
      
      return { 
        response: data.response || 'I apologize, but I encountered an issue connecting to my knowledge base. Please try again.',
        error: data.error || 'Failed to get response from assistant',
        errorDetails: {
          type: data.errorType,
          code: data.errorCode,
          status: response.status
        }
      };
    }
    
    console.log('Assistant API response received successfully');
    
    // Check if the response contains an action
    const action = parseAssistantAction(data.response);
    
    // Check if the response contains widget data
    const widgetData = parseWidgetData(data.response);
    
    // Clean the response if an action or widget was found
    const cleanedResponse = (action || widgetData) ? cleanAssistantResponse(data.response) : data.response;
    
    return {
      ...data,
      response: cleanedResponse,
      action,
      widgetData
    };
  } catch (error) {
    console.error('Error in AI assistant service:', error);
    return { 
      response: 'I apologize, but I encountered an issue processing your request. Please try again.',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}