import { useState } from 'react';
import { Send, RefreshCw, Home, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';
import NewPlanCard from './NewPlanCard';
import { trackAIAssistantEvent, trackPlanInteraction } from '../../hooks/use-analytics';
import { RealInsurancePlan } from '../../data/realPlans';
import { useLocation } from 'wouter';
import { apiRequest } from '../../lib/api';
import { FileUpload } from './FileUpload';
import { uploadDocument } from '../../services/document-upload-service';
import { useChatLogic } from '../../hooks/useChatLogic';
import { ChatMessage } from '../../types/chat';
import { useToast } from '../../hooks/use-toast';
import { DocumentHistory } from './DocumentHistory';
import { DocumentComparison } from './DocumentComparison';
import { DocumentSummary } from '../../services/document-upload-service';
import { ChatBubble } from './ChatBubble';

type Plan = RealInsurancePlan & {
  isRecommended?: boolean;
  benefits?: string[];
}

const MAX_PLANS_SHOWN = 4;
const MAX_MESSAGE_WIDTH = 'max-w-[75%]';

interface NoPlansFoundProps {
  onShowAlternatives: () => void;
}

const NoPlansFound: React.FC<NoPlansFoundProps> = ({ onShowAlternatives }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center"
  >
    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium mb-2">
      No se encontraron planes con esas características
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      Podemos explorar otras opciones que podrían interesarte
    </p>
    <Button
      variant="outline"
      onClick={onShowAlternatives}
      className="bg-white dark:bg-gray-800"
    >
      Ver otras opciones
    </Button>
  </motion.div>
);

const PlansLoadingPlaceholder: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4"
  >
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 space-y-4 animate-pulse"
      >
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
        </div>
      </div>
    ))}
  </motion.div>
);

