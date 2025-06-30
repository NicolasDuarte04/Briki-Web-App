/**
 * =================================================================
 * ASISTENTE DE SEGUROS BRIKI - UTILIDADES DE CONTEXTO COMPARTIDAS
 * =================================================================
 * Este archivo centraliza la lógica para detectar la categoría de seguro
 * y determinar si se ha proporcionado suficiente contexto para dar
 * recomendaciones de planes.
 *
 * DOCUMENTACIÓN DEL FLUJO DEL ASISTENTE:
 * -----------------------------------------------------------------
 * 1. ENTRADA DEL USUARIO:
 *    - El usuario escribe un mensaje en `NewBrikiAssistant.tsx`.
 *    - El frontend llama a `detectInsuranceCategory` y `hasSufficientContext`
 *      para una evaluación preliminar y una UI receptiva.
 *
 * 2. LLAMADA AL BACKEND:
 *    - El mensaje se envía a `/api/ai/chat` (`server/routes/ai.ts`).
 *
 * 3. ANÁLISIS DE CONTEXTO EN EL BACKEND:
 *    - El backend (`openai-service.ts`) vuelve a utilizar estas mismas
 *      funciones (`detectInsuranceCategory`, `analyzeContextNeeds`) para
 *      un análisis definitivo.
 *
 * 4. RECOLECCIÓN DE INFORMACIÓN O RECOMENDACIÓN:
 *    - Si falta contexto, el backend devuelve `needsMoreContext: true`
 *      y `suggestedQuestions`. El frontend muestra estas preguntas.
 *    - Si el contexto es suficiente, el backend busca planes relevantes
 *      y los devuelve en el array `suggestedPlans`.
 *
 * 5. RENDERIZADO DE PLANES:
 *    - El frontend recibe `suggestedPlans` y renderiza los componentes
 *      `SuggestedPlans.tsx` y `PlanCard.tsx`.
 *
 * 6. LOGGING:
 *    - Cada mensaje de usuario y asistente se guarda en la tabla
 *      `conversation_logs`. El contexto del usuario se guarda en
 *      `context_snapshots`.
 *    - El logging está envuelto en un try/catch para no bloquear la
 *      respuesta si la base de datos no está disponible.
 * -----------------------------------------------------------------
 */

import { AssistantMemory } from "./types/assistant";
import { InsuranceCategory } from "./schema";

// Interfaz para los mensajes, compatible con frontend y backend
export interface SimpleMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// =================================================================
// LÓGICA DE DETECCIÓN DE CATEGORÍA
// =================================================================

const soatKeywords = ['soat', 'seguro obligatorio'];

const categoryKeywords: Record<Exclude<InsuranceCategory, 'soat'>, string[]> = {
  pet: ['mascota', 'perro', 'gato', 'pet', 'dog', 'cat', 'animal', 'veterinario', 'cachorro', 'felino', 'canino'],
  travel: ['viaje', 'travel', 'trip', 'internacional', 'europa', 'estados unidos', 'méxico', 'vacaciones', 'turismo', 'exterior', 'extranjero'],
  auto: ['auto', 'carro', 'vehiculo', 'vehículo', 'moto', 'car', 'vehicle', 'motorcycle', 'scooter', 'vespa', 'motocicleta', 'automóvil', 'coche', 'mazda', 'bmw', 'mercedes', 'audi', 'kia', 'hyundai', 'volkswagen', 'vw', 'peugeot', 'renault', 'fiat', 'jeep', 'subaru', 'mitsubishi', 'suzuki', 'lexus', 'chevy'],
  health: ['salud', 'health', 'médico', 'medical', 'hospital', 'doctor', 'medicina', 'hospitalización', 'clínica', 'eps'],
};

