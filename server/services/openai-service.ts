/**
 * =================================================================
 * SERVICE: OPENAI ASSISTANT
 * =================================================================
 * This service now integrates with real insurance plan data fetched
 * directly from the Supabase database (`insurance_plans` table).
 *
 * IMPORTANT: All mock data sources have been deprecated.
 * The service exclusively uses plans from the PostgreSQL database.
 * 
 * To add or update plans, modify the records in the `insurance_plans` 
 * table in the database. The `scripts/seed-plans.ts` script can be 
 * used as a reference for populating this table.
 * =================================================================
 */
import OpenAI from "openai";
// DEPRECATED: Mock data loader is no longer used
// import {
//   MockInsurancePlan,
//   createEnrichedContext,
//   loadMockInsurancePlans,
// } from "../data-loader";
import { storage } from "../storage";
import { db } from "../db";
import { insurancePlans, InsuranceCategory } from "../../shared/schema";
import { analyzeContextNeeds, detectInsuranceCategory, ContextAnalysisResult, canShowPlans } from "../../shared/context-utils";
import fetch from 'node-fetch';
import { AssistantMemory } from "../../shared/types/assistant";
import { getLatestUserContext } from "./context-service";
import { filterPlans, FilterCriteria } from "../../client/src/lib/plan-filter";
import { extractFormalFeatures } from "../../shared/feature-synonyms";
import { extractPriceRange } from "../../shared/context-utils";

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
  features: string[];
  externalLink: string | null;
  isExternal: boolean;
}

// Initialize the OpenAI client with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

// Simple in-memory cache for OpenAI responses
interface CacheEntry {
  response: any;
  timestamp: number;
}

const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache key generator
function getCacheKey(message: string, category: string): string {
  return `${category}:${message.toLowerCase().trim()}`;
}

// Plan cache
interface PlanCache {
  plans: InsurancePlan[];
  timestamp: number;
}

let planCache: PlanCache | null = null;
const PLAN_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function getCachedPlans(): Promise<InsurancePlan[]> {
  // Check if cache is valid
  if (planCache && Date.now() - planCache.timestamp < PLAN_CACHE_TTL) {
    console.log('[Plan Cache] Using cached plans');
    return planCache.plans;
  }

  // Fetch from database
  console.log('[Plan Cache] Fetching fresh plans from database');
  const plans = await db.select({
    id: insurancePlans.id,
    name: insurancePlans.name,
    category: insurancePlans.category,
    provider: insurancePlans.provider,
    basePrice: insurancePlans.basePrice,
    coverageAmount: insurancePlans.coverageAmount,
    currency: insurancePlans.currency,
    country: insurancePlans.country,
    benefits: insurancePlans.benefits,
    externalLink: insurancePlans.externalLink,
    isExternal: insurancePlans.isExternal,
    createdAt: insurancePlans.createdAt,
    updatedAt: insurancePlans.updatedAt,
  }).from(insurancePlans).then(plans => 
    plans.map(p => ({
      ...p,
      features: (p as any).features || (p as any).benefits || [],
    }))
  ) as InsurancePlan[];

  // Update cache
  planCache = {
    plans,
    timestamp: Date.now()
  };

  return plans;
}

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
  missingInfo?: string[];
}

/**
 * FIXED: Enhanced generateAssistantResponse with real plan integration and memory preservation
 */
