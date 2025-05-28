import OpenAI from "openai";
import { MockInsurancePlan, createEnrichedContext, loadMockInsurancePlans } from "../data-loader";
import { storage } from "../storage";

// Initialize the OpenAI client with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

export interface AssistantMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AssistantResponse {
  message: string;
  suggestedPlans?: MockInsurancePlan[];
}

/**
 * FIXED: Enhanced generateAssistantResponse with real plan integration
 */
export async function generateAssistantResponse(
  userMessage: string,
  conversationHistory: AssistantMessage[] = [],
  insurancePlans: MockInsurancePlan[] = [],
  userCountry: string = 'Colombia'
): Promise<AssistantResponse> {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(`[OpenAI][${requestId}] Starting request with real data integration:`, {
    messageLength: userMessage.length,
    historyLength: conversationHistory.length,
    userCountry,
    timestamp: new Date().toISOString()
  });

  try {
    // FIXED: Get real plans from storage
    let allPlans: MockInsurancePlan[] = [];
    
    try {
      allPlans = await storage.getAllInsurancePlans();
      console.log(`[OpenAI][${requestId}] Successfully loaded ${allPlans.length} real insurance plans`);
    } catch (dataError) {
      console.error(`[OpenAI][${requestId}] Failed to load real plans, falling back to loadMockInsurancePlans:`, dataError);
      allPlans = loadMockInsurancePlans();
    }

    // Filter and get relevant plans
    const filteredPlans = filterPlansByCountry(allPlans, userCountry);
    const relevantPlans = getTopRelevantPlans(userMessage, filteredPlans, 6);

    // FIXED: Enhanced system prompt with real plan data and memory context
    const systemMessage: AssistantMessage = {
      role: "system",
      content: createSystemPrompt(relevantPlans, userMessage, conversationHistory)
    };

    // FIXED: Check OpenAI availability and fallback logic
    if (!process.env.OPENAI_API_KEY) {
      console.warn(`[OpenAI][${requestId}] No API key configured, using fallback response`);
      return await getMockResponse(userMessage, relevantPlans);
    }

    // Combine history with current message
    const messages: AssistantMessage[] = [
      systemMessage,
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];

    const startTime = Date.now();
    
    // FIXED: Call OpenAI with proper error handling
    const response = await callOpenAIWithRetry(messages);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const assistantMessage = response.choices[0].message.content || "Lo siento, no pude generar una respuesta.";

    // Enhanced insurance intent detection
    let suggestedPlans: MockInsurancePlan[] = [];
    if (shouldShowInsurancePlans(userMessage)) {
      suggestedPlans = findRelevantPlans(userMessage, relevantPlans);
      console.log(`[OpenAI][${requestId}] Insurance intent detected, found ${suggestedPlans.length} relevant plans`);
    }

    console.log(`[OpenAI][${requestId}] Request completed successfully in ${responseTime}ms`);

    return {
      message: assistantMessage,
      suggestedPlans: suggestedPlans.length > 0 ? suggestedPlans : undefined
    };

  } catch (error) {
    console.error(`[OpenAI][${requestId}] OpenAI request failed, using fallback:`, error);
    
    // FIXED: Fallback only when OpenAI is actually unreachable
    const allPlans = loadMockInsurancePlans();
    const relevantPlans = getTopRelevantPlans(userMessage, allPlans, 6);
    
    return await getMockResponse(userMessage, relevantPlans);
  }
}

/**
 * FIXED: Enhanced system prompt creation with memory context
 */
function createSystemPrompt(
  availablePlans: MockInsurancePlan[], 
  currentMessage: string, 
  conversationHistory: AssistantMessage[]
): string {
  // Extract previously recommended plans from conversation history
  const previousPlans = extractPreviousPlansFromHistory(conversationHistory);
  
  const systemPrompt = `Eres Briki, un asistente especializado en seguros para Colombia. Tu objetivo es ayudar a los usuarios a encontrar la protección perfecta mediante recomendaciones personalizadas e inteligentes.

MEMORIA DE CONVERSACIÓN:
${previousPlans.length > 0 ? `Planes previamente recomendados: ${previousPlans.join(', ')}` : 'Primera interacción con el usuario'}

PLANES DISPONIBLES (${availablePlans.length}):
${availablePlans.map(plan => 
  `- ${plan.name} (${plan.provider}): ${plan.description} - $${plan.basePrice}/${plan.duration} - Cobertura: $${plan.coverageAmount}`
).join('\n')}

INSTRUCCIONES:
1. Mantén el contexto de planes previamente mostrados
2. Responde de manera conversacional y amigable en español
3. Haz preguntas específicas para entender las necesidades del usuario
4. Recomienda planes específicos cuando sea apropiado
5. Explica claramente por qué recomiendas cada plan
6. Si el usuario pregunta sobre planes anteriores, refiérete a ellos específicamente

CONTEXTO ACTUAL: ${currentMessage}`;

  return systemPrompt;
}

