import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation strings
const translations: Record<Language, Record<string, string>> = {
  es: {
    // Landing page
    'landing.hero.title': 'Tu seguro ideal, sin complicaciones',
    'landing.hero.subtitle': 'Compara y encuentra el mejor seguro para ti con la ayuda de inteligencia artificial',
    'landing.hero.cta': 'Comenzar ahora',
    'landing.hero.learn_more': 'Conoce más',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.insurance': 'Seguros',
    'nav.company': 'Empresas',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.login': 'Iniciar sesión',
    'nav.signup': 'Registrarse',
    
    // Insurance categories
    'insurance.auto': 'Seguro de Auto',
    'insurance.health': 'Seguro de Salud',
    'insurance.pet': 'Seguro de Mascotas',
    'insurance.travel': 'Seguro de Viaje',
    
    // Common actions
    'action.compare': 'Comparar',
    'action.quote': 'Cotizar',
    'action.view_details': 'Ver detalles',
    'action.get_started': 'Comenzar',
    'action.learn_more': 'Saber más',
    
    // AI Assistant
    'ai.title': 'Asistente Briki',
    'ai.placeholder': '¿En qué puedo ayudarte hoy?',
    'ai.thinking': 'Briki está escribiendo...',
    'ai.reset': 'Nueva conversación',
    
    // Forms
    'form.email': 'Correo electrónico',
    'form.password': 'Contraseña',
    'form.name': 'Nombre completo',
    'form.phone': 'Teléfono',
    'form.submit': 'Enviar',
    'form.cancel': 'Cancelar',
  },
  en: {
    // Landing page
    'landing.hero.title': 'Your ideal insurance, hassle-free',
    'landing.hero.subtitle': 'Compare and find the best insurance for you with AI assistance',
    'landing.hero.cta': 'Get started',
    'landing.hero.learn_more': 'Learn more',
    
    // Navigation
    'nav.home': 'Home',
    'nav.insurance': 'Insurance',
    'nav.company': 'Companies',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Log in',
    'nav.signup': 'Sign up',
    
    // Insurance categories
    'insurance.auto': 'Auto Insurance',
    'insurance.health': 'Health Insurance',
    'insurance.pet': 'Pet Insurance',
    'insurance.travel': 'Travel Insurance',
    
    // Common actions
    'action.compare': 'Compare',
    'action.quote': 'Get Quote',
    'action.view_details': 'View details',
    'action.get_started': 'Get started',
    'action.learn_more': 'Learn more',
    
    // AI Assistant
    'ai.title': 'Briki Assistant',
    'ai.placeholder': 'How can I help you today?',
    'ai.thinking': 'Briki is typing...',
    'ai.reset': 'New conversation',
    
    // Forms
    'form.email': 'Email',
    'form.password': 'Password',
    'form.name': 'Full name',
    'form.phone': 'Phone',
    'form.submit': 'Submit',
    'form.cancel': 'Cancel',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Detect browser language and default to Spanish for LATAM
  const detectLanguage = (): Language => {
    // Check localStorage first
    const stored = localStorage.getItem('briki-language');
    if (stored === 'es' || stored === 'en') {
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

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  // Set document language on mount and language change
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 