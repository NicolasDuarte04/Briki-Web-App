# Briki AI Assistant - Functional Improvements

## 1. Enhanced Context Gathering with Progressive Disclosure

### Current Issue
The assistant sometimes shows plans too early or fails to gather sufficient context before making recommendations.

### Improvements

```typescript
// Enhanced context analysis with multi-stage questioning
interface ContextStage {
  stage: 'initial' | 'qualifying' | 'detailed' | 'ready';
  missingInfo: string[];
  confidence: number;
}

function getContextStage(conversation: string, category: string, memory: AssistantMemory): ContextStage {
  const requiredInfo = {
    auto: ['vehicle_type', 'usage', 'location', 'coverage_needs'],
    health: ['age', 'family_size', 'existing_conditions', 'budget'],
    travel: ['destination', 'duration', 'travelers', 'activities'],
    pet: ['pet_type', 'pet_age', 'breed', 'medical_history']
  };
  
  // Calculate what percentage of required info we have
  const gathered = requiredInfo[category].filter(info => 
    hasInfoInContext(conversation, info, memory)
  );
  
  const confidence = gathered.length / requiredInfo[category].length;
  
  if (confidence < 0.25) return { stage: 'initial', missingInfo: requiredInfo[category], confidence };
  if (confidence < 0.5) return { stage: 'qualifying', missingInfo: [...], confidence };
  if (confidence < 0.75) return { stage: 'detailed', missingInfo: [...], confidence };
  return { stage: 'ready', missingInfo: [], confidence };
}

// Use stage-appropriate responses
function generateStageAppropriateQuestions(stage: ContextStage, category: string): string[] {
  switch (stage.stage) {
    case 'initial':
      return [
        "¿Para qué tipo de vehículo necesitas el seguro?",
        "¿Es para uso personal o comercial?",
        "¿En qué ciudad conduces principalmente?"
      ];
    case 'qualifying':
      return [
        "¿Qué tipo de cobertura prefieres: básica, intermedia o completa?",
        "¿Tienes un presupuesto mensual en mente?",
        "¿Has tenido siniestros en los últimos 3 años?"
      ];
    // ... more stages
  }
}
```

## 2. Intelligent Logging and Debugging

### Current Issue
Limited visibility into why plans weren't returned or matched.

### Improvements

```typescript
// Enhanced logging system
interface PlanMatchLog {
  timestamp: Date;
  userQuery: string;
  detectedCategory: string;
  contextScore: number;
  plansAvailable: number;
  plansAfterFilters: number;
  filterReasons: {
    country: number;
    price: number;
    features: number;
    category: number;
  };
  finalPlanCount: number;
  matchingCriteria: string[];
  debugInfo: any;
}

async function logPlanMatching(log: PlanMatchLog) {
  // Store in database for analysis
  await db.insert(planMatchLogs).values(log);
  
  // Real-time monitoring
  if (log.finalPlanCount === 0) {
    console.error('[NO_PLANS_MATCHED]', {
      query: log.userQuery,
      category: log.detectedCategory,
      reasons: log.filterReasons,
      available: log.plansAvailable
    });
    
    // Send alert if this happens frequently
    if (await getFailureRate() > 0.2) {
      await sendAlertToAdmin('High plan matching failure rate detected');
    }
  }
}

// Add to OpenAI service
const matchLog: PlanMatchLog = {
  timestamp: new Date(),
  userQuery: userMessage,
  detectedCategory: category,
  contextScore: contextAnalysis.confidence || 0,
  plansAvailable: allPlans.length,
  plansAfterFilters: filteredPlans.length,
  filterReasons: {
    country: allPlans.length - filteredByCountry.length,
    price: filteredByCountry.length - filteredByPrice.length,
    features: filteredByPrice.length - filteredByFeatures.length,
    category: filteredByFeatures.length - relevantPlans.length
  },
  finalPlanCount: suggestedPlans.length,
  matchingCriteria: extractedCriteria,
  debugInfo: { memory, contextAnalysis }
};

await logPlanMatching(matchLog);
```

## 3. Smart Fallback Logic

### Current Issue
When no plans match, the assistant doesn't provide helpful alternatives.

### Improvements

