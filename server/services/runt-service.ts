/**
 * =================================================================
 * SERVICE: Mock RUNT Vehicle Lookup
 * =================================================================
 * This service simulates a call to Colombia's RUNT (Registro Único
 * Nacional de Tránsito) to fetch vehicle details by license plate.
 *
 * It includes a mock mode for development and a placeholder for
 * a future real integration.
 * =================================================================
 */

// --- Configuration ---
const USE_MOCK_RUNT = process.env.USE_MOCK_RUNT === 'true' || true; // Default to true for dev

// --- Mock Data ---
const mockBrands = ['Mazda', 'Toyota', 'Chevrolet', 'Nissan', 'Ford', 'Kia', 'Renault', 'Hyundai'];
const mockModels: { [key: string]: string[] } = {
  Mazda: ['3', 'CX-5', '2'],
  Toyota: ['Corolla', 'Hilux', 'RAV4'],
  Chevrolet: ['Onix', 'Spark', 'Tracker'],
  Nissan: ['Versa', 'Kicks', 'Frontier'],
  Ford: ['Fiesta', 'Ranger', 'Explorer'],
  Kia: ['Picanto', 'Rio', 'Sportage'],
  Renault: ['Sandero', 'Duster', 'Logan'],
  Hyundai: ['i10', 'Accent', 'Tucson'],
};
const fuelTypes = ['Gasolina', 'Diesel', 'Híbrido', 'Eléctrico'];

/**
 * Generates a random integer between min and max (inclusive).
 */
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a randomized mock vehicle object.
 * @param plate The license plate being looked up.
 * @returns A mock vehicle data object.
 */
const generateMockVehicle = (plate: string) => {
  const brand = mockBrands[getRandomInt(0, mockBrands.length - 1)];
  const modelList = mockModels[brand] || ['Modelo Genérico'];
  const model = modelList[getRandomInt(0, modelList.length - 1)];
  const year = getRandomInt(2015, 2024);
  const fuel = fuelTypes[getRandomInt(0, fuelTypes.length - 1)];
  const cc = getRandomInt(1200, 3000);

  return {
    plate: plate.toUpperCase(),
    brand,
    model,
    year,
    fuel,
    cc,
    retrievedAt: new Date().toISOString(),
  };
};

/**
 * Placeholder for the real RUNT API integration.
 * This function will be replaced with a real API call in the future.
 */
const realRuntLookup = async (plate: string) => {
  // To be implemented:
  // const response = await fetch(`https://api.runt.gov.co/v1/vehicles?plate=${plate}`, {
  //   headers: { 'Authorization': `Bearer ${process.env.RUNT_API_KEY}` }
  // });
  // if (!response.ok) throw new Error('Failed to fetch from real RUNT service');
  // return await response.json();
  
  console.warn(`[RUNT Service] Real RUNT lookup is not implemented. Returning mock data as a fallback.`);
  return generateMockVehicle(plate);
};

/**
 * Fetches vehicle data by license plate.
 * Switches between mock and real service based on configuration.
 *
 * @param plate The license plate to look up.
 * @returns Vehicle data object.
 */
export const getVehicleByPlate = async (plate: string) => {
  console.log(`[RUNT Service] Looking up plate: ${plate}. Mock mode: ${USE_MOCK_RUNT}`);
  
  if (USE_MOCK_RUNT) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, getRandomInt(200, 600)));
    return generateMockVehicle(plate);
  } else {
    return await realRuntLookup(plate);
  }
}; 