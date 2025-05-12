import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

type AIAssistantOptions = {
  initialMessages?: Message[];
  systemMessage?: string;
};

export function useAIAssistant({ 
  initialMessages = [], 
  systemMessage 
}: AIAssistantOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isInitialPrompt, setIsInitialPrompt] = useState(true);

  // Chat message mutation
  const chatMutation = useMutation({
    mutationFn: async (content: string) => {
      // Format messages for the API (removing ids and timestamps)
      const apiMessages = messages
        .filter(m => m.role !== 'system')
        .map(({ role, content }) => ({ role, content }));
      
      // Add the new user message
      apiMessages.push({ role: 'user', content });

      // Make the API request
      const response = await apiRequest('POST', '/api/ai/chat', { messages: apiMessages });
      return response.json();
    },
    onError: (error) => {
      console.error('Error in chat mutation:', error);
      
      // Add an error message to the chat
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting to my knowledge base. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  // Recommendation mutation
  const recommendMutation = useMutation({
    mutationFn: async ({ 
      category, 
      criteria 
    }: { 
      category: string; 
      criteria: Record<string, any> 
    }) => {
      const response = await apiRequest('POST', '/api/ai/recommend', { category, criteria });
      return response.json();
    }
  });

  // Term explanation mutation
  const explainTermMutation = useMutation({
    mutationFn: async (term: string) => {
      const response = await apiRequest('POST', '/api/ai/explain-term', { term });
      return response.json();
    }
  });

  // Plans comparison mutation
  const comparePlansMutation = useMutation({
    mutationFn: async (plans: any[]) => {
      const response = await apiRequest('POST', '/api/ai/compare-plans', { plans });
      return response.json();
    }
  });

  // Send a message to the assistant
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add the user message to the state
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    // If this is the first message and we have a system message, add it
    if (isInitialPrompt && systemMessage) {
      const systemMsg: Message = {
        id: `system-${Date.now()}`,
        role: 'system',
        content: systemMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, systemMsg, userMessage]);
      setIsInitialPrompt(false);
    } else {
      setMessages(prev => [...prev, userMessage]);
    }

    try {
      // Add a temporary loading message
      const loadingId = `loading-${Date.now()}`;
      const loadingMessage: Message = {
        id: loadingId,
        role: 'assistant',
        content: '...',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, loadingMessage]);

      // Send the message to the API
      const result = await chatMutation.mutateAsync(content);

      // Replace the loading message with the actual response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== loadingId);
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.response,
          timestamp: new Date()
        };
        return [...filtered, assistantMessage];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Error handling is done in the mutation callbacks
    }
  }, [messages, isInitialPrompt, systemMessage, chatMutation]);

  // Get insurance recommendation
  const getRecommendation = useCallback(async (
    category: string, 
    criteria: Record<string, any>
  ) => {
    try {
      const result = await recommendMutation.mutateAsync({ category, criteria });
      return result.recommendation;
    } catch (error) {
      console.error('Error getting recommendation:', error);
      throw error;
    }
  }, [recommendMutation]);

  // Explain an insurance term
  const explainTerm = useCallback(async (term: string) => {
    try {
      const result = await explainTermMutation.mutateAsync(term);
      return result.explanation;
    } catch (error) {
      console.error('Error explaining term:', error);
      throw error;
    }
  }, [explainTermMutation]);

  // Compare insurance plans
  const comparePlans = useCallback(async (plans: any[]) => {
    try {
      const result = await comparePlansMutation.mutateAsync(plans);
      return result.comparison;
    } catch (error) {
      console.error('Error comparing plans:', error);
      throw error;
    }
  }, [comparePlansMutation]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setIsInitialPrompt(true);
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: chatMutation.isPending,
    isError: chatMutation.isError,
    getRecommendation,
    explainTerm,
    comparePlans,
    isRecommendationLoading: recommendMutation.isPending,
    isTermExplanationLoading: explainTermMutation.isPending,
    isComparisonLoading: comparePlansMutation.isPending
  };
}