import express from 'express';
import { z } from 'zod';

const router = express.Router();

// Zod schema for plate validation
const plateSchema = z.object({
  plate: z.string().min(3, 'Plate must be at least 3 characters').max(10, 'Plate must be at most 10 characters'),
});

/**
 * POST /api/lookup-plate
 * Public endpoint – simulates a vehicle lookup in Colombia's RUNT database.
 * Body: { plate: string }
 */
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const validation = plateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: validation.error.flatten().fieldErrors,
      });
    }

    // Extract plate (currently unused because of static mock)
    const { plate } = validation.data;

    // TODO: Replace with real RUNT fetch
    const mockVehicle = {
      plate: 'ABC123',
      make: 'Toyota',
      model: 'Corolla',
      year: 2022,
      fuel: 'Gasoline',
      bodyType: 'Sedan',
      transmission: 'Automatic',
      color: 'White',
    };

    return res.json(mockVehicle);
  } catch (error: any) {
    console.error('[Vehicle Lookup] Unexpected error:', error);
    return res.status(500).json({
      error: 'Failed to process vehicle lookup',
      details: error.message || 'Unknown error',
    });
  }
});

export default router; 