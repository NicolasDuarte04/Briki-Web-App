import OpenAI from "openai";
import { mockPrompts, defaultAssistantMessage } from "@/utils/mockAssistantResponses";

// Inicializar el cliente de OpenAI con la clave de API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo, en producción usa el backend
});

// Interfaz para la respuesta del asistente
export interface AssistantResponse {
  content: string;
  sourceType: 'ai' | 'mock';
  mockResponseData?: any;
}

/**
 * Procesa un mensaje de usuario y devuelve una respuesta del asistente
 * Primero verifica si hay una respuesta prefabricada, si no, consulta a OpenAI
 */
export async function processUserMessage(
  message: string,
  useAI: boolean = true
): Promise<AssistantResponse> {
  try {
    // Comprobar si hay una respuesta prefabricada para este mensaje
    const matchedPrompt = mockPrompts.find(p =>
      message.toLowerCase().includes(p.match.toLowerCase())
    );
    
    // Si hay una coincidencia, devuelve la respuesta prefabricada
    if (matchedPrompt) {
      return {
        content: matchedPrompt.response.text,
        sourceType: 'mock',
        mockResponseData: matchedPrompt.response
      };
    }
    
    // Si useAI es false o no hay una clave de API, devuelve un mensaje predeterminado
    if (!useAI || !process.env.OPENAI_API_KEY) {
      return {
        content: defaultAssistantMessage,
        sourceType: 'mock'
      };
    }
    
    // Consultar a la API de OpenAI
    // el modelo gpt-4o es el más reciente, lanzado el 13 de mayo de 2024, no cambiar a menos que el usuario lo solicite explícitamente
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres Briki, un asistente especializado en seguros. Proporciona respuestas claras, concisas y útiles sobre seguros de auto, viaje, salud y mascotas. Evita tecnicismos y usa un lenguaje sencillo. Limita tus respuestas a 3-4 oraciones. No menciones que eres una IA. Habla en español."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });
    
    const aiResponse = completion.choices[0].message.content || "Lo siento, no pude generar una respuesta en este momento.";
    
    return {
      content: aiResponse,
      sourceType: 'ai'
    };
  } catch (error) {
    console.error("Error procesando mensaje:", error);
    
    // En caso de error, devuelve un mensaje de error amigable
    return {
      content: "Estoy teniendo problemas para conectarme. Por favor, intenta con otra pregunta o prueba más tarde.",
      sourceType: 'mock'
    };
  }
}