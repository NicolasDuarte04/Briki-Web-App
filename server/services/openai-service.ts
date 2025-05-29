import OpenAI from "openai";
import {
  MockInsurancePlan,
  createEnrichedContext,
  loadMockInsurancePlans,
} from "../data-loader";
import { storage } from "../storage";

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
 * FIXED: Enhanced generateAssistantResponse with real plan integration
 */
export async function generateAssistantResponse(
  userMessage: string,
  conversationHistory: AssistantMessage[] = [],
  insurancePlans: MockInsurancePlan[] = [],
  userCountry: string = "Colombia",
): Promise<AssistantResponse> {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(
    `[OpenAI][${requestId}] Starting request with real data integration:`,
    {
      messageLength: userMessage.length,
      historyLength: conversationHistory.length,
      userCountry,
      timestamp: new Date().toISOString(),
    },
  );

  try {
    // FIXED: Get real plans from insurance data service
    let allPlans: MockInsurancePlan[] = [];

    // Use the new dynamic insurance data service
    const { insuranceDataService } = await import(
      "./insurance-data-service.js"
    );
    allPlans = await insuranceDataService.getAllPlans();
    console.log(
      `[OpenAI][${requestId}] Successfully loaded ${allPlans.length} insurance plans from dynamic service`,
    );

    // Filter and get relevant plans
    const filteredPlans = filterPlansByCountry(allPlans, userCountry);
    const relevantPlans = getTopRelevantPlans(userMessage, filteredPlans, 6);

    // FIXED: Enhanced system prompt with real plan data and memory context
    const systemMessage: AssistantMessage = {
      role: "system",
      content: createSystemPrompt(
        relevantPlans,
        userMessage,
        conversationHistory,
      ),
    };

    // FIXED: Check OpenAI availability and fallback logic
    if (!process.env.OPENAI_API_KEY) {
      console.warn(
        `[OpenAI][${requestId}] No API key configured, using fallback response`,
      );
      // Generate fallback response with relevant plans
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

    // FIXED: Call OpenAI with proper error handling
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
      console.log(
        `[OpenAI][${requestId}] Follow-up question detected, reattaching ${suggestedPlans.length} previous plans`,
      );
    } else if (shouldShowInsurancePlans(userMessage)) {
      // For new insurance requests, find relevant plans
      suggestedPlans = findRelevantPlans(userMessage, relevantPlans);
      console.log(
        `[OpenAI][${requestId}] Insurance intent detected, found ${suggestedPlans.length} relevant plans`,
      );
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
      timestamp: new Date().toISOString(),
    });

    return {
      message: assistantMessage,
      suggestedPlans: suggestedPlans.length > 0 ? suggestedPlans : undefined,
    };
  } catch (error: any) {
    // Enhanced error handling with specific error types
    const errorDetails = {
      requestId,
      error: error.message,
      type: error.type || "unknown",
      code: error.code || "unknown",
      status: error.status,
      messageLength: userMessage.length,
      timestamp: new Date().toISOString(),
      model: DEFAULT_MODEL,
    };

    console.error(`[OpenAI][${requestId}] Error:`, errorDetails);

    // Different error messages for better UX
    if (error.code === "rate_limit_exceeded") {
      throw new Error(
        "El servicio está temporalmente sobrecargado. Intenta nuevamente en un momento.",
      );
    } else if (error.code === "invalid_api_key") {
      throw new Error(
        "Error de configuración del servicio. Contacta al administrador.",
      );
    } else if (error.code === "insufficient_quota") {
      throw new Error(
        "Límite de uso del servicio alcanzado. Intenta más tarde.",
      );
    } else {
      throw new Error(
        `Error al generar respuesta: ${error.message || "Error desconocido"}`,
      );
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

      console.log(
        `[OpenAI] Retry ${i + 1}/${retries} after error:`,
        error.message,
      );
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, i)),
      ); // Exponential backoff
    }
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
  return plans.filter((plan) => {
    // For now, return all plans as eligibility is handled elsewhere
    // Country filtering can be enhanced later if needed
    return true;
  });
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
 * FIXED: Enhanced relevance scoring system
 */
