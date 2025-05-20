import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useCompareStore } from '@/store/compare-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { ArrowLeft, FileBarChart, Trash, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { InsuranceCategory } from '@shared/schema';

/**
 * Optimized ComparePlansPage Component
 * - Removes redundant layout
 * - Fixes loading state issues
 * - Optimizes animations for stability
 * - Handles hydration correctly
 */
export default function ComparePlansFixed() {
  // Store initialization status for hydration stability
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);
  
  // Core state from compare store
  const { 
    selectedPlans, 
    clearPlans, 
    removePlan, 
    getSelectedCategories, 
    getSelectedPlansByCategory
  } = useCompareStore();
  
  // Local state
  const [, navigate] = useLocation();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [bestValues, setBestValues] = useState<Record<string, number | string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  
  // Get all selected categories for the comparison
  const selectedCategories = getSelectedCategories();
  
  // Hydration effect - ensures store is properly initialized before rendering
  useEffect(() => {
    // Allow one render cycle for store to hydrate
    setIsStoreHydrated(true);
    
    // Log for debugging
    console.log("ComparePlansFixed: Initial render with plans:", selectedPlans.length);
  }, []);
  
  // Data loading effect - runs after store hydration
  useEffect(() => {
    // Skip during first render (hydration)
    if (!isStoreHydrated) return;
    
    const prepareComparison = async () => {
      setIsLoading(true);
      console.log("Loading comparison data...");
      
      try {
        // Validate that we have plans to compare
        if (selectedPlans.length === 0) {
          console.log("No plans selected, redirecting...");
          toast({
            title: "No plans selected for comparison",
            description: "Please select at least two plans to compare.",
            variant: "destructive",
          });
          navigate('/insurance/travel');
          return;
        }

        // Track this comparison view
        try {
          console.log('Analytics: view_comparison', {
            plan_count: selectedPlans.length,
            categories: selectedCategories.join(','),
            plan_ids: selectedPlans.map(p => p.id).join(',')
          });
        } catch (error) {
          console.error('Analytics error:', error);
        }
        
        // Calculate best values immediately instead of with setTimeout
        calculateBestValues();
        
        // Short delay for UX only - not for processing
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error preparing comparison:', error);
        setHasError(true);
        toast({
          title: "Error loading comparison",
          description: "There was a problem loading the selected plans. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    prepareComparison();
    
    // Confirm before leaving if plans are selected
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (selectedPlans.length > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
      return undefined;
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isStoreHydrated, selectedPlans, navigate, toast, selectedCategories]);
  
  // Calculate best values for numeric comparison
  const calculateBestValues = () => {
    const best: Record<string, number | string> = {};
    
    // For price, find the lowest (this is best)
    const prices = selectedPlans
      .map(p => p.price || 0)
      .filter(p => p > 0);
    if (prices.length) best['price'] = Math.min(...prices);
    
    // Other calculations would go here
    
    setBestValues(best);
  };
  
  // Format price as currency
  const formatPrice = (price: number | undefined) => {
    if (!price) return "Not specified";
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  // Handle exit with confirmation
  const handleExitWithConfirmation = () => {
    if (selectedPlans.length > 0) {
      setIsConfirmDialogOpen(true);
    } else {
      navigate('/insurance/travel');
    }
  };
  
  // Handle clearing plans with confirmation
  const handleClearWithConfirmation = () => {
    setIsConfirmDialogOpen(true);
  };
  
  // Clear plans and navigate away
  const handleConfirmedClear = () => {
    clearPlans();
    setIsConfirmDialogOpen(false);
    navigate('/insurance/travel');
    
    toast({
      title: "Comparison cleared",
      description: "All plans have been removed from your comparison.",
    });
  };
  
  // Render warning if too many plans selected
  const renderPlanWarning = () => {
    if (selectedPlans.length > 4) {
      return (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-sm text-amber-700">
            Comparing more than 4 plans may be difficult to view on smaller screens. Consider focusing on your top choices.
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Debug log for render cycle
  console.log("ComparePlansFixed rendering with", { 
    selectedPlansCount: selectedPlans.length,
    categories: selectedCategories,
    isLoading,
    hasError,
    isHydrated: isStoreHydrated
  });
  
  // Initial hydration render - show minimal skeleton
  if (!isStoreHydrated) {
    return (
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse h-8 w-8 bg-primary/20 rounded-full"></div>
          <p className="ml-3 text-muted-foreground">Initializing comparison...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExitWithConfirmation}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Plans
          </Button>
          
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileBarChart className="h-6 w-6 text-primary" />
            Comparing {selectedPlans.length} {selectedPlans.length === 1 ? 'Plan' : 'Plans'}
          </h1>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearWithConfirmation}
          className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash className="h-4 w-4" />
          Clear All
        </Button>
      </div>
      
      {/* Error message if needed */}
      {hasError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Error Loading Plans</h3>
              <p className="text-red-700">There was a problem loading your selected plans. Please try again or go back to select new plans.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Warning about too many plans */}
      {!hasError && renderPlanWarning()}
      
      {/* Loading state with optimized transition */}
      {isLoading ? (
        <motion.div 
          className="flex flex-col items-center justify-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          layout
        >
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4 animate-spin"></div>
          <p className="text-lg text-gray-600">Loading plans for comparison...</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          layout
        >
          {/* Comparison content would go here */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plans Summary</CardTitle>
                <CardDescription>Overview of your selected insurance plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {selectedPlans.map(plan => (
                    <div 
                      key={plan.id}
                      className="border rounded-lg p-4 flex justify-between items-start"
                    >
                      <div>
                        <h3 className="font-medium">{plan.name || 'Unnamed Plan'}</h3>
                        <p className="text-sm text-muted-foreground">{plan.provider || 'Unknown Provider'}</p>
                        <p className="text-sm mt-1">Price: {formatPrice(plan.price)}</p>
                        <Badge className="mt-2 capitalize">{plan.category}</Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => removePlan(plan.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Additional comparison UI would be added here */}
          </div>
        </motion.div>
      )}
      
      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Clear your comparison?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This will remove all <strong>{selectedPlans.length}</strong> selected plans from your comparison. 
                Your selections will be lost and this action cannot be undone.
              </p>
              <p className="text-muted-foreground text-sm">
                If you want to keep comparing your current selection, click Cancel.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-medium">Keep my comparison</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmedClear}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <Trash className="h-4 w-4" />
              Yes, clear all plans
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}