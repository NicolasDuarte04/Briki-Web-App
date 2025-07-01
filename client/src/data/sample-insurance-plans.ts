import { InsurancePlan } from '../store/compare-store';
import { InsuranceCategory } from '../../../shared/schema';

// Sample insurance plans data using the new schema
export const sampleInsurancePlans: InsurancePlan[] = [
  // Travel Insurance Plans
  {
    id: 'travel-1',
    planId: 'geoblue-essential',
    name: 'GeoBlue Essential',
    provider: 'GeoBlue',
    category: 'travel',
    basePrice: 120,
    coverageAmount: 250000,
    description: 'Basic travel insurance for short international trips with essential medical coverage.',
    rating: '4.2',
    reviews: 128,
    country: 'Global',
    badge: 'Best Value',
    categoryDetails: {
      travel: {
        tripCancellation: 2500,
        tripInterruption: 5000,
        emergencyMedical: 50000,
        medicalEvacuation: 250000,
        baggageCoverage: 1000,
        baggageDelay: 200,
        travelDelay: 500,
        adventureActivities: false,
        preExistingConditions: false,
        rentalCarCoverage: 0,
        coverage24h: true
      }
    }
  },
  {
    id: 'travel-2',
    planId: 'allianz-alltrips',
    name: 'AllTrips Premier',
    provider: 'Allianz',
    category: 'travel',
    basePrice: 275,
    coverageAmount: 500000,
    description: 'Comprehensive annual travel insurance plan for frequent travelers.',
    rating: '4.7',
    reviews: 378,
    country: 'Global',
    badge: 'Premium',
    categoryDetails: {
      travel: {
        tripCancellation: 5000,
        tripInterruption: 7500,
        emergencyMedical: 100000,
        medicalEvacuation: 500000,
        baggageCoverage: 2000,
        baggageDelay: 300,
        travelDelay: 1000,
        adventureActivities: true,
        preExistingConditions: true,
        rentalCarCoverage: 35000,
        coverage24h: true
      }
    }
  },
  
  // Auto Insurance Plans
  {
    id: 'auto-1',
    planId: 'progress-basic',
    name: 'Basic Coverage',
    provider: 'Progressive',
    category: 'auto',
    basePrice: 850,
    coverageAmount: 100000,
    description: 'Affordable auto insurance with basic liability coverage.',
    rating: '3.9',
    reviews: 524,
    country: 'US',
    categoryDetails: {
      auto: {
        liabilityCoverage: 50000,
        collisionCoverage: 25000,
        comprehensiveCoverage: 15000,
        personalInjuryProtection: 10000,
        uninsuredMotoristCoverage: true,
        roadSideAssistance: false,
        rentalReimbursement: 0,
        deductible: 1000,
        multiVehicleDiscount: true,
        antiTheftDiscount: false,
        safeDriverDiscount: true
      }
    }
  },
  {
    id: 'auto-2',
    planId: 'geico-premium',
    name: 'Premium Protection',
    provider: 'GEICO',
    category: 'auto',
    basePrice: 1250,
    coverageAmount: 300000,
    description: 'Comprehensive coverage with added benefits and lower deductibles.',
    rating: '4.5',
    reviews: 982,
    country: 'US',
    badge: 'Most Popular',
    categoryDetails: {
      auto: {
        liabilityCoverage: 100000,
        collisionCoverage: 50000,
        comprehensiveCoverage: 30000,
        personalInjuryProtection: 25000,
        uninsuredMotoristCoverage: true,
        roadSideAssistance: true,
        rentalReimbursement: 30,
        deductible: 500,
        multiVehicleDiscount: true,
        antiTheftDiscount: true,
        safeDriverDiscount: true
      }
    }
  },
  
  // Pet Insurance Plans
  {
    id: 'pet-1',
    planId: 'petsure-basic',
    name: 'Basic Pet Care',
    provider: 'PetSure',
    category: 'pet',
    basePrice: 240,
    coverageAmount: 5000,
    description: 'Basic coverage for accidents and illnesses.',
    rating: '4.1',
    reviews: 321,
    country: 'US',
    categoryDetails: {
      pet: {
        annualLimit: 5000,
        deductible: 250,
        reimbursement: 70,
        illnessCoverage: true,
        accidentCoverage: true,
        wellnessCoverage: false,
        dentalCoverage: false,
        prescriptionCoverage: true,
        behavioralTherapy: false,
        waitingPeriod: '14 days',
        maximumAge: 10
      }
    }
  },
  {
    id: 'pet-2',
    planId: 'trupanion-premium',
    name: 'Trupanion Complete',
    provider: 'Trupanion',
    category: 'pet',
    basePrice: 480,
    coverageAmount: 15000,
    description: 'Comprehensive pet insurance with extensive coverage.',
    rating: '4.8',
    reviews: 589,
    country: 'US, Canada',
    badge: 'Top Rated',
    categoryDetails: {
      pet: {
        annualLimit: 15000,
        deductible: 100,
        reimbursement: 90,
        illnessCoverage: true,
        accidentCoverage: true,
        wellnessCoverage: true,
        dentalCoverage: true,
        prescriptionCoverage: true,
        behavioralTherapy: true,
        waitingPeriod: '10 days',
        maximumAge: 14
      }
    }
  },
  
  // Health Insurance Plans
  {
    id: 'health-1',
    planId: 'bcbs-silver',
    name: 'Silver Health Plan',
    provider: 'Blue Cross Blue Shield',
    category: 'health',
    basePrice: 350,
    coverageAmount: 1000000,
    description: 'Affordable health insurance with good coverage for most needs.',
    rating: '4.0',
    reviews: 762,
    country: 'US',
    categoryDetails: {
      health: {
        annualDeductible: 2500,
        outOfPocketMax: 8000,
        coInsurance: '80/20',
        primaryCareVisit: '$25 copay',
        specialistVisit: '$50 copay',
        emergencyRoomCare: '$300 copay',
        hospitalStay: '$500/day',
        prescriptionDrugCoverage: 'Tier 1-4',
        preventiveCare: 'Covered 100%',
        maternityCare: true,
        mentalHealthCoverage: true,
        networkType: 'PPO'
      }
    }
  },
  {
    id: 'health-2',
    planId: 'unitedhealth-gold',
    name: 'Gold Health Plan',
    provider: 'UnitedHealthcare',
    category: 'health',
    basePrice: 520,
    coverageAmount: 2000000,
    description: 'Premium health coverage with low deductibles and comprehensive benefits.',
    rating: '4.6',
    reviews: 426,
    country: 'US',
    badge: 'Comprehensive',
    categoryDetails: {
      health: {
        annualDeductible: 1000,
        outOfPocketMax: 4000,
        coInsurance: '90/10',
        primaryCareVisit: '$15 copay',
        specialistVisit: '$30 copay',
        emergencyRoomCare: '$200 copay',
        hospitalStay: '$300/day',
        prescriptionDrugCoverage: 'Tier 1-5',
        preventiveCare: 'Covered 100%',
        maternityCare: true,
        mentalHealthCoverage: true,
        networkType: 'PPO'
      }
    }
  }
];

// Helper function to get sample plans by category
export const getSamplePlansByCategory = (category: InsuranceCategory): InsurancePlan[] => {
  return sampleInsurancePlans.filter(plan => plan.category === category);
};

// Helper function to get a sample plan by ID
export const getSamplePlanById = (id: string): InsurancePlan | undefined => {
  return sampleInsurancePlans.find(plan => plan.id === id);
};