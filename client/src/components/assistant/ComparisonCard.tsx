import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, AlertCircle } from "lucide-react";
import { mockPlans, type PlanCardProps } from './PlanCard';

export interface ComparisonCardProps {
  category: 'pet' | 'travel' | 'auto' | 'health';
  planIds: string[];
}

export function ComparisonCard({ category, planIds }: ComparisonCardProps) {
  // Get the plans from our mock data
  const plans = mockPlans[category]
    .filter(plan => planIds.includes(plan.id))
    .slice(0, 3); // Limit to 3 plans max for UI purposes
  
  if (plans.length === 0) {
    return (
      <Card className="w-full my-4">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <p>Sorry, I couldn't find the plans you wanted to compare.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (plans.length === 1) {
    return (
      <Card className="w-full my-4">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <p>I need at least two plans to create a comparison.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Common features to compare
  const comparisonPoints = {
    pet: ["Coverage Limit", "Deductible Type", "Accident Coverage", "Illness Coverage", "Dental Coverage", "Hereditary Conditions", "Wellness Coverage"],
    travel: ["Medical Coverage", "Trip Cancellation", "Lost Baggage", "Adventure Activities", "Emergency Evacuation", "24/7 Assistance", "Pre-existing Conditions"],
    health: ["Network Type", "Deductible", "Copay Type", "Specialist Care", "Prescription Coverage", "Preventive Care", "Mental Health Coverage"],
    auto: ["Liability Coverage", "Collision Coverage", "Comprehensive Coverage", "Roadside Assistance", "Rental Reimbursement", "Accident Forgiveness", "New Car Replacement"]
  };
  
  // For demo purposes, generate random Yes/No for each comparison point
  // In a real implementation, this would come from actual plan data
  const planFeatures = plans.map(plan => {
    const features: Record<string, boolean> = {};
    comparisonPoints[category].forEach(point => {
      // Simplified for demo: give 70% chance of a feature being included
      features[point] = Math.random() > 0.3;
    });
    return features;
  });
  
  return (
    <Card className="w-full my-4 overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Insurance Plan Comparison</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-gray-500 w-1/4"></th>
                {plans.map((plan, i) => (
                  <th key={plan.id} className="text-center py-2 font-medium">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-primary">{plan.name}</span>
                      <span className="text-gray-500 text-xs">{plan.provider}</span>
                      <span className="mt-1 font-bold text-lg">${plan.price}<span className="text-xs font-normal text-gray-500">/mo</span></span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-medium">Coverage Amount</td>
                {plans.map(plan => (
                  <td key={plan.id} className="text-center py-3">
                    {plan.coverageAmount}
                  </td>
                ))}
              </tr>
              
              {comparisonPoints[category].map((point, i) => (
                <tr key={i} className={i === comparisonPoints[category].length - 1 ? '' : 'border-b'}>
                  <td className="py-3 font-medium">{point}</td>
                  {plans.map((plan, planIndex) => (
                    <td key={`${plan.id}-${i}`} className="text-center py-3">
                      {planFeatures[planIndex][point] ? (
                        <div className="flex justify-center">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <X className="h-5 w-5 text-red-400" />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}