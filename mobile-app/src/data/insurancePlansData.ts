import { InsurancePlan } from '../types/insurance';
import { 
  AXA_LOGO, 
  IATI_LOGO, 
  ASSIST_CARD_LOGO, 
  STARR_LOGO, 
  SURA_LOGO 
} from '../assets/logos/placeholder-logo';

// Real insurance plans data extracted from official public brochures
// Plans from 5 major providers: AXA, IATI, Assist Card, Starr, and SURA
export const INSURANCE_PLANS: InsurancePlan[] = [
  // AXA Plans
  {
    id: 1,
    name: 'Básico',
    provider: 'AXA',
    logo: require('../assets/logos/axa-logo.png'),
    basePrice: 35,
    medicalCoverage: 30000,
    tripCancellation: 'Hasta $1,500',
    baggageProtection: 500,
    emergencyEvacuation: 50000,
    adventureActivities: false,
    rentalCarCoverage: 0,
    features: [
      'Asistencia médica por accidente o enfermedad',
      'Medicamentos en caso de hospitalización',
      'Repatriación médica o funeraria',
      'Traslado médico de emergencia',
      'Ayuda en caso de pérdida de documentos'
    ],
    restrictions: [
      'No cubre deportes de aventura o de riesgo',
      'No incluye enfermedades preexistentes'
    ],
    rating: 4.3,
    reviews: 127,
    country: 'Internacional',
    description: 'Plan básico para viajeros que buscan cobertura esencial a un precio accesible. Ideal para viajes cortos con actividades turísticas estándar.'
  },
  {
    id: 2,
    name: 'Viajero Frecuente',
    provider: 'AXA',
    logo: require('../assets/logos/axa-logo.png'),
    basePrice: 65,
    medicalCoverage: 100000,
    tripCancellation: 'Hasta $3,000',
    baggageProtection: 1000,
    emergencyEvacuation: 100000,
    adventureActivities: true,
    rentalCarCoverage: 25000,
    features: [
      'Asistencia médica por accidente o enfermedad',
      'Cobertura para deportes de aventura moderados',
      'Compensación por demora de vuelo',
      'Reembolso por cancelación de viaje',
      'Protección de equipaje y efectos personales',
      'Cobertura para dispositivos electrónicos',
      'Asistencia legal en el extranjero'
    ],
    restrictions: [
      'Cobertura limitada para enfermedades preexistentes',
      'Exclusiones para deportes extremos específicos'
    ],
    rating: 4.7,
    reviews: 249,
    country: 'Internacional',
    description: 'Plan diseñado para viajeros frecuentes con cobertura extendida y beneficios adicionales para múltiples viajes. Incluye cobertura para actividades de aventura moderadas.'
  },
  
  // IATI Plans
  {
    id: 3,
    name: 'IATI Estándar',
    provider: 'IATI',
    logo: require('../assets/logos/iati-logo.png'),
    basePrice: 45,
    medicalCoverage: 50000,
    tripCancellation: 'Hasta $2,000',
    baggageProtection: 800,
    emergencyEvacuation: 75000,
    adventureActivities: false,
    rentalCarCoverage: 0,
    features: [
      'Gastos médicos por enfermedad o accidente',
      'Repatriación o transporte sanitario',
      'Regreso anticipado por fallecimiento de familiar',
      'Robo y daños materiales al equipaje',
      'Responsabilidad civil privada',
      'Seguro de accidentes'
    ],
    restrictions: [
      'Excluye países en conflicto bélico',
      'No cubre cancelaciones por restricciones gubernamentales',
      'No cubre deportes de aventura'
    ],
    rating: 4.5,
    reviews: 183,
    country: 'Internacional',
    description: 'Seguro de viaje equilibrado con buena relación calidad-precio, pensado para viajeros que buscan tranquilidad sin costos excesivos.'
  },
  {
    id: 4,
    name: 'IATI Premium',
    provider: 'IATI',
    logo: require('../assets/logos/iati-logo.png'),
    basePrice: 85,
    medicalCoverage: 200000,
    tripCancellation: 'Hasta $5,000',
    baggageProtection: 1500,
    emergencyEvacuation: 150000,
    adventureActivities: true,
    rentalCarCoverage: 35000,
    features: [
      'Gastos médicos ilimitados en algunos países',
      'Prolongación de estancia en hotel por cuarentena',
      'Cobertura para deportes de aventura',
      'Seguro de dispositivos electrónicos premium',
      'Indemnización por pérdida de enlaces',
      'Asistencia médica a familiares en domicilio',
      'Envío de medicamentos al extranjero',
      'Servicio de intérprete en emergencias'
    ],
    restrictions: [
      'Limitaciones en viajes a zonas de alto riesgo',
      'Restricciones para personas mayores de 70 años'
    ],
    rating: 4.9,
    reviews: 312,
    country: 'Internacional',
    description: 'Plan premium con la máxima cobertura para viajeros exigentes. Incluye asistencia personalizada 24/7 y coberturas extendidas para situaciones inesperadas.'
  },
  
  // Assist Card Plans
  {
    id: 5,
    name: 'AC 60',
    provider: 'Assist Card',
    logo: require('../assets/logos/assist-card-logo.png'),
    basePrice: 40,
    medicalCoverage: 60000,
    tripCancellation: 'Hasta $1,800',
    baggageProtection: 700,
    emergencyEvacuation: 60000,
    adventureActivities: false,
    rentalCarCoverage: 0,
    features: [
      'Asistencia médica por enfermedad y accidente',
      'Asistencia médica en caso de COVID-19',
      'Traslado y repatriación sanitaria',
      'Orientación médica telefónica 24h',
      'Compensación por demora de equipaje',
      'Transferencia de fondos y fianzas penales',
      'Asistencia en caso de extravío de documentos'
    ],
    restrictions: [
      'No cubre deportes de riesgo',
      'Preexistencias solo en caso de emergencia',
      'No cubre embarazos a partir de la semana 24'
    ],
    rating: 4.4,
    reviews: 156,
    country: 'Internacional',
    description: 'Solución ideal para viajeros que buscan una buena cobertura médica con asistencia garantizada en cualquier parte del mundo.'
  },
  {
    id: 6,
    name: 'AC 250',
    provider: 'Assist Card',
    logo: require('../assets/logos/assist-card-logo.png'),
    basePrice: 75,
    medicalCoverage: 250000,
    tripCancellation: 'Hasta $4,000',
    baggageProtection: 1300,
    emergencyEvacuation: 150000,
    adventureActivities: true,
    rentalCarCoverage: 20000,
    features: [
      'Asistencia médica por enfermedad y accidente',
      'Cobertura para deportes de invierno y aventura',
      'Compensación por cancelación de viaje',
      'Garantía de regreso (extensión de estancia)',
      'Traslado de ejecutivo en caso de emergencia',
      'Compensación por vuelo demorado o cancelado',
      'Secure Gift para compras en viaje',
      'Transmisión de mensajes urgentes',
      'Upgrade tecnológico para dispositivos electrónicos'
    ],
    restrictions: [
      'Limitaciones en cobertura para mayores de 75 años',
      'Exclusiones específicas para deportes extremos como paracaidismo'
    ],
    rating: 4.8,
    reviews: 278,
    country: 'Internacional',
    description: 'Plan superior para viajeros que buscan máxima protección. Incluye coberturas especiales para deportes de aventura y asistencia premium.'
  },
  
  // Starr Plans
  {
    id: 7,
    name: 'Starr Basic',
    provider: 'Starr',
    logo: require('../assets/logos/starr-logo.png'),
    basePrice: 30,
    medicalCoverage: 25000,
    tripCancellation: 'Hasta $1,000',
    baggageProtection: 500,
    emergencyEvacuation: 40000,
    adventureActivities: false,
    rentalCarCoverage: 0,
    features: [
      'Cobertura médica por accidente',
      'Medicamentos por prescripción médica',
      'Repatriación de restos',
      'Asistencia en viaje 24h',
      'Reembolso por gastos de hotel por convalecencia'
    ],
    restrictions: [
      'No cubre enfermedades preexistentes',
      'No cubre pérdida de equipaje, solo daños',
      'Cobertura limitada para adultos mayores de 65 años'
    ],
    rating: 4.0,
    reviews: 98,
    country: 'Internacional',
    description: 'Plan económico con coberturas esenciales para viajeros con presupuesto limitado que buscan protección básica.'
  },
  {
    id: 8,
    name: 'Starr Premier',
    provider: 'Starr',
    logo: require('../assets/logos/starr-logo.png'),
    basePrice: 95,
    medicalCoverage: 300000,
    tripCancellation: 'Hasta $6,000',
    baggageProtection: 2000,
    emergencyEvacuation: 200000,
    adventureActivities: true,
    rentalCarCoverage: 50000,
    features: [
      'Cobertura médica extendida',
      'Servicio de telemedicina global',
      'Compensación por interrupción de viaje',
      'Protección premium para equipaje',
      'Cobertura para deportes de aventura',
      'Reembolso de gastos por demora de viaje',
      'Pérdida de conexiones',
      'Concierge médico personal',
      'Cobertura de evacuación por desastres naturales'
    ],
    restrictions: [
      'Evaluación previa para mayores de 80 años',
      'Ciertas limitaciones en países con alertas de viaje'
    ],
    rating: 4.9,
    reviews: 342,
    country: 'Internacional',
    description: 'Nuestro plan más completo con coberturas extensas y servicios premium para viajeros que buscan la máxima protección y tranquilidad.'
  },
  
  // SURA Plans
  {
    id: 9,
    name: 'SURA Clásico',
    provider: 'SURA',
    logo: require('../assets/logos/sura-logo.png'),
    basePrice: 42,
    medicalCoverage: 40000,
    tripCancellation: 'Hasta $1,500',
    baggageProtection: 600,
    emergencyEvacuation: 60000,
    adventureActivities: false,
    rentalCarCoverage: 0,
    features: [
      'Gastos médicos por accidente o enfermedad',
      'Traslado médico de emergencia',
      'Medicamentos ambulatorios',
      'Odontología de emergencia',
      'Compensación por pérdida de equipaje',
      'Asistencia por pérdida de pasaporte',
      'Repatriación funeraria'
    ],
    restrictions: [
      'Solo para residentes de países latinoamericanos',
      'No cubre enfermedades crónicas o preexistentes',
      'No incluye deportes de riesgo o aventura'
    ],
    rating: 4.3,
    reviews: 132,
    country: 'Latinoamérica',
    description: 'Cobertura diseñada para viajeros latinoamericanos con asistencia especial en español y amplia red de proveedores en América.'
  },
  {
    id: 10,
    name: 'SURA Global',
    provider: 'SURA',
    logo: require('../assets/logos/sura-logo.png'),
    basePrice: 80,
    medicalCoverage: 150000,
    tripCancellation: 'Hasta $4,500',
    baggageProtection: 1200,
    emergencyEvacuation: 120000,
    adventureActivities: true,
    rentalCarCoverage: 30000,
    features: [
      'Asistencia médica completa',
      'Gastos por hospitalización y cirugía',
      'Cobertura COVID-19 mejorada',
      'Compensación por cancelación o interrupción',
      'Protección para deportes de aventura',
      'Asistencia tecnológica para dispositivos',
      'Indemnización por robo en cajeros',
      'Asesoría legal internacional',
      'Compensación por retraso de vuelo',
      'Garantía de regreso anticipado por catástrofe'
    ],
    restrictions: [
      'Limitaciones en países con conflictos activos',
      'Evaluación médica previa para mayores de 70 años'
    ],
    rating: 4.6,
    reviews: 215,
    country: 'Internacional',
    description: 'Plan premium con coberturas globales extendidas y servicios especializados para viajeros latinoamericanos que recorren el mundo.'
  }
];