import express from 'express';
import { generateAssistantResponse, analyzeImageForInsurance } from '../services/openai-service';
import { loadMockInsurancePlans, filterPlansByCategory, filterPlansByTags } from '../data-loader';
import { generateMockResponse } from '../services/mock-assistant-responses';
import { semanticSearch } from '../services/semantic-search';

const router = express.Router();

/**
 * Endpoint para generar respuestas del asistente IA
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    
    console.log(`[AI Chat Route] Request received:`, {
      messageLength: message?.length || 0,
      hasHistory: !!conversationHistory,
      historyLength: conversationHistory?.length || 0,
      timestamp: new Date().toISOString()
    });

    if (!message) {
      return res.status(400).json({ error: 'Se requiere un mensaje' });
    }

    // Convert frontend APIMessage format to backend AssistantMessage format
    const formattedHistory = (conversationHistory || []).map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    // Generate response using the updated service
    const response = await generateAssistantResponse(message, formattedHistory);
    
    console.log(`[AI Chat Route] Response generated:`, {
      hasMessage: !!response.message,
      hasSuggestedPlans: !!response.suggestedPlans,
      planCount: response.suggestedPlans?.length || 0,
      needsMoreContext: response.needsMoreContext,
      suggestedQuestionsCount: response.suggestedQuestions?.length || 0,
      timestamp: new Date().toISOString()
    });
    
    return res.json(response);
  } catch (error: any) {
    console.error('Error en el chat IA:', error);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: error.message || 'Error desconocido'
    });
  }
});

/**
 * Legacy endpoint - kept for backward compatibility
 */
router.post('/ask', async (req, res) => {
  try {
    const { message, history, useOpenAI = true, category } = req.body;
    
    console.log(`[AI Route] Request received:`, {
      messageLength: message?.length || 0,
      hasHistory: !!history,
      useOpenAI,
      category: category || 'not specified',
      timestamp: new Date().toISOString()
    });

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
        const response = await generateAssistantResponse(message, history || [], plans);
        
        console.log(`[AI Route] OpenAI response generated successfully:`, {
          responseLength: response.message?.length || 0,
          hasSuggestedPlans: !!response.suggestedPlans,
          planCount: response.suggestedPlans?.length || 0,
          timestamp: new Date().toISOString()
        });
        
        return res.json(response);
      } catch (error: any) {
        console.warn(`[AI Service] OpenAI API error - falling back to mock responses: ${error.message}`);
        // Si hay un error con OpenAI, usar las respuestas mock como fallback
      }
    } 
    
    // Usar respuestas avanzadas del asistente para desarrollo/pruebas o como fallback
    {
      // Determinar la categoría para el mensaje
      let categoryToUse = category;
      
      // Si no se especificó una categoría, intentar usar la búsqueda semántica para encontrar planes relevantes
      const relevantPlans = category 
        ? plans 
        : semanticSearch(message, allPlans, 5);
      
      // Generar una respuesta personalizada basada en el mensaje y los planes relevantes
      const mockResponse = generateMockResponse(categoryToUse, message, relevantPlans);
      
      // Ensure consistent response structure
      return res.json({
        message: mockResponse.message,
        suggestedPlans: mockResponse.suggestedPlans || []
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