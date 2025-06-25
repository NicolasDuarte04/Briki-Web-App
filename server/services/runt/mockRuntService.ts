/**
 * =================================================================
 * Mock RUNT Service Implementation
 * =================================================================
 * This service simulates calls to Colombia's RUNT (Registro Único
 * Nacional de Tránsito) for development and testing purposes.
 * =================================================================
 */

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
 * Mock RUNT lookup implementation
 * @param plate The license plate to look up
 * @returns Vehicle data from mock service
 */
export const mockRuntLookup = async (plate: string) => {
  console.log('[RUNT Service] Using MOCK RUNT');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, getRandomInt(200, 600)));
  
  // Generate and return mock vehicle data
  return generateMockVehicle(plate);
}; 