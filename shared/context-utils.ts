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

// Interfaz para los mensajes, compatible con frontend y backend
export interface SimpleMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// =================================================================
// LÓGICA DE DETECCIÓN DE CATEGORÍA
// =================================================================

export type InsuranceCategory = 'travel' | 'auto' | 'pet' | 'health' | 'general';

const categoryKeywords: Record<Exclude<InsuranceCategory, 'general'>, string[]> = {
  pet: ['mascota', 'perro', 'gato', 'pet', 'dog', 'cat', 'animal', 'veterinario', 'cachorro', 'felino', 'canino'],
  travel: ['viaje', 'travel', 'trip', 'internacional', 'europa', 'estados unidos', 'méxico', 'vacaciones', 'turismo', 'exterior', 'extranjero'],
  auto: ['auto', 'carro', 'vehiculo', 'vehículo', 'moto', 'car', 'vehicle', 'motorcycle', 'scooter', 'vespa', 'motocicleta', 'automóvil', 'coche', 'mazda', 'bmw', 'mercedes', 'audi', 'kia', 'hyundai', 'volkswagen', 'vw', 'peugeot', 'renault', 'fiat', 'jeep', 'subaru', 'mitsubishi', 'suzuki', 'lexus', 'chevy'],
  health: ['salud', 'health', 'médico', 'medical', 'hospital', 'doctor', 'medicina', 'hospitalización', 'clínica', 'eps'],
};

export function detectInsuranceCategory(message: string): InsuranceCategory {
  const lowerMessage = message.toLowerCase().trim();

  for (const category in categoryKeywords) {
    if (categoryKeywords[category as Exclude<InsuranceCategory, 'general'>].some(keyword => lowerMessage.includes(keyword))) {
      return category as InsuranceCategory;
    }
  }

  // Fallback para patrones específicos
  if (/seguro.*(mascot|perr|gat)/i.test(lowerMessage)) return 'pet';
  if (/seguro.*(viaj|travel)/i.test(lowerMessage)) return 'travel';
  if (/seguro.*(auto|vehicul|carro)/i.test(lowerMessage)) return 'auto';
  if (/seguro.*(salud|medic)/i.test(lowerMessage)) return 'health';

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
export function hasSufficientContext(conversation: string, category: InsuranceCategory): boolean {
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
  category: InsuranceCategory;
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
  category: InsuranceCategory,
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

    const checks: Record<string, boolean> = {
        travel: {
            destination: /(europa|asia|méxico|estados unidos|colombia|españa|francia|alemania|italia|brasil|chile|perú|usa|canadá|argentina|viajar a)/i.test(lowerConversation),
            origin: /(desde|de|partiendo de|salgo de|origen)/i.test(lowerConversation),
            duration: /(días?|semanas?|meses?|\d+)/i.test(lowerConversation),
        },
        pet: {
            petType: /(perr|gat|dog|cat)/i.test(lowerConversation),
            petAge: /(\d+|años?|meses?|cachorro|adulto|mayor)/i.test(lowerConversation),
        },
        auto: {
            brand: !!memory?.vehicle?.make || /(marca|toyota|honda|ford|chevrolet|nissan|mazda|kia|hyundai|bmw|mercedes|audi|volkswagen|vw|renault|fiat)/i.test(lowerConversation),
            model: !!memory?.vehicle?.model || /(modelo|\d{4}|año)/i.test(lowerConversation),
        },
        health: {
            age: /(\d+|años?|joven|adulto|mayor)/i.test(lowerConversation),
            gender: /(hombre|mujer|masculino|femenino)/i.test(lowerConversation),
            location: /(vivo en|resido en|en colombia|en méxico|en perú)/i.test(lowerConversation),
        }
    }[category];

    const questions: Record<string, Record<string, string>> = {
        travel: {
            destination: "¿A qué país o ciudad planeas viajar?",
            origin: "¿Desde dónde iniciarás tu viaje?",
            duration: "¿Cuántos días durará tu viaje?",
        },
        pet: {
            petType: "¿Qué tipo de mascota tienes? (perro, gato, etc.)",
            petAge: "¿Qué edad tiene tu mascota?",
        },
        auto: {
            brand: "¿Cuál es la marca de tu vehículo?",
            model: "¿Cuál es el modelo y año?",
        },
        health: {
            age: "¿Qué edad tienes?",
            gender: "¿Cuál es tu género?",
            location: "¿En qué país vives actualmente?",
        }
    };
    
    for (const key in checks) {
        if (!checks[key]) {
            result.missingInfo.push(key);
            result.suggestedQuestions.push(questions[category][key]);
        }
    }

    if (result.missingInfo.length > 0) {
        result.needsMoreContext = true;
    }

    return result;
} 