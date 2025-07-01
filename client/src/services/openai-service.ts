import { apiRequest } from '../lib/api';

/**
 * Send a message to the AI assistant backend
 */
export async function sendMessageToAI(
  message: string, 
  conversationHistory: any[] = [],
  memory: any = {},
  resetContext: boolean = false
): Promise<any> {
  console.log('🚀 sendMessageToAI called with:', { message, historyLength: conversationHistory.length, resetContext });
  
  try {
    console.log('📡 Making API request to /api/ai/chat...');

    const data = await apiRequest('/api/ai/chat', {
      method: 'POST',
      data: {
        message,
        conversationHistory,
        memory,
        resetContext,
      },
    });

    console.log('✅ AI response received', data);
    return data;
  } catch (error) {
    console.error('💥 Error sending message to AI:', error);
    throw error;
  }
}

/**
 * Fetch conversation history for the authenticated user
 */
export async function fetchConversationHistory(page: number = 1, limit: number = 20): Promise<any> {
  try {
    console.log('📡 Fetching conversation history...');

    const data = await apiRequest(`/api/ai/conversations?page=${page}&limit=${limit}`, {
      method: 'GET',
    });

    console.log('✅ Conversation history received', data);
    return data;
  } catch (error) {
    console.error('💥 Error fetching conversation history:', error);
    throw error;
  }
}

/**
 * Fetch a specific conversation with its context
 */
export async function fetchConversation(conversationId: number): Promise<any> {
  try {
    console.log('📡 Fetching conversation:', conversationId);

    const data = await apiRequest(`/api/ai/conversations/${conversationId}`, {
      method: 'GET',
    });

    console.log('✅ Conversation received', data);
    return data;
  } catch (error) {
    console.error('💥 Error fetching conversation:', error);
    throw error;
  }
}
