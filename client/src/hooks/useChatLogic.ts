import { useState, useRef, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAnalytics } from './use-analytics';
import { apiRequest } from '../lib/api';
import { uploadDocument, DocumentUploadResponse } from '../services/document-upload-service';
import { ChatMessage } from '../types/chat';

interface UseChatLogicOptions {
  storageKey?: string;
  placeholderHints?: string[];
}

interface AIResponse {
  message: string;
  suggestedPlans?: any[];
  memory?: Record<string, any>;
}

export function useChatLogic(options: UseChatLogicOptions = {}) {
  const {
    storageKey = 'briki_chat_history',
    placeholderHints = [
      "¿Buscas seguro para tu carro?",
      "¿Vas a viajar? Pregúntame sobre seguros.",
      "¿Tu mascota está asegurada?",
      "¿Necesitas un plan de salud familiar?",
      "¿Quieres comparar coberturas?"
    ]
  } = options;

  // State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = sessionStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [shouldResetContext, setShouldResetContext] = useState(false);
  const [memory, setMemory] = useState<Record<string, any>>({});
  const [shownPlanIds, setShownPlanIds] = useState<Set<number>>(new Set());
  const [documentHistory, setDocumentHistory] = useState<DocumentUploadResponse[]>([]);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();

  // Auto-save messages to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  // Rotate placeholder suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((current) => 
        current === placeholderHints.length - 1 ? 0 : current + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [placeholderHints]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add message
  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  // Update message
  const updateMessage = (messageId: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ));
  };

  // Remove message
  const removeMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  // Send message
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageText.trim(),
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    addMessage(userMessage);
    setInput('');
    setIsTyping(true);

    try {
      const responseData = await apiRequest('/api/ai/chat', {
        method: 'POST',
        data: {
          message: messageText.trim(),
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          memory: memory,
          resetContext: shouldResetContext
        }
      });

      if (shouldResetContext) {
        setShouldResetContext(false);
      }

      const data: AIResponse = responseData;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[Briki Debug] AI Response:', data);
      }
      
      // Update memory
      if (data.memory) {
        setMemory(data.memory);
      }
      
      // Process plans
      const plans = Array.isArray(data.suggestedPlans) ? data.suggestedPlans : [];
      
      // Filter out already shown plans
      const newPlans = plans.filter(plan => !shownPlanIds.has(plan.id));
      if (newPlans.length > 0) {
        const newShownIds = new Set(shownPlanIds);
        newPlans.forEach(plan => newShownIds.add(plan.id));
        setShownPlanIds(newShownIds);
      }
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };

      const newMessages = [assistantMessage];
      
      if (newPlans.length > 0) {
        newMessages.push({
          id: (Date.now() + 2).toString(),
          content: '',
          role: 'assistant',
          timestamp: new Date(),
          type: 'plans',
          metadata: { plans: newPlans }
        });
      }

      newMessages.forEach(msg => addMessage(msg));
      
      if (newPlans.length > 0) {
        trackEvent('ai_recommended_plans', {
          category: 'Assistant',
          action: 'RecommendPlans',
          label: 'AI Assistant',
          value: newPlans.length
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Briki Debug] Error:', error);
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      addMessage({
        id: (Date.now() + 1).toString(),
        content: `Lo siento, hubo un error al procesar tu solicitud. Error: ${errorMessage}`,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (file: File) => {
    setIsUploadingDocument(true);
    
    const loadingMessage: ChatMessage = {
      id: `loading-doc-${Date.now()}`,
      content: '📄 Procesando documento...',
      role: 'assistant',
      timestamp: new Date(),
      type: 'text'
    };
    
    addMessage(loadingMessage);
    
    try {
      const response = await uploadDocument(file);
      
      updateMessage(loadingMessage.id, {
        content: response.summary,
        type: 'document',
        metadata: {
          summaryId: response.summaryId,
          fileName: response.fileName,
          fileSize: response.fileSize
        }
      });
      
      // Add to document history
      setDocumentHistory(prev => [...prev, response]);
      
      // Update memory with document info
      setMemory(prev => ({
        ...prev,
        lastUploadedDocument: {
          fileName: response.fileName,
          fileSize: response.fileSize,
          uploadTime: new Date().toISOString()
        }
      }));
      
      trackEvent('document_upload', {
        category: 'Assistant',
        action: 'UploadDocument',
        label: file.name,
        metadata: {
          fileSize: file.size,
          fileType: file.type
        }
      });
      
      toast({
        title: "Documento procesado",
        description: "El resumen del documento está listo.",
      });
      
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Briki Debug] Upload error:', error);
      }
      
      removeMessage(loadingMessage.id);
      
      toast({
        title: "Error al procesar documento",
        description: error instanceof Error ? error.message : "No se pudo procesar el documento PDF.",
        variant: "destructive",
      });
      
    } finally {
      setIsUploadingDocument(false);
    }
  };

  // Send message with optional document
  const sendMessageWithDocument = async (messageText?: string, file?: File | null) => {
    const textToSend = messageText || input;
    const fileToUpload = file !== undefined ? file : pendingFile;
    
    // Check if we have something to send
    if (!textToSend?.trim() && !fileToUpload) return;
    
    // If already processing, return
    if (isTyping || isUploadingDocument) return;

    // Clear inputs immediately
    if (!messageText) {
      setInput('');
    }
    setPendingFile(null);

    // Upload document first if provided
    if (fileToUpload) {
      await handleDocumentUpload(fileToUpload);
    }

    // Then send message if provided
    if (textToSend?.trim()) {
      await sendMessage(textToSend);
    }
  };

  // Reset chat
  const resetChat = () => {
    setMessages([]);
    setInput('');
    setMemory({});
    setShownPlanIds(new Set());
    setDocumentHistory([]);
    setShouldResetContext(true);
    setPendingFile(null);
    sessionStorage.removeItem(storageKey);
    
    trackEvent('chat_reset', {
      category: 'Assistant',
      action: 'Reset',
      label: 'Chat Reset'
    });
    
    toast({
      title: "Conversación reiniciada",
      description: "Puedes empezar de nuevo.",
    });
  };

  return {
    // State
    messages,
    input,
    isTyping,
    isUploadingDocument,
    currentSuggestion,
    memory,
    placeholderHints,
    messagesEndRef,
    documentHistory,
    pendingFile,
    
    // Actions
    setInput,
    sendMessage,
    handleDocumentUpload,
    resetChat,
    addMessage,
    updateMessage,
    removeMessage,
    setPendingFile,
    sendMessageWithDocument,
    
    // Utils
    scrollToBottom
  };
} 