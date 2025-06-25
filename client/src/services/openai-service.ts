import { apiRequest } from '@/lib/api';

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