export function detectInsuranceCategory(message: string): InsuranceCategory | 'general' {
  const lowerMessage = message.toLowerCase().trim();

  // Prioritize SOAT detection to avoid being miscategorized as 'auto'
  if (soatKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'soat';
  }

  for (const category in categoryKeywords) {
    if (categoryKeywords[category as Exclude<InsuranceCategory, 'soat'>].some(keyword => lowerMessage.includes(keyword))) {
      return category as InsuranceCategory;
    }
  }

  // Fallback para patrones específicos
  if (/seguro.*(mascot|perr|gat)/i.test(lowerMessage)) return 'pet';
  if (/seguro.*(viaj|travel)/i.test(lowerMessage)) return 'travel';
  if (/seguro.*(auto|vehicul|carro)/i.test(lowerMessage)) return 'auto';
  if (/seguro.*(salud|medic)/i.test(lowerMessage)) return 'health';
  if (/(soat|seguro obligatorio)/i.test(lowerMessage)) return 'soat';

  return 'general';
}

// =================================================================
// LÓGICA DE SUFICIENCIA DE CONTEXTO
// =================================================================

/**
 * Verifica si se ha proporcionado suficiente contexto para una categoría de seguro.
 * @param conversation - Una concatenación de todo el historial de chat del usuario.
 * @param category - La categoría de seguro a verificar.
 * @returns `true` si el contexto es suficiente, de lo contrario `false`.
 */
export function hasSufficientContext(conversation: string, category: InsuranceCategory | 'general'): boolean {
  const lowerConversation = conversation.toLowerCase();

  if (category === 'general') return false;

  switch (category) {
    case 'travel':
      const hasDestination = /(europa|asia|méxico|estados unidos|colombia|españa|francia|alemania|italia|brasil|chile|perú|usa|canadá|argentina|viajar a)/i.test(lowerConversation);
      const hasOrigin = /(desde|de|partiendo de|salgo de|origen)/i.test(lowerConversation);
      const hasDuration = /(días?|semanas?|meses?|\d+)/i.test(lowerConversation);
      return hasDestination && hasOrigin && hasDuration;

    case 'pet':
      const hasPetType = /(perr|gat|dog|cat)/i.test(lowerConversation);
      const hasPetAge = /(\d+|años?|meses?|cachorro|adulto|mayor)/i.test(lowerConversation);
      // Solo se necesita el tipo y la edad
      return hasPetType && hasPetAge;

    case 'auto':
      const hasBrand = /(marca|toyota|honda|ford|chevrolet|nissan)/i.test(lowerConversation);
      const hasModel = /(modelo|\d{4}|año)/i.test(lowerConversation);
      // Solo se necesita la marca y el modelo/año
      return hasBrand && hasModel;

    case 'health':
      const hasAge = /(\d+|años?|joven|adulto|mayor)/i.test(lowerConversation);
      const hasGender = /(hombre|mujer|masculino|femenino)/i.test(lowerConversation);
      const hasLocation = /(vivo en|resido en|en colombia|en méxico|en perú)/i.test(lowerConversation);
      return hasAge && hasGender && hasLocation;

    default:
      return false;
  }
}

// =================================================================
// LÓGICA DE ANÁLISIS DE NECESIDADES DEL BACKEND
// =================================================================

export interface ContextAnalysisResult {
  needsMoreContext: boolean;
  category: InsuranceCategory | 'general';
  missingInfo: string[];
  suggestedQuestions: string[];
}

/**
 * Analiza el contexto de la conversación para determinar si se necesita más información.
 * Esta función es utilizada principalmente por el backend.
 * @param conversation - Una concatenación de todo el historial de chat del usuario.
 * @param category - La categoría de seguro detectada.
 * @returns Un objeto `ContextAnalysisResult`.
 */
