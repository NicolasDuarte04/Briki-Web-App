import OpenAI from "openai";
import { MockInsurancePlan, createEnrichedContext } from "../data-loader";

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
 * Generate a response from the AI assistant based on user input and conversation history
 * @param userMessage Current user message
 * @param conversationHistory Previous messages in the conversation
 * @param insurancePlans Available insurance plans to consider in the response
 * @param userCountry User's country for plan filtering (default: Colombia)
 */
export async function generateAssistantResponse(
  userMessage: string,
  conversationHistory: AssistantMessage[] = [],
  insurancePlans: MockInsurancePlan[] = [],
  userCountry: string = 'Colombia'
): Promise<AssistantResponse> {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(`[OpenAI][${requestId}] Starting request:`, {
    messageLength: userMessage.length,
    historyLength: conversationHistory.length,
    availablePlans: insurancePlans.length,
    userCountry,
    timestamp: new Date().toISOString()
  });

  // Filter plans by country and relevance before processing
  const filteredPlans = filterPlansByCountry(insurancePlans, userCountry);
  const relevantPlans = getTopRelevantPlans(userMessage, filteredPlans, 6);

  // Prepare system message with context and instructions
  const systemMessage: AssistantMessage = {
    role: "system",
    content: createSystemPrompt(relevantPlans, userMessage)
  };

  // Combine history with current message
  const messages: AssistantMessage[] = [
    systemMessage,
    ...conversationHistory,
    { role: "user", content: userMessage }
  ];

  try {
    const startTime = Date.now();

    // Call OpenAI API with retry mechanism
    const response = await callOpenAIWithRetry(messages);

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Extract and return response
    const assistantMessage = response.choices[0].message.content || "Lo siento, no pude generar una respuesta.";

    // Only suggest plans if the user message indicates they want insurance recommendations
    let suggestedPlans: MockInsurancePlan[] = [];
    if (shouldShowInsurancePlans(userMessage)) {
      suggestedPlans = findRelevantPlans(userMessage, relevantPlans);
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
      timestamp: new Date().toISOString()
    });

    return {
      message: assistantMessage,
      suggestedPlans: suggestedPlans.length > 0 ? suggestedPlans : undefined
    };
  } catch (error: any) {
    // Enhanced error handling with specific error types
    const errorDetails = {
      requestId,
      error: error.message,
      type: error.type || 'unknown',
      code: error.code || 'unknown',
      status: error.status,
      messageLength: userMessage.length,
      timestamp: new Date().toISOString(),
      model: DEFAULT_MODEL
    };

    console.error(`[OpenAI][${requestId}] Error:`, errorDetails);

    // Different error messages for better UX
    if (error.code === 'rate_limit_exceeded') {
      throw new Error('El servicio está temporalmente sobrecargado. Intenta nuevamente en un momento.');
    } else if (error.code === 'invalid_api_key') {
      throw new Error('Error de configuración del servicio. Contacta al administrador.');
    } else if (error.code === 'insufficient_quota') {
      throw new Error('Límite de uso del servicio alcanzado. Intenta más tarde.');
    } else {
      throw new Error(`Error al generar respuesta: ${error.message || 'Error desconocido'}`);
    }
  }
}

/**
 * OpenAI API call with automatic retry mechanism
 */
async function callOpenAIWithRetry(messages: any[], retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 800,
      });
    } catch (error: any) {
      if (i === retries - 1) throw error;

      console.log(`[OpenAI] Retry ${i + 1}/${retries} after error:`, error.message);
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i))); // Exponential backoff
    }
  }
}

/**
 * Filter insurance plans by user's country
 */
function filterPlansByCountry(plans: MockInsurancePlan[], country: string): MockInsurancePlan[] {
  return plans.filter(plan => 
    !plan.restrictions?.countries || 
    plan.restrictions.countries.includes(country) ||
    plan.availableCountries?.includes(country) ||
    !plan.availableCountries // If no country restrictions, include it
  );
}

