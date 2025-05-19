import express from 'express';
import { OpenAI } from 'openai';
import { isAuthenticated } from '../replitAuth';

// Create router
const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompt to guide the AI's responses about insurance with structured metadata
const SYSTEM_PROMPT = `
You are Briki, a knowledgeable insurance assistant that helps users understand insurance options across various categories including travel, health, auto, and pet insurance.

Your role is to:
- Provide clear, accurate information about insurance concepts and terminology
- Help users compare insurance plans within the same category
- Explain coverage details, deductibles, premiums, and claims processes
- Suggest appropriate insurance options based on user needs
- Stay focused on insurance-related topics

IMPORTANT: When certain user questions warrant enhanced UI responses, include structured JSON metadata at the END of your response using the following format:

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

Available action types and their parameters:
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

Always place this JSON at the END of your message, after your conversational response. Only include this structured data when it directly enhances the user experience (about 30% of responses). Keep your conversational response concise (under 3-4 paragraphs), helpful, and in a friendly tone.
`;

/**
 * POST /api/ai/ask
 * Send a message to the AI assistant and get a response
 */
router.post('/ask', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      max_tokens: 500
    });
    
    // Extract and send response
    const response = completion.choices[0]?.message?.content || 
      "I'm sorry, I couldn't generate a response at this time.";
    
    res.json({ response });
    
  } catch (error) {
    console.error('Error in AI assistant endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to get response from assistant',
      response: "I apologize, but I encountered an issue processing your request. Please try again later."
    });
  }
});

export default router;