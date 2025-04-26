import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    support: 'Support',
    signIn: 'Sign in',
    signUp: 'Sign up',
    
    // Trip Form
    tripDetails: 'Trip details',
    countryOfOrigin: 'Country of Origin',
    destination: 'Destination Country',
    departureDate: 'Departure Date',
    returnDate: 'Return Date',
    travelers: 'Number of Travelers',
    primaryAge: 'Age of Primary Traveler',
    medicalConditions: 'Do you have any pre-existing medical conditions?',
    coveragePriorities: 'Coverage Priorities (select up to 3)',
    
    // Insurance coverage types
    medicalCoverage: 'Medical Coverage',
    tripCancellation: 'Trip Cancellation',
    baggageProtection: 'Baggage Protection',
    emergencyEvacuation: 'Emergency Evacuation',
    adventureActivities: 'Adventure Activities',
    carRental: 'Car Rental Coverage',
    
    // Actions and Buttons
    findPlans: 'Find Plans',
    selectDestination: 'Select your destination',
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
    support: 'Soporte',
    signIn: 'Iniciar sesión',
    signUp: 'Crear cuenta',
    
    // Trip Form
    tripDetails: 'Detalles del viaje',
    countryOfOrigin: 'País de Origen',
    destination: 'País de Destino',
    departureDate: 'Fecha de salida',
    returnDate: 'Fecha de regreso',
    travelers: 'Número de viajeros',
    primaryAge: 'Edad del viajero principal',
    medicalConditions: '¿Tienes alguna condición médica preexistente?',
    coveragePriorities: 'Prioridades de cobertura (selecciona hasta 3)',
    
    // Insurance coverage types
    medicalCoverage: 'Cobertura médica',
    tripCancellation: 'Cancelación de viaje',
    baggageProtection: 'Protección de equipaje',
    emergencyEvacuation: 'Evacuación de emergencia',
    adventureActivities: 'Actividades de aventura',
    carRental: 'Cobertura de alquiler de auto',
    
    // Actions and Buttons
    findPlans: 'Buscar planes',
    selectDestination: 'Selecciona tu destino',
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
    support: 'Suporte',
    signIn: 'Entrar',
    signUp: 'Criar conta',
    
    // Trip Form
    tripDetails: 'Detalhes da viagem',
    countryOfOrigin: 'País de Origem',
    destination: 'País de Destino',
    departureDate: 'Data de saída',
    returnDate: 'Data de retorno',
    travelers: 'Número de viajantes',
    primaryAge: 'Idade do viajante principal',
    medicalConditions: 'Você tem alguma condição médica preexistente?',
    coveragePriorities: 'Prioridades de cobertura (selecione até 3)',
    
    // Insurance coverage types
    medicalCoverage: 'Cobertura médica',
    tripCancellation: 'Cancelamento de viagem',
    baggageProtection: 'Proteção de bagagem',
    emergencyEvacuation: 'Evacuação de emergência',
    adventureActivities: 'Atividades de aventura',
    carRental: 'Cobertura de aluguel de carro',
    
    // Actions and Buttons
    findPlans: 'Buscar planos',
    selectDestination: 'Selecione seu destino',
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
  const [language, setLanguage] = useState<Language>('en');

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

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