export function analyzeContextNeeds(
  conversation: string, 
  category: InsuranceCategory | 'general',
  memory?: AssistantMemory
): ContextAnalysisResult {
    const lowerConversation = conversation.toLowerCase();
    const result: ContextAnalysisResult = {
        needsMoreContext: false,
        category,
        missingInfo: [],
        suggestedQuestions: [],
    };

    if (category === 'general') {
        return result;
    }

    const checks = {
        travel: {
            destination: /(europa|asia|méxico|estados unidos|colombia|españa|francia|alemania|italia|brasil|chile|perú|usa|canadá|argentina|viajar a)/i.test(lowerConversation),
            startDate: /(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|\d{1,2}\/\d{1,2}\/\d{2,4})/i.test(lowerConversation)
        },
        pet: {
            petType: /(perro|gato|dog|cat)/i.test(lowerConversation),
            petAge: /(\d+|años?|meses?|cachorro|adulto|mayor)/i.test(lowerConversation),
        },
        auto: {
            brand: !!memory?.vehicle?.make || /(marca|toyota|honda|ford|chevrolet|nissan|mazda|kia|hyundai|bmw|mercedes|audi|volkswagen|vw|renault|fiat)/i.test(lowerConversation),
            year: !!memory?.vehicle?.year || /(año|\d{4})/i.test(lowerConversation),
            country: /(colombia|méxico|perú|chile|argentina)/i.test(lowerConversation)
        },
        health: {
            age: /(\d+|años?|joven|adulto|mayor)/i.test(lowerConversation),
            gender: /(hombre|mujer|masculino|femenino)/i.test(lowerConversation),
            country: /(colombia|méxico|perú|chile|argentina)/i.test(lowerConversation)
        },
        soat: {} // SOAT does not require additional context checks
    }[category];

    const questions: Record<string, Record<string, string>> = {
        travel: {
            destination: "¿A qué país o continente planeas viajar?",
            startDate: "¿Cuándo es la fecha de inicio de tu viaje?",
            country: "¿En qué país está registrado el vehículo (ej. Colombia, México)?"
        },
        pet: {
            petType: "¿Qué tipo de mascota tienes? (perro, gato, etc.)",
            petAge: "¿Qué edad tiene tu mascota?",
        },
        auto: {
            brand: "¿Cuál es la marca de tu vehículo?",
            year: "¿De qué año es tu carro?",
            country: "¿En qué país está registrado el vehículo (ej. Colombia, México)?"
        },
        health: {
            age: "¿Qué edad tienes?",
            gender: "¿Cuál es tu género?",
            country: "¿En qué país resides actualmente (ej. Colombia, México)?"
        },
        soat: {}
    };
    
    for (const key in checks) {
        if (!(checks as any)[key]) {
            result.missingInfo.push(key);
            result.suggestedQuestions.push(questions[category][key]);
        }
    }

    if (category === 'auto' && memory?.vehicle?.make && memory.vehicle.model && memory.vehicle.year) {
        // Basic vehicle data present – treat context as sufficient
        result.missingInfo = [];
        result.suggestedQuestions = [];
        result.needsMoreContext = false;
        return result;
    }

    if (result.missingInfo.length > 0) {
        result.needsMoreContext = true;
    }

    return result;
}

// Price range constants (in COP)
const PRICE_RANGES = {
  ECONOMIC: { min: 0, max: 100_000 },
  STANDARD: { min: 100_000, max: 300_000 },
  PREMIUM: { min: 300_000, max: Infinity }
} as const;

// Time unit patterns for price normalization
const TIME_UNITS = {
  MONTHLY: [
    'mensual', 'por mes', 'al mes', 'mensuales', 'cada mes',
    'mes', '/mes', 'x mes', 'mensualmente', 'cuota mensual'
  ],
  QUARTERLY: [
    'trimestral', 'por trimestre', 'cada tres meses', 'trimestrales',
    'trimestre', '/trimestre', 'x trimestre', 'trimestralmente',
    'cada 3 meses', 'tres meses', '3 meses', 'cuota trimestral'
  ],
  SEMIANNUAL: [
    'semestral', 'por semestre', 'cada seis meses', 'semestrales',
    'semestre', '/semestre', 'x semestre', 'semestralmente',
    'cada 6 meses', 'seis meses', '6 meses', 'cuota semestral'
  ],
  ANNUAL: [
    'anual', 'por año', 'al año', 'anuales', 'cada año',
    'año', '/año', 'x año', 'anualmente', 'cuota anual'
  ]
} as const;