/**
 * FIXED: Extract previously recommended plans from conversation
 */
function extractPreviousPlansFromHistory(history: AssistantMessage[]): string[] {
  const planPattern = /\[Planes recomendados: ([^\]]+)\]/g;
  const previousPlans: string[] = [];
  
  history.forEach(message => {
    if (message.role === 'assistant') {
      let match;
      while ((match = planPattern.exec(message.content)) !== null) {
        previousPlans.push(match[1]);
      }
    }
  });
  
  return previousPlans;
}

// Helper functions
function filterPlansByCountry(plans: MockInsurancePlan[], country: string): MockInsurancePlan[] {
  return plans; // For now, return all plans as they're for Colombia
}

function getTopRelevantPlans(message: string, plans: MockInsurancePlan[], limit: number): MockInsurancePlan[] {
  const lowerMessage = message.toLowerCase();
  
  // Simple relevance scoring based on keywords
  const scoredPlans = plans.map(plan => {
    let score = 0;
    
    // Category matching
    if (lowerMessage.includes('viaje') || lowerMessage.includes('travel')) {
      if (plan.category === 'travel') score += 10;
    }
    if (lowerMessage.includes('auto') || lowerMessage.includes('carro')) {
      if (plan.category === 'auto') score += 10;
    }
    if (lowerMessage.includes('mascota') || lowerMessage.includes('pet')) {
      if (plan.category === 'pet') score += 10;
    }
    if (lowerMessage.includes('salud') || lowerMessage.includes('health')) {
      if (plan.category === 'health') score += 10;
    }
    
    // Feature matching
    plan.features.forEach(feature => {
      if (lowerMessage.includes(feature.toLowerCase())) {
        score += 2;
      }
    });
    
    return { plan, score };
  });
  
  return scoredPlans
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.plan);
}

function shouldShowInsurancePlans(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  const insuranceKeywords = [
    'seguro', 'plan', 'protección', 'cobertura', 'poliza',
    'viaje', 'auto', 'mascota', 'salud', 'recomienda'
  ];
  
  return insuranceKeywords.some(keyword => lowerMessage.includes(keyword));
}

function findRelevantPlans(message: string, plans: MockInsurancePlan[]): MockInsurancePlan[] {
  return getTopRelevantPlans(message, plans, 3);
}

async function callOpenAIWithRetry(messages: AssistantMessage[]): Promise<any> {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: messages as any,
        max_tokens: 1000,
        temperature: 0.7,
      });
    } catch (error) {
      lastError = error;
      console.warn(`[OpenAI] Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw lastError;
}

async function getMockResponse(message: string, relevantPlans: MockInsurancePlan[] = []): Promise<AssistantResponse> {
  console.warn('[OpenAI] Using mock response due to service unavailability');
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('seguro') || lowerMessage.includes('plan') || lowerMessage.includes('protección')) {
    const plans = relevantPlans.length > 0 ? relevantPlans.slice(0, 3) : [];
    
    return {
      message: `Entiendo que buscas información sobre seguros. Basándome en tu consulta, puedo recomendarte algunos planes. ${plans.length > 0 ? `He seleccionado ${plans.length} opciones que podrían interesarte.` : 'Para darte recomendaciones más específicas, ¿podrías decirme qué tipo de seguro necesitas?'}`,
      suggestedPlans: plans
    };
  }
  
  return {
    message: "Hola, soy Briki y estoy aquí para ayudarte con seguros. ¿En qué puedo asistirte hoy?",
    suggestedPlans: []
  };
}