export function BrikiAssistant() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<DocumentSummary | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  
  const {
    messages,
    input,
    isTyping,
    isUploadingDocument,
    currentSuggestion,
    placeholderHints,
    messagesEndRef,
    pendingFile,
    setInput,
    sendMessage,
    handleDocumentUpload,
    resetChat,
    addMessage,
    setPendingFile,
    sendMessageWithDocument,
  } = useChatLogic();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageWithDocument();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Track message sent
    trackAIAssistantEvent('message_sent', input.substring(0, 50), {
      has_document: !!pendingFile,
      message_length: input.length
    });
    sendMessageWithDocument();
  };

  const handleReset = () => {
    trackAIAssistantEvent('chat_reset');
    resetChat();
  };

  const handlePlanClick = (plan: Plan) => {
    trackAIAssistantEvent('plan_click', plan.provider, {
      plan_id: plan.id,
      provider: plan.provider,
      isRecommended: plan.isRecommended
    });
    
    // Also track plan interaction
    trackPlanInteraction('view', plan.id.toString(), plan.name, plan.provider);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    trackAIAssistantEvent('suggestion_clicked', suggestion);
  };

  const handleShowAlternatives = () => {
    trackAIAssistantEvent('show_alternatives_clicked');
    setInput("¿Qué otros tipos de seguros me recomiendas?");
    sendMessage("¿Qué otros tipos de seguros me recomiendas?");
  };

  const handleFileUpload = async (file: File) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Briki Debug] File uploaded:', file);
    }
    trackAIAssistantEvent('document_uploaded', file.name, {
      file_size: file.size,
      file_type: file.type
    });
    // Don't upload immediately, just set as pending
    setPendingFile(file);
  };

  const handleFileChange = (file: File | null) => {
    setPendingFile(file);
  };

  const handleViewSummary = (summary: DocumentSummary) => {
    // Format the summary content
    const formattedSummary = `📄 **Resumen del Clausulado**

🔹 **Tipo de seguro**: ${summary.insurance_type}
🏢 **Aseguradora**: ${summary.insurer_name || 'No especificada'}

✅ **Coberturas principales**:
${summary.coverage_summary ? (Array.isArray(summary.coverage_summary) ? summary.coverage_summary.map(c => `• ${c}`).join('\n') : '• ' + summary.coverage_summary) : '• No especificadas'}

⚠️ **Exclusiones importantes**:
${summary.exclusions ? (Array.isArray(summary.exclusions) ? summary.exclusions.map(e => `• ${e}`).join('\n') : '• ' + summary.exclusions) : '• No especificadas'}

💰 **Deducibles**: ${summary.deductibles || 'No especificados'}

📅 **Vigencia**: ${summary.validity_period || 'No especificada'}

---
*Documento: ${summary.filename}*`;

    // Add the summary as a new message
    addMessage({
      id: `doc-summary-${Date.now()}`,
      content: formattedSummary,
      role: 'assistant',
      type: 'document',
      metadata: {
        summaryId: summary.id,
        fileName: summary.filename,
        fileSize: summary.file_size
      }
    });

    // Set selected document for comparison
    setSelectedDocument(summary);
    
    // Scroll to the new message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Document History - Absolute positioned at top */}
      <div className="absolute top-0 left-0 right-0 px-4 pt-4 z-10">
        <DocumentHistory 
          onViewSummary={handleViewSummary}
          className="mb-4"
        />
      </div>

      {/* Chat Window - Fills available space with padding for header and footer */}
      <div 
        className="flex-1 overflow-y-auto px-4 pt-20 pb-24 space-y-6"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center h-full text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full blur-xl" />
              <div className="relative p-6 rounded-full bg-gradient-to-br from-blue-600/5 to-cyan-500/5 dark:from-blue-600/30 dark:to-cyan-500/30 border border-blue-100 dark:border-blue-800">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                    Briki
                  </h2>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Tu asistente de seguros
                  </p>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-md space-y-6"
            >
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Pregúntame sobre seguros de auto, viaje, salud o mascotas. 
                Estoy aquí para ayudarte a encontrar la mejor protección.
              </p>
              
              <div className="h-[40px] relative">
                <AnimatePresence mode="wait">
                  <motion.button
                    key={currentSuggestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleSuggestionClick(placeholderHints[currentSuggestion])}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-lg font-medium cursor-pointer"
                  >
                    {placeholderHints[currentSuggestion]}
                  </motion.button>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <ChatBubble
                  role={message.role}
                  content={message.content}
                  type={message.type}
                  metadata={message.metadata}
                  suggestions={message.suggestions}
                  onSuggestionClick={handleSuggestionClick}
                  timestamp={message.timestamp}
                >
                  {/* Render plans if present */}
                  {message.type === 'plans' && message.metadata?.plans && (
                    <>
                      {(() => {
                        if (process.env.NODE_ENV === 'development') {
                          console.log('[BrikiAI] Rendering message with type=plans:', message.metadata.plans?.length, message.metadata.plans);
                        }
                        return null;
                      })()}
                      {message.metadata.plans.length > 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4"
                        >
                          {message.metadata.plans.slice(0, MAX_PLANS_SHOWN).map((plan: Plan) => (
                            <NewPlanCard
                              key={plan.id}
                              plan={{
                                id: typeof plan.id === 'string' ? parseInt(plan.id) : plan.id,
                                name: plan.name,
                                category: plan.category,
                                provider: plan.provider,
                                basePrice: plan.basePrice || 0,
                                currency: plan.currency || 'COP',
                                benefits: plan.features || plan.benefits || [],
                                isExternal: plan.isExternal,
                                externalLink: plan.externalLink
                              }}
                              onViewDetails={(planId) => {
                                handlePlanClick(plan);
                              }}
                              onQuote={(planId) => {
                                handlePlanClick(plan);
                                navigate(`/insurance/${plan.category}/quote?planId=${planId}`);
                              }}
                            />
                          ))}
                        </motion.div>
                      ) : (
                        <NoPlansFound onShowAlternatives={handleShowAlternatives} />
                      )}
                      
                      {/* Show comparison if we have a selected document and plans */}
                      {selectedDocument && message.metadata.plans.length > 0 && (
                        <DocumentComparison
                          document={selectedDocument}
                          plans={message.metadata.plans}
                          className="mt-4"
                        />
                      )}
                    </>
                  )}
                </ChatBubble>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white dark:bg-gray-800 shadow-sm border border-blue-100 dark:border-blue-800 rounded-lg px-4 py-2 max-w-[75%]">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Briki está escribiendo...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-2 sm:hidden">
            <FileUpload 
              onFileChange={handleFileChange}
              selectedFile={pendingFile}
              isUploading={isUploadingDocument}
              className="w-full min-w-[180px]"
            />
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholderHints[currentSuggestion]}
                className="flex-1 resize-none bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 min-h-[60px] max-h-[200px]"
                rows={1}
                disabled={isTyping || isUploadingDocument}
              />
              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={(!input.trim() && !pendingFile) || isTyping || isUploadingDocument}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-sm transition-all duration-200 hover:shadow-md"
                  size="icon"
                >
                  {isTyping || isUploadingDocument ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={messages.length === 0}
                  className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  size="icon"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex gap-2 items-end">
            <FileUpload 
              onFileChange={handleFileChange}
              selectedFile={pendingFile}
              isUploading={isUploadingDocument}
              className="min-w-[180px]"
            />
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholderHints[currentSuggestion]}
              className="flex-1 resize-none bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 min-h-[60px] max-h-[200px]"
              rows={1}
              disabled={isTyping || isUploadingDocument}
            />
            <Button
              type="submit"
              disabled={(!input.trim() && !pendingFile) || isTyping || isUploadingDocument}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 focus:scale-105"
              size="default"
            >
              {isTyping || isUploadingDocument ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={messages.length === 0}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 focus:scale-105 transition-all duration-200"
              size="icon"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </form>
        
        <div className="mt-2 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
          <Home className="w-3 h-3 mr-1" />
          <button
            onClick={() => navigate('/')}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default BrikiAssistant; 