import OpenAI from "openai";

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = "gpt-4o";

/**
 * System message providing context for the insurance assistant
 */
const SYSTEM_PROMPT = `You are Briki, an insurance assistant trained to help users understand, compare, and purchase insurance. You are clear, friendly, and knowledgeable — never pushy. You simplify complex ideas and respond with empathy, like a helpful insurance advisor.

As a specialized insurance assistant for the Briki insurance marketplace, you help users navigate options across multiple categories:
- Travel insurance
- Auto insurance
- Pet insurance
- Health insurance

Your main responsibilities:
1. Answer questions about insurance coverage, benefits, and restrictions
2. Explain insurance terminology in simple terms using relatable examples
3. Help users compare different insurance plans based on their needs
4. Provide personalized recommendations based on user criteria
5. Guide users through the insurance selection process with patience

Important rules:
- Be concise and clear in your explanations, avoiding industry jargon
- Use a friendly, conversational tone that builds trust
- If you don't know something, admit it rather than making up information
- Focus only on insurance-related topics
- Don't provide personal financial or legal advice
- Never share confidential information
- When making recommendations, clarify that these are suggestions and the user should review plan details
- Use metaphors and examples to explain complex insurance concepts

You have specific knowledge about the insurance providers in our marketplace:
- Travel: WorldNomads, Allianz, SafetyWing, GeoBlue, AXA
- Auto: Allianz, ProgressiveAuto, LibertyMutual, AXA, Colmena
- Pet: Figo, HealthyPaws
- Health: SafetyWing, GeoBlue, AXA, LibertyMutual, Cigna, Bupa, Colmena

Our marketplace is focused on serving customers in Colombia and Mexico, with some providers offering coverage in other countries.

When possible, include structured data in your responses using JSON format within triple backticks to provide additional functionality:

For plan recommendations:
\`\`\`json
{
  "type": "show_plan_recommendations",
  "filters": {
    "category": "travel",
    "budget": "medium",
    "coverage_level": "comprehensive"
  }
}
\`\`\`

For glossary terms:
\`\`\`json
{
  "type": "show_glossary",
  "term": "deductible"
}
\`\`\`

For plan comparisons:
\`\`\`json
{
  "type": "compare_plans",
  "category": "pet",
  "plan_ids": ["petplan-premium", "nationwide-whole"]
}
\`\`\`
`;

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
 * Provides fallback responses when the OpenAI API is unavailable or responses are off-topic
 */
function getFallbackResponse(messages: ChatMessage[]): string {
  // Get the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  
  if (!lastUserMessage) {
    return "I'm Briki, your friendly insurance assistant. How can I help you today?";
  }
  
  const userQuery = lastUserMessage.content.toLowerCase();
  
  // Check for non-insurance related topics or vague queries
  const nonInsuranceKeywords = [
    'politics', 'sport', 'recipe', 'movie', 'music', 'weather', 
    'stocks', 'investment', 'dating', 'games', 'gaming'
  ];
  
  if (nonInsuranceKeywords.some(keyword => userQuery.includes(keyword))) {
    return "I'm not sure how to help with that, but if it's about insurance, I'll do my best. Try asking me about travel, pet, auto, or health coverage. I can explain insurance terms, compare plans, or help you understand what coverage might be best for your situation.";
  }
  
  // Provide some basic pre-written responses for common insurance questions
  if (userQuery.includes('deductible')) {
    return `A deductible is the amount you pay out of pocket before your insurance coverage begins. 

For example, if you have a $500 deductible and a $3,000 medical bill, you would pay the first $500, and your insurance would cover the rest according to your plan terms.

Would you like to see some plans with different deductible options?

\`\`\`json
{
  "type": "show_glossary",
  "term": "deductible"
}
\`\`\``;
  }
  
  if (userQuery.includes('premium')) {
    return `An insurance premium is the amount you pay to your insurance company for coverage. This payment can be made monthly, quarterly, or annually, depending on your policy terms.

Premium costs are based on factors such as coverage type, your age, location, and other risk factors.

\`\`\`json
{
  "type": "show_glossary",
  "term": "premium"
}
\`\`\``;
  }
  
  if (userQuery.includes('coverage')) {
    return "Insurance coverage refers to the specific risks and events that your insurance policy protects against. Different plans offer different levels of coverage for various situations. It's important to understand exactly what is covered in your policy to avoid surprises when making a claim.";
  }
  
  if (userQuery.includes('claim')) {
    return `An insurance claim is a formal request to your insurance company for coverage or compensation for a covered loss or policy event. 

The claim process typically involves submitting documentation, an investigation by the insurance company, and then approval or denial of the requested compensation.

\`\`\`json
{
  "type": "show_glossary",
  "term": "claim"
}
\`\`\``;
  }
  
  if (userQuery.includes('travel insurance')) {
    return `Travel insurance provides coverage for unexpected events during your trip, such as medical emergencies, trip cancellations, lost luggage, or travel delays. 

Different policies offer different levels of protection, so it's important to choose one that matches your specific travel needs and destinations.

Would you like me to recommend some travel insurance plans?

\`\`\`json
{
  "type": "show_plan_recommendations",
  "filters": {
    "category": "travel"
  }
}
\`\`\``;
  }
  
  if (userQuery.includes('auto insurance') || userQuery.includes('car insurance')) {
    return `Auto insurance protects you financially in case of an accident, theft, or damage to your vehicle. 

Most policies include liability coverage (for damage you cause to others), while comprehensive and collision coverage protect your own vehicle. Additional options can include roadside assistance and rental car coverage.

Here are some auto insurance plans you might want to consider:

\`\`\`json
{
  "type": "show_plan_recommendations",
  "filters": {
    "category": "auto"
  }
}
\`\`\``;
  }
  
  if (userQuery.includes('pet insurance')) {
    return `Pet insurance helps cover veterinary expenses for your pets. Policies typically cover accidents, illnesses, and sometimes preventive care.

Coverage levels, deductibles, and premiums vary based on your pet's age, breed, and the plan you choose.

Here are some pet insurance options you might want to explore:

\`\`\`json
{
  "type": "show_plan_recommendations",
  "filters": {
    "category": "pet"
  }
}
\`\`\``;
  }
  
  if (userQuery.includes('health insurance')) {
    return `Health insurance covers medical expenses for illnesses, injuries, and preventive care. Plans vary widely in terms of coverage, networks of doctors, and costs.

Key components include premiums, deductibles, copayments, and coverage limits. Many plans also provide prescription drug coverage and wellness benefits.

Here are some health insurance plans that might be suitable:

\`\`\`json
{
  "type": "show_plan_recommendations",
  "filters": {
    "category": "health"
  }
}
\`\`\``;
  }
  
  // Default response if no pattern matches
  return "I'm not sure how to help with that specific question, but if it's about insurance, I'll do my best. Try asking me about travel, pet, auto, or health coverage. I can explain insurance terms, compare plans, or help you understand what coverage might be best for your situation.";
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