import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Check, X, AlertCircle } from "lucide-react";
import { RealInsurancePlan, getRealPlansByCategory } from '../../data/realPlans';

export interface ComparisonCardProps {
  category: 'pet' | 'travel' | 'auto' | 'health';
  planIds: string[];
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ category, planIds }) => {
  // Get all plans for the category and filter by IDs
  const allPlans = getRealPlansByCategory(category);
  const plansToCompare = allPlans.filter(plan => planIds.includes(plan.id));
  
  if (plansToCompare.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            <AlertCircle className="w-6 h-6 inline-block mr-2" />
            No plans found to compare
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plansToCompare.map((plan) => (
            <div key={plan.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <p className="text-sm text-gray-600">{plan.provider}</p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                        </div>
              {plan.price && (
                <div className="mt-4">
                  <h4 className="font-medium">Price:</h4>
                  <p className="text-sm">{plan.price}</p>
                        </div>
                      )}
              {plan.externalLink && (
                <a
                  href={plan.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-blue-600 hover:underline"
                >
                  View plan details →
                </a>
              )}
            </div>
              ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonCard;