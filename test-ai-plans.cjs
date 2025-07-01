// Test script to verify AI assistant returns plans correctly
const fetch = require('node-fetch');

async function testAIAssistant() {
  const messages = [
    "Voy a viajar a México por 11 días",
    "Quiero ver planes de seguro de viaje",
    "Muéstrame 4 planes de seguro de viaje para México"
  ];

  for (const message of messages) {
    console.log('\n' + '='.repeat(50));
    console.log(`Testing message: "${message}"`);
    console.log('='.repeat(50));

    try {
      const response = await fetch('http://localhost:5173/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: [],
          resetContext: false
        })
      });

      const data = await response.json();
      
      console.log('\n📋 Response summary:');
      console.log(`- Message: ${data.message?.substring(0, 100)}...`);
      console.log(`- Category: ${data.category}`);
      console.log(`- Needs more context: ${data.needsMoreContext}`);
      console.log(`- Suggested plans count: ${data.suggestedPlans?.length || 0}`);
      
      if (data.suggestedPlans && data.suggestedPlans.length > 0) {
        console.log('\n📦 Plans structure:');
        data.suggestedPlans.forEach((plan, index) => {
          console.log(`\nPlan ${index + 1}:`);
          console.log(`- ID: ${plan.id}`);
          console.log(`- Name: ${plan.name}`);
          console.log(`- Provider: ${plan.provider}`);
          console.log(`- Category: ${plan.category}`);
          console.log(`- Base Price: ${plan.basePrice} ${plan.currency}`);
          console.log(`- Is External: ${plan.isExternal}`);
          console.log(`- External Link: ${plan.externalLink || 'null'}`);
          console.log(`- Benefits: ${plan.benefits?.length || 0} items`);
          console.log(`- Features: ${plan.features?.length || 0} items`);
        });
      } else {
        console.log('\n⚠️ No plans returned');
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
}

// Run the test
testAIAssistant().catch(console.error); 