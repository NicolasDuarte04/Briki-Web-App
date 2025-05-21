// Insurance categories
export const INSURANCE_CATEGORIES = {
  TRAVEL: "travel",
  AUTO: "auto",
  PET: "pet",
  HEALTH: "health"
} as const;

export type InsuranceCategory = typeof INSURANCE_CATEGORIES[keyof typeof INSURANCE_CATEGORIES];

// Field labels for different plan categories
export const planFieldLabels: Record<string, Record<string, string>> = {
  travel: {
    basePrice: "Premium",
    coverageAmount: "Coverage Amount",
    destinations: "Covered Destinations",
    coversMedical: "Medical Coverage",
    coversCancellation: "Cancellation Coverage",
    coversValuables: "Valuables Coverage",
    maxTripDuration: "Maximum Trip Duration"
  },
  auto: {
    basePrice: "Premium",
    coverageAmount: "Coverage Amount",
    vehicleTypes: "Covered Vehicle Types",
    comprehensive: "Comprehensive Coverage",
    roadside: "Roadside Assistance"
  },
  pet: {
    basePrice: "Premium",
    coverageAmount: "Coverage Amount",
    petTypes: "Covered Pet Types",
    coversIllness: "Illness Coverage",
    coversAccident: "Accident Coverage"
  },
  health: {
    basePrice: "Premium",
    coverageAmount: "Coverage Amount",
    coversPreventive: "Preventive Care",
    coversEmergency: "Emergency Care",
    coversSpecialist: "Specialist Coverage"
  }
};