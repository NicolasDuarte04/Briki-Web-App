// import { PlanProps } from '../components/PlanRecommendationCard'; // Module doesn't exist
type PlanProps = any; // Temporary fix

// Widget types that can be displayed in assistant messages
export type AssistantWidgetType = 
  | {
      type: 'plans';
      plans: PlanProps[];
      ctaText?: string;
      ctaLink?: string;
    }
  | {
      type: 'follow-up-recommendation';
      mainPlan: PlanProps;
      relatedPlans: PlanProps[];
      title?: string;
      subtitle?: string;
      ctaText?: string; 
      ctaLink?: string;
    };

// User intent classification to drive contextual recommendations
export type UserIntentType = 
  | 'auto_insurance'
  | 'travel_insurance'
  | 'health_insurance' 
  | 'pet_insurance'
  | 'home_insurance'
  | 'general_question'
  | 'plan_comparison'
  | 'pricing_question'
  | 'unknown';

// Message interface with support for text or widget content
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  type?: 'text' | 'plans' | 'document';
  timestamp?: Date;
  metadata?: Record<string, any>;
  isLoading?: boolean;
  plans?: any[]; // For backward compatibility
  plansSummary?: string; // For backward compatibility
}

export interface Plan {
  id: number;
  name: string;
  category: string;
  provider: string;
  basePrice: number;
  currency: string;
  benefits?: string[];
  features?: string[];
  isExternal?: boolean;
  externalLink?: string | null;
  isRecommended?: boolean;
}