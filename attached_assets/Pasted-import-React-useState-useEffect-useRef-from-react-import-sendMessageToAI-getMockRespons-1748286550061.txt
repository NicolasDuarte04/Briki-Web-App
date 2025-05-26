import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToAI, getMockResponse, APIMessage } from '@/services/openai-service';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Bot, X, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import SuggestedPlans from './SuggestedPlans';
import { InsurancePlan } from './PlanCard';
import memoryService from '@/services/memory-service';

// Tipos para los mensajes
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  suggestedPlans?: InsurancePlan[];
}



const RealAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useRealAI, setUseRealAI] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mensajes iniciales
  useEffect(() => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '¡Hola! Soy Briki, tu asistente de seguros. ¿En qué puedo ayudarte hoy? Puedo darte información sobre seguros de viaje, auto, mascotas y salud.',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  // Auto scroll cuando hay nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Escuchar eventos de preguntas sugeridas
  useEffect(() => {
    const handleSuggestedQuestion = (event: CustomEvent) => {
      const { question } = event.detail;
      setInput(question);
      // Enviar automáticamente la pregunta
      handleSendMessage(question);
    };

    window.addEventListener('suggestedQuestion', handleSuggestedQuestion as EventListener);
    
    return () => {
      window.removeEventListener('suggestedQuestion', handleSuggestedQuestion as EventListener);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [contextVisible, setContextVisible] = useState(false);
  
  // Formatear el contexto del usuario para mostrarlo
  const formatUserContext = () => {
    const context = memoryService.getContext();
    let formattedContext = [];
    
    if (context.location?.country) {
      formattedContext.push(`Ubicación: ${context.location.country}`);
    }
    
    if (context.auto?.type) {
      const vehicleType = context.auto.type === 'motorcycle' ? 'Moto/Scooter' : 'Auto';
      const vehicleMake = context.auto.make ? ` (${context.auto.make})` : '';
      formattedContext.push(`Vehículo: ${vehicleType}${vehicleMake}`);
    }
    
    if (context.travel?.destination) {
      const duration = context.travel.duration ? ` por ${context.travel.duration}` : '';
      formattedContext.push(`Viaje: ${context.travel.destination}${duration}`);
    }
    
    if (context.pet?.type) {
      const petType = context.pet.type === 'dog' ? 'Perro' : context.pet.type === 'cat' ? 'Gato' : 'Mascota';
      const petAge = context.pet.age ? ` de ${context.pet.age} años` : '';
      formattedContext.push(`Mascota: ${petType}${petAge}`);
    }
    
    return formattedContext;
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Extraer información del mensaje para el contexto
    memoryService.extractContextFromMessage(input);

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    // Mensaje temporal de carga para el asistente
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response;
      
      // Dependiendo del toggle, usar IA real o respuestas simuladas
      if (useRealAI) {
        // Convertir mensajes para enviar al backend
        const conversationHistory: APIMessage[] = messages
          .filter(msg => !msg.isLoading)
          .map(msg => ({
            role: msg.role,
            content: msg.content,
          }));
        
        // Obtener el contexto del usuario para añadirlo al historial
        const userContext = memoryService.getContext();
        let contextText = '';
        
        // Construir un mensaje de sistema con el contexto si existe
        if (Object.keys(userContext).length > 0) {
          const contextItems = formatUserContext();
          if (contextItems.length > 0) {
            contextText = 'Contexto del usuario: ' + contextItems.join(', ');
            
            // Añadir el contexto como un mensaje de sistema al principio de la conversación
            conversationHistory.unshift({
              role: 'system',
              content: contextText
            } as APIMessage);
          }
        }
        
        response = await sendMessageToAI(input, conversationHistory);
      } else {
        // Usar respuestas simuladas (también considerando el contexto)
        const userContext = memoryService.getContext();
        response = getMockResponse(input, userContext);
      }

      // Reemplazar el mensaje de carga con la respuesta real
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading 
            ? {
                ...msg,
                id: Date.now().toString(),
                content: response.message || response.response || "No se pudo obtener una respuesta",
                suggestedPlans: response.suggestedPlans || undefined,
                isLoading: false,
              }
            : msg
        )
      );

      // Mostrar información sobre el modelo y tokens usados (si existe)
      if (response.usage) {
        console.log(`Modelo: ${response.model}, Tokens: ${response.usage.total_tokens}`);
      }
      
      // Si hay planes sugeridos, mostrar en consola para depuración
      if (response.suggestedPlans && response.suggestedPlans.length > 0) {
        console.log(`Planes sugeridos: ${response.suggestedPlans.length}`);
      }
    } catch (error) {
      console.error('Error al obtener respuesta:', error);
      
      // Actualizar mensaje de error
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading 
            ? {
                ...msg,
                id: Date.now().toString(),
                content: "Lo siento, hubo un problema al procesar tu mensaje. Por favor, intenta de nuevo más tarde.",
                isLoading: false,
              }
            : msg
        )
      );
      
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el asistente. Verifica tu conexión a internet.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar cada mensaje
  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4 w-full`}
      >
        <div
          className={`
            max-w-[80%] rounded-2xl p-4 shadow-sm
            ${isUser 
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white ml-4' 
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 mr-4'
            }
          `}
        >
          {!isUser && (
            <div className="flex items-center mb-2">
              <Bot className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Briki</span>
            </div>
          )}
          
          {message.isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-600" />
              <span className="text-gray-600 dark:text-gray-400">Pensando...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-400 mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        {/* Mostrar planes sugeridos si existen y no es un mensaje del usuario */}
        {!isUser && message.suggestedPlans && message.suggestedPlans.length > 0 && (
          <div className="w-full mt-2">
            <SuggestedPlans plans={message.suggestedPlans} />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-[500px] w-full">
      {/* Área de mensajes */}
      <ScrollArea className="flex-grow p-6 bg-gray-50 dark:bg-gray-900">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Formulario de entrada */}
      <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
          <div className="flex space-x-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntame sobre seguros de viaje, auto, mascotas o salud..."
              disabled={isLoading}
              className="flex-grow text-base py-3 px-4 rounded-xl border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            💡 Tip: Menciona tu ubicación, tipo de vehículo o necesidades específicas para mejores recomendaciones
          </p>
        </form>
      </div>
    </div>
  );
};

export default RealAssistant;