export async function generateAssistantResponse(
  userMessage: string,
  conversationHistory: AssistantMessage[] = [],
  memory: AssistantMemory = {},
  userCountry: string = "Colombia",
  userId?: string | null,
  resetContext: boolean = false,
): Promise<AssistantResponse> {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  let updatedMemory = { ...memory };

  // Extract and store price preferences
  const priceRange = extractPriceRange(userMessage);
  if (priceRange) {
    updatedMemory.preferences = {
      ...updatedMemory.preferences,
      priceRange: {
        min: priceRange[0],
        max: priceRange[1],
        currency: 'COP'
      }
    };
  }

  // Detect category first to decide on special actions
  const category = detectInsuranceCategory(userMessage);
  
  // DEBUG: Log the detected category
  console.log(`[DEBUG][${requestId}] Initial category detection for "${userMessage}":`, category);

  // --- PERSISTENT MEMORY REHYDRATION ---
  // If this is the start of a conversation, try to load the last known context.
  if (userId && !resetContext && (!conversationHistory || conversationHistory.length === 0)) {
    console.log(`[Memory Rehydration][${requestId}] New conversation started for user ${userId}. Checking for persistent context...`);
    const rehydratedMemory = await getLatestUserContext(userId, category);
    if (rehydratedMemory) {
      updatedMemory = { ...updatedMemory, ...rehydratedMemory };
      console.log(`[Memory Rehydration][${requestId}] Context successfully rehydrated for user ${userId}.`);
    }
  }

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
    // If auto insurance, check for license plate and lookup if needed
    if (category === 'auto') {
      const plate = extractPlate(userMessage);
      if (plate) {
        console.log(`[Vehicle Lookup][${requestId}] Plate detected: ${plate}. Fetching details...`);
        try {
          // Use the new, centralized vehicle lookup endpoint
          const response = await fetch(`http://localhost:5051/api/vehicle/lookup?plate=${plate}`);
          if (!response.ok) {
            throw new Error(`Vehicle lookup failed with status: ${response.status}`);
          }
          const vehicleData = await response.json();

          if (vehicleData) {
            // Always update vehicle memory with new data
            const previousVehicle = updatedMemory.vehicle;
            updatedMemory.vehicle = {
              plate: vehicleData.plate,
              make: vehicleData.brand,
              model: vehicleData.model,
              year: vehicleData.year,
              fuel: vehicleData.fuel,
            };
            
            if (previousVehicle && previousVehicle.plate !== vehicleData.plate) {
              console.log(`[Vehicle Lookup][${requestId}] Vehicle changed from ${previousVehicle.make} ${previousVehicle.model} to ${vehicleData.brand} ${vehicleData.model}`);
            }
            console.log(`[Vehicle Lookup][${requestId}] Success. Vehicle data injected into memory:`, updatedMemory.vehicle);
          }
        } catch (error: any) {
          console.warn(`[Vehicle Lookup][${requestId}] Failed: ${error.message}`);
          // Fallback: continue without vehicle data, context analysis will ask for it
        }
      }
    }

    // Get real plans from the database (with caching)
    let allPlans: InsurancePlan[] = [];
    try {
      allPlans = await getCachedPlans();
    } catch (error: any) {
      console.error(`[OpenAI][${requestId}] Error loading plans:`, error);
      allPlans = [];
    }
    console.log(`[OpenAI][${requestId}] Loaded ${allPlans.length} total plans from database`);

    // NO FALLBACK TO MOCK PLANS - Database is the single source of truth
    if (allPlans.length === 0) {
      console.log(`[OpenAI][${requestId}] No plans found in database for any category`);
      // Continue with empty plans array - the AI will inform the user
    }

    // Filter and get relevant plans
    const filteredPlans = filterPlansByCountry(allPlans, userCountry);
    console.log(`[OpenAI][${requestId}] After country filtering: ${filteredPlans.length} plans (country: ${userCountry})`);
    
    // Use the category that was already detected and passed to this function
    let relevantPlans: InsurancePlan[] = [];
    
    if (category && category !== 'general') {
      // At this point, TypeScript knows category is InsuranceCategory
      // Filter by category first, then get top relevant
      const categoryPlans = filteredPlans.filter(plan => {
        // Ensure type safety by checking both sides are valid InsuranceCategory values
        return plan.category === category;
      });
      console.log(`[DEBUG][${requestId}] Plans after category filter (${category}): ${categoryPlans.length} plans`);
      relevantPlans = getTopRelevantPlans(userMessage, categoryPlans, 6);
      console.log(`[OpenAI][${requestId}] Category '${category}' detected: ${categoryPlans.length} plans in category, selected ${relevantPlans.length} most relevant`);
    } else {
      // No clear category, get top relevant from all plans
      console.log(`[DEBUG][${requestId}] Category is general or undefined, searching all plans`);
      relevantPlans = getTopRelevantPlans(userMessage, filteredPlans, 6);
      console.log(`[OpenAI][${requestId}] No specific category detected, selected ${relevantPlans.length} most relevant from all plans`);
    }

    // Initial empty plans array
    let suggestedPlans: InsurancePlan[] = [];
    
    // Use a single context analysis to drive all decisions
    // Important: use the full conversation context, not just the current message
    const finalConversation = [...conversationHistory, { role: 'user', content: userMessage }]
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join(' ');
    
    // First check if we already have a category in memory or from earlier detection
    let finalContextCategory: InsuranceCategory | 'general' = (updatedMemory.lastDetectedCategory as InsuranceCategory | 'general') || category;
    
    console.log(`[DEBUG][${requestId}] Category resolution: memory=${updatedMemory.lastDetectedCategory}, initial=${category}, final=${finalContextCategory}`);
    
    // If no category in memory, detect from full conversation
    if (!finalContextCategory || finalContextCategory === 'general') {
      finalContextCategory = detectInsuranceCategory(finalConversation);
      console.log(`[DEBUG][${requestId}] Re-detected from full conversation: ${finalContextCategory}`);
      
      // If still general, try detecting from just the current message
      if (finalContextCategory === 'general') {
        finalContextCategory = detectInsuranceCategory(userMessage);
        console.log(`[DEBUG][${requestId}] Re-detected from current message: ${finalContextCategory}`);
      }
    }
    
    // Store the detected category in memory for consistency
    if (finalContextCategory !== 'general') {
      updatedMemory.lastDetectedCategory = finalContextCategory;
    }
    
    const finalContextAnalysis = analyzeContextNeeds(finalConversation, finalContextCategory, updatedMemory);
    
    // Debug log the context analysis result
    console.log('[DEBUG] Context analysis result:', {
      ...finalContextAnalysis,
      detectedCategory: finalContextCategory,
      memoryCategory: updatedMemory.lastDetectedCategory
    });
    
    // Check if this is a follow-up question
    const isFollowUp = isFollowUpQuestion(userMessage);
    
    // Determine if we should show plans based on context analysis
    if (!finalContextAnalysis.needsMoreContext && finalContextCategory !== 'general' && relevantPlans.length > 0) {
      if (isFollowUp) {
        // For follow-up questions, try to find which plan the user is referring to
        console.log(`🧠 [OpenAI][${requestId}] Follow-up question detected, searching for plan references...`);
        
        const matchingPlans = relevantPlans.filter(plan => 
          isReferringToPlan(userMessage, plan.name) || 
          isReferringToPlan(userMessage, plan.provider)
        );
        
        if (matchingPlans.length > 0) {
          suggestedPlans = matchingPlans;
          console.log(`[OpenAI][${requestId}] Found ${matchingPlans.length} matching plans for follow-up`);
        } else {
          // Only show plans on general follow-up if context is complete
          if (!finalContextAnalysis.needsMoreContext) {
            suggestedPlans = relevantPlans.slice(0, 3);
            console.log(`[OpenAI][${requestId}] General follow-up with complete context, showing top 3 relevant plans`);
          }
        }
      } else {
        // Not a follow-up, show relevant plans
        suggestedPlans = findRelevantPlans(userMessage, relevantPlans);
        console.log(`[OpenAI][${requestId}] Context complete for ${finalContextCategory}, showing ${suggestedPlans.length} relevant plans`);
      }
    }
    
    // Final safety check: Don't show plans if context is insufficient
    if (finalContextAnalysis.needsMoreContext) {
      console.log('[DEBUG] Final check: Context insufficient – clearing all suggestedPlans');
      suggestedPlans = [];
    }
    
    // CRITICAL FIX: Create system prompt with ACTUAL plans that will be shown
    const systemPrompt = createSystemPrompt(
      suggestedPlans,  // Pass actual suggested plans, not all relevant plans
      userMessage,
      conversationHistory,
      finalContextAnalysis,
      updatedMemory
    );
    
    // Check OpenAI availability
    if (!process.env.OPENAI_API_KEY) {
      console.warn(`[OpenAI][${requestId}] No API key configured, using fallback response`);
      return {
        message: "¡Hola! Soy Briki, tu asistente de seguros. Actualmente estoy en modo limitado. Por favor configura la API key de OpenAI.",
        response: "¡Hola! Soy Briki, tu asistente de seguros. Actualmente estoy en modo limitado. Por favor configura la API key de OpenAI.",
        suggestedPlans: [],
        category: finalContextCategory,
        memory: updatedMemory,
        needsMoreContext: finalContextAnalysis.needsMoreContext,
        suggestedQuestions: finalContextAnalysis.suggestedQuestions || [],
        missingInfo: finalContextAnalysis.missingInfo || [],
      };
    }
    
    // Prepare messages for OpenAI
    const messages: AssistantMessage[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];
    
    const startTime = Date.now();
    const cacheKey = getCacheKey(userMessage, finalContextCategory || 'general');
    
    // Call OpenAI
    const response = await callOpenAIWithRetry(messages, cacheKey);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const assistantMessage = response.choices[0].message.content || 
      "Lo siento, no pude generar una respuesta.";
      
    // Log success metrics
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
    
    // Handle misunderstood responses
    const isMisunderstood = (msg: string): boolean => {
      if (!msg.trim() || msg === "Lo siento, no pude generar una respuesta.") {
        return true;
      }
      const misunderstoodPhrases = [
        "no entiendo",
        "no sé cómo ayudarte",
        "puedes reformular",
        "no comprendo",
      ];
      const lowerMsg = msg.toLowerCase();
      return misunderstoodPhrases.some(phrase => lowerMsg.includes(phrase));
    };
    
    if (isMisunderstood(assistantMessage)) {
      console.log(`[Fallback][${requestId}] Assistant response was generic or empty. Triggering fallback.`);
      return {
        message: "Lo siento, no entendí eso. ¿Puedes reformular tu pregunta o darme más detalles?",
        response: "Lo siento, no entendí eso. ¿Puedes reformular tu pregunta o darme más detalles?",
        suggestedPlans: undefined,
        category: 'general',
        memory: updatedMemory,
        needsMoreContext: true,
        suggestedQuestions: [
            "¿Qué cubre un seguro de auto?",
            "Cotízame un seguro de viaje para dos semanas",
            "Compara los planes de salud",
        ],
      };
    }
    
    // Handle pending questions if context is missing
    if (finalContextAnalysis.needsMoreContext && Array.isArray(finalContextAnalysis.suggestedQuestions) && finalContextAnalysis.suggestedQuestions.length > 0) {
      console.log(`[Context][${requestId}] Missing context, providing suggested questions`);
    }
    
    // Debug log the structure of suggested plans
    console.log(`[OpenAI][${requestId}] Suggested plans structure:`, 
      suggestedPlans.map(p => ({
        id: p.id,
        name: p.name,
        provider: p.provider,
        hasFeatures: !!p.features,
        featureCount: p.features?.length || 0,
        hasExternalLink: !!p.externalLink,
        externalLink: p.externalLink,
        isExternal: p.isExternal
      }))
    );
    
    // CRITICAL DEBUG: Log the exact response being sent
    const finalApiResponse = {
      message: assistantMessage,
      response: assistantMessage, // Provide both for compatibility
      suggestedPlans,
      category: finalContextCategory,
      memory: updatedMemory,
      needsMoreContext: finalContextAnalysis.needsMoreContext,
      suggestedQuestions: finalContextAnalysis.suggestedQuestions || [],
      missingInfo: finalContextAnalysis.missingInfo || [],
    };
    
    console.log(`[OpenAI][${requestId}] FINAL RESPONSE TO FRONTEND:`, JSON.stringify(finalApiResponse, null, 2));
    
    return finalApiResponse;
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
    // Additional raw error logging for easier debugging
    console.error('OpenAI error:', error);

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
 * OpenAI API call with automatic retry mechanism and caching
 */
async function callOpenAIWithRetry(messages: any[], cacheKey?: string, retries = 3): Promise<any> {
  // Check cache first
  if (cacheKey) {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`[Cache] Hit for key: ${cacheKey}`);
      return cached.response;
    }
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 800,
      });

      // Cache the response
      if (cacheKey) {
        responseCache.set(cacheKey, {
          response,
          timestamp: Date.now()
        });
        console.log(`[Cache] Stored response for key: ${cacheKey}`);
      }

      return response;
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
  // Look for the most recent assistant message that mentions plans
  for (let i = history.length - 1; i >= 0; i--) {
    const message = history[i];
    if (message.role === 'assistant' && message.content.includes('[Planes previamente recomendados:')) {
      const planMatch = message.content.match(/\[Planes previamente recomendados: ([^\]]+)\]/);
      if (planMatch) {
        // For now, we'll return an empty array since we can't reconstruct full plan objects from strings
        // The frontend should be modified to send actual plan data
        console.log('[Follow-up] Found plan reference in history but cannot reconstruct full objects');
        return [];
      }
    }
  }
  return [];
}

