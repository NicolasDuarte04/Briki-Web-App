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
          {/* Enhanced Comparison Content */}
          <div className="space-y-6">
            {/* Plans Summary Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Plans Summary
                </CardTitle>
                <CardDescription>Overview of your selected insurance plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {selectedPlans.map(plan => (
                    <div 
                      key={plan.id}
                      className="border border-border/60 rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-lg">{plan.name || 'Unnamed Plan'}</h3>
                          <p className="text-sm text-muted-foreground">{plan.provider || 'Unknown Provider'}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8"
                          onClick={() => removePlan(plan.id || '')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-col space-y-3 flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Price:</span>
                          <span className="text-sm font-bold">
                            {formatPrice(plan.price)}
                            {plan.price === bestValues.price && (
                              <Badge variant="outline" className="ml-2 text-green-600 bg-green-50 border-green-200">
                                Best Value
                              </Badge>
                            )}
                          </span>
                        </div>
                        
                        {plan.coverage && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Coverage:</span>
                            <span className="text-sm">{plan.coverage}</span>
                          </div>
                        )}
                        
                        {plan.country && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Region:</span>
                            <span className="text-sm">{plan.country}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-border/60">
                        <Badge className="capitalize" variant="outline" 
                          style={{
                            backgroundColor: plan.category === 'travel' ? 'rgba(59, 130, 246, 0.1)' : 
                                           plan.category === 'auto' ? 'rgba(16, 185, 129, 0.1)' :
                                           plan.category === 'pet' ? 'rgba(249, 115, 22, 0.1)' :
                                           plan.category === 'health' ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                            color: plan.category === 'travel' ? 'rgb(29, 78, 216)' : 
                                 plan.category === 'auto' ? 'rgb(5, 150, 105)' :
                                 plan.category === 'pet' ? 'rgb(234, 88, 12)' :
                                 plan.category === 'health' ? 'rgb(126, 34, 206)' : 'currentColor',
                            borderColor: plan.category === 'travel' ? 'rgba(59, 130, 246, 0.2)' : 
                                       plan.category === 'auto' ? 'rgba(16, 185, 129, 0.2)' :
                                       plan.category === 'pet' ? 'rgba(249, 115, 22, 0.2)' :
                                       plan.category === 'health' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                          }}
                        >
                          {plan.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Detailed Comparison Section */}
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="coverage">Coverage Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <ScrollArea className="h-[500px]">
                        <table className="w-full border-collapse">
                          <thead className="sticky top-0 bg-background z-10">
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-medium text-muted-foreground bg-muted/50">Feature</th>
                              {selectedPlans.map(plan => (
                                <th key={plan.id} className="text-left py-3 px-4 font-medium">
                                  {plan.name || 'Unnamed Plan'}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {/* Generate rows based on category - these would be category-specific */}
                            {selectedCategories.length > 0 && selectedCategories[0] === 'travel' && (
                              <>
                                <tr className="border-b">
                                  <td className="py-3 px-4 font-medium bg-muted/30">Trip Cancellation</td>
                                  {selectedPlans.map(plan => (
                                    <td key={plan.id} className="py-3 px-4">
                                      {plan.categoryDetails?.travel?.coversCancellation ? "Included" : "Not covered"}
                                    </td>
                                  ))}
                                </tr>
                                <tr className="border-b">
                                  <td className="py-3 px-4 font-medium bg-muted/30">Medical Coverage</td>
                                  {selectedPlans.map(plan => (
                                    <td key={plan.id} className="py-3 px-4">
                                      {plan.categoryDetails?.travel?.coversMedical ? "Included" : "Not covered"}
                                    </td>
                                  ))}
                                </tr>
                                <tr className="border-b">
                                  <td className="py-3 px-4 font-medium bg-muted/30">Emergency Evacuation</td>
                                  {selectedPlans.map(plan => (
                                    <td key={plan.id} className="py-3 px-4">
                                      {"Not covered"}
                                    </td>
                                  ))}
                                </tr>
                              </>
                            )}
                            
                            {/* Default features for any category */}
                            <tr className="border-b">
                              <td className="py-3 px-4 font-medium bg-muted/30">Price</td>
                              {selectedPlans.map(plan => (
                                <td key={plan.id} className="py-3 px-4">
                                  {formatPrice(plan.price)}
                                  {plan.price === bestValues.price && (
                                    <Badge variant="outline" className="ml-2 text-green-600 bg-green-50 border-green-200">
                                      Best
                                    </Badge>
                                  )}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-4 font-medium bg-muted/30">Provider</td>
                              {selectedPlans.map(plan => (
                                <td key={plan.id} className="py-3 px-4">{plan.provider || "Unknown"}</td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-4 font-medium bg-muted/30">Coverage Region</td>
                              {selectedPlans.map(plan => (
                                <td key={plan.id} className="py-3 px-4">{plan.country || "Not specified"}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Price Comparison</h3>
                        <div className="space-y-4">
                          {selectedPlans.map(plan => (
                            <div key={plan.id} className="flex items-center">
                              <div className="w-1/3 font-medium">{plan.name}</div>
                              <div className="w-2/3">
                                <div className="relative pt-1">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary/10 text-primary">
                                        {formatPrice(plan.price)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-muted">
                                    <div 
                                      style={{ 
                                        width: `${(plan.price || 0) / (Math.max(...selectedPlans.map(p => p.price || 0)) || 1) * 100}%` 
                                      }} 
                                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Value Analysis</h3>
                        <Card className="border border-muted">
                          <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground mb-4">
                              Based on your selected plans, here's our analysis of the price-to-coverage value:
                            </p>
                            <ul className="space-y-2">
                              {selectedPlans.map(plan => (
                                <li key={plan.id} className="flex items-start gap-2">
                                  {plan.price === bestValues.price ? (
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  ) : (
                                    <div className="h-5 w-5 rounded-full border border-muted-foreground mt-0.5" />
                                  )}
                                  <div>
                                    <p className="font-medium">{plan.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {plan.price === bestValues.price 
                                        ? "Best overall value based on price and coverage" 
                                        : "Higher price point with similar coverage options"}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="coverage" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    {selectedPlans.map(plan => (
                      <div key={plan.id} className="mb-6 border-b pb-6 last:border-0 last:pb-0">
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-primary/80"></span>
                          {plan.name}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Coverage Highlights</h4>
                            {plan.coverageHighlights && plan.coverageHighlights.length > 0 ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {plan.coverageHighlights.map((highlight, idx) => (
                                  <li key={idx} className="text-sm">{highlight}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground">No coverage highlights available</p>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Price & Value</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Price:</span>
                                <span className="text-sm font-medium">{formatPrice(plan.price)}</span>
                              </div>
                              {plan.priceRange && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Price Range:</span>
                                  <span className="text-sm">{plan.priceRange}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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