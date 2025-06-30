import { Helmet } from 'react-helmet';
import { BrikiAssistant } from '@/components/briki-ai-assistant/BrikiAssistant';
import Navbar from '@/components/layout/navbar';

export default function AskBrikiAIPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Briki AI - Tu Asistente Personal de Seguros</title>
        <meta 
          name="description" 
          content="Chatea con Briki AI para obtener recomendaciones personalizadas de seguros. Cotiza al instante seguros de viaje, auto, salud y mascotas en Colombia." 
        />
      </Helmet>

      <Navbar />
      
      <main className="flex-grow">
        <BrikiAssistant />
      </main>
    </div>
  );
}