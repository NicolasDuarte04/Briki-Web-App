import { InsuranceCategory } from "./PlanCard";

// Interface for insurance plans
export interface MockInsurancePlan {
  id: number | string;
  title: string;
  provider: string;
  price: number;
  description?: string;
  features: string[];
  badge?: string;
  rating?: string;
  category: InsuranceCategory;
  country?: string;
  sourceLink?: string;
  coverageHighlights?: string;
  priceRange?: string;
}

// Travel insurance plans from Latin American providers
export const travelPlans: MockInsurancePlan[] = [
  {
    id: "travel-1",
    title: "Seguro de Viaje Internacional",
    provider: "Suramericana (SURA)",
    price: 59,
    description: "Digital international travel insurance with comprehensive emergency coverage",
    features: [
      "Emergency medical and repatriation",
      "Trip cancellation protection",
      "Baggage loss coverage",
      "Up to USD 8,000 for extended trip costs"
    ],
    badge: "Best Coverage",
    rating: "4.7",
    category: "travel",
    country: "Colombia",
    coverageHighlights: "Emergency medical and repatriation, trip cancellation, baggage loss; up to USD 8,000 for extended trip costs (hotel, transport, companion travel)",
    priceRange: "Variable (online quote)"
  },
  {
    id: "travel-2",
    title: "Asistencia de Viaje (Planes Básicos)",
    provider: "Allianz Travel",
    price: 29,
    description: "Basic travel assistance plans with global medical network access",
    features: [
      "Trip cancellation (up to US$5,000)",
      "Trip delay compensation (US$150)",
      "Global medical assistance",
      "Access to network of 900,000 doctors worldwide"
    ],
    badge: "Most Affordable",
    rating: "4.5",
    category: "travel",
    country: "Mexico",
    coverageHighlights: "Trip cancellation (up to US$5,000), trip delay (US$150), global medical assistance and baggage coverage; access to a network of 900,000 doctors worldwide",
    priceRange: "From ~MXN 336"
  },
  {
    id: "travel-3",
    title: "Asistencia 365 Internacional",
    provider: "Assist Card",
    price: 75,
    description: "Premium travel protection for international travelers",
    features: [
      "24/7 emergency assistance worldwide",
      "Medical expenses coverage up to $250,000",
      "Trip cancellation/interruption protection",
      "COVID-19 medical expenses included"
    ],
    badge: "Briki's Pick",
    rating: "4.8",
    category: "travel",
    country: "Latin America",
    coverageHighlights: "Comprehensive travel medical insurance with higher coverage limits and premium assistance services, including COVID-19 coverage",
    priceRange: "Variable based on trip length and destination"
  },
  {
    id: "travel-4",
    title: "Total Travel Protection",
    provider: "Mapfre Seguros",
    price: 65,
    description: "Complete travel insurance for families and groups",
    features: [
      "Medical coverage up to $100,000",
      "Family emergency protection",
      "Trip cancellation/interruption",
      "Baggage loss and delay coverage"
    ],
    rating: "4.6",
    category: "travel",
    country: "Latin America",
    coverageHighlights: "Full-service travel assistance with extensive coverage for families and groups traveling together",
    priceRange: "Variable based on number of travelers"
  }
];

