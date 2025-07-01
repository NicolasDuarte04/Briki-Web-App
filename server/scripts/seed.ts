import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs/promises';
import { db } from '../db';
import { insurancePlans } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

interface RawPlan {
  id?: string;
  name: string;
  provider: string;
  category: string;
  basePrice?: number;
  coverageAmount?: number;
  currency?: string;
  country?: string;
  features?: string[]; // from realPlans.ts
  benefits?: string[]; // legacy fallback
  externalLink?: string | null;
  isExternal?: boolean;
}

async function main() {
  try {
    const __filename = new URL('', import.meta.url).pathname;
    const __dirnameESM = path.dirname(__filename);
    const filePath = path.join(__dirnameESM, '..', 'data', 'real-insurance-plans.json');
    const json = await fs.readFile(filePath, 'utf-8');
    const plans: RawPlan[] = JSON.parse(json);

    console.log(`\n🚀  Seeding ${plans.length} insurance plans...\n`);

    let success = 0;
    let failures = 0;

    for (const plan of plans) {
      try {
        const mapped = {
          name: plan.name,
          category: plan.category as any,
          provider: plan.provider,
          basePrice: plan.basePrice ?? 0,
          coverageAmount: plan.coverageAmount ?? 0,
          currency: plan.currency ?? 'COP',
          country: plan.country ?? 'CO',
          benefits: plan.features ?? plan.benefits ?? [],
          externalLink: plan.externalLink ?? null,
          isExternal: plan.isExternal ?? false,
        };

        if (!mapped.name || !mapped.category || !mapped.provider) {
          console.warn(`⚠️  Skipping plan with missing mandatory fields: ${plan.id || plan.name}`);
          failures++;
          continue;
        }

        // Check if plan exists (name + provider)
        const existing = await db
          .select({ id: insurancePlans.id })
          .from(insurancePlans)
          .where(and(eq(insurancePlans.name, mapped.name), eq(insurancePlans.provider, mapped.provider)))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(insurancePlans)
            .set(mapped as any)
            .where(eq(insurancePlans.id, existing[0].id));
          console.log(`🔄  Updated plan: ${mapped.name} (${mapped.provider})`);
        } else {
          await db.insert(insurancePlans).values(mapped as any);
          console.log(`✅  Inserted plan: ${mapped.name} (${mapped.provider})`);
        }

        success++;
      } catch (error: any) {
        console.error(`❌  Failed to upsert plan ${plan.id || plan.name}:`, error.message);
        failures++;
      }
    }

    console.log(`\n🌟  Seed complete. Success: ${success}, Failures: ${failures}\n`);
    process.exit(0);
  } catch (err: any) {
    console.error('Fatal error during seed:', err.message);
    process.exit(1);
  }
}

main(); 