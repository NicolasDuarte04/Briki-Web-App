interface UserContext {
  location?: {
    country?: string;
    city?: string;
  };
  auto?: {
    type?: string;
    make?: string;
    model?: string;
    year?: number;
  };
  travel?: {
    destination?: string;
    duration?: string;
    date?: string;
    travelers?: number;
  };
  pet?: {
    type?: string;
    age?: number;
    breed?: string;
  };
  health?: {
    age?: number;
    conditions?: string[];
  };
}

/**
 * Extract context information from user message
 */
export function extractContextFromMessage(message: string, currentContext: UserContext = {}): UserContext {
  const lowerMessage = message.toLowerCase();
  const context = { ...currentContext };

  // Auto/Vehicle detection
  const autoKeywords = {
    'vespa': { type: 'motorcycle', make: 'Vespa' },
    'moto': { type: 'motorcycle' },
    'scooter': { type: 'motorcycle' },
    'carro': { type: 'car' },
    'auto': { type: 'car' },
    'toyota': { type: 'car', make: 'Toyota' },
    'honda': { type: 'car', make: 'Honda' },
    'chevrolet': { type: 'car', make: 'Chevrolet' },
  };

  Object.entries(autoKeywords).forEach(([keyword, data]) => {
    if (lowerMessage.includes(keyword)) {
      context.auto = { ...context.auto, ...data };
    }
  });

  // Travel detection
  const travelKeywords = ['viaje', 'viajar', 'europa', 'internacional', 'vacaciones'];
  if (travelKeywords.some(keyword => lowerMessage.includes(keyword))) {
    if (!context.travel) context.travel = {};
    
    if (lowerMessage.includes('europa')) context.travel.destination = 'Europa';
    if (lowerMessage.includes('semana')) context.travel.duration = '1-2 semanas';
  }

  // Pet detection
  const petKeywords = {
    'perro': { type: 'dog' },
    'gato': { type: 'cat' },
    'golden': { type: 'dog', breed: 'Golden Retriever' },
    'labrador': { type: 'dog', breed: 'Labrador' },
  };

  Object.entries(petKeywords).forEach(([keyword, data]) => {
    if (lowerMessage.includes(keyword)) {
      context.pet = { ...context.pet, ...data };
    }
  });

  // Location detection
  const locationKeywords = {
    'bogotá': { country: 'Colombia', city: 'Bogotá' },
    'colombia': { country: 'Colombia' },
    'medellín': { country: 'Colombia', city: 'Medellín' },
    'cali': { country: 'Colombia', city: 'Cali' },
  };

  Object.entries(locationKeywords).forEach(([keyword, data]) => {
    if (lowerMessage.includes(keyword)) {
      context.location = { ...context.location, ...data };
    }
  });

  return context;
}

/**
 * Format user context for display
 */
export function formatUserContext(context: UserContext): string {
  const items = [];

  if (context.location?.country) {
    const location = context.location.city 
      ? `${context.location.city}, ${context.location.country}`
      : context.location.country;
    items.push(`Ubicación: ${location}`);
  }

  if (context.auto?.type) {
    const vehicleType = context.auto.type === 'motorcycle' ? 'Moto/Scooter' : 'Auto';
    const vehicleMake = context.auto.make ? ` ${context.auto.make}` : '';
    items.push(`Vehículo: ${vehicleType}${vehicleMake}`);
  }

  if (context.travel?.destination) {
    const duration = context.travel.duration ? ` por ${context.travel.duration}` : '';
    items.push(`Viaje: ${context.travel.destination}${duration}`);
  }

  if (context.pet?.type) {
    const petType = context.pet.type === 'dog' ? 'Perro' : context.pet.type === 'cat' ? 'Gato' : 'Mascota';
    const petBreed = context.pet.breed ? ` ${context.pet.breed}` : '';
    items.push(`Mascota: ${petType}${petBreed}`);
  }

  return items.join(', ');
}

/**
 * Detect if message is a generic greeting
 */
export function isGenericGreeting(message: string): boolean {
  const greetings = [
    'hola', 'hi', 'hello', 'buenas', 'buenos dias', 'buenas tardes', 
    'que tal', 'como estas', 'saludos', 'hey'
  ];
  const cleanMessage = message.toLowerCase().trim();
  return greetings.some(greeting => 
    cleanMessage === greeting || 
    (cleanMessage.includes(greeting) && cleanMessage.length < 25)
  );
}

/**
 * Determine if message shows intent for insurance plans
 */
export function hasInsuranceIntent(message: string): boolean {
  const intentKeywords = [
    'seguro', 'seguros', 'protección', 'cobertura', 'plan', 'planes',
    'necesito', 'busco', 'quiero', 'recomienda', 'opciones',
    'compré', 'tengo', 'mi carro', 'mi auto', 'mi perro', 'viajo'
  ];
  
  const cleanMessage = message.toLowerCase();
  return intentKeywords.some(keyword => cleanMessage.includes(keyword));
}