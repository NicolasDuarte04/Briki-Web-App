import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { sendMessageToAI, getMockResponse, APIMessage } from '@/services/openai-service';
import WelcomeCard from './WelcomeCard';
import { InsurancePlan } from './PlanCard';

// Lazy load the SuggestedPlans component
const SuggestedPlans = lazy(() => import('./SuggestedPlans'));
import { formatUserContext, extractContextFromMessage, isGenericGreeting } from '@/utils/context-utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  suggestedPlans?: InsurancePlan[];
  // NEW: Add summary for memory
  plansSummary?: string;
}

// NEW: Context validation helpers to align with backend logic
interface ContextRequirements {
  travel: string[];
  pet: string[];
  auto: string[];
  health: string[];
}

const REQUIRED_CONTEXT: ContextRequirements = {
  travel: ['destination', 'duration', 'travelers'],
  pet: ['petType', 'age', 'breed'],
  auto: ['brand', 'model', 'year'],
  health: ['age', 'familySize', 'conditions']
};

// NEW: Detect insurance category from user message
function detectInsuranceCategory(message: string): string {
  const lowerMessage = message.toLowerCase().trim();

  const petKeywords = ['mascota', 'perro', 'gato', 'pet', 'dog', 'cat', 'animal', 'veterinario'];
  const travelKeywords = ['viaje', 'travel', 'trip', 'internacional', 'europa', 'estados unidos', 'méxico', 'vacaciones'];
  const autoKeywords = ['auto', 'carro', 'vehiculo', 'moto', 'car', 'vehicle', 'motorcycle', 'scooter'];
  const healthKeywords = ['salud', 'health', 'médico', 'medical', 'hospital', 'doctor', 'medicina'];

  if (petKeywords.some(keyword => lowerMessage.includes(keyword))) return 'pet';
  if (travelKeywords.some(keyword => lowerMessage.includes(keyword))) return 'travel';
  if (autoKeywords.some(keyword => lowerMessage.includes(keyword))) return 'auto';
  if (healthKeywords.some(keyword => lowerMessage.includes(keyword))) return 'health';

  return 'general';
}

// NEW: Check if user has provided sufficient context for plan recommendations
function hasSufficientContext(userContext: any, conversationHistory: Message[], currentMessage: string): boolean {
  const category = detectInsuranceCategory(currentMessage);

  if (category === 'general') return false;

  // Check if conversation history contains detailed context
  const hasDetailedHistory = conversationHistory.some(msg => 
    msg.role === 'user' && (
      msg.content.length > 50 || // Detailed messages
      /\d+/.test(msg.content) || // Contains numbers (ages, dates, etc.)
      /(años?|meses?|días?|duración|países?|raza|modelo|marca)/i.test(msg.content)
    )
  );

  // Check current message for detailed context
  const hasDetailedCurrentMessage = currentMessage.length > 50 || 
    /\d+/.test(currentMessage) ||
    /(años?|meses?|días?|duración|países?|raza|modelo|marca)/i.test(currentMessage);

  // Category-specific context validation
  switch (category) {
    case 'travel':
      const travelDetails = {
        destination: /(europa|asia|méxico|estados unidos|[a-z]+)/i.test(currentMessage),
        duration: /(días?|semanas?|meses?|\d+)/i.test(currentMessage),
        travelers: /(solo|familia|acompañant|personas?)/i.test(currentMessage)
      };
      const travelContextCount = Object.values(travelDetails).filter(Boolean).length;
      return hasDetailedHistory || hasDetailedCurrentMessage || travelContextCount >= 2;

    case 'pet':
      const petDetails = {
        type: /(perr|gat|dog|cat)/i.test(currentMessage),
        age: /(\d+|años?|meses?|cachorro|adulto|mayor)/i.test(currentMessage),
        breed: /(raza|labrador|golden|pastor|siamés)/i.test(currentMessage)
      };
      const petContextCount = Object.values(petDetails).filter(Boolean).length;
      return hasDetailedHistory || hasDetailedCurrentMessage || petContextCount >= 2;

    case 'auto':
      const autoDetails = {
        brand: /(marca|toyota|honda|ford|chevrolet|nissan)/i.test(currentMessage),
        model: /(modelo|\d{4}|año)/i.test(currentMessage),
        use: /(trabajo|personal|comercial|uber)/i.test(currentMessage)
      };
      const autoContextCount = Object.values(autoDetails).filter(Boolean).length;
      return hasDetailedHistory || hasDetailedCurrentMessage || autoContextCount >= 2;

    case 'health':
      const healthDetails = {
        age: /(\d+|años?|joven|adulto|mayor)/i.test(currentMessage),
        family: /(familia|hijo|esposa|pareja)/i.test(currentMessage),
        conditions: /(condición|enferm|diabetes|hipertens)/i.test(currentMessage)
      };
      const healthContextCount = Object.values(healthDetails).filter(Boolean).length;
      return hasDetailedHistory || hasDetailedCurrentMessage || healthContextCount >= 2;

    default:
      return false;
  }
}

