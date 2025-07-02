/**
 * Briki AI Assistant Diagnostic Test Script
 * Tests for the 4 critical production issues reported
 */

import { detectInsuranceCategory, hasSufficientContext, analyzeContextNeeds, canShowPlans } from './shared/context-utils.ts';

// Test scenarios for reproduction
const testScenarios = [
  {
    name: "🚗 Issue 1: Auto Insurance - Kia Picanto 2023",
    messages: [
      { role: 'user', content: 'Acabo de comprar un nuevo carro' },
      { role: 'assistant', content: '¿Marca y año?' },
      { role: 'user', content: 'Kia Picanto 2023' }
    ],
    expectedBehavior: "Should show 3-4 auto insurance plans",
    actualBehavior: "Assistant says 'found options' but no cards rendered"
  },
  {
    name: "🐕 Issue 2: Pet Insurance - Missing Fields",
    messages: [
      { role: 'user', content: 'Quiero asegurar mi perro' },
      { role: 'assistant', content: '¿Qué edad tiene?' },
      { role: 'user', content: 'Es joven' }
    ],
    expectedBehavior: "Should ask for specific age, breed, location",
    actualBehavior: "Accepts vague answer and tries to show plans"
  },
  {
    name: "✈️ Issue 3: Travel Insurance - Incomplete Context",
    messages: [
      { role: 'user', content: 'Voy a viajar a México' }
    ],
    expectedBehavior: "Should ask for dates, number of travelers, purpose",
    actualBehavior: "Only asks for destination, then shows plans"
  },
  {
    name: "💊 Issue 4: Health Insurance - Context Check",
    messages: [
      { role: 'user', content: 'Busco un plan de salud para mi familia' }
    ],
    expectedBehavior: "Should ask for ages, genders, location",
    actualBehavior: "May skip required fields"
  }
];

console.log("🔍 Briki AI Assistant Diagnostic Test\n");
console.log("=" .repeat(80) + "\n");

// Run diagnostics for each scenario
testScenarios.forEach((scenario, index) => {
  console.log(`Test ${index + 1}: ${scenario.name}`);
  console.log(`Expected: ${scenario.expectedBehavior}`);
  console.log(`Actual: ${scenario.actualBehavior}\n`);
  
  // Build conversation string
  const conversation = scenario.messages
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content)
    .join(' ');
  
  const lastMessage = scenario.messages[scenario.messages.length - 1].content;
  
  // Test category detection
  const detectedCategory = detectInsuranceCategory(lastMessage);
  console.log(`✓ Category Detection: ${detectedCategory}`);
  
  // Test context sufficiency
  const hasSufficient = hasSufficientContext(conversation, detectedCategory);
  console.log(`✓ Context Sufficient: ${hasSufficient}`);
  
  // Test context analysis
  const contextAnalysis = analyzeContextNeeds(conversation, detectedCategory, {});
  console.log(`✓ Needs More Context: ${contextAnalysis.needsMoreContext}`);
  console.log(`✓ Missing Info: [${contextAnalysis.missingInfo.join(', ')}]`);
  console.log(`✓ Suggested Questions: ${contextAnalysis.suggestedQuestions.length} questions`);
  
  // Test canShowPlans logic
  const mockPlans = [{ id: 1, name: 'Test Plan' }]; // Mock plans
  const shouldShowPlans = canShowPlans(contextAnalysis, mockPlans);
  console.log(`✓ Should Show Plans: ${shouldShowPlans}`);
  
  console.log("\n" + "-".repeat(80) + "\n");
});

// Test specific edge cases
console.log("🔬 EDGE CASE TESTS\n");

// Test 1: Auto insurance with location but missing country
const edgeCase1 = {
  conversation: "Tengo un Kia Picanto 2023",
  category: "auto"
};
const edgeAnalysis1 = analyzeContextNeeds(edgeCase1.conversation, edgeCase1.category, {});
console.log(`Edge Case 1 - Auto without location:`);
console.log(`  Missing: [${edgeAnalysis1.missingInfo.join(', ')}]`);
console.log(`  Should be missing 'country' field\n`);

// Test 2: Pet insurance with vague age
const edgeCase2 = {
  conversation: "Tengo un perro joven",
  category: "pet"
};
const edgeAnalysis2 = analyzeContextNeeds(edgeCase2.conversation, edgeCase2.category, {});
console.log(`Edge Case 2 - Pet with vague age:`);
console.log(`  Missing: [${edgeAnalysis2.missingInfo.join(', ')}]`);
console.log(`  Should be missing 'petAge' since "joven" is not specific\n`);

// Test 3: Travel without all required fields
const edgeCase3 = {
  conversation: "Voy a viajar a México la próxima semana",
  category: "travel"
};
const edgeAnalysis3 = analyzeContextNeeds(edgeCase3.conversation, edgeCase3.category, {});
console.log(`Edge Case 3 - Travel with partial info:`);
console.log(`  Missing: [${edgeAnalysis3.missingInfo.join(', ')}]`);
console.log(`  Should be missing 'travelers' and 'purpose'\n`);

console.log("\n📊 DIAGNOSTIC SUMMARY");
console.log("=" .repeat(80));
console.log(`
Key Issues Found:
1. ❌ Context analysis may pass with insufficient data
2. ❌ Assistant message generation independent of plan availability  
3. ❌ No validation that suggestedPlans.length > 0 before saying "found options"
4. ❌ Frontend may not handle empty suggestedPlans array correctly

Recommendations:
1. ✅ Add strict validation in createSystemPrompt to check relevantPlans.length
2. ✅ Ensure canShowPlans() is called before allowing plan-related messages
3. ✅ Add frontend fallback when suggestedPlans is empty
4. ✅ Log full response pipeline for debugging
`); 