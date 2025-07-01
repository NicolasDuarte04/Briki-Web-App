import { db } from '../server/db';
import { insurancePlans } from '../shared/schema';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkDatabase() {
  console.log('🔍 Checking database connection and schema...\n');
  
  try {
    // Show connection info (without sensitive data)
    console.log('Database connection info:');
    console.log(`  Host: ${process.env.DATABASE_HOST || 'Not set'}`);
    console.log(`  Database: ${process.env.DATABASE_NAME || 'Not set'}`);
    console.log(`  SSL: ${process.env.DATABASE_SSL === 'true' ? 'Enabled' : 'Disabled'}`);
    console.log();
    
    // 1. Get distinct categories
    console.log('1. Distinct categories in insurance_plans:');
    const categories = await db
      .selectDistinct({ category: insurancePlans.category })
      .from(insurancePlans);
    console.log('   Categories found:', categories.map(c => c.category).sort());
    
    // 2. Check table columns
    console.log('\n2. Checking table schema for new columns:');
    const schemaQuery = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'insurance_plans'
      AND column_name IN ('subcategory', 'brochure_link')
      ORDER BY column_name;
    `);
    
    if (schemaQuery.rows.length === 0) {
      console.log('   ❌ Columns subcategory and brochure_link do NOT exist');
    } else {
      console.log('   ✅ Found columns:');
      schemaQuery.rows.forEach((row: any) => {
        console.log(`      - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
    }
    
    // 3. Get a sample pet or home plan
    console.log('\n3. Sample pet/home plan data:');
    const samplePlan = await db
      .select()
      .from(insurancePlans)
      .where(sql`category IN ('pet', 'home')`)
      .limit(1);
    
    if (samplePlan.length > 0) {
      const plan = samplePlan[0];
      console.log(`\n   Plan: ${plan.name} (${plan.category})`);
      console.log(`   Provider: ${plan.provider}`);
      console.log(`   Benefits type: ${typeof plan.benefits}`);
      console.log(`   Benefits value: ${JSON.stringify(plan.benefits, null, 2)}`);
      
      // Check if subcategory and brochure_link exist
      if ('subcategory' in plan) {
        console.log(`   Subcategory: ${(plan as any).subcategory || 'null'}`);
      }
      if ('brochure_link' in plan) {
        console.log(`   Brochure Link: ${(plan as any).brochure_link || 'null'}`);
      }
    } else {
      console.log('   ❌ No pet or home plans found in the database');
    }
    
    // 4. Check total count by category
    console.log('\n4. Plan count by category:');
    const counts = await db.execute(sql`
      SELECT category, COUNT(*) as count
      FROM insurance_plans
      GROUP BY category
      ORDER BY category;
    `);
    counts.rows.forEach((row: any) => {
      console.log(`   ${row.category}: ${row.count} plans`);
    });
    
    // 5. Check all columns in the table
    console.log('\n5. All columns in insurance_plans table:');
    const allColumns = await db.execute(sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'insurance_plans'
      ORDER BY ordinal_position;
    `);
    console.log('   Columns:');
    allColumns.rows.forEach((row: any) => {
      console.log(`      - ${row.column_name}: ${row.data_type}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
}

checkDatabase(); 