// NEW: Check if message should trigger plan recommendations (aligned with backend logic)
function shouldShowInsurancePlans(message: string, userContext: any, conversationHistory: Message[]): boolean {
  const lowerMessage = message.toLowerCase().trim();

  // Clear intent patterns that indicate readiness for plan recommendations
  const strongIntentPatterns = [
    /quiero (ver|conocer|comparar) planes/,
    /muestra.*planes/,
    /recomienda.*plan/,
    /necesito.*seguro/,
    /busco.*seguro/,
    /qué planes.*tienes/,
    /opciones.*seguro/,
  ];

  const hasStrongIntent = strongIntentPatterns.some(pattern => pattern.test(lowerMessage));

  if (hasStrongIntent && hasSufficientContext(userContext, conversationHistory, message)) {
    return true;
  }

  // Conservative keyword-based detection with context requirement
  const insuranceKeywords = ["seguro", "insurance", "protección", "cobertura", "plan", "póliza"];
  const categoryKeywords = ["viaje", "auto", "mascota", "salud", "travel", "car", "pet", "health"];
  const actionKeywords = ["necesito", "busco", "quiero", "need", "want", "looking"];

  const hasInsuranceKeyword = insuranceKeywords.some((keyword) => message.includes(keyword));
  const hasCategoryKeyword = categoryKeywords.some((keyword) => message.includes(keyword));
  const hasActionKeyword = actionKeywords.some((keyword) => message.includes(keyword));

  // Only show plans if we have clear intent AND sufficient context
  return hasInsuranceKeyword && 
         hasCategoryKeyword && 
         hasActionKeyword && 
         hasSufficientContext(userContext, conversationHistory, message);
}

const NewBrikiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [userContext, setUserContext] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome-msg',
      role: 'assistant',
      content: '¡Hola! Soy Briki, tu asistente personal de seguros. Estoy aquí para ayudarte a encontrar la protección perfecta para lo que más te importa.',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Handle scroll indicator
  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollIndicator(!isNearBottom && scrollTop > 200);
  };

  // Smart scroll function - only when needed
  const scrollToBottom = (force = false) => {
    if (!messagesEndRef.current) return;

    // Only scroll if user is near bottom or if forced
    if (force || !showScrollIndicator) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }, 100);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input;
    if (!messageToSend.trim()) return;

    // Hide welcome card on first real message
    setShowWelcomeCard(false);

    // Accumulate context across multiple turns - preserve all previous context
    const newContext = extractContextFromMessage(messageToSend, userContext);
    const mergedContext = { ...userContext, ...newContext };
    setUserContext(mergedContext);

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageToSend,
      timestamp: new Date(),
    };

    // Create loading message
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // FIXED: Check if we should show plans based on context sufficiency
      const currentMessages = [...messages, userMessage];
      const shouldRequestPlans = shouldShowInsurancePlans(messageToSend, mergedContext, currentMessages);

      console.log('🔍 Context Analysis:', {
        message: messageToSend,
        category: detectInsuranceCategory(messageToSend),
        hasSufficientContext: hasSufficientContext(mergedContext, currentMessages, messageToSend),
        shouldShowPlans: shouldRequestPlans,
        contextData: mergedContext
      });

      // Enhanced conversation history with plan memory preservation
      const conversationHistory: APIMessage[] = messages
        .filter(msg => !msg.isLoading && msg.id !== 'welcome-msg')
        .map(msg => {
          if (msg.role === 'assistant' && msg.suggestedPlans && msg.suggestedPlans.length > 0) {
            // Include detailed plan context for memory with proper formatting
            const planDetails = msg.suggestedPlans.map(plan => 
              `${plan.name} de ${plan.provider} por ${plan.basePrice} ${plan.currency}`
            ).join(', ');

            return {
              role: msg.role,
              content: `${msg.content}\n\n[Planes previamente recomendados: ${planDetails}]`
            };
          }
          return {
            role: msg.role,
            content: msg.content,
          };
        });

      // Enhanced context injection - preserve accumulated user context
      const contextEntries = Object.entries(mergedContext).filter(([_, value]) => value);
      if (contextEntries.length > 0) {
        const contextText = contextEntries.map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            // Format nested objects better for AI context
            const formattedObject = Object.entries(value as Record<string, any>)
              .filter(([_, v]) => v)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ');
            return `${key}: {${formattedObject}}`;
          }
          return `${key}: ${value}`;
        }).join(', ');

        conversationHistory.unshift({
          role: 'system',
          content: `Contexto acumulado del usuario: ${contextText}. ${shouldRequestPlans ? 'El usuario tiene suficiente contexto para ver planes.' : 'El usuario necesita más contexto antes de mostrar planes.'}`
        } as APIMessage);
      }

      // Get AI response with conversation history
      const response = await sendMessageToAI(messageToSend, conversationHistory);

      // Debug logging for data flow analysis
      console.log('🔍 NewBrikiAssistant - AI Response received:', {
        hasMessage: !!response.message,
        hasSuggestedPlans: !!response.suggestedPlans,
        planCount: response.suggestedPlans?.length || 0,
        planNames: response.suggestedPlans?.map(p => p.name) || [],
        shouldHaveShownPlans: shouldRequestPlans,
        fullResponse: response
      });

      // FIXED: Validate that plans are only shown when context is sufficient
      let finalSuggestedPlans = response.suggestedPlans;

      if (response.suggestedPlans && response.suggestedPlans.length > 0) {
        if (!shouldRequestPlans) {
          console.warn('⚠️  Plans were returned but context is insufficient - filtering out plans');
          finalSuggestedPlans = undefined;

          // Show a helpful message instead
          if (!response.message.includes('más información') && !response.message.includes('preguntas')) {
            response.message += '\n\nPara recomendarte los mejores planes, necesito conocer un poco más sobre tus necesidades específicas.';
          }
        }
      }

      // Update loading message with response and memory
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading 
            ? {
                ...msg,
                id: `assistant-${Date.now()}`,
                content: response.message || response.response || "No pude generar una respuesta.",
                suggestedPlans: response.suggestedPlans || [],
                isLoading: false,
                timestamp: new Date(),
                plansSummary: response.suggestedPlans?.length > 0 
                  ? `Mostré ${response.suggestedPlans.length} planes de ${response.category || 'seguros'}` 
                  : undefined
              }
            : msg
        )
      );