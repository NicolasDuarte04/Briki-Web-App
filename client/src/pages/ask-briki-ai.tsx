import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Bot, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import RealAssistant from '@/components/briki-ai-assistant/RealAssistant';
import { PublicLayout } from '@/components/layout/public-layout';
import { Button } from '@/components/ui/button';

export default function AskBrikiAIPage() {
  // Preguntas sugeridas para empezar la conversación
  const suggestedQuestions = [
    "Compré una Vespa en Bogotá, ¿qué seguro me recomiendas?",
    "Viajo a Europa en julio por 2 semanas, necesito seguro de viaje",
    "Mi perro Golden Retriever necesita seguro veterinario",
    "Busco seguro de salud familiar para 4 personas en Colombia"
  ];

  return (
    <PublicLayout>
      <Helmet>
        <title>Briki – Tu Asistente Personal para Seguros</title>
        <meta
          name="description"
          content="Chatea con Briki y recibe recomendaciones personalizadas sobre seguros. IA avanzada para respuestas claras sin jerga técnica."
        />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Bot className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                <Sparkles className="h-5 w-5 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-4">
              Briki – Tu Asistente Personal
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Encuentra el seguro perfecto para ti con ayuda de inteligencia artificial avanzada. 
              Conversación natural, recomendaciones personalizadas.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MessageCircle className="h-4 w-4" />
              <span>Powered by GPT-4o • Respuestas en tiempo real</span>
            </div>
          </motion.div>

          {/* Suggested Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">
              💡 Prueba preguntando:
            </h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left bg-white/80 hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-all duration-200 group"
                  onClick={() => {
                    // Disparar evento personalizado para que RealAssistant capture la pregunta
                    window.dispatchEvent(new CustomEvent('suggestedQuestion', { 
                      detail: { question } 
                    }));
                  }}
                >
                  <span className="text-xs text-gray-600 group-hover:text-blue-700 leading-relaxed">
                    {question}
                  </span>
                  <ArrowRight className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Assistant Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4">
                <div className="flex items-center">
                  <Bot className="h-6 w-6 mr-3 text-white" />
                  <div>
                    <h3 className="font-semibold text-white">Briki AI Assistant</h3>
                    <p className="text-blue-100 text-sm">Tu experto en seguros disponible 24/7</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Assistant Component */}
              <div className="p-0">
                <RealAssistant />
              </div>
            </div>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              🔒 Tus conversaciones son privadas y seguras. Nuestro asistente usa tecnología de última generación 
              para brindarte las mejores recomendaciones de seguros adaptadas a tus necesidades específicas.
            </p>
          </motion.div>
        </div>
      </main>
    </PublicLayout>
  );
}