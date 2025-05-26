import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Bot, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import NewBrikiAssistant from '@/components/briki-ai-assistant/NewBrikiAssistant';
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

          {/* New Assistant - Full Screen */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full h-[80vh]"
          >
            <NewBrikiAssistant />
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