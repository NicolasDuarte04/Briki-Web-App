import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Button } from "./ui/button";
import { Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// Available languages
export type Language = 'en' | 'es' | 'pt';

// Translation dictionary type
type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

// Initial translations
const translations: Translations = {
  en: {
    // Navigation
    home: 'Home',
    myTrips: 'My Trips',
    insurancePlans: 'Insurance Plans',
    travelInsurance: 'Travel Insurance',
    autoInsurance: 'Auto Insurance',
    petInsurance: 'Pet Insurance',
    healthInsurance: 'Health Insurance',
    support: 'Support',
    signIn: 'Sign in',
    signUp: 'Sign up',
    
    // Landing Page - Hero Section
    'hero.badge': 'New: AI-Powered Insurance Assistant',
    'hero.title1': 'Find Your Perfect',
    'hero.title2': 'Insurance',
    'hero.title3': '',
    'hero.subtitle': "Colombia's first AI-powered insurance platform. Compare plans, get instant quotes, and make informed decisions with our smart assistant.",
    'hero.ctaAI': 'Start with AI Assistant',
    'hero.ctaBrowse': 'Browse Insurance Plans',
    'hero.secure': 'Secure & Private',
    'hero.users': '50,000+ Users',
    'hero.rating': '4.8/5 Rating',
    'hero.instant': 'Instant Quotes',
    
    // Landing Page - PDF Summary Section
    'pdf.badge': 'AI-Powered Analysis',
    'pdf.title': 'Upload Your Documents,',
    'pdf.titleHighlight': 'Get Instant Insights',
    'pdf.description': 'Our AI assistant can analyze your existing insurance documents, medical records, and financial information to provide personalized recommendations and identify coverage gaps.',
    'pdf.step1.title': 'Upload Documents',
    'pdf.step1.description': 'Drag & drop your insurance PDFs, medical records, or financial documents',
    'pdf.step2.title': 'AI Analysis',
    'pdf.step2.description': 'Our AI extracts key information and identifies your coverage needs',
    'pdf.step3.title': 'Personalized Recommendations',
    'pdf.step3.description': 'Get tailored insurance suggestions based on your unique situation',
    'pdf.cta': 'Try Document Analysis',
    'pdf.upload.title': 'Drop your documents here',
    'pdf.upload.subtitle': 'Or click to browse files',
    'pdf.processing': 'AI Processing...',
    'pdf.success1': 'Document scanned successfully',
    'pdf.success2': 'Key information extracted',
    'pdf.success3': 'Coverage gaps identified',
    
    // Landing Page - Product Demo Section
    'demo.badge': 'Live Platform',
    'demo.title': 'See How Easy It Is to',
    'demo.titleHighlight': 'Find Your Perfect Plan',
    'demo.description': 'Watch our platform in action and discover how Briki simplifies insurance shopping with AI-powered recommendations.',
    'demo.feature1.title': 'Smart Search',
    'demo.feature1.description': 'AI understands your needs instantly',
    'demo.feature2.title': 'Real-Time Quotes',
    'demo.feature2.description': 'Compare prices from multiple providers',
    'demo.feature3.title': 'Expert Guidance',
    'demo.feature3.description': '24/7 AI assistant answers all questions',
    'demo.cta': 'Start Your Search',
    
    // Landing Page - AI Explainer Section
    'ai.badge': 'Powered by Advanced AI',
    'ai.title': 'Your Personal',
    'ai.titleHighlight': 'Insurance Expert',
    'ai.description': 'Our AI assistant combines cutting-edge technology with deep insurance knowledge to provide personalized recommendations tailored to your unique needs.',
    'ai.feature1.title': 'Natural Conversations',
    'ai.feature1.description': 'Chat naturally in Spanish or English about your insurance needs',
    'ai.feature2.title': 'Document Analysis',
    'ai.feature2.description': 'Upload existing policies for instant coverage gap analysis',
    'ai.feature3.title': 'Smart Recommendations',
    'ai.feature3.description': 'Get personalized suggestions based on your profile',
    'ai.feature4.title': 'Always Learning',
    'ai.feature4.description': 'Our AI improves with every interaction',
    
    // Landing Page - Stats Section
    'stats.title': 'Trusted by Thousands',
    'stats.subtitle': 'Join the growing community of smart insurance shoppers',
    'stats.users': 'Active Users',
    'stats.plans': 'Insurance Plans',
    'stats.savings': 'Average Savings',
    'stats.rating': 'User Rating',
    
    // Landing Page - Testimonials Section
    'testimonials.title': 'What Our Users Say',
    'testimonials.subtitle': 'Real stories from people who found better insurance with Briki',
    
    // Landing Page - Final CTA Section
    'cta.title': 'Ready to Find Your Perfect Insurance?',
    'cta.subtitle': 'Join thousands who are saving time and money with Briki',
    'cta.button': 'Get Started Now',
    'cta.demo': 'Schedule a Demo',
    
    // Footer
    'footer.tagline': 'Insurance simplified.',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
    
    // Trip Form
    tripDetails: 'Trip details',
    countryOfOrigin: 'Country of Origin',
    destination: 'Destination Country',
    departureDate: 'Departure Date',
    returnDate: 'Return Date',
    numTravelers: 'Number of Travelers',
    primaryTravelerAge: 'Age of Primary Traveler',
    age: 'Age',
    medicalConditions: 'Do you have any pre-existing medical conditions?',
    coveragePriorities: 'Coverage Priorities (select up to 3)',
    selectCountryOfOrigin: 'Select country of origin',
    selectDestination: 'Select destination country',
    selectNumTravelers: 'Select number of travelers',
    noCountryFound: 'No country found',
    searchCountry: 'Search country...',
    
    // Insurance coverage types
    medicalCoverage: 'Medical Coverage',
    tripCancellation: 'Trip Cancellation',
    baggageProtection: 'Baggage Protection', 
    emergencyEvacuation: 'Emergency Evacuation',
    adventureActivities: 'Adventure Activities',
    carRental: 'Car Rental Coverage',
    
    // Actions and Buttons
    findPlans: 'Find Plans',
    save: 'Save',
    continue: 'Continue',
    back: 'Back',
    viewMore: 'View More',
    
    // Weather Risk Page
    weatherRisks: 'Weather Risks',
    weatherRisksDescription: 'View climate risks and recommendations for your travel insurance',
    travelMonth: 'Travel Month',
    safetyIndex: 'Safety Index',
    safetyLevel: 'Safety Level',
    highRisk: 'High Risk',
    moderateRisk: 'Moderate Risk',
    lowRisk: 'Low Risk',
    climateRiskFactors: 'Climate Risk Factors',
    insuranceRecommendation: 'Insurance Recommendation',
    noSignificantRisks: 'No significant climate risks for this destination',
    selectDestinationView: 'Select a destination to view its climate risks',
    
    // Checkout
    checkoutTitle: 'Complete Your Purchase',
    planDetails: 'Plan Details',
    totalPrice: 'Total Price',
    paymentInformation: 'Payment Information',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cvc: 'CVC',
    payNow: 'Pay Now',
    
    // Months
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    
    // Toast messages
    tripInfoSaved: 'Trip information saved',
    findingBestPlans: 'We\'re finding the best insurance plans for your trip.',
    failedToSaveTrip: 'Failed to save trip information',
    
    // Learn More Page
    aboutBriki: 'About Briki',
    ourMission: 'Our Mission',
    missionDescription: 'Briki makes comparing and purchasing travel insurance simple and fast, helping you find the right coverage from top providers in under 2 minutes.',
    travelConfidence: 'Travel with confidence, insured by the best',
    quickAndEasy: 'Quick & Easy',
    quickAndEasyDescription: 'Find and purchase the perfect travel insurance policy in under 2 minutes, with a simple and intuitive interface designed for your convenience.',
    trustedProviders: 'Trusted Providers',
    trustedProvidersDescription: 'We partner with leading insurance companies to offer you high-quality coverage options you can trust, whether you\'re traveling for business or leisure.',
    securePayments: 'Secure Payments',
    securePaymentsDescription: 'All transactions are processed securely through Stripe, ensuring your payment information remains protected at all times.',
    whyChooseBriki: 'Why Choose Briki',
    whyChoosePoint1: 'Instant comparison of multiple travel insurance plans',
    whyChoosePoint2: 'Transparent pricing with no hidden fees',
    whyChoosePoint3: 'Secure and immediate policy confirmation',
    whyChoosePoint4: 'Exceptional customer support throughout your journey',
    startYourJourney: 'Start Your Journey',
    startYourJourneyDescription: 'Ready to explore the world with peace of mind? Find the perfect travel insurance plan for your next adventure with Briki.',
    findPlanNow: 'Find My Plan Now',
    
    // Terms of Service Page
    termsOfService: 'Terms of Service',
    lastUpdated: 'Last updated',
    introduction: 'Introduction',
    termsIntro: 'Welcome to Briki! These Terms of Service ("Terms") govern your use of the Briki application and services. By using Briki, you agree to these Terms in their entirety. Please read them carefully.',
    userObligations: 'User Obligations',
    userObligationsText1: 'When using Briki, you agree to provide accurate and complete information, especially when purchasing travel insurance plans. Providing false information may invalidate your insurance coverage.',
    userObligationsText2: 'You agree to use our services in compliance with all applicable laws and regulations, and not to engage in any activity that may disrupt or interfere with the proper functioning of Briki.',
    limitationOfLiability: 'Limitation of Liability',
    limitationOfLiabilityText1: 'Briki acts as a comparison platform and facilitator for travel insurance policies. We are not the insurer, and all coverage is provided by our third-party insurance partners.',
    limitationOfLiabilityText2: 'While we strive to provide accurate information, Briki is not liable for any damages or losses related to your reliance on information obtained through our services, or for any disputes that may arise between you and the insurance providers.',
    noWarranty: 'No Warranty',
    noWarrantyText: 'Briki provides its services "as is" and "as available" without warranties of any kind, either express or implied. The availability, pricing, and terms of insurance plans are subject to change based on our partner providers\' policies.',
    purchaseAgreements: 'Purchase Agreements',
    purchaseAgreementsText1: 'When you purchase an insurance plan through Briki, you enter into a direct contractual relationship with the insurance provider. The terms of your coverage are determined by the policy issued by the insurance provider.',
    purchaseAgreementsText2: 'Briki facilitates the transaction but is not responsible for the fulfillment of insurance claims or disputes related to coverage. Such matters should be addressed directly with the insurance provider.',
    refundPolicy: 'Refund Policy',
    refundPolicyText: 'All refund requests for insurance plans purchased through Briki are subject to the cancellation and refund policies of the specific insurance provider. Please review the provider\'s terms before completing your purchase.',
    intellectualProperty: 'Intellectual Property',
    intellectualPropertyText: 'The Briki application, including its content, features, and functionality, is owned by Briki and protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our explicit permission.',
    governingLaw: 'Governing Law',
    governingLawText: 'These Terms are governed by the laws of Colombia and Mexico, depending on your location. Any disputes arising from your use of Briki will be resolved in the appropriate courts of these jurisdictions.',
    contactUs: 'Contact Us',
    contactUsText: 'If you have any questions or concerns about these Terms, please contact our customer support team at contact@briki.app:',

    // Common elements
    yes: 'Yes',
    no: 'No',
    loading: 'Loading...',
    dataUpdatedRegularly: 'Data updated regularly',
    dataSource: 'Source: International meteorological data'
  },
  es: {
    // Navigation
    home: 'Inicio',
    myTrips: 'Mis Viajes',
    insurancePlans: 'Seguros de Viaje',
    travelInsurance: 'Seguro de Viaje',
    autoInsurance: 'Seguro de Auto',
    petInsurance: 'Seguro de Mascotas',
    healthInsurance: 'Seguro de Salud',
    support: 'Soporte',
    signIn: 'Iniciar sesión',
    signUp: 'Crear cuenta',
    
    // Landing Page - Hero Section
    'hero.badge': 'Nuevo: Asistente de Seguros AI',
    'hero.title1': 'Encuentra tu',
    'hero.title2': 'Seguro Perfecto',
    'hero.title3': '',
    'hero.subtitle': 'La primera plataforma de seguros de Colombia impulsada por IA. Compara planes, obtén cotizaciones instantáneas y toma decisiones informadas con nuestro asistente inteligente.',
    'hero.ctaAI': 'Comienza con el Asistente AI',
    'hero.ctaBrowse': 'Explora Planes de Seguros',
    'hero.secure': 'Seguro & Privado',
    'hero.users': '50,000+ Usuarios',
    'hero.rating': '4.8/5 Calificación',
    'hero.instant': 'Cotizaciones Instantáneas',
    
    // Landing Page - PDF Summary Section
    'pdf.badge': 'Análisis AI',
    'pdf.title': 'Sube tus documentos,',
    'pdf.titleHighlight': 'Obtén Insights Instantáneos',
    'pdf.description': 'Nuestro asistente de IA puede analizar tus documentos de seguro existentes, registros médicos y información financiera para proporcionar recomendaciones personalizadas y identificar brechas de cobertura.',
    'pdf.step1.title': 'Sube Documentos',
    'pdf.step1.description': 'Arrastra y suelta tus PDFs de seguro, registros médicos o documentos financieros',
    'pdf.step2.title': 'Análisis AI',
    'pdf.step2.description': 'Nuestro IA extrae la información clave y identifica tus necesidades de cobertura',
    'pdf.step3.title': 'Recomendaciones Personalizadas',
    'pdf.step3.description': 'Obtén sugerencias de seguro adaptadas a tu situación única',
    'pdf.cta': 'Prueba Análisis de Documentos',
    'pdf.upload.title': 'Suelta tus documentos aquí',
    'pdf.upload.subtitle': 'O haz clic para buscar archivos',
    'pdf.processing': 'Procesando AI...',
    'pdf.success1': 'Documento escaneado con éxito',
    'pdf.success2': 'Información clave extraída',
    'pdf.success3': 'Brechas de cobertura identificadas',
    
    // Landing Page - Product Demo Section
    'demo.badge': 'Plataforma en Vivo',
    'demo.title': '¡Ve cómo es fácil',
    'demo.titleHighlight': 'Encontrar tu plan perfecto!',
    'demo.description': '¡Mira nuestra plataforma en acción y descubre cómo Briki simplifica la compra de seguros con recomendaciones impulsadas por IA!',
    'demo.feature1.title': 'Búsqueda Inteligente',
    'demo.feature1.description': 'La IA entiende tus necesidades instantáneamente',
    'demo.feature2.title': 'Cotizaciones en Tiempo Real',
    'demo.feature2.description': 'Compara precios de múltiples proveedores',
    'demo.feature3.title': 'Guía Experta',
    'demo.feature3.description': 'La asistente de IA 24/7 responde todas las preguntas',
    'demo.cta': 'Comienza tu búsqueda',
    
    // Landing Page - AI Explainer Section
    'ai.badge': 'Potenciado por IA Avanzada',
    'ai.title': 'Tu Experto en',
    'ai.titleHighlight': 'Seguros',
    'ai.description': 'Nuestro asistente de IA combina tecnología de vanguardia con conocimientos profundos en seguros para proporcionar recomendaciones personalizadas adaptadas a tus necesidades únicas.',
    'ai.feature1.title': 'Conversaciones Naturales',
    'ai.feature1.description': 'Charla naturalmente en español o inglés sobre tus necesidades de seguro',
    'ai.feature2.title': 'Análisis de Documentos',
    'ai.feature2.description': 'Sube polizas existentes para análisis de brechas de cobertura instantáneo',
    'ai.feature3.title': 'Recomendaciones Inteligentes',
    'ai.feature3.description': 'Obtén sugerencias personalizadas basadas en tu perfil',
    'ai.feature4.title': 'Siempre Aprendiendo',
    'ai.feature4.description': 'Nuestra IA se mejora con cada interacción',
    
    // Landing Page - Stats Section
    'stats.title': 'Confiados por Miles',
    'stats.subtitle': 'Únete a la comunidad creciente de compradores de seguros inteligentes',
    'stats.users': 'Usuarios Activos',
    'stats.plans': 'Planes de Seguros',
    'stats.savings': 'Ahorros Promedio',
    'stats.rating': 'Calificación de Usuarios',
    
    // Landing Page - Testimonials Section
    'testimonials.title': 'Lo que dicen nuestros usuarios',
    'testimonials.subtitle': 'Historias reales de personas que encontraron mejores seguros con Briki',
    
    // Landing Page - Final CTA Section
    'cta.title': '¿Listo para encontrar tu seguro perfecto?',
    'cta.subtitle': 'Únete a miles que están ahorrando tiempo y dinero con Briki',
    'cta.button': 'Comienza Ahora',
    'cta.demo': 'Programa una Demostración',
    
    // Footer
    'footer.tagline': 'Seguros simplificados.',
    'footer.terms': 'Términos',
    'footer.privacy': 'Privacidad',
    'footer.contact': 'Contacto',
    'footer.rights': 'Todos los derechos reservados.',
    
    // Trip Form
    tripDetails: 'Detalles del viaje',
    countryOfOrigin: 'País de Origen',
    destination: 'País de Destino',
    departureDate: 'Fecha de salida',
    returnDate: 'Fecha de regreso',
    numTravelers: 'Número de viajeros',
    primaryTravelerAge: 'Edad del viajero principal',
    age: 'Edad',
    medicalConditions: '¿Tienes alguna condición médica preexistente?',
    coveragePriorities: 'Prioridades de cobertura (selecciona hasta 3)',
    selectCountryOfOrigin: 'Selecciona país de origen',
    selectDestination: 'Selecciona país de destino',
    selectNumTravelers: 'Selecciona número de viajeros',
    noCountryFound: 'No se encontraron países',
    searchCountry: 'Buscar país...',
    
    // Insurance coverage types
    medicalCoverage: 'Cobertura médica',
    tripCancellation: 'Cancelación de viaje',
    baggageProtection: 'Protección de equipaje',
    emergencyEvacuation: 'Evacuación de emergencia',
    adventureActivities: 'Actividades de aventura',
    carRental: 'Cobertura de alquiler de auto',
    
    // Actions and Buttons
    findPlans: 'Buscar planes',
    save: 'Guardar',
    continue: 'Continuar',
    back: 'Atrás',
    viewMore: 'Ver más',
    
    // Weather Risk Page
    weatherRisks: 'Riesgos Climáticos',
    weatherRisksDescription: 'Visualización de riesgos climáticos y recomendaciones para tu seguro de viaje',
    travelMonth: 'Mes de viaje',
    safetyIndex: 'Índice de seguridad',
    safetyLevel: 'Nivel de seguridad',
    highRisk: 'Alto riesgo',
    moderateRisk: 'Riesgo moderado',
    lowRisk: 'Riesgo bajo',
    climateRiskFactors: 'Factores de riesgo climático',
    insuranceRecommendation: 'Recomendación de seguro',
    noSignificantRisks: 'No hay riesgos climáticos significativos para este destino',
    selectDestinationView: 'Selecciona un destino para ver sus riesgos climáticos',
    
    // Checkout
    checkoutTitle: 'Completa tu compra',
    planDetails: 'Detalles del plan',
    totalPrice: 'Precio total',
    paymentInformation: 'Información de pago',
    cardNumber: 'Número de tarjeta',
    expiryDate: 'Fecha de vencimiento',
    cvc: 'CVC',
    payNow: 'Pagar ahora',
    
    // Months
    january: 'Enero',
    february: 'Febrero',
    march: 'Marzo',
    april: 'Abril',
    may: 'Mayo',
    june: 'Junio',
    july: 'Julio',
    august: 'Agosto',
    september: 'Septiembre',
    october: 'Octubre',
    november: 'Noviembre',
    december: 'Diciembre',
    
    // Toast messages
    tripInfoSaved: 'Información del viaje guardada',
    findingBestPlans: 'Estamos buscando los mejores seguros para tu viaje.',
    failedToSaveTrip: 'Error al guardar la información del viaje',
    
    // Learn More Page
    aboutBriki: 'Acerca de Briki',
    ourMission: 'Nuestra Misión',
    missionDescription: 'Briki hace que comparar y comprar seguros de viaje sea simple y rápido, ayudándote a encontrar la cobertura adecuada de los mejores proveedores en menos de 2 minutos.',
    travelConfidence: 'Viaja con confianza, asegurado por los mejores',
    quickAndEasy: 'Rápido y Fácil',
    quickAndEasyDescription: 'Encuentra y compra la póliza de seguro de viaje perfecta en menos de 2 minutos, con una interfaz simple e intuitiva diseñada para tu comodidad.',
    trustedProviders: 'Proveedores Confiables',
    trustedProvidersDescription: 'Nos asociamos con compañías de seguros líderes para ofrecerte opciones de cobertura de alta calidad en las que puedes confiar, ya sea que viajes por negocios o por placer.',
    securePayments: 'Pagos Seguros',
    securePaymentsDescription: 'Todas las transacciones se procesan de manera segura a través de Stripe, garantizando que tu información de pago se mantenga protegida en todo momento.',
    whyChooseBriki: '¿Por qué elegir Briki?',
    whyChoosePoint1: 'Comparación instantánea de múltiples planes de seguro de viaje',
    whyChoosePoint2: 'Precios transparentes sin tarifas ocultas',
    whyChoosePoint3: 'Confirmación segura e inmediata de la póliza',
    whyChoosePoint4: 'Soporte excepcional al cliente durante todo tu viaje',
    startYourJourney: 'Comienza Tu Viaje',
    startYourJourneyDescription: '¿Listo para explorar el mundo con tranquilidad? Encuentra el plan de seguro de viaje perfecto para tu próxima aventura con Briki.',
    findPlanNow: 'Encuentra Mi Plan Ahora',
    
    // Terms of Service Page
    termsOfService: 'Términos de Servicio',
    lastUpdated: 'Última actualización',
    introduction: 'Introducción',
    termsIntro: '¡Bienvenido a Briki! Estos Términos de Servicio ("Términos") rigen tu uso de la aplicación y los servicios de Briki. Al usar Briki, aceptas estos Términos en su totalidad. Por favor, léelos cuidadosamente.',
    userObligations: 'Obligaciones del Usuario',
    userObligationsText1: 'Al usar Briki, aceptas proporcionar información precisa y completa, especialmente al comprar planes de seguro de viaje. Proporcionar información falsa puede invalidar tu cobertura de seguro.',
    userObligationsText2: 'Aceptas utilizar nuestros servicios de conformidad con todas las leyes y regulaciones aplicables, y no participar en ninguna actividad que pueda interrumpir o interferir con el correcto funcionamiento de Briki.',
    limitationOfLiability: 'Limitación de Responsabilidad',
    limitationOfLiabilityText1: 'Briki actúa como una plataforma de comparación y facilitador de pólizas de seguro de viaje. No somos la aseguradora, y toda la cobertura es proporcionada por nuestros socios aseguradores externos.',
    limitationOfLiabilityText2: 'Aunque nos esforzamos por proporcionar información precisa, Briki no es responsable de ningún daño o pérdida relacionada con tu confianza en la información obtenida a través de nuestros servicios, o por cualquier disputa que pueda surgir entre tú y los proveedores de seguros.',
    noWarranty: 'Sin Garantía',
    noWarrantyText: 'Briki proporciona sus servicios "tal cual" y "según disponibilidad" sin garantías de ningún tipo, ya sean expresas o implícitas. La disponibilidad, precios y términos de los planes de seguro están sujetos a cambios según las políticas de nuestros proveedores asociados.',
    purchaseAgreements: 'Acuerdos de Compra',
    purchaseAgreementsText1: 'Cuando compras un plan de seguro a través de Briki, entras en una relación contractual directa con el proveedor de seguros. Los términos de tu cobertura están determinados por la póliza emitida por el proveedor de seguros.',
    purchaseAgreementsText2: 'Briki facilita la transacción pero no es responsable del cumplimiento de las reclamaciones de seguros o disputas relacionadas con la cobertura. Tales asuntos deben abordarse directamente con el proveedor de seguros.',
    refundPolicy: 'Política de Reembolso',
    refundPolicyText: 'Todas las solicitudes de reembolso para planes de seguro comprados a través de Briki están sujetas a las políticas de cancelación y reembolso del proveedor de seguros específico. Por favor, revisa los términos del proveedor antes de completar tu compra.',
    intellectualProperty: 'Propiedad Intelectual',
    intellectualPropertyText: 'La aplicación Briki, incluido su contenido, características y funcionalidad, es propiedad de Briki y está protegida por derechos de autor, marcas comerciales y otras leyes de propiedad intelectual. No puedes reproducir, distribuir, modificar o crear trabajos derivados sin nuestro permiso explícito.',
    governingLaw: 'Ley Aplicable',
    governingLawText: 'Estos Términos se rigen por las leyes de Colombia y México, dependiendo de tu ubicación. Cualquier disputa que surja de tu uso de Briki se resolverá en los tribunales correspondientes de estas jurisdicciones.',
    contactUs: 'Contáctanos',
    contactUsText: 'Si tienes alguna pregunta o inquietud sobre estos Términos, por favor contacta a nuestro equipo de soporte al cliente en contact@briki.app:',
    
    // Common elements
    yes: 'Sí',
    no: 'No',
    loading: 'Cargando...',
    dataUpdatedRegularly: 'Datos actualizados regularmente',
    dataSource: 'Fuente: Datos meteorológicos internacionales'
  },
  pt: {
    // Navigation
    home: 'Início',
    myTrips: 'Minhas Viagens',
    insurancePlans: 'Seguros de Viagem',
    travelInsurance: 'Seguro de Viagem',
    autoInsurance: 'Seguro de Auto',
    petInsurance: 'Seguro de Animais',
    healthInsurance: 'Seguro de Saúde',
    support: 'Suporte',
    signIn: 'Entrar',
    signUp: 'Criar conta',
    
    // Landing Page - Hero Section
    'hero.badge': 'Novo: Assistente de Seguros AI',
    'hero.title1': 'Encontre seu',
    'hero.title2': 'Seguro Perfeito',
    'hero.title3': '',
    'hero.subtitle': 'A primeira plataforma de seguros de Colômbia impulsada pela IA. Compare planos, obtenha cotações instantâneas e tome decisões informadas com nosso assistente inteligente.',
    'hero.ctaAI': 'Comece com o Assistente AI',
    'hero.ctaBrowse': 'Explore Planos de Seguro',
    'hero.secure': 'Seguro & Privado',
    'hero.users': '50,000+ Usuários',
    'hero.rating': '4.8/5 Avaliação',
    'hero.instant': 'Cotações Instantâneas',
    
    // Landing Page - PDF Summary Section
    'pdf.badge': 'Análise AI',
    'pdf.title': 'Suba seus documentos,',
    'pdf.titleHighlight': 'Obtenha Insights Instantâneos',
    'pdf.description': 'Nosso assistente de IA pode analisar seus documentos de seguro existentes, registros médicos e informações financeiras para fornecer recomendações personalizadas e identificar brechas de cobertura.',
    'pdf.step1.title': 'Suba Documentos',
    'pdf.step1.description': 'Arraste e solte seus PDFs de seguro, registros médicos ou documentos financeiros',
    'pdf.step2.title': 'Análise AI',
    'pdf.step2.description': 'Nossa IA extrai a informação chave e identifica suas necessidades de cobertura',
    'pdf.step3.title': 'Recomendações Personalizadas',
    'pdf.step3.description': 'Obtenha sugestões de seguro adaptadas à sua situação única',
    'pdf.cta': 'Experimente Análise de Documentos',
    'pdf.upload.title': 'Solte seus documentos aqui',
    'pdf.upload.subtitle': 'Ou clique para procurar arquivos',
    'pdf.processing': 'Processando AI...',
    'pdf.success1': 'Documento escaneado com sucesso',
    'pdf.success2': 'Informação chave extraída',
    'pdf.success3': 'Brechas de cobertura identificadas',
    
    // Landing Page - Product Demo Section
    'demo.badge': 'Plataforma em Vivo',
    'demo.title': 'Veja como é fácil',
    'demo.titleHighlight': 'Encontrar seu plano perfeito!',
    'demo.description': 'Veja nossa plataforma em ação e descubra como o Briki simplifica a compra de seguros com recomendações impulsionadas pela IA!',
    'demo.feature1.title': 'Busca Inteligente',
    'demo.feature1.description': 'A IA entende suas necessidades instantaneamente',
    'demo.feature2.title': 'Cotações em Tempo Real',
    'demo.feature2.description': 'Compare preços de múltiplos fornecedores',
    'demo.feature3.title': 'Guia Experta',
    'demo.feature3.description': 'A assistente de IA 24/7 responde todas as perguntas',
    'demo.cta': 'Comece sua busca',
    
    // Landing Page - AI Explainer Section
    'ai.badge': 'Potenciado por IA Avançada',
    'ai.title': 'Seu Especialista em',
    'ai.titleHighlight': 'Seguros',
    'ai.description': 'Nosso assistente de IA combina tecnologia de ponta com conhecimento profundo em seguros para fornecer recomendações personalizadas adaptadas às suas necessidades únicas.',
    'ai.feature1.title': 'Conversas Naturais',
    'ai.feature1.description': 'Fale naturalmente em português ou inglês sobre suas necessidades de seguro',
    'ai.feature2.title': 'Análise de Documentos',
    'ai.feature2.description': 'Suba políticas existentes para análise de brechas de cobertura instantânea',
    'ai.feature3.title': 'Recomendações Inteligentes',
    'ai.feature3.description': 'Obtenha sugestões personalizadas baseadas em seu perfil',
    'ai.feature4.title': 'Sempre Aprendendo',
    'ai.feature4.description': 'Nossa IA se melhora com cada interação',
    
    // Landing Page - Stats Section
    'stats.title': 'Confiança de Milhares',
    'stats.subtitle': 'Junte-se à comunidade crescente de compradores de seguros inteligentes',
    'stats.users': 'Usuários Ativos',
    'stats.plans': 'Planos de Seguros',
    'stats.savings': 'Economia Média',
    'stats.rating': 'Avaliação de Usuários',
    
    // Landing Page - Testimonials Section
    'testimonials.title': 'O que nossos usuários dizem',
    'testimonials.subtitle': 'Histórias reais de pessoas que encontraram seguros melhores com o Briki',
    
    // Landing Page - Final CTA Section
    'cta.title': 'Pronto para encontrar seu seguro perfeito?',
    'cta.subtitle': 'Junte-se a milhares que estão economizando tempo e dinheiro com o Briki',
    'cta.button': 'Comece Agora',
    'cta.demo': 'Agende uma Demonstração',
    
    // Footer
    'footer.tagline': 'Seguros simplificados.',
    'footer.terms': 'Termos',
    'footer.privacy': 'Privacidade',
    'footer.contact': 'Contato',
    'footer.rights': 'Todos os direitos reservados.',
    
    // Trip Form
    tripDetails: 'Detalhes da viagem',
    countryOfOrigin: 'País de Origem',
    destination: 'País de Destino',
    departureDate: 'Data de saída',
    returnDate: 'Data de retorno',
    numTravelers: 'Número de viajantes',
    primaryTravelerAge: 'Idade do viajante principal',
    age: 'Idade',
    medicalConditions: 'Você tem alguma condição médica preexistente?',
    coveragePriorities: 'Prioridades de cobertura (selecione até 3)',
    selectCountryOfOrigin: 'Selecione país de origem',
    selectDestination: 'Selecione país de destino',
    selectNumTravelers: 'Selecione número de viajantes',
    noCountryFound: 'Nenhum país encontrado',
    searchCountry: 'Buscar país...',
    
    // Insurance coverage types
    medicalCoverage: 'Cobertura médica',
    tripCancellation: 'Cancelamento de viagem',
    baggageProtection: 'Proteção de bagagem',
    emergencyEvacuation: 'Evacuação de emergência',
    adventureActivities: 'Atividades de aventura',
    carRental: 'Cobertura de aluguel de carro',
    
    // Actions and Buttons
    findPlans: 'Buscar planos',
    save: 'Salvar',
    continue: 'Continuar',
    back: 'Voltar',
    viewMore: 'Ver mais',
    
    // Weather Risk Page
    weatherRisks: 'Riscos Climáticos',
    weatherRisksDescription: 'Visualização de riscos climáticos e recomendações para seu seguro de viagem',
    travelMonth: 'Mês de viagem',
    safetyIndex: 'Índice de segurança',
    safetyLevel: 'Nível de segurança',
    highRisk: 'Alto risco',
    moderateRisk: 'Risco moderado',
    lowRisk: 'Baixo risco',
    climateRiskFactors: 'Fatores de risco climático',
    insuranceRecommendation: 'Recomendação de seguro',
    noSignificantRisks: 'Não há riscos climáticos significativos para este destino',
    selectDestinationView: 'Selecione um destino para ver seus riscos climáticos',
    
    // Checkout
    checkoutTitle: 'Complete sua compra',
    planDetails: 'Detalhes do plano',
    totalPrice: 'Preço total',
    paymentInformation: 'Informações de pagamento',
    cardNumber: 'Número do cartão',
    expiryDate: 'Data de validade',
    cvc: 'CVC',
    payNow: 'Pagar agora',
    
    // Months
    january: 'Janeiro',
    february: 'Fevereiro',
    march: 'Março',
    april: 'Abril',
    may: 'Maio',
    june: 'Junho',
    july: 'Julho',
    august: 'Agosto',
    september: 'Setembro',
    october: 'Outubro',
    november: 'Novembro',
    december: 'Dezembro',
    
    // Toast messages
    tripInfoSaved: 'Informações da viagem salvas',
    findingBestPlans: 'Estamos procurando os melhores seguros para sua viagem.',
    failedToSaveTrip: 'Erro ao salvar informações da viagem',
    
    // Learn More Page
    aboutBriki: 'Sobre o Briki',
    ourMission: 'Nossa Missão',
    missionDescription: 'O Briki torna a comparação e compra de seguros de viagem simples e rápida, ajudando você a encontrar a cobertura certa dos melhores provedores em menos de 2 minutos.',
    travelConfidence: 'Viaje com confiança, segurado pelos melhores',
    quickAndEasy: 'Rápido e Fácil',
    quickAndEasyDescription: 'Encontre e compre a apólice de seguro de viagem perfeita em menos de 2 minutos, com uma interface simples e intuitiva projetada para sua conveniência.',
    trustedProviders: 'Provedores Confiáveis',
    trustedProvidersDescription: 'Parceiramos com as principais companhias de seguros para oferecer opções de cobertura de alta qualidade em que você pode confiar, seja viajando a negócios ou lazer.',
    securePayments: 'Pagamentos Seguros',
    securePaymentsDescription: 'Todas as transações são processadas com segurança através do Stripe, garantindo que suas informações de pagamento permaneçam protegidas em todos os momentos.',
    whyChooseBriki: 'Por que escolher o Briki',
    whyChoosePoint1: 'Comparação instantânea de múltiplos planos de seguro de viagem',
    whyChoosePoint2: 'Preços transparentes sem taxas ocultas',
    whyChoosePoint3: 'Confirmação segura e imediata da apólice',
    whyChoosePoint4: 'Suporte excepcional ao cliente durante toda a sua jornada',
    startYourJourney: 'Inicie Sua Jornada',
    startYourJourneyDescription: 'Pronto para explorar o mundo com tranquilidade? Encontre o plano de seguro de viagem perfeito para sua próxima aventura com o Briki.',
    findPlanNow: 'Encontre Meu Plano Agora',
    
    // Terms of Service Page
    termsOfService: 'Termos de Serviço',
    lastUpdated: 'Última atualização',
    introduction: 'Introdução',
    termsIntro: 'Bem-vindo ao Briki! Estes Termos de Serviço ("Termos") regem o uso do aplicativo e serviços Briki. Ao usar o Briki, você concorda com estes Termos em sua totalidade. Por favor, leia-os cuidadosamente.',
    userObligations: 'Obrigações do Usuário',
    userObligationsText1: 'Ao usar o Briki, você concorda em fornecer informações precisas e completas, especialmente ao comprar planos de seguro de viagem. Fornecer informações falsas pode invalidar sua cobertura de seguro.',
    userObligationsText2: 'Você concorda em usar nossos serviços em conformidade com todas as leis e regulamentos aplicáveis, e não se envolver em qualquer atividade que possa interromper ou interferir com o funcionamento adequado do Briki.',
    limitationOfLiability: 'Limitação de Responsabilidade',
    limitationOfLiabilityText1: 'O Briki atua como uma plataforma de comparação e facilitador de apólices de seguro de viagem. Não somos a seguradora, e toda a cobertura é fornecida pelos nossos parceiros seguradores terceirizados.',
    limitationOfLiabilityText2: 'Embora nos esforcemos para fornecer informações precisas, o Briki não é responsável por quaisquer danos ou perdas relacionadas à sua confiança nas informações obtidas através de nossos serviços, ou por quaisquer disputas que possam surgir entre você e os provedores de seguros.',
    noWarranty: 'Sem Garantia',
    noWarrantyText: 'O Briki fornece seus serviços "como estão" e "conforme disponíveis" sem garantias de qualquer tipo, sejam expressas ou implícitas. A disponibilidade, preços e termos dos planos de seguro estão sujeitos a alterações com base nas políticas dos nossos provedores parceiros.',
    purchaseAgreements: 'Acordos de Compra',
    purchaseAgreementsText1: 'Quando você compra um plano de seguro através do Briki, você entra em uma relação contratual direta com o provedor de seguros. Os termos da sua cobertura são determinados pela apólice emitida pelo provedor de seguros.',
    purchaseAgreementsText2: 'O Briki facilita a transação, mas não é responsável pelo cumprimento de reclamações de seguro ou disputas relacionadas à cobertura. Tais assuntos devem ser tratados diretamente com o provedor de seguros.',
    refundPolicy: 'Política de Reembolso',
    refundPolicyText: 'Todos os pedidos de reembolso para planos de seguro comprados através do Briki estão sujeitos às políticas de cancelamento e reembolso do provedor de seguros específico. Por favor, reveja os termos do provedor antes de completar sua compra.',
    intellectualProperty: 'Propriedade Intelectual',
    intellectualPropertyText: 'O aplicativo Briki, incluindo seu conteúdo, recursos e funcionalidade, é de propriedade do Briki e protegido por direitos autorais, marcas registradas e outras leis de propriedade intelectual. Você não pode reproduzir, distribuir, modificar ou criar trabalhos derivados sem nossa permissão explícita.',
    governingLaw: 'Lei Aplicável',
    governingLawText: 'Estes Termos são regidos pelas leis da Colômbia e do México, dependendo da sua localização. Quaisquer disputas decorrentes do seu uso do Briki serão resolvidas nos tribunais apropriados dessas jurisdições.',
    contactUs: 'Contate-nos',
    contactUsText: 'Se você tiver alguma dúvida ou preocupação sobre estes Termos, por favor, entre em contato com nossa equipe de suporte ao cliente em contact@briki.app:',
    
    // Common elements
    yes: 'Sim',
    no: 'Não',
    loading: 'Carregando...',
    dataUpdatedRegularly: 'Dados atualizados regularmente',
    dataSource: 'Fonte: Dados meteorológicos internacionais'
  }
};

// Language context
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Detect browser language and default to Spanish for LATAM
  const detectLanguage = (): Language => {
    // Check localStorage first
    const stored = localStorage.getItem('briki-language');
    if (stored === 'es' || stored === 'en' || stored === 'pt') {
      return stored as Language;
    }
    
    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    
    // Default to Spanish for Spanish-speaking countries and regions
    if (browserLang.startsWith('es') || 
        browserLang.includes('-mx') || // Mexico
        browserLang.includes('-co') || // Colombia
        browserLang.includes('-ar') || // Argentina
        browserLang.includes('-pe') || // Peru
        browserLang.includes('-cl') || // Chile
        browserLang.includes('-ve') || // Venezuela
        browserLang.includes('-ec') || // Ecuador
        browserLang.includes('-bo') || // Bolivia
        browserLang.includes('-py') || // Paraguay
        browserLang.includes('-uy') || // Uruguay
        browserLang.includes('-cr') || // Costa Rica
        browserLang.includes('-pa') || // Panama
        browserLang.includes('-do') || // Dominican Republic
        browserLang.includes('-gt') || // Guatemala
        browserLang.includes('-sv') || // El Salvador
        browserLang.includes('-hn') || // Honduras
        browserLang.includes('-ni')    // Nicaragua
    ) {
      return 'es';
    }
    
    // Check for Portuguese-speaking regions
    if (browserLang.startsWith('pt') || browserLang.includes('-br')) {
      return 'pt';
    }
    
    // Default to English for everything else
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(detectLanguage());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('briki-language', lang);
    // Update document language attribute for accessibility
    document.documentElement.lang = lang;
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Set document language on mount and language change
  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Language names for display
const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português'
};

// Language flags (emoji codes)
const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  pt: '🇧🇷'
};

// Language Selector Component
export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="flex items-center">
          <Globe className="h-4 w-4 mr-1" />
          <span className="text-sm">{languageNames[language].substring(0, 2)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(languageNames).map(([code, name]) => (
          <DropdownMenuItem 
            key={code}
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setLanguage(code as Language)}
          >
            <span>{name}</span>
            {language === code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}