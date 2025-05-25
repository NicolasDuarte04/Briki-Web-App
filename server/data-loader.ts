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
    'viaje': ['viajes internacionales', 'viaje'],
    'auto': ['auto', 'coche'],
    'mascota': ['perros', 'gatos', 'mascotas'],
    'salud': ['salud', 'médico']
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