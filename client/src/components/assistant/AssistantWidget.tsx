import React from 'react';
import { PlanRecommendations } from './PlanCard';
import { GlossaryLookup } from './GlossaryCard';
import { ComparisonCard } from './ComparisonCard';

// Type definitions for the JSON metadata that can be embedded in AI responses
export type ActionType = 'show_plan_recommendations' | 'show_glossary' | 'compare_plans';

export interface BaseWidgetData {
  type: ActionType;
  message?: string;
}

export interface PlanRecommendationsData extends BaseWidgetData {
  type: 'show_plan_recommendations';
  filters: {
    category: 'pet' | 'travel' | 'auto' | 'health';
    [key: string]: any;
  };
}

export interface GlossaryData extends BaseWidgetData {
  type: 'show_glossary';
  term: string;
  definition?: string;
  example?: string;
}

export interface ComparisonData extends BaseWidgetData {
  type: 'compare_plans';
  category: 'pet' | 'travel' | 'auto' | 'health';
  plan_ids: string[];
}

export type WidgetData = PlanRecommendationsData | GlossaryData | ComparisonData;

// Helper to extract JSON metadata from AI response text
export function extractJsonFromText(text: string): WidgetData | null {
  try {
    // Look for JSON between triple backticks
    const jsonRegex = /```json\s*({[\s\S]*?})\s*```/;
    const match = text.match(jsonRegex);
    
    if (!match || !match[1]) return null;
    
    // Parse the JSON string
    const jsonData = JSON.parse(match[1]) as WidgetData;
    
    // Validate the data has the required type field
    if (!jsonData.type) return null;
    
    return jsonData;
  } catch (error) {
    console.error('Error extracting or parsing JSON from text:', error);
    return null;
  }
}

// The main component that decides which widget to render based on the type
export function AssistantWidget({ data }: { data: WidgetData }) {
  if (!data) return null;
  
  switch (data.type) {
    case 'show_plan_recommendations':
      return <PlanRecommendations 
        category={data.filters.category} 
        filters={data.filters} 
      />;
      
    case 'show_glossary':
      return <GlossaryLookup termId={data.term} />;
      
    case 'compare_plans':
      return <ComparisonCard 
        category={data.category}
        planIds={data.plan_ids}
      />;
      
    default:
      return null;
  }
}