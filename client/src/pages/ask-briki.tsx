import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Bot, Shield, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import Navbar from '@/components/layout/navbar';

export default function AskBrikiPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Ask Briki - Tu Asistente de Seguros Inteligente</title>
        <meta name="description" content="Briki AI te ayuda a encontrar el seguro perfecto para ti, comparando planes y respondiendo todas tus preguntas sobre seguros." />
      </Helmet>

      <Navbar />

      <div className="flex-grow bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                Tu Asistente de Seguros Inteligente
              </h1>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                Encuentra el seguro perfecto con la ayuda de Briki AI
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-600/25 text-white transition-all"
                onClick={() => navigate('/ask-briki-ai')}
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="bg-gradient-to-r from-blue-600/10 to-cyan-500/10 p-3 rounded-lg inline-block mb-4">
                <Bot className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Asistente Inteligente</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Respuestas instantáneas a todas tus preguntas sobre seguros
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="bg-gradient-to-r from-blue-600/10 to-cyan-500/10 p-3 rounded-lg inline-block mb-4">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comparación Inteligente</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Compara planes de diferentes aseguradoras en segundos
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="bg-gradient-to-r from-blue-600/10 to-cyan-500/10 p-3 rounded-lg inline-block mb-4">
                <MessageCircle className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recomendaciones Personalizadas</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Recibe sugerencias adaptadas a tus necesidades específicas
              </p>
            </motion.div>
          </div>

          {/* How It Works Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8">¿Cómo Funciona?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-4">1</div>
                  <h3 className="text-xl font-semibold mb-2">Describe tus Necesidades</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Cuéntale a Briki qué tipo de seguro buscas
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-4">2</div>
                  <h3 className="text-xl font-semibold mb-2">Recibe Recomendaciones</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Obtén sugerencias personalizadas de planes
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-4">3</div>
                  <h3 className="text-xl font-semibold mb-2">Cotiza al Instante</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Conecta directamente con las aseguradoras
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Listo para encontrar tu seguro ideal?
              </h2>
              <p className="text-xl mb-8">
                Deja que Briki AI te ayude a tomar la mejor decisión
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-50 hover:shadow-lg hover:shadow-white/25 transition-all"
                onClick={() => navigate('/ask-briki-ai')}
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}