import "dotenv/config";
import { db } from '../server/db';
import { insurancePlans, INSURANCE_CATEGORIES } from '../shared/schema';

async function seed() {
  console.log("Seeding database with real insurance plans...");

  const plansToSeed = [
    // Travel
    { name: 'Traveler Basic', category: INSURANCE_CATEGORIES.TRAVEL, provider: 'Global Guard', basePrice: 25, currency: 'USD', country: 'CO', benefits: ['Medical emergency up to $10,000', 'Trip cancellation up to $500', '24/7 assistance'] },
    { name: 'Traveler Plus', category: INSURANCE_CATEGORIES.TRAVEL, provider: 'Global Guard', basePrice: 45, currency: 'USD', country: 'CO', benefits: ['Medical emergency up to $50,000', 'Trip cancellation up to $2,000', 'Lost baggage up to $1,000', 'Adventure sports coverage'] },
    { name: 'World Nomad', category: INSURANCE_CATEGORIES.TRAVEL, provider: 'Venture Sure', basePrice: 60, currency: 'USD', country: 'US', benefits: ['Medical emergency up to $100,000', 'Trip cancellation up to $5,000', 'Rental car coverage', '24/7 assistance'] },
    { name: 'Euro Explorer', category: INSURANCE_CATEGORIES.TRAVEL, provider: 'Safe Journey', basePrice: 35, currency: 'EUR', country: 'ES', benefits: ['Schengen visa compliant', 'Medical up to €30,000', 'Lost baggage up to €500'] },
    { name: 'Backpacker Secure', category: INSURANCE_CATEGORIES.TRAVEL, provider: 'Venture Sure', basePrice: 20, currency: 'USD', country: 'US', benefits: ['Medical emergency up to $20,000', 'Theft protection up to $500', '24/7 assistance'] },

    // Auto
    { name: 'Auto Basic', category: INSURANCE_CATEGORIES.AUTO, provider: 'DriveWell', basePrice: 50, currency: 'USD', country: 'US', benefits: ['Liability coverage up to $50,000', 'Roadside assistance', 'Towing service'] },
    { name: 'Auto Premium', category: INSURANCE_CATEGORIES.AUTO, provider: 'DriveWell', basePrice: 120, currency: 'USD', country: 'US', benefits: ['Full coverage (collision & comprehensive)', 'Rental reimbursement', 'New car replacement'] },
    { name: 'Moto Shield', category: INSURANCE_CATEGORIES.AUTO, provider: 'RideSafe', basePrice: 40, currency: 'USD', country: 'US', benefits: ['Motorcycle liability', 'Custom parts coverage', 'Roadside assistance'] },
    { name: 'Eco-Driver', category: INSURANCE_CATEGORIES.AUTO, provider: 'GreenWheels', basePrice: 65, currency: 'USD', country: 'CA', benefits: ['EV and hybrid coverage', 'Charging station damage', 'Battery protection'] },
    { name: 'City Cruiser', category: INSURANCE_CATEGORIES.AUTO, provider: 'MetroMile', basePrice: 30, currency: 'USD', country: 'US', benefits: ['Pay-per-mile option', 'Liability coverage', 'Theft tracking'] },

    // Pet
    { name: 'Pet Basic Care', category: INSURANCE_CATEGORIES.PET, provider: 'Paws & Claws', basePrice: 15, currency: 'USD', country: 'US', benefits: ['Accident coverage up to $2,000', 'Emergency vet visits', 'Poison control consultation'] },
    { name: 'Pet Wellness Plus', category: INSURANCE_CATEGORIES.PET, provider: 'Paws & Claws', basePrice: 35, currency: 'USD', country: 'US', benefits: ['Accident & illness coverage up to $10,000', 'Annual check-ups', 'Vaccinations', 'Dental cleaning'] },
    { name: 'Feline Friend', category: INSURANCE_CATEGORIES.PET, provider: 'CatLife', basePrice: 20, currency: 'USD', country: 'UK', benefits: ['Cat-specific illness coverage', 'Hereditary conditions', 'Behavioral therapy'] },
    { name: 'Canine Complete', category: INSURANCE_CATEGORIES.PET, provider: 'DogGuard', basePrice: 40, currency: 'USD', country: 'US', benefits: ['Coverage for chronic conditions', 'Surgery and hospitalization', 'Alternative therapies'] },
    { name: 'Exotic Pet Shield', category: INSURANCE_CATEGORIES.PET, provider: 'WildHeart', basePrice: 55, currency: 'USD', country: 'US', benefits: ['Coverage for birds and reptiles', 'Specialist vet visits', 'Lab tests'] },

    // Health
    { name: 'Health Essential', category: INSURANCE_CATEGORIES.HEALTH, provider: 'VitaCare', basePrice: 150, currency: 'USD', country: 'US', benefits: ['Hospitalization coverage', 'Prescription drugs', 'Preventive care', 'Telehealth services'] },
    { name: 'Health Premier', category: INSURANCE_CATEGORIES.HEALTH, provider: 'VitaCare', basePrice: 350, currency: 'USD', country: 'US', benefits: ['Low deductible', 'Specialist visits', 'Maternity care', 'Mental health support'] },
    { name: 'Digital Nomad Health', category: INSURANCE_CATEGORIES.HEALTH, provider: 'Global Health', basePrice: 80, currency: 'USD', country: 'CO', benefits: ['Worldwide coverage (excl. USA)', 'Emergency medical', 'Telehealth consultations'] },
    { name: 'Family First', category: INSURANCE_CATEGORIES.HEALTH, provider: 'KindredCare', basePrice: 500, currency: 'USD', country: 'US', benefits: ['Covers 2 adults and up to 3 children', 'Pediatric dental and vision', 'Wellness programs'] },
    { name: 'Senior Secure', category: INSURANCE_CATEGORIES.HEALTH, provider: 'GoldenAge', basePrice: 250, currency: 'USD', country: 'US', benefits: ['Medicare supplement', 'Coverage for chronic conditions', 'Hearing, dental, and vision'] },
  ];

  try {
    // Clear existing plans to avoid duplicates during re-seeding
    await db.delete(insurancePlans);
    console.log("Cleared existing insurance plans.");

    // Insert new plans
    await db.insert(insurancePlans).values(plansToSeed);
    console.log(`Successfully seeded ${plansToSeed.length} insurance plans.`);

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    console.log("Seeding complete.");
    process.exit(0);
  }
}

seed(); 