import { Router } from 'express';
import { db } from '../db';
import { insurancePlans } from '../../shared/schema';

const router = Router();

// Esta es una ruta API básica para probar que todo funciona
router.get('/test', (_req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Test endpoint for database and plan loading
router.get('/test/plans', async (req, res) => {
  try {
    console.log('[Test] Checking database connection...');
    
    // Test basic database connection
    const testQuery = await db.select({ count: insurancePlans.id }).from(insurancePlans);
    console.log('[Test] Database query successful, count:', testQuery.length);
    
    // Try to load plans
    const plans = await db.select({
      id: insurancePlans.id,
      name: insurancePlans.name,
      category: insurancePlans.category,
      provider: insurancePlans.provider,
      basePrice: insurancePlans.basePrice,
      currency: insurancePlans.currency,
    }).from(insurancePlans).limit(5);
    
    console.log('[Test] Successfully loaded', plans.length, 'plans');
    
    return res.json({
      success: true,
      databaseConnected: true,
      planCount: testQuery.length,
      samplePlans: plans,
      message: 'Database and plan loading working correctly'
    });
  } catch (error: any) {
    console.error('[Test] Database/plan loading error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      databaseUrl: process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET',
      message: 'Database or plan loading failed'
    });
  }
});

export default router;