function calculateRelevanceScore(
  userMessage: string,
  plan: MockInsurancePlan,
): number {
  let score = 0;
  const message = userMessage
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Category matching (+40 points) - INCREASED WEIGHT
  const categoryMatches: Record<string, string[]> = {
    travel: [
      "viaje",
      "viajar",
      "vacaciones",
      "internacional",
      "turismo",
      "travel",
      "trip",
    ],
    auto: [
      "carro",
      "auto",
      "vehiculo",
      "conducir",
      "automovil",
      "vespa",
      "moto",
      "car",
      "vehicle",
    ],
    pet: [
      "mascota",
      "perro",
      "gato",
      "veterinario",
      "animal",
      "pet",
      "dog",
      "cat",
    ],
    health: [
      "salud",
      "medico",
      "hospital",
      "consulta",
      "enfermedad",
      "health",
      "medical",
    ],
  };

  if (
    categoryMatches[plan.category]?.some((keyword) => message.includes(keyword))
  ) {
    score += 40;
  }

  // Direct insurance mention (+30 points) - NEW
  if (message.includes("seguro") || message.includes("insurance")) {
    score += 30;
  }

  // Need/want expressions (+20 points) - NEW
  const needExpressions = [
    "necesito",
    "quiero",
    "busco",
    "need",
    "want",
    "looking for",
  ];
  if (needExpressions.some((expr) => message.includes(expr))) {
    score += 20;
  }

  // Tag matching (+10 per matching tag)
  plan.tags.forEach((tag) => {
    const normalizedTag = tag
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (message.includes(normalizedTag)) score += 10;
  });

  // Price preference (+15 for economic plans when user mentions price)
  if (
    message.includes("barato") ||
    message.includes("economico") ||
    message.includes("precio") ||
    message.includes("cheap") ||
    message.includes("affordable")
  ) {
    if (
      plan.tags.some(
        (tag) =>
          tag.toLowerCase().includes("economico") ||
          tag.toLowerCase().includes("basico"),
      )
    ) {
      score += 15;
    }
  }

  // Premium preference (+10 for premium plans when user mentions quality/complete)
  if (
    message.includes("completo") ||
    message.includes("premium") ||
    message.includes("mejor") ||
    message.includes("complete") ||
    message.includes("best")
  ) {
    if (
      plan.tags.some(
        (tag) =>
          tag.toLowerCase().includes("premium") ||
          tag.toLowerCase().includes("completo"),
      )
    ) {
      score += 10;
    }
  }

  return score;
}

/**
 * Extract previous recommendations from conversation history
 */
function extractPreviousRecommendations(
  conversationHistory: AssistantMessage[],
): string {
  const lastAssistantMessage = conversationHistory
    .filter((msg) => msg.role === "assistant")
    .slice(-1)[0];

  if (lastAssistantMessage?.content.includes("[Planes recomendados:")) {
    const match = lastAssistantMessage.content.match(
      /\[Planes recomendados: ([^\]]+)\]/,
    );
    if (match) {
      return `\n\nCONTEXTO IMPORTANTE: En tu respuesta anterior recomendaste estos planes: ${match[1]}. El usuario puede estar refiriéndose a estos planes en su nueva pregunta.`;
    }
  }
  return "";
}

/**
 * Create a system prompt with improved structure and context
 */
