import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToAI, getMockResponse } from '@/services/openai-service';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Bot, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import SuggestedPlans from './SuggestedPlans';
import { InsurancePlan } from './PlanCard';

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

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
        const conversationHistory = messages
          .filter(msg => !msg.isLoading)
          .map(msg => ({
            role: msg.role,
            content: msg.content,
          }));
        
        response = await sendMessageToAI(input, conversationHistory);
      } else {
        // Usar respuestas simuladas
        response = getMockResponse(input);
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
            max-w-[80%] rounded-lg p-3 
            ${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
          `}
        >
          {message.isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Pensando...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
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
    <div className="flex flex-col bg-background rounded-lg shadow-md h-[600px] max-w-2xl mx-auto">
      {/* Cabecera */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Bot className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-lg font-semibold">Briki AI Assistant</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="ai-mode"
            checked={useRealAI}
            onCheckedChange={setUseRealAI}
          />
          <Label htmlFor="ai-mode">Modo IA {useRealAI ? 'Activado' : 'Desactivado'}</Label>
        </div>
      </div>
      
      {/* Área de mensajes */}
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Formulario de entrada */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            disabled={isLoading}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RealAssistant;