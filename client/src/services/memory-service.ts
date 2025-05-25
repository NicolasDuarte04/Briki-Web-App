/**
 * Servicio para mantener el contexto conversacional entre mensajes
 */

// Tipo para el contexto del usuario
export interface UserContext {
  // Contexto de viaje
  travel?: {
    destination?: string;
    duration?: string;
    startDate?: string;
    travelers?: number;
    purpose?: string;
  };
  
  // Contexto de auto
  auto?: {
    type?: 'car' | 'motorcycle' | 'scooter';
    make?: string;
    model?: string;
    year?: number;
    usage?: 'personal' | 'commercial' | 'ridesharing';
  };
  
  // Contexto de mascota
  pet?: {
    type?: 'dog' | 'cat' | 'other';
    breed?: string;
    age?: number;
    conditions?: string[];
  };
  
  // Contexto de salud
  health?: {
    age?: number;
    familyMembers?: number;
    preExistingConditions?: string[];
    previousCoverage?: boolean;
  };
  
  // Ubicación
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  
  // Preferencias generales
  preferences?: {
    budget?: 'low' | 'medium' | 'high';
    coverageLevel?: 'basic' | 'standard' | 'premium';
    paymentFrequency?: 'monthly' | 'yearly';
  };
}

// Clase singleton para gestionar el contexto del usuario
class MemoryService {
  private static instance: MemoryService;
  private userContext: UserContext = {};
  
  private constructor() {
    // Intentar recuperar contexto del localStorage si existe
    try {
      const savedContext = localStorage.getItem('briki_user_context');
      if (savedContext) {
        this.userContext = JSON.parse(savedContext);
      }
    } catch (error) {
      console.error('Error al recuperar contexto guardado:', error);
    }
  }
  
