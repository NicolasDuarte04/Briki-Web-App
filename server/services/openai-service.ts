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
import { storage } from "../storage";
import { db } from "../db";
import { insurancePlans, InsuranceCategory } from "../../shared/schema";
import { 
  analyzeContextNeeds, 
  detectInsuranceCategory, 
  ContextAnalysisResult, 
  canShowPlans,
  extractPriceRange
} from "../../shared/context-utils";
import fetch from 'node-fetch';
import { AssistantMemory } from "../../shared/types/assistant";
import { getLatestUserContext } from "./context-service";
import { filterPlans, FilterCriteria } from "../../client/src/lib/plan-filter";


const SYSTEM_PROMPT_INTRO = `Eres Briki, un asistente especializado en seguros que ayuda a usuarios en Colombia a encontrar el mejor seguro.`;

const PDF_INSTRUCTIONS = `
## CAPACIDADES DE DOCUMENTOS PDF:
- Puedo leer y analizar archivos PDF de seguros
- Si un usuario pregunta sobre subir o leer PDFs, debo responder:
"¡Sí! Puedes subir tu archivo PDF usando el botón 'Subir documento' que aparece junto al chat. Lo analizaré y te daré un resumen detallado."
- NUNCA debo decir que no puedo leer PDFs
- Si el usuario menciona un documento o clausulado, debo invitarle a subirlo
- Después de analizar un PDF, debo ofrecer explicar cualquier término o cobertura que no esté clara`;

const PDF_COMPARISON_INSTRUCTIONS = `
## COMPARACIÓN DE DOCUMENTOS:
- Cuando el usuario haya subido un documento PDF y pregunte sobre comparaciones:
  - Compara la póliza del documento con los planes disponibles en Briki
  - Destaca las diferencias en coberturas, exclusiones y deducibles
  - Sugiere planes que podrían mejorar su cobertura actual
  - Usa el formato de comparación lado a lado cuando sea relevante
- Si detectas información de una póliza en la memoria, úsala para hacer comparaciones proactivas`;

const MEMORY_INSTRUCTIONS = `
## INSTRUCCIONES DE MEMORIA Y CONTINUIDAD:
- MANTÉN el contexto de toda la conversación anterior
- Si ya mostraste planes, recuerda cuáles fueron y sigue ayudando
- Responde preguntas de seguimiento sobre los planes ya recomendados
- Invita activamente a comparar opciones y hacer más preguntas
- NO resetees la conversación después de dar recomendaciones`;

const CATEGORY_REQUIREMENTS = `
## INFORMACIÓN REQUERIDA POR CATEGORÍA:
- PET: Tipo de mascota, edad ESPECÍFICA (ej: "2 años", no "joven"), raza, peso, ubicación
- AUTO: Marca, año/modelo, ubicación/país (ej: "Colombia", "Bogotá")
- TRAVEL: Destino, fechas O duración, número de viajeros, propósito (turismo/negocio)
- HEALTH: Edad específica, género, país de residencia
- SOAT: Tipo de vehículo, ciudad de registro`;

const COMPARISON_FORMAT = `
## FORMATO DE COMPARACIONES:
Cuando el usuario pida comparar planes específicos:
- NO generes comparaciones de texto largas
- En su lugar, responde: "Para comparar planes de manera visual, selecciona las casillas en las esquinas de las tarjetas de los planes que quieres comparar. Luego haz clic en el botón 'Comparar planes' que aparecerá."
- Si el usuario insiste en una comparación textual, proporciona solo un resumen muy breve (2-3 líneas máximo) y sugiere usar la herramienta visual
- Ejemplo de respuesta: "He notado que quieres comparar planes. Para una mejor experiencia, usa nuestra herramienta de comparación visual: selecciona los planes que te interesan marcando las casillas en cada tarjeta."`;

const POST_RECOMMENDATION_GUIDE = `
## DESPUÉS DE MOSTRAR PLANES:
- Pregunta si necesita más información sobre algún plan específico
- Si el usuario quiere comparar, guíalo a usar la herramienta visual: "Puedes comparar planes seleccionando las casillas en cada tarjeta"
- Invita a aclarar dudas sobre coberturas o precios
- Mantén un tono consultivo y servicial`;

const RESPONSE_STYLE_GUIDE = `
## ESTILO DE RESPUESTA:
- Conversacional y amigable
- Usa listas con viñetas para mejor legibilidad
- Estructura la información en secciones claras
- Evita párrafos largos y densos
- Haz preguntas relevantes para entender mejor las necesidades
- SIEMPRE termina invitando a continuar la conversación`;

