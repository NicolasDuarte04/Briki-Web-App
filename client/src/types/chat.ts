import { PlanProps } from '@/components/PlanRecommendationCard';

// Widget types that can be displayed in assistant messages
export type AssistantWidgetType = {
  type: 'plans';
  plans: PlanProps[];
};

// Message interface with support for text or widget content
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  widget?: AssistantWidgetType;
}