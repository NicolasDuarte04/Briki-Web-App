/**
 * Servicio para interactuar con la API de OpenAI a través del backend
 * Esta implementación segura evita exponer la clave de API en el frontend
 */

import { InsurancePlan } from '@/components/briki-ai-assistant/PlanCard';

// Tipos para las respuestas de la API
interface OpenAIResponse {
  response?: string;
  message?: string;
  suggestedPlans?: InsurancePlan[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

interface OpenAIErrorResponse {
  error: string;
  details?: string;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Envía un mensaje al asistente AI a través del backend
 * @param message Mensaje del usuario
 * @param conversationHistory Historial de conversación opcional
 * @returns Respuesta de la API
 */
export async function sendMessageToAI(
  message: string,
  conversationHistory: Message[] = []
): Promise<OpenAIResponse> {
  try {
    const response = await fetch("/api/ai/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        conversationHistory,
      }),
    });

    if (!response.ok) {
      const errorData: OpenAIErrorResponse = await response.json();
      throw new Error(errorData.error || "Error al comunicarse con el asistente");
    }

    const data: OpenAIResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de OpenAI:", error);
    throw error;
  }
}

/**
 * Obtiene respuestas simuladas para situaciones en las que no se puede usar la API
 * @param message Mensaje del usuario
 * @returns Respuesta simulada con mensaje y planes sugeridos
 */
