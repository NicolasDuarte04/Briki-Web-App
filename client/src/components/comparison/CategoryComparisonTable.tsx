import React from 'react';
import { InsurancePlan } from '@/components/briki-ai-assistant/PlanCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';

interface CategoryComparisonTableProps {
  plans: InsurancePlan[];
}

const CategoryComparisonTable: React.FC<CategoryComparisonTableProps> = ({ plans }) => {
  if (plans.length === 0) return null;

  // Collect all unique benefits from the selected plans
  const allBenefits = Array.from(new Set(plans.flatMap(p => p.benefits || [])));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Feature</TableHead>
          {plans.map(plan => (
            <TableHead key={plan.id} className="text-center font-semibold">{plan.name}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Price */}
        <TableRow>
          <TableCell>Price</TableCell>
          {plans.map(plan => (
            <TableCell key={plan.id} className="text-center font-bold text-primary">
              ${plan.basePrice}
            </TableCell>
          ))}
        </TableRow>
        {/* Coverage Amount */}
        <TableRow>
          <TableCell>Max Coverage</TableCell>
          {plans.map(plan => (
            <TableCell key={plan.id} className="text-center">
              ${plan.coverageAmount.toLocaleString()}
            </TableCell>
          ))}
        </TableRow>
        {/* Benefits */}
        {allBenefits.map(benefit => (
          <TableRow key={benefit}>
            <TableCell>{benefit}</TableCell>
            {plans.map(plan => (
              <TableCell key={plan.id} className="text-center">
                {(plan.benefits || []).includes(benefit) ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CategoryComparisonTable;