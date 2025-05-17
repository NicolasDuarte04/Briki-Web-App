import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useCompareStore } from '@/store/compare-store';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';

/**
 * Floating button that appears when plans are selected for comparison
 */
export function ComparePageTrigger() {
  const [, navigate] = useLocation();
  const { selectedPlans } = useCompareStore();
  const [isVisible, setIsVisible] = useState(false);
  
  // Show the button only when there are at least 2 plans selected
  useEffect(() => {
    setIsVisible(selectedPlans.length >= 2);
  }, [selectedPlans]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={() => window.location.href = '/briki-compare.html'}
        size="lg" 
        className="shadow-md flex items-center gap-2"
      >
        <BarChart2 className="h-4 w-4" />
        <span>Compare {selectedPlans.length} Plans</span>
      </Button>
    </div>
  );
}