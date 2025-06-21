/**
 * =================================================================
 * SERVICE: OPENAI ASSISTANT
 * =================================================================
 * This service now integrates with real insurance plan data fetched
 * directly from the Supabase database (`insurance_plans` table).
 *
 * The mock data loader (`data-loader.ts`) and the mock insurance
 * data service (`insurance-data-service.ts`) are no longer used for
 * generating assistant responses with plan suggestions.
 *
 * To extend or update the available plans, you should add or modify
 * the records in the `insurance_plans` table in the database.
 * The `scripts/seed-plans.ts` script can be used as a reference
 * for populating this table.
 * =================================================================
 */
import OpenAI from "openai";
import {
  MockInsurancePlan,
  createEnrichedContext,
  loadMockInsurancePlans,
} from "../data-loader";
import { storage } from "../storage";
import { db } from "../db";
import { insurancePlans, InsuranceCategory } from "@shared/schema";
import { analyzeContextNeeds, detectInsuranceCategory, ContextAnalysisResult } from "@shared/context-utils";
import fetch from 'node-fetch';
import { AssistantMemory } from "@shared/types/assistant";

// Define a simpler, unified plan type for the assistant's purpose
interface InsurancePlan {
  id: number;
  name: string;
  category: InsuranceCategory;
  provider: string;
  basePrice: number;
  coverageAmount: number;
  currency: string;
  country: string;
  benefits: string[];
  description?: string; // Add optional description
}

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
  message?: string;
  response?: string;
  suggestedPlans?: InsurancePlan[];
  category?: string;
  memory?: AssistantMemory;
  needsMoreContext?: boolean;
  suggestedQuestions?: string[];
}

/**
 * FIXED: Enhanced generateAssistantResponse with real plan integration and memory preservation
 */