// Price sentiment keywords
const PRICE_SENTIMENT = {
  LOW: [
    'barato', 'económico', 'básico', 'accesible', 'bajo costo',
    'precio bajo', 'lo más barato', 'económica', 'menos costoso',
    'ahorrar', 'ajustado', 'módico'
  ],
  HIGH: [
    'premium', 'costoso', 'completo', 'full', 'alto', 'máxima cobertura',
    'todo incluido', 'de lujo', 'premium', 'exclusivo', 'top'
  ]
} as const;

type PaymentFrequency = 'monthly' | 'quarterly' | 'semiannual' | 'annual';

interface PaymentInfo {
  frequency: PaymentFrequency;
  divisor: number;
}

// Mapping of payment frequencies to their monthly divisors
const PAYMENT_FREQUENCIES: Record<PaymentFrequency, PaymentInfo> = {
  monthly: { frequency: 'monthly', divisor: 1 },
  quarterly: { frequency: 'quarterly', divisor: 3 },
  semiannual: { frequency: 'semiannual', divisor: 6 },
  annual: { frequency: 'annual', divisor: 12 }
} as const;

interface PriceRange {
  min: number;
  max: number;
  isMonthly: boolean;
}

/**
 * Extracts price range from user message
 * @param message - User message
 * @returns Tuple of [min, max] in COP (normalized to monthly) or null if not detected
 */
export function extractPriceRange(message: string): [number, number] | null {
  const lowerMessage = message.toLowerCase().trim();

  // Check for price sentiment first
  if (PRICE_SENTIMENT.LOW.some(term => lowerMessage.includes(term))) {
    return [0, PRICE_RANGES.ECONOMIC.max] as [number, number];
  }
  if (PRICE_SENTIMENT.HIGH.some(term => lowerMessage.includes(term))) {
    return [PRICE_RANGES.PREMIUM.min, Infinity] as [number, number];
  }

  // Regular expressions for price patterns
  const patterns = [
    // "menos de X" or "máximo X"
    {
      regex: /(menos de|máximo|hasta|no más de)\s*\$?\s*(\d+(?:[\.,]\d+)?)\s*(mil|millón|m|k)?(?:\s+(?:cop|pesos))?\s*(?:(?:por|al|cada|de)\s+)?(mes|trimestre|semestre|año|mensual|trimestral|semestral|anual|anuales|mensuales|trimestrales|semestrales)?/i,
      handler: (match: RegExpMatchArray): [number, number] | null => {
        const amount = normalizeAmount(match[2], match[3]);
        if (!amount) return null;
        const frequency = detectPaymentFrequency(match[4], lowerMessage);
        const normalizedAmount = normalizeToMonthly(amount, frequency);
        return [0, normalizedAmount] as [number, number];
      }
    },
    // "más de X" or "mínimo X"
    {
      regex: /(más de|mínimo|desde|arriba de)\s*\$?\s*(\d+(?:[\.,]\d+)?)\s*(mil|millón|m|k)?(?:\s+(?:cop|pesos))?\s*(?:(?:por|al|cada|de)\s+)?(mes|trimestre|semestre|año|mensual|trimestral|semestral|anual|anuales|mensuales|trimestrales|semestrales)?/i,
      handler: (match: RegExpMatchArray): [number, number] | null => {
        const amount = normalizeAmount(match[2], match[3]);
        if (!amount) return null;
        const frequency = detectPaymentFrequency(match[4], lowerMessage);
        const normalizedAmount = normalizeToMonthly(amount, frequency);
        return [normalizedAmount, Infinity] as [number, number];
      }
    },
    // "entre X y Y"
    {
      regex: /entre\s*\$?\s*(\d+(?:[\.,]\d+)?)\s*(mil|millón|m|k)?(?:\s+(?:cop|pesos))?\s*y\s*\$?\s*(\d+(?:[\.,]\d+)?)\s*(mil|millón|m|k)?(?:\s+(?:cop|pesos))?\s*(?:(?:por|al|cada|de)\s+)?(mes|trimestre|semestre|año|mensual|trimestral|semestral|anual|anuales|mensuales|trimestrales|semestrales)?/i,
      handler: (match: RegExpMatchArray): [number, number] | null => {
        const min = normalizeAmount(match[1], match[2]);
        const max = normalizeAmount(match[3], match[4]);
        if (!min || !max) return null;
        const frequency = detectPaymentFrequency(match[5], lowerMessage);
        return [
          normalizeToMonthly(min, frequency),
          normalizeToMonthly(max, frequency)
        ] as [number, number];
      }
    },
    // Simple number with unit
    {
      regex: /\$?\s*(\d+(?:[\.,]\d+)?)\s*(mil|millón|m|k)?(?:\s+(?:cop|pesos))?\s*(?:(?:por|al|cada|de)\s+)?(mes|trimestre|semestre|año|mensual|trimestral|semestral|anual|anuales|mensuales|trimestrales|semestrales)?/i,
      handler: (match: RegExpMatchArray): [number, number] | null => {
        const amount = normalizeAmount(match[1], match[2]);
        if (!amount) return null;
        const frequency = detectPaymentFrequency(match[3], lowerMessage);
        const normalizedAmount = normalizeToMonthly(amount, frequency);
        // Use ±20% range around the specified amount
        return [
          normalizedAmount * 0.8,
          normalizedAmount * 1.2
        ] as [number, number];
      }
    }
  ];

  // Try each pattern
  for (const { regex, handler } of patterns) {
    const match = lowerMessage.match(regex);
    if (match) {
      const result = handler(match);
      if (result) return result;
    }
  }

  return null;
}

