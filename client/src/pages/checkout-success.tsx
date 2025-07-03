import React, { useEffect, useState } from 'react';
import { PublicLayout } from '../components/layout/public-layout';
import { Button } from '../components/ui/button';
import { useNavigation } from '../lib/navigation';
import { Helmet } from 'react-helmet';
import { 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  Clock,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutSuccessPage() {
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);

  const sessionId = new URLSearchParams(window.location.search).get('session_id');

  useEffect(() => {
    // In a real implementation, you would verify the session with your backend
    // For now, we'll simulate a successful subscription
    const timer = setTimeout(() => {
      setSubscriptionDetails({
        status: 'active',
        trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        plan: 'Briki Premium'
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando tu suscripción...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Helmet>
        <title>¡Bienvenido a Briki Premium! - Suscripción Activada</title>
        <meta name="description" content="Tu suscripción a Briki Premium ha sido activada exitosamente. Disfruta de 14 días de prueba gratuita." />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ¡Bienvenido a Briki Premium!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Tu suscripción ha sido activada exitosamente
            </p>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-yellow-500 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Briki Premium</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Período de Prueba</p>
                    <p className="text-sm text-gray-600">14 días gratuitos</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Estado</p>
                    <p className="text-sm text-gray-600">Activo</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Lo que incluye tu suscripción Premium:</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Comparaciones ilimitadas de seguros</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Guardado ilimitado de cotizaciones y planes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Soporte prioritario al cliente</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Asistencia AI 24/7 para reclamos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Recordatorios de renovación de pólizas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Sugerencias de cobertura personalizadas</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-600/25 text-white px-8 py-3 text-lg"
                onClick={() => navigate('/explore')}
              >
                Explorar Seguros
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="text-sm text-gray-500">
                <p>¿Tienes preguntas? Contacta nuestro soporte en support@brikiapp.com</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </PublicLayout>
  );
} 