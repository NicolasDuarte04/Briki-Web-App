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
    home: 'Home',
    myTrips: 'My Trips',
    insurancePlans: 'Insurance Plans',
    support: 'Support',
    signIn: 'Sign in',
    signUp: 'Sign up',
    tripDetails: 'Trip details',
    destination: 'Destination',
    tripType: 'Trip Type',
    departureDate: 'Departure Date',
    returnDate: 'Return Date',
    travelers: 'Number of Travelers',
    primaryAge: 'Age of Primary Traveler',
    medicalConditions: 'Do you have any pre-existing medical conditions?',
    coveragePriorities: 'Coverage Priorities (select up to 3)',
    medicalCoverage: 'Medical Coverage',
    tripCancellation: 'Trip Cancellation',
    baggageProtection: 'Baggage Protection',
    emergencyEvacuation: 'Emergency Evacuation',
    adventureActivities: 'Adventure Activities',
    carRental: 'Car Rental Coverage',
    findPlans: 'Find Plans',
    selectDestination: 'Select your destination'
  },
  es: {
    home: 'Inicio',
    myTrips: 'Mis Viajes',
    insurancePlans: 'Seguros de Viaje',
    support: 'Soporte',
    signIn: 'Iniciar sesión',
    signUp: 'Crear cuenta',
    tripDetails: 'Detalles del viaje',
    destination: 'Destino',
    tripType: 'Tipo de viaje',
    departureDate: 'Fecha de salida',
    returnDate: 'Fecha de regreso',
    travelers: 'Número de viajeros',
    primaryAge: 'Edad del viajero principal',
    medicalConditions: '¿Tienes alguna condición médica preexistente?',
    coveragePriorities: 'Prioridades de cobertura (selecciona hasta 3)',
    medicalCoverage: 'Cobertura médica',
    tripCancellation: 'Cancelación de viaje',
    baggageProtection: 'Protección de equipaje',
    emergencyEvacuation: 'Evacuación de emergencia',
    adventureActivities: 'Actividades de aventura',
    carRental: 'Cobertura de alquiler de auto',
    findPlans: 'Buscar planes',
    selectDestination: 'Selecciona tu destino'
  },
  pt: {
    home: 'Início',
    myTrips: 'Minhas Viagens',
    insurancePlans: 'Seguros de Viagem',
    support: 'Suporte',
    signIn: 'Entrar',
    signUp: 'Criar conta',
    tripDetails: 'Detalhes da viagem',
    destination: 'Destino',
    tripType: 'Tipo de viagem',
    departureDate: 'Data de saída',
    returnDate: 'Data de retorno',
    travelers: 'Número de viajantes',
    primaryAge: 'Idade do viajante principal',
    medicalConditions: 'Você tem alguma condição médica preexistente?',
    coveragePriorities: 'Prioridades de cobertura (selecione até 3)',
    medicalCoverage: 'Cobertura médica',
    tripCancellation: 'Cancelamento de viagem',
    baggageProtection: 'Proteção de bagagem',
    emergencyEvacuation: 'Evacuação de emergência',
    adventureActivities: 'Atividades de aventura',
    carRental: 'Cobertura de aluguel de carro',
    findPlans: 'Buscar planos',
    selectDestination: 'Selecione seu destino'
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
          <span className="text-sm">{languageFlags[language]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(languageNames).map(([code, name]) => (
          <DropdownMenuItem 
            key={code}
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setLanguage(code as Language)}
          >
            <span>
              {languageFlags[code as Language]} {name}
            </span>
            {language === code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}