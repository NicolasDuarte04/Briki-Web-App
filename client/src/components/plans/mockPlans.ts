import { InsuranceCategory } from "./PlanCard";

// Interface for mock insurance plans
export interface MockInsurancePlan {
  id: number | string;
  title: string;
  provider: string;
  price: number;
  description?: string;
  features: string[];
  badge?: string;
  rating?: string;
  category: InsuranceCategory;
}

// Travel insurance mock plans
export const travelPlans: MockInsurancePlan[] = [
  {
    id: "travel-1",
    title: "Essential Travel Coverage",
    provider: "GeoBlue",
    price: 59,
    description: "Basic travel protection for domestic and international trips",
    features: [
      "Medical coverage up to $100,000",
      "Trip cancellation protection",
      "24/7 emergency assistance",
      "Baggage protection up to $1,500"
    ],
    badge: "Most Popular",
    rating: "4.7",
    category: "travel"
  },
  {
    id: "travel-2",
    title: "Premium Explorer Plan",
    provider: "WorldWide Assurance",
    price: 89,
    description: "Comprehensive coverage for adventurous travelers",
    features: [
      "Medical coverage up to $250,000",
      "Adventure activities included",
      "Trip cancellation/interruption",
      "Emergency evacuation up to $500,000"
    ],
    rating: "4.8",
    category: "travel"
  },
  {
    id: "travel-3",
    title: "Business Traveler Shield",
    provider: "Corporate Protector",
    price: 75,
    description: "Specialized protection for business trips abroad",
    features: [
      "Business equipment coverage",
      "Trip delay compensation",
      "Extended medical coverage",
      "Identity theft protection"
    ],
    rating: "4.5",
    category: "travel"
  },
  {
    id: "travel-4",
    title: "Family Vacation Package",
    provider: "Family Safe Travel",
    price: 125,
    description: "Complete protection for the whole family",
    features: [
      "Coverage for up to 5 family members",
      "Child-specific benefits",
      "Family reunion benefit",
      "Pet return coverage"
    ],
    badge: "Best Value",
    rating: "4.9",
    category: "travel"
  }
];

// Auto insurance mock plans
export const autoPlans: MockInsurancePlan[] = [
  {
    id: "auto-1",
    title: "Basic Auto Protection",
    provider: "SafeDrive",
    price: 85,
    description: "Essential coverage for your vehicle",
    features: [
      "Liability coverage",
      "Collision protection",
      "24/7 roadside assistance",
      "Personal injury protection"
    ],
    rating: "4.3",
    category: "auto"
  },
  {
    id: "auto-2",
    title: "Premium Vehicle Coverage",
    provider: "AutoGuard Plus",
    price: 120,
    description: "Comprehensive protection for all types of vehicles",
    features: [
      "Comprehensive collision coverage",
      "Uninsured motorist protection",
      "Rental car reimbursement",
      "Vehicle replacement cost"
    ],
    badge: "Best Coverage",
    rating: "4.7",
    category: "auto"
  },
  {
    id: "auto-3",
    title: "Economy Driver Plan",
    provider: "Budget Auto",
    price: 65,
    description: "Affordable coverage for budget-conscious drivers",
    features: [
      "Basic liability coverage",
      "Limited collision protection",
      "Budget-friendly premium",
      "Accident forgiveness"
    ],
    badge: "Most Affordable",
    rating: "4.1",
    category: "auto"
  },
  {
    id: "auto-4",
    title: "Luxury Vehicle Protection",
    provider: "Elite Auto Insurers",
    price: 175,
    description: "Specialized coverage for high-value vehicles",
    features: [
      "High-value vehicle coverage",
      "Original parts replacement",
      "Concierge claims service",
      "Valet service during repairs"
    ],
    rating: "4.9",
    category: "auto"
  }
];

// Pet insurance mock plans
export const petPlans: MockInsurancePlan[] = [
  {
    id: "pet-1",
    title: "Basic Pet Care",
    provider: "PetProtect",
    price: 25,
    description: "Essential medical coverage for your pets",
    features: [
      "Accident & illness coverage",
      "Veterinary exam fees",
      "Prescription medications",
      "Emergency care"
    ],
    rating: "4.2",
    category: "pet"
  },
  {
    id: "pet-2",
    title: "Complete Pet Health",
    provider: "FurryFriends Insurance",
    price: 45,
    description: "Comprehensive health protection for cats and dogs",
    features: [
      "Preventive care included",
      "Dental cleaning coverage",
      "Hereditary condition coverage",
      "Behavioral therapy"
    ],
    badge: "Most Comprehensive",
    rating: "4.8",
    category: "pet"
  },
  {
    id: "pet-3",
    title: "Senior Pet Plan",
    provider: "GoldenYears Pet Care",
    price: 38,
    description: "Specialized coverage for older pets",
    features: [
      "Senior-specific conditions",
      "Prescription diet coverage",
      "Mobility aid coverage",
      "Alternative therapy options"
    ],
    rating: "4.6",
    category: "pet"
  },
  {
    id: "pet-4",
    title: "Accident-Only Coverage",
    provider: "PetSafe Basic",
    price: 15,
    description: "Affordable protection against accidents",
    features: [
      "Accident emergency care",
      "Surgery for injuries",
      "X-rays and diagnostics",
      "Hospitalization for accidents"
    ],
    badge: "Budget Friendly",
    rating: "4.0",
    category: "pet"
  }
];

// Health insurance mock plans
export const healthPlans: MockInsurancePlan[] = [
  {
    id: "health-1",
    title: "Essential Health Plan",
    provider: "VitalCare",
    price: 120,
    description: "Basic health coverage for individuals",
    features: [
      "Primary care visits",
      "Emergency services",
      "Prescription drug coverage",
      "Preventive care included"
    ],
    rating: "4.3",
    category: "health"
  },
  {
    id: "health-2",
    title: "Family Complete Care",
    provider: "FamilyHealth Plus",
    price: 295,
    description: "Comprehensive family health coverage",
    features: [
      "Coverage for whole family",
      "Dental and vision included",
      "Mental health services",
      "Maternity coverage"
    ],
    badge: "Family Choice",
    rating: "4.7",
    category: "health"
  },
  {
    id: "health-3",
    title: "Premium Health Protection",
    provider: "Elite Medical",
    price: 210,
    description: "Premium coverage with expanded benefits",
    features: [
      "Low deductibles",
      "Specialist consultations",
      "Advanced diagnostic tests",
      "International coverage included"
    ],
    badge: "Best Value",
    rating: "4.9",
    category: "health"
  },
  {
    id: "health-4",
    title: "Young Adult Health Plan",
    provider: "NextGen Health",
    price: 85,
    description: "Tailored coverage for young adults and students",
    features: [
      "Affordable monthly premium",
      "Digital health consultations",
      "Sports injury coverage",
      "Mental wellness services"
    ],
    rating: "4.5",
    category: "health"
  }
];