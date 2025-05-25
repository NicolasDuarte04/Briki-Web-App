import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Inicializar el cliente de OpenAI con la clave de API del servidor
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Obtener el modelo de OpenAI de las variables de entorno o usar uno por defecto
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

// Endpoint para procesar mensajes a través de OpenAI
router.post('/ask', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    // Preparar mensajes para OpenAI
    const messages = [
      {
        role: "system",
        content: "Eres Briki, un asistente especializado en seguros. Proporciona respuestas claras, concisas y útiles sobre seguros de auto, viaje, salud y mascotas. Evita tecnicismos y usa un lenguaje sencillo. Limita tus respuestas a 3-4 oraciones. No menciones que eres una IA. Habla en español."
      },
      // Incluir historial de conversación si existe
      ...conversationHistory,
      {
        role: "user",
        content: message
      }
    ];

    console.log(`AI Request - Model: ${OPENAI_MODEL}, Message: ${message.substring(0, 50)}...`);
    
    // Realizar la llamada a la API de OpenAI
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    // Obtener y enviar la respuesta
    const aiResponse = completion.choices[0].message.content || 
                      "Lo siento, no pude generar una respuesta en este momento.";
    
    console.log(`AI Response (${completion.usage?.total_tokens || 'unknown'} tokens): ${aiResponse.substring(0, 50)}...`);
    
    return res.json({ 
      response: aiResponse,
      usage: completion.usage,
      model: OPENAI_MODEL
    });
  } catch (error: any) {
    console.error('Error procesando mensaje en OpenAI:', error);
    
    return res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;