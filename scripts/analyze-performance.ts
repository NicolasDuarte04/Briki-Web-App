import { performance } from 'perf_hooks';
import fetch from 'node-fetch';
import { db } from '../server/db';
import { insurancePlans } from '../shared/schema';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface TimingResult {
  stage: string;
  duration: number;
}

async function measureDatabaseQuery(): Promise<TimingResult> {
  const start = performance.now();
  
  try {
    const plans = await db.select().from(insurancePlans);
    const end = performance.now();
    
    console.log(`📊 Database Query: ${(end - start).toFixed(2)}ms - Retrieved ${plans.length} plans`);
    return { stage: 'Database Query', duration: end - start };
  } catch (error) {
    console.error('Database error:', error);
    return { stage: 'Database Query', duration: -1 };
  }
}

async function measureOpenAICall(): Promise<TimingResult> {
  const start = performance.now();
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello, I need insurance for my motorcycle" }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });
    
    const end = performance.now();
    console.log(`🤖 OpenAI API Call: ${(end - start).toFixed(2)}ms`);
    return { stage: 'OpenAI API Call', duration: end - start };
  } catch (error) {
    console.error('OpenAI error:', error);
    return { stage: 'OpenAI API Call', duration: -1 };
  }
}

async function measureFullRequest(): Promise<TimingResult> {
  const start = performance.now();
  
  try {
    const response = await fetch('http://localhost:5051/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "necesito un seguro para mi moto",
        conversationHistory: [],
        memory: {},
        resetContext: false
      })
    });
    
    const data = await response.json();
    const end = performance.now();
    
    console.log(`🌐 Full API Request: ${(end - start).toFixed(2)}ms`);
    console.log(`   - Plans returned: ${data.suggestedPlans?.length || 0}`);
    return { stage: 'Full API Request', duration: end - start };
  } catch (error) {
    console.error('API error:', error);
    return { stage: 'Full API Request', duration: -1 };
  }
}

async function measurePlanFiltering(): Promise<TimingResult> {
  const start = performance.now();
  
  try {
    // Simulate the plan filtering logic
    const allPlans = await db.select().from(insurancePlans);
    
    // Filter by category
    const autoPplans = allPlans.filter(p => p.category === 'auto');
    
    // Sort by relevance (simplified)
    const sorted = autoPplans.sort((a, b) => a.basePrice - b.basePrice);
    
    // Take top 4
    const topPlans = sorted.slice(0, 4);
    
    const end = performance.now();
    console.log(`🔍 Plan Filtering: ${(end - start).toFixed(2)}ms - Filtered to ${topPlans.length} plans`);
    return { stage: 'Plan Filtering', duration: end - start };
  } catch (error) {
    console.error('Filtering error:', error);
    return { stage: 'Plan Filtering', duration: -1 };
  }
}

async function runPerformanceAnalysis() {
  console.log('🚀 Starting Performance Analysis...\n');
  
  // Wait for server to be ready
  console.log('⏳ Waiting for server to be ready...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const results: TimingResult[] = [];
  
  // Run each measurement 3 times and average
  console.log('\n📊 Running measurements (3 iterations each)...\n');
  
  for (let i = 0; i < 3; i++) {
    console.log(`\n--- Iteration ${i + 1} ---`);
    
    results.push(await measureDatabaseQuery());
    results.push(await measureOpenAICall());
    results.push(await measurePlanFiltering());
    results.push(await measureFullRequest());
    
    // Wait between iterations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Calculate averages
  console.log('\n\n📈 PERFORMANCE SUMMARY');
  console.log('=' .repeat(50));
  
  const stages = ['Database Query', 'OpenAI API Call', 'Plan Filtering', 'Full API Request'];
  
  for (const stage of stages) {
    const stageResults = results.filter(r => r.stage === stage && r.duration > 0);
    if (stageResults.length > 0) {
      const avg = stageResults.reduce((sum, r) => sum + r.duration, 0) / stageResults.length;
      const min = Math.min(...stageResults.map(r => r.duration));
      const max = Math.max(...stageResults.map(r => r.duration));
      
      console.log(`\n${stage}:`);
      console.log(`  Average: ${avg.toFixed(2)}ms`);
      console.log(`  Min: ${min.toFixed(2)}ms`);
      console.log(`  Max: ${max.toFixed(2)}ms`);
    }
  }
  
  console.log('\n\n💡 RECOMMENDATIONS:');
  
  const dbAvg = results.filter(r => r.stage === 'Database Query').reduce((sum, r) => sum + r.duration, 0) / 3;
  const openaiAvg = results.filter(r => r.stage === 'OpenAI API Call').reduce((sum, r) => sum + r.duration, 0) / 3;
  
  if (openaiAvg > 3000) {
    console.log('- ⚠️  OpenAI calls are the main bottleneck (>3s)');
    console.log('  → Consider implementing response caching for common queries');
    console.log('  → Use streaming responses for better perceived performance');
  }
  
  if (dbAvg > 100) {
    console.log('- ⚠️  Database queries are slow (>100ms)');
    console.log('  → Add indexes on category and country columns');
    console.log('  → Consider caching plan data in memory');
  }
  
  console.log('\n- ✅ Implement parallel processing where possible');
  console.log('- ✅ Cache OpenAI responses for common questions');
  console.log('- ✅ Pre-filter plans by category on page load');
  console.log('- ✅ Use connection pooling for database');
  
  process.exit(0);
}

// Run the analysis
runPerformanceAnalysis().catch(console.error); 