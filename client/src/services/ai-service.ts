import { apiRequest } from '@/lib/queryClient';

// Widget Types
export interface GlossaryWidgetData {
  type: 'show_glossary';
  term: string;
  definition: string;
  example?: string;
  learnMoreUrl?: string;
}

export interface VisualComparisonWidgetData {
  type: 'show_comparison';
  title: string;
  description?: string;
  items: Array<{
    label: string;
    value: string;
    percentage: number;
  }>;
}

export type AssistantWidgetType = GlossaryWidgetData | VisualComparisonWidgetData;

// Action Types
export type AssistantActionType = 
  | 'navigate_to_quote_flow'
  | 'open_comparison_tool'
  | 'filter_plan_results'
  | 'navigate_to_page';

export interface NavigateToQuoteFlowAction {
  type: 'navigate_to_quote_flow';
  category: string;
  message?: string;
  preload?: Record<string, any>;
}

export interface OpenComparisonToolAction {
  type: 'open_comparison_tool';
  category?: string;
  plans?: string[];
  message?: string;
}

export interface FilterPlanResultsAction {
  type: 'filter_plan_results';
  category: string;
  filters: Record<string, any>;
  message?: string;
}

export interface NavigateToPageAction {
  type: 'navigate_to_page';
  path: string;
  message?: string;
}

export type AssistantAction = 
  | NavigateToQuoteFlowAction
  | OpenComparisonToolAction 
  | FilterPlanResultsAction
  | NavigateToPageAction;

// Response Types
export interface AskAssistantResponseWithAction {
  response: string;
  widgetData?: AssistantWidgetType;
  action?: AssistantAction;
  error?: boolean;
}

// Memory Context
export interface UserMemoryContext {
  pet?: {
    type?: string;
    age?: number;
    breed?: string;
    conditions?: string[];
  };
  travel?: {
    destination?: string;
    duration?: string;
    date?: string;
    travelers?: number;
    activities?: string[];
  };
  vehicle?: {
    make?: string;
    model?: string;
    year?: number;
    value?: string;
  };
  health?: {
    age?: number;
    conditions?: string[];
    medications?: string[];
  };
}

/**
 * Main function to ask the AI assistant a question
 * @param message The user's message to the assistant
 * @param memoryContext Optional memory context to provide to the assistant
 */
export async function askAssistant(
  message: string,
  memoryContext?: UserMemoryContext
): Promise<AskAssistantResponseWithAction> {
  try {
    // Add a check for empty message
    if (!message.trim()) {
      return {
        response: "I don't see a message there. How can I help you with insurance?",
        error: false
      };
    }

    // Create request payload
    const payload = {
      message,
      context: memoryContext || {}
    };

    // Make API request
    const response = await apiRequest('POST', '/api/ai/chat', payload);
    
    if (!response.ok) {
      // Check for quota errors specifically
      if (response.status === 429) {
        return {
          response: "I'm currently experiencing high demand. Please try again in a few moments.",
          error: true
        };
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract widget data if present
    let widgetData: AssistantWidgetType | undefined;
    if (data.response) {
      widgetData = parseWidgetData(data.response);
    }
    
    // Clean response of any potential JSON
    const cleanedResponse = cleanResponse(data.response || "I'm having trouble generating a response right now.");
    
    return {
      response: cleanedResponse,
      widgetData,
      action: data.action,
      error: false
    };
  } catch (error) {
    console.error("Error asking assistant:", error);
    return {
      response: "I'm having technical difficulties right now. Please try again in a moment.",
      error: true
    };
  }
}

/**
 * Function to explain an insurance term
 * @param term The insurance term to explain
 */
export async function explainInsuranceTerm(term: string): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/ai/explain-term', { term });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.explanation || "I couldn't find information about that term.";
  } catch (error) {
    console.error("Error explaining term:", error);
    return "I'm having trouble accessing my knowledge base right now.";
  }
}

/**
 * Function to generate insurance plan recommendations
 * @param category The insurance category (e.g., travel, auto, pet, health)
 * @param criteria The criteria for the recommendation
 */
export async function generateInsuranceRecommendation(
  category: string,
  criteria: Record<string, any>
): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/ai/recommend', { 
      category, 
      criteria 
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.recommendation || "I couldn't generate a recommendation based on those criteria.";
  } catch (error) {
    console.error("Error generating recommendation:", error);
    return "I'm having trouble generating a recommendation right now.";
  }
}

/**
 * Function to compare insurance plans
 * @param plans Array of plans to compare
 */
export async function comparePlans(plans: any[]): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/ai/compare-plans', { plans });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.comparison || "I couldn't compare those plans.";
  } catch (error) {
    console.error("Error comparing plans:", error);
    return "I'm having trouble comparing these plans right now.";
  }
}

/**
 * Helper function to parse widget data from the assistant's response
 * Looks for JSON objects that define widgets and extracts them
 * @param response The text response from the assistant
 */
export function parseWidgetData(response: string): AssistantWidgetType | undefined {
  try {
    // Simple regex to find JSON objects in the response
    const jsonMatch = response.match(/\{[\s\S]*?\}/);
    
    if (jsonMatch) {
      const potentialJson = jsonMatch[0];
      const widgetData = JSON.parse(potentialJson);
      
      // Validate that it's a widget
      if (
        widgetData && 
        typeof widgetData === 'object' && 
        'type' in widgetData &&
        (widgetData.type === 'show_glossary' || widgetData.type === 'show_comparison')
      ) {
        return widgetData as AssistantWidgetType;
      }
    }
    
    return undefined;
  } catch (error) {
    console.error("Error parsing widget data:", error);
    return undefined;
  }
}

/**
 * Helper function to clean any JSON from the response
 * @param response The text response from the assistant
 */
function cleanResponse(response: string): string {
  // Remove JSON objects from the response
  return response.replace(/\{[\s\S]*?\}/g, '').trim();
}

/**
 * Test function to check if the AI assistant API is working
 */
export async function testAIAssistantConnection(): Promise<{ success: boolean; error?: string; status?: number }> {
  try {
    const response = await apiRequest('GET', '/api/ai/test');
    
    if (!response.ok) {
      return {
        success: false,
        error: `API error: ${response.status}`,
        status: response.status
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      ...data
    };
  } catch (error) {
    console.error("Error testing AI connection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}