```typescript
// Implement fallback strategies
async function handleNoPlanMatches(
  userQuery: string, 
  category: string, 
  filters: FilterCriteria
): Promise<FallbackResponse> {
  // Strategy 1: Broaden search criteria
  const broadenedPlans = await searchWithRelaxedCriteria(filters);
  
  // Strategy 2: Suggest similar categories
  const similarCategories = getSimilarCategories(category);
  const alternativePlans = await searchInCategories(similarCategories);
  
  // Strategy 3: Ask clarifying questions
  const clarifyingQuestions = generateClarifyingQuestions(userQuery, filters);
  
  // Strategy 4: Explain why no matches
  const explanation = explainNoMatches(filters, await getAvailablePlans());
  
  return {
    message: `No encontré planes exactos que coincidan con tu búsqueda, pero aquí hay algunas alternativas...`,
    alternativePlans: broadenedPlans.slice(0, 3),
    suggestedCategories: similarCategories,
    clarifyingQuestions,
    explanation
  };
}

// Relaxed search criteria
function relaxCriteria(original: FilterCriteria): FilterCriteria {
  return {
    ...original,
    priceRange: {
      min: original.priceRange.min * 0.8,
      max: original.priceRange.max * 1.2
    },
    requiredFeatures: original.requiredFeatures.slice(0, 2), // Keep only top features
    providers: [] // Remove provider restriction
  };
}
```

## 4. Context Memory Enhancements

### Current Issue
Limited persistence and utilization of user context across conversations.

### Improvements

```typescript
// Enhanced memory structure
interface EnhancedAssistantMemory {
  // User profile
  userProfile: {
    age?: number;
    location?: string;
    familySize?: number;
    occupation?: string;
    riskProfile?: 'low' | 'medium' | 'high';
  };
  
  // Preferences learned over time
  preferences: {
    priceSenitivity: 'low' | 'medium' | 'high';
    preferredProviders: string[];
    avoidedProviders: string[];
    importantFeatures: string[];
    communicationStyle: 'formal' | 'casual' | 'technical';
  };
  
  // Insurance history
  insuranceHistory: {
    currentPlans: InsurancePlan[];
    previousSearches: SearchHistory[];
    rejectedPlans: RejectedPlan[];
    claimsHistory: Claim[];
  };
  
  // Conversation state
  conversationState: {
    currentIntent: 'browsing' | 'comparing' | 'purchasing' | 'claiming';
    decisionStage: 'awareness' | 'consideration' | 'decision' | 'retention';
    confidenceLevel: number;
    lastUpdated: Date;
  };
}

// Intelligent memory updates
function updateMemoryWithLearning(
  memory: EnhancedAssistantMemory,
  userMessage: string,
  selectedPlan?: InsurancePlan,
  rejectedPlans?: InsurancePlan[]
): EnhancedAssistantMemory {
  const updatedMemory = { ...memory };
  
  // Learn from rejections
  if (rejectedPlans?.length > 0) {
    const commonTraits = findCommonTraits(rejectedPlans);
    updatedMemory.preferences.avoidedProviders.push(...commonTraits.providers);
    
    // Adjust price sensitivity
    const avgRejectedPrice = average(rejectedPlans.map(p => p.basePrice));
    if (avgRejectedPrice < memory.userProfile.estimatedBudget * 0.7) {
      updatedMemory.preferences.priceSensitivity = 'low';
    }
  }
  
  // Learn from selections
  if (selectedPlan) {
    updatedMemory.preferences.preferredProviders.push(selectedPlan.provider);
    updatedMemory.preferences.importantFeatures.push(...selectedPlan.features);
  }
  
  // Update conversation state
  updatedMemory.conversationState = detectConversationState(userMessage, memory);
  
  return updatedMemory;
}
```

## 5. Advanced Input Validation

### Current Issue
Basic input validation that doesn't catch edge cases or guide users effectively.

### Improvements

