// Assistant types for server-side use

export interface UserMemory {
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
  lastViewedCategory?: 'travel' | 'auto' | 'pet' | 'health';
}

// Base action interface
export interface AssistantAction {
  type: string;
}

// Action to recommend a specific insurance plan
export interface RecommendPlanAction extends AssistantAction {
  type: 'recommend_plan';
  category: 'travel' | 'auto' | 'pet' | 'health';
  planId: string;
}

// Action to navigate to a specific page
export interface NavigateToPageAction extends AssistantAction {
  type: 'navigate_to_page';
  path: string;
  label: string;
}

// Action to compare insurance plans
export interface ComparePlansAction extends AssistantAction {
  type: 'compare_plans';
  category: 'travel' | 'auto' | 'pet' | 'health';
  planIds: string[];
}

// Action to explain an insurance term
export interface ExplainTermAction extends AssistantAction {
  type: 'explain_term';
  term: string;
  explanation: string;
}

// Widget types for rendering special UI components in messages
export type AssistantWidgetType = 
  | RecommendPlanAction
  | NavigateToPageAction 
  | ComparePlansAction 
  | ExplainTermAction;

// Assistant API request and response types
export interface AssistantRequest {
  message: string;
  userMemory?: UserMemory;
}

export interface AssistantResponse {
  message: string;
  action?: AssistantWidgetType;
  updatedMemory?: Partial<UserMemory>;
}

export interface APIStatusResponse {
  available: boolean;
  message?: string;
}