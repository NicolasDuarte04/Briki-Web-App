import { db } from '../server/db';
import { insurancePlans } from '../shared/schema';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

async function checkPetPlan() {
  console.log('Checking pet plan details...\n');
  
  try {
    const petPlan = await db
      .select()
      .from(insurancePlans)
      .where(sql`category = 'pet'`)
      .limit(1);
    
    if (petPlan.length > 0) {
      const plan = petPlan[0] as any;
      console.log('Sample Pet Plan:');
      console.log('================');
      console.log(`ID: ${plan.id}`);
      console.log(`Name: ${plan.name}`);
      console.log(`Provider: ${plan.provider}`);
      console.log(`Category: ${plan.category}`);
      console.log(`Subcategory: ${plan.subcategory || 'NOT SET'}`);
      console.log(`Base Price: ${plan.basePrice || plan.base_price} ${plan.currency}`);
      console.log(`External Link: ${plan.externalLink || plan.external_link || 'NOT SET'}`);
      console.log(`Brochure Link: ${plan.brochure_link || 'NOT SET'}`);
      console.log(`\nBenefits (${typeof plan.benefits}):`);
      console.log(JSON.stringify(plan.benefits, null, 2));
    } else {
      console.log('No pet plans found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPetPlan(); 