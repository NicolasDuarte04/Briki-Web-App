import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

// Sample mock plans for development purposes
export const mockPlans: Record<string, PlanCardProps[]> = {
  pet: [
    {
      id: 'petplan-premium',
      name: 'PetPlan Premium Care',
      provider: 'PetPlan Insurance',
      category: 'pet',
      price: 42.99,
      coverageAmount: '$15,000',
      features: [
        'Coverage for accidents & illnesses',
        'Includes dental coverage',
        'No upper age limits',
        'Coverage for hereditary conditions'
      ],
      badge: 'Popular',
      rating: '4.8'
    },
    {
      id: 'embrace-standard',
      name: 'Embrace Standard',
      provider: 'Embrace Pet Insurance',
      category: 'pet',
      price: 35.50,
      coverageAmount: '$10,000',
      features: [
        'Accident & illness coverage',
        'Optional wellness rewards',
        'Diminishing deductible',
        'Personalized policies'
      ]
    },
    {
      id: 'nationwide-whole',
      name: 'Nationwide Whole Pet',
      provider: 'Nationwide',
      category: 'pet',
      price: 49.99,
      coverageAmount: '$20,000',
      features: [
        'Comprehensive coverage',
        'Includes exam fees',
        'Covers holistic care',
        'One simple reimbursement'
      ],
      badge: 'Best coverage'
    }
  ],
  travel: [
    {
      id: 'allianz-onetrip',
      name: 'Allianz OneTrip Premier',
      provider: 'Allianz Global Assistance',
      category: 'travel',
      price: 175,
      coverageAmount: '$50,000',
      features: [
        'Trip cancellation/interruption',
        'Emergency medical coverage',
        'Baggage loss/delay coverage',
        '24/7 assistance'
      ],
      badge: 'Best Seller'
    },
    {
      id: 'worldnomads-explorer',
      name: 'World Nomads Explorer',
      provider: 'World Nomads',
      category: 'travel',
      price: 155,
      coverageAmount: '$100,000',
      features: [
        'Adventure activities coverage',
        'Emergency medical & evacuation',
        'Trip protection and cancellation',
        'Coverage for 200+ activities'
      ]
    },
    {
      id: 'img-travel-lite',
      name: 'IMG Travel Lite',
      provider: 'International Medical Group',
      category: 'travel',
      price: 120,
      coverageAmount: '$25,000',
      features: [
        'Basic travel protection',
        'Medical coverage',
        'Trip interruption',
        'Lost luggage protection'
      ],
      badge: 'Budget friendly'
    }
  ],
  health: [
    {
      id: 'bluecross-platinum',
      name: 'BlueCross Platinum PPO',
      provider: 'Blue Cross Blue Shield',
      category: 'health',
      price: 450,
      coverageAmount: 'Unlimited',
      features: [
        'Nationwide coverage',
        'Low deductible',
        'Preventive care covered 100%',
        'Prescription drug coverage'
      ],
      badge: 'Comprehensive'
    },
    {
      id: 'kaiser-gold',
      name: 'Kaiser Permanente Gold HMO',
      provider: 'Kaiser Permanente',
      category: 'health',
      price: 390,
      coverageAmount: 'Unlimited',
      features: [
        'Integrated care system',
        'Low copays for primary care',
        'Mental health coverage',
        'Digital health tools'
      ]
    },
    {
      id: 'aetna-silver',
      name: 'Aetna Silver EPO',
      provider: 'Aetna',
      category: 'health',
      price: 320,
      coverageAmount: 'Unlimited',
      features: [
        'Midrange premiums & deductibles',
        'Balance of cost & coverage',
        'Preventive care coverage',
        'Specialist care options'
      ],
      badge: 'Value option'
    }
  ],
  auto: [
    {
      id: 'geico-premium',
      name: 'Geico Premium Coverage',
      provider: 'Geico',
      category: 'auto',
      price: 120,
      coverageAmount: '$300,000',
      features: [
        'Liability coverage',
        'Comprehensive & collision',
        'Uninsured motorist protection',
        'Roadside assistance'
      ],
      badge: 'Most Popular'
    },
    {
      id: 'progressive-snapshot',
      name: 'Progressive Snapshot',
      provider: 'Progressive',
      category: 'auto',
      price: 110,
      coverageAmount: '$250,000',
      features: [
        'Usage-based pricing',
        'Good driver discounts',
        'Accident forgiveness',
        'Custom parts coverage'
      ]
    },
    {
      id: 'statefarm-drive',
      name: 'State Farm Drive Safe & Save',
      provider: 'State Farm',
      category: 'auto',
      price: 105,
      coverageAmount: '$200,000',
      features: [
        'Behavior-based discounts',
        'Young driver programs',
        'Multiple vehicle discount',
        'Rental car coverage'
      ],
      badge: 'Best value'
    }
  ]
} as const;

// Define types for our plan data
export interface PlanCardProps {
  id: string;
  name: string;
  provider: string;
  category: 'pet' | 'travel' | 'auto' | 'health';
  price: number;
  coverageAmount: string;
  features: string[];
  badge?: string;
  rating?: string;
}

export function PlanCard({ plan }: { plan: PlanCardProps }) {
  return (
    <Card className="w-full max-w-sm shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <CardHeader className="pb-2">
        {plan.badge && (
          <Badge className="mb-2 self-start bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500">
            {plan.badge}
          </Badge>
        )}
        <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
        <CardDescription className="flex items-center">
          {plan.provider}
          {plan.rating && (
            <div className="flex items-center ml-2 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current mr-1" />
              <span className="text-xs font-medium">{plan.rating}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-3">
          <span className="text-2xl font-bold">${plan.price}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <p className="text-sm mb-3">Coverage up to {plan.coverageAmount}</p>
        <ul className="space-y-1.5">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start text-sm">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-3">
        <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

// Component for rendering multiple plan cards in a grid or row
export function PlanRecommendations({ 
  category, 
  filters = {} 
}: { 
  category: 'pet' | 'travel' | 'auto' | 'health', 
  filters?: Record<string, any> 
}) {
  // In a real app, we would filter plans based on the provided filters
  // For now, just use the mock data for the selected category
  const plans = mockPlans[category] || [];

  if (plans.length === 0) {
    return <p className="text-center text-muted-foreground my-4">No plans found matching your criteria.</p>;
  }

  return (
    <div className="w-full my-4 px-1">
      <h3 className="text-lg font-medium mb-3">Recommended Plans</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto pb-2">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}