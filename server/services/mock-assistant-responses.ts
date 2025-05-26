import { MockInsurancePlan } from '../data-loader';

/**
 * Interfaz para respuestas mock del asistente
 */
export interface MockAssistantResponse {
  message: string;
  suggestedPlans?: MockInsurancePlan[];
}

/**
 * Analyze if the user message indicates they want insurance recommendations
 */
function shouldShowInsurancePlans(userMessage: string): boolean {
  const message = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Saludos y conversación general - NO mostrar planes
  const greetings = ['hola', 'hello', 'hi', 'buenas', 'buenos dias', 'buenas tardes', 'como estas', 'que tal', 'saludos'];
  if (greetings.some(greeting => message.includes(greeting)) && message.length < 50) {
    return false;
  }
  
  // Palabras que indican necesidad de seguro - SÍ mostrar planes
  const insuranceIntentKeywords = [
    'seguro', 'seguros', 'asegurar', 'proteger', 'cobertura', 'proteccion',
    'compre', 'tengo un', 'tengo una', 'mi carro', 'mi auto', 'mi perro', 'mi gato',
    'viajo', 'viaje', 'viajar', 'vacaciones', 'mascota', 'vespa', 'moto', 'vehiculo',
    'necesito', 'busco', 'quiero', 'recomienda', 'opciones', 'planes'
  ];
  
  return insuranceIntentKeywords.some(keyword => message.includes(keyword));
}

/**
 * Genera respuestas mock según el tipo de seguro y la consulta
 * @param category Categoría de seguro
 * @param query Consulta del usuario
 * @param plans Planes de seguro disponibles
 * @returns Respuesta mock del asistente
 */
export function generateMockResponse(
  category: string | undefined,
  query: string,
  plans: MockInsurancePlan[]
): MockAssistantResponse {
  // Primero verificar si el usuario realmente quiere recomendaciones de seguros
  if (!shouldShowInsurancePlans(query)) {
    return {
      message: "¡Hola! 👋 Soy Briki, tu asistente de seguros. Estoy aquí para ayudarte a encontrar la protección perfecta para lo que más te importa. ¿En qué puedo ayudarte? ¿Tienes algo específico que te gustaría asegurar?"
    };
  }

  // Si no hay categoría específica, intentar identificarla por la consulta
  if (!category) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('moto') || lowerQuery.includes('carro') || lowerQuery.includes('auto') || 
        lowerQuery.includes('vehículo') || lowerQuery.includes('coche') || lowerQuery.includes('scooter')) {
      category = 'auto';
    } else if (lowerQuery.includes('viaje') || lowerQuery.includes('viajar') || lowerQuery.includes('vacaciones') || 
               lowerQuery.includes('turismo') || lowerQuery.includes('hotel')) {
      category = 'travel';
    } else if (lowerQuery.includes('mascota') || lowerQuery.includes('perro') || lowerQuery.includes('gato') || 
               lowerQuery.includes('veterinario')) {
      category = 'pet';
    } else if (lowerQuery.includes('salud') || lowerQuery.includes('médico') || lowerQuery.includes('hospital') || 
               lowerQuery.includes('doctor') || lowerQuery.includes('clínica')) {
      category = 'health';
    }
  }

  // Filtrar planes por la categoría identificada
  let relevantPlans: MockInsurancePlan[] = [];
  if (category) {
    relevantPlans = plans.filter(plan => plan.category === category);
  } else {
    // Si no se pudo identificar una categoría, mostrar planes variados
    // Tomar hasta 2 planes de cada categoría
    const categories = ['travel', 'auto', 'pet', 'health'];
    categories.forEach(cat => {
      const categoryPlans = plans.filter(plan => plan.category === cat).slice(0, 2);
      relevantPlans = [...relevantPlans, ...categoryPlans];
    });
  }

  // Limitar a 3 planes como máximo
  relevantPlans = relevantPlans.slice(0, 3);

  // Generar respuesta según la categoría
  let message = '';
  switch (category) {
    case 'auto':
      message = generateAutoInsuranceResponse(query, relevantPlans);
      break;
    case 'travel':
      message = generateTravelInsuranceResponse(query, relevantPlans);
      break;
    case 'pet':
      message = generatePetInsuranceResponse(query, relevantPlans);
      break;
    case 'health':
      message = generateHealthInsuranceResponse(query, relevantPlans);
      break;
    default:
      message = generateGenericResponse(query, relevantPlans);
  }

  return {
    message,
    suggestedPlans: relevantPlans.length > 0 ? relevantPlans : undefined
  };
}

/**
 * Genera respuesta mock para seguros de auto
 */