```typescript
// Multi-layer input validation
interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  suggestions: string[];
  normalizedInput?: string;
}

interface ValidationIssue {
  type: 'ambiguous' | 'incomplete' | 'invalid' | 'offtopic';
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

async function validateAndNormalizeInput(
  userMessage: string,
  category: string,
  memory: AssistantMemory
): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];
  const suggestions: string[] = [];
  
  // Check for ambiguous requests
  const ambiguityCheck = checkAmbiguity(userMessage);
  if (ambiguityCheck.isAmbiguous) {
    issues.push({
      type: 'ambiguous',
      field: ambiguityCheck.field,
      message: `Tu solicitud sobre ${ambiguityCheck.field} no es clara`,
      severity: 'warning'
    });
    suggestions.push(...ambiguityCheck.clarifications);
  }
  
  // Validate category-specific requirements
  const categoryValidation = validateCategoryRequirements(userMessage, category);
  issues.push(...categoryValidation.issues);
  
  // Check for conflicting requirements
  const conflicts = detectConflicts(userMessage);
  if (conflicts.length > 0) {
    issues.push({
      type: 'invalid',
      field: 'requirements',
      message: 'Algunos requisitos parecen contradecirse',
      severity: 'error'
    });
  }
  
  // Normalize input
  const normalized = normalizeUserInput(userMessage, {
    fixTypos: true,
    expandAbbreviations: true,
    standardizeAmounts: true,
    extractDates: true
  });
  
  return {
    isValid: issues.filter(i => i.severity === 'error').length === 0,
    issues,
    suggestions,
    normalizedInput: normalized
  };
}

// Smart typo correction for insurance terms
function correctInsuranceTypos(text: string): string {
  const corrections = {
    'segur': 'seguro',
    'polisa': 'póliza',
    'cobertur': 'cobertura',
    'deducible': 'deducible',
    'prima': 'prima',
    'siniestro': 'siniestro'
  };
  
  let corrected = text;
  Object.entries(corrections).forEach(([typo, correct]) => {
    const regex = new RegExp(`\\b${typo}\\w*\\b`, 'gi');
    corrected = corrected.replace(regex, correct);
  });
  
  return corrected;
}
```

## 6. Conversation Flow Management

### Current Issue
Linear conversation flow that doesn't adapt to user's decision-making process.

### Improvements

```typescript
// Dynamic conversation flow engine
class ConversationFlowManager {
  private flows: Map<string, ConversationFlow> = new Map();
  
  constructor() {
    this.registerFlows();
  }
  
  private registerFlows() {
    // Auto insurance flow
    this.flows.set('auto_quote', {
      steps: [
        { id: 'vehicle_info', required: true, questions: [...] },
        { id: 'driver_info', required: true, questions: [...] },
        { id: 'coverage_selection', required: false, questions: [...] },
        { id: 'discount_check', required: false, questions: [...] }
      ],
      transitions: {
        'vehicle_info': ['driver_info', 'skip_to_recommendations'],
        'driver_info': ['coverage_selection', 'discount_check'],
        // ...
      }
    });
  }
  
  getNextStep(
    currentStep: string, 
    userResponse: string, 
    memory: AssistantMemory
  ): FlowStep {
    const flow = this.flows.get(memory.currentFlow);
    const transitions = flow.transitions[currentStep];
    
    // Intelligent routing based on user response
    if (userIndicatesUrgency(userResponse)) {
      return flow.steps.find(s => s.id === 'skip_to_recommendations');
    }
    
    if (userProvidesMultipleInfo(userResponse)) {
      // Skip steps that were already answered
      const answeredSteps = extractAnsweredSteps(userResponse);
      return findNextUnansweredStep(flow, answeredSteps);
    }
    
    // Default to next required step
    return flow.steps.find(s => 
      transitions.includes(s.id) && s.required && !isStepComplete(s, memory)
    );
  }
}
```

## Implementation Priority

1. **High Priority**: Enhanced logging and debugging (immediate visibility)
2. **High Priority**: Smart fallback logic (better user experience when no matches)
3. **Medium Priority**: Context gathering improvements (better recommendations)
4. **Medium Priority**: Memory enhancements (personalization over time)
5. **Low Priority**: Advanced input validation (edge case handling)
6. **Low Priority**: Conversation flow management (complex but powerful)

## Quick Wins

1. Add plan matching logs to every AI response
2. Implement basic fallback when no plans match
3. Store user preferences in memory between conversations
4. Add debug mode flag for detailed logging
5. Create admin dashboard to monitor AI performance 