export function getMockResponse(message: string): OpenAIResponse {
  // Respuestas básicas para demostración
  const lowercaseMessage = message.toLowerCase();
  
  let response = "Lo siento, no entiendo tu pregunta. ¿Puedes ser más específico sobre el tipo de seguro que te interesa?";
  let mockPlans: InsurancePlan[] = [];
  
  // Ejemplo de planes de viaje
  if (lowercaseMessage.includes("viaje") || lowercaseMessage.includes("viajes") || lowercaseMessage.includes("viajar")) {
    response = "Briki ofrece excelentes seguros de viaje que cubren cancelaciones, asistencia médica internacional y pérdida de equipaje. Te recomiendo nuestros planes más populares que te muestro a continuación.";
    
    // Ejemplos de planes de viaje
    mockPlans = [
      {
        id: "plan-travel-002",
        category: "travel",
        provider: "Global Assistance",
        name: "Plan Premium Internacional",
        description: "Cobertura completa para viajeros exigentes con asistencia VIP en más de 190 países.",
        basePrice: 39.99,
        currency: "USD",
        duration: "por viaje",
        coverageAmount: 50000,
        coverage: {
          medical: 50000,
          luggage: 2000,
          cancellation: 5000,
          delay: 500
        },
        features: [
          "Asistencia médica premium en todo el mundo",
          "Traslado y repatriación sanitaria",
          "Compensación por pérdida de equipaje",
          "Cancelación e interrupción de viaje",
          "Responsabilidad civil en viaje"
        ],
        deductible: 0,
        exclusions: [
          "Enfermedades crónicas no estables",
          "Embarazo después de la semana 24"
        ],
        addOns: [
          "Seguro de dispositivos electrónicos",
          "Cobertura para deportes de aventura",
          "Asistencia legal internacional"
        ],
        tags: [
          "premium",
          "viajes internacionales",
          "sin deducible"
        ],
        rating: 4.8,
        status: "active"
      },
      {
        id: "plan-travel-001",
        category: "travel",
        provider: "Seguros El Cóndor",
        name: "Plan Básico de Viaje",
        description: "Cobertura médica básica para viajes internacionales con atención las 24 horas.",
        basePrice: 19.99,
        currency: "USD",
        duration: "por viaje",
        coverageAmount: 10000,
        coverage: {
          medical: 10000,
          luggage: 500,
          cancellation: 1000
        },
        features: [
          "Atención médica 24/7",
          "Cobertura por cancelación de viaje",
          "Protección de equipaje perdido"
        ],
        deductible: 50,
        exclusions: [
          "Deportes extremos",
          "Condiciones médicas preexistentes"
        ],
        addOns: [
          "Extensión por COVID-19",
          "Repatriación médica"
        ],
        tags: [
          "económico",
          "viajes internacionales",
          "popular"
        ],
        rating: 4.2,
        status: "active"
      }
    ];
  } 
  // Ejemplo de planes de auto
  else if (lowercaseMessage.includes("auto") || lowercaseMessage.includes("coche") || lowercaseMessage.includes("carro") || 
            lowercaseMessage.includes("moto") || lowercaseMessage.includes("vespa") || lowercaseMessage.includes("scooter")) {
    
    // Respuesta específica para motos/scooters
    if (lowercaseMessage.includes("moto") || lowercaseMessage.includes("vespa") || lowercaseMessage.includes("scooter")) {
      response = "Para tu moto o scooter, tenemos planes específicos que ofrecen la cobertura ideal para vehículos de dos ruedas. Te muestro algunas opciones que podrían interesarte.";
      
      // Agregar plan específico para motos/scooters
      mockPlans.push({
        id: "auto-scooter-001",
        category: "auto",
        provider: "Liberty Seguros",
        name: "Protección para Scooters y Motos Ligeras",
        description: "Seguro diseñado específicamente para propietarios de scooters tipo Vespa y motos ligeras, con cobertura ajustada a tus necesidades urbanas.",
        basePrice: 45.99,
        currency: "USD",
        duration: "mensual",
        coverageAmount: 8000,
        coverage: {
          thirdParty: 6000,
          personalAccident: 5000,
          theft: 8000,
          urbanAssistance: 500
        },
        features: [
          "Asistencia en vías urbanas 24/7",
          "Cobertura por daños en estacionamiento",
          "Protección contra robo de accesorios",
          "Grúa hasta 50km"
        ],
        deductible: 150,
        exclusions: [
          "Uso para delivery o servicios comerciales",
          "Modificaciones no homologadas",
          "Conducción fuera de vías pavimentadas"
        ],
        addOns: [
          "Seguro de casco y equipamiento",
          "Asistencia mecánica especializada",
          "Cobertura internacional"
        ],
        tags: [
          "scooter",
          "vespa",
          "moto ligera",
          "urbano",
          "económico"
        ],
        rating: 4.5,
        status: "active"
      });
    } else {
      response = "Nuestros seguros de auto te ofrecen protección completa con cobertura de daños a terceros, asistencia en carretera y talleres certificados. Aquí te muestro nuestros planes más recomendados.";
    }
    
    // Planes de auto generales (se agregan a los específicos si ya existen)
    mockPlans.push(
      {
        id: "plan-auto-001",
        category: "auto",
        provider: "Seguros Automotriz",
        name: "Cobertura Básica",
        description: "Seguro obligatorio con responsabilidad civil básica para conductores económicos.",
        basePrice: 29.99,
        currency: "USD",
        duration: "mensual",
        coverageAmount: 50000,
        coverage: {
          thirdParty: 50000,
          medicalExpenses: 5000,
          legalDefense: 2000
        },
        features: [
          "Responsabilidad civil obligatoria",
          "Asistencia en carretera básica",
          "Asesoría legal telefónica"
        ],
        deductible: 200,
        exclusions: [
          "Daños al propio vehículo",
          "Conductores menores de 25 años",
          "Uso comercial del vehículo"
        ],
        addOns: [
          "Asistencia en carretera extendida",
          "Cobertura por vandalismo"
        ],
        tags: [
          "económico",
          "básico",
          "obligatorio"
        ],
        rating: 3.9,
        status: "active"
      }
    );
  } 
  // Ejemplo de planes de mascota
  else if (lowercaseMessage.includes("mascota") || lowercaseMessage.includes("perro") || lowercaseMessage.includes("gato")) {
    response = "Para tu mascota tenemos planes que cubren consultas veterinarias, vacunas y tratamientos por accidentes. Estos son nuestros planes más recomendados para el cuidado de tu compañero.";
    
    mockPlans = [
      {
        id: "plan-pet-002",
        category: "pet",
        provider: "PetHealth",
        name: "Plan Integral Mascotas",
        description: "Cobertura completa para tu mascota incluyendo vacunas, enfermedades y emergencias veterinarias.",
        basePrice: 49.99,
        currency: "USD",
        duration: "mensual",
        coverageAmount: 5000,
        coverage: {
          annualCheckups: 4,
          vaccines: "completo",
          accidents: 3000,
          surgeries: 2000,
          medications: 500
        },
        features: [
          "4 consultas veterinarias al año",
          "Vacunas completas",
          "Cirugías por emergencia",
          "Medicamentos recetados",
          "Asistencia telefónica 24/7"
        ],
        deductible: 100,
        exclusions: [
          "Enfermedades congénitas",
          "Mascotas mayores de 10 años al ingresar",
          "Tratamientos estéticos"
        ],
        addOns: [
          "Cobertura dental",
          "Servicios de hospedaje en caso de hospitalización del dueño",
          "Fisioterapia y rehabilitación"
        ],
        tags: [
          "completo",
          "vacunas",
          "cirugías"
        ],
        rating: 4.7,
        status: "active"
      }
    ];
  } 
  // Ejemplo de planes de salud
  else if (lowercaseMessage.includes("salud") || lowercaseMessage.includes("médico") || lowercaseMessage.includes("hospital")) {
    response = "Nuestros seguros de salud incluyen consultas, hospitalización y medicamentos. Te muestro los planes más recomendados para ti y tu familia.";
    
    mockPlans = [
      {
        id: "plan-health-003",
        category: "health",
        provider: "MediSalud",
        name: "Plan Familiar Completo",
        description: "Cobertura médica integral para toda la familia con beneficios especiales para niños y adultos mayores.",
        basePrice: 199.99,
        currency: "USD",
        duration: "mensual",
        coverageAmount: 500000,
        coverage: {
          consultations: "ilimitadas",
          hospitalization: 300000,
          medications: 10000,
          maternity: 15000,
          dental: 3000,
          vision: 1000
        },
        features: [
          "Consultas ilimitadas en red",
          "Hospitalización en habitación individual",
          "Cobertura de medicamentos recetados",
          "Atención pediátrica especializada",
          "Servicios de maternidad",
          "Cobertura dental y visión"
        ],
        deductible: 150,
        exclusions: [
          "Tratamientos experimentales",
          "Cirugías estéticas no reconstructivas",
          "Tratamientos de infertilidad avanzados"
        ],
        addOns: [
          "Servicio de telemedicina 24/7",
          "Cobertura internacional de emergencia",
          "Chequeos preventivos anuales"
        ],
        tags: [
          "familiar",
          "completo",
          "dental",
          "visión"
        ],
        rating: 4.8,
        status: "active"
      }
    ];
  }
  
  return {
    message: response,
    suggestedPlans: mockPlans,
    model: "mock-gpt",
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }
  };
}