/**
 * Get top relevant plans based on user message with scoring
 */
function getTopRelevantPlans(userMessage: string, plans: MockInsurancePlan[], limit: number): MockInsurancePlan[] {
  if (!plans.length) return [];

  const scored = plans.map(plan => ({
    plan,
    score: calculateRelevanceScore(userMessage, plan)
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.plan);
}

/**
 * Calculate relevance score for a plan based on user message
 */
function calculateRelevanceScore(userMessage: string, plan: MockInsurancePlan): number {
  let score = 0;
  const message = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Category matching (+30 points)
  const categoryMatches: Record<string, string[]> = {
    travel: ['viaje', 'viajar', 'vacaciones', 'internacional', 'turismo'],
    auto: ['carro', 'auto', 'vehiculo', 'conducir', 'automovil', 'vespa', 'moto'],
    pet: ['mascota', 'perro', 'gato', 'veterinario', 'animal'],
    health: ['salud', 'medico', 'hospital', 'consulta', 'enfermedad']
  };

  if (categoryMatches[plan.category]?.some(keyword => message.includes(keyword))) {
    score += 30;
  }

  // Tag matching (+10 per matching tag)
  plan.tags.forEach(tag => {
    const normalizedTag = tag.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (message.includes(normalizedTag)) score += 10;
  });

  // Price preference (+15 for economic plans when user mentions price)
  if (message.includes('barato') || message.includes('economico') || message.includes('precio')) {
    if (plan.tags.some(tag => tag.toLowerCase().includes('economico'))) {
      score += 15;
    }
  }

  // Premium preference (+10 for premium plans when user mentions quality/complete)
  if (message.includes('completo') || message.includes('premium') || message.includes('mejor')) {
    if (plan.tags.some(tag => tag.toLowerCase().includes('premium') || tag.toLowerCase().includes('completo'))) {
      score += 10;
    }
  }

  return score;
}

/**
 * Create a system prompt with improved structure and context
 */
function createSystemPrompt(insurancePlans: MockInsurancePlan[], userMessage: string = ''): string {
  // Start with structured base instructions
  let prompt = `Eres Briki, un asistente de seguros amigable y profesional.

REGLAS DE RECOMENDACIÓN:
• Solo recomienda planes cuando el usuario:
  - Mencione necesidad específica de seguro
  - Describa un objeto/situación que requiere protección  
  - Pregunte directamente por opciones
• Para saludos generales: responde amigablemente y pregunta qué le interesa
• Mantén introducciones breves (máximo 2 líneas antes de mostrar planes)

ESTILO DE RESPUESTA:
• Conciso y directo
• Amigable pero profesional
• Enfocado en soluciones
• Evita explicaciones largas antes de mostrar planes`;

  // Add enriched context from knowledge base
  if (userMessage) {
    const enrichedContext = createEnrichedContext(userMessage, insurancePlans);
    if (enrichedContext.trim()) {
      prompt += `\n\nINFORMACIÓN CONTEXTUAL RELEVANTE:${enrichedContext}`;
    }
  }

  // Add context about available plans if provided
  if (insurancePlans.length > 0) {
    prompt += `\n\nPLANES DISPONIBLES:`;

    const plansByCategory: Record<string, MockInsurancePlan[]> = {};

    // Group plans by category
    insurancePlans.forEach(plan => {
      if (!plansByCategory[plan.category]) {
        plansByCategory[plan.category] = [];
      }
      plansByCategory[plan.category].push(plan);
    });

    // Add plans by category with concise format
    Object.entries(plansByCategory).forEach(([category, plans]) => {
      prompt += `\n\n${getCategoryName(category)}:`;
      plans.forEach(plan => {
        // Limit description and show only key features
        const shortDescription = plan.description.length > 100 
          ? plan.description.substring(0, 100) + '...'
          : plan.description;
        const keyFeatures = plan.tags.slice(0, 3).join(', ');
        prompt += `\n- ${plan.name} (${plan.provider}): ${shortDescription} Desde ${plan.basePrice} ${plan.currency}. Características: ${keyFeatures}`;
      });
    });

    prompt += `\n\nAL RECOMENDAR PLANES:
• Da introducción breve (1-2 líneas máximo)
• Menciona los planes más relevantes
• Sé directo y útil
• Si el usuario quiere más detalles, proporciónales después`;
  }

  return prompt;
}

/**
 * Get a human-readable name for a category
 */
function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    'travel': 'Seguros de Viaje',
    'auto': 'Seguros de Auto',
    'pet': 'Seguros de Mascotas',
    'health': 'Seguros de Salud'
  };

  return categoryNames[category] || category;
}

