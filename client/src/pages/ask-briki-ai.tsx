import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import RealAssistant from '@/components/briki-ai-assistant/RealAssistant';
import { MainLayout } from '@/components/layout/main-layout';

export default function AskBrikiAIPage() {
  return (
    <MainLayout>
      <Helmet>
        <title>Briki | Asistente IA Inteligente</title>
        <meta
          name="description"
          content="Consulta con nuestro asistente IA para obtener recomendaciones personalizadas sobre seguros."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Asistente IA Briki
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Resuelve tus dudas sobre seguros con nuestro asistente impulsado por IA avanzada.
            Pregunta sobre coberturas, precios, o recibe recomendaciones personalizadas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RealAssistant />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p>
            Nuestro asistente utiliza tecnología avanzada de IA para brindarte información precisa.
            Para consultas más específicas, no dudes en contactar con nuestro equipo de atención al cliente.
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
}