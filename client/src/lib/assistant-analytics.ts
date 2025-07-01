import { trackEvent } from './analytics';
import { EventCategory } from '../constants/analytics';
// import { AssistantActionType } from '../services/ai-service'; // Module doesn't exist
type AssistantActionType = string; // Temporary fix

/**
 * Track when a new assistant session begins
 */
export function startAssistantSession(metadata: {
  initialMessages: number;
  memoryState: boolean;
}) {
  trackEvent(
    'assistant_session_start',
    EventCategory.Assistant,
    'session_start'
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
    EventCategory.Assistant,
    'session_end'
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
    EventCategory.Assistant,
    'user_message',
    message.length
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
    EventCategory.Assistant,
    metadata.hasError ? 'error' : 'success',
    messageLength
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
    EventCategory.Assistant,
    actionType
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
    EventCategory.Assistant,
    metadata.source,
    prompt.length
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
    EventCategory.Assistant,
    'glossary_term'
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
    EventCategory.Assistant,
    'visual_explainer'
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
    EventCategory.Assistant,
    category
  );
}