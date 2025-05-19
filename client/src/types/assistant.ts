/**
 * Types for AI Assistant functionality
 */

// Basic message structure for the assistant
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  widgetData?: any;
  error?: boolean;
}

// Response from the AI service
export interface AIResponse {
  message: string;
  widgetData?: any;
  action?: AIAction | null;
}

// Possible assistant actions
export type AIActionType = 
  | 'navigate_to_quote_flow'
  | 'add_plan_to_comparison'
  | 'show_glossary_term';

// Base action interface
export interface AIAction {
  type: AIActionType;
}

// Navigate to quote flow action
export interface NavigateToQuoteFlowAction extends AIAction {
  type: 'navigate_to_quote_flow';
  category: string;
}

// Add plan to comparison action
export interface AddPlanToComparisonAction extends AIAction {
  type: 'add_plan_to_comparison';
  planId: string;
  category: string;
}

// Show glossary term action
export interface ShowGlossaryTermAction extends AIAction {
  type: 'show_glossary_term';
  term: string;
  definition: string;
}

// Widget data types
export enum AIWidgetType {
  GLOSSARY = 'glossary',
  VISUAL_COMPARISON = 'visual_comparison',
  PLAN_RECOMMENDATION = 'plan_recommendation',
  FEATURE_HIGHLIGHT = 'feature_highlight',
}

// Glossary widget data
export interface GlossaryWidgetData {
  type: AIWidgetType.GLOSSARY;
  term: string;
  definition: string;
  relatedTerms?: { term: string; definition: string }[];
}

// Visual comparison widget data
export interface VisualComparisonWidgetData {
  type: AIWidgetType.VISUAL_COMPARISON;
  title: string;
  items: {
    name: string;
    features: { name: string; value: string | number | boolean }[];
    score?: number;
    highlight?: boolean;
  }[];
}

// Plan recommendation widget data
export interface PlanRecommendationWidgetData {
  type: AIWidgetType.PLAN_RECOMMENDATION;
  plans: {
    id: string;
    name: string;
    provider: string;
    price: number;
    features: string[];
    matchScore: number;
    category: string;
  }[];
  recommendationReason: string;
}

// Feature highlight widget data
export interface FeatureHighlightWidgetData {
  type: AIWidgetType.FEATURE_HIGHLIGHT;
  feature: string;
  description: string;
  benefits: string[];
  imageUrl?: string;
}

// Combine all widget data types
export type AIWidgetData = 
  | GlossaryWidgetData 
  | VisualComparisonWidgetData
  | PlanRecommendationWidgetData
  | FeatureHighlightWidgetData;