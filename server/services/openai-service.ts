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
 * FIXED: Enhanced generateAssistantResponse with real plan integration and memory preservation
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
    const contextAnalysis = analyzeContextNeeds(userMessage, conversationHistory);
    const systemMessage: AssistantMessage = {
      role: "system",
      content: createSystemPrompt(
        relevantPlans,
        userMessage,
        conversationHistory,
        contextAnalysis,
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
        `🧠 [OpenAI][${requestId}] Follow-up question detected – reattaching ${suggestedPlans.length} previous plans`,
      );
    } else {
      // NEW: Consultative logic - check if we need more context before showing plans
      const contextAnalysis = analyzeContextNeeds(userMessage, conversationHistory);

      if (contextAnalysis.needsMoreContext) {
        // Don't show plans yet, let AI ask for more context
        console.log(
          `🤔 [OpenAI][${requestId}] Context needed for ${contextAnalysis.category} - gathering info before showing plans`,
        );
        suggestedPlans = []; // No plans until we have enough context
      } else if (shouldShowInsurancePlans(userMessage)) {
        // Only show plans when we have sufficient context
        suggestedPlans = findRelevantPlans(userMessage, relevantPlans);
        console.log(
          `[OpenAI][${requestId}] Sufficient context available, showing ${suggestedPlans.length} relevant plans`,
        );
      } else {
        // ENHANCED: Also check if user has provided enough context in current message
        const category = detectInsuranceCategory(userMessage);
        if (category !== 'general' && relevantPlans.length > 0) {
          // If we detect a clear insurance category and have relevant plans, show them
          suggestedPlans = findRelevantPlans(userMessage, relevantPlans);
          console.log(
            `[OpenAI][${requestId}] Category detected (${category}), showing ${suggestedPlans.length} relevant plans`,
          );
        }
      }
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
 * FIXED: Enhanced follow-up detection with more comprehensive patterns
 */
function isFollowUpQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase().trim();

  const followUpPatterns = [
    /cuál es (el )?mejor/,
    /cuál (me )?recomienda/,
    /qué (me )?recomienda/,
    /cuál es (la )?diferencia/,
    /cuál conviene/,
    /entre (esos|estos)/,
    /qué incluye/,
    /qué cubre/,
    /cuánto cuesta/,
    /precio/,
    /cobertura/,
    /el primero/,
    /el segundo/,
    /el tercero/,
    /ese plan/,
    /esa opción/,
    /más información/,
    /más detalles/,
    /explica/,
    /compara/,
    /necesito más/,
    /puedes explicar/,
    /me gustaría saber/,
    /dime más/,
    /háblame de/,
  ];

  return followUpPatterns.some(pattern => pattern.test(lowerMessage));
}

/**
 * Extract previously suggested plans from conversation history
 */
