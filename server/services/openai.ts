import OpenAI from "openai";

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = "gpt-4o";

/**
 * System message providing context for the insurance assistant
 */
const SYSTEM_PROMPT = `You are Briki AI, an intelligent assistant for the Briki insurance marketplace.
As a specialized insurance assistant, help users understand insurance options across multiple categories:
- Travel insurance
- Auto insurance
- Pet insurance
- Health insurance

Your main responsibilities:
1. Answer questions about insurance coverage, benefits, and restrictions
2. Explain insurance terminology in simple terms
3. Help users compare different insurance plans
4. Provide personalized recommendations based on user needs
5. Guide users through the insurance selection process

Important rules:
- Be concise and clear in your explanations
- Use a friendly, conversational tone
- If you don't know something, admit it rather than making up information
- Focus only on insurance-related topics
- Don't provide personal financial or legal advice
- Never share confidential information
- When making recommendations, clarify that these are suggestions and the user should review plan details

You have specific knowledge about the insurance providers in our marketplace:
- Travel: WorldNomads, Allianz, SafetyWing, GeoBlue, AXA
- Auto: Allianz, ProgressiveAuto, LibertyMutual, AXA, Colmena
- Pet: Figo, HealthyPaws
- Health: SafetyWing, GeoBlue, AXA, LibertyMutual, Cigna, Bupa, Colmena

Our marketplace is focused on serving customers in Colombia and Mexico, with some providers offering coverage in other countries.`;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Sends a chat message to OpenAI and returns the response
 */
export async function getChatCompletionFromOpenAI(
  messages: ChatMessage[], 
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: options.model || DEFAULT_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    // Return a friendly error message
    if (error.status === 429) {
      return "I'm currently handling too many requests. Please try again in a moment.";
    }
    
    return "I'm having trouble connecting to my knowledge base. Please try again later.";
  }
}

/**
 * Generates insurance recommendations based on user criteria
 */
export async function generateInsuranceRecommendation(
  category: string,
  userCriteria: Record<string, any>
): Promise<string> {
  const criteriaString = Object.entries(userCriteria)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  
  const prompt = `Based on the following criteria for ${category} insurance:
${criteriaString}

What would you recommend? Please explain your recommendation with 2-3 key reasons.`;

  const messages: ChatMessage[] = [
    { role: 'user', content: prompt }
  ];

  return getChatCompletionFromOpenAI(messages, { temperature: 0.5 });
}

/**
 * Explains an insurance term or concept
 */
export async function explainInsuranceTerm(term: string): Promise<string> {
  const prompt = `Please explain the insurance term or concept "${term}" in simple, easy-to-understand language. Include:
1. A brief definition
2. Why it's important
3. An example if possible`;

  const messages: ChatMessage[] = [
    { role: 'user', content: prompt }
  ];

  return getChatCompletionFromOpenAI(messages, { temperature: 0.3, max_tokens: 400 });
}

/**
 * Compares multiple insurance plans and highlights differences
 */
export async function comparePlans(plans: any[]): Promise<string> {
  if (plans.length < 2) {
    return "I need at least two plans to compare.";
  }
  
  // Format the plans for the prompt
  const plansText = plans.map((plan, index) => {
    return `Plan ${index + 1}: ${plan.name} by ${plan.provider}
- Price: ${plan.price.amount} ${plan.price.currency} (${plan.price.frequency || 'one-time'})
- Coverage: ${plan.coverage.general.amount} ${plan.coverage.general.currency}
- Benefits: ${plan.benefits.join(', ')}
${plan.restrictions ? `- Restrictions: ${plan.restrictions.join(', ')}` : ''}`;
  }).join('\n\n');

  const prompt = `Compare the following insurance plans and highlight the key differences and trade-offs:

${plansText}

Please structure your response with:
1. A brief overview of what these plans have in common
2. Key differences in coverage, benefits, restrictions and price
3. Which plan might be better for different types of users`;

  const messages: ChatMessage[] = [
    { role: 'user', content: prompt }
  ];

  return getChatCompletionFromOpenAI(messages, { temperature: 0.5, max_tokens: 800 });
}

/**
 * Answers a general insurance question
 */
export async function answerInsuranceQuestion(question: string): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'user', content: question }
  ];

  return getChatCompletionFromOpenAI(messages);
}