/**
 * Parse plan information from formatted string and return plan objects
 * Note: This is a placeholder - the frontend should send actual plan data
 */
function parsePlansFromString(planString: string): InsurancePlan[] {
  console.warn('[Follow-up] parsePlansFromString called but cannot reconstruct plan objects from string:', planString);
  return [];
}

/**
 * Check if user is referring to previously shown plans
 */
function isReferringToPlan(message: string, planName: string): boolean {
  const lowerMessage = message.toLowerCase();
  const lowerPlanName = planName.toLowerCase();
  
  // Direct name match
  if (lowerMessage.includes(lowerPlanName)) return true;
  
  // Provider match (e.g., "el de HDI", "el plan de SURA")
  const providerMatch = planName.match(/\b(SURA|HDI|MAPFRE|Bolívar|Qualitas|Colasistencia|Heymondo|IATI|Assist Card|Pax)\b/i);
  if (providerMatch && lowerMessage.includes(providerMatch[0].toLowerCase())) return true;
  
  // Index references (e.g., "el primero", "el segundo")
  const indexRefs = ['primero', 'segundo', 'tercero', 'cuarto', 'último'];
  return indexRefs.some(ref => lowerMessage.includes(ref));
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
  const isFollowUp = isFollowUpQuestion(userMessage);

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
🧠 MODO SEGUIMIENTO: El usuario está preguntando sobre planes mostrados o quiere más información.
- Si pregunta por un plan específico (por nombre, proveedor o posición), enfócate en ese plan
- Si es una pregunta general, ayuda a comparar las opciones mostradas
- Mantén la conversación fluida y natural
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

## INFORMACIÓN REQUERIDA POR CATEGORÍA:
- PET: Tipo de mascota, edad ESPECÍFICA (ej: "2 años", no "joven"), raza, peso, ubicación
- AUTO: Marca, año/modelo, ubicación/país (ej: "Colombia", "Bogotá")
- TRAVEL: Destino, fechas O duración, número de viajeros, propósito (turismo/negocio)
- HEALTH: Edad específica, género, país de residencia
- SOAT: Tipo de vehículo, ciudad de registro

## FORMATO DE COMPARACIONES:
Cuando compares planes, usa este formato estructurado:

**Comparando [Plan A] vs [Plan B]:**

**[Nombre del Plan A]:**
✅ Ventajas:
• [ventaja 1]
• [ventaja 2]
❌ Limitaciones:
• [limitación 1]
Ideal para: [tipo de usuario]

**[Nombre del Plan B]:**
✅ Ventajas:
• [ventaja 1]
• [ventaja 2]
❌ Limitaciones:
• [limitación 1]
Ideal para: [tipo de usuario]

**Recomendación:** [Tu sugerencia basada en el contexto del usuario]

## DESPUÉS DE MOSTRAR PLANES:
- Pregunta si necesita más información sobre algún plan específico
- Ofrece comparar características entre planes
- Invita a aclarar dudas sobre coberturas o precios
- Mantén un tono consultivo y servicial

## ESTILO DE RESPUESTA:
- Conversacional y amigable
- Usa listas con viñetas para mejor legibilidad
- Estructura la información en secciones claras
- Evita párrafos largos y densos
- Haz preguntas relevantes para entender mejor las necesidades
- SIEMPRE termina invitando a continuar la conversación
${relevantPlans.length > 0 ? `
- CUANDO MUESTRES PLANES: Menciona brevemente que verán las opciones como tarjetas visuales
` : ''}

## CRÍTICO - MANEJO DE PLANES:
${relevantPlans.length > 0 ? `
- Hay ${relevantPlans.length} planes disponibles que aparecerán como tarjetas interactivas
- SOLO di "He encontrado algunas opciones que aparecerán abajo" o similar
- NO listes los nombres de los planes, precios, o características
- Las tarjetas muestran toda la información - tu texto debe ser breve
- Enfócate en invitar al usuario a revisar las tarjetas y hacer preguntas
` : `
- NO HAY PLANES DISPONIBLES en la base de datos para esta consulta
- NO digas "He encontrado planes" o frases similares
- En su lugar, di algo como:
  * "Actualmente no tenemos planes disponibles para esta categoría, pero puedo ayudarte con información general sobre seguros de ${contextAnalysis.category}."
  * "Estamos trabajando para agregar más opciones. ¿Te gustaría conocer qué buscar en un seguro de ${contextAnalysis.category}?"
  * "No encontré planes específicos, pero puedo explicarte las coberturas típicas de seguros de ${contextAnalysis.category}."
- Ofrece ayuda con información general sobre seguros
- Sugiere otras categorías que podrían tener planes disponibles
- Mantén un tono positivo y servicial
`}

${relevantPlans.length > 0 ? `
## PLANES DISPONIBLES PARA REFERENCIA (NO INCLUIR EN RESPUESTA):
${relevantPlans.map(plan => `
- ${plan.name} (${plan.provider}) - ${plan.category}
`).join('\n')}
` : ''}

Responde de manera útil y mantén la conversación activa. ${relevantPlans.length > 0 ? 'Si muestras planes, SIEMPRE pregunta si el usuario quiere saber más detalles, comparar opciones, o tiene otras dudas.' : 'Ayuda al usuario con información general y sugiere alternativas.'}`;
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
    // Add car brands for better auto detection
    "mazda", "toyota", "chevrolet", "nissan", "honda", "ford", "hyundai", "kia", "volkswagen", "renault",
    "bmw", "mercedes", "audi", "peugeot", "fiat", "jeep", "subaru", "mitsubishi", "suzuki", "lexus"
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
    lowerMessage.includes(keyword),
  );
  const hasCategoryKeyword = categoryKeywords.some((keyword) =>
    lowerMessage.includes(keyword),
  );
  const hasActionKeyword = actionKeywords.some((keyword) =>
    lowerMessage.includes(keyword),
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

      // Extract price range if specified
      const priceRange = extractPriceRange(userMessage);
      console.log(`💰 Price range detected:`, priceRange);

      // Extract provider preferences and required features
      const filterCriteria: FilterCriteria = {
        maxResults: maxPlans,
        relevanceThreshold: 0.3,
        userPreferences: {
          preferredProviders: extractPreferredProviders(userMessage),
          mustHaveFeatures: extractRequiredFeatures(userMessage),
          priceRange: priceRange ? {
            min: priceRange[0],
            max: priceRange[1],
            currency: 'COP'
          } : undefined
        }
      };

      return filterPlans(categoryPlans, filterCriteria);
    } else {
      console.log(`❌ No plans found for category: ${detectedCategory}`);
      return [];
    }
  }

  // STEP 3: If no clear category is detected, fall back to general relevance scoring
  console.log(`❓ No clear category detected, scoring all available plans based on message content.`);
  
  const priceRange = extractPriceRange(userMessage);
  const filterCriteria: FilterCriteria = {
    maxResults: 4,
    relevanceThreshold: 0.3,
    userPreferences: priceRange ? {
      priceRange: {
        min: priceRange[0],
        max: priceRange[1],
        currency: 'COP'
      }
    } : undefined
  };
  
  return filterPlans(plans, filterCriteria);
}

/**
 * Extract preferred providers from user message
 */
function extractPreferredProviders(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const providers = ['SURA', 'MAPFRE', 'HDI', 'Bolívar', 'Qualitas', 'Colasistencia'];
  
  return providers.filter(provider => 
    lowerMessage.includes(provider.toLowerCase())
  );
}

/**
 * Extract required features from user message
 */
function extractRequiredFeatures(message: string): string[] {
  // Use the new feature extraction logic
  return extractFormalFeatures(message);
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
 * Normalise country names/codes to a common two-letter code.
 * Extend this map as new regions are added.
 */
function normaliseCountry(c: string | null | undefined): string {
  if (!c) return '';
  return c.trim().toUpperCase()
    .replace('COLOMBIA', 'CO')
    .replace('MEXICO', 'MX')
    .replace('WORLDWIDE', 'WW');
}

/**
 * Filter plans by country (placeholder for country-specific filtering)
 */
function filterPlansByCountry(plans: InsurancePlan[], country: string): InsurancePlan[] {
  const norm = normaliseCountry(country);
  const filteredPlans = plans.filter(p => {
    const planCountry = normaliseCountry(p.country as any);
    return !planCountry || planCountry === norm || planCountry === 'WW';
  });

  // Debug helper to confirm filtering behaviour
  console.log('[DEBUG] Plans after country filter:', filteredPlans.length);
  if (filteredPlans.length === 0) {
    console.log('[DEBUG] Raw plan country codes:', Array.from(new Set(plans.map(p => p.country))));
    console.log('[DEBUG] Normalised user country:', norm);
  }

  return filteredPlans;
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

// This function is now deprecated and will be removed.
// The logic has been moved to the /api/vehicle/lookup endpoint.
/*
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
*/