  public static getInstance(): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService();
    }
    return MemoryService.instance;
  }
  
  // Obtener todo el contexto del usuario
  public getContext(): UserContext {
    return this.userContext;
  }
  
  // Actualizar todo el contexto
  public updateContext(newContext: UserContext): void {
    this.userContext = {
      ...this.userContext,
      ...newContext
    };
    this.saveContext();
  }
  
  // Actualizar una sección específica del contexto
  public updateContextSection<K extends keyof UserContext>(
    section: K, 
    data: UserContext[K]
  ): void {
    this.userContext[section] = {
      ...this.userContext[section],
      ...data
    };
    this.saveContext();
  }
  
  // Limpiar todo el contexto
  public clearContext(): void {
    this.userContext = {};
    localStorage.removeItem('briki_user_context');
  }
  
  // Extraer información del mensaje del usuario
  public extractContextFromMessage(message: string): void {
    const lowercaseMessage = message.toLowerCase();
    
    // Detectar ubicaciones
    this.detectLocation(lowercaseMessage);
    
    // Detectar tipo de vehículo
    this.detectVehicleType(lowercaseMessage);
    
    // Detectar información de viaje
    this.detectTravelInfo(lowercaseMessage);
    
    // Detectar información de mascota
    this.detectPetInfo(lowercaseMessage);
    
    // Guardar el contexto actualizado
    this.saveContext();
  }
  
  // Guardar contexto en localStorage
  private saveContext(): void {
    try {
      localStorage.setItem('briki_user_context', JSON.stringify(this.userContext));
    } catch (error) {
      console.error('Error al guardar contexto:', error);
    }
  }
  
  // Métodos para extraer información específica
  
  private detectLocation(message: string): void {
    // Detectar países
    const countryPatterns = [
      { regex: /colombia|bogot[aá]|medell[ií]n|cali/i, country: 'Colombia' },
      { regex: /m[eé]xico|cdmx|guadalajara|monterrey/i, country: 'México' },
      { regex: /espa[ñn]a|madrid|barcelona|sevilla/i, country: 'España' },
      { regex: /argentina|buenos aires|cordoba|rosario/i, country: 'Argentina' },
      { regex: /per[uú]|lima|arequipa|cusco/i, country: 'Perú' },
      { regex: /chile|santiago|valparaiso|concepci[oó]n/i, country: 'Chile' },
      { regex: /estados unidos|usa|eeuu|miami|nueva york|los angeles/i, country: 'Estados Unidos' },
      { regex: /canad[aá]|toronto|montreal|vancouver/i, country: 'Canadá' },
      { regex: /europa|uni[oó]n europea|ue/i, country: 'Europa' },
      { regex: /am[eé]rica latina|latinoam[eé]rica|latam/i, country: 'América Latina' }
    ];
    
    for (const pattern of countryPatterns) {
      if (pattern.regex.test(message)) {
        this.updateContextSection('location', { country: pattern.country });
        break;
      }
    }
  }
  
  private detectVehicleType(message: string): void {
    if (/moto|scooter|vespa|motocicleta/i.test(message)) {
      this.updateContextSection('auto', { 
        type: 'motorcycle'
      });
    } else if (/coche|carro|auto|veh[ií]culo|autom[oó]vil/i.test(message)) {
      this.updateContextSection('auto', { 
        type: 'car'
      });
    }
    
    // Detectar marcas comunes
    const carBrands = [
      'toyota', 'honda', 'ford', 'chevrolet', 'bmw', 'mercedes', 'audi', 'volkswagen', 
      'nissan', 'hyundai', 'kia', 'mazda', 'subaru', 'lexus', 'ferrari', 'porsche',
      'renault', 'fiat', 'peugeot', 'citroen', 'seat', 'suzuki'
    ];
    
    for (const brand of carBrands) {
      if (message.toLowerCase().includes(brand)) {
        this.updateContextSection('auto', { make: brand.charAt(0).toUpperCase() + brand.slice(1) });
        break;
      }
    }
  }
  
  private detectTravelInfo(message: string): void {
    // Detectar duración
    const durationMatches = message.match(/(\d+)\s*(d[ií]as?|semanas?|meses?)/i);
    if (durationMatches) {
      const number = parseInt(durationMatches[1]);
      const unit = durationMatches[2].toLowerCase();
      
      let duration = '';
      if (unit.startsWith('d')) {
        duration = `${number} días`;
      } else if (unit.startsWith('s')) {
        duration = `${number} semanas`;
      } else if (unit.startsWith('m')) {
        duration = `${number} meses`;
      }
      
      if (duration) {
        this.updateContextSection('travel', { duration });
      }
    }
    
    // Detectar destinos comunes
    const destinations = [
      { regex: /europa|europeo/i, destination: 'Europa' },
      { regex: /asia|asi[aá]tico/i, destination: 'Asia' },
      { regex: /norteam[eé]rica|am[eé]rica del norte/i, destination: 'Norteamérica' },
      { regex: /latinoam[eé]rica|am[eé]rica latina/i, destination: 'Latinoamérica' },
      { regex: /caribe|caribbe?[aá]n/i, destination: 'Caribe' },
      { regex: /mundial|todo el mundo|international/i, destination: 'Mundial' },
    ];
    
    for (const dest of destinations) {
      if (dest.regex.test(message)) {
        this.updateContextSection('travel', { destination: dest.destination });
        break;
      }
    }
  }
  
  private detectPetInfo(message: string): void {
    // Detectar tipo de mascota
    if (/perro|canino|cachorro/i.test(message)) {
      this.updateContextSection('pet', { type: 'dog' });
    } else if (/gato|felino|minino/i.test(message)) {
      this.updateContextSection('pet', { type: 'cat' });
    }
    
    // Detectar edad de la mascota
    const ageMatches = message.match(/(\d+)\s*(?:años?|meses?|a[ñn]os?)/i);
    if (ageMatches && this.userContext.pet) {
      const age = parseInt(ageMatches[1]);
      this.updateContextSection('pet', { age });
    }
  }
}

export default MemoryService.getInstance();