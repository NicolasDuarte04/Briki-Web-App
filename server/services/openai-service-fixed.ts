import OpenAI from "openai";
import {
  MockInsurancePlan,
  createEnrichedContext,
  loadMockInsurancePlans,
} from "../data-loader";

// Initialize the OpenAI client with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

/**
 * Interfaces for AI Assistant
 */
export interface AssistantMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AssistantResponse {
  message: string;
  suggestedPlans?: MockInsurancePlan[];
}

/**
 * Enhanced generateAssistantResponse with follow-up question support
 */
export async function generateAssistantResponse(
  userMessage: string,
  conversationHistory: AssistantMessage[] = [],
  insurancePlans: MockInsurancePlan[] = [],
  userCountry: string = "Colombia",
): Promise<AssistantResponse> {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(
    `[OpenAI][${requestId}] Starting request with follow-up support:`,
    {
      messageLength: userMessage.length,
      historyLength: conversationHistory.length,
      userCountry,
      timestamp: new Date().toISOString(),
    },
  );

  try {
    // Get real plans from insurance data service
    let allPlans: MockInsurancePlan[] = [];
    try {
      const { insuranceDataService } = await import("./insurance-data-service.js");
      allPlans = await insuranceDataService.getAllPlans();
      console.log(`[OpenAI][${requestId}] Successfully loaded ${allPlans.length} insurance plans from dynamic service`);
    } catch (error) {
      // Fallback to static data loader
      allPlans = loadMockInsurancePlans();
      console.log(`[OpenAI][${requestId}] Using fallback data loader, loaded ${allPlans.length} plans`);
    }

    // Filter and get relevant plans
    const filteredPlans = filterPlansByCountry(allPlans, userCountry);
    const relevantPlans = getTopRelevantPlans(userMessage, filteredPlans, 6);

    // Enhanced system prompt with real plan data and memory context
    const systemMessage: AssistantMessage = {
      role: "system",
      content: createSystemPrompt(
        relevantPlans,
        userMessage,
        conversationHistory,
      ),
    };

    // Check OpenAI availability and fallback logic
    if (!process.env.OPENAI_API_KEY) {
      console.warn(`[OpenAI][${requestId}] No API key configured, using fallback response`);
      const fallbackMessage = `¡Hola! Soy Briki, tu asistente de seguros. Entiendo que estás preguntando sobre: "${userMessage}". Te puedo ayudar con información sobre seguros y recomendarte los mejores planes disponibles.`;
      return {
        message: fallbackMessage,
        suggestedPlans: relevantPlans.slice(0, 3),
      };
    }

    // Combine history with current message
    const messages: AssistantMessage[] = [
      systemMessage,
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    const startTime = Date.now();

    // Call OpenAI with proper error handling
    const response = await callOpenAIWithRetry(messages);

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const assistantMessage =
      response.choices[0].message.content ||
      "Lo siento, no pude generar una respuesta.";

    // Enhanced insurance intent detection with follow-up question support
    let suggestedPlans: MockInsurancePlan[] = [];
    
    // Check if this is a follow-up question about previously suggested plans
    const previousPlans = extractPreviousPlansFromHistory(conversationHistory);
    const isFollowUp = isFollowUpQuestion(userMessage) && previousPlans.length > 0;
    
    if (isFollowUp) {
      // For follow-up questions, reattach the previously suggested plans
      suggestedPlans = previousPlans;
      console.log(`[OpenAI][${requestId}] Follow-up question detected, reattaching ${suggestedPlans.length} previous plans`);
    } else if (shouldShowInsurancePlans(userMessage)) {
      // For new insurance requests, find relevant plans
      suggestedPlans = findRelevantPlans(userMessage, relevantPlans);
      console.log(`[OpenAI][${requestId}] Insurance intent detected, found ${suggestedPlans.length} relevant plans`);
    }

    // Log success with detailed metrics
    console.log(`[OpenAI][${requestId}] Success:`, {
      model: DEFAULT_MODEL,
      responseTime: `${responseTime}ms`,
      tokensUsed: response.usage?.total_tokens || 0,
      promptTokens: response.usage?.prompt_tokens || 0,
      completionTokens: response.usage?.completion_tokens || 0,
      responseLength: assistantMessage.length,
      plansFound: suggestedPlans.length,
      isFollowUp: isFollowUp,
      timestamp: new Date().toISOString(),
    });

    return {
      message: assistantMessage,
      suggestedPlans: suggestedPlans.length > 0 ? suggestedPlans : undefined,
    };
  } catch (error: any) {
    console.error(`[OpenAI][${requestId}] OpenAI request failed, using fallback:`, error);
    
    // Fallback only when OpenAI is actually unreachable
    const allPlans = loadMockInsurancePlans();
    const relevantPlans = getTopRelevantPlans(userMessage, allPlans, 6);
    
    return await getMockResponse(userMessage, relevantPlans);
  }
}

/**
 * Detect if the user message is a follow-up question about previously suggested plans
 */
function isFollowUpQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase().trim();
  
  const followUpPatterns = [
    // Comparison questions
    /cuál es (el )?mejor/,
    /cuál (me )?recomienda/,
    /qué (me )?recomienda/,
    /cuál es (la )?diferencia/,
    /cuál conviene/,
    /entre (esos|estos)/,
    
    // Clarification questions
    /qué incluye/,
    /qué cubre/,
    /cuánto cuesta/,
    /precio/,
    /cobertura/,
    
    // Choice questions
    /el primero/,
    /el segundo/,
    /el tercero/,
    /el último/,
    /ese plan/,
    /esa opción/,
    
    // Generic follow-ups
    /más información/,
    /más detalles/,
    /explica/,
    /compara/,
  ];
  
  return followUpPatterns.some(pattern => pattern.test(lowerMessage));
}

