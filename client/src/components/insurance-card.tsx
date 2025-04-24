import { InsurancePlan } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon, ShieldCheck, CalendarX, Briefcase, Info, SlidersHorizontal } from "lucide-react";

interface InsuranceCardProps {
  plan: InsurancePlan;
  isSelected: boolean;
  onToggleSelect: () => void;
  onSelectPlan: () => void;
}

export default function InsuranceCard({ plan, isSelected, onToggleSelect, onSelectPlan }: InsuranceCardProps) {
  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => {
                    // Calculate if this should be a full, half, or empty star
                    const rating = parseFloat(plan.rating || "0");
                    const fullStars = Math.floor(rating);
                    const hasHalfStar = rating - fullStars >= 0.5;
                    
                    if (i < fullStars) {
                      return <StarIcon key={i} className="h-4 w-4 fill-current text-yellow-400" />;
                    } else if (i === fullStars && hasHalfStar) {
                      return (
                        <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l1.5 5h5.5l-4.5 3.5 1.5 5-4-3-4 3 1.5-5-4.5-3.5h5.5z" fillOpacity="0.5" />
                          <path d="M12 2v10 l4 3-1.5-5 4.5-3.5h-5.5z" />
                        </svg>
                      );
                    } else {
                      return <StarIcon key={i} className="h-4 w-4 text-yellow-400" fill="none" />;
                    }
                  })}
                </div>
                <span className="ml-2 text-sm text-gray-500">{plan.rating} ({plan.reviews} reviews)</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-2xl font-bold text-gray-900">{formatPrice(plan.basePrice)}</div>
            <p className="text-sm text-gray-500">For 2 travelers, 15 days</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase">Medical Coverage</h4>
            <p className="mt-2 flex items-center text-lg font-semibold text-gray-900">
              <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
              {formatPrice(plan.medicalCoverage)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase">Trip Cancellation</h4>
            <p className="mt-2 flex items-center text-lg font-semibold text-gray-900">
              <CalendarX className="h-5 w-5 text-green-500 mr-2" />
              {plan.tripCancellation}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase">Baggage Protection</h4>
            <p className="mt-2 flex items-center text-lg font-semibold text-gray-900">
              <Briefcase className="h-5 w-5 text-green-500 mr-2" />
              {formatPrice(plan.baggageProtection)}
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <Button variant="link" className="text-primary hover:text-blue-700 font-medium flex items-center h-auto p-0">
            <Info className="h-4 w-4 mr-2" />
            View Plan Details
          </Button>
          <div className="mt-3 sm:mt-0 flex space-x-3">
            <Button
              variant={isSelected ? "default" : "outline"}
              className={`${isSelected ? "bg-blue-100 text-primary border-primary hover:bg-blue-200" : ""} flex items-center`}
              onClick={onToggleSelect}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {isSelected ? "Remove from Compare" : "Add to Compare"}
            </Button>
            <Button onClick={onSelectPlan}>
              Select Plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
