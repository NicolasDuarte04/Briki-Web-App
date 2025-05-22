import { ChatMessage, UserIntentType } from "@/types/chat";
import { PlanProps } from "@/components/PlanRecommendationCard";

interface ProcessMessageOptions {
  message: string;
  sessionId?: string;
  previousMessages?: ChatMessage[];
}

interface AssistantResponse {
  content: string;
  plans?: PlanProps[];
  detectedIntent: UserIntentType;
  followUpRecommendations?: {
    mainPlan: PlanProps;
    relatedPlans: PlanProps[];
  };
}

// This is a client-side service for the Briki Assistant
// It will be enhanced to connect to a real backend API
export const assistantService = {
  
  // Process a user message and generate a response
  async processMessage({ message, sessionId, previousMessages }: ProcessMessageOptions): Promise<AssistantResponse> {
    // In a real implementation, this would call the backend API
    // For now, we'll use simple intent detection and mock responses
    const intent = detectUserIntent(message);
    const response = generateResponse(intent, message);
    
    return response;
  },
  
  // Generate plan recommendations based on user context
  async getRecommendedPlans(intent: UserIntentType, context?: string): Promise<PlanProps[]> {
    // This would fetch real plan data from the API
    // For now we'll return mock plans based on intent
    return getMockPlansForIntent(intent);
  }
};

// Simple client-side intent detection (would be replaced by backend NLU)
function detectUserIntent(message: string): UserIntentType {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('vespa') || lowerMsg.includes('moto') || lowerMsg.includes('car') || 
     lowerMsg.includes('auto') || lowerMsg.includes('vehicle')) {
    return 'auto_insurance';
  } 
  else if (lowerMsg.includes('trip') || lowerMsg.includes('travel') || lowerMsg.includes('vacation') ||
          lowerMsg.includes('tourism') || lowerMsg.includes('flight')) {
    return 'travel_insurance';
  }
  else if (lowerMsg.includes('dog') || lowerMsg.includes('cat') || lowerMsg.includes('pet') ||
          lowerMsg.includes('animal')) {
    return 'pet_insurance';
  }
  else if (lowerMsg.includes('health') || lowerMsg.includes('medical') || lowerMsg.includes('doctor') ||
          lowerMsg.includes('hospital')) {
    return 'health_insurance';
  }
  else if (lowerMsg.includes('home') || lowerMsg.includes('house') || lowerMsg.includes('apartment') ||
          lowerMsg.includes('property')) {
    return 'home_insurance';
  }
  else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('expensive') ||
          lowerMsg.includes('cheap')) {
    return 'pricing_question';
  }
  else if (lowerMsg.includes('compare') || lowerMsg.includes('difference') || lowerMsg.includes('better') ||
          lowerMsg.includes('best')) {
    return 'plan_comparison';
  }
  
  return 'general_question';
}

