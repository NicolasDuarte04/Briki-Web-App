/**
 * Servicio para interactuar con la API de OpenAI a través del backend
 * Esta implementación segura evita exponer la clave de API en el frontend
 */

// Tipos para las respuestas de la API
interface OpenAIResponse {
  response: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

interface OpenAIErrorResponse {
  error: string;
  details?: string;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Envía un mensaje al asistente AI a través del backend
 * @param message Mensaje del usuario
 * @param conversationHistory Historial de conversación opcional
 * @returns Respuesta de la API
 */
export async function sendMessageToAI(
  message: string,
  conversationHistory: Message[] = []
): Promise<OpenAIResponse> {
  try {
    const response = await fetch("/api/ai/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        conversationHistory,
      }),
    });

    if (!response.ok) {
      const errorData: OpenAIErrorResponse = await response.json();
      throw new Error(errorData.error || "Error al comunicarse con el asistente");
    }

    const data: OpenAIResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de OpenAI:", error);
    throw error;
  }
}

/**
 * Obtiene respuestas simuladas para situaciones en las que no se puede usar la API
 * @param message Mensaje del usuario
 * @returns Respuesta simulada
 */
export function getMockResponse(message: string): OpenAIResponse {
  // Respuestas básicas para demostración
  const lowercaseMessage = message.toLowerCase();
  
  let response = "Lo siento, no entiendo tu pregunta. ¿Puedes ser más específico sobre el tipo de seguro que te interesa?";
  
  if (lowercaseMessage.includes("viaje") || lowercaseMessage.includes("viajes") || lowercaseMessage.includes("viajar")) {
    response = "Briki ofrece excelentes seguros de viaje que cubren cancelaciones, asistencia médica internacional y pérdida de equipaje. Te recomiendo nuestro plan Premium para mayor tranquilidad.";
  } else if (lowercaseMessage.includes("auto") || lowercaseMessage.includes("coche") || lowercaseMessage.includes("carro")) {
    response = "Nuestros seguros de auto te ofrecen protección completa con cobertura de daños a terceros, asistencia en carretera y talleres certificados. El plan Completo Plus es muy popular.";
  } else if (lowercaseMessage.includes("mascota") || lowercaseMessage.includes("perro") || lowercaseMessage.includes("gato")) {
    response = "Para tu mascota tenemos planes que cubren consultas veterinarias, vacunas y tratamientos por accidentes. El plan Mascota Protegida cubre hasta 80% de gastos médicos.";
  } else if (lowercaseMessage.includes("salud") || lowercaseMessage.includes("médico") || lowercaseMessage.includes("hospital")) {
    response = "Nuestros seguros de salud incluyen consultas, hospitalización y medicamentos. El plan Familia Saludable es ideal con cobertura amplia y acceso a una red de especialistas.";
  }
  
  return {
    response,
    model: "mock-gpt",
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }
  };
}