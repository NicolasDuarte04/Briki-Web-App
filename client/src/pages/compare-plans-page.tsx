import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useCompareStore, SelectedPlan } from '@/store/compare-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, FileBarChart, Trash, AlertTriangle, CheckCircle, Info, ArrowRight, XCircle, Award } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

// Define a type for the insurance plans we'll be displaying
interface InsurancePlan {
  id: string | number;
  name?: string;
  title?: string;
  provider: string;
  basePrice?: number;
  price?: number;
  category?: string;
  medicalCoverage?: number;
  tripCancellation?: string;
  baggageProtection?: number;
  emergencyEvacuation?: number;
  adventureActivities?: boolean;
  rentalCarCoverage?: number;
  rating?: string;
  reviews?: number;
  country?: string;
  coverage?: Record<string, any>;
  features?: string[];
  description?: string;
  tag?: string;
}

export default function ComparePlansPage() {
  const { selectedPlans, clearPlans, removePlan } = useCompareStore();
  const [, navigate] = useLocation();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [bestValues, setBestValues] = useState<Record<string, number | string>>({});
  const [fetchedPlans, setFetchedPlans] = useState<InsurancePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Function to fetch plan details based on the selectedPlans
  useEffect(() => {
    const fetchPlansData = async () => {
      setIsLoading(true);
      
      try {
        // If no plans selected, show warning and redirect
        if (selectedPlans.length === 0) {
          toast({
            title: "No plans selected for comparison",
            description: "Please select at least two plans to compare.",
            variant: "destructive",
          });
          navigate('/insurance/travel');
          return;
        }

        // Get unique categories from selected plans for analytics
        const uniqueCategories = Array.from(new Set(selectedPlans.map(p => p.category)));
        
        // In a production implementation, we would fetch the plan data from an API
        // using the plan IDs and categories from selectedPlans
        //
        // Example API call (uncomment and modify when ready to connect to real API):
        // 
        // const planIds = selectedPlans.map(p => p.id);
        // const response = await fetch('/api/plans/details', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ planIds, categories }),
        // });
        // 
        // if (!response.ok) throw new Error('Failed to fetch plan data');
        // const plansData = await response.json();
        // setFetchedPlans(plansData);
        
        // Log an analytics event for page view with proper category data
        try {
          // Track the comparison view event
          import('@/lib/analytics').then(({ trackEvent }) => {
            trackEvent('view_comparison', {
              plan_count: selectedPlans.length,
              categories: uniqueCategories.join(','),
              plan_ids: selectedPlans.map(p => p.id).join(',')
            });
          }).catch(err => console.error('Failed to load analytics module', err));
        } catch (error) {
          console.error('Analytics error:', error);
        }
        
        // For development, use placeholder data based on the selected plan IDs
        // This simulates fetching from an API while maintaining the actual selected IDs
        const placeholderPlans = selectedPlans.map((selectedPlan, index) => {
          // This matches the IDs from the user's selections for consistency
          return {
            id: selectedPlan.id,
            name: `Plan ${String(selectedPlan.id).slice(-2)}`,
            provider: `Provider ${String(selectedPlan.id).slice(-2)}`,
            category: selectedPlan.category,
            price: 100 + (index * 25),
            basePrice: 100 + (index * 25),
            medicalCoverage: 50000 + (index * 50000),
            tripCancellation: `Up to $${5000 + (index * 1000)}`,
            baggageProtection: 1000 + (index * 500),
            emergencyEvacuation: 250000 + (index * 50000),
            adventureActivities: index % 2 === 0,
            rentalCarCoverage: index === 0 ? 0 : 25000,
            rating: (4 + (index * 0.2)).toFixed(1),
            reviews: 100 + (index * 25),
          };
        });
        
        // Set the fetched (or placeholder) plans data
        setFetchedPlans(placeholderPlans);
        
        // Simulate network delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Error fetching plan data:', error);
        toast({
          title: "Error fetching plan data",
          description: "There was a problem loading the selected plans. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchPlansData();
    
    // Cleanup: ask for confirmation before leaving if plans are selected
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
  }, [selectedPlans, navigate, toast]);

  // Calculate best values for numeric fields
  useEffect(() => {
    if (!isLoading && fetchedPlans.length > 0) {
      // For numeric fields, determine the best value (highest coverage, lowest price)
      // This is a simplified version - expand based on your plan data structure
      const getBestValues = () => {
        const best: Record<string, number | string> = {};
        
        // For price, find the lowest
        const prices = fetchedPlans.map(p => p.price || p.basePrice || 0).filter(p => p > 0);
        if (prices.length) best['price'] = Math.min(...prices);
        
        // For coverage fields, find the highest
        const medicalCoverage = fetchedPlans.map(p => p.medicalCoverage || 0).filter(m => m > 0);
        if (medicalCoverage.length) best['medicalCoverage'] = Math.max(...medicalCoverage);
        
        const baggageProtection = fetchedPlans.map(p => p.baggageProtection || 0).filter(b => b > 0);
        if (baggageProtection.length) best['baggageProtection'] = Math.max(...baggageProtection);
        
        const emergencyEvacuation = fetchedPlans.map(p => p.emergencyEvacuation || 0).filter(e => e > 0);
        if (emergencyEvacuation.length) best['emergencyEvacuation'] = Math.max(...emergencyEvacuation);
        
        // Handle other fields as needed based on your plan data structure
        
        return best;
      };
      
      setBestValues(getBestValues());
    }
  }, [fetchedPlans, isLoading]);

  // Format price as currency
  const formatPrice = (price: number | undefined) => {
    if (!price) return "Not Included";
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  // Format large numbers with commas
  const formatNumber = (num: number | undefined) => {
    if (!num) return "Not Included";
    return new Intl.NumberFormat('en-US').format(num);
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
  
  // Handle confirmed clear
  const handleConfirmedClear = () => {
    // Store data for analytics before clearing
    const planCount = selectedPlans.length;
    const uniqueCategories = Array.from(new Set(selectedPlans.map(p => p.category)));
    const planIds = selectedPlans.map(p => p.id);
    
    // Clear the plans from state
    clearPlans();
    setIsConfirmDialogOpen(false);
    
    // Navigate to the most common category page or default to travel
    const mostCommonCategory = uniqueCategories.length > 0 
      ? uniqueCategories.sort((a: string, b: string) => 
          selectedPlans.filter(p => p.category === a).length - 
          selectedPlans.filter(p => p.category === b).length
        )[0] 
      : 'travel';
    
    navigate(`/insurance/${mostCommonCategory}`);
    
    // Log an analytics event for clearing plans
    try {
      // Track the clear comparison event with detailed data
      import('@/lib/analytics').then(({ trackEvent }) => {
        trackEvent('clear_comparison', {
          plan_count: planCount,
          categories: uniqueCategories.join(','),
          plan_ids: planIds.join(',')
        });
      }).catch(err => console.error('Failed to load analytics module', err));
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };
  
  // Handle removing a single plan
  const handleRemovePlan = (id: string | number) => {
    // Find the plan category before removing it
    const planToRemove = selectedPlans.find(p => p.id === id);
    const planCategory = planToRemove?.category || 'unknown';
    
    // Remove the plan from state
    removePlan(id);
    
    // Show toast notification
    toast({
      title: "Plan removed",
      description: "The plan has been removed from your comparison.",
    });
    
    // If we're down to less than 2 plans, it's not a comparison anymore, go back to selection
    if (selectedPlans.length <= 2) {
      // Navigate to the category of the removed plan, or default to travel
      navigate(`/insurance/${planCategory === 'unknown' ? 'travel' : planCategory}`);
    }
    
    // Log an analytics event for removing a plan
    try {
      // Track the remove plan event with detailed data
      import('@/lib/analytics').then(({ trackEvent }) => {
        trackEvent('remove_plan_from_comparison', {
          plan_id: String(id),
          plan_category: planCategory,
          remaining_plans: selectedPlans.length - 1
        });
      }).catch(err => console.error('Failed to load analytics module', err));
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };
  
  // Select plan count warning
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
  
  // Create placeholder selected plans from the store for now
  // In a real implementation, we would fetch the actual plan data from the API
  const plans = selectedPlans.map((selectedPlan, index) => {
    // This is a placeholder - in reality you would match this with data from your API
    return {
      id: selectedPlan.id,
      name: `Plan ${index + 1}`,
      provider: `Provider ${index + 1}`,
      basePrice: 100 + (index * 25),
      category: selectedPlan.category,
      // Add other placeholder fields as needed for display
      medicalCoverage: 50000 + (index * 50000),
      tripCancellation: `Up to $${5000 + (index * 1000)}`,
      baggageProtection: 1000 + (index * 500),
      emergencyEvacuation: 250000 + (index * 50000),
      adventureActivities: index % 2 === 0,
      rentalCarCoverage: index === 0 ? 0 : 25000,
      rating: (4 + (index * 0.2)).toFixed(1),
      reviews: 100 + (index * 25),
    };
  });
  
  return (
    <MainLayout>
      <div className="container py-8 max-w-7xl">
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
        
        {/* Plan warning for too many plans */}
        {renderPlanWarning()}
        
        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg text-gray-600">Loading plans for comparison...</p>
          </div>
        ) : (
          <>
            {/* Tabs for different comparison views */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="coverage">Coverage Details</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
                  {/* Left column with field labels */}
                  <div className="hidden lg:block">
                    <div className="h-[120px]"></div> {/* Empty space for plan headers */}
                    <div className="py-3 font-semibold">Price</div>
                    <div className="py-3 font-semibold">Medical Coverage</div>
                    <div className="py-3 font-semibold">Trip Cancellation</div>
                    <div className="py-3 font-semibold">Baggage Protection</div>
                    <div className="py-3 font-semibold">Emergency Evacuation</div>
                    <div className="py-3 font-semibold">Rental Car Coverage</div>
                    <div className="py-3 font-semibold">Adventures Activities</div>
                    <div className="py-3 font-semibold">Rating</div>
                  </div>
                  
                  {/* Right column with plan cards */}
                  <div className="overflow-x-auto">
                    <div className="grid grid-flow-col auto-cols-[minmax(250px,1fr)] gap-4">
                      {/* Plan columns */}
                      {plans.map((plan) => (
                        <div key={plan.id} className="flex flex-col">
                          {/* Plan header */}
                          <Card className="p-4 mb-4 h-[120px] relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-1 right-1 h-8 w-8 text-gray-400 hover:text-red-500"
                              onClick={() => handleRemovePlan(plan.id)}
                            >
                              <XCircle className="h-5 w-5" />
                              <span className="sr-only">Remove plan</span>
                            </Button>
                            
                            <div className="text-lg font-bold text-primary mb-1">
                              {plan.name}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {plan.provider}
                            </div>
                            <Badge variant="outline" className="w-fit capitalize">
                              {plan.category}
                            </Badge>
                          </Card>
                          
                          {/* Plan details fields */}
                          <div className={cn(
                            "py-3 font-bold text-lg",
                            bestValues.price === plan.basePrice && "text-primary"
                          )}>
                            {bestValues.price === plan.basePrice && (
                              <Badge variant="secondary" className="mr-2">Best Value</Badge>
                            )}
                            {formatPrice(plan.basePrice)}
                          </div>
                          
                          <div className={cn(
                            "py-3",
                            bestValues.medicalCoverage === plan.medicalCoverage && "font-semibold text-primary"
                          )}>
                            {formatNumber(plan.medicalCoverage)}
                          </div>
                          
                          <div className="py-3">
                            {plan.tripCancellation || "Not Included"}
                          </div>
                          
                          <div className={cn(
                            "py-3",
                            bestValues.baggageProtection === plan.baggageProtection && "font-semibold text-primary"
                          )}>
                            {formatNumber(plan.baggageProtection)}
                          </div>
                          
                          <div className={cn(
                            "py-3",
                            bestValues.emergencyEvacuation === plan.emergencyEvacuation && "font-semibold text-primary"
                          )}>
                            {formatNumber(plan.emergencyEvacuation)}
                          </div>
                          
                          <div className="py-3">
                            {formatNumber(plan.rentalCarCoverage)}
                          </div>
                          
                          <div className="py-3">
                            {plan.adventureActivities ? "Included" : "Not Included"}
                          </div>
                          
                          <div className="py-3 flex items-center">
                            {plan.rating && (
                              <>
                                <span className="text-primary font-semibold mr-1">{plan.rating}</span>
                                <Award className="h-4 w-4 text-amber-500" />
                                {plan.reviews && <span className="text-sm text-gray-500 ml-1">({plan.reviews})</span>}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Coverage Details Tab - Will be similar structure to Overview */}
              <TabsContent value="coverage">
                <div className="p-8 text-center text-gray-500">
                  <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">Detailed coverage information would be displayed here.</p>
                </div>
              </TabsContent>
              
              {/* Features Tab - Will be similar structure to Overview */}
              <TabsContent value="features">
                <div className="p-8 text-center text-gray-500">
                  <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">Plan features comparison would be displayed here.</p>
                </div>
              </TabsContent>
              
              {/* Terms Tab - Will be similar structure to Overview */}
              <TabsContent value="terms">
                <div className="p-8 text-center text-gray-500">
                  <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">Terms and conditions comparison would be displayed here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleExitWithConfirmation}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Plans
          </Button>
          
          <Button 
            onClick={() => navigate('/checkout')}
            className="flex items-center gap-1"
          >
            Continue to Checkout
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
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
    </MainLayout>
  );
}