// Generate appropriate response based on intent
function generateResponse(intent: UserIntentType, message: string): AssistantResponse {
  switch (intent) {
    case 'auto_insurance':
      if (message.toLowerCase().includes('vespa')) {
        return {
          content: "Para tu Vespa, te recomendaría un seguro que incluya responsabilidad civil, cobertura por robo, y asistencia en carretera. He encontrado estas opciones que se ajustan a tus necesidades:",
          plans: getVespaPlans(),
          detectedIntent: intent
        };
      }
      return {
        content: "Encontré estos planes de seguro para tu vehículo que incluyen diferentes niveles de cobertura:",
        plans: getAutoPlans(),
        detectedIntent: intent
      };
      
    case 'travel_insurance':
      return {
        content: "Para tu viaje, aquí hay planes que ofrecen cobertura médica internacional, cancelación de viaje, y protección de equipaje:",
        plans: getTravelPlans(),
        detectedIntent: intent
      };
      
    case 'pet_insurance':
      return {
        content: "Para tu mascota, estos planes cubren visitas veterinarias, emergencias, y algunos incluyen cobertura para condiciones hereditarias:",
        plans: getPetPlans(),
        detectedIntent: intent,
        followUpRecommendations: {
          mainPlan: getPetPlans()[0],
          relatedPlans: [
            {
              name: "Seguro de Responsabilidad Civil",
              description: "Cobertura para daños que tu mascota pueda causar a terceros",
              price: 15,
              priceUnit: "/mo",
              category: "home",
              badge: "Complementario",
              features: [
                { text: "Cobertura hasta $50,000", color: "blue-500" },
                { text: "Incluye daños materiales", color: "indigo-500" },
                { text: "Sin deducible", color: "purple-500" }
              ]
            },
            {
              name: "Plan de Bienestar Preventivo",
              description: "Chequeos regulares y cuidado preventivo para tu mascota",
              price: 25,
              priceUnit: "/mo",
              category: "pet",
              badge: "Preventivo",
              features: [
                { text: "Vacunas incluidas", color: "cyan-500" },
                { text: "Chequeos dentales", color: "green-500" },
                { text: "Desparasitación regular", color: "emerald-500" }
              ]
            }
          ]
        }
      };
      
    case 'health_insurance':
      return {
        content: "Encontré estos planes de salud que se adaptarían a tus necesidades, con diferentes niveles de cobertura y precios:",
        plans: getHealthPlans(),
        detectedIntent: intent
      };
      
    case 'home_insurance':
      return {
        content: "Para proteger tu hogar, estos planes ofrecen cobertura contra daños estructurales, robo, y responsabilidad civil:",
        plans: getHomePlans(),
        detectedIntent: intent
      };
      
    default:
      return {
        content: "Gracias por tu pregunta. ¿Podrías proporcionarme más detalles sobre el tipo de seguro que estás buscando? Puedo ayudarte con seguros de auto, viaje, mascotas, salud o para tu hogar.",
        detectedIntent: intent
      };
  }
}

// Mock plan data for demonstration
function getVespaPlans(): PlanProps[] {
  return [
    {
      name: "Scooter Basic",
      description: "Cobertura esencial para tu Vespa",
      price: 28,
      priceUnit: "/mo",
      badge: "Recomendado",
      category: "auto",
      features: [
        { text: "Responsabilidad civil obligatoria", color: "blue-500" },
        { text: "Asistencia básica en vía", color: "cyan-500" },
        { text: "Cobertura por robo", color: "indigo-500" },
        { text: "Daños a terceros", color: "purple-500" }
      ]
    },
    {
      name: "Scooter Plus",
      description: "Protección ampliada para motocicletas y scooters",
      price: 42,
      priceUnit: "/mo",
      badge: "Más popular",
      category: "auto",
      features: [
        { text: "Todo lo del plan Basic", color: "blue-500" },
        { text: "Daños por accidente", color: "cyan-500" },
        { text: "Asistencia 24/7 premium", color: "indigo-500" },
        { text: "Accesorios cubiertos hasta $500", color: "purple-500" }
      ]
    },
    {
      name: "Scooter Premium",
      description: "Cobertura total para tu Vespa con beneficios exclusivos",
      price: 65,
      priceUnit: "/mo",
      badge: "Todo incluido",
      category: "auto",
      features: [
        { text: "Cobertura todo riesgo", color: "blue-500" },
        { text: "Vespa de reemplazo por 15 días", color: "cyan-500" },
        { text: "Valor a nuevo durante 2 años", color: "indigo-500" },
        { text: "Accesorios cubiertos sin límite", color: "purple-500" }
      ]
    }
  ];
}

