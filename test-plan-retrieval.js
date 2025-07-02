/**
 * Test script to check plan retrieval from database
 */

import { db } from './server/db.ts';
import { insurancePlans } from './shared/schema.ts';
import { eq } from 'drizzle-orm';

async function testPlanRetrieval() {
  console.log("🔍 Testing Plan Retrieval from Database\n");
  console.log("=" .repeat(60) + "\n");
  
  try {
    // Get all plans
    const allPlans = await db.select().from(insurancePlans);
    console.log(`Total plans in database: ${allPlans.length}`);
    
    // Get plans by category
    const categories = ['auto', 'pet', 'travel', 'health', 'soat'];
    
    for (const category of categories) {
      const categoryPlans = await db
        .select()
        .from(insurancePlans)
        .where(eq(insurancePlans.category, category));
      
      console.log(`\n${category.toUpperCase()} plans: ${categoryPlans.length}`);
      
      if (categoryPlans.length > 0) {
        console.log("Sample plans:");
        categoryPlans.slice(0, 3).forEach(plan => {
          console.log(`  - ${plan.name} (${plan.provider}) - $${plan.basePrice} ${plan.currency}`);
        });
      }
    }
    
    // Test specific auto plans
    console.log("\n" + "-".repeat(60));
    console.log("\n🚗 AUTO INSURANCE PLANS DETAIL:");
    
    const autoPlans = await db
      .select()
      .from(insurancePlans)
      .where(eq(insurancePlans.category, 'auto'));
    
    console.log(`Found ${autoPlans.length} auto insurance plans\n`);
    
    autoPlans.forEach(plan => {
      console.log(`Plan ID: ${plan.id}`);
      console.log(`Name: ${plan.name}`);
      console.log(`Provider: ${plan.provider}`);
      console.log(`Price: $${plan.basePrice} ${plan.currency}`);
      console.log(`Country: ${plan.country}`);
      console.log(`Benefits: ${plan.benefits?.length || 0} items`);
      console.log(`External: ${plan.isExternal ? 'Yes' : 'No'}`);
      console.log("-".repeat(40));
    });
    
  } catch (error) {
    console.error("Error connecting to database:", error);
  } finally {
    process.exit(0);
  }
}

testPlanRetrieval(); 