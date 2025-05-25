import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { InsuranceCategory, INSURANCE_CATEGORIES } from '@shared/schema';

// Para ESM, necesitamos calcular __dirname ya que no está disponible por defecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Interfaz para los planes de seguro mock
 */
export interface MockInsurancePlan {
  id: string;
  category: InsuranceCategory;
  provider: string;
  name: string;
  description: string;
  basePrice: number;
  currency: string;
  duration: string;
  coverageAmount: number;
  coverage: Record<string, any>;
  features: string[];
  deductible: number;
  exclusions: string[];
  addOns: string[];
  tags: string[];
  rating: number;
  status: 'draft' | 'active' | 'archived';
}

/**
 * Carga todos los planes de seguro mock de los archivos JSON
 * @returns Array de planes de seguro
 */
export function loadMockInsurancePlans(): MockInsurancePlan[] {
  const categories = Object.values(INSURANCE_CATEGORIES);
  const plans: MockInsurancePlan[] = [];
  
  for (const category of categories) {
    try {
      // Construir la ruta a la carpeta de datos
      const categoryPath = path.join(__dirname, 'data', category);
      
      console.log(`Checking directory: ${categoryPath}`);
      
      // Verificar si la carpeta existe
      if (!fs.existsSync(categoryPath)) {
        console.warn(`Directory not found: ${categoryPath}`);
        continue;
      }
      
      // Leer todos los archivos JSON en la carpeta
      const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.json'));
      console.log(`Found ${files.length} files in ${category} category`);
      
      for (const file of files) {
        try {
          const filePath = path.join(categoryPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const plan = JSON.parse(fileContent) as MockInsurancePlan;
          
          // Validar que el plan tiene la categoría correcta
          if (plan.category === category) {
            plans.push(plan);
            console.log(`Loaded plan: ${plan.name} (${plan.category})`);
          } else {
            console.warn(`Plan in file ${file} has incorrect category: ${plan.category}, expected: ${category}`);
          }
        } catch (error) {
          console.error(`Error loading plan from file ${file}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error loading plans for category ${category}:`, error);
    }
  }
  
  return plans;
}

/**
 * Filtra planes por categoría
 * @param plans Array de planes a filtrar
 * @param category Categoría por la que filtrar
 * @returns Array de planes filtrados
 */
export function filterPlansByCategory(
  plans: MockInsurancePlan[], 
  category: InsuranceCategory
): MockInsurancePlan[] {
  return plans.filter(plan => plan.category === category);
}

/**
 * Filtra planes por tags
 * @param plans Array de planes a filtrar
 * @param tags Tags por los que filtrar
 * @returns Array de planes filtrados
 */
export function filterPlansByTags(
  plans: MockInsurancePlan[], 
  tags: string[]
): MockInsurancePlan[] {
  if (!tags || tags.length === 0) return plans;
  
  // Convertir los acentos a caracteres normales para manejar 'económico' vs 'economico'
  const normalizeString = (str: string): string => {
    return str.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };
  
  // Normalizar los tags de búsqueda
  const normalizedSearchTags = tags.map(tag => normalizeString(tag));
  
  return plans.filter(plan => {
    if (!plan.tags) return false;
    
    // Normalizar los tags del plan
    const normalizedPlanTags = plan.tags.map(tag => normalizeString(tag));
    
    // Buscar coincidencias entre los tags normalizados
    return normalizedSearchTags.some(searchTag => 
      normalizedPlanTags.some(planTag => planTag.includes(searchTag))
    );
  });
}

/**
 * Filtra planes por necesidad del usuario
 * @param plans Array de planes a filtrar
 * @param need Necesidad del usuario (económico, completo, familia, etc.)
 * @returns Array de planes filtrados
 */
export function filterPlansByUserNeed(
  plans: MockInsurancePlan[], 
  need: string
): MockInsurancePlan[] {
  if (!need) return plans;
  
  const lowercaseNeed = need.toLowerCase();
  
  // Mapeo de necesidades comunes a tags
  const needToTags: Record<string, string[]> = {
    'económico': ['económico', 'básico'],
    'completo': ['completo', 'premium'],
    'familia': ['familia', 'familiar'],
    'premium': ['premium', 'exclusivo'],
    'básico': ['básico', 'económico'],
    'viaje': ['viajes internacionales', 'viaje', 'vacaciones', 'turismo'],
    'auto': ['auto', 'coche', 'vehículo', 'carro'],
    'moto': ['moto', 'scooter', 'vespa', 'motocicleta'],
    'mascota': ['perros', 'gatos', 'mascotas', 'animal', 'veterinario'],
    'salud': ['salud', 'médico', 'hospital', 'clínica', 'hospitalización'],
    'colombia': ['colombia', 'colombiano'],
    'latinoamérica': ['latinoamérica', 'latam', 'américa latina'],
    'sin deducible': ['sin deducible', 'cero deducible']
  };
  
  const tagsToSearch = needToTags[lowercaseNeed] || [lowercaseNeed];
  
  return plans.filter(plan => {
    if (!plan.tags) return false;
    return tagsToSearch.some(tag => 
      plan.tags.some(planTag => planTag.toLowerCase().includes(tag))
    );
  });
}

/**
 * Interfaz para los filtros avanzados de planes
 */
export interface PlanFilters {
  minPrice?: number;
  maxPrice?: number;
  minCoverage?: number;
  maxCoverage?: number;
  minDeductible?: number;
  maxDeductible?: number;
  region?: string;
  currency?: string;
  providers?: string[];
  minRating?: number;
  status?: 'draft' | 'active' | 'archived';
}

/**
 * Filtra planes por atributos específicos como precio, cobertura, deducible, etc.
 * @param plans Array de planes a filtrar
 * @param filters Criterios de filtrado
 * @returns Array de planes filtrados
 */
export function filterPlansByAttributes(
  plans: MockInsurancePlan[],
  filters: PlanFilters
): MockInsurancePlan[] {
  if (!filters || Object.keys(filters).length === 0) return plans;

  return plans.filter(plan => {
    // Filtrar por rango de precio
    if (filters.minPrice !== undefined && plan.basePrice < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && plan.basePrice > filters.maxPrice) {
      return false;
    }

    // Filtrar por rango de cobertura
    if (filters.minCoverage !== undefined && plan.coverageAmount < filters.minCoverage) {
      return false;
    }
    if (filters.maxCoverage !== undefined && plan.coverageAmount > filters.maxCoverage) {
      return false;
    }

    // Filtrar por rango de deducible
    if (filters.minDeductible !== undefined && plan.deductible < filters.minDeductible) {
      return false;
    }
    if (filters.maxDeductible !== undefined && plan.deductible > filters.maxDeductible) {
      return false;
    }

    // Filtrar por moneda
    if (filters.currency && plan.currency !== filters.currency) {
      return false;
    }

    // Filtrar por proveedor
    if (filters.providers && filters.providers.length > 0) {
      if (!filters.providers.includes(plan.provider)) {
        return false;
      }
    }

    // Filtrar por calificación mínima
    if (filters.minRating !== undefined && plan.rating < filters.minRating) {
      return false;
    }

    // Filtrar por estado del plan
    if (filters.status && plan.status !== filters.status) {
      return false;
    }

    // Filtrar por región/país
    if (filters.region) {
      const regionLower = filters.region.toLowerCase();
      // Buscar la región en tags
      const hasRegionTag = plan.tags.some(tag => 
        tag.toLowerCase().includes(regionLower)
      );
      
      if (!hasRegionTag) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Prepara un contexto con planes para enviar al asistente IA
 * @param plans Array de planes a incluir en el contexto
 * @param maxPlans Número máximo de planes a incluir
 * @returns Texto con la información de los planes para el contexto
 */
export function prepareAIContext(
  plans: MockInsurancePlan[], 
  maxPlans: number = 3
): string {
  // Limitar el número de planes para no sobrecargar el contexto
  const limitedPlans = plans.slice(0, maxPlans);
  
  // Crear un contexto estructurado
  let context = `Información de planes de seguro disponibles:\n\n`;
  
  limitedPlans.forEach((plan, index) => {
    context += `Plan ${index + 1}: ${plan.name} (${plan.provider})\n`;
    context += `Categoría: ${plan.category}\n`;
    context += `Descripción: ${plan.description}\n`;
    context += `Precio: ${plan.basePrice} ${plan.currency} ${plan.duration}\n`;
    context += `Cobertura: ${plan.coverageAmount}\n`;
    context += `Deducible: ${plan.deductible}\n`;
    
    // Características principales
    context += `Características: ${plan.features.join(', ')}\n`;
    
    // Exclusiones importantes
    if (plan.exclusions && plan.exclusions.length > 0) {
      context += `Exclusiones: ${plan.exclusions.join(', ')}\n`;
    }
    
    // Añadir una separación entre planes
    context += `\n${'-'.repeat(50)}\n\n`;
  });
  
  return context;
}