// Auto insurance plans from Latin American providers
export const autoPlans: MockInsurancePlan[] = [
  {
    id: "auto-1",
    title: "Plan Autos Básico",
    provider: "Suramericana (SURA)",
    price: 75,
    description: "Essential auto coverage with legal protection",
    features: [
      "Third-party liability (up to COP 640M)",
      "Legal defense costs",
      "Optional roadside assistance",
      "Mobile workshop and towing services"
    ],
    badge: "Most Popular",
    rating: "4.3",
    category: "auto",
    country: "Colombia",
    coverageHighlights: "Third-party liability (up to COP 640M), legal defense costs; optional roadside Asistencia (towing, mobile workshop, professional driver, battery/locksmith up to 4×/year)",
    priceRange: "Variable (online quote)"
  },
  {
    id: "auto-2",
    title: "AutoSeguro (Full)",
    provider: "Chubb",
    price: 129,
    description: "Comprehensive auto protection across North America",
    features: [
      "Total theft & damage coverage",
      "Material damage and 3rd-party liability (MX/US/CAN)",
      "Occupant medical expenses",
      "Free rental car up to 15 days"
    ],
    badge: "Best Coverage",
    rating: "4.7",
    category: "auto",
    country: "Mexico",
    coverageHighlights: "Total theft & damage, material damage, and 3rd-party liability (MX/US/CAN); occupant medical expenses; 24/7 assistance (towing, flat tire, etc.); includes free rental car up to 15 days (Auto Relevo) and zero-deductible on total loss",
    priceRange: "Variable based on vehicle value"
  },
  {
    id: "auto-3",
    title: "Seguro Auto",
    provider: "Porto Seguro",
    price: 89,
    description: "Full collision and liability coverage with 24h assistance",
    features: [
      "Collision (partial/total) coverage",
      "Theft protection (vehicle's commercial value)",
      "Third-party liability",
      "24h roadside assistance"
    ],
    rating: "4.5",
    category: "auto",
    country: "Brazil",
    coverageHighlights: "Collision (partial/total) and theft coverage (vehicle's commercial value); third-party liability; 24h roadside assistance (towing, tire change, jump-start); includes rental-car and glass/window coverage",
    priceRange: "Variable (online quote)"
  },
  {
    id: "auto-4",
    title: "Seguro Auto Full Cobertura",
    provider: "SURA",
    price: 115,
    description: "Complete auto coverage with unemployment benefit",
    features: [
      "Total loss (damage/theft) at insured's value",
      "3rd-party liability up to UF 1,000",
      "Accessory theft protection (10% of value)",
      "Unemployment benefit"
    ],
    badge: "Briki's Pick",
    rating: "4.8",
    category: "auto",
    country: "Chile",
    coverageHighlights: "Total loss (damage/theft) at insured's value; 3rd-party liability up to UF 1,000; accessory theft (10% of value); unemployment benefit (≈3 months' premium, up to UF 5)",
    priceRange: "Variable based on vehicle value and driver profile"
  }
];

// Pet insurance plans from Latin American providers
export const petPlans: MockInsurancePlan[] = [
  {
    id: "pet-1",
    title: "Mi Mascota GNP",
    provider: "GNP Seguros",
    price: 32,
    description: "Customizable pet insurance with comprehensive vet care",
    features: [
      "Coverage for accidents/illnesses",
      "Surgery, medications, and hospitalization",
      "24/7 veterinary advice line",
      "Liability for pet-caused damage"
    ],
    badge: "Most Comprehensive",
    rating: "4.6",
    category: "pet",
    country: "Mexico",
    coverageHighlights: "Customizable pet plan: covers vet care for accidents/illnesses (surgery, meds, hospitalization), 24/7 veterinary advice line, liability for pet-caused damage, death indemnity; optional wellness (antiparasitic, grooming)",
    priceRange: "Variable (online quote)"
  },
  {
    id: "pet-2",
    title: "Seguro de Mascotas",
    provider: "Seguros Falabella",
    price: 25,
    description: "Essential pet health coverage with 24/7 tele-vet services",
    features: [
      "Veterinary care for accidents and illnesses",
      "24/7 tele-vet advice",
      "Emergency pet transport",
      "Home health check-ups"
    ],
    rating: "4.3",
    category: "pet",
    country: "Colombia",
    coverageHighlights: "Veterinary care for accidents and illnesses (home or clinic); 24/7 tele-vet advice; emergency pet transport; home health check-ups; different coverage options per plan",
    priceRange: "Starting at $25/month"
  },
  {
    id: "pet-3",
    title: "Seguro Pet",
    provider: "Aceite Seguros",
    price: 40,
    description: "Complete pet wellness and healthcare coverage",
    features: [
      "Ambulatory and hospital vet care",
      "Annual vaccine schedule",
      "Pet wellness (antiparasitic, microchipping)",
      "Advanced procedures (tomography, dental)"
    ],
    badge: "Briki's Pick",
    rating: "4.8",
    category: "pet",
    country: "Brazil",
    coverageHighlights: "Ambulatory and hospital vet care; vaccines (annual schedule), exams; hospitalization and surgeries; pet wellness (antiparasitic, microchipping); advanced procedures (tomography, dental)",
    priceRange: "Based on pet age and breed"
  },
  {
    id: "pet-4",
    title: "Plan Básico Mascota",
    provider: "SURA",
    price: 18,
    description: "Affordable pet accident and emergency coverage",
    features: [
      "Emergency veterinary care",
      "Accident coverage",
      "Basic medication coverage",
      "Limited illness treatment"
    ],
    badge: "Most Affordable",
    rating: "4.0",
    category: "pet",
    country: "Latin America",
    coverageHighlights: "Basic pet protection covering emergencies and accidents with limited illness coverage",
    priceRange: "Starting at $18/month"
  }
];

