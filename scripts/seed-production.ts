import "dotenv/config";
import { db } from '../server/db';
import { insurancePlans } from '../shared/schema';
import * as fs from 'fs';
import * as path from 'path';

async function seedProductionDatabase() {
  console.log("🚀 Starting production database seeding...\n");

  try {
    // Read the real insurance plans data
    const dataPath = path.join(process.cwd(), 'server', 'data', 'real-insurance-plans.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const realPlans = JSON.parse(rawData);
    
    console.log(`📊 Found ${realPlans.length} plans in real-insurance-plans.json\n`);

    // Transform plans to match database schema
    const plansToInsert = realPlans
      .filter((plan: any) => plan.features && plan.features.length > 0) // Skip plans without features
      .map((plan: any) => ({
        name: plan.name,
        category: plan.category,
        provider: plan.provider,
        basePrice: plan.basePrice || 0,
        coverageAmount: plan.coverageAmount || 1000000, // Default coverage
        currency: plan.currency || 'COP',
        country: plan.country || 'CO',
        benefits: plan.features || [],
        externalLink: plan.externalLink || null,
        isExternal: plan.isExternal || false,
      }));

    console.log(`✅ Prepared ${plansToInsert.length} valid plans for insertion\n`);

    // Check current database state
    const existingPlans = await db.select().from(insurancePlans);
    console.log(`📍 Current database has ${existingPlans.length} plans\n`);

    if (existingPlans.length > 0) {
      console.log("⚠️  Database already contains plans. Do you want to:");
      console.log("1. Clear existing plans and reseed");
      console.log("2. Add only new plans (merge)");
      console.log("3. Cancel operation");
      console.log("\nFor production safety, cancelling operation. Run with --force to clear and reseed.\n");
      
      if (!process.argv.includes('--force')) {
        process.exit(0);
      }
      
      console.log("🗑️  --force flag detected. Clearing existing plans...");
      await db.delete(insurancePlans);
    }

    // Insert plans in batches
    const batchSize = 50;
    let inserted = 0;

    for (let i = 0; i < plansToInsert.length; i += batchSize) {
      const batch = plansToInsert.slice(i, i + batchSize);
      await db.insert(insurancePlans).values(batch);
      inserted += batch.length;
      console.log(`📥 Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(plansToInsert.length / batchSize)} (${inserted}/${plansToInsert.length} plans)`);
    }

    // Verify insertion
    const finalCount = await db.select().from(insurancePlans);
    console.log(`\n✅ Seeding complete! Database now has ${finalCount.length} plans\n`);

    // Show category breakdown
    const categoryBreakdown = finalCount.reduce((acc: Record<string, number>, plan) => {
      acc[plan.category] = (acc[plan.category] || 0) + 1;
      return acc;
    }, {});

    console.log("📊 Category breakdown:");
    Object.entries(categoryBreakdown).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} plans`);
    });

    // Show sample plans
    console.log("\n📋 Sample plans:");
    finalCount.slice(0, 5).forEach(plan => {
      console.log(`   - ${plan.name} (${plan.provider}) - ${plan.category} - ${plan.basePrice} ${plan.currency}`);
    });

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    console.log("\n🏁 Seeding process finished");
    process.exit(0);
  }
}

// Run the seeding function
seedProductionDatabase(); 