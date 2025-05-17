import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Award, Check, ExternalLink, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PlanInsightTag } from "@/components/plans/PlanInsightTag";
import { generatePlanInsights, type PlanInsight } from "@/utils/ai-insights";
import { InsurancePlan } from "@/store/compare-store";

// Import InsuranceCategory type from shared schema
import { InsuranceCategory } from "@shared/schema";

interface PlanCardProps {
  id: number | string;
  title: string;
  provider: string;
  price: number;
  description?: string;
  features: string[];
  badge?: string;
  rating?: string;
  category: InsuranceCategory;
  className?: string;
  showCompareToggle?: boolean;
  onCompareToggle?: (id: number | string, isSelected: boolean) => void;
  isSelected?: boolean;
}

/**
 * PlanCard component for displaying insurance plans across all categories
 * with consistent styling and functionality.
 */
export function PlanCard({
  id,
  title,
  provider,
  price,
  description,
  features,
  badge,
  rating,
  category,
  className,
  showCompareToggle = true,
  onCompareToggle,
  isSelected: externalIsSelected,
}: PlanCardProps) {
  const [, navigate] = useLocation();
  const [internalIsSelected, setInternalIsSelected] = useState(false);
  const [insights, setInsights] = useState<PlanInsight[]>([]);
  
  // Use external selection state if provided, otherwise use internal state
  const isSelected = externalIsSelected !== undefined ? externalIsSelected : internalIsSelected;
  
  // Generate AI insights for this plan
  useEffect(() => {
    // Create a plan object compatible with our AI insights system
    const plan: InsurancePlan = {
      id: id.toString(),
      name: title,
      category: category,
      provider: provider,
      price: price,
      description: description || "",
      features: features || []
    };
    
    // Mock other plans for comparison (in a real app, these would come from an API or context)
    const mockPlans: InsurancePlan[] = [
      plan,
      {
        id: "budget-plan",
        name: "Budget Plan",
        category: category,
        provider: "Economy Insurance",
        price: price * 0.7,
        features: features.slice(0, Math.max(1, features.length - 2))
      },
      {
        id: "premium-plan",
        name: "Premium Plan",
        category: category,
        provider: "Premium Insurance",
        price: price * 1.5,
        features: [...features, "24/7 Priority Support", "Premium Coverage"]
      }
    ];
    
    // Generate insights
    const generatedInsights = generatePlanInsights(plan, mockPlans);
    setInsights(generatedInsights);
  }, [id, title, provider, price, features, category, description]);

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCompareToggle = () => {
    const newSelectedState = !isSelected;
    
    // Only update internal state if we're not using external state
    if (externalIsSelected === undefined) {
      setInternalIsSelected(newSelectedState);
    }
    
    if (onCompareToggle) {
      onCompareToggle(id, newSelectedState);
    }
  };

  const handleGetQuote = () => {
    navigate(`/insurance/${category}/quote?planId=${id}`);
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-lg border border-border",
        isSelected && "ring-2 ring-primary ring-offset-2",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold tracking-tight line-clamp-2">{title}</CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground">
              {provider}
            </CardDescription>
          </div>
          
          {badge && (
            <Badge 
              variant="default" 
              className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 px-2 py-0 h-6 flex items-center gap-1"
            >
              <Award className="h-3 w-3" />
              <span className="font-medium text-xs">{badge}</span>
            </Badge>
          )}
        </div>
        
        {/* Display AI-generated insights if available */}
        {insights.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {insights.map((insight, index) => (
              <PlanInsightTag 
                key={index} 
                tag={insight.tag} 
                reason={insight.reason} 
                showTooltip={true} 
              />
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pb-4">
        {description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        )}
        
        <div className="flex items-center gap-1 mb-4">
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-sm">{rating}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-5 text-2xl font-bold">
          {formatPrice(price)}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3 pt-0">
        <Button 
          className="w-full font-medium" 
          onClick={handleGetQuote}
        >
          Get Quote
        </Button>
        
        {showCompareToggle && (
          <div className="flex items-center space-x-2 w-full">
            <Checkbox 
              id={`compare-${id}`}
              checked={isSelected}
              onCheckedChange={handleCompareToggle}
            />
            <label
              htmlFor={`compare-${id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Add to comparison
            </label>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}