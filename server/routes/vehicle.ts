import express from 'express';
import { getVehicleByPlate } from '../services/runt-service';

const router = express.Router();

/**
 * Endpoint to look up vehicle information by license plate.
 * Query Parameter: ?plate=XYZ123
 */
router.get('/lookup', async (req, res) => {
  const plate = req.query.plate as string;

  if (!plate || typeof plate !== 'string' || plate.length < 5) {
    return res.status(400).json({
      error: 'A valid license plate is required.',
      message: 'Please provide a plate query parameter, e.g., /api/vehicle/lookup?plate=XYZ123',
    });
  }

  try {
    const vehicleData = await getVehicleByPlate(plate);
    res.json(vehicleData);
  } catch (error: any) {
    console.error(`[Vehicle Route] Error looking up plate ${plate}:`, error);
    res.status(500).json({
      error: 'Failed to retrieve vehicle information.',
      message: error.message,
    });
  }
});

export default router; 