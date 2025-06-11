import React from 'react';
import { PublicLayout } from '@/components/layout/public-layout';
import { motion } from 'framer-motion';
import { useNavigation } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import GradientButton from '@/components/gradient-button';
import { Helmet } from 'react-helmet';
import { ArrowRight, Bot, Shield, MessageCircle } from 'lucide-react';
import NewBrikiAssistant from '@/components/briki-ai-assistant/NewBrikiAssistant';

export default function AskBrikiPage() {
  const { navigate } = useNavigation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, delay: 0.3 }
    }
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>Ask Briki - AI Insurance Assistant | Briki</title>
        <meta 
          name="description" 
          content="Chat with Briki AI to get personalized insurance recommendations. Get instant quotes for travel, auto, health, and pet insurance in Colombia." 
        />
        <meta name="keywords" content="insurance AI, chat bot, insurance quotes, Colombia insurance, travel insurance, auto insurance" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* Hero Section */}
        <section className="pt-12 pb-8 md:pt-20 md:pb-12">
          <motion.div
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6"
              variants={itemVariants}
            >
              <Bot className="w-4 h-4 mr-2" />
              Asistente IA Disponible 24/7
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              variants={itemVariants}
            >
              Pregúntale a{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Briki
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Tu asistente personal de seguros con inteligencia artificial. 
              Obtén recomendaciones personalizadas sin complicaciones.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              variants={ctaVariants}
            >
              <div className="flex items-center text-sm text-gray-500">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                Seguro y confiable
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                Respuestas instantáneas
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Chat UI Section */}
        <section className="py-12 md:py-20" aria-labelledby="chat-demo-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="chat-demo-heading" className="sr-only">Chat with Briki AI Assistant</h2>
            
            {/* Interactive AI Chat Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <NewBrikiAssistant />
            </motion.div>

            {/* Questions People Ask */}
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Preguntas que la gente hace
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {[
                  "¿Qué seguro necesito para mi Vespa en Bogotá?",
                  "¿Cuánto cuesta un seguro de viaje a Europa?",
                  "¿Hay seguros para perros en Colombia?",
                  "¿Qué cubre un seguro de salud familiar?"
                ].map((question, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    <p className="text-gray-700 text-sm">{question}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  ¿Listo para encontrar tu seguro ideal?
                </h3>
                <p className="text-blue-100 mb-6">
                  Únete a miles de colombianos que ya confían en Briki
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <GradientButton
                    onClick={() => navigate('/register')}
                    className="bg-white text-blue-600 hover:bg-gray-50"
                  >
                    Crear cuenta gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </GradientButton>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/plans')}
                    className="border-white text-white hover:bg-white/10"
                  >
                    Ver todos los planes
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}