function createSystemPrompt(
  insurancePlans: MockInsurancePlan[],
  userMessage: string = "",
  conversationHistory?: AssistantMessage[],
): string {
  // Start with structured base instructions
  let prompt = `Eres Briki, un asistente de seguros amigable y profesional.

REGLAS DE RECOMENDACIÓN:
• Recomienda planes cuando el usuario:
  - Mencione necesidad específica de seguro
  - Describa un objeto/situación que requiere protección  
  - Pregunte directamente por opciones
• Para saludos generales: responde amigablemente y pregunta qué le interesa
• Mantén respuestas concisas (máximo 2-3 líneas)
• Sé directo al mostrar recomendaciones

ESTILO DE RESPUESTA:
• Conciso y directo
• Amigable pero profesional
• Enfocado en soluciones`;

  // Add enriched context from knowledge base
  if (userMessage) {
    const enrichedContext = createEnrichedContext(userMessage, insurancePlans);
    if (enrichedContext.trim()) {
      prompt += `\n\nINFORMACIÓN CONTEXTUAL RELEVANTE:${enrichedContext}`;
    }
  }

  // Add previous conversation context if available
  const previousContext = conversationHistory
    ? extractPreviousRecommendations(conversationHistory)
    : "";
  if (previousContext) {
    prompt += previousContext;
  }

  // Add context about available plans if provided
  if (insurancePlans.length > 0) {
    prompt += `\n\nPLANES DISPONIBLES:`;

    const plansByCategory: Record<string, MockInsurancePlan[]> = {};

    // Group plans by category
    insurancePlans.forEach((plan) => {
      if (!plansByCategory[plan.category]) {
        plansByCategory[plan.category] = [];
      }
      plansByCategory[plan.category].push(plan);
    });

    // Add plans by category with concise format
    Object.entries(plansByCategory).forEach(([category, plans]) => {
      prompt += `\n\n${getCategoryName(category)}:`;
      plans.forEach((plan) => {
        // Limit description and show only key features
        const shortDescription =
          plan.description.length > 80
            ? plan.description.substring(0, 80) + "..."
            : plan.description;
        const keyFeatures = plan.tags.slice(0, 2).join(", ");
        prompt += `\n- ${plan.name}: ${shortDescription} Desde ${plan.basePrice} ${plan.currency}`;
      });
    });

    prompt += `\n\nAL RECOMENDAR PLANES:
• Da respuesta breve (1-2 líneas máximo)
• Los planes se mostrarán automáticamente como tarjetas
• No repitas toda la información del plan en el texto`;
  }

  return prompt;
}

/**
 * Get a human-readable name for a category
 */
function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    travel: "Seguros de Viaje",
    auto: "Seguros de Auto",
    pet: "Seguros de Mascotas",
    health: "Seguros de Salud",
  };

  return categoryNames[category] || category;
}

/**
 * FIXED: Enhanced insurance intent detection with better patterns
 */
function shouldShowInsurancePlans(userMessage: string): boolean {
  const message = userMessage
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Enhanced pattern-based analysis with more comprehensive coverage
  const intentPatterns = {
    // Clear insurance need patterns
    directNeed:
      /(necesito|busco|quiero|me interesa|requiero|need|want|looking for).*(seguro|insurance|protec|cobertura|plan)/,

    // Asset-based patterns (having something that needs insurance)
    hasAsset:
      /(tengo|compre|mi|nuevo|acabo de comprar|have|own|bought|new).*(carro|auto|perro|gato|viaje|casa|vehiculo|mascota|car|pet|dog|cat|travel)/,

    // Activity-based patterns (doing something that needs insurance)
    activity:
      /(viajo|viajar|conducir|manejar|traveling|driving).*(seguro|insurance|protec)/,

    // Direct insurance category mentions
    categories:
      /(seguro de|insurance for).*(viaje|auto|mascota|salud|travel|car|pet|health)/,

    // Question patterns about insurance
    questions:
      /(que seguro|what insurance|cual plan|which plan|como proteger|how to protect)/,

    // Price and comparison patterns
    comparison:
      /(precio|costo|comparar|opciones|recomienda|price|cost|compare|recommend).*(seguro|insurance|plan)/,
  };

  // Exclude simple greetings (but allow longer messages with greetings)
  const simpleGreetings =
    /^(hola|hi|hello|buenas|buenos dias|buenas tardes|hey)\.?\s*$/;
  if (simpleGreetings.test(message)) {
    return false;
  }

  // Check if any insurance intent pattern matches
  const hasIntent = Object.values(intentPatterns).some((pattern) =>
    pattern.test(message),
  );

  // Additional context-based detection
  const insuranceKeywords = [
    "seguro",
    "insurance",
    "proteccion",
    "cobertura",
    "plan",
    "poliza",
  ];
  const categoryKeywords = [
    "viaje",
    "auto",
    "mascota",
    "salud",
    "travel",
    "car",
    "pet",
    "health",
  ];
  const actionKeywords = [
    "necesito",
    "busco",
    "quiero",
    "need",
    "want",
    "looking",
  ];

  const hasInsuranceKeyword = insuranceKeywords.some((keyword) =>
    message.includes(keyword),
  );
  const hasCategoryKeyword = categoryKeywords.some((keyword) =>
    message.includes(keyword),
  );
  const hasActionKeyword = actionKeywords.some((keyword) =>
    message.includes(keyword),
  );

  // Show plans if we have clear intent OR if we have insurance + category/action keywords
  return (
    hasIntent ||
    (hasInsuranceKeyword && (hasCategoryKeyword || hasActionKeyword))
  );
}

