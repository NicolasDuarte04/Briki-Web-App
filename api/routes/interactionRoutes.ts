import { Router } from 'express';
import { InteractionController } from '../controllers/interactionController';

const router = Router();

// POST /api/interactions - Record a new interaction
router.post('/', InteractionController.recordInteraction);

// GET /api/interactions/plan/:planId - Get interactions for a specific plan
router.get('/plan/:planId', InteractionController.getPlanInteractions);

// GET /api/interactions/user - Get interactions for a user or device
router.get('/user', InteractionController.getUserInteractions);

export default router;