export async function generateAssistantResponse(
  userMessage: string,
  conversationHistory: AssistantMessage[] = [],
  memory: AssistantMemory = {},
  userCountry: string = "Colombia",
): Promise<AssistantResponse> {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  let updatedMemory = { ...memory };

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
    // Detect category first to decide on special actions
    const category = detectInsuranceCategory(userMessage);

    // If auto insurance, check for license plate and lookup if needed
    if (category === 'auto' && !updatedMemory.vehicle) {
      const plate = extractPlate(userMessage);
      if (plate) {
        console.log(`[Vehicle Lookup][${requestId}] Plate detected: ${plate}. Fetching details...`);
        try {
          const vehicleData = await lookupVehicleByPlate(plate);
          if (vehicleData) {
            updatedMemory.vehicle = vehicleData;
            console.log(`[Vehicle Lookup][${requestId}] Success. Vehicle data injected into memory.`);
          }
        } catch (error: any) {
          console.warn(`[Vehicle Lookup][${requestId}] Failed: ${error.message}`);
          // Fallback: continue without vehicle data, context analysis will ask for it
        }
      }
    }

    // Get real plans from the database
    let allPlans: InsurancePlan[] = await db.select().from(insurancePlans);

    // Filter and get relevant plans
    const filteredPlans = filterPlansByCountry(allPlans, userCountry);
    const relevantPlans = getTopRelevantPlans(userMessage, filteredPlans, 6);

    // Enhanced system prompt with real plan data and memory context
    const conversation = [...conversationHistory, { role: 'user', content: userMessage }].map(m => m.content).join(' ');
    const contextAnalysis = analyzeContextNeeds(conversation, category, updatedMemory);
    const systemMessage: AssistantMessage = {
      role: "system",
      content: createSystemPrompt(
        relevantPlans,
        userMessage,
        conversationHistory,
        contextAnalysis,
        updatedMemory
      ),
    };

    // FIXED: Check OpenAI availability and fallback logic
    if (!process.env.OPENAI_API_KEY) {
      console.warn(
        `[OpenAI][${requestId}] No API key configured, using fallback response`,
      );
      // Generate fallback response with relevant plans
      const fallbackMessage = `¡Hola! Soy Briki, tu asistente de seguros. Entiendo que estás preguntando sobre: "${userMessage}". Te puedo ayudar con información sobre seguros y recomendarte los mejores planes disponibles.`;
      
      const fallbackCategory = detectInsuranceCategory(userMessage);
      const fallbackConversation = [...(conversationHistory || []), { role: 'user', content: userMessage }]
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join(' ');
      const fallbackContextAnalysis = analyzeContextNeeds(fallbackConversation, fallbackCategory, updatedMemory);
      
      return {
        message: fallbackMessage,
        response: fallbackMessage,
        suggestedPlans: relevantPlans.slice(0, 3),
        category: fallbackCategory,
        memory: updatedMemory,
        needsMoreContext: fallbackContextAnalysis.needsMoreContext,
        suggestedQuestions: fallbackContextAnalysis.suggestedQuestions || [],
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
    let suggestedPlans: InsurancePlan[] = [];

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
      // Check if we need more context before showing plans
      const category = detectInsuranceCategory(userMessage);
      const conversation = [...conversationHistory, { role: 'user', content: userMessage }]
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join(' ');
      const planContextAnalysis = analyzeContextNeeds(conversation, category, updatedMemory);

      if (planContextAnalysis.needsMoreContext) {
        // Don't show plans when more context is needed
        console.log(
          `[OpenAI][${requestId}] More context needed for ${planContextAnalysis.category}, not showing plans yet`,
        );
        suggestedPlans = [];
      } else {
        // Show plans if context is sufficient
        const category = detectInsuranceCategory(userMessage);

        if (category !== "general" && relevantPlans.length > 0) {
          suggestedPlans = findRelevantPlans(userMessage, relevantPlans);
          console.log(
            `[OpenAI][${requestId}] Category detected (${category}), showing ${suggestedPlans.length} relevant plans`,
          );
        } else if (shouldShowInsurancePlans(userMessage)) {
          suggestedPlans = findRelevantPlans(userMessage, relevantPlans);
          console.log(
            `[OpenAI][${requestId}] Insurance intent detected, showing ${suggestedPlans.length} relevant plans`,
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

    // Use the same context analysis from the plan logic
    const finalContextCategory = detectInsuranceCategory(userMessage);
    const finalConversation = [...conversationHistory, { role: 'user', content: userMessage }]
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join(' ');
    const finalContextAnalysis = analyzeContextNeeds(finalConversation, finalContextCategory, updatedMemory);
    
    return {
      message: assistantMessage,
      response: assistantMessage, // Provide both for compatibility
      suggestedPlans: suggestedPlans.length > 0 ? suggestedPlans : undefined,
      category: finalContextCategory,
      memory: updatedMemory,
      needsMoreContext: finalContextAnalysis.needsMoreContext,
      suggestedQuestions: finalContextAnalysis.suggestedQuestions || [],
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
function extractPreviousPlansFromHistory(history: AssistantMessage[]): InsurancePlan[] {
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
function parsePlansFromString(planString: string): InsurancePlan[] {
  try {
    // This function will need to be updated or replaced as it relies on mock data
    // For now, it will return an empty array.
    return [];
  } catch (error) {
    console.warn('Error parsing plans from string:', error);
    return [];
  }
}

/**
 * FIXED: Enhanced system prompt with explicit conversation continuation instructions
 */
function createSystemPrompt(
  relevantPlans: InsurancePlan[],
  userMessage: string,
  conversationHistory: AssistantMessage[],
  contextAnalysis: ContextAnalysisResult,
  memory: AssistantMemory,
): string {
  const hasHistory = conversationHistory.length > 0;
  const previousPlans = extractPreviousPlansFromHistory(conversationHistory);
  const isFollowUp = isFollowUpQuestion(userMessage) && previousPlans.length > 0;

  const vehicleContext = memory.vehicle 
    ? `
## VEHICLE DATA (no mostrar al usuario)
- Placa: ${memory.vehicle.plate}
- Marca: ${memory.vehicle.make}
- Modelo: ${memory.vehicle.model}
- Año: ${memory.vehicle.year}
- Combustible: ${memory.vehicle.fuel}
`
    : '';

  return `Eres Briki, un asistente especializado en seguros que ayuda a usuarios en Colombia a encontrar el mejor seguro. 
${vehicleContext}
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
- CUANDO MUESTRES PLANES: Menciona brevemente que verán las opciones como tarjetas visuales

## CRÍTICO - EVITAR DUPLICACIÓN DE PLANES:
- Cuando muestres planes, NUNCA los listes por nombre en tu respuesta de texto
- SOLO di "He encontrado algunas opciones que aparecerán como tarjetas interactivas"
- NO menciones nombres específicos de planes, precios, o características
- Las tarjetas muestran toda la información - tu texto debe ser breve
- Enfócate en invitar al usuario a revisar las tarjetas y hacer preguntas

${relevantPlans.length > 0 ? `
## PLANES DISPONIBLES PARA REFERENCIA (NO INCLUIR EN RESPUESTA):
${relevantPlans.map(plan => `
- ${plan.name} (${plan.provider}) - ${plan.category}
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
    /seguro.*para.*mi/,
    /seguro.*de/,
    /necesito.*para.*mi/,
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
 * Extract requested number of plans from user message
 */
function extractRequestedPlanCount(message: string): number | null {
  const lowerMessage = message.toLowerCase();

  // Look for explicit numbers like "4 planes", "5 opciones", "3 seguros"
  const numberMatch = lowerMessage.match(/(\d+)\s*(planes?|opciones?|seguros?|recommendations?)/);
  if (numberMatch) {
    const count = parseInt(numberMatch[1]);
    return count <= 10 ? count : null; // Cap at 10 for sanity
  }

  // Look for written numbers
  const writtenNumbers: Record<string, number> = {
    'uno': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5
  };

  for (const [word, num] of Object.entries(writtenNumbers)) {
    if (lowerMessage.includes(word)) {
      return num;
    }
  }

  return null;
}

/**
 * FIXED: Strict category filtering with NO fallback to prevent cross-category contamination
 */
function findRelevantPlans(
  userMessage: string,
  plans: InsurancePlan[],
): InsurancePlan[] {
  if (!plans.length) return [];

  // STEP 1: Detect user intent and required category
  const detectedCategory = detectInsuranceCategory(userMessage);

  console.log(`🎯 Category detection: "${detectedCategory}" from message: "${userMessage}"`);

  // STEP 2: If category is clearly detected, ONLY return plans from that category
  if (detectedCategory && detectedCategory !== 'general') {
    const categoryPlans = plans.filter(plan => plan.category === detectedCategory);

    if (categoryPlans.length > 0) {
      // Check if user requested specific number of plans
      const requestedCount = extractRequestedPlanCount(userMessage);
      const maxPlans = requestedCount || Math.min(categoryPlans.length, 4); // Default to 4 or available plans

      // Score only plans from the correct category
      const scoredPlans = categoryPlans.map((plan) => ({
        plan,
        score: calculateRelevanceScore(userMessage, plan),
      }));

      const sortedPlans = scoredPlans
        .sort((a, b) => b.score - a.score)
        .slice(0, maxPlans)
        .map(item => item.plan);

      console.log(`✅ Found ${sortedPlans.length} ${detectedCategory} plans (requested: ${requestedCount || 'default'})`);
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
function calculateRelevanceScore(userMessage: string, plan: InsurancePlan): number {
  let score = 0;
  const message = userMessage.toLowerCase();
  const planText = `${plan.name} ${plan.description || ''} ${plan.benefits.join(' ')}`.toLowerCase();

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
  plan.benefits.forEach(feature => {
    if (message.includes(feature.toLowerCase())) {
      score += 1;
    }
  });

  return score;
}

/**
 * Filter plans by country (placeholder for country-specific filtering)
 */
function filterPlansByCountry(plans: InsurancePlan[], country: string): InsurancePlan[] {
  // For now, return all plans since we're focused on Colombia
  return plans.filter(p => p.country === country || p.country === 'WW'); // WW for worldwide
}

/**
 * Get top relevant plans with scoring
 */
function getTopRelevantPlans(userMessage: string, plans: InsurancePlan[], limit: number): InsurancePlan[] {
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
    const response = await generateAssistantResponse(message, []);
    return response.message || response.response || "No response generated";
  } catch (error) {
    console.error("Error in getChatCompletionFromOpenAI:", error);
    throw error;
  }
}

export async function generateInsuranceRecommendation(category: string, criteria: any): Promise<string> {
  try {
    const message = `I need ${category} insurance with these requirements: ${JSON.stringify(criteria)}`;
    const response = await generateAssistantResponse(message, []);
    return response.message || response.response || "No recommendation generated";
  } catch (error) {
    console.error("Error in generateInsuranceRecommendation:", error);
    throw error;
  }
}

export async function explainInsuranceTerm(term: string): Promise<string> {
  try {
    const message = `Please explain the insurance term: ${term}`;
    const response = await generateAssistantResponse(message, []);
    return response.message || response.response || "No explanation generated";
  } catch (error) {
    console.error("Error in explainInsuranceTerm:", error);
    throw error;
  }
}

export async function comparePlans(plans: any[]): Promise<string> {
  try {
    const message = `Please compare these insurance plans: ${JSON.stringify(plans)}`;
    const response = await generateAssistantResponse(message, [], {}, "Colombia");
    return response.message || "No comparison generated";
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

/**
 * Utility functions for plate detection and lookup
 */
const PLATE_REGEX = /[A-Z]{3}[-\s]?[0-9]{3}|[A-Z]{3}[-\s]?[0-9]{2}[A-Z]/i;

function extractPlate(message: string): string | null {
  const match = message.match(PLATE_REGEX);
  return match ? match[0].replace(/[-\s]/g, '').toUpperCase() : null;
}

async function lookupVehicleByPlate(plate: string): Promise<any> {
  const response = await fetch('http://localhost:5050/api/lookup-plate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plate }),
  });

  if (!response.ok) {
    throw new Error(`Vehicle lookup failed with status: ${response.status}`);
  }

  return response.json();
}