function getAutoPlans(): PlanProps[] {
  return [
    {
      name: "AutoProtect Basic",
      description: "Cobertura esencial para tu vehículo",
      price: 75,
      priceUnit: "/mo",
      badge: "Económico",
      category: "auto",
      features: [
        { text: "Responsabilidad civil", color: "blue-500" },
        { text: "Asistencia vial básica", color: "cyan-500" },
        { text: "Robo total", color: "indigo-500" },
        { text: "Defensa legal", color: "purple-500" }
      ]
    },
    {
      name: "AutoProtect Plus",
      description: "Protección ampliada para mayor tranquilidad",
      price: 110,
      priceUnit: "/mo",
      badge: "Recomendado",
      category: "auto",
      features: [
        { text: "Todo lo del plan Basic", color: "blue-500" },
        { text: "Daños materiales", color: "cyan-500" },
        { text: "Asistencia vial extendida", color: "indigo-500" },
        { text: "Auto sustituto hasta 15 días", color: "purple-500" }
      ]
    },
    {
      name: "AutoProtect Premium",
      description: "La máxima cobertura disponible para tu vehículo",
      price: 165,
      priceUnit: "/mo",
      badge: "Completo",
      category: "auto",
      features: [
        { text: "Cobertura total", color: "blue-500" },
        { text: "Asistencia premium 24/7", color: "cyan-500" },
        { text: "Auto sustituto hasta 30 días", color: "indigo-500" },
        { text: "Deducible cero en primer siniestro", color: "purple-500" }
      ]
    }
  ];
}

function getTravelPlans(): PlanProps[] {
  return [
    {
      name: "TravelGuard Essential",
      description: "Cobertura básica para viajes nacionales e internacionales",
      price: 45,
      priceUnit: "/viaje",
      badge: "Básico",
      category: "travel",
      features: [
        { text: "Emergencias médicas hasta $25,000", color: "indigo-500" },
        { text: "Cancelación de viaje hasta $1,000", color: "purple-500" },
        { text: "Equipaje perdido hasta $500", color: "blue-500" },
        { text: "Asistencia 24/7", color: "cyan-500" }
      ]
    },
    {
      name: "TravelGuard Plus",
      description: "Protección ideal para la mayoría de los viajeros",
      price: 75,
      priceUnit: "/viaje",
      badge: "Recomendado",
      category: "travel",
      features: [
        { text: "Emergencias médicas hasta $100,000", color: "indigo-500" },
        { text: "Cancelación de viaje hasta $2,500", color: "purple-500" },
        { text: "Equipaje perdido hasta $1,000", color: "blue-500" },
        { text: "Cobertura para deportes de aventura", color: "cyan-500" }
      ]
    },
    {
      name: "TravelGuard Premium",
      description: "Máxima cobertura para viajes sin preocupaciones",
      price: 120,
      priceUnit: "/viaje",
      badge: "Premium",
      category: "travel",
      features: [
        { text: "Emergencias médicas hasta $250,000", color: "indigo-500" },
        { text: "Cancelación de viaje hasta $5,000", color: "purple-500" },
        { text: "Equipaje perdido hasta $2,500", color: "blue-500" },
        { text: "Evacuación médica de emergencia", color: "cyan-500" }
      ]
    }
  ];
}

function getPetPlans(): PlanProps[] {
  return [
    {
      name: "PetCare Basic",
      description: "Cobertura esencial para tu mascota",
      price: 25,
      priceUnit: "/mo",
      badge: "Básico",
      category: "pet",
      features: [
        { text: "Consultas veterinarias", color: "purple-500" },
        { text: "Vacunas básicas", color: "pink-500" },
        { text: "Emergencias accidentales", color: "indigo-500" },
        { text: "Medicamentos recetados", color: "blue-500" }
      ]
    },
    {
      name: "PetCare Plus",
      description: "Cobertura ampliada para el bienestar de tu mascota",
      price: 40,
      priceUnit: "/mo",
      badge: "Recomendado",
      category: "pet",
      features: [
        { text: "Todo lo del plan Basic", color: "purple-500" },
        { text: "Enfermedades crónicas", color: "pink-500" },
        { text: "Cirugías necesarias", color: "indigo-500" },
        { text: "Terapias y rehabilitación", color: "blue-500" }
      ]
    },
    {
      name: "PetCare Premium",
      description: "Protección total para mascotas de todas las edades",
      price: 65,
      priceUnit: "/mo",
      badge: "Completo",
      category: "pet",
      features: [
        { text: "Cobertura total de salud", color: "purple-500" },
        { text: "Condiciones hereditarias", color: "pink-500" },
        { text: "Tratamientos alternativos", color: "indigo-500" },
        { text: "Atención dental incluida", color: "blue-500" }
      ]
    }
  ];
}