function generateAutoInsuranceResponse(query: string, plans: MockInsurancePlan[]): string {
  const lowercaseQuery = query.toLowerCase();
  
  // Detectar si busca seguro para moto o scooter
  if (lowercaseQuery.includes('moto') || lowercaseQuery.includes('scooter') || lowercaseQuery.includes('vespa')) {
    return `¡Claro! Para tu moto o scooter tengo excelentes opciones. Los seguros para estos vehículos suelen ser más económicos que los de auto y te ofrecen protección esencial.

Basado en tu consulta, te recomendaría un plan que incluya responsabilidad civil, protección contra robo y asistencia en vías urbanas. ${plans.length > 0 ? `El plan "${plans[0].name}" de ${plans[0].provider} podría ser perfecto para ti, con un precio desde ${plans[0].basePrice} ${plans[0].currency} ${plans[0].duration}.` : ''}

¿Usas tu moto principalmente en ciudad o también para viajes largos? Esto nos ayudaría a afinar aún más la recomendación.`;
  }
  
  // Detectar si busca algo económico
  if (lowercaseQuery.includes('económico') || lowercaseQuery.includes('barato') || 
      lowercaseQuery.includes('precio') || lowercaseQuery.includes('costo')) {
    return `Entiendo que buscas un seguro de auto que se ajuste a tu presupuesto. Los seguros básicos ofrecen una buena protección a un precio accesible.

Te recomendaría un plan que al menos incluya responsabilidad civil (que es obligatoria) y asistencia en carretera. ${plans.length > 0 ? `El plan "${plans[0].name}" de ${plans[0].provider} ofrece esta cobertura desde ${plans[0].basePrice} ${plans[0].currency} ${plans[0].duration}.` : ''}

¿Te gustaría conocer qué coberturas adicionales podrías agregar sin aumentar demasiado el costo?`;
  }
  
  // Respuesta general para seguros de auto
  return `¡Hola! Para tu vehículo tenemos varias opciones de seguro que se adaptan a diferentes necesidades y presupuestos.

Un buen seguro de auto debe incluir responsabilidad civil, protección contra robo y asistencia en carretera. ${plans.length > 0 ? `Te recomendaría revisar el plan "${plans[0].name}" de ${plans[0].provider}, que ofrece una excelente relación calidad-precio.` : ''}

¿Podrías contarme más sobre tu vehículo y cómo lo utilizas para darte una recomendación más precisa?`;
}

/**
 * Genera respuesta mock para seguros de viaje
 */
function generateTravelInsuranceResponse(query: string, plans: MockInsurancePlan[]): string {
  const lowercaseQuery = query.toLowerCase();
  
  // Detectar si menciona Latinoamérica
  if (lowercaseQuery.includes('latinoamérica') || lowercaseQuery.includes('latam') || 
      lowercaseQuery.includes('américa latina') || lowercaseQuery.includes('sudamérica')) {
    return `¡Perfecto! Para tu viaje por Latinoamérica, es importante contar con un seguro que te brinde asistencia médica y cobertura en toda la región.

Te recomendaría un plan que incluya atención médica en español, asistencia en emergencias 24/7 y cobertura para cancelación de viaje. ${plans.length > 0 ? `El plan "${plans[0].name}" de ${plans[0].provider} está diseñado específicamente para viajes en la región y cuesta desde ${plans[0].basePrice} ${plans[0].currency}.` : ''}

¿Ya tienes definida la duración de tu viaje? Esto nos ayudaría a ajustar mejor la recomendación.`;
  }
  
  // Detectar si es viaje familiar
  if (lowercaseQuery.includes('familia') || lowercaseQuery.includes('niños') || 
      lowercaseQuery.includes('hijos') || lowercaseQuery.includes('familiar')) {
    return `Para viajes familiares, recomiendo planes que ofrezcan cobertura para todos los miembros de la familia y contemplen necesidades específicas como atención pediátrica.

Un buen seguro familiar debe incluir atención médica para todos, asistencia para niños y adultos mayores, y protección de equipaje. ${plans.length > 0 ? `El plan "${plans[0].name}" de ${plans[0].provider} ofrece estas coberturas desde ${plans[0].basePrice} ${plans[0].currency}.` : ''}

¿Cuántas personas viajarán y a qué destino se dirigen? Así podré afinar más la recomendación.`;
  }
  
  // Respuesta general para seguros de viaje
  return `¡Hola! Para tu próximo viaje, es esencial contar con un buen seguro que te proteja ante cualquier imprevisto.

Recomiendo planes que incluyan cobertura médica internacional, asistencia 24/7, protección de equipaje y cobertura por cancelación. ${plans.length > 0 ? `El plan "${plans[0].name}" de ${plans[0].provider} ofrece estas protecciones desde ${plans[0].basePrice} ${plans[0].currency}.` : ''}

¿Podrías contarme más sobre tu destino y la duración de tu viaje? Así podré recomendarte el plan más adecuado.`;
}

/**
 * Genera respuesta mock para seguros de mascotas
 */
