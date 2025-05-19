import { InsuranceCategory } from '@/types/insurance';

/**
 * Available assistant widget types
 */
export enum AssistantWidgetType {
  GLOSSARY = 'glossary',
  VISUAL_COMPARISON = 'visual_comparison',
  FAQ = 'faq',
  PLAN_RECOMMENDATION = 'plan_recommendation',
}

/**
 * Base interface for all assistant widgets
 */
export interface BaseWidgetData {
  type: AssistantWidgetType;
}

/**
 * Glossary widget data for displaying insurance terms
 */
export interface GlossaryWidgetData extends BaseWidgetData {
  type: AssistantWidgetType.GLOSSARY;
  term: string;
  definition: string;
  examples?: string[];
}

/**
 * Visual comparison widget for comparing insurance plans
 */
export interface VisualComparisonWidgetData extends BaseWidgetData {
  type: AssistantWidgetType.VISUAL_COMPARISON;
  plans: {
    planId: string;
    name: string;
    provider: string;
    price: number;
    features: string[];
    category: InsuranceCategory;
  }[];
  comparisonFields: string[];
}

/**
 * FAQ widget to present common questions and answers
 */
export interface FAQWidgetData extends BaseWidgetData {
  type: AssistantWidgetType.FAQ;
  question: string;
  answer: string;
  relatedQuestions?: string[];
}

/**
 * Plan recommendation widget to suggest plans for the user
 */
export interface PlanRecommendationWidgetData extends BaseWidgetData {
  type: AssistantWidgetType.PLAN_RECOMMENDATION;
  recommendedPlans: {
    planId: string;
    name: string;
    provider: string;
    price: number;
    matchScore: number;
    features: string[];
    category: InsuranceCategory;
  }[];
  userInputs: Record<string, any>;
  reasonsForRecommendation: string[];
}

/**
 * Union type of all widget data types
 */
export type AssistantWidgetData = 
  | GlossaryWidgetData
  | VisualComparisonWidgetData
  | FAQWidgetData
  | PlanRecommendationWidgetData;

/**
 * Assistant action types
 */
export enum AssistantActionType {
  NAVIGATE_TO_QUOTE_FLOW = 'navigate_to_quote_flow',
  ADD_PLAN_TO_COMPARISON = 'add_plan_to_comparison',
  SHOW_GLOSSARY_TERM = 'show_glossary_term',
}

/**
 * Base interface for all assistant actions
 */
export interface BaseAssistantAction {
  type: AssistantActionType;
}

/**
 * Navigate to quote flow action
 */
export interface NavigateToQuoteFlowAction extends BaseAssistantAction {
  type: AssistantActionType.NAVIGATE_TO_QUOTE_FLOW;
  category: InsuranceCategory;
  prefillData?: Record<string, any>;
}

/**
 * Add plan to comparison action
 */
export interface AddPlanToComparisonAction extends BaseAssistantAction {
  type: AssistantActionType.ADD_PLAN_TO_COMPARISON;
  planId: string;
  category: InsuranceCategory;
}

/**
 * Show glossary term action
 */
export interface ShowGlossaryTermAction extends BaseAssistantAction {
  type: AssistantActionType.SHOW_GLOSSARY_TERM;
  term: string;
}

/**
 * Union type of all assistant actions
 */
export type AssistantAction = 
  | NavigateToQuoteFlowAction
  | AddPlanToComparisonAction 
  | ShowGlossaryTermAction;

/**
 * Message interface for chat
 */
export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isLoading?: boolean;
  error?: boolean;
  widgetData?: AssistantWidgetData | null;
}

/**
 * User memory for the assistant
 */
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
}

/**
 * Basic insurance types for referencing across the app
 */
export interface InsuranceTypes {
  travel: string;
  auto: string;
  pet: string;
  health: string;
}