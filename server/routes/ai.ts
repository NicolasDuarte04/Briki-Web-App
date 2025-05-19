import { Router } from 'express';
import OpenAI from 'openai';
import {
  AssistantRequest,
  AssistantResponse,
  AssistantWidgetType,
  APIStatusResponse
} from '../types/assistant';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create router
const router = Router();

/**
 * Check API status
 */
router.get('/status', async (req, res) => {
  try {
    // Basic validation of API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        available: false,
        message: 'API key not configured'
      } as APIStatusResponse);
    }

    // Test connection with a simple models list request
    await openai.models.list();

    // If we get here, the API is available
    return res.status(200).json({
      available: true
    } as APIStatusResponse);
  } catch (error) {
    console.error('OpenAI API status check failed:', error);
    
    // Return error message
    return res.status(200).json({
      available: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    } as APIStatusResponse);
  }
});

/**
 * Process assistant message
 */
router.post('/', async (req, res) => {
  try {
    const { message, userMemory } = req.body as AssistantRequest;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Create system message with context about Briki and the user
    const systemMessage = createSystemMessage(userMemory);

    // Call OpenAI API
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    // Get first response choice
    const responseContent = response.choices[0].message.content;
    
    if (!responseContent) {
      return res.status(500).json({ message: 'Empty response from OpenAI API' });
    }

    // Parse JSON response
    try {
      const parsedResponse = JSON.parse(responseContent);
      
      // Extract required fields
      const assistantMessage = parsedResponse.message || 'I apologize, but I couldn\'t generate a proper response.';
      
      // Extract optional action if available
      let action: AssistantWidgetType | undefined;
      
      if (parsedResponse.action && parsedResponse.action.type) {
        action = validateAndFormatAction(parsedResponse.action);
      }
      
      // Prepare and send response
      const assistantResponse: AssistantResponse = {
        message: assistantMessage,
        action,
        updatedMemory: parsedResponse.updatedMemory
      };
      
      return res.status(200).json(assistantResponse);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error, responseContent);
      
      // If parsing fails, just return the raw text
      return res.status(200).json({
        message: 'I apologize, but I encountered an issue processing your request. Please try again.'
      } as AssistantResponse);
    }
  } catch (error) {
    console.error('Error processing assistant request:', error);
    
    // Handle rate limiting specifically
    if (error instanceof OpenAI.APIError && error.status === 429) {
      return res.status(429).json({
        message: 'The AI assistant is currently experiencing high demand. Please try again in a few moments.'
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

/**
 * Create system message based on user memory
 */
function createSystemMessage(userMemory: any = {}): string {
  // Base system message
  let systemMessage = `
You are the Briki AI Assistant, an AI-powered assistant for Briki, an insurance marketplace platform.
Your goal is to help users find insurance plans, compare options, and understand insurance terminology.

KEY GUIDELINES:
1. Be friendly, helpful, and conversational but concise.
2. Focus on insurance-related questions.
3. When suggesting plans, provide clear reasons for recommendations.
4. For insurance terms, give brief, clear explanations.
5. If unsure, don't make up information.
6. Provide responses in JSON format with 'message' field and optional 'action' field.

AVAILABLE ACTIONS:
- recommend_plan: Recommend a specific insurance plan
- navigate_to_page: Suggest navigating to a specific page
- compare_plans: Suggest comparing specific plans
- explain_term: Explain an insurance term

RESPONSE FORMAT:
{
  "message": "Your helpful response text here",
  "action": {
    "type": "action_type",
    // Additional fields specific to action type
  },
  "updatedMemory": {
    // Any new information to remember about the user
  }
}
`;

  // Add user context if available
  if (userMemory) {
    systemMessage += '\nUSER CONTEXT:\n';
    
    if (userMemory.lastViewedCategory) {
      systemMessage += `- User recently viewed ${userMemory.lastViewedCategory} insurance.\n`;
    }
    
    if (userMemory.pet && Object.keys(userMemory.pet).length > 0) {
      const pet = userMemory.pet;
      systemMessage += '- Pet information:\n';
      if (pet.type) systemMessage += `  - Type: ${pet.type}\n`;
      if (pet.breed) systemMessage += `  - Breed: ${pet.breed}\n`;
      if (pet.age) systemMessage += `  - Age: ${pet.age} years\n`;
      if (pet.conditions && pet.conditions.length) systemMessage += `  - Conditions: ${pet.conditions.join(', ')}\n`;
    }
    
    if (userMemory.travel && Object.keys(userMemory.travel).length > 0) {
      const travel = userMemory.travel;
      systemMessage += '- Travel information:\n';
      if (travel.destination) systemMessage += `  - Destination: ${travel.destination}\n`;
      if (travel.duration) systemMessage += `  - Duration: ${travel.duration}\n`;
      if (travel.date) systemMessage += `  - Date: ${travel.date}\n`;
      if (travel.travelers) systemMessage += `  - Number of travelers: ${travel.travelers}\n`;
      if (travel.activities && travel.activities.length) systemMessage += `  - Activities: ${travel.activities.join(', ')}\n`;
    }
    
    if (userMemory.vehicle && Object.keys(userMemory.vehicle).length > 0) {
      const vehicle = userMemory.vehicle;
      systemMessage += '- Vehicle information:\n';
      if (vehicle.make) systemMessage += `  - Make: ${vehicle.make}\n`;
      if (vehicle.model) systemMessage += `  - Model: ${vehicle.model}\n`;
      if (vehicle.year) systemMessage += `  - Year: ${vehicle.year}\n`;
      if (vehicle.value) systemMessage += `  - Value: ${vehicle.value}\n`;
    }
    
    if (userMemory.health && Object.keys(userMemory.health).length > 0) {
      const health = userMemory.health;
      systemMessage += '- Health information:\n';
      if (health.age) systemMessage += `  - Age: ${health.age} years\n`;
      if (health.conditions && health.conditions.length) systemMessage += `  - Conditions: ${health.conditions.join(', ')}\n`;
      if (health.medications && health.medications.length) systemMessage += `  - Medications: ${health.medications.join(', ')}\n`;
    }
  }

  return systemMessage;
}

/**
 * Validate and format action from OpenAI response
 */
function validateAndFormatAction(action: any): AssistantWidgetType | undefined {
  try {
    // Validate based on action type
    switch (action.type) {
      case 'recommend_plan':
        if (action.category && action.planId) {
          return {
            type: 'recommend_plan',
            category: action.category,
            planId: action.planId
          };
        }
        break;
        
      case 'navigate_to_page':
        if (action.path && action.label) {
          return {
            type: 'navigate_to_page',
            path: action.path,
            label: action.label
          };
        }
        break;
        
      case 'compare_plans':
        if (action.category && Array.isArray(action.planIds)) {
          return {
            type: 'compare_plans',
            category: action.category,
            planIds: action.planIds
          };
        }
        break;
        
      case 'explain_term':
        if (action.term && action.explanation) {
          return {
            type: 'explain_term',
            term: action.term,
            explanation: action.explanation
          };
        }
        break;
    }
  } catch (error) {
    console.error('Error validating action:', error);
  }
  
  return undefined;
}

export default router;