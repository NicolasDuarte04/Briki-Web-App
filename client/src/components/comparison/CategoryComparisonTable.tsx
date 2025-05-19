import React, { useMemo } from "react";
import { InsurancePlan } from "@/store/compare-store";
import { 
  InsuranceCategory, 
  planFieldLabels,
  BasePlanFields,
  TravelPlanFields,
  AutoPlanFields,
  PetPlanFields,
  HealthPlanFields
} from "@shared/schema";
import { formatFieldValue } from "@/utils/format";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  ShieldCheck, 
  Star, 
  DollarSign,
  Car,
  Plane,
  HeartPulse,
  Cat
} from "lucide-react";

// Category color mapping for visual separation
const categoryColors: Record<InsuranceCategory, string> = {
  travel: "bg-blue-100 text-blue-800 border-blue-300",
  auto: "bg-green-100 text-green-800 border-green-300",
  pet: "bg-orange-100 text-orange-800 border-orange-300",
  health: "bg-purple-100 text-purple-800 border-purple-300"
};

// Category icons for visual identification
const CategoryIcon = ({ category }: { category: InsuranceCategory }) => {
  switch (category) {
    case "travel":
      return <Plane className="h-4 w-4 mr-1" />;
    case "auto":
      return <Car className="h-4 w-4 mr-1" />;
    case "health":
      return <HeartPulse className="h-4 w-4 mr-1" />;
    case "pet":
      return <Cat className="h-4 w-4 mr-1" />;
    default:
      return null;
  }
};

interface CategoryComparisonTableProps {
  plans: InsurancePlan[];
  groupByCategory?: boolean;
}