function getHealthPlans(): PlanProps[] {
  return [
    {
      name: "HealthEssential",
      description: "Cobertura básica para cuidados preventivos y emergencias",
      price: 150,
      priceUnit: "/mo",
      badge: "Básico",
      category: "health",
      features: [
        { text: "Consultas de atención primaria", color: "blue-500" },
        { text: "Emergencias médicas", color: "cyan-500" },
        { text: "Medicamentos genéricos", color: "indigo-500" },
        { text: "Servicios preventivos", color: "purple-500" }
      ]
    },
    {
      name: "HealthAdvantage",
      description: "Plan equilibrado con amplia red de especialistas",
      price: 270,
      priceUnit: "/mo",
      badge: "Recomendado",
      category: "health",
      features: [
        { text: "Todo lo del plan Essential", color: "blue-500" },
        { text: "Especialistas con copago reducido", color: "cyan-500" },
        { text: "Hospitalización", color: "indigo-500" },
        { text: "Terapias físicas y mentales", color: "purple-500" }
      ]
    },
    {
      name: "HealthPremium",
      description: "Cobertura completa para ti y tu familia",
      price: 390,
      priceUnit: "/mo",
      badge: "Premium",
      category: "health",
      features: [
        { text: "Acceso prioritario a especialistas", color: "blue-500" },
        { text: "Hospitalización en habitación privada", color: "cyan-500" },
        { text: "Medicamentos de marca y especializados", color: "indigo-500" },
        { text: "Tratamientos internacionales", color: "purple-500" }
      ]
    }
  ];
}

function getHomePlans(): PlanProps[] {
  return [
    {
      name: "HomeCover Basic",
      description: "Protección esencial para tu vivienda",
      price: 45,
      priceUnit: "/mo",
      badge: "Básico",
      category: "home",
      features: [
        { text: "Daños estructurales", color: "blue-500" },
        { text: "Incendio y eventos naturales", color: "cyan-500" },
        { text: "Robo de contenidos básicos", color: "indigo-500" },
        { text: "Responsabilidad civil básica", color: "purple-500" }
      ]
    },
    {
      name: "HomeCover Plus",
      description: "Cobertura ampliada para hogar y contenidos",
      price: 85,
      priceUnit: "/mo",
      badge: "Recomendado",
      category: "home",
      features: [
        { text: "Todo lo del plan Basic", color: "blue-500" },
        { text: "Daños por agua y eléctricos", color: "cyan-500" },
        { text: "Objetos de valor específicos", color: "indigo-500" },
        { text: "Asistencia hogar 24/7", color: "purple-500" }
      ]
    },
    {
      name: "HomeCover Premium",
      description: "La máxima protección para tu hogar y patrimonio",
      price: 120,
      priceUnit: "/mo",
      badge: "Completo",
      category: "home",
      features: [
        { text: "Cobertura todo riesgo", color: "blue-500" },
        { text: "Reemplazo a valor nuevo", color: "cyan-500" },
        { text: "Obras de arte y colecciones", color: "indigo-500" },
        { text: "Alojamiento temporal incluido", color: "purple-500" }
      ]
    }
  ];
}

// Helper function to get plans based on intent
function getMockPlansForIntent(intent: UserIntentType): PlanProps[] {
  switch (intent) {
    case 'auto_insurance':
      return getAutoPlans();
    case 'travel_insurance':
      return getTravelPlans();
    case 'pet_insurance':
      return getPetPlans();
    case 'health_insurance':
      return getHealthPlans();
    case 'home_insurance':
      return getHomePlans();
    default:
      return [];
  }
}