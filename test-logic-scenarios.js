/**
 * Logic-Based Test Scenarios for Briki AI Assistant
 * Run this script to verify all implemented features
 */

import { detectInsuranceCategory, hasSufficientContext, analyzeContextNeeds } from './shared/context-utils.ts';

// Test scenarios
const scenarios = [
  {
    name: "1. Pet Insurance – Incomplete Context",
    input: "Acabo de adoptar un perro",
    expectedCategory: "pet",
    shouldHaveSufficientContext: false,
    expectedMissingInfo: ["petAge"],
    description: "Should ask for pet age"
  },
  {
    name: "2. Pet Insurance – Complete Context",
    input: "Acabo de adoptar un labrador de 2 años",
    expectedCategory: "pet",
    shouldHaveSufficientContext: true,
    expectedMissingInfo: [],
    description: "Should show plans immediately"
  },
  {
    name: "3. Auto Insurance – Minimal Info",
    input: "Quiero asegurar mi carro",
    expectedCategory: "auto",
    shouldHaveSufficientContext: false,
    expectedMissingInfo: ["brand", "year", "country"],
    description: "Should ask for brand, model, year"
  },
  {
    name: "4. Auto Insurance – Complete Info",
    input: "Tengo un Mazda 3 modelo 2022 en Bogotá",
    expectedCategory: "auto",
    shouldHaveSufficientContext: true,
    expectedMissingInfo: [],
    description: "Should show auto plans"
  },
  {
    name: "5. Travel Insurance – Partial Context",
    input: "Voy a viajar a México la próxima semana",
    expectedCategory: "travel",
    shouldHaveSufficientContext: false,
    expectedMissingInfo: ["travelers", "purpose"],
    description: "Should ask for travelers and purpose"
  },
  {
    name: "6. Health Insurance – Vague Prompt",
    input: "Busco un plan de salud para mi familia",
    expectedCategory: "health",
    shouldHaveSufficientContext: false,
    expectedMissingInfo: ["age", "gender", "country"],
    description: "Should ask for age, gender, country"
  }
];

// Run tests
console.log("🧪 Running Logic-Based Tests for Briki AI Assistant\n");
console.log("=".repeat(60) + "\n");

let passed = 0;
let failed = 0;

scenarios.forEach((scenario, index) => {
  console.log(`Test ${index + 1}: ${scenario.name}`);
  console.log(`Input: "${scenario.input}"`);
  console.log(`Description: ${scenario.description}\n`);
  
  // Test category detection
  const detectedCategory = detectInsuranceCategory(scenario.input);
  const categoryPass = detectedCategory === scenario.expectedCategory;
  console.log(`✓ Category Detection: ${detectedCategory} ${categoryPass ? '✅' : '❌'} (expected: ${scenario.expectedCategory})`);
  
  // Test context sufficiency
  const hasSufficient = hasSufficientContext(scenario.input, detectedCategory);
  const contextPass = hasSufficient === scenario.shouldHaveSufficientContext;
  console.log(`✓ Context Sufficient: ${hasSufficient} ${contextPass ? '✅' : '❌'} (expected: ${scenario.shouldHaveSufficientContext})`);
  
  // Test context analysis (missing info)
  const contextAnalysis = analyzeContextNeeds(scenario.input, detectedCategory, {});
  const missingInfoMatch = JSON.stringify(contextAnalysis.missingInfo.sort()) === JSON.stringify(scenario.expectedMissingInfo.sort());
  console.log(`✓ Missing Info: [${contextAnalysis.missingInfo.join(', ')}] ${missingInfoMatch ? '✅' : '❌'} (expected: [${scenario.expectedMissingInfo.join(', ')}])`);
  
  // Overall test result
  const testPassed = categoryPass && contextPass && missingInfoMatch;
  if (testPassed) {
    console.log(`\n✅ TEST PASSED\n`);
    passed++;
  } else {
    console.log(`\n❌ TEST FAILED\n`);
    failed++;
  }
  
  console.log("-".repeat(60) + "\n");
});

// Summary
console.log("\n🎯 TEST SUMMARY");
console.log("=".repeat(60));
console.log(`Total Tests: ${scenarios.length}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Success Rate: ${((passed / scenarios.length) * 100).toFixed(1)}%\n`);

// Visual/UI checklist
console.log("📱 VISUAL/UI CHECKLIST (Manual Verification Required):");
console.log("[ ] Context summary chip appears when missingInfo.length > 0");
console.log("[ ] Interactive question pills are visible and clickable");
console.log("[ ] FAB reset button floats bottom-right after first input");
console.log("[ ] Plan cards are collapsed by default on mobile");
console.log("[ ] Loading animation appears before AI messages");
console.log("\n✨ Implementation testing complete!"); 