function extractPreviousPlansFromHistory(history: AssistantMessage[]): MockInsurancePlan[] {
  for (let i = history.length - 1; i >= 0; i--) {
    const message = history[i];
    if (message.role === 'assistant' && message.content.includes('[Planes previamente recomendados:')) {
      const planMatch = message.content.match(/\[Planes previamente recomendados: ([^\]]+)\]/);
      if (planMatch) {
        const planString = planMatch[1];
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
    const allPlans = loadMockInsurancePlans();
    const extractedPlans: MockInsurancePlan[] = [];
    const planEntries = planString.split(', ');

    for (const entry of planEntries) {
      const nameMatch = entry.match(/^([^(]+?)\s+de\s+/);
      if (nameMatch) {
        const planName = nameMatch[1].trim();
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
 * Analyze if user message needs more context before showing plans
 */
interface ContextAnalysis {
  needsMoreContext: boolean;
  category: string;
  missingInfo: string[];
  suggestedQuestions?: string[];
}

function analyzeContextNeeds(userMessage: string, conversationHistory: AssistantMessage[]): ContextAnalysis {
  const lowerMessage = userMessage.toLowerCase().trim();

  // Check if user already provided detailed context in conversation
  const hasDetailedContext = conversationHistory.some(msg => 
    msg.role === 'user' && (
      msg.content.length > 50 || // Detailed messages
      /\d+/.test(msg.content) || // Contains numbers (ages, dates, etc.)
      /(años?|meses?|días?|duración|países?|raza|modelo|marca)/i.test(msg.content)
    )
  );

  // Travel insurance context analysis
  if (/(viaj|europe|estados unidos|méxico|international|trip|travel)/i.test(lowerMessage)) {
    const travelDetails = {
      destination: /(europa|asia|méxico|estados unidos|[a-z]+)/i.test(lowerMessage),
      duration: /(días?|semanas?|meses?|\d+)/i.test(lowerMessage),
      travelers: /(solo|familia|acompañant|personas?)/i.test(lowerMessage),
      priorities: /(precio|cobertura|médic|cancelac)/i.test(lowerMessage),
      medical: /(condición|médic|enferm|salud)/i.test(lowerMessage)
    };

    const missingCount = Object.values(travelDetails).filter(Boolean).length;
    const needsMoreInfo = !hasDetailedContext && missingCount < 2;

    return {
      needsMoreContext: needsMoreInfo,
      category: 'travel',
      missingInfo: ['destino', 'duración', 'acompañantes'],
      suggestedQuestions: needsMoreInfo ? [
        "¿A qué país o región viajas?",
        "¿Cuál es la duración del viaje?",
        "¿Viajas solo o acompañado?"
      ] : undefined
    };
  }

  // Pet insurance context analysis
  if (/(mascot|perr|gat|pet|animal)/i.test(lowerMessage)) {
    const petDetails = {
      type: /(perr|gat|dog|cat)/i.test(lowerMessage),
      age: /(\d+|años?|meses?|cachorro|adulto|mayor)/i.test(lowerMessage),
      breed: /(raza|labrador|golden|pastor|siamés)/i.test(lowerMessage),
      health: /(sano|enferm|condición|médic|preexist)/i.test(lowerMessage),
      coverage: /(básic|vacun|emergenc|veterinari)/i.test(lowerMessage)
    };

    const missingCount = Object.values(petDetails).filter(Boolean).length;
    const needsMoreInfo = !hasDetailedContext && missingCount < 2;

    return {
      needsMoreContext: needsMoreInfo,
      category: 'pet',
      missingInfo: ['tipo de mascota', 'edad', 'raza'],
      suggestedQuestions: needsMoreInfo ? [
        "¿Qué tipo de mascota tienes? (perro, gato, otro)",
        "¿Cuál es su raza y edad aproximada?",
        "¿Tiene alguna condición médica preexistente?"
      ] : undefined
    };
  }

  // Auto insurance context analysis
  if (/(auto|vehicul|carro|moto|seguro.*auto)/i.test(lowerMessage)) {
    const autoDetails = {
      brand: /(marca|toyota|honda|ford|chevrolet|nissan)/i.test(lowerMessage),
      model: /(modelo|\d{4}|año)/i.test(lowerMessage),
      age: /(\d+|años?|nuevo|usado)/i.test(lowerMessage),
      coverage: /(básic|completo|terceros|todo riesgo)/i.test(lowerMessage),
      use: /(trabajo|personal|comercial|uber)/i.test(lowerMessage)
    };

    const missingCount = Object.values(autoDetails).filter(Boolean).length;
    const needsMoreInfo = !hasDetailedContext && missingCount < 2;

    return {
      needsMoreContext: needsMoreInfo,
      category: 'auto',
      missingInfo: ['marca y modelo', 'año del vehículo', 'uso del vehículo'],
      suggestedQuestions: needsMoreInfo ? [
        "¿Cuál es la marca y modelo de tu vehículo?",
        "¿De qué año es y para qué lo usas principalmente?",
        "¿Prefieres cobertura básica o completa?"
      ] : undefined
    };
  }

  // Health insurance context analysis
  if (/(salud|médic|health|hospitaliz)/i.test(lowerMessage)) {
    const healthDetails = {
      age: /(\d+|años?|joven|adulto|mayor)/i.test(lowerMessage),
      family: /(familia|hijo|esposa|pareja)/i.test(lowerMessage),
      conditions: /(condición|enferm|diabetes|hipertens)/i.test(lowerMessage),
      coverage: /(básic|completo|internacional)/i.test(lowerMessage),
      budget: /(económic|precio|barato|premium)/i.test(lowerMessage)
    };

    const missingCount = Object.values(healthDetails).filter(Boolean).length;
    const needsMoreInfo = !hasDetailedContext && missingCount < 2;

    return {
      needsMoreContext: needsMoreInfo,
      category: 'health',
      missingInfo: ['edad', 'personas a cubrir', 'tipo de cobertura'],
      suggestedQuestions: needsMoreInfo ? [
        "¿Para quién es el seguro? (individual, familiar)",
        "¿Qué edad tienen las personas a asegurar?",
        "¿Tienen alguna condición médica preexistente?"
      ] : undefined
    };
  }

  return {
    needsMoreContext: false,
    category: 'general',
    missingInfo: []
  };
}

/**
 * FIXED: Enhanced system prompt with explicit conversation continuation instructions
 */
function createSystemPrompt(
  relevantPlans: MockInsurancePlan[],
  userMessage: string,
  conversationHistory: AssistantMessage[],
  contextAnalysis: ContextAnalysis,
): string {
  const hasHistory = conversationHistory.length > 0;
  const previousPlans = extractPreviousPlansFromHistory(conversationHistory);
  const isFollowUp = isFollowUpQuestion(userMessage) && previousPlans.length > 0;

  return `Eres Briki, un asistente especializado en seguros que ayuda a usuarios en Colombia a encontrar el mejor seguro. 

IMPORTANTE: NUNCA termines la conversación después de mostrar planes. SIEMPRE invita al usuario a hacer más preguntas.

## INSTRUCCIONES DE MEMORIA Y CONTINUIDAD:
- MANTÉN el contexto de toda la conversación anterior
- Si ya mostraste planes, recuerda cuáles fueron y sigue ayudando
- Responde preguntas de seguimiento sobre los planes ya recomendados
- Invita activamente a comparar opciones y hacer más preguntas
- NO resetees la conversación después de dar recomendaciones

## FLUJO CONVERSACIONAL:
${isFollowUp ? `
🧠 MODO SEGUIMIENTO: El usuario está preguntando sobre planes ya mostrados.
- Planes previamente mostrados: ${previousPlans.map(p => p.name).join(', ')}
- Responde específicamente sobre esos planes
- Mantén visible la información de los planes anteriores
` : `
${contextAnalysis.needsMoreContext ? `
🤔 MODO RECOLECCIÓN: Necesitas más información antes de mostrar planes.
- Categoría detectada: ${contextAnalysis.category}
- Información faltante: ${contextAnalysis.missingInfo.join(', ')}
- Haz preguntas específicas antes de recomendar planes
` : `
✅ MODO RECOMENDACIÓN: Tienes suficiente contexto para mostrar planes.
- Recomienda planes específicos para la categoría detectada
- Después de mostrar planes, invita a preguntas de seguimiento
`}
`}

## DESPUÉS DE MOSTRAR PLANES:
- Pregunta si necesita más información sobre algún plan específico
- Ofrece comparar características entre planes
- Invita a aclarar dudas sobre coberturas o precios
- Mantén un tono consultivo y servicial

## ESTILO DE RESPUESTA:
- Conversacional y amigable
- Explica en términos simples
- Haz preguntas relevantes para entender mejor las necesidades
- SIEMPRE termina invitando a continuar la conversación

${relevantPlans.length > 0 ? `
## PLANES DISPONIBLES:
${relevantPlans.map(plan => `
- **${plan.name}** (${plan.provider})
  - Precio: ${plan.basePrice} ${plan.currency}
  - Categoría: ${plan.category}
  - Cobertura: ${plan.coverageAmount}
  - Descripción: ${plan.description}
`).join('\n')}
` : ''}

Responde de manera útil y mantén la conversación activa. Si muestras planes, SIEMPRE pregunta si el usuario quiere saber más detalles, comparar opciones, o tiene otras dudas.`;
}

/**
 * Enhanced insurance intent detection with stricter context requirements
 */
function shouldShowInsurancePlans(message: string): boolean {
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

  if (hasStrongIntent) return true;

  // Conservative keyword-based detection
  const insuranceKeywords = [
    "seguro",
    "insurance",
    "protección",
    "cobertura",
    "plan",
    "póliza",
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

  // Show plans only with clear intent AND context
  return hasInsuranceKeyword && hasCategoryKeyword && hasActionKeyword;
}

/**
 * Detect insurance category from user message with high precision
 */
function detectInsuranceCategory(userMessage: string): string {
  const message = userMessage.toLowerCase().trim();

  // High-confidence patterns first
  const petKeywords = ['mascota', 'perro', 'gato', 'pet', 'dog', 'cat', 'animal', 'veterinario'];
  const travelKeywords = ['viaje', 'travel', 'trip', 'internacional', 'europa', 'estados unidos', 'méxico', 'vacaciones'];
  const autoKeywords = ['auto', 'carro', 'vehiculo', 'moto', 'car', 'vehicle', 'motorcycle', 'scooter'];
  const healthKeywords = ['salud', 'health', 'médico', 'medical', 'hospital', 'doctor', 'medicina'];

  if (petKeywords.some(keyword => message.includes(keyword))) {
    return 'pet';
  }

  if (travelKeywords.some(keyword => message.includes(keyword))) {
    return 'travel';
  }

  if (autoKeywords.some(keyword => message.includes(keyword))) {
    return 'auto';
  }

  if (healthKeywords.some(keyword => message.includes(keyword))) {
    return 'health';
  }

  // Check for insurance type patterns
  if (/seguro.*(mascot|perr|gat)/i.test(message)) return 'pet';
  if (/seguro.*(viaj|travel)/i.test(message)) return 'travel';
  if (/seguro.*(auto|vehicul|carro)/i.test(message)) return 'auto';
  if (/seguro.*(salud|medic)/i.test(message)) return 'health';

  return 'general';
}

/**
 * FIXED: Strict category filtering with NO fallback to prevent cross-category contamination
 */
function findRelevantPlans(
  userMessage: string,
  plans: MockInsurancePlan[],
): MockInsurancePlan[] {
  if (!plans.length) return [];

  // STEP 1: Detect user intent and required category
  const detectedCategory = detectInsuranceCategory(userMessage);

  console.log(`🎯 Category detection: "${detectedCategory}" from message: "${userMessage}"`);

  // STEP 2: If category is clearly detected, ONLY return plans from that category
  if (detectedCategory && detectedCategory !== 'general') {
    const categoryPlans = plans.filter(plan => plan.category === detectedCategory);

    if (categoryPlans.length > 0) {
      // Score only plans from the correct category
      const scoredPlans = categoryPlans.map((plan) => ({
        plan,
        score: calculateRelevanceScore(userMessage, plan),
      }));

      const sortedPlans = scoredPlans
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(item => item.plan);

      console.log(`✅ Found ${sortedPlans.length} ${detectedCategory} plans`);
      return sortedPlans;
    } else {
      // FIXED: NO fallback - return empty array instead of wrong category plans
      console.log(`❌ No plans found for category: ${detectedCategory}`);
      return [];
    }
  }

  // STEP 3: If no clear category detected, return empty array (no random plans)
  console.log(`❓ No clear category detected, not showing any plans`);
  return [];
}

/**
 * Calculate relevance score based on multiple factors
 */
function calculateRelevanceScore(userMessage: string, plan: MockInsurancePlan): number {
  let score = 0;
  const message = userMessage.toLowerCase();
  const planText = `${plan.name} ${plan.description} ${plan.features.join(' ')}`.toLowerCase();

  // Exact keyword matches
  const keywords = message.split(' ').filter(word => word.length > 3);
  keywords.forEach(keyword => {
    if (planText.includes(keyword)) {
      score += 2;
    }
  });

  // Category relevance (highest priority)
  if (plan.category === detectInsuranceCategory(userMessage)) {
    score += 10;
  }

  // Price preference detection
  if (message.includes('económico') || message.includes('barato')) {
    score += plan.basePrice < 100000 ? 3 : -2;
  }
  if (message.includes('premium') || message.includes('completo')) {
    score += plan.basePrice > 200000 ? 3 : -1;
  }

  // Coverage amount preference
  if (message.includes('alta cobertura') || message.includes('máxima')) {
    score += plan.coverageAmount > 1000000 ? 2 : 0;
  }

  // Feature matching
  plan.features.forEach(feature => {
    if (message.includes(feature.toLowerCase())) {
      score += 1;
    }
  });

  return score;
}

/**
 * Filter plans by country (placeholder for country-specific filtering)
 */
function filterPlansByCountry(plans: MockInsurancePlan[], country: string): MockInsurancePlan[] {
  // For now, return all plans since we're focused on Colombia
  return plans;
}

/**
 * Get top relevant plans with scoring
 */
function getTopRelevantPlans(userMessage: string, plans: MockInsurancePlan[], limit: number): MockInsurancePlan[] {
  const scoredPlans = plans.map(plan => ({
    plan,
    score: calculateRelevanceScore(userMessage, plan)
  }));

  return scoredPlans
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.plan);
}

/**
 * Legacy function exports for compatibility with existing routes
 */
export async function getChatCompletionFromOpenAI(message: string): Promise<string> {
  try {
    const response = await generateAssistantResponse(message, [], [], "Colombia");
    return response.message;
  } catch (error) {
    console.error("Error in getChatCompletionFromOpenAI:", error);
    throw error;
  }
}

export async function generateInsuranceRecommendation(category: string, criteria: any): Promise<string> {
  try {
    const message = `I need ${category} insurance with these requirements: ${JSON.stringify(criteria)}`;
    const response = await generateAssistantResponse(message, [], [], "Colombia");
    return response.message;
  } catch (error) {
    console.error("Error in generateInsuranceRecommendation:", error);
    throw error;
  }
}

export async function explainInsuranceTerm(term: string): Promise<string> {
  try {
    const message = `Please explain the insurance term: ${term}`;
    const response = await generateAssistantResponse(message, [], [], "Colombia");
    return response.message;
  } catch (error) {
    console.error("Error in explainInsuranceTerm:", error);
    throw error;
  }
}

export async function comparePlans(plans: any[]): Promise<string> {
  try {
    const message = `Please compare these insurance plans: ${JSON.stringify(plans)}`;
    const response = await generateAssistantResponse(message, [], [], "Colombia");
    return response.message;
  } catch (error) {
    console.error("Error in comparePlans:", error);
    throw error;
  }
}

export async function analyzeImageForInsurance(imageData: string, prompt?: string): Promise<any> {
  try {
    const analysis = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt || "Analyze this image and suggest relevant insurance products.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    return {
      message: analysis.choices[0]?.message?.content || "Unable to analyze image",
    };
  } catch (error) {
    console.error("Error in analyzeImageForInsurance:", error);
    throw error;
  }
}