const CategoryComparisonTable = ({ 
  plans,
  groupByCategory = true
}: CategoryComparisonTableProps) => {
  
  // Group plans by category if requested
  const groupedPlans = useMemo(() => {
    if (!groupByCategory) return { ungrouped: plans };
    
    return plans.reduce((acc, plan) => {
      const category = plan.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(plan);
      return acc;
    }, {} as Record<string, InsurancePlan[]>);
  }, [plans, groupByCategory]);
  
  // Get all categories present in the plans
  const categories = useMemo(() => {
    const categoriesSet = new Set<InsuranceCategory>();
    plans.forEach(p => categoriesSet.add(p.category));
    return Array.from(categoriesSet);
  }, [plans]);
  
  // Get all field keys for each category
  const categoryFields = useMemo(() => {
    const fields: Record<InsuranceCategory, string[]> = {
      travel: [],
      auto: [],
      pet: [],
      health: []
    };
    
    // Always include base fields
    categories.forEach(category => {
      fields[category] = [
        'basePrice',
        'coverageAmount',
      ];
      
      // Add category-specific fields
      if (planFieldLabels[category]) {
        Object.keys(planFieldLabels[category])
          .filter(key => !fields[category].includes(key) && key !== 'basePrice' && key !== 'coverageAmount')
          .forEach(key => fields[category].push(key));
      }
    });
    
    return fields;
  }, [categories]);
  
  if (plans.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-muted-foreground">No plans selected for comparison.</p>
      </div>
    );
  }
  
  // Get plan field value based on its category
  const getPlanFieldValue = (plan: InsurancePlan, field: string): any => {
    // Base fields are directly accessible
    if (field === 'basePrice' || field === 'coverageAmount' || field in plan) {
      return plan[field as keyof BasePlanFields];
    }
    
    // Category-specific fields are in categoryDetails
    if (plan.categoryDetails) {
      switch (plan.category) {
        case 'travel':
          return plan.categoryDetails.travel?.[field as keyof TravelPlanFields];
        case 'auto':
          return plan.categoryDetails.auto?.[field as keyof AutoPlanFields];
        case 'pet':
          return plan.categoryDetails.pet?.[field as keyof PetPlanFields];
        case 'health':
          return plan.categoryDetails.health?.[field as keyof HealthPlanFields];
        default:
          return undefined;
      }
    }
    
    return undefined;
  };
  
  // Render a single section of the comparison table
  const renderCategorySection = (categoryPlans: InsurancePlan[], category: InsuranceCategory) => {
    if (!categoryPlans || categoryPlans.length === 0) return null;
    
    return (
      <Card key={category} className={`mb-8 border-l-4 ${categoryColors[category]} overflow-hidden`}>
        <div className={`p-4 ${categoryColors[category].split(' ').slice(0, 2).join(' ')} flex items-center`}>
          <CategoryIcon category={category} />
          <h3 className="text-lg font-medium capitalize">{category} Insurance</h3>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-60">Features</TableHead>
              {categoryPlans.map(plan => (
                <TableHead key={plan.id} className="min-w-[200px]">
                  <div className="flex flex-col space-y-1">
                    <div className="font-bold">{plan.name}</div>
                    <div className="text-sm text-muted-foreground">{plan.provider}</div>
                    {plan.badge && (
                      <Badge variant="outline" className="w-fit">
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Base price and rating rows */}
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {planFieldLabels[category]?.basePrice || "Price"}
                </div>
              </TableCell>
              {categoryPlans.map(plan => (
                <TableCell key={`${plan.id}-price`} className="font-semibold">
                  {formatFieldValue(plan.basePrice, "basePrice")}
                </TableCell>
              ))}
            </TableRow>
            
            {categoryPlans[0]?.rating && (
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Rating
                  </div>
                </TableCell>
                {categoryPlans.map(plan => (
                  <TableCell key={`${plan.id}-rating`}>
                    <div className="flex items-center">
                      {plan.rating}
                      {plan.reviews && <span className="text-xs text-muted-foreground ml-1">({plan.reviews})</span>}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            )}
            
            {/* Coverage amount */}
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  {planFieldLabels[category]?.coverageAmount || "Coverage Amount"}
                </div>
              </TableCell>
              {categoryPlans.map(plan => (
                <TableCell key={`${plan.id}-coverage`}>
                  {formatFieldValue(plan.coverageAmount, "coverageAmount")}
                </TableCell>
              ))}
            </TableRow>
            
            {/* Category-specific fields */}
            {categoryFields[category]
              .filter(field => field !== 'basePrice' && field !== 'coverageAmount')
              .map(field => (
                <TableRow key={field}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {planFieldLabels[category]?.[field] || field}
                    </div>
                  </TableCell>
                  {categoryPlans.map(plan => (
                    <TableCell key={`${plan.id}-${field}`}>
                      {formatFieldValue(getPlanFieldValue(plan, field), field)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </Card>
    );
  };
  
  // If grouping by category, render each category separately
  if (groupByCategory) {
    return (
      <div>
        {categories.map(category => 
          renderCategorySection(groupedPlans[category] || [], category)
        )}
      </div>
    );
  }
  
  // Otherwise render all plans in a single table
  return (
    <Card className="mb-8 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-60">Features</TableHead>
            {plans.map(plan => (
              <TableHead key={plan.id} className="min-w-[200px]">
                <div className="flex flex-col space-y-1">
                  <Badge className={categoryColors[plan.category]}>
                    <CategoryIcon category={plan.category} />
                    {plan.category.charAt(0).toUpperCase() + plan.category.slice(1)}
                  </Badge>
                  <div className="font-bold mt-2">{plan.name}</div>
                  <div className="text-sm text-muted-foreground">{plan.provider}</div>
                  {plan.badge && (
                    <Badge variant="outline" className="w-fit">
                      {plan.badge}
                    </Badge>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Base fields for all categories */}
          <TableRow>
            <TableCell className="font-medium">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Price
              </div>
            </TableCell>
            {plans.map(plan => (
              <TableCell key={`${plan.id}-price`} className="font-semibold">
                {formatFieldValue(plan.basePrice, "basePrice")}
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow>
            <TableCell className="font-medium">
              <div className="flex items-center">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Coverage Amount
              </div>
            </TableCell>
            {plans.map(plan => (
              <TableCell key={`${plan.id}-coverage`}>
                {formatFieldValue(plan.coverageAmount, "coverageAmount")}
              </TableCell>
            ))}
          </TableRow>
          
          {plans[0]?.rating && (
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  Rating
                </div>
              </TableCell>
              {plans.map(plan => (
                <TableCell key={`${plan.id}-rating`}>
                  <div className="flex items-center">
                    {plan.rating}
                    {plan.reviews && <span className="text-xs text-muted-foreground ml-1">({plan.reviews})</span>}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default CategoryComparisonTable;