const FINAL_INSTRUCTIONS = `Responde de manera útil y mantén la conversación activa.`;


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

/**
 * Returns a simple fallback list: cheapest `limit` plans in the given category.
 * If price info is missing, keeps original order.
 */
function getFallbackPlans(plans: InsurancePlan[], limit: number = 5): InsurancePlan[] {
  if (!plans || plans.length === 0) return [];
  const sorted = [...plans].sort((a, b) => {
    const priceA = typeof a.basePrice === 'number' ? a.basePrice : Number.MAX_SAFE_INTEGER;
    const priceB = typeof b.basePrice === 'number' ? b.basePrice : Number.MAX_SAFE_INTEGER;
    return priceA - priceB;
  });
  return sorted.slice(0, limit);
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
  
  try {
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

    console.log(`[Plan Cache] Successfully loaded ${plans.length} plans from database`);
    
    // Update cache
    planCache = {
      plans,
      timestamp: Date.now()
    };

    return plans;
  } catch (error: any) {
    console.error('[Plan Cache] Database query failed:', error.message);
    console.error('[Plan Cache] Full error:', error);
    
    // Check if it's a connection error
    if (error.message?.includes('Database not initialized')) {
      console.error('[Plan Cache] Database connection not initialized. This may be due to Supabase/PostgreSQL configuration conflict.');
    }
    
    // Return empty array instead of throwing to prevent "Load failed" error
    console.warn('[Plan Cache] Returning empty plans array due to database error');
    return [];
  }
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
  fallbackLabel?: string; // optional soft label for UI when fallback is used
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
  stream: boolean = false, // Add stream parameter
): Promise<any> { // Return type will be either AssistantResponse or a stream
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
              console.log(`[Vehicle Lookup][${requestId}] Vehicle changed from ${previousVehicle.make} ${previousVehicle.model} to ${updatedMemory.vehicle.make} ${updatedMemory.vehicle.model}`);
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
      // DEBUG: Verify plan filtering pipeline and output sample of results
      console.log("DEBUG PLANS:", {
        category,
        totalPlans: filteredPlans.length,
        filteredPlans: relevantPlans.length,
        filteredSample: relevantPlans.slice(0, 2)
      });
    }

    // Initial empty plans array
    let suggestedPlans: InsurancePlan[] = [];
    let fallbackLabel: string | undefined;
    let usedFallback = false;
    
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
    
    // CATEGORY LOCK IMPLEMENTATION: Check if user is explicitly changing category
    const isExplicitCategoryChange = checkExplicitCategoryChange(userMessage, finalContextCategory);
    
    if (isExplicitCategoryChange.changed && updatedMemory.lastDetectedCategory) {
      console.log(`[DEBUG][${requestId}] Explicit category change detected: ${updatedMemory.lastDetectedCategory} -> ${isExplicitCategoryChange.newCategory}`);
      finalContextCategory = isExplicitCategoryChange.newCategory;
      // Clear previous context when switching categories
      updatedMemory.preferences = {};
      updatedMemory.vehicle = undefined;
    } else if (updatedMemory.lastDetectedCategory && updatedMemory.lastDetectedCategory !== 'general') {
      // Lock to previous category unless explicitly changed
      finalContextCategory = updatedMemory.lastDetectedCategory as InsuranceCategory;
      console.log(`[DEBUG][${requestId}] Category locked to: ${finalContextCategory}`);
    }
    
    // Store the detected category in memory for consistency
    if (finalContextCategory !== 'general') {
      updatedMemory.lastDetectedCategory = finalContextCategory;
    }
    
    const finalContextAnalysis = analyzeContextNeeds(finalConversation, finalContextCategory, updatedMemory);
    
    if (stream && finalContextAnalysis.needsMoreContext && finalContextCategory !== 'general') {
      async function* contextStream() {
        yield `data: ${JSON.stringify({
          type: 'context_request',
          payload: {
            category: finalContextCategory,
            missingInfo: finalContextAnalysis.missingInfo,
            initialData: updatedMemory.preferences || {},
          }
        })}\n\n`;
      }
      return contextStream();
    }

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
        suggestedPlans = findRelevantPlans(userMessage, relevantPlans, finalContextCategory);
        console.log(`[OpenAI][${requestId}] Context complete for ${finalContextCategory}, showing ${suggestedPlans.length} relevant plans`);
      }
    }
    
    // If no relevant plans were found, attempt fallback logic
    if (relevantPlans.length === 0) {
      const categoryPlans = filteredPlans.filter(p => p.category === finalContextCategory);
      if (categoryPlans.length > 0) {
        suggestedPlans = getFallbackPlans(categoryPlans, 5);
        if (suggestedPlans.length > 0) {
          usedFallback = true;
          fallbackLabel = finalContextCategory !== 'general' ? `Sugerencias generales para ${finalContextCategory}` : 'Planes recomendados por Briki';
          // Relax context block when we're falling back but we have category + country
          if (finalContextCategory !== 'general') {
            finalContextAnalysis.needsMoreContext = false;
          }
          console.log(`[Fallback Plans] Showing ${suggestedPlans.length} fallback plans for ${finalContextCategory}`);
        }
      }
    }

    // Final safety check: Don't show plans if context is insufficient (unless fallback already applied)
    if (finalContextAnalysis.needsMoreContext && !usedFallback) {
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
        category: 'general',
        memory: updatedMemory,
        needsMoreContext: false,
        suggestedQuestions: []
      };
    }

    if (stream) {
      return callOpenAIWithRetry([
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ], undefined, 3, true);
    }
    
    // Call OpenAI API
    const cacheKey = getCacheKey(userMessage, finalContextCategory);
    const openAIResponse = await callOpenAIWithRetry(
      [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage },
      ],
      cacheKey,
      3,
      stream
    );

    const messageContent =
      openAIResponse.choices[0]?.message?.content ||
      "Lo siento, no pude generar una respuesta. Por favor, intenta de nuevo.";
      
    // GPT-4 Turbo can sometimes return JSON for plan recommendations
    // Let's add a robust check here
    let parsedContent = { message: messageContent, suggestedPlans: [] };
    if (messageContent.startsWith('{') && messageContent.endsWith('}')) {
      try {
        const potentialJson = JSON.parse(messageContent);
        if (potentialJson.message && potentialJson.plans) {
          parsedContent.message = potentialJson.message;
          // You might need to validate the plan structure here
          // parsedContent.suggestedPlans = potentialJson.plans;
        }
      } catch (e) {
        // Not a valid JSON, so we just use the raw string
      }
    }
    
    // Final response object
    const finalResponse: AssistantResponse = {
      message: parsedContent.message,
      suggestedPlans,
      category: finalContextCategory,
      memory: updatedMemory,
      needsMoreContext: finalContextAnalysis.needsMoreContext,
      suggestedQuestions: finalContextAnalysis.suggestedQuestions,
      fallbackLabel: usedFallback ? fallbackLabel : undefined,
    };

    return finalResponse;

  } catch (error: any) {
    console.error(`[OpenAI][${requestId}] Critical error:`, error);

    // Fallback response in case of any unhandled errors
    const isMisunderstood = (msg: string): boolean => {
      const lower = msg.toLowerCase();
      return (
        lower.includes("no entiendo") ||
        lower.includes("no puedo ayudarte") ||
        lower.includes("i cannot assist") ||
        lower.includes("i don't understand")
      );
    };

    if (error.message && isMisunderstood(error.message)) {
      return {
        message: "Parece que no entendí bien tu pregunta. ¿Podrías reformularla?",
        suggestedPlans: [],
        category: 'general',
        memory: updatedMemory,
      };
    }
    
    // More specific error handling
    if (error.code === 'context_length_exceeded') {
      throw new Error("La conversación es demasiado larga para continuar. Por favor, reinicia la conversación.");
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
async function callOpenAIWithRetry(messages: any[], cacheKey?: string, retries = 3, stream = false): Promise<any> {
  // Check cache first
  if (cacheKey && !stream) {
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
        stream: stream,
      });

      // Cache the response only if not streaming
      if (cacheKey && !stream) {
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

  // Add document context if available
  const documentContext = memory.recentDocument || memory.lastUploadedDocument
    ? `
## DOCUMENTO PDF CARGADO RECIENTEMENTE:
${(() => {
      const doc = memory.recentDocument || memory.lastUploadedDocument;
      if (!doc) return '';
      return `
- Archivo: ${doc.fileName || 'PDF cargado'}
- ID del resumen: ${doc.summaryId || 'No disponible'}
${doc.summary ? `

### RESUMEN DEL DOCUMENTO:
${doc.summary}

IMPORTANTE: El usuario ha subido este documento y puede estar preguntando sobre él. Usa esta información para:
1. Responder preguntas específicas sobre el contenido del documento
2. Comparar esta póliza con los planes disponibles en Briki
3. Identificar mejoras o alternativas disponibles
4. Explicar términos o coberturas mencionadas en el documento
` : ''}`;
    })()}
`
    : '';
    
  let prompt = [
    SYSTEM_PROMPT_INTRO,
    `IMPORTANTE: NUNCA termines la conversación después de mostrar planes. SIEMPRE invita al usuario a hacer más preguntas.`
  ];

  if (vehicleContext) prompt.push(vehicleContext);
  if (documentContext) prompt.push(documentContext);

  prompt.push(PDF_INSTRUCTIONS);
  if (documentContext) {
    prompt.push(`- El usuario YA ha subido un documento, usa la información del resumen para responder sus preguntas`);
  }
  prompt.push(PDF_COMPARISON_INSTRUCTIONS);
  prompt.push(MEMORY_INSTRUCTIONS);
  
  // Conversational flow
  prompt.push('## FLUJO CONVERSACIONAL:');
  if (isFollowUp) {
    prompt.push(`
🧠 MODO SEGUIMIENTO: El usuario está preguntando sobre planes mostrados o quiere más información.
- Si pregunta por un plan específico (por nombre, proveedor o posición), enfócate en ese plan
- Si es una pregunta general, ayuda a comparar las opciones mostradas
- Mantén la conversación fluida y natural`);
  } else {
    if (contextAnalysis.needsMoreContext) {
      prompt.push(`
🤔 MODO RECOLECCIÓN: Necesitas más información antes de mostrar planes.
- Categoría detectada: ${contextAnalysis.category}
- Información faltante: ${contextAnalysis.missingInfo.join(', ')}
- Haz preguntas específicas antes de recomendar planes`);
    } else {
      prompt.push(`
✅ MODO RECOMENDACIÓN: Tienes suficiente contexto para mostrar planes.
- Recomienda planes específicos para la categoría detectada
- Después de mostrar planes, invita a preguntas de seguimiento`);
    }
  }

  prompt.push(CATEGORY_REQUIREMENTS);
  prompt.push(COMPARISON_FORMAT);
  prompt.push(POST_RECOMMENDATION_GUIDE);
  prompt.push(RESPONSE_STYLE_GUIDE);

  if (relevantPlans.length > 0) {
    prompt.push(`- CUANDO MUESTRES PLANES: Menciona brevemente que verán las opciones como tarjetas visuales`);
  }
  
  // Critical plan handling
  prompt.push('## CRÍTICO - MANEJO DE PLANES:');
  if (relevantPlans.length > 0) {
    prompt.push(`
- Hay ${relevantPlans.length} planes disponibles que aparecerán como tarjetas interactivas
- SOLO di "He encontrado algunas opciones que aparecerán abajo" o similar
- NO listes los nombres de los planes, precios, o características
- Las tarjetas muestran toda la información - tu texto debe ser breve
- Enfócate en invitar al usuario a revisar las tarjetas y hacer preguntas`);
  } else {
    prompt.push(`
- NO HAY PLANES DISPONIBLES en la base de datos para esta consulta
- NO digas "He encontrado planes" o frases similares`);
    
    const preferredProviders = extractPreferredProviders(userMessage);
    if (preferredProviders.length > 0 && contextAnalysis.category !== 'general') {
      prompt.push(`
- El usuario pidió planes de ${preferredProviders.join(', ')} para ${contextAnalysis.category}
- Explica claramente: "Actualmente no tenemos planes de ${contextAnalysis.category} de ${preferredProviders.join(' o ')}"
- Si sabes que ese proveedor ofrece otros tipos de seguros, menciona: "¿Te gustaría ver los planes de [otra categoría] de ${preferredProviders[0]}?"
- NO muestres planes de otra categoría sin preguntar primero`);
    } else {
      prompt.push(`
- En su lugar, di algo como:
  * "Actualmente no tenemos planes disponibles para esta categoría, pero puedo ayudarte con información general sobre seguros de ${contextAnalysis.category}."
  * "Estamos trabajando para agregar más opciones. ¿Te gustaría conocer qué buscar en un seguro de ${contextAnalysis.category}?"
  * "No encontré planes específicos, pero puedo explicarte las coberturas típicas de seguros de ${contextAnalysis.category}."`);
    }
    prompt.push(`- Ofrece ayuda con información general sobre seguros
- Sugiere otras categorías que podrían tener planes disponibles
- Mantén un tono positivo y servicial`);
  }

  if (relevantPlans.length > 0) {
    prompt.push(`
## PLANES DISPONIBLES PARA REFERENCIA (NO INCLUIR EN RESPUESTA):
${relevantPlans.map(plan => `- ${plan.name} (${plan.provider}) - ${plan.category}`).join('\n')}`);
  }

  prompt.push(FINAL_INSTRUCTIONS);
  if (relevantPlans.length > 0) {
    prompt.push('Si muestras planes, SIEMPRE pregunta si el usuario quiere saber más detalles, comparar opciones, o tiene otras dudas.');
  } else {
    prompt.push('Ayuda al usuario con información general y sugiere alternativas.');
  }
  
  return prompt.join('\n');
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
  currentCategory?: InsuranceCategory | 'general' | null,
): InsurancePlan[] {
  if (!plans.length) return [];

  // STEP 1: Detect user intent and required category
  const detectedCategory = detectInsuranceCategory(userMessage);
  
  // Use current category if available and no new category is detected
  const targetCategory = (detectedCategory && detectedCategory !== 'general') 
    ? detectedCategory 
    : currentCategory;

  console.log(`🎯 Category detection:`, {
    detected: detectedCategory,
    current: currentCategory,
    target: targetCategory,
    message: userMessage
  });

  // STEP 2: If category is clearly established, ONLY return plans from that category
  if (targetCategory && targetCategory !== 'general') {
    const categoryPlans = plans.filter(plan => plan.category === targetCategory);

    // Check if user is asking for a specific provider
    const preferredProviders = extractPreferredProviders(userMessage);
    
    if (preferredProviders.length > 0) {
      // Check if preferred provider has plans in current category
      const providerPlans = categoryPlans.filter(plan => 
        preferredProviders.some(provider => 
          plan.provider.toLowerCase().includes(provider.toLowerCase())
        )
      );
      
      if (providerPlans.length === 0) {
        // No plans from preferred provider in current category
        console.log(`❌ No ${targetCategory} plans found for providers: ${preferredProviders.join(', ')}`);
        
        // Check if provider has plans in other categories
        const otherCategoryPlans = plans.filter(plan => 
          plan.category !== targetCategory &&
          preferredProviders.some(provider => 
            plan.provider.toLowerCase().includes(provider.toLowerCase())
          )
        );
        
        if (otherCategoryPlans.length > 0) {
          const otherCategories = [...new Set(otherCategoryPlans.map(p => p.category))];
          console.log(`ℹ️ Provider has plans in other categories: ${otherCategories.join(', ')}`);
        }
        
        // Return empty array - let the assistant handle the explanation
        return [];
      }
      
      // Provider has plans in current category
      return providerPlans;
    }

    if (categoryPlans.length > 0) {
      // Check if user requested specific number of plans
      const requestedCount = extractRequestedPlanCount(userMessage);
      const maxPlans = requestedCount || Math.min(categoryPlans.length, 4);

      // Extract price range if specified
      const priceRange = extractPriceRange(userMessage);
      console.log(`💰 Price range detected:`, priceRange);

      // Extract required features
      const filterCriteria: FilterCriteria = {
        maxResults: maxPlans,
        relevanceThreshold: 0.3,
        userPreferences: {
          preferredProviders: extractPreferredProviders(userMessage),
          mustHaveFeatures: [], // This was extractRequiredFeatures(userMessage) which was calling extractFormalFeatures
          priceRange: priceRange ? {
            min: priceRange[0],
            max: priceRange[1],
            currency: 'COP'
          } : undefined
        }
      };

      return filterPlans(categoryPlans, filterCriteria);
    } else {
      console.log(`❌ No plans found for category: ${targetCategory}`);
      return [];
    }
  }

  // STEP 3: If no clear category is detected, return empty array
  console.log(`❓ No clear category context, returning empty array to prevent confusion`);
  return [];
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
  // This function previously called extractFormalFeatures, which is no longer available.
  // Returning an empty array to maintain compatibility without breaking the logic.
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
    console.error("Error comparing plans:", error);
    throw new Error("Failed to compare plans");
  }
}

export async function analyzeImageForInsurance(imageData: string, prompt?: string): Promise<any> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      message: "El análisis de imágenes está deshabilitado."
    };
  }
  
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt || "Analyze this image for insurance purposes." },
          {
            type: "image_url",
            image_url: {
              "url": `data:image/jpeg;base64,${imageData}`
            }
          },
        ],
      },
    ],
    max_tokens: 300
  });

  return {
    message: response.choices[0]?.message?.content
  };
}

function extractPlate(message: string): string | null {
  const plateRegex = /([A-Z]{3}\s?\d{3}|[A-Z]{3}\s?\d{2}[A-Z])/i;
  const match = message.match(plateRegex);
  return match ? match[0].replace(/\s/g, '') : null;
}

function checkExplicitCategoryChange(message: string, currentCategory: InsuranceCategory | 'general'): { changed: boolean; newCategory: InsuranceCategory | 'general' } {
  const newCategory = detectInsuranceCategory(message);
  if (newCategory !== 'general' && newCategory !== currentCategory) {
    return { changed: true, newCategory };
  }
  return { changed: false, newCategory: currentCategory };
}