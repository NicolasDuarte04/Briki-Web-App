import "dotenv/config";
import { db } from '../server/db';
import { insurancePlans } from '../shared/schema';

async function cleanDatabase() {
  console.log("Cleaning insurance_plans table...");

  try {
    await db.delete(insurancePlans);
    console.log("✅ Successfully cleaned insurance_plans table");
  } catch (error) {
    console.error("❌ Error cleaning database:", error);
    process.exit(1);
  }
}

cleanDatabase()
  .then(() => {
    console.log("\nDatabase cleaned. You can now seed with real plans:");
    console.log("  npm run seed:real-plans");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed:", error);
    process.exit(1);
  }); 