// Health insurance plans from Latin American providers
export const healthPlans: MockInsurancePlan[] = [
  {
    id: "health-1",
    title: "Plan Salud Clásico",
    provider: "SURA",
    price: 150,
    description: "Major medical plan with unlimited hospital and outpatient care",
    features: [
      "Unlimited hospital and outpatient care nationwide",
      "Private room + ICU coverage",
      "Surgery/anesthesia and medications",
      "Maternity and cancer treatments"
    ],
    badge: "Most Comprehensive",
    rating: "4.8",
    category: "health",
    country: "Colombia",
    coverageHighlights: "Major medical plan: unlimited hospital and outpatient care nationwide; private room + ICU, surgery/anesthesia, meds, prostheses, transplants, maternity and cancer treatments, etc",
    priceRange: "Based on age and health status"
  },
  {
    id: "health-2",
    title: "Gastos Médicos Flex Plus®",
    provider: "AXA",
    price: 175,
    description: "Flexible major medical insurance with comprehensive benefits",
    features: [
      "Physicians' fees and consultations",
      "Hospitalization and surgery coverage",
      "Ambulance service",
      "Home nursing care"
    ],
    badge: "Briki's Pick",
    rating: "4.7",
    category: "health",
    country: "Mexico",
    coverageHighlights: "Major medical insurance (Flex Plus): covers most medical costs under plan; includes physicians' fees, hospitalization, surgery, ambulance service, home nursing care, etc. (comprehensive benefits)",
    priceRange: "Variable based on age, health, and coverage level"
  },
  {
    id: "health-3",
    title: "Seguro Complementario Individual",
    provider: "SURA",
    price: 85,
    description: "Complementary health plan to extend public coverage",
    features: [
      "Reimburses medical expenses up to UF 300",
      "Accidental death benefit up to UF 250",
      "Extends coverage beyond public system",
      "Flexible options and deductibles"
    ],
    rating: "4.5",
    category: "health",
    country: "Chile",
    coverageHighlights: "Complementary health plan (post-Fonasa/Isapre): reimburses medical expenses up to UF 300; accidental death benefit up to UF 250 (for age <70)",
    priceRange: "Based on age and coverage level"
  },
  {
    id: "health-4",
    title: "Línea Básica (Plan Básico)",
    provider: "Plan Seguro",
    price: 95,
    description: "Basic major-medical coverage with added benefits",
    features: [
      "Hospital services (doctor fees, anesthesia, medications)",
      "Daily hospital cash (IDHA)",
      "Women's cancer indemnity",
      "Foreign travel emergency coverage"
    ],
    badge: "Best Value",
    rating: "4.4",
    category: "health",
    country: "Mexico",
    coverageHighlights: "Basic major-medical plan: hospital services (doctor fees, anesthesia, meds, labs, rehab, etc.); added benefits like daily hospital cash (IDHA), women's cancer indemnity, foreign travel emergency & medical coverage",
    priceRange: "Starting at $95/month"
  }
];