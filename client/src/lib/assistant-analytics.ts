import { trackEvent, EventCategory } from './analytics';
import { AssistantActionType } from '@/services/ai-service';

/**
 * Track when a new assistant session begins
 */
export function startAssistantSession(metadata: {
  initialMessages: number;
  memoryState: boolean;
}) {
  trackEvent(
    'assistant_session_start',
    EventCategory.ENGAGEMENT,
    undefined,
    undefined,
    metadata
  );
}

/**
 * Track when an assistant session ends
 */
export function endAssistantSession(metadata: {
  totalMessages: number;
  userMessages: number;
  assistantMessages: number;
  memoryUsed: boolean;
}) {
  trackEvent(
    'assistant_session_end',
    EventCategory.ENGAGEMENT,
    undefined,
    undefined,
    metadata
  );
}

/**
 * Track when a user sends a message to the assistant
 */
export function trackUserMessage(
  message: string,
  metadata: {
    messageId: string;
    memoryContext: boolean;
    conversationLength: number;
  }
) {
  trackEvent(
    'user_message_sent',
    EventCategory.ENGAGEMENT,
    undefined,
    message.length,
    metadata
  );
}

/**
 * Track when the assistant responds to a user message
 */
export function trackAssistantResponse(
  messageLength: number,
  hasWidget: boolean,
  hasAction: boolean,
  metadata: {
    messageId: string;
    hasError: boolean;
    widgetType: string | null;
  }
) {
  trackEvent(
    'assistant_response',
    EventCategory.ENGAGEMENT,
    metadata.hasError ? 'error' : 'success',
    messageLength,
    {
      ...metadata,
      hasWidget,
      hasAction
    }
  );
}

/**
 * Track when an assistant action is triggered
 */
export function trackAssistantAction(
  actionType: AssistantActionType,
  metadata: {
    actionCategory?: string | null;
    conversationLength: number;
    hasCustomMessage: boolean;
  }
) {
  trackEvent(
    'assistant_action_triggered',
    EventCategory.ACTION,
    actionType,
    undefined,
    metadata
  );
}

/**
 * Track when a user clicks on a suggested prompt
 */
export function trackSuggestedPromptClick(
  prompt: string,
  metadata: {
    source: 'assistant' | 'home';
    position: number;
  }
) {
  trackEvent(
    'suggested_prompt_click',
    EventCategory.ENGAGEMENT,
    metadata.source,
    prompt.length,
    metadata
  );
}

/**
 * Track when a glossary term is displayed
 */
export function trackGlossaryTermDisplay(
  term: string,
  metadata: {
    messageId: string;
  }
) {
  trackEvent(
    'glossary_term_display',
    EventCategory.CONTENT,
    'insurance_term',
    undefined,
    {
      ...metadata,
      term
    }
  );
}

/**
 * Track when a visual explainer is displayed
 */
export function trackVisualExplainerDisplay(
  title: string,
  metadata: {
    messageId: string;
  }
) {
  trackEvent(
    'visual_explainer_display',
    EventCategory.CONTENT,
    'comparison',
    undefined,
    {
      ...metadata,
      title
    }
  );
}

/**
 * Track when the assistant launches a quote flow
 */
export function trackQuoteFlowLaunch(
  category: string,
  metadata: {
    source: 'assistant' | 'category_page' | 'home';
    hasPreloadData: boolean;
  }
) {
  trackEvent(
    'quote_flow_launch',
    EventCategory.CONVERSION,
    category,
    undefined,
    metadata
  );
}