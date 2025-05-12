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
    // Check if we have the API key before attempting
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY is not set. Using fallback responses.');
      return getFallbackResponse(messages);
    }

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
    
    // Return a friendly error message with appropriate fallback
    if (error.status === 429 || error.code === 'insufficient_quota') {
      console.warn('OpenAI API quota exceeded. Using fallback responses.');
      return getFallbackResponse(messages);
    }
    
    return "I'm having trouble connecting to my knowledge base. Please try again later.";
  }
}

/**
 * Provides fallback responses when the OpenAI API is unavailable
 */
function getFallbackResponse(messages: ChatMessage[]): string {
  // Get the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  
  if (!lastUserMessage) {
    return "I'm here to help with insurance questions. What would you like to know?";
  }
  
  const userQuery = lastUserMessage.content.toLowerCase();
  
  // Provide some basic pre-written responses for common insurance questions
  if (userQuery.includes('deductible')) {
    return "A deductible is the amount you pay out of pocket before your insurance coverage begins. For example, if you have a $500 deductible and a $3,000 medical bill, you would pay the first $500, and your insurance would cover the rest according to your plan terms.";
  }
  
  if (userQuery.includes('premium')) {
    return "An insurance premium is the amount you pay to your insurance company for coverage. This payment can be made monthly, quarterly, or annually, depending on your policy terms. Premium costs are based on factors such as coverage type, your age, location, and other risk factors.";
  }
  
  if (userQuery.includes('coverage')) {
    return "Insurance coverage refers to the specific risks and events that your insurance policy protects against. Different plans offer different levels of coverage for various situations. It's important to understand exactly what is covered in your policy to avoid surprises when making a claim.";
  }
  
  if (userQuery.includes('claim')) {
    return "An insurance claim is a formal request to your insurance company for coverage or compensation for a covered loss or policy event. The claim process typically involves submitting documentation, an investigation by the insurance company, and then approval or denial of the requested compensation.";
  }
  
  if (userQuery.includes('travel insurance')) {
    return "Travel insurance provides coverage for unexpected events during your trip, such as medical emergencies, trip cancellations, lost luggage, or travel delays. Different policies offer different levels of protection, so it's important to choose one that matches your specific travel needs and destinations.";
  }
  
  if (userQuery.includes('auto insurance') || userQuery.includes('car insurance')) {
    return "Auto insurance protects you financially in case of an accident, theft, or damage to your vehicle. Most policies include liability coverage (for damage you cause to others), while comprehensive and collision coverage protect your own vehicle. Additional options can include roadside assistance and rental car coverage.";
  }
  
  if (userQuery.includes('pet insurance')) {
    return "Pet insurance helps cover veterinary expenses for your pets. Policies typically cover accidents, illnesses, and sometimes preventive care. Coverage levels, deductibles, and premiums vary based on your pet's age, breed, and the plan you choose.";
  }
  
  if (userQuery.includes('health insurance')) {
    return "Health insurance covers medical expenses for illnesses, injuries, and preventive care. Plans vary widely in terms of coverage, networks of doctors, and costs. Key components include premiums, deductibles, copayments, and coverage limits. Many plans also provide prescription drug coverage and wellness benefits.";
  }
  
  // Default response if no pattern matches
  return "I'm currently operating in fallback mode due to high demand. I can answer basic insurance questions, help you understand policy terms, or assist with general information about different insurance types. For complex questions, you might want to try again later.";
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