import { MockInsurancePlan } from "../data-loader";

// Términos clave por categoría de seguro
const categoryKeywords: Record<string, string[]> = {
  'travel': [
    'viaje', 'viajar', 'viajero', 'vacaciones', 'turismo', 'turista', 'hotel', 
    'avión', 'vuelo', 'internacional', 'país', 'extranjero', 'pasaporte',
    'equipaje', 'maleta', 'cancelación', 'retraso', 'asistencia'
  ],
  'auto': [
    'auto', 'carro', 'coche', 'vehículo', 'automóvil', 'conductor', 'manejar', 
    'conducir', 'tránsito', 'accidente', 'colisión', 'choque', 'daño', 
    'responsabilidad civil', 'terceros', 'robo', 'grúa', 'asistencia vial'
  ],
  'pet': [
    'mascota', 'perro', 'gato', 'animal', 'veterinario', 'clínica veterinaria', 
    'vacuna', 'enfermedad', 'accidente', 'tratamiento', 'medicamento', 'cirugía',
    'atención médica', 'emergencia veterinaria', 'consulta'
  ],
  'health': [
    'salud', 'médico', 'doctor', 'hospital', 'clínica', 'enfermedad', 'accidente',
    'tratamiento', 'medicamento', 'cirugía', 'consulta', 'especialista',
    'emergencia', 'ambulancia', 'hospitalización', 'examen', 'diagnóstico'
  ]
};

// Términos de atributos importantes
const attributeKeywords: Record<string, string[]> = {
  'económico': ['económico', 'barato', 'asequible', 'accesible', 'bajo costo', 'precio bajo', 'básico'],
  'premium': ['premium', 'completo', 'exclusivo', 'lujo', 'top', 'máxima cobertura', 'alta gama'],
  'sin deducible': ['sin deducible', 'cero deducible', '0 deducible', 'deducible cero'],
  'familiar': ['familia', 'familiar', 'hijos', 'niños', 'padres', 'grupo familiar'],
  'cobertura completa': ['cobertura completa', 'cobertura total', 'todo incluido', '100% cobertura'],
  'colombia': ['colombia', 'colombiano', 'bogotá', 'medellín', 'cali'],
  'latinoamérica': ['latinoamérica', 'latam', 'américa latina', 'sudamérica', 'centroamérica'],
  'internacional': ['internacional', 'global', 'mundial', 'extranjero', 'fuera del país'],
  'asistencia 24/7': ['24/7', '24 horas', 'todo el día', 'asistencia permanente']
};

// Términos específicos para vehículos
const vehicleKeywords: Record<string, string[]> = {
  'moto': ['moto', 'motocicleta', 'scooter', 'vespa', 'ciclomotor'],
  'carro': ['carro', 'auto', 'coche', 'automóvil', 'vehículo'],
  'camioneta': ['camioneta', 'suv', 'pickup', 'todo terreno'],
  'comercial': ['comercial', 'furgoneta', 'camión', 'transporte']
};

/**
 * Realiza una búsqueda semántica en los planes de seguro
 * @param query Texto de la consulta del usuario
 * @param plans Lista de planes de seguro disponibles
 * @param limit Número máximo de resultados a retornar
 * @returns Planes de seguro ordenados por relevancia
 */
export function semanticSearch(
  query: string,
  plans: MockInsurancePlan[],
  limit: number = 5
): MockInsurancePlan[] {
  // Normalizar la consulta
  const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Calcular relevancia para cada plan
  const scoredPlans = plans.map(plan => {
    let score = 0;
    
    // Verificar coincidencias por categoría
    const categoryMatches = matchKeywords(normalizedQuery, categoryKeywords[plan.category]);
    score += categoryMatches * 3; // Mayor peso para coincidencias de categoría
    
    // Verificar coincidencias por atributos
    Object.entries(attributeKeywords).forEach(([attribute, keywords]) => {
      const matches = matchKeywords(normalizedQuery, keywords);
      
      // Verificar si el plan tiene tags relacionados con este atributo
      const hasAttributeTag = plan.tags.some(tag => {
        const normalizedTag = tag.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return keywords.some(keyword => normalizedTag.includes(keyword));
      });
      
      // Aumentar el puntaje si hay coincidencias y el plan tiene ese atributo
      if (matches > 0 && hasAttributeTag) {
        score += matches * 2;
      } else if (matches > 0) {
        score += matches;
      }
    });
    
    // Verificar coincidencias para vehículos específicos
    if (plan.category === 'auto') {
      Object.entries(vehicleKeywords).forEach(([vehicle, keywords]) => {
        const matches = matchKeywords(normalizedQuery, keywords);
        
        // Verificar si el plan tiene tags relacionados con este tipo de vehículo
        const hasVehicleTag = plan.tags.some(tag => {
          const normalizedTag = tag.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return keywords.some(keyword => normalizedTag.includes(keyword) || normalizedTag === keyword);
        });
        
        // Ajustar el puntaje basado en coincidencias y tags
        if (matches > 0 && hasVehicleTag) {
          score += matches * 3; // Mayor peso para coincidencias exactas
        } else if (matches > 0) {
          score += matches;
        }
      });
    }
    
    // Coincidencias en nombre, descripción y características
    score += countMatches(normalizedQuery, plan.name.toLowerCase()) * 2;
    score += countMatches(normalizedQuery, plan.description.toLowerCase());
    
    plan.features.forEach(feature => {
      score += countMatches(normalizedQuery, feature.toLowerCase()) * 0.5;
    });
    
    // Retornar el plan con su puntaje
    return { plan, score };
  });
  
  // Ordenar por puntaje y retornar los planes más relevantes
  return scoredPlans
    .filter(item => item.score > 0) // Solo incluir planes con alguna relevancia
    .sort((a, b) => b.score - a.score) // Ordenar de mayor a menor puntaje
    .slice(0, limit) // Limitar el número de resultados
    .map(item => item.plan); // Extraer solo los planes
}

/**
 * Cuenta cuántas palabras clave de la lista aparecen en el texto
 * @param text Texto donde buscar
 * @param keywords Lista de palabras clave
 * @returns Número de coincidencias encontradas
 */
function matchKeywords(text: string, keywords: string[]): number {
  if (!keywords) return 0;
  
  let matches = 0;
  keywords.forEach(keyword => {
    if (text.includes(keyword)) {
      matches++;
    }
  });
  
  return matches;
}

/**
 * Cuenta las apariciones de palabras de la consulta en el texto
 * @param query Consulta del usuario
 * @param text Texto donde buscar
 * @returns Número de coincidencias
 */
function countMatches(query: string, text: string): number {
  // Dividir la consulta en palabras individuales
  const queryWords = query.split(/\s+/).filter(word => word.length > 3);
  
  let matches = 0;
  queryWords.forEach(word => {
    if (text.includes(word)) {
      matches++;
    }
  });
  
  return matches;
}