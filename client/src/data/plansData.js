/**
 * Real insurance plan data from official providers
 * Data extracted from public brochures of AXA, IATI, Assist Card, Starr, and SURA
 */

export const insurancePlans = [
  {
    id: 1,
    name: "Gold Single Travel Plan",
    provider: "AXA Assistance USA",
    basePrice: 159,
    medicalCoverage: 100000,
    tripCancellation: "Up to trip cost",
    tripInterruption: "150% of trip cost",
    tripDelay: "$200/day, up to $1,000",
    missedConnection: 1000,
    baggageProtection: 1500, // (max $250/article, $500 for valuables)
    baggageDelay: 300, // (after 24 hours)
    emergencyEvacuation: 500000,
    repatriation: 500000,
    accidentalDeath: 25000,
    accidentalDeathAirOnly: 50000,
    adventureActivities: false,
    covidCoverage: true,
    rating: "4.7",
    reviews: 189,
    country: "Global",
    servicesIncluded: [
      "24/7 Medical & Travel Assistance",
      "Emergency Evacuation",
      "Medical Repatriation",
      "Dispatch of Physician & Medication",
      "Identity Theft Services",
      "Lost Document Assistance",
      "Concierge Services"
    ],
    exclusions: [
      "Pre-existing conditions",
      "Suicide or self-inflicted injury",
      "War, military service, extreme sports",
      "Cosmetic surgery, dental (unless accidental)",
      "Pregnancy unless complications arise"
    ]
  },
  {
    id: 2,
    name: "Total Comfort with Cancellation",
    provider: "IATI",
    basePrice: 172,
    medicalCoverage: 999999, // Unlimited within policy terms
    emergencyDental: "Covered (urgent cases only)",
    hospitalizationAbroad: "Covered with advance payment",
    tripCancellation: "Covered, multiple reasons allowed",
    tripInterruption: "Covered",
    baggageProtection: 2000, // Estimated value
    baggageDelay: "Essentials after 8h delay",
    personalAccident: {
      death: "Covered",
      disability: "Based on severity"
    },
    repatriation: "Medical or remains covered",
    earlyReturn: [
      "Illness/death of family",
      "Home/work emergencies",
      "Border closures/emergency return"
    ],
    adventureActivities: true, // Based on "Coverage for sports (non-professional)"
    covidCoverage: true,
    legalDefense: "Covered abroad",
    thirdPartyLiability: "Covered for personal harm",
    rating: "4.6",
    reviews: 167,
    country: "Global",
    extras: [
      "Coverage for sports (non-professional)",
      "Card cancellation, urgent medication shipping",
      "Delayed delivery for ski/golf equipment",
      "Reimbursement for missed services due to repatriation"
    ],
    exclusions: [
      "Pre-existing/chronic conditions",
      "Pregnancy after 7th month",
      "Extreme sports",
      "Professional competition",
      "War zones, pandemics without preventive measures"
    ]
  }
  // Will add more plans as you provide them
];

// Helper functions to work with the insurance plans data
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatCoverage = (coverage) => {
  if (typeof coverage === 'number') {
    return formatPrice(coverage);
  }
  return coverage;
};

// Find best value plan based on medical coverage and price ratio
export const getBestValuePlan = () => {
  return insurancePlans.reduce((best, current) => {
    // Simple value calculation: medical coverage per dollar spent
    const bestRatio = best.medicalCoverage / best.basePrice;
    const currentRatio = current.medicalCoverage / current.basePrice;
    return currentRatio > bestRatio ? current : best;
  }, insurancePlans[0]);
};

// Find most economical plan
export const getMostEconomicalPlan = () => {
  return insurancePlans.reduce((prev, current) => 
    (prev.basePrice < current.basePrice) ? prev : current
  );
};

// Get plans filtered by criteria
export const getFilteredPlans = (criteria = {}) => {
  return insurancePlans.filter(plan => {
    // Apply filters based on criteria
    if (criteria.maxPrice && plan.basePrice > criteria.maxPrice) return false;
    if (criteria.minMedicalCoverage && plan.medicalCoverage < criteria.minMedicalCoverage) return false;
    if (criteria.requiresCovid && !plan.covidCoverage) return false;
    if (criteria.requiresAdventure && !plan.adventureActivities) return false;
    return true;
  });
};

export default insurancePlans;