import { PlanProps } from '@/components/PlanRecommendationCard';

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
  sender: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  widget?: AssistantWidgetType;
  detectedIntent?: UserIntentType;
  isLoading?: boolean;
}