import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { 
  Bot, 
  User, 
  Loader2,
  Send as SendIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import MockPlansCard from "@/components/assistant/MockPlansCard";
import { trackEvent } from "@/lib/analytics";
import { EventCategory } from "@/constants/analytics";
import { processUserMessage, AssistantResponse } from "@/services/openai-service";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Definición de interfaces
interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  isLoading?: boolean;
  mockResponse?: any;
}

// Componente de burbuja de mensaje
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === "user";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-5"
    >
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`flex items-start gap-2 max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
          {/* Avatar */}
          {message.sender === "assistant" ? (
            <Avatar className="h-8 w-8 bg-primary/5 shrink-0">
              <AvatarImage src="/briki-avatar.svg" alt="Briki Assistant" />
              <AvatarFallback>
                <Bot className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8 bg-gray-100 shrink-0">
              <AvatarFallback>
                <User className="h-4 w-4 text-gray-600" />
              </AvatarFallback>
            </Avatar>
          )}
          
          {/* Message bubble */}
          <div 
            className={`rounded-2xl px-4 py-3 ${
              isUser 
                ? "bg-primary/10 text-gray-800" 
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {message.isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <p className="text-sm">Pensando...</p>
              </div>
            ) : (
              <div>
                <p className="text-sm">{message.content}</p>
                {message.mockResponse && (
                  <div className="mt-3">
                    <MockPlansCard response={message.mockResponse} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface RealAssistantProps {
  suggestedQuestions?: string[];
  initialUseAI?: boolean;
}

// Componente principal del asistente real
export default function RealAssistant({ 
  suggestedQuestions = [
    "¿Qué seguro de viaje me recomiendas para Europa?",
    "¿Necesito un seguro especial para mi mascota?",
    "¿Cuáles son las mejores coberturas para mi auto?",
    "¿Qué seguro de salud cubre condiciones preexistentes?"
  ],
  initialUseAI = true
}: RealAssistantProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      sender: "assistant",
      content: "¡Hola! Soy Briki, tu asistente personal para seguros. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isSending, setIsSending] = useState(false);
  const [useAI, setUseAI] = useState(initialUseAI);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Procesamiento de mensajes con IA real o respuestas prefabricadas
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;
    
    setIsSending(true);
    
    // Añadir mensaje del usuario
    const userMessage: Message = {
      id: uuidv4(),
      sender: "user",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Track evento de mensaje de usuario
    trackEvent(
      'assistant_user_message',
      EventCategory.Assistant,
      'real_assistant'
    );
    
    // Limpiar input y mostrar mensaje del usuario
    setInputMessage("");
    setMessages(prev => [...prev, userMessage]);
    
    // Mostrar indicador de carga
    const loadingMessageId = uuidv4();
    const loadingMessage: Message = {
      id: loadingMessageId,
      sender: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      // Procesar el mensaje del usuario con OpenAI o respuestas prefabricadas
      const response: AssistantResponse = await processUserMessage(userMessage.content, useAI);
      
      // Crear mensaje de respuesta del asistente
      const assistantMessage: Message = {
        id: uuidv4(),
        sender: "assistant",
        content: response.content,
        timestamp: new Date().toISOString(),
        mockResponse: response.sourceType === 'mock' ? response.mockResponseData : null
      };
      
      // Reemplazar mensaje de carga con respuesta real
      setMessages(prev => 
        prev.filter(msg => msg.id !== loadingMessageId).concat(assistantMessage)
      );
    } catch (error) {
      console.error("Error al procesar mensaje:", error);
      
      // En caso de error, mostrar mensaje de error amigable
      const errorMessage: Message = {
        id: uuidv4(),
        sender: "assistant",
        content: "Estoy teniendo problemas para responder. Por favor, intenta con otra pregunta o prueba más tarde.",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => 
        prev.filter(msg => msg.id !== loadingMessageId).concat(errorMessage)
      );
    } finally {
      setIsSending(false);
    }
  };
  
  // Insertar una pregunta sugerida en el input
  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };
  
  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-md rounded-xl overflow-hidden">
      {/* Chat Messages Container */}
      <div 
        ref={messagesContainerRef} 
        className="h-[500px] p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messageEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-grow min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={isSending || !inputMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white h-[60px] px-4"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <SendIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
        
        {/* Mode toggle */}
        <div className="flex items-center justify-between mt-4 mb-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="ai-mode"
              checked={useAI}
              onCheckedChange={setUseAI}
            />
            <Label htmlFor="ai-mode" className="text-sm">
              {useAI ? "Modo IA activado" : "Modo simulado"}
            </Label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {useAI 
              ? "Usando OpenAI para respuestas en tiempo real" 
              : "Usando respuestas predefinidas"}
          </p>
        </div>
        
        {/* Suggested Questions */}
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Prueba estas preguntas:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}