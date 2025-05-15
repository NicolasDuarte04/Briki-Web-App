import { InsuranceCategory } from "@shared/schema";

/**
 * Shared content for insurance categories across the application
 * This centralizes copy to maintain consistency between explore and app pages
 */

// Common insurance category paths
export const CATEGORY_PATHS = {
  travel: {
    explore: "/explore/travel",
    app: "/insurance/travel",
    legacy: "/travel-insurance"
  },
  auto: {
    explore: "/explore/auto",
    app: "/insurance/auto",
    legacy: "/auto-insurance"
  },
  pet: {
    explore: "/explore/pet",
    app: "/insurance/pet",
    legacy: "/pet-insurance"
  },
  health: {
    explore: "/explore/health",
    app: "/insurance/health",
    legacy: "/health-insurance"
  }
};

// Section titles that appear across multiple pages
export const SECTION_TITLES = {
  whyChoose: "Why Choose Briki",
  howItWorks: "How It Works",
  ourPlans: "Our Insurance Plans",
  getStarted: "Get Started Today",
  plansOverview: "Plans Overview",
  features: "Key Features",
  pricing: "Transparent Pricing",
};

// Hero content for each insurance category
export const HERO_CONTENT = {
  travel: {
    title: "Travel with Peace of Mind",
    description: "Protect your journey with comprehensive travel insurance plans tailored to your needs. From emergency medical coverage to trip cancellation, we've got you covered.",
    ctaText: "View Plans",
    gradient: "from-primary/90 via-primary/80 to-primary",
  },
  auto: {
    title: "Drive with Confidence",
    description: "Get reliable auto insurance that protects you, your vehicle, and your passengers. Enjoy 24/7 roadside assistance and hassle-free claims.",
    ctaText: "View Plans",
    gradient: "from-blue-600/90 via-blue-700/80 to-blue-800",
  },
  pet: {
    title: "Protect Your Furry Family",
    description: "Give your pets the care they deserve with comprehensive pet insurance. Cover veterinary visits, emergencies, medications, and more.",
    ctaText: "View Plans",
    gradient: "from-purple-600/90 via-purple-700/80 to-purple-800",
  },
  health: {
    title: "Health Coverage That Cares",
    description: "Find affordable health insurance plans that provide the coverage you need. From preventive care to emergency treatment, we've got your health protected.",
    ctaText: "View Plans", 
    gradient: "from-rose-600/90 via-rose-700/80 to-rose-800",
  }
};

// Feature details for each insurance category
export const CATEGORY_FEATURES = {
  travel: [
    {
      title: "Global Coverage",
      description: "Comprehensive worldwide coverage with 24/7 emergency assistance and support in multiple languages.",
      iconName: "Globe"
    },
    {
      title: "Complete Protection",
      description: "Medical emergencies, trip cancellations, lost baggage, and other unexpected situations all covered.",
      iconName: "Shield"
    },
    {
      title: "Easy Claims Process",
      description: "Simple, fast claims with digital submission and quick processing for approved claims.",
      iconName: "BadgeCheck"
    }
  ],
  auto: [
    {
      title: "Comprehensive Coverage",
      description: "Protection for damages to your vehicle, third-party liability, and theft with flexible deductibles.",
      iconName: "ShieldCheck"
    },
    {
      title: "Roadside Assistance",
      description: "24/7 emergency roadside assistance including towing, battery jump-starts, and flat tire changes.",
      iconName: "Wrench"
    },
    {
      title: "Digital Claims",
      description: "File and track claims through our mobile app with real-time updates and direct deposit reimbursements.",
      iconName: "PhoneOutgoing"
    }
  ],
  pet: [
    {
      title: "Veterinary Care",
      description: "Coverage for accidents, illnesses, surgeries, and routine checkups with your preferred veterinarian.",
      iconName: "Stethoscope"
    },
    {
      title: "Medication Coverage",
      description: "Prescribed medications, specialty foods, and supplements for your pet's ongoing health needs.",
      iconName: "Pill"
    },
    {
      title: "No Breed Restrictions",
      description: "All breeds welcome with customized coverage options based on your pet's specific needs.",
      iconName: "Check"
    }
  ],
  health: [
    {
      title: "Preventive Care",
      description: "Regular checkups, vaccinations, and screenings included to help maintain your health and detect issues early.",
      iconName: "Activity"
    },
    {
      title: "Specialist Network",
      description: "Access to a wide network of specialists and hospitals with reduced wait times for appointments.",
      iconName: "Users"
    },
    {
      title: "Telehealth Services",
      description: "24/7 virtual consultations with healthcare professionals from the comfort of your home.",
      iconName: "Video"
    }
  ]
};