function generatePetInsuranceResponse(query: string, plans: MockInsurancePlan[]): string {
  const lowercaseQuery = query.toLowerCase();
  
  // Detectar si es para perro
  if (lowercaseQuery.includes('perro') || lowercaseQuery.includes('canino')) {
    return `¡Me encanta que quieras proteger a tu perro! Los seguros para perros te ayudan a cubrir gastos veterinarios inesperados y atención preventiva.

Recomiendo planes que incluyan consultas veterinarias, vacunas anuales, atención por accidentes y medicamentos. ${plans.length > 0 ? `El plan "${plans[0].name}" de ${plans[0].provider} ofrece una cobertura completa desde ${plans[0].basePrice} ${plans[0].currency} ${plans[0].duration}.` : ''}

¿Qué edad tiene tu perro y de qué raza es? Esto nos ayudaría a encontrar el plan perfecto.`;
  }
  
  // Detectar si es para gato
  if (lowercaseQuery.includes('gato') || lowercaseQuery.includes('felino')) {
    return `¡Los gatos también merecen la mejor protección! Un seguro para tu gatito te ayudará a mantenerlo saludable y atender cualquier emergencia.

Recomiendo planes que incluyan consultas veterinarias, vacunas, atención por accidentes y enfermedades comunes en felinos. ${plans.length > 0 ? `El plan "${plans[0].name}" de ${plans[0].provider} está diseñado para cubrir estas necesidades desde ${plans[0].basePrice} ${plans[0].currency} ${plans[0].duration}.` : ''}

¿Tu gato es indoor o outdoor? Esto puede influir en el tipo de cobertura más adecuada.`;
  }
  
  // Respuesta general para seguros de mascotas
  return `¡Hola! Es maravilloso que quieras proteger la salud de tu mascota con un seguro. Estos planes te ayudan a cubrir gastos veterinarios y atención preventiva.

Un buen seguro para mascotas debe incluir consultas veterinarias, vacunas, atención por accidentes y cobertura para medicamentos. ${plans.length > 0 ? `Te recomendaría el plan "${plans[0].name}" de ${plans[0].provider}, que ofrece estas coberturas desde ${plans[0].basePrice} ${plans[0].currency} ${plans[0].duration}.` : ''}

¿Qué tipo de mascota tienes y qué edad tiene? Con esta información podré darte una recomendación más personalizada.`;
}

/**
 * Genera respuesta mock para seguros de salud
 */
function generateHealthInsuranceResponse(query: string, plans: MockInsurancePlan[]): string {
  const lowercaseQuery = query.toLowerCase();
  
  // Detectar si menciona familia
  if (lowercaseQuery.includes('familia') || lowercaseQuery.includes('familiar') || 
      lowercaseQuery.includes('hijos') || lowercaseQuery.includes('niños')) {
    return `Para proteger la salud de toda tu familia, recomiendo un plan integral que cubra las necesidades de cada miembro.

Un buen seguro familiar debe incluir consultas con especialistas, hospitalización, medicamentos, y servicios preventivos para todas las edades. ${plans.length > 0 ? `El plan "${plans[0].name}" de ${plans[0].provider} ofrece estas coberturas desde ${plans[0].basePrice} ${plans[0].currency} ${plans[0].duration}.` : ''}

¿Cuántas personas conforman tu grupo familiar y qué rango de edades tienen? Esto me ayudará a afinar la recomendación.`;
  }
  
  // Detectar si menciona hospitalización
  if (lowercaseQuery.includes('hospital') || lowercaseQuery.includes('hospitalización') || 
      lowercaseQuery.includes('internación') || lowercaseQuery.includes('clínica')) {
    return `Si buscas un seguro con buena cobertura hospitalaria, es importante elegir un plan que ofrezca amplios beneficios en este aspecto.

Recomiendo planes que incluyan hospitalización en habitación individual, cirugías, cuidados intensivos y medicamentos hospitalarios. ${plans.length > 0 ? `El plan "${plans[0].name}" de ${plans[0].provider} ofrece una excelente cobertura hospitalaria desde ${plans[0].basePrice} ${plans[0].currency} ${plans[0].duration}.` : ''}

¿Buscas esta cobertura para ti o para toda tu familia? ¿Tienes alguna condición médica específica que requiera atención especializada?`;
  }
  
  // Respuesta general para seguros de salud
  return `¡Hola! Contar con un buen seguro de salud es una decisión muy importante para tu bienestar y tranquilidad.

Un plan completo debe incluir consultas médicas, especialistas, hospitalización, medicamentos y servicios preventivos. ${plans.length > 0 ? `Te recomendaría revisar el plan "${plans[0].name}" de ${plans[0].provider}, que ofrece una cobertura integral desde ${plans[0].basePrice} ${plans[0].currency} ${plans[0].duration}.` : ''}

¿Podrías contarme más sobre tus necesidades específicas de salud? Así podré recomendarte el plan más adecuado para ti.`;
}

/**
 * Genera respuesta genérica cuando no se identifica una categoría específica
 */
function generateGenericResponse(query: string, plans: MockInsurancePlan[]): string {
  return `¡Hola! Gracias por contactar con Briki, tu asistente de seguros. Estoy aquí para ayudarte a encontrar el seguro que mejor se adapte a tus necesidades.

Ofrecemos seguros en varias categorías: auto, viaje, mascotas y salud. ${plans.length > 0 ? `Por ejemplo, tenemos el plan "${plans[0].name}" para ${plans[0].category === 'auto' ? 'vehículos' : plans[0].category === 'travel' ? 'viajes' : plans[0].category === 'pet' ? 'mascotas' : 'salud'}.` : ''}

¿Podrías contarme más específicamente qué tipo de seguro estás buscando? Así podré darte recomendaciones más precisas.`;
}