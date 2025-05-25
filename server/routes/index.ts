import { Router } from 'express';
import authRoutes from './auth';
import apiRoutes from './api';
import aiRoutes from './ai';

const router = Router();

router.use('/auth', authRoutes);
router.use('/api', apiRoutes);
router.use('/ai', aiRoutes);

export default router;