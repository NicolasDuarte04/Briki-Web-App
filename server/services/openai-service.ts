import OpenAI from "openai";
import { MockInsurancePlan } from "../data-loader";

// Initialize the OpenAI client with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

/**
 * Interfaces for AI Assistant
 */
export interface AssistantMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AssistantResponse {
  message: string;
  suggestedPlans?: MockInsurancePlan[];
}

/**
 * Generate a response from the AI assistant based on user input and conversation history
 * @param userMessage Current user message
 * @param conversationHistory Previous messages in the conversation
 * @param insurancePlans Available insurance plans to consider in the response
 */
export async function generateAssistantResponse(
  userMessage: string,
  conversationHistory: AssistantMessage[] = [],
  insurancePlans: MockInsurancePlan[] = []
): Promise<AssistantResponse> {
  // Prepare system message with context and instructions
  const systemMessage: AssistantMessage = {
    role: "system",
    content: createSystemPrompt(insurancePlans)
  };
  
  // Combine history with current message
  const messages: AssistantMessage[] = [
    systemMessage,
    ...conversationHistory,
    { role: "user", content: userMessage }
  ];
  
  try {
    const startTime = Date.now();
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 800,
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Log metrics for monitoring
    console.log(`[OpenAI] Response generated successfully:`, {
      model: DEFAULT_MODEL,
      responseTime: `${responseTime}ms`,
      tokensUsed: response.usage?.total_tokens || 0,
      promptTokens: response.usage?.prompt_tokens || 0,
      completionTokens: response.usage?.completion_tokens || 0,
      messageLength: userMessage.length,
      timestamp: new Date().toISOString()
    });
    
    // Extract and return response
    const assistantMessage = response.choices[0].message.content || "Lo siento, no pude generar una respuesta.";
    
    // Basic logic to identify relevant plans (in a real system, this would be more sophisticated)
    const suggestedPlans = findRelevantPlans(userMessage, insurancePlans);
    
    return {
      message: assistantMessage,
      suggestedPlans: suggestedPlans.length > 0 ? suggestedPlans : undefined
    };
  } catch (error: any) {
    console.error(`[OpenAI] Error generating response:`, {
      error: error.message,
      type: error.type || 'unknown',
      code: error.code || 'unknown',
      timestamp: new Date().toISOString(),
      model: DEFAULT_MODEL
    });
    throw new Error(`Error al generar respuesta: ${error.message || 'Error desconocido'}`);
  }
}

/**
 * Create a system prompt with context about available insurance plans
 * @param insurancePlans Plans to include in the context
 */
function createSystemPrompt(insurancePlans: MockInsurancePlan[]): string {
  // Start with base instructions
  let prompt = `Eres Briki, un asistente de seguros amigable y profesional. Tu objetivo es ayudar a los usuarios a encontrar el mejor seguro para sus necesidades.
  
Debes responder de manera conversacional, cercana y empática. Usa un tono amigable pero profesional.

Tus respuestas deben ser concisas y directas, pero también detalladas cuando sea necesario.`;

  // Add context about available plans if provided
  if (insurancePlans.length > 0) {
    prompt += `\n\nTienes acceso a los siguientes planes de seguro:`;
    
    const plansByCategory: Record<string, MockInsurancePlan[]> = {};
    
    // Group plans by category
    insurancePlans.forEach(plan => {
      if (!plansByCategory[plan.category]) {
        plansByCategory[plan.category] = [];
      }
      plansByCategory[plan.category].push(plan);
    });
    
    // Add plans by category
    Object.entries(plansByCategory).forEach(([category, plans]) => {
      prompt += `\n\n${getCategoryName(category)}:`;
      plans.forEach(plan => {
        prompt += `\n- ${plan.name} (${plan.provider}): ${plan.description} Precio base: ${plan.basePrice} ${plan.currency}. Tags: ${plan.tags.join(', ')}`;
      });
    });
    
    prompt += `\n\nSi el usuario pregunta por un plan específico, proporciona detalles sobre ese plan. Si pregunta por una categoría, menciona los planes disponibles en esa categoría. Si no especifica, intenta entender sus necesidades para recomendar un plan adecuado.`;
  }

  return prompt;
}

/**
 * Get a human-readable name for a category
 */
function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    'travel': 'Seguros de Viaje',
    'auto': 'Seguros de Auto',
    'pet': 'Seguros de Mascotas',
    'health': 'Seguros de Salud'
  };
  
  return categoryNames[category] || category;
}

/**
 * Find relevant plans based on user message
 * This is a simplified implementation that would be enhanced in a production system
 */
function findRelevantPlans(userMessage: string, plans: MockInsurancePlan[]): MockInsurancePlan[] {
  if (!plans.length) return [];
  
  const message = userMessage.toLowerCase();
  const relevantPlans: MockInsurancePlan[] = [];
  
  // Very basic keyword matching
  const categoryKeywords: Record<string, string[]> = {
    'travel': ['viaje', 'viajar', 'vacaciones', 'turismo', 'internacional'],
    'auto': ['carro', 'auto', 'coche', 'vehículo', 'conducir', 'automóvil'],
    'pet': ['mascota', 'perro', 'gato', 'animal', 'veterinario'],
    'health': ['salud', 'médico', 'hospital', 'enfermedad', 'consulta']
  };
  
  // Check for category matches
  let matchedCategory = '';
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      matchedCategory = category;
      break;
    }
  }
  
  // Filter by matched category
  if (matchedCategory) {
    return plans.filter(plan => plan.category === matchedCategory);
  }
  
  // Check for price sensitivity
  if (message.includes('barato') || message.includes('económico') || message.includes('precio')) {
    // Find plans with 'económico' tag
    const economicPlans = plans.filter(plan => 
      plan.tags.some(tag => 
        tag.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === 'economico'
      )
    );
    
    if (economicPlans.length) {
      return economicPlans;
    }
  }
  
  // Default: return a few random plans as suggestions
  if (plans.length <= 3) {
    return plans;
  } else {
    // Shuffle and take 3
    return [...plans]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }
}

/**
 * Generate a multimodal response with analysis of an image
 */
export async function analyzeImageForInsurance(
  base64Image: string,
  userPrompt: string = "¿Qué tipo de seguro necesito para esto?"
): Promise<AssistantResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "Eres Briki, un asistente especializado en seguros. Analiza la imagen proporcionada y ayuda al usuario a identificar qué tipo de seguro podría necesitar basado en lo que se muestra. Sé específico y detallado en tu análisis."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 500,
    });

    return {
      message: response.choices[0].message.content || "No pude analizar la imagen correctamente."
    };
  } catch (error: any) {
    console.error("Error al analizar la imagen:", error);
    throw new Error(`Error al analizar la imagen: ${error.message || 'Error desconocido'}`);
  }
}