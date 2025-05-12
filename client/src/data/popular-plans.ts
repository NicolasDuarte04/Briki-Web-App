import { Plan } from "@/contexts/recently-viewed-context";

// Sample data for popular plans across different insurance categories
export const popularPlans: Plan[] = [
  // Travel Insurance Plans
  {
    id: "travel-1",
    name: "Top-Rated International Plan",
    category: "travel",
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
    description: "Comprehensive coverage for international travel with medical, trip cancellation, and lost baggage protection.",
    rating: 4.9,
    provider: "GeoBlue"
  },
  {
    id: "travel-2",
    name: "Budget Traveler Plan",
    category: "travel",
    imageUrl: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b",
    description: "Affordable coverage focusing on essential protections for budget-conscious travelers.",
    rating: 4.5,
    provider: "WorldNomads"
  },
  
  // Auto Insurance Plans
  {
    id: "auto-1",
    name: "Premium Full Coverage",
    category: "auto",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
    description: "Complete protection for your vehicle including collision, theft, liability, and roadside assistance.",
    rating: 4.8,
    provider: "AllState"
  },
  {
    id: "auto-2",
    name: "Basic Third-Party Liability",
    category: "auto",
    imageUrl: "https://images.unsplash.com/photo-1583267746897-2cf415887172",
    description: "Essential coverage that protects you financially if you're responsible for damage to others.",
    rating: 4.3,
    provider: "Progressive"
  },
  
  // Pet Insurance Plans
  {
    id: "pet-1",
    name: "Complete Care Pet Plan",
    category: "pet",
    imageUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e",
    description: "Comprehensive coverage for accidents, illnesses, and routine care for your beloved pets.",
    rating: 4.9,
    provider: "PetFirst"
  },
  {
    id: "pet-2",
    name: "Accident & Illness Coverage",
    category: "pet",
    imageUrl: "https://images.unsplash.com/photo-1560743641-3914f2c45636",
    description: "Protection for unexpected accidents and illnesses, ensuring your pet gets the care they need.",
    rating: 4.6,
    provider: "ASPCA"
  },
  
  // Health Insurance Plans
  {
    id: "health-1",
    name: "Premium Family Health Plan",
    category: "health",
    imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7",
    description: "Comprehensive health coverage for the entire family with minimal deductibles and copays.",
    rating: 4.7,
    provider: "BlueCross"
  },
  {
    id: "health-2",
    name: "Individual Basic Coverage",
    category: "health",
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
    description: "Affordable health insurance focusing on essential care and preventive services.",
    rating: 4.2,
    provider: "United Health"
  }
];