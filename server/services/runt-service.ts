/**
 * =================================================================
 * SERVICE: RUNT Vehicle Lookup
 * =================================================================
 * This service manages vehicle lookups through Colombia's RUNT
 * (Registro Único Nacional de Tránsito) system.
 * 
 * It supports both mock and real API implementations, toggled
 * via the USE_MOCK_RUNT environment variable.
 * =================================================================
 */

import { mockRuntLookup } from './runt/mockRuntService';
import { realRuntLookup } from './runt/realRuntService';

// --- Configuration ---
const USE_MOCK_RUNT = process.env.USE_MOCK_RUNT !== 'false'; // Default to true if not explicitly set to false

/**
 * Fetches vehicle data by license plate.
 * Switches between mock and real service based on configuration.
 *
 * @param plate The license plate to look up.
 * @returns Vehicle data object.
 */
export const getVehicleByPlate = async (plate: string) => {
  console.log(`[RUNT Service] Looking up plate: ${plate}. Mock mode: ${USE_MOCK_RUNT}`);
  
  try {
    if (USE_MOCK_RUNT) {
      return await mockRuntLookup(plate);
    } else {
      return await realRuntLookup(plate);
    }
  } catch (error) {
    // If real service fails and we're not in mock mode, fall back to mock
    if (!USE_MOCK_RUNT) {
      console.error('[RUNT Service] Real RUNT service failed, falling back to mock:', error);
      return await mockRuntLookup(plate);
    }
    throw error;
  }
}; 