/**
 * Detects payment frequency from text
 * @param explicitUnit - Explicit time unit from regex match
 * @param fullMessage - Full message for context
 * @returns PaymentFrequency (defaults to monthly)
 */
function detectPaymentFrequency(explicitUnit: string | undefined, fullMessage: string): PaymentFrequency {
  // Check explicit unit first
  if (explicitUnit) {
    const lowerUnit = explicitUnit.toLowerCase();
    for (const [frequency, info] of Object.entries(PAYMENT_FREQUENCIES)) {
      if (TIME_UNITS[frequency.toUpperCase() as keyof typeof TIME_UNITS].some(unit => 
        lowerUnit.includes(unit.toLowerCase())
      )) {
        return info.frequency;
      }
    }
  }

  // Check full message context
  for (const [frequency, info] of Object.entries(PAYMENT_FREQUENCIES)) {
    if (TIME_UNITS[frequency.toUpperCase() as keyof typeof TIME_UNITS].some(unit => 
      fullMessage.includes(unit.toLowerCase())
    )) {
      return info.frequency;
    }
  }

  // Default to monthly if no clear indication
  return 'monthly';
}

/**
 * Normalizes an amount to monthly based on payment frequency
 */
function normalizeToMonthly(amount: number, frequency: PaymentFrequency): number {
  const { divisor } = PAYMENT_FREQUENCIES[frequency];
  return Math.round(amount / divisor);
}

/**
 * Normalizes an amount with unit to a number
 * @param amount - Numeric string
 * @param unit - Optional unit (mil, millón, k, m)
 * @returns Normalized number or null if invalid
 */
function normalizeAmount(amount: string, unit?: string): number | null {
  try {
    // Clean up the numeric string
    let value = parseFloat(amount.replace(/[,.]/g, ''));
    
    // Apply multiplier based on unit
    switch (unit?.toLowerCase()) {
      case 'mil':
      case 'k':
        value *= 1_000;
        break;
      case 'millón':
      case 'm':
        value *= 1_000_000;
        break;
    }

    return value > 0 ? value : null;
  } catch {
    return null;
  }
} 