/**
 * FIXED: Enhanced plan finding with better filtering
 */
function findRelevantPlans(
  userMessage: string,
  plans: MockInsurancePlan[],
): MockInsurancePlan[] {
  if (!plans.length) return [];

  // Use the scoring system to find the most relevant plans
  const scoredPlans = plans.map((plan) => ({
    plan,
    score: calculateRelevanceScore(userMessage, plan),
  }));

  // Sort by score and return plans with positive scores
  const sortedPlans = scoredPlans
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 15); // Only return plans with meaningful relevance

  // Return top 3 most relevant plans, or all if less than 3
  const topPlans = sortedPlans.slice(0, 3).map((item) => item.plan);

  // If no highly relevant plans found, return some plans from the most likely category
  if (topPlans.length === 0 && plans.length > 0) {
    const message = userMessage.toLowerCase();

    // Try to match category and return 2-3 plans from that category
    if (message.includes("viaje") || message.includes("travel")) {
      return plans.filter((p) => p.category === "travel").slice(0, 3);
    } else if (
      message.includes("auto") ||
      message.includes("car") ||
      message.includes("carro")
    ) {
      return plans.filter((p) => p.category === "auto").slice(0, 3);
    } else if (
      message.includes("mascota") ||
      message.includes("pet") ||
      message.includes("perro") ||
      message.includes("gato")
    ) {
      return plans.filter((p) => p.category === "pet").slice(0, 3);
    } else if (message.includes("salud") || message.includes("health")) {
      return plans.filter((p) => p.category === "health").slice(0, 3);
    }

    // Fallback: return 3 random plans
    return plans.slice(0, 3);
  }

  return topPlans;
}

/**
 * Generate a multimodal response with analysis of an image
 */
export async function analyzeImageForInsurance(
  base64Image: string,
  userPrompt: string = "¿Qué tipo de seguro necesito para esto?",
): Promise<AssistantResponse> {
  const requestId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(`[OpenAI][${requestId}] Starting image analysis:`, {
    promptLength: userPrompt.length,
    timestamp: new Date().toISOString(),
  });

  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Eres Briki, un asistente especializado en seguros. Analiza la imagen proporcionada y ayuda al usuario a identificar qué tipo de seguro podría necesitar basado en lo que se muestra. Sé específico y detallado en tu análisis.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    console.log(`[OpenAI][${requestId}] Image analysis successful:`, {
      tokensUsed: response.usage?.total_tokens || 0,
      responseLength: response.choices[0].message.content?.length || 0,
    });

    return {
      message:
        response.choices[0].message.content ||
        "No pude analizar la imagen correctamente.",
    };
  } catch (error: any) {
    console.error(`[OpenAI][${requestId}] Image analysis error:`, {
      error: error.message,
      type: error.type || "unknown",
      timestamp: new Date().toISOString(),
    });
    throw new Error(
      `Error al analizar la imagen: ${error.message || "Error desconocido"}`,
    );
  }
}
