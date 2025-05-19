import express from 'express';
import { OpenAI } from 'openai';
import { isAuthenticated } from '../replitAuth';

// Create router
const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompt to guide the AI's responses about insurance
const SYSTEM_PROMPT = `
You are Briki, a knowledgeable insurance assistant that helps users understand insurance options across various categories including travel, health, auto, and pet insurance.

Your role is to:
- Provide clear, accurate information about insurance concepts and terminology
- Help users compare insurance plans within the same category
- Explain coverage details, deductibles, premiums, and claims processes
- Suggest appropriate insurance options based on user needs
- Stay focused on insurance-related topics

Keep your responses concise (under 3-4 paragraphs), helpful, and conversational. If you're unsure about specific insurance details, acknowledge that and provide general guidance instead of making up information.
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