import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useCompareStore } from '../store/compare-store';
import { Button } from './ui/button';
import { BarChart2, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

/**
 * Floating button that appears when plans are selected for comparison
 */
export function ComparePageTrigger() {
  const [, navigate] = useLocation();
  const { selectedPlans, getComparisonReady, clearPlans } = useCompareStore();
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  
  // Show the button only when there are at least 2 plans selected
  useEffect(() => {
    setIsVisible(getComparisonReady());
  }, [selectedPlans, getComparisonReady]);
  
  if (!isVisible) return null;
  
  // Get the selected category (should be just one with our new restriction)
  const selectedCategory = selectedPlans[0]?.category;
  const categoryNames = {
    travel: "Travel Insurance",
    auto: "Auto Insurance",
    pet: "Pet Insurance",
    health: "Health Insurance"
  };
  
  const handleCompareClick = () => {
    navigate('/compare-plans');
  };
  
  const handleClearAll = () => {
    clearPlans();
    toast({
      title: "Comparison cleared",
      description: "All plans have been removed from comparison.",
    });
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <Button 
        onClick={handleCompareClick}
        size="lg" 
        className="shadow-md flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
      >
        <BarChart2 className="h-4 w-4" />
        <span>
          Compare {selectedPlans.length} {categoryNames[selectedCategory] || "Insurance"} Plans
        </span>
      </Button>
      
      <Button
        onClick={handleClearAll}
        variant="outline"
        size="sm"
        className="shadow-sm bg-white hover:bg-gray-50"
      >
        <X className="h-3 w-3 mr-1" />
        Clear All
      </Button>
    </div>
  );
}