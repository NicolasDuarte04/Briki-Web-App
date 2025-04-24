import { InsurancePlan } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
    <div className="briki-plan-card">
      <div className="briki-plan-header">
        <div className="briki-plan-provider">
          <div className="briki-plan-provider-logo">
            {/* Logo or icon for the insurance provider */}
            <Check className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <p className="briki-plan-type">{plan.provider}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="briki-plan-price">${plan.basePrice}</div>
        </div>
      </div>
        
      <div className="briki-feature-list">
        <div className="briki-feature-item">
          <span className="briki-feature-item-check">✓</span>
          Medical: {formatPrice(plan.medicalCoverage)}
        </div>
        <div className="briki-feature-item">
          <span className="briki-feature-item-check">✓</span>
          Trip Cancellation: {plan.tripCancellation}
        </div>
        <div className="briki-feature-item">
          <span className="briki-feature-item-check">✓</span>
          Baggage: {formatPrice(plan.baggageProtection)}
        </div>
      </div>
          
      <div className="mt-auto pt-3">
        <Button
          variant="link"
          className="text-primary p-0 h-auto text-sm font-normal"
        >
          View more
        </Button>
        
        <Button 
          onClick={onSelectPlan} 
          className="briki-button mt-3"
        >
          Show my options
        </Button>
      </div>
    </div>
  );
}