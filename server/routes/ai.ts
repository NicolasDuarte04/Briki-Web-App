import { Router } from "express";
import OpenAI from "openai";
import { z } from "zod";

// Validate request body
const aiMessageSchema = z.object({
  message: z.string().trim().min(1).max(500),
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt to restrict the AI to insurance topics
const systemPrompt = `
You are Briki, an AI insurance assistant. You specialize in providing accurate, concise information about insurance products and concepts.

CAPABILITIES:
- Answer questions about travel, pet, health, and auto insurance
- Explain insurance terminology and concepts
- Compare different types of insurance plans
- Provide general guidance on claims processes

LIMITATIONS:
- You only answer questions related to insurance
- You don't provide specific legal, medical, or financial advice
- You don't access real-time plan pricing or customer information
- You don't process actual insurance claims or applications

RESPONSE STYLE:
- Professional but conversational
- Concise (limit responses to 3-4 paragraphs maximum)
- Informative and educational
- Neutral (don't promote specific insurance companies)

If a user asks a non-insurance-related question, politely respond: "I'm here to help only with insurance-related topics. Try asking me about travel, pet, health, or auto coverage."
`;

const aiRouter = Router();

aiRouter.post("/ask", async (req, res) => {
  try {
    // Validate request body
    const result = aiMessageSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        error: "Invalid message format",
        details: result.error.issues
      });
    }
    
    const { message } = result.data;
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY environment variable");
      return res.status(500).json({ 
        error: "AI assistant is not properly configured"
      });
    }
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    // Extract and send the response
    const aiResponse = completion.choices[0]?.message?.content?.trim();
    
    if (!aiResponse) {
      return res.status(500).json({ 
        error: "Failed to generate a response"
      });
    }
    
    return res.json({ response: aiResponse });
    
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ 
      error: "An error occurred while processing your request"
    });
  }
});

export default aiRouter;