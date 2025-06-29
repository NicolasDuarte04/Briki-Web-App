/**
 * Real Insurance Plans Data
 * This file contains actual insurance plans from real providers like SURA, Bolívar, AXA, etc.
 * These plans include external links to the provider's quote/purchase pages.
 */

import { InsuranceCategory } from "@shared/schema";

export interface RealInsurancePlan {
  id: string;
  name: string;
  provider: string;
  category: InsuranceCategory;
  price: string; // String to support formats like "Desde $75.000 COP/mes"
  basePrice?: number; // Numeric value for sorting/comparison
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
    category: "auto",
    name: "SOAT (no disponible)",
    summary: "MAPFRE Colombia no comercializa el Seguro Obligatorio de Accidentes de Tránsito (SOAT).",
    price: "No disponible",
    externalLink: null,
    isExternal: false,
    features: []
  }
];

// Function to get real plans by category
export function getRealPlansByCategory(category: InsuranceCategory): RealInsurancePlan[] {
  return realPlans.filter(plan => plan.category === category);
}

// Function to get unique providers
export function getUniqueProviders(): string[] {
  return Array.from(new Set(realPlans.map(plan => plan.provider)));
}

// Function to search plans
export function searchRealPlans(query: string): RealInsurancePlan[] {
  const searchTerm = query.toLowerCase();
  return realPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm) ||
    plan.provider.toLowerCase().includes(searchTerm) ||
    plan.description?.toLowerCase().includes(searchTerm) ||
    plan.features.some(feature => feature.toLowerCase().includes(searchTerm))
  );
} 