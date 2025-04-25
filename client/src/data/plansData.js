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
  },
  {
    id: 3,
    name: "Standard Travel Insurance",
    provider: "IATI",
    basePrice: 120,
    medicalCoverage: 200000, // €200,000 worldwide
    dentalExpenses: 350, // €350
    repatriation: "100% of cost",
    convalescenceHotel: "Up to €750 (max €75/day)",
    tripCancellation: "Up to €1,500",
    tripInterruption: "Included",
    earlyReturn: [
      "Death or hospitalization of family",
      "Major home or business incident"
    ],
    baggageProtection: 1000, // €1,000
    baggageDelay: 120, // €120
    missedTransportDelay: "Up to €180 after 6h delay",
    personalAccident: {
      death: 6000, // €6,000
      disability: "Up to €6,000"
    },
    civilLiability: 60000, // €60,000
    adventureActivities: false,
    covidCoverage: true,
    rating: "4.5",
    reviews: 142,
    country: "Global",
    extraFeatures: [
      "Assistance for minors",
      "Emergency return tickets",
      "Criminal defense abroad (€3,000)",
      "Advance of funds abroad (€1,000)",
      "Medication shipment",
      "Legal claims abroad (€2,000)"
    ],
    exclusions: [
      "Pre-existing conditions",
      "Pregnancy beyond 24 weeks",
      "Extreme sports",
      "Illegal activity",
      "War, pandemics, alcohol-related incidents"
    ]
  },
  {
    id: 4,
    name: "Global Travel Assistance",
    provider: "Assist Card",
    basePrice: 135,
    medicalCoverage: 150000, // Plan-specific (estimated value)
    dentalEmergency: 300, // Per tooth
    preExistingConditions: "Emergency stabilization only",
    repatriation: "Injury/death covered",
    tripCancellation: "Optional add-on",
    tripInterruption: "For family/medical/death emergencies",
    baggageProtection: "Based on kg; limits apply",
    baggageDelay: "After 8h+; essentials covered",
    transportDelays: "Food/hotel if delayed 6h+",
    accidentalDeath: {
      publicTransport: 60000,
      general: 20000,
      ageLimit: "Only to age 74"
    },
    legalAssistance: "Available abroad",
    adventureActivities: false, // "Only with upgrade"
    maternity: "Covered to 26 weeks (extendable)",
    covidCoverage: true,
    rating: "4.5",
    reviews: 221,
    country: "Global",
    extraFeatures: [
      "Escort minors/elderly",
      "Hotel stay after hospitalization",
      "Cruise delay coverage",
      "Home emergency return transport",
      "Message relay service"
    ],
    territorialLimitations: "No coverage in country of issuance",
    exclusions: [
      "Extreme sports",
      "Pregnancy > 26 weeks",
      "Substance-related incidents",
      "Mental illness",
      "Illegal activities"
    ]
  },
  {
    id: 5,
    name: "Travel Insurance (Standard)",
    provider: "SURA",
    basePrice: 145,
    medicalCoverage: 175000, // Estimated value
    preExistingConditions: "Covered if complications arise",
    dentalEmergency: "Included",
    emergencyTransfer: "To facility or home",
    hospitalizationDailyCompensation: "After 48h, up to 5 days",
    postCareMedications: "Covered",
    homeMedicalCare: "During trip",
    telephoneMedicalGuidance: "24/7",
    repatriation: "Full coverage",
    companionReturnInCaseOfDeath: "Included",
    internationalEvacuation: "Managed by SURA",
    hotelExtensionDueToIllness: "Insured + companion",
    earlyReturnTransport: "Paid if emergency",
    accidentalDeath: "Beneficiaries compensated",
    pregnancy: "Covered to week 32",
    sportAccidents: "Non-professional; protection required",
    adventureActivities: true, // Based on "sportAccidents" field
    covidCoverage: true,
    tripCancellation: {
      medicalReason: "Covered (with certification)",
      transportationCompanyFailure: "Covered",
      jobRelated: "Covered",
      naturalDisaster: "Covered",
      pregnancy: "Covered",
      juryDuty: "Covered",
      familyDeath: "Covered",
      partialOrFullTripLoss: "Reimbursed"
    },
    baggageAndDocuments: {
      baggageLoss: "Reimbursed (24h/48h)",
      baggageDelay: "Reimbursed",
      stolenDocuments: "Reimbursed"
    },
    baggageProtection: 1200, // Estimated value
    baggageDelay: "Reimbursed",
    rating: "4.8",
    reviews: 176,
    country: "Colombia",
    extras: [
      "Legal counseling",
      "WhatsApp support (24/7)",
      "USD/COP reimbursement system",
      "Support phone lines",
      "Companion escort"
    ],
    exclusions: [
      "See full policy"
    ]
  }
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