/**
 * Analyze if the user message indicates they want insurance recommendations
 * Enhanced with semantic pattern matching
 */
function shouldShowInsurancePlans(userMessage: string): boolean {
  const message = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Improved pattern-based analysis
  const intentPatterns = {
    greeting: /^(hola|hi|hello|buenas|buenos dias|buenas tardes|que tal|como estas).{0,30}$/,
    needsInsurance: /(necesito|busco|quiero|me interesa|requiero).*(seguro|protec|cobertura|plan)/,
    hasAsset: /(tengo|compre|mi|nuevo|acabo de comprar).*(carro|auto|perro|gato|viaje|casa|vehiculo|mascota)/,
    priceInquiry: /(cuanto|precio|costo|barato|economico|vale).*(seguro|plan|cobertura)/,
    comparison: /(comparar|opciones|diferentes|mejor|recomienda).*(seguro|plan|cobertura)/
  };

  // If it's just a greeting, don't show plans
  if (intentPatterns.greeting.test(message)) return false;

  // If there's clear insurance intent, show plans
  return Object.values(intentPatterns).slice(1).some(pattern => pattern.test(message));
}

/**
 * Find relevant plans based on user message with improved scoring
 */
function findRelevantPlans(userMessage: string, plans: MockInsurancePlan[]): MockInsurancePlan[] {
  if (!plans.length) return [];

  const message = userMessage.toLowerCase();

  // Use the scoring system to find the most relevant plans
  const scoredPlans = plans.map(plan => ({
    plan,
    score: calculateRelevanceScore(userMessage, plan)
  }));

  // Sort by score and return top plans
  const sortedPlans = scoredPlans
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0); // Only return plans with positive scores

  // Return top 3 most relevant plans
  return sortedPlans.slice(0, 3).map(item => item.plan);
}

/**
 * Generate a multimodal response with analysis of an image
 */
export async function analyzeImageForInsurance(
  base64Image: string,
  userPrompt: string = "¿Qué tipo de seguro necesito para esto?"
): Promise<AssistantResponse> {
  const requestId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(`[OpenAI][${requestId}] Starting image analysis:`, {
    promptLength: userPrompt.length,
    timestamp: new Date().toISOString()
  });

  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "Eres Briki, un asistente especializado en seguros. Analiza la imagen proporcionada y ayuda al usuario a identificar qué tipo de seguro podría necesitar basado en lo que se muestra. Sé específico y detallado en tu análisis."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 500,
    });

    console.log(`[OpenAI][${requestId}] Image analysis successful:`, {
      tokensUsed: response.usage?.total_tokens || 0,
      responseLength: response.choices[0].message.content?.length || 0
    });

    return {
      message: response.choices[0].message.content || "No pude analizar la imagen correctamente."
    };
  } catch (error: any) {
    console.error(`[OpenAI][${requestId}] Image analysis error:`, {
      error: error.message,
      type: error.type || 'unknown',
      timestamp: new Date().toISOString()
    });
    throw new Error(`Error al analizar la imagen: ${error.message || 'Error desconocido'}`);
  }
}