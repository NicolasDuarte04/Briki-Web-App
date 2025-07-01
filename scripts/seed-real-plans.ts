import "dotenv/config";
import { db } from '../server/db';
import { insurancePlans } from '../shared/schema';
import { realPlans } from '../client/src/data/realPlans';

async function seedRealPlans() {
  console.log("Seeding database with real insurance plans from realPlans.ts...");

  // Transform real plans to match database schema
  const plansToSeed = realPlans.map(plan => ({
    name: plan.name,
    category: plan.category,
    provider: plan.provider,
    basePrice: plan.basePrice || 0,
    coverageAmount: 1000000, // Default coverage amount since real plans don't have this field
    currency: plan.currency || 'COP',
    country: plan.country || 'CO',
    benefits: plan.features || [],
    externalLink: plan.externalLink || null,
    isExternal: plan.isExternal || false,
  }));

  try {
    // Clear existing plans to avoid duplicates during re-seeding
    await db.delete(insurancePlans);
    console.log("Cleared existing insurance plans.");

    // Insert new plans
    const inserted = await db.insert(insurancePlans).values(plansToSeed);
    console.log(`Successfully seeded ${plansToSeed.length} real insurance plans.`);

    // Log a few sample plans
    console.log("\nSample seeded plans:");
    plansToSeed.slice(0, 3).forEach(plan => {
      console.log(`- ${plan.name} (${plan.provider}) - ${plan.category}`);
      console.log(`  Price: ${plan.basePrice} ${plan.currency}`);
      console.log(`  External: ${plan.isExternal ? `Yes (${plan.externalLink})` : 'No'}`);
    });

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    console.log("\nSeeding complete.");
    process.exit(0);
  }
}

seedRealPlans(); 