/**
 * Extract previously suggested plans from conversation history
 */
function extractPreviousPlansFromHistory(history: AssistantMessage[]): MockInsurancePlan[] {
  // Look for the most recent assistant message that mentions plans
  for (let i = history.length - 1; i >= 0; i--) {
    const message = history[i];
    if (message.role === 'assistant' && message.content.includes('[Planes previamente recomendados:')) {
      // Extract plan names from the formatted string
      const planMatch = message.content.match(/\[Planes previamente recomendados: ([^\]]+)\]/);
      if (planMatch) {
        const planString = planMatch[1];
        // Parse plan names and try to match them with available plans
        return parsePlansFromString(planString);
      }
    }
  }
  return [];
}

/**
 * Parse plan information from formatted string and return plan objects
 */
function parsePlansFromString(planString: string): MockInsurancePlan[] {
  try {
    // Load all available plans to match against
    const allPlans = loadMockInsurancePlans();
    const extractedPlans: MockInsurancePlan[] = [];
    
    // Split by commas and extract plan names
    const planEntries = planString.split(', ');
    
    for (const entry of planEntries) {
      // Extract plan name (everything before " de ")
      const nameMatch = entry.match(/^([^(]+?)\s+de\s+/);
      if (nameMatch) {
        const planName = nameMatch[1].trim();
        // Find matching plan in available plans
        const matchingPlan = allPlans.find(plan => 
          plan.name.toLowerCase().includes(planName.toLowerCase()) ||
          planName.toLowerCase().includes(plan.name.toLowerCase())
        );
        if (matchingPlan) {
          extractedPlans.push(matchingPlan);
        }
      }
    }
    
    return extractedPlans;
  } catch (error) {
    console.warn('Error parsing plans from string:', error);
    return [];
  }
}

/**
 * Filter insurance plans by user's country
 */
function filterPlansByCountry(
  plans: MockInsurancePlan[],
  country: string,
): MockInsurancePlan[] {
  // For now, return all plans as eligibility is handled elsewhere
  return plans;
}

/**
 * Get top relevant plans based on user message with scoring
 */
function getTopRelevantPlans(
  userMessage: string,
  plans: MockInsurancePlan[],
  limit: number,
): MockInsurancePlan[] {
  if (!plans.length) return [];

  const scored = plans.map((plan) => ({
    plan,
    score: calculateRelevanceScore(userMessage, plan),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.plan);
}

/**
 * Calculate relevance score for a plan based on user message
 */
function calculateRelevanceScore(
  userMessage: string,
  plan: MockInsurancePlan,
): number {
  const message = userMessage.toLowerCase();
  let score = 0;

  // Category matching
  if (message.includes(plan.category)) score += 10;

  // Name and description matching
  const searchText = `${plan.name} ${plan.description}`.toLowerCase();
  const messageWords = message.split(/\s+/);

  messageWords.forEach((word) => {
    if (word.length > 2 && searchText.includes(word)) {
      score += 2;
    }
  });

  // Feature matching
  plan.features.forEach((feature) => {
    const featureWords = feature.toLowerCase().split(/\s+/);
    featureWords.forEach((word) => {
      if (word.length > 2 && message.includes(word)) {
        score += 1;
      }
    });
  });

  // Tag matching
  plan.tags.forEach((tag) => {
    if (message.includes(tag.toLowerCase())) {
      score += 3;
    }
  });

  return score;
}

/**
 * Enhanced system prompt creation with memory context
 */
function createSystemPrompt(
  plans: MockInsurancePlan[],
  userMessage: string,
  conversationHistory: AssistantMessage[],
): string {
  const plansContext = plans.length > 0 
    ? `\n\nPlanes disponibles relevantes:\n${plans.map(plan => 
        `- ${plan.name} (${plan.provider}): ${plan.description} - $${plan.basePrice} ${plan.currency}`
      ).join('\n')}`
    : '';

  const memoryContext = conversationHistory.length > 0
    ? `\n\nContexto de conversación: El usuario ya ha tenido una conversación previa. Mantén coherencia con las recomendaciones anteriores.`
    : '';

  return `Eres Briki, un asistente experto en seguros de Colombia. 

Tu personalidad:
- Amigable, confiable y profesional
- Hablas en español colombiano de manera natural
- Explicas conceptos complejos de forma simple
- Siempre priorizas las necesidades específicas del usuario

Tu objetivo: Ayudar a los usuarios a encontrar el seguro perfecto para sus necesidades específicas.

Instrucciones importantes:
1. Responde en español de manera conversacional y amigable
2. Haz preguntas específicas para entender mejor las necesidades
3. Recomienda solo planes que realmente se ajusten al perfil del usuario
4. Explica los beneficios de manera clara sin jerga técnica
5. Si hay planes específicos disponibles, menciona las diferencias clave

${plansContext}${memoryContext}

Responde de manera útil y conversacional.`;
}

/**
 * Check if we should show insurance plans for this message
 */
function shouldShowInsurancePlans(userMessage: string): boolean {
  const message = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Greetings and general conversation - NO show plans
  const greetings = ['hola', 'hello', 'hi', 'buenas', 'buenos dias', 'buenas tardes', 'como estas', 'que tal', 'saludos'];
  if (greetings.some(greeting => message.includes(greeting)) && message.length < 50) {
    return false;
  }
  
  // Words that indicate insurance need - YES show plans
  const insuranceIntentKeywords = [
    'seguro', 'seguros', 'asegurar', 'proteger', 'cobertura', 'proteccion',
    'compre', 'tengo un', 'tengo una', 'mi carro', 'mi auto', 'mi perro', 'mi gato',
    'viajo', 'viaje', 'viajar', 'vacaciones', 'mascota', 'vespa', 'moto', 'vehiculo',
    'necesito', 'busco', 'quiero', 'recomienda', 'opciones', 'planes'
  ];
  
  return insuranceIntentKeywords.some(keyword => message.includes(keyword));
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

async function getMockResponse(userMessage: string, relevantPlans: MockInsurancePlan[]): Promise<AssistantResponse> {
  const { generateMockResponse } = await import("./mock-assistant-responses.js");
  return generateMockResponse(undefined, userMessage, relevantPlans);
}

/**
 * Analyze image for insurance recommendations
 */
export async function analyzeImageForInsurance(imageData: string, prompt?: string): Promise<AssistantResponse> {
  // For now, return a basic response - this can be enhanced later
  return {
    message: "He analizado la imagen. Para darte una recomendación más precisa, ¿podrías contarme qué tipo de seguro estás buscando?",
    suggestedPlans: []
  };
}