// Steps for "How It Works" section - common across categories
export const HOW_IT_WORKS_STEPS = [
  {
    title: "Create Account",
    description: "Sign up in less than 2 minutes",
    iconName: "User"
  },
  {
    title: "Enter Details",
    description: "Tell us about your insurance needs",
    iconName: "ClipboardList"
  },
  {
    title: "Choose a Plan",
    description: "Compare and select the right coverage",
    iconName: "CheckSquare"
  },
  {
    title: "Instant Coverage",
    description: "Get protected immediately after purchase",
    iconName: "Clock"
  }
];

// CTA content consistent across pages
export const CTA_CONTENT = {
  authenticated: {
    title: "Ready to Get Protected?",
    description: "Select from our range of plans and get instant coverage today.",
    buttonText: "View Available Plans",
  },
  public: {
    title: "Ready to Get Started?",
    description: "Create an account to explore personalized insurance options.",
    buttonText: "Create Free Account",
  }
};

// Plan tiers with common feature patterns for each category 
export const PLAN_TIERS = {
  travel: {
    basic: {
      name: "Basic Coverage",
      description: "Affordable protection for budget travelers",
      price: "$15",
      frequency: "/day",
      features: [
        "Emergency medical coverage up to $50,000",
        "Trip cancellation/interruption protection",
        "24/7 travel assistance services"
      ]
    },
    premium: {
      name: "Premium Coverage",
      description: "Comprehensive coverage for most travelers",
      price: "$25",
      frequency: "/day",
      features: [
        "Emergency medical coverage up to $150,000",
        "Trip cancellation/interruption protection",
        "Baggage loss & delay coverage",
        "Emergency evacuation & repatriation"
      ],
      popular: true
    },
    elite: {
      name: "Elite Coverage",
      description: "Maximum protection for extended travelers",
      price: "$35",
      frequency: "/day",
      features: [
        "Emergency medical coverage up to $500,000",
        "Cancel for any reason protection (75%)",
        "Premium baggage protection & electronics",
        "Rental car damage coverage"
      ]
    }
  },
  auto: {
    basic: {
      name: "Basic Coverage",
      description: "Essential protection for your vehicle",
      price: "$79",
      frequency: "/month",
      features: [
        "Liability coverage up to $50,000",
        "Basic collision protection",
        "Roadside assistance (basic)"
      ]
    },
    premium: {
      name: "Premium Coverage",
      description: "Comprehensive protection for most drivers",
      price: "$129",
      frequency: "/month",
      features: [
        "Liability coverage up to $150,000",
        "Full collision and comprehensive",
        "Premium roadside assistance",
        "Rental car reimbursement"
      ],
      popular: true
    },
    elite: {
      name: "Elite Coverage",
      description: "Maximum protection for your vehicle",
      price: "$179",
      frequency: "/month",
      features: [
        "Liability coverage up to $300,000",
        "Full collision and comprehensive",
        "Premium roadside assistance",
        "New car replacement",
        "Accident forgiveness"
      ]
    }
  },
  pet: {
    basic: {
      name: "Basic Care",
      description: "Essential coverage for your pet",
      price: "$25",
      frequency: "/month",
      features: [
        "Accident coverage up to $3,000/year",
        "Illness coverage up to $3,000/year",
        "Emergency exam fees"
      ]
    },
    premium: {
      name: "Premium Care",
      description: "Comprehensive coverage for most pets",
      price: "$45",
      frequency: "/month",
      features: [
        "Accident coverage up to $8,000/year",
        "Illness coverage up to $8,000/year",
        "Prescription medications",
        "Alternative therapies"
      ],
      popular: true
    },
    elite: {
      name: "Elite Care",
      description: "Complete protection for your pet",
      price: "$65",
      frequency: "/month",
      features: [
        "Accident & illness coverage up to $15,000/year",
        "Preventive care included",
        "Dental coverage",
        "Behavioral therapy",
        "Hereditary condition coverage"
      ]
    }
  },
  health: {
    basic: {
      name: "Essential Care",
      description: "Basic health coverage for individuals",
      price: "$199",
      frequency: "/month",
      features: [
        "Primary care visits",
        "Emergency services",
        "Generic prescription drugs",
        "Preventive care coverage"
      ]
    },
    premium: {
      name: "Comprehensive Care",
      description: "Enhanced coverage for individuals and families",
      price: "$349",
      frequency: "/month",
      features: [
        "Primary and specialist care",
        "Lower deductibles and copays",
        "Comprehensive prescription coverage",
        "Mental health services",
        "Telehealth consultations"
      ],
      popular: true
    },
    elite: {
      name: "Premium Care",
      description: "Maximum health protection",
      price: "$499",
      frequency: "/month",
      features: [
        "Unlimited primary and specialist visits",
        "Minimal deductibles and copays",
        "Complete prescription coverage",
        "Alternative therapies",
        "International emergency coverage",
        "Concierge medical services"
      ]
    }
  }
};

// Helper function to get content for a specific category
export function getCategoryContent(category: InsuranceCategory) {
  return {
    hero: HERO_CONTENT[category],
    features: CATEGORY_FEATURES[category],
    plans: PLAN_TIERS[category],
    paths: CATEGORY_PATHS[category]
  };
}