import { Router } from 'express';
import { PlanController } from '../controllers/planController';

const router = Router();

// GET /api/plans - Get all insurance plans
router.get('/', PlanController.getAllPlans);

// GET /api/plans/filter - Filter plans based on criteria
router.get('/filter', PlanController.filterPlans);

// GET /api/plans/popular - Get popular plans
router.get('/popular', PlanController.getPopularPlans);

// GET /api/plans/:id - Get a specific plan by ID
router.get('/:id', PlanController.getPlanById);

export default router;