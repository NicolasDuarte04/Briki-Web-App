import { Helmet } from 'react-helmet';
import { BrikiAssistant } from '../components/briki-ai-assistant/BrikiAssistant';

export default function AskBrikiAIPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Briki AI - Tu Asistente Personal de Seguros</title>
        <meta 
          name="description" 
          content="Chatea con Briki AI para obtener recomendaciones personalizadas de seguros. Cotiza al instante seguros de viaje, auto, salud y mascotas en Colombia." 
        />
      </Helmet>
      
      <BrikiAssistant />
    </div>
  );
}