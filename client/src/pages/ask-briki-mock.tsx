import React from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { ArrowRight, Bot, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/lib/navigation";
import MockAssistant from "@/components/briki-mock-assistant/MockAssistant";

// Componente principal de la página
export default function AskBrikiMockPage() {
  const { navigate } = useNavigation();
  
  // Lista de preguntas sugeridas para la demostración
  const suggestedQuestions = [
    "¿Compré una Vespa y quiero asegurarla, qué me recomiendas?",
    "Necesito un seguro de viaje para mi vacación a Europa",
    "¿Qué seguro de salud me recomiendas para mi familia?",
    "Busco un seguro para mi mascota, ¿qué opciones hay?"
  ];
  
  return (
    <PublicLayout>
      <Helmet>
        <title>Ask Briki – Tu asistente de seguros inteligente</title>
        <meta name="description" content="Habla con Briki y recibe respuestas claras sobre seguros sin jerga técnica. Recomendaciones personalizadas y explicaciones simples." />
      </Helmet>
      
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
          {/* Animated dot pattern */}
          <div className="absolute inset-0 -z-10 opacity-5">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          {/* Animated floating elements */}
          <motion.div
            className="absolute h-12 w-12 rounded-full bg-blue-200 opacity-30 -z-10 blur-sm"
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: '15%', left: '15%' }}
          />
          
          <motion.div
            className="absolute h-8 w-8 rounded-full bg-cyan-300 opacity-30 -z-10 blur-sm"
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            style={{ bottom: '25%', right: '20%' }}
          />

          <div className="relative max-w-7xl mx-auto py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Habla con un asistente que <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">realmente entiende de seguros</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
                Sin respuestas genéricas ni jerga confusa. Briki traduce la complejidad del seguro en conversaciones que tienen sentido.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Chat Interface Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Utilizando el componente MockAssistant */}
            <MockAssistant suggestedQuestions={suggestedQuestions} />
            
            {/* Feature Highlights */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                ¿Por qué Briki es diferente?
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Respuestas claras</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sin jerga técnica ni lenguaje confuso. Explicaciones sencillas que realmente entenderás.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Recomendaciones personalizadas</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Planes adaptados a tus necesidades específicas, no productos genéricos.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    <ArrowRight className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Del chat a la acción</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Compara, personaliza y compra directamente desde la conversación. Sin confusiones ni redirecciones.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">¿Tienes preguntas sobre seguros? Obtén respuestas claras</h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto">
                Regístrate para desbloquear recomendaciones personalizadas, comparaciones de pólizas y explicaciones sin jerga técnica.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-white hover:bg-white/90 text-blue-600 px-8 py-6 rounded-lg text-lg font-medium shadow-lg"
                  onClick={() => navigate("/auth")}
                >
                  Regístrate ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}