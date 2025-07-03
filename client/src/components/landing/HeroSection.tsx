import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Shield, Zap } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '../ui/button';
import { useLanguage } from '../language-selector';

export const HeroSection: React.FC = () => {
  const [, navigate] = useLocation();
  const { language } = useLanguage();

  // Define translations inline for hero section
  const translations = {
    es: {
      badge: 'Nuevo: Asistente de Seguros con IA',
      title1: 'Encuentra tu',
      title2: 'Seguro',
      title3: 'Perfecto',
      subtitle: 'La primera plataforma de seguros con IA en Colombia. Compara planes, obtén cotizaciones instantáneas y toma decisiones informadas con nuestro asistente inteligente.',
      ctaAI: 'Comenzar con Asistente IA',
      ctaBrowse: 'Explorar Planes de Seguro',
      secure: 'Seguro y Privado',
      users: '50,000+ Usuarios',
      rating: '4.8/5 Calificación',
      instant: 'Cotizaciones Instantáneas'
    },
    en: {
      badge: 'New: AI-Powered Insurance Assistant',
      title1: 'Find Your Perfect',
      title2: 'Insurance',
      title3: '',
      subtitle: "Colombia's first AI-powered insurance platform. Compare plans, get instant quotes, and make informed decisions with our smart assistant.",
      ctaAI: 'Start with AI Assistant',
      ctaBrowse: 'Browse Insurance Plans',
      secure: 'Secure & Private',
      users: '50,000+ Users',
      rating: '4.8/5 Rating',
      instant: 'Instant Quotes'
    },
    pt: {
      badge: 'Novo: Assistente de Seguros com IA',
      title1: 'Encontre seu',
      title2: 'Seguro',
      title3: 'Perfeito',
      subtitle: 'A primeira plataforma de seguros com IA da Colômbia. Compare planos, obtenha cotações instantâneas e tome decisões informadas com nosso assistente inteligente.',
      ctaAI: 'Começar com Assistente IA',
      ctaBrowse: 'Explorar Planos de Seguro',
      secure: 'Seguro e Privado',
      users: '50.000+ Usuários',
      rating: '4.8/5 Avaliação',
      instant: 'Cotações Instantâneas'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden py-20">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto space-y-12"
        >
          {/* Beta badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-full border border-blue-200 dark:border-blue-800"
          >
            <Star className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {t.badge}
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
          >
            {t.title1}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              {t.title2}
            </span>
            {t.title3}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto"
          >
            {t.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/ask-briki-ai')}
              className="h-16 px-10 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 hover:shadow-xl hover:shadow-blue-500/25 font-semibold group"
            >
              {t.ctaAI}
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/home')}
              className="h-16 px-10 text-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
            >
              {t.ctaBrowse}
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 text-gray-600 dark:text-gray-400 pt-8"
          >
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-green-500" />
              <span className="text-base font-medium">{t.secure}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-500" />
              <span className="text-base font-medium">{t.users}</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="text-base font-medium">{t.rating}</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-purple-500" />
              <span className="text-base font-medium">{t.instant}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}; 