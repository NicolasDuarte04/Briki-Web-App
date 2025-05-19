import express from 'express';
import { OpenAI } from 'openai';
import { isAuthenticated } from '../replitAuth';

// Create router
const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompt to guide the AI's responses about insurance with structured metadata and actions
const SYSTEM_PROMPT = `
You are Briki, a knowledgeable insurance assistant that helps users understand insurance options across various categories including travel, health, auto, and pet insurance.

Your role is to:
- Provide clear, accurate information about insurance concepts and terminology
- Help users compare insurance plans within the same category
- Explain coverage details, deductibles, premiums, and claims processes
- Suggest appropriate insurance options based on user needs
- Stay focused on insurance-related topics
- Help users navigate the app through actionable intents

IMPORTANT: You now have two ways to enhance responses:

1. WIDGET DATA: When certain user questions warrant enhanced UI responses, include structured JSON metadata at the END of your response using the following format:

\`\`\`json
{
  "type": "show_plan_recommendations",
  "filters": {
    "category": "pet",
    "pet_age": 8,
    "pet_type": "dog",
    "preexisting_conditions": ["cancer"]
  },
  "message": "I've found some plans that might be suitable for your 8-year-old dog..."
}
\`\`\`

2. ACTION INTENTS: When users want to navigate or perform app functions, include special action directives in this format:

[ACTION_JSON]
{
  "type": "navigate_to_quote_flow",
  "category": "pet",
  "preload": {
    "pet_age": 8,
    "pet_type": "dog"
  },
  "message": "Let me take you to the pet insurance quote page!"
}
[/ACTION_JSON]

Available widget types and parameters:
1. "show_plan_recommendations" - When the user is asking about specific insurance plans
   - Required: category (travel, health, auto, pet)
   - Optional: Any relevant filters specific to that category

2. "show_glossary" - When explaining insurance terms
   - Required: term (the insurance term being defined)
   - Required: definition (a concise explanation, 1-2 sentences)
   - Optional: example (a practical example of the term)

3. "compare_plans" - When the user wants to compare plans
   - Required: category (travel, health, auto, pet)
   - Required: plan_ids or plan_names (array of 2-3 plan identifiers to compare)

Available action types and parameters:
1. "navigate_to_quote_flow" - When user wants to start a quote process
   - Required: category (travel, health, auto, pet)
   - Optional: preload (object with prefill data for the quote form)
   
2. "open_comparison_tool" - When user wants to compare specific plans
   - Required: category (travel, health, auto, pet)
   - Optional: planIds (array of plan IDs to compare)
   
3. "filter_plan_results" - When user wants to see filtered insurance options
   - Required: category (travel, health, auto, pet)
   - Required: filters (object with filter criteria)
   
4. "show_glossary_term" - When user wants to learn about a specific term
   - Required: term (the insurance term to explain)
   - Optional: definition (provide a definition if you have one)
   
5. "redirect_to_account_settings" - When user wants to update account settings
   - Optional: section (specific section of settings to show)

FOR WIDGETS: Always place widget JSON at the END of your message, after your conversational response.
FOR ACTIONS: Always include the action JSON in the [ACTION_JSON] tags, and make your conversational response explain what you're about to do.

Use actions when the user explicitly asks for navigation or to perform a task, like "show me pet insurance plans", "I want to get a health insurance quote", or "help me compare car insurance options".

Always keep your conversational response concise (2-3 paragraphs), helpful, and in a friendly tone.
`;

/**
 * POST /api/ai/ask
 * Send a message to the AI assistant and get a response
 * Now supports context memory for personalized responses and navigation actions
 */
