import express from 'express';
import { generateAssistantResponse, analyzeImageForInsurance } from '../services/openai-service';
import { loadMockInsurancePlans, filterPlansByCategory, filterPlansByTags } from '../data-loader';

const router = express.Router();

/**
 * Endpoint para generar respuestas del asistente IA
 */
router.post('/ask', async (req, res) => {
  try {
    const { message, history, useOpenAI = true, category } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Se requiere un mensaje' });
    }

    // Cargar planes de seguro
    const allPlans = loadMockInsurancePlans();
    
    // Filtrar planes por categoría si se especifica
    const plans = category 
      ? filterPlansByCategory(allPlans, category) 
      : allPlans;

    // Si el modo OpenAI está activado, intentar usar la API
    if (useOpenAI) {
      try {
        const response = await generateAssistantResponse(message, history, plans);
        return res.json(response);
      } catch (error: any) {
        console.warn("Error al usar OpenAI, usando respuestas mock como fallback:", error.message);
        // Si hay un error con OpenAI, usar las respuestas mock como fallback
      }
    } 
    
    // Usar respuestas prefabricadas (para desarrollo/pruebas o como fallback)
    {
      // Respuestas mock para desarrollo
      const mockResponses: Record<string, string> = {
        default: "Hola, soy Briki, tu asistente de seguros. ¿En qué puedo ayudarte hoy?",
        travel: "Para viajes internacionales, te recomiendo nuestro Plan Premium Internacional que ofrece cobertura médica amplia y asistencia en más de 190 países.",
        auto: "Tenemos excelentes opciones de seguros para tu vehículo, desde la Cobertura Básica hasta la Protección Total Plus.",
        pet: "Para tu mascota, nuestro Plan Integral ofrece cobertura veterinaria, vacunas y medicamentos.",
        health: "En seguros de salud, el Plan Familiar Completo es ideal para proteger a toda tu familia con cobertura hospitalaria y de medicamentos."
      };

      // Determinar qué respuesta enviar basado en palabras clave
      let responseType: 'default' | 'travel' | 'auto' | 'pet' | 'health' = 'default';
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('viaje') || lowerMessage.includes('viajar') || lowerMessage.includes('vacaciones')) {
        responseType = 'travel';
      } else if (lowerMessage.includes('auto') || lowerMessage.includes('carro') || lowerMessage.includes('coche')) {
        responseType = 'auto';
      } else if (lowerMessage.includes('mascota') || lowerMessage.includes('perro') || lowerMessage.includes('gato')) {
        responseType = 'pet';
      } else if (lowerMessage.includes('salud') || lowerMessage.includes('médico') || lowerMessage.includes('hospital')) {
        responseType = 'health';
      }

      // Devolver planes relacionados con la categoría
      const matchingPlans = responseType !== 'default' 
        ? filterPlansByCategory(allPlans, responseType)
        : [];

      return res.json({
        message: mockResponses[responseType],
        suggestedPlans: matchingPlans.length > 0 ? matchingPlans : undefined
      });
    }
  } catch (error: any) {
    console.error('Error en el asistente IA:', error);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: error.message || 'Error desconocido'
    });
  }
});

/**
 * Endpoint para analizar imágenes con IA para recomendaciones de seguros
 */
router.post('/analyze-image', async (req, res) => {
  try {
    const { image, prompt, useOpenAI = true } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Se requiere una imagen' });
    }

    // Extraer datos de base64 (eliminar prefijo si existe)
    const base64Data = image.includes('base64,') 
      ? image.split('base64,')[1] 
      : image;

    if (useOpenAI) {
      try {
        const response = await analyzeImageForInsurance(base64Data, prompt);
        return res.json(response);
      } catch (error: any) {
        console.warn("Error al usar OpenAI para análisis de imagen, usando respuesta mock como fallback:", error.message);
        // Si hay error con OpenAI, usar respuesta mock como fallback
      }
    } 
    
    // Usar respuesta mock para desarrollo o como fallback
    {
      // Respuesta mock para desarrollo
      return res.json({
        message: "He analizado la imagen y parece que podrías necesitar un seguro de viaje para tus próximas vacaciones. Considera nuestro Plan Básico de Viaje que ofrece cobertura médica y protección de equipaje."
      });
    }
  } catch (error: any) {
    console.error('Error al analizar imagen:', error);
    res.status(500).json({ 
      error: 'Error al analizar la imagen',
      details: error.message || 'Error desconocido'
    });
  }
});

export default router;