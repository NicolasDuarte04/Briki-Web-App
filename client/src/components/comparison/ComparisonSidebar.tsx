import React from 'react';
import { useCompareStore } from '@/store/compare-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import CategoryComparisonTable from './CategoryComparisonTable';

export const ComparisonSidebar = () => {
  const { plansToCompare, removePlan, clearCompare } = useCompareStore();

  return (
    <div className="sticky top-24">
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Plan Comparison</CardTitle>
          {plansToCompare.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCompare}>
              Clear All
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {plansToCompare.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Select up to 3 plans to compare.
            </p>
          )}

          {plansToCompare.length > 0 && (
             <CategoryComparisonTable plans={plansToCompare} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 