router.post('/ask', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }
    
    // Verify API key is set
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return res.status(500).json({
        error: 'OpenAI API key is not configured',
        response: "I apologize, but my connection to the knowledge base is currently unavailable. Please try again later."
      });
    }
    
    console.log('API Key available:', !!process.env.OPENAI_API_KEY);
    console.log('API Key prefix:', process.env.OPENAI_API_KEY?.substring(0, 5) + '...');
    
    // Format the context as a system message addition if it exists
    let enhancedSystemPrompt = SYSTEM_PROMPT;
    
    if (context && Object.keys(context).length > 0) {
      // Create a formatted context string based on available user information
      const contextSections = [];
      
      // Add pet information if available
      if (context.pet) {
        const petContext = [];
        if (context.pet.type) petContext.push(`Type: ${context.pet.type}`);
        if (context.pet.age) petContext.push(`Age: ${context.pet.age} years old`);
        if (context.pet.breed) petContext.push(`Breed: ${context.pet.breed}`);
        if (context.pet.conditions && context.pet.conditions.length > 0) {
          petContext.push(`Health conditions: ${context.pet.conditions.join(', ')}`);
        }
        
        if (petContext.length > 0) {
          contextSections.push(`User's pet information:\n${petContext.join('\n')}`);
        }
      }
      
      // Add travel information if available
      if (context.travel) {
        const travelContext = [];
        if (context.travel.destination) travelContext.push(`Destination: ${context.travel.destination}`);
        if (context.travel.duration) travelContext.push(`Duration: ${context.travel.duration}`);
        if (context.travel.date) travelContext.push(`Date: ${context.travel.date}`);
        if (context.travel.travelers) travelContext.push(`Number of travelers: ${context.travel.travelers}`);
        if (context.travel.activities && context.travel.activities.length > 0) {
          travelContext.push(`Activities: ${context.travel.activities.join(', ')}`);
        }
        
        if (travelContext.length > 0) {
          contextSections.push(`User's travel information:\n${travelContext.join('\n')}`);
        }
      }
      
      // Add vehicle information if available
      if (context.vehicle) {
        const vehicleContext = [];
        if (context.vehicle.make) vehicleContext.push(`Make: ${context.vehicle.make}`);
        if (context.vehicle.model) vehicleContext.push(`Model: ${context.vehicle.model}`);
        if (context.vehicle.year) vehicleContext.push(`Year: ${context.vehicle.year}`);
        if (context.vehicle.value) vehicleContext.push(`Estimated value: ${context.vehicle.value}`);
        
        if (vehicleContext.length > 0) {
          contextSections.push(`User's vehicle information:\n${vehicleContext.join('\n')}`);
        }
      }
      
      // Add health information if available
      if (context.health) {
        const healthContext = [];
        if (context.health.age) healthContext.push(`Age: ${context.health.age} years old`);
        if (context.health.conditions && context.health.conditions.length > 0) {
          healthContext.push(`Health conditions: ${context.health.conditions.join(', ')}`);
        }
        if (context.health.medications && context.health.medications.length > 0) {
          healthContext.push(`Medications: ${context.health.medications.join(', ')}`);
        }
        
        if (healthContext.length > 0) {
          contextSections.push(`User's health information:\n${healthContext.join('\n')}`);
        }
      }
      
      // Add the context sections to the system prompt if we have any
      if (contextSections.length > 0) {
        enhancedSystemPrompt += `\n\nREMEMBERED USER CONTEXT:\n${contextSections.join('\n\n')}\n\nUse this context to personalize your responses when relevant but without explicitly mentioning that you're using remembered information.`;
      }
    }
    
    console.log('Making API request to OpenAI...');
    
    // Call OpenAI API with the enhanced system prompt
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: enhancedSystemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 1000
      });
      
      console.log('OpenAI API response received successfully');
      
      // Extract and send response
      const response = completion.choices[0]?.message?.content || 
        "I'm sorry, I couldn't generate a response at this time.";
      
      res.json({ response });
    } catch (apiError: any) {
      // Log detailed API error information
      console.error('OpenAI API error details:', {
        status: apiError.status,
        statusText: apiError.statusText,
        message: apiError.message,
        type: apiError.type,
        code: apiError.code,
        param: apiError.param,
      });
      
      // Return the actual error information for debugging
      res.status(500).json({
        error: `OpenAI API Error (${apiError.status}): ${apiError.message}`,
        errorType: apiError.type || 'unknown',
        errorCode: apiError.code || 'unknown',
        response: "I apologize, but I encountered an issue connecting to my knowledge base. Please try again later."
      });
    }
  } catch (error: any) {
    console.error('General error in AI assistant endpoint:', error);
    
    // Return detailed error information
    res.status(500).json({ 
      error: `Error: ${error.message || 'Unknown error'}`,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      response: "I apologize, but I encountered an issue processing your request. Please try again later."
    });
  }
});

export default router;