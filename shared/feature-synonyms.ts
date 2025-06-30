/**
 * =================================================================
 * MAPEO DE SINÓNIMOS PARA CARACTERÍSTICAS DE SEGUROS
 * =================================================================
 * Este archivo define las equivalencias entre el lenguaje natural
 * del usuario y las características formales de los planes.
 * 
 * Cada clave es una característica formal que aparece en los planes,
 * y su valor es un array de frases o palabras que el usuario podría
 * usar para referirse a esa característica.
 */

export const FEATURE_SYNONYMS: Record<string, string[]> = {
  // Coberturas principales
  "Cobertura por hurto total": [
    "robo", "hurto", "me roben el carro", "protección contra robo",
    "si me lo roban", "en caso de robo", "si me hurtan", "anti robo",
    "que cubra robos", "seguro contra robo"
  ],
  
  "Cobertura por pérdida total": [
    "pérdida total", "daño total", "siniestro total", "destrucción total",
    "accidente grave", "daños graves", "pérdida completa",
    "si se daña por completo", "si queda inservible"
  ],

  "Cobertura por daños parciales": [
    "daños parciales", "golpes", "rayones", "abolladuras",
    "daños menores", "reparaciones", "arreglos", "choques leves",
    "si me chocan", "daños pequeños"
  ],

  // Asistencias y servicios
  "Asistencia jurídica": [
    "abogado", "jurídica", "ayuda legal", "asesoría legal",
    "defensa legal", "representación legal", "trámites legales",
    "si tengo un problema legal", "asuntos legales"
  ],

  "Servicios de grúa": [
    "grúa", "asistencia en carretera", "me quedé varado", "remolque",
    "si se vara", "si no prende", "si se daña", "auxilio mecánico",
    "asistencia mecánica", "servicio de grúa"
  ],

  "Conductor elegido": [
    "conductor elegido", "chofer", "si tomo", "conductor designado",
    "si no puedo manejar", "conductor de reemplazo", "si bebo",
    "conductor profesional", "servicio de conductor"
  ],

  // Coberturas médicas y personales
  "Gastos médicos a ocupantes": [
    "hospital", "médica", "heridos", "lesiones", "atención médica",
    "si alguien se lastima", "gastos de hospital", "emergencia médica",
    "accidentes personales", "si hay heridos"
  ],

  "Responsabilidad civil extracontractual": [
    "daños a terceros", "accidente a otro carro", "culpa",
    "si le pego a otro", "daños a otros", "responsabilidad civil",
    "si choco a alguien", "daños a otras personas", "rce"
  ],

  // Beneficios adicionales
  "Vehículo de reemplazo": [
    "carro de reemplazo", "auto sustituto", "mientras reparan",
    "carro provisional", "si está en el taller", "auto temporal",
    "durante reparación", "carro mientras tanto"
  ],

  "Cobertura de accesorios": [
    "accesorios", "extras", "rines", "llantas", "radio",
    "equipamiento adicional", "partes especiales", "aditamentos",
    "equipo de sonido", "modificaciones"
  ],

  "Asistencia en viajes": [
    "viajes", "si viajo", "fuera de la ciudad", "en carretera",
    "asistencia nacional", "durante viajes", "cobertura en viajes",
    "si salgo de viaje", "viajes por carretera"
  ]
};

/**
 * Normaliza una característica a su forma canónica
 * @param feature - Característica en lenguaje natural
 * @returns La característica formal correspondiente o undefined si no hay match
 */
export function normalizeFeature(feature: string): string | undefined {
  const lowerFeature = feature.toLowerCase().trim();
  
  // Buscar en todas las características y sus sinónimos
  for (const [formalFeature, synonyms] of Object.entries(FEATURE_SYNONYMS)) {
    if (synonyms.some(synonym => lowerFeature.includes(synonym.toLowerCase()))) {
      return formalFeature;
    }
  }
  
  return undefined;
}

/**
 * Obtiene todas las características formales que coinciden con un texto
 * @param text - Texto del usuario
 * @returns Array de características formales que coinciden
 */
export function extractFormalFeatures(text: string): string[] {
  const lowerText = text.toLowerCase();
  const matches = new Set<string>();

  // Buscar coincidencias en todas las características y sus sinónimos
  Object.entries(FEATURE_SYNONYMS).forEach(([formalFeature, synonyms]) => {
    if (synonyms.some(synonym => lowerText.includes(synonym.toLowerCase()))) {
      matches.add(formalFeature);
    }
  });

  return Array.from(matches);
} 