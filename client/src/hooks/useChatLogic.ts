import { useState, useRef, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAnalytics } from './use-analytics';
import { apiRequest } from '../lib/api';
import { uploadDocument, DocumentUploadResponse } from '../services/document-upload-service';
import { ChatMessage } from '../types/chat';
import { trackEvent } from '../lib/analytics';

interface ContextRequest {
  category: string;
  missingInfo: string[];
  initialData: Record<string, string>;
}

interface UseChatLogicOptions {
  storageKey?: string;
  placeholderHints?: string[];
}

interface AIResponse {
  message: string;
  suggestedPlans?: any[];
  memory?: Record<string, any>;
  response?: string; // Added for backward compatibility
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
  const [contextRequest, setContextRequest] = useState<ContextRequest | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { toast } = useToast();
  useAnalytics();

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
  const sendMessage = async (messageText: string, documentContext?: { summaryId?: string; summary?: string }) => {
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
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          message: messageText.trim(),
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          memory: memory,
          resetContext: shouldResetContext,
        }),
      });

      if (!response.body) {
        throw new Error('Streaming response not available');
      }

      setIsTyping(false);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let assistantMessageId: string | null = null;
      let fullResponse = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        
        const lines = chunk.split('\\n\\n').filter(line => line.startsWith('data: '));
        for (const line of lines) {
          const jsonString = line.substring('data: '.length);
          try {
            const data = JSON.parse(jsonString);

            if (data.error) throw new Error(data.error);

            if (data.type === 'context_request') {
              setContextRequest(data.payload);
              // You might want to add a placeholder message like "Please fill out the form"
              return; // Stop processing the stream
            }

            fullResponse += data.content || '';

            if (assistantMessageId === null) {
              const newAssistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: data.content,
                role: 'assistant',
                timestamp: new Date(),
                type: 'text',
              };
              assistantMessageId = newAssistantMessage.id;
              addMessage(newAssistantMessage);
            } else {
              updateMessage(assistantMessageId, {
                content: fullResponse,
              });
            }
          } catch (e) {
            console.error('Error parsing stream data:', e);
          }
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Briki Debug] Error:', error);
      }
      addMessage({
        id: (Date.now() + 1).toString(),
        content: `Lo siento, hubo un error al procesar tu solicitud.`,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleContextFormSubmit = (data: Record<string, string>) => {
    const syntheticMessage = Object.values(data).join(', ');
    setContextRequest(null);
    sendMessage(syntheticMessage);
  };

  const clearContextRequest = () => {
    setContextRequest(null);
  };

  // Handle document upload
  const handleDocumentUpload = async (file: File) => {
    setIsUploadingDocument(true);
    
    const messageId = `loading-doc-${Date.now()}`;
    const loadingMessage: ChatMessage = {
      id: messageId,
      content: '📄 Analizando documento...',
      role: 'assistant',
      timestamp: new Date(),
      type: 'document',
      metadata: {
        fileName: file.name,
        fileSize: file.size
      }
    };
    
    addMessage(loadingMessage);
    
    try {
      const response = await uploadDocument(file);
      
      // Ensure response has a usable summary
      const safeSummary = response.summary || 'Resumen no disponible. El análisis fue exitoso pero no se pudo generar un resumen detallado.';
      
      // Extract document type and generate contextual response
      const docInfo = extractDocumentInfo(safeSummary);
      const contextualResponse = generateContextualResponse(docInfo);
      
      updateMessage(messageId, {
        content: contextualResponse,
        type: 'document',
        metadata: {
          summaryId: response.summaryId,
          fileName: response.fileName,
          fileSize: response.fileSize
        },
        suggestions: [
          '¿Quieres comparar esta póliza con otras similares?',
          `¿Te gustaría ver opciones con mejor cobertura ${docInfo.type === 'health' ? 'médica' : 'general'}?`,
          '¿Quieres cotizar este tipo de seguro con diferentes compañías?'
        ]
      });
      
      // Add to document history
      setDocumentHistory(prev => [...prev, response]);
      
      // Update memory with document info including the summary
      setMemory(prev => ({
        ...prev,
        lastUploadedDocument: {
          fileName: response.fileName,
          fileSize: response.fileSize,
          uploadTime: new Date().toISOString(),
          summaryId: response.summaryId,
          summary: response.summary
        }
      }));
      
      trackEvent('document_upload', 'Assistant', file.name, {
        fileSize: file.size,
        fileType: file.type
      });
      
      toast({
        title: "Documento procesado ✔️",
        description: "El resumen del documento está listo.",
      });
      
      // Return the response so sendMessageWithDocument can use it
      return response;
      
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Briki Debug] Upload error:', error);
      }
      
      const errorMessage = error instanceof Error ? error.message : 'No se pudo procesar el documento PDF.';
      
      // Update the loading message to show error instead of removing it
      updateMessage(messageId, {
        content: `❌ Error al procesar documento: ${errorMessage}`,
        type: 'document',
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          isError: true,
          onRetry: () => handleDocumentUpload(file)
        }
      });
      
      toast({
        title: "Error al procesar documento",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
      
    } finally {
      setIsUploadingDocument(false);
    }
  };

  // Helper function to extract document type and key info
  const extractDocumentInfo = (summary: string): { type: string; coverage: string[] } => {
    const lowerSummary = summary.toLowerCase();
    let type = 'general';
    
    if (lowerSummary.includes('salud') || lowerSummary.includes('médic')) {
      type = 'health';
    } else if (lowerSummary.includes('auto') || lowerSummary.includes('vehículo')) {
      type = 'auto';
    } else if (lowerSummary.includes('viaje') || lowerSummary.includes('viajero')) {
      type = 'travel';
    } else if (lowerSummary.includes('mascota') || lowerSummary.includes('pet')) {
      type = 'pet';
    }

    // Extract coverage points
    const coverageMatch = summary.match(/Coberturas principales:(.*?)(?=\n\n|$)/s);
    const coverage = coverageMatch 
      ? coverageMatch[1].split('\n').map(line => line.trim()).filter(Boolean)
      : [];

    return { type, coverage };
  };

  // Helper function to generate contextual response
  const generateContextualResponse = (docInfo: { type: string; coverage: string[] }): string => {
    const typeText = {
      health: 'seguro de salud',
      auto: 'seguro de auto',
      travel: 'seguro de viaje',
      pet: 'seguro de mascota',
      general: 'seguro'
    }[docInfo.type];

    let response = `He analizado el documento. Es un ${typeText} que incluye las siguientes coberturas principales:\n\n`;
    
    if (docInfo.coverage.length > 0) {
      response += docInfo.coverage.map(c => `• ${c}`).join('\n');
    } else {
      response += '• Cobertura básica del seguro\n';
    }

    response += '\n\n¿Hay algo específico que te gustaría revisar o comparar?';
    
    return response;
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

    let documentContext: { summaryId?: string; summary?: string } | undefined;

    // Upload document first if provided
    if (fileToUpload) {
      const uploadResponse = await handleDocumentUpload(fileToUpload);
      if (uploadResponse) {
        documentContext = {
          summaryId: uploadResponse.summaryId,
          summary: uploadResponse.summary
        };
      }
    }

    // Then send message if provided, including document context
    if (textToSend?.trim()) {
      await sendMessage(textToSend, documentContext);
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
    
    trackEvent('chat_reset', 'Assistant', 'Chat Reset');
    
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
    contextRequest,
    
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
    handleContextFormSubmit,
    clearContextRequest,
    
    // Utils
    scrollToBottom
  };
} 