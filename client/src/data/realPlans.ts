/**
 * Real Insurance Plans Data
 * This file contains actual insurance plans from real providers like SURA, Bolívar, AXA, etc.
 * These plans include external links to the provider's quote/purchase pages.
 */

import { InsuranceCategory } from "../../../shared/schema";

export interface RealInsurancePlan {
  id: string;
  name: string;
  provider: string;
  category: InsuranceCategory;
  price: string | null; // String to support formats like "Desde $75.000 COP/mes" or null if not available
  basePrice?: number; // Numeric value for sorting/comparison
  priceUnit?: 'monthly' | 'annual'; // Whether the price is monthly or annual
  paymentFrequency?: 'monthly' | 'quarterly' | 'semiannual' | 'annual'; // Available payment frequencies
  description?: string;
  summary?: string;
  features: string[];
  badge?: string;
  rating?: string;
  country?: string;
  coverageHighlights?: string;
  priceRange?: string;
  
  // External redirect fields
  externalLink: string | null;
  isExternal: boolean;
  
  // Additional fields for comparison
  coverageAmount?: number;
  deductible?: number;
  currency?: string;
  duration?: string;
}

export const realPlans: RealInsurancePlan[] = [
  {
    id: "sura-auto-001",
    provider: "SURA",
    category: "auto",
    name: "Plan Autos Básico",
    summary: "Protección esencial contra daños a terceros.",
    price: "Cotización disponible en línea",
    basePrice: 1200000,
    priceUnit: "annual",
    paymentFrequency: "monthly",
    externalLink: "https://suraenlinea.com/autos/seguro-basico",
    isExternal: true,
    features: [
      "Responsabilidad civil hasta $640M COP",
      "Asistencia jurídica básica (defensa legal)",
      "Servicio de grúa (hasta 50 SMDLV) y conductor elegido incluidos"
    ]
  },
  {
    id: "sura-auto-002",
    provider: "SURA",
    category: "auto",
    name: "Plan Básico Pérdidas Totales",
    summary: "Cobertura en caso de pérdida total por accidente o robo de tu carro.",
    price: "Cotización solo disponible presencialmente",
    basePrice: 1800000,
    priceUnit: "annual",
    paymentFrequency: "monthly",
    externalLink: "https://www.segurossura.com.co/paginas/movilidad/autos/plan-autos-basico-perdidas-totales.aspx",
    isExternal: true,
    features: [
      "Responsabilidad civil hasta $1.040M COP",
      "Indemnización del 100% del valor asegurado por pérdida total (daños o hurto)",
      "Asistencias incluidas (grúa, conductor profesional, asesoría en accidentes)"
    ]
  },
  {
    id: "sura-auto-003",
    provider: "SURA",
    category: "auto",
    name: "Plan Autos Clásico",
    summary: "Cobertura amplia contra daños y robo, con alternativas de movilidad incluidas.",
    price: "Cotización disponible en línea",
    basePrice: 2000000,
    priceUnit: "annual",
    paymentFrequency: "monthly",
    externalLink: "https://suraenlinea.com/autos/seguro-clasico",
    isExternal: true,
    features: [
      "Responsabilidad civil hasta $2.040M COP",
      "Cobertura por daños parciales y totales, y hurto del vehículo",
      "Vehículo de reemplazo durante reparaciones"
    ]
  },
  {
    id: "sura-auto-004",
    provider: "SURA",
    category: "auto",
    name: "Plan Autos Global",
    summary: "Máxima protección con coberturas integrales y servicios VIP para tu vehículo.",
    price: "Cotización disponible en línea",
    basePrice: 4100000,
    priceUnit: "annual",
    paymentFrequency: "monthly",
    externalLink: "https://suraenlinea.com/autos/seguro-global",
    isExternal: true,
    features: [
      "Responsabilidad civil hasta $4.100M COP",
      "Cobertura completa (daños, hurto, accesorios especiales, llaves, etc.)",
      "Asistencias premium: conductor y cerrajería ilimitados, grúa de amplio alcance, vehículo sustituto hasta 20 días"
    ]
  },
  // ----------------- MAPFRE Colombia  -----------------
  {
    id: "mapfre-auto-tradicional",
    provider: "MAPFRE",
    category: "auto",
    name: "Seguro de automóvil Tradicional",
    summary: "Póliza todo riesgo estándar para vehículos particulares. Ofrece protección integral contra accidentes, robo y daños a terceros.",
    price: "Cotización disponible en línea",
    basePrice: 1200000,
    priceUnit: "annual",
    paymentFrequency: "monthly",
    externalLink: "https://www.mapfre.com.co/seguros-carros/tradicional/",
    isExternal: true,
    features: [
      "Cobertura todo riesgo estándar",
      "Asistencia en carretera 24/7",
      "Responsabilidad civil extracontractual"
    ]
  },
  {
    id: "mapfre-auto-familiar",
    provider: "MAPFRE",
    category: "auto",
    name: "Seguro de automóvil Familiar",
    summary: "Seguro todo riesgo para familias, con beneficios especiales como descuentos por hijos y asistencia familiar.",
    price: "Cotización disponible en línea",
    basePrice: 1200000,
    priceUnit: "annual",
    paymentFrequency: "monthly",
    externalLink: "https://www.mapfre.com.co/seguros-carros/familiar/",
    isExternal: true,
    features: [
      "Beneficios y descuentos para grupos familiares",
      "Cobertura de responsabilidad civil y daños parciales/totales",
      "Asistencia en viaje y carro taller"
    ]
  },
  {
    id: "mapfre-auto-mujer",
    provider: "MAPFRE",
    category: "auto",
    name: "Seguro de automóvil Mujer",
    summary: "Póliza exclusiva para mujeres con beneficios únicos como cirugía plástica facial y cobertura de vidrios sin deducible.",
    price: "Cotización disponible en línea",
    basePrice: 1200000,
    priceUnit: "annual",
    paymentFrequency: "monthly",
    externalLink: "https://www.mapfre.com.co/seguros-carros/mujer/",
    isExternal: true,
    features: [
      "Beneficios exclusivos para conductoras",
      "Cobertura de cosmetología facial tras accidentes",
      "Reposición de vidrios sin deducible"
    ]
  },
  {
    id: "mapfre-auto-cero-km",
    provider: "MAPFRE",
    category: "auto",
    name: "Seguro de automóvil Cero Kilómetros",
    summary: "Seguro todo riesgo diseñado para vehículos nuevos o de alta gama, con máxima protección desde el primer día.",
    price: "Cotización disponible en línea",
    basePrice: 1200000,
    priceUnit: "annual",
    paymentFrequency: "monthly",
    externalLink: "https://www.mapfre.com.co/seguros-carros/cero-kilometros/",
    isExternal: true,
    features: [
      "Cobertura todo riesgo sin depreciación inicial",
      "Gastos de matrícula y traspaso en caso de pérdida total",
      "Reposición a nuevo del vehículo"
    ]
  },
  {
    id: "mapfre-auto-carga",
    provider: "MAPFRE",
    category: "auto",
    name: "Seguro para Vehículos Pesados",
    summary: "Cobertura todo riesgo para camiones y vehículos de carga, incluyendo asistencia en carretera y protección de mercancía.",
    price: "Cotización disponible en línea",
    basePrice: 1200000,
    priceUnit: "annual",
    paymentFrequency: "monthly",
    externalLink: "https://www.mapfre.com.co/seguros-carros/vehiculos-de-carga/",
    isExternal: true,
    features: [
      "Cobertura de daños parciales y totales",
      "Protección de carga y asistencia en ruta",
      "Responsabilidad civil alta capacidad"
    ]
  },
  {
    id: "mapfre-soat",
    provider: "MAPFRE",
    category: "soat",
    name: "SOAT (no disponible)",
    summary: "MAPFRE Colombia no comercializa el Seguro Obligatorio de Accidentes de Tránsito (SOAT).",
    price: null,
    externalLink: null,
    isExternal: false,
    features: []
  },
  // ----------------- Seguros Bolívar  -----------------
  {
    "id": "bolivar-auto-001",
    "provider": "Seguros Bolívar",
    "category": "auto",
    "name": "Plan Ligero",
    "summary": "Cobertura todo riesgo básica para vehículos particulares, con beneficios esenciales.",
    "price": "Según cotización",
    "basePrice": 1000000,
    "priceUnit": "annual",
    "paymentFrequency": "monthly",
    "externalLink": "https://www.segurosbolivar.com/seguro-todo-riesgo-vehiculo",
    "isExternal": true,
    "features": [
      "Cobertura del 100% del valor comercial (vehículos ≤10 años)",
      "RCE hasta $600 millones COP",
      "Accidentes personales hasta $15 millones COP",
      "Asistencia jurídica y en carretera"
    ]
  },
  {
    "id": "bolivar-auto-002",
    "provider": "Seguros Bolívar",
    "category": "auto",
    "name": "Plan Clásico",
    "summary": "Cobertura intermedia con mayor límite de responsabilidad civil y beneficios adicionales.",
    "price": "Según cotización",
    "basePrice": 1500000,
    "priceUnit": "annual",
    "paymentFrequency": "monthly",
    "externalLink": "https://www.segurosbolivar.com/seguro-todo-riesgo-vehiculo",
    "isExternal": true,
    "features": [
      "RCE hasta $1.5 mil millones COP",
      "Deducible de 1.5 SMMLV",
      "Cobertura por pérdida total o parcial",
      "Cobertura 360 y asistencia jurídica"
    ]
  },
  {
    "id": "bolivar-auto-003",
    "provider": "Seguros Bolívar",
    "category": "auto",
    "name": "Plan Premium",
    "summary": "Cobertura total con vehículo de reemplazo y deducible reducido.",
    "price": "Según cotización",
    "basePrice": 4000000,
    "priceUnit": "annual",
    "paymentFrequency": "monthly",
    "externalLink": "https://www.segurosbolivar.com/seguro-todo-riesgo-vehiculo",
    "isExternal": true,
    "features": [
      "RCE hasta $4 mil millones COP",
      "Vehículo de reemplazo por 30 días",
      "Deducible de 0.8 SMMLV",
      "Cobertura de accesorios (llaves, gadgets)"
    ]
  },
  {
    "id": "bolivar-soat-001",
    "provider": "Seguros Bolívar",
    "category": "soat",
    "name": "SOAT Bolívar",
    "summary": "Seguro obligatorio con descarga digital desde la web de Bolívar.",
    "price": "Según cotización",
    "externalLink": "https://www.segurosbolivar.com/descargar-soat",
    "isExternal": true,
    "features": [
      "Cobertura médica y muerte por accidente",
      "Descarga digital del SOAT",
      "Cumple con regulación colombiana",
      "Requiere datos del vehículo y propietario"
    ]
  },
    // ----------------- HDI Seguros  -----------------
  {
    "id": "hdi-auto-001",
    "provider": "HDI Seguros",
    "category": "auto",
    "name": "Auto HDI",
    "summary": "Seguro todo riesgo para vehículos particulares hasta $400M COP de valor asegurado.",
    "price": "Según cotización",
    "basePrice": 400000000,
    "priceUnit": "annual",
    "paymentFrequency": "monthly",
    "externalLink": "https://www.hdiseguros.com.co/personas/seguros-vehiculos",
    "isExternal": true,
    "features": [
      "Vehículos hasta 30 años de antigüedad",
      "Cobertura por hurto, pérdida, daños",
      "Asistencia en carretera",
      "Gestión de trámites legales"
    ]
  },
  {
    "id": "hdi-auto-002",
    "provider": "HDI Seguros",
    "category": "auto",
    "name": "Vehículos de trabajo HDI",
    "summary": "Cobertura especializada para vehículos de carga, transporte de pasajeros o mercancía propia.",
    "price": "Según cotización",
    "basePrice": 1200000000,
    "priceUnit": "annual",
    "paymentFrequency": "monthly",
    "externalLink": "https://www.hdiseguros.com.co/personas/seguros-vehiculos",
    "isExternal": true,
    "features": [
      "Diseñado para vehículos comerciales",
      "Cobertura de daños y responsabilidad",
      "Asistencia para transporte",
      "Protección para el conductor"
    ]
  },
  {
    "id": "hdi-auto-003",
    "provider": "HDI Seguros",
    "category": "auto",
    "name": "Moto HDI",
    "summary": "Cobertura completa para motos de cualquier cilindraje.",
    "price": "Según cotización",
    "basePrice": 1200000000,
    "priceUnit": "annual",
    "paymentFrequency": "monthly",
    "externalLink": "https://www.hdiseguros.com.co/personas/seguros-vehiculos",
    "isExternal": true,
    "features": [
      "Cobertura contra daños, hurto y pérdida",
      "Disponible para motos nuevas y usadas",
      "Accidentes personales",
      "Asistencia en ruta para motociclistas"
    ]
  },
  {
    "id": "hdi-soat-001",
    "provider": "HDI Seguros",
    "category": "soat",
    "name": "SOAT HDI",
    "summary": "Cobertura obligatoria con beneficios definidos por ley colombiana.",
    "price": "Según cotización",
    "externalLink": "https://www.hdiseguros.com.co/personas/seguros-autos/soat",
    "isExternal": true,
    "features": [
      "Gastos médicos hasta $13M COP",
      "Indemnización por discapacidad o fallecimiento",
      "Transporte de heridos",
      "Tarifas según tipo de vehículo"
    ]
  },
  // ----------------- Qualitas Seguros  -----------------
  {
    "id": "qualitas-auto-none",
    "provider": "Qualitas Seguros",
    "category": "auto",
    "name": "No hay planes disponibles públicamente",
    "summary": "No se encontraron planes de seguro de auto individuales en el dominio oficial colombiano.",
    "price": null,
    "externalLink": null,
    "features": [],
    "isExternal": false
  },
  {
    "id": "qualitas-soat-none",
    "provider": "Qualitas Seguros",
    "category": "soat",
    "name": "SOAT (no disponible)",
    "summary": "Esta aseguradora no comercializa el Seguro Obligatorio de Accidentes de Tránsito (SOAT) directamente en su dominio oficial colombiano.",
    "price": null,
    "externalLink": null,
    "features": [],
    "isExternal": false
  },
  // ----------------- Colasistencia  -----------------
  {
    "id": "colasistencia-auto-none",
    "provider": "Colasistencia",
    "category": "auto",
    "name": "No hay planes disponibles públicamente",
    "summary": "No se encontraron planes de seguro de auto individuales en el dominio oficial colombiano. Colasistencia se especializa en servicios de asistencia y accidentes personales.",
    "price": null,
    "externalLink": null,
    "features": [],
    "isExternal": false
  },
  {
    "id": "colasistencia-soat-none",
    "provider": "Colasistencia",
    "category": "soat",
    "name": "SOAT (no disponible)",
    "summary": "Esta aseguradora no comercializa el Seguro Obligatorio de Accidentes de Tránsito (SOAT) directamente en su dominio oficial colombiano.",
    "price": null,
    "externalLink": null,
    "features": [],
    "isExternal": false
  },
  // ----------------- Travel Insurance Plans -----------------
  {
    id: "pax-asistencia-multitrip",
    provider: "Pax Assistance",
    category: "travel",
    name: "Plan Multitrip",
    summary: "Diseñado para viajeros frecuentes, este plan cubre múltiples viajes al año, ofreciendo tranquilidad y soporte continuo.",
    price: "Según cotización",
    priceUnit: "annual",
    paymentFrequency: "annual",
    externalLink: "https://www.paxassistance.com/en-co",
    isExternal: true,
    features: [
      "Asistencia médica para condiciones preexistentes hasta USD/EUR 6,000",
      "Cobertura por equipaje perdido hasta USD/EUR 1,200",
      "Pax Cash para pagos directos de medicamentos sin reembolsos",
      "Centro de Salud Emocional con expertos",
      "Soporte 24/7 por WhatsApp"
    ]
  },
  {
    id: "pax-asistencia-larga-estancia",
    provider: "Pax Assistance",
    category: "travel",
    name: "Plan Larga Estancia (+90 días)",
    summary: "Cobertura extendida para viajes de más de 90 días, ideal para estudiantes o nómadas digitales, con asistencia médica completa.",
    price: "Según cotización",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://www.paxassistance.com/en-co",
    isExternal: true,
    features: [
      "Asistencia médica para condiciones preexistentes hasta USD/EUR 6,000",
      "Cobertura por equipaje perdido hasta USD/EUR 1,200",
      "Pax Cash para pagos directos de medicamentos sin reembolsos",
      "Centro de Salud Emocional con expertos",
      "Soporte 24/7 por WhatsApp"
    ]
  },
  {
    id: "terrawind-larga-estancia",
    provider: "Terrawind Global Protection",
    category: "travel",
    name: "Plan Larga Estancia",
    summary: "Cobertura completa para estudiantes y viajeros frecuentes en estancias prolongadas en el extranjero, incluyendo asistencia médica y soporte psicológico.",
    price: "Según cotización",
    priceUnit: undefined,
    paymentFrequency: "annual",
    externalLink: "https://twglobalprotection.com/en",
    isExternal: true,
    features: [
      "Asistencia médica y traslados",
      "Soporte psicológico",
      "Cobertura para condiciones preexistentes",
      "Telemedicina disponible",
      "Acceso gratuito a más de 300 revistas digitales"
    ]
  },
  {
    id: "terrawind-multiviajes-anual",
    provider: "Terrawind Global Protection",
    category: "travel",
    name: "Plan Multiviajes Anual",
    summary: "Ideal para viajeros frecuentes, cubre múltiples viajes de hasta 30 días cada uno durante un año, con protección médica y contra accidentes.",
    price: "Según cotización",
    priceUnit: "annual",
    paymentFrequency: "annual",
    externalLink: "https://twglobalprotection.com/en",
    isExternal: true,
    features: [
      "Cobertura médica y protección contra accidentes",
      "Válido para múltiples viajes de hasta 30 días",
      "Cobertura para equipaje demorado",
      "Cobertura para COVID-19",
      "Acceso gratuito a más de 300 revistas digitales"
    ]
  },
  {
    id: "mas-asistencia-mas-mundo",
    provider: "Más Asistencia",
    category: "travel",
    name: "Más Mundo",
    summary: "Plan de alta cobertura diseñado para brindar asistencia integral en cualquier parte del mundo.",
    price: "Cotización solo disponible tras formulario",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://masasistencia.co/",
    isExternal: true,
    features: [
      "Cobertura médica, legal y dental",
      "Servicios de telemedicina incluidos",
      "Cubre pérdida de equipaje y retrasos/cancelaciones de vuelos",
      "Asistencia para enfermedades respiratorias y gastrointestinales",
      "Experiencia de 25 años en el mercado"
    ]
  },
  {
    id: "mas-asistencia-mas-student",
    provider: "Más Asistencia",
    category: "travel",
    name: "Más Student",
    summary: "Cobertura especializada para estudiantes que planean estudiar en el extranjero, con buena cobertura para estancias de 30 a 365 días.",
    price: "Cotización solo disponible tras formulario",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://masasistencia.co/",
    isExternal: true,
    features: [
      "Cobertura médica, legal y dental",
      "Servicios de telemedicina incluidos",
      "Cubre pérdida de equipaje y retrasos/cancelaciones de vuelos",
      "Asistencia para enfermedades comunes y preexistentes",
      "Duración de cobertura de 30 a 365 días"
    ]
  },
  {
    id: "mas-asistencia-mas-long-stay",
    provider: "Más Asistencia",
    category: "travel",
    name: "Más Long Stay",
    summary: "Plan para individuos con estancias prolongadas en el extranjero (no estudiantes), con cobertura adaptada a sus necesidades.",
    price: "Cotización solo disponible tras formulario",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://masasistencia.co/",
    isExternal: true,
    features: [
      "Cobertura médica, legal y dental",
      "Servicios de telemedicina incluidos",
      "Cubre pérdida de equipaje y retrasos/cancelaciones de vuelos",
      "Asistencia para enfermedades comunes y preexistentes",
      "Adaptado para estancias extendidas"
    ]
  },
  {
    id: "colasistencia-parques-nacionales-naturales",
    provider: "Colasistencia",
    category: "travel",
    name: "Colasistencia Parques Nacionales Naturales",
    summary: "Producto especializado para visitantes de Parques Nacionales Naturales de Colombia, cumpliendo con la Resolución 092 del Ministerio de Ambiente.",
    price: "Cotización solo disponible tras formulario",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://colasistencia.net/home-nuevos-productos/",
    isExternal: true,
    features: [
      "Protección específica para visitas a Parques Nacionales",
      "Asistencia en caso de imprevistos en áreas naturales",
      "Ideal para ecoturistas y amantes de la naturaleza",
      "Cobertura adaptada a regulaciones ambientales"
    ]
  },
  {
    id: "colasistencia-buceo",
    provider: "Colasistencia",
    category: "travel",
    name: "Colasistencia Buceo",
    summary: "Plan de protección para buceadores hasta nivel avanzado, asegurando asistencia en caso de incidentes relacionados con esta actividad.",
    price: "Cotización solo disponible tras formulario",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://colasistencia.net/home-nuevos-productos/",
    isExternal: true,
    features: [
      "Orientado a la protección de buceadores",
      "Cubre hasta nivel avanzado de buceo",
      "Asistencia especializada para actividades subacuáticas",
      "Ideal para entusiastas de deportes acuáticos",
      "Protección para aventuras extremas"
    ]
  },
  {
    id: "assist-card-ac60",
    provider: "Assist Card",
    category: "travel",
    name: "AC 60 Plan",
    summary: "Plan anual con asistencia médica de USD 60,000, cobertura para preexistencias y gastos dentales de emergencia, sin límite de edad.",
    price: "Según cotización (descuentos disponibles)",
    priceUnit: "annual",
    paymentFrequency: "annual",
    externalLink: "https://www.assistcard.com/co/b2c/health-insurance-colombia",
    isExternal: true,
    features: [
      "Asistencia para enfermedades preexistentes hasta USD 300",
      "Odontología de emergencia hasta USD 500",
      "Repatriación incluida",
      "Sin límite de edad"
    ]
  },
  {
    id: "assist-card-ac150",
    provider: "Assist Card",
    category: "travel",
    name: "AC 150 Plan",
    summary: "Cobertura anual de USD 150,000 en asistencia médica, incluyendo preexistencias, práctica deportiva y telemedicina, con límite de edad de 80 años.",
    price: "Según cotización (descuentos disponibles)",
    priceUnit: "annual",
    paymentFrequency: "annual",
    externalLink: "https://www.assistcard.com/co/b2c/health-insurance-colombia",
    isExternal: true,
    features: [
      "Asistencia para enfermedades preexistentes hasta USD 500",
      "Práctica deportiva hasta USD 10,000",
      "Repatriación hasta USD 100,000",
      "Telemedicina incluida",
      "Límite de edad: 80 años"
    ]
  },
  {
    id: "assist-card-ac250",
    provider: "Assist Card",
    category: "travel",
    name: "AC 250 Plan",
    summary: "El plan más completo con USD 250,000 en asistencia médica, cobertura para preexistencias, odontología de emergencia y práctica deportiva.",
    price: "Según cotización (descuentos disponibles)",
    priceUnit: "annual",
    paymentFrequency: "annual",
    externalLink: "https://www.assistcard.com/co/b2c/health-insurance-colombia",
    isExternal: true,
    features: [
      "Asistencia para enfermedades preexistentes hasta USD 500",
      "Odontología de emergencia hasta USD 500",
      "Práctica deportiva hasta USD 10,000",
      "Repatriación hasta USD 100,000",
      "Límite de edad: 75 años"
    ]
  },
  {
    id: "assist-card-study-plan",
    provider: "Assist Card",
    category: "travel",
    name: "Study Plan",
    summary: "Diseñado para estudiantes de 12 a 45 años, ofrece USD 110,000 en asistencia médica, cobertura para preexistencias y apoyo psicológico telefónico.",
    price: "Según cotización (descuentos disponibles)",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://www.assistcard.com/co/b2c/health-insurance-colombia",
    isExternal: true,
    features: [
      "Asistencia para enfermedades preexistentes hasta USD 1,000",
      "Práctica deportiva hasta USD 10,000",
      "Repatriación hasta USD 100,000",
      "Asesoramiento psicológico telefónico",
      "Rango de edad: 12 a 45 años"
    ]
  },
  {
    id: "sura-seguro-viaje-nacional-aereo",
    provider: "SURA",
    category: "travel",
    name: "Seguro de Viaje Nacional (Plan Aéreo)",
    summary: "Protección para viajes aéreos dentro de Colombia, cubriendo emergencias médicas hasta COP 10 millones y equipaje.",
    price: "Según cotización",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://www.sura.co/seguros/personas/salud/viajes/digital",
    isExternal: true,
    features: [
      "Emergencias médicas hasta COP 10 millones",
      "Cancelación de viaje hasta COP 200,000",
      "Equipaje perdido o demorado hasta COP 1 millón",
      "Extensión de viaje por accidente o enfermedad",
      "Reembolso por robo de documentos"
    ]
  },
  {
    id: "sura-seguro-viaje-nacional-terrestre",
    provider: "SURA",
    category: "travel",
    name: "Seguro de Viaje Nacional (Plan Terrestre)",
    summary: "Cobertura para viajes terrestres dentro de Colombia, con asistencia médica hasta COP 5 millones y protección contra robo de documentos.",
    price: "Según cotización",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://www.sura.co/seguros/personas/salud/viajes/digital",
    isExternal: true,
    features: [
      "Emergencias médicas hasta COP 5 millones",
      "Equipaje perdido o demorado hasta COP 500,000",
      "Reembolso por robo de documentos hasta COP 200,000",
      "Invalidez parcial o total por accidente hasta COP 5 millones",
      "Asistencia 24/7"
    ]
  },
  {
    id: "axa-travel-protection-gold",
    provider: "AXA Travel Protection",
    category: "travel",
    name: "Gold Plan",
    summary: "Plan intermedio con mayores límites de cobertura, incluyendo condiciones preexistentes y opción de exención de daños por colisión de coche de alquiler.",
    price: "Según cotización (3-10% del costo del viaje)",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://www.axatravelinsurance.com/destination/latin-america/colombia",
    isExternal: true,
    features: [
      "Cobertura médica para emergencias",
      "Cobertura para condiciones médicas preexistentes",
      "Evacuaciones de emergencia y repatriación",
      "Cobertura para equipaje y retraso de viaje",
      "Opción de exención de daños por colisión de coche de alquiler",
      "Cobertura COVID-19 disponible"
    ]
  },
  {
    id: "axa-travel-protection-platinum",
    provider: "AXA Travel Protection",
    category: "travel",
    name: "Platinum Plan",
    summary: "El plan más completo con los límites de cobertura más altos, incluyendo 'Cancel for Any Reason' y beneficios adicionales para deportes.",
    price: "Según cotización (3-10% del costo del viaje)",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://www.axatravelinsurance.com/destination/latin-america/colombia",
    isExternal: true,
    features: [
      "Cobertura médica de alto nivel",
      "Opción 'Cancel for Any Reason' (CFAR)",
      "Cobertura para condiciones médicas preexistentes",
      "Exención de daños por colisión de coche de alquiler",
      "Cobertura para días de esquí o golf perdidos",
      "Evacuaciones de emergencia y repatriación"
    ]
  },
  {
    id: "heymondo-international-medical-travel",
    provider: "Heymondo",
    category: "travel",
    name: "Seguro de Viaje Internacional (Médico + Viaje)",
    summary: "Cobertura integral que combina asistencia médica con protección adicional para eventos de viaje como pérdida de equipaje y retrasos.",
    price: "$80 USD",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://heymondo.com/",
    isExternal: true,
    features: [
      "Asistencia médica 24/7 en todo el mundo",
      "Cobertura para gastos no reembolsables",
      "Cubre pérdida de equipaje y retrasos de transporte",
      "Gestión completa desde la aplicación móvil",
      "Chat médico 24/7 y llamadas de asistencia gratuitas"
    ]
  },
  {
    id: "heymondo-premium-travel-insurance",
    provider: "Heymondo",
    category: "travel",
    name: "Seguro de Viaje Premium",
    summary: "El plan más completo con límites de pago más altos para una máxima protección en tus viajes internacionales.",
    price: "$105 USD",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://heymondo.com/",
    isExternal: true,
    features: [
      "Límites de cobertura más altos en todos los pagos",
      "Asistencia 24/7 en todo el mundo",
      "Cobertura para gastos no reembolsables",
      "Gestión completa desde la aplicación móvil",
      "Opciones de personalización con complementos (ej. deportes de aventura)"
    ]
  },
  {
    id: "heymondo-annual-multi-trip",
    provider: "Heymondo",
    category: "travel",
    name: "Seguro de Viaje Multiviajes Anual",
    summary: "Cubre todos tus viajes durante un año (hasta 60 días cada uno), ideal para viajeros frecuentes de ocio o negocios.",
    price: "Según cotización",
    priceUnit: "annual",
    paymentFrequency: "annual",
    externalLink: "https://heymondo.com/",
    isExternal: true,
    features: [
      "Cobertura para múltiples viajes en 12 meses (hasta 60 días/viaje)",
      "Asistencia 24/7 en todo el mundo",
      "Gestión completa desde la aplicación móvil",
      "Cubre problemas médicos y retrasos de transporte",
      "Ideal para viajes de ocio y negocios"
    ]
  },
  {
    id: "heymondo-long-stay",
    provider: "Heymondo",
    category: "travel",
    name: "Seguro de Viaje Larga Estancia",
    summary: "Cobertura flexible para viajes de más de 90 días, diseñada para estancias prolongadas.",
    price: "$187 USD (para 4 meses)",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://heymondo.com/",
    isExternal: true,
    features: [
      "Cobertura para viajes de más de 90 días",
      "Asistencia 24/7 en todo el mundo",
      "Gestión completa desde la aplicación móvil",
      "Cubre problemas médicos y retrasos de transporte",
      "Ideal para estancias prolongadas"
    ]
  },
  {
    id: "safetywing-nomad-insurance-complete",
    provider: "SafetyWing",
    category: "travel",
    name: "Nomad Insurance Complete",
    summary: "Seguro de salud completo con protecciones de viaje adicionales, incluyendo atención médica rutinaria, bienestar y tratamiento de cáncer.",
    price: "$161.50 USD",
    priceUnit: "monthly",
    paymentFrequency: "monthly",
    externalLink: "https://safetywing.com/nomad-insurance",
    isExternal: true,
    features: [
      "Cobertura de salud completa (incluye Essential)",
      "Atención médica rutinaria en cualquier parte del mundo",
      "Soporte de salud mental y terapias de bienestar",
      "Tratamiento de cáncer incluido",
      "Sin restricciones de cobertura en el país de origen",
      "Cubre robos, alojamiento cancelado y equipaje demorado"
    ]
  },
  {
    id: "allianz-global-assistance-plan-anual",
    provider: "Allianz Global Assistance",
    category: "travel",
    name: "Plan Anual",
    summary: "Cobertura para múltiples viajes durante un año, ideal para viajeros frecuentes, tanto nacionales como internacionales.",
    price: "Según cotización",
    priceUnit: "annual",
    paymentFrequency: "annual",
    externalLink: "https://www.allianztravelinsurance.com/",
    isExternal: true,
    features: [
      "Protección para todos los viajes en 365 días",
      "Cubre cancelaciones, retrasos y emergencias médicas",
      "Asistencia 24 horas al día",
      "Red mundial de hospitales preseleccionados",
      "Cobertura COVID-19 disponible"
    ]
  },
  {
    id: "allianz-global-assistance-alquiler-coche",
    provider: "Allianz Global Assistance",
    category: "travel",
    name: "Protección de Alquiler de Coche",
    summary: "Ofrece protección primaria contra colisión, pérdida y daños a un coche de alquiler, con asistencia de emergencia 24 horas.",
    price: "Según cotización",
    priceUnit: undefined,
    paymentFrequency: undefined,
    externalLink: "https://www.allianztravelinsurance.com/",
    isExternal: true,
    features: [
      "Protección primaria para daños por colisión y robo de coche de alquiler",
      "Asistencia de emergencia 24 horas",
      "Alternativa al seguro personal o del mostrador de alquiler",
      "Cubre costos de pequeños rasguños a cientos de dólares",
      "Ideal para explorar paisajes colombianos"
    ]
  }
];

// Function to get real plans by category
export function getRealPlansByCategory(category: InsuranceCategory): RealInsurancePlan[] {
  return filterPlaceholderPlans(realPlans.filter(plan => plan.category === category));
}

// Function to get unique providers
export function getUniqueProviders(): string[] {
  return Array.from(new Set(realPlans.map(plan => plan.provider)));
}

// Function to search plans
export function searchRealPlans(query: string): RealInsurancePlan[] {
  const searchTerm = query.toLowerCase();
  const results = realPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm) ||
    plan.provider.toLowerCase().includes(searchTerm) ||
    plan.description?.toLowerCase().includes(searchTerm) ||
    plan.features.some(feature => feature.toLowerCase().includes(searchTerm))
  );

  // If searching for a specific provider, include their placeholder plans
  const isProviderSearch = ['qualitas', 'colasistencia'].some(provider => 
    searchTerm.includes(provider.toLowerCase())
  );

  return isProviderSearch ? results : filterPlaceholderPlans(results);
}

/**
 * Filters out placeholder plans (those with no features or links) unless they are
 * the only results available or specifically requested.
 */
function filterPlaceholderPlans(plans: RealInsurancePlan[]): RealInsurancePlan[] {
  // First, separate active and placeholder plans
  const activePlans = plans.filter(plan => plan.features.length > 0 || plan.externalLink);
  const placeholderPlans = plans.filter(plan => plan.features.length === 0 && !plan.externalLink);

  // If we have active plans, return only those
  if (activePlans.length > 0) {
    return activePlans;
  }

  // If we only have placeholder plans, return them
  return placeholderPlans;
} 