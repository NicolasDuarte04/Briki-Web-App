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
  console.log("ComparePlansPage mounting..."); // Debug log to confirm component mount
  
  // STATE
  const { selectedPlans, clearPlans, removePlan } = useCompareStore();
  const [, navigate] = useLocation();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [bestValues, setBestValues] = useState<Record<string, number | string>>({});
  const [fetchedPlans, setFetchedPlans] = useState<InsurancePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  
  // EFFECTS
  // 1. Fetch plan details
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

        // For development, use placeholder data based on the selected plan IDs
        const placeholderPlans = selectedPlans.map((selectedPlan, index) => {
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
        
        // Set the fetched plans data
        setFetchedPlans(placeholderPlans);
        
        // Simulate network delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Error fetching plan data:', error);
        setHasError(true);
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

  // 2. Calculate best values
  useEffect(() => {
    if (!isLoading && fetchedPlans.length > 0) {
      // For numeric fields, determine the best value (highest coverage, lowest price)
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
        
        return best;
      };
      
      setBestValues(getBestValues());
    }
  }, [fetchedPlans, isLoading]);

  // HELPERS
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
  
  // HANDLERS
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
    // Clear the plans from state
    clearPlans();
    setIsConfirmDialogOpen(false);
    
    // Navigate back to travel insurance page
    navigate(`/insurance/travel`);
  };
  
  // COMPONENT FUNCTIONS
  // Render the plan warning about selection limits
  const renderPlanWarning = () => {
    if (selectedPlans.length < 2) {
      return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Not Enough Plans Selected</h3>
              <p className="text-amber-700">You need to select at least two plans to compare. Please go back and select additional plans.</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (selectedPlans.length >= 4) {
      return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Maximum Plans Selected</h3>
              <p className="text-amber-700">You've selected the maximum of 4 plans for comparison. To compare additional plans, remove some of your current selections.</p>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  // Render the overall comparison cards
  const renderComparisonCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {fetchedPlans.map((plan) => (
          <Card key={plan.id} className="relative overflow-hidden">
            <button 
              onClick={() => removePlan(plan.id)}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-600 z-10"
              aria-label="Remove plan"
            >
              <XCircle className="h-5 w-5" />
            </button>
            
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.provider}</p>
                </div>
                {/* Show plan category badge */}
                <Badge variant="outline" className="capitalize">
                  {plan.category}
                </Badge>
              </div>
              
              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-xl font-bold">
                    {formatPrice(plan.price || plan.basePrice)}
                    {(plan.price || plan.basePrice) === bestValues['price'] && (
                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                        Best Value
                      </Badge>
                    )}
                  </p>
                </div>
                
                {plan.category === 'travel' && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Medical Coverage</p>
                      <p className="font-semibold">
                        {formatNumber(plan.medicalCoverage)}
                        {plan.medicalCoverage === bestValues['medicalCoverage'] && (
                          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                            Highest
                          </Badge>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Trip Cancellation</p>
                      <p className="font-semibold">{plan.tripCancellation || "Not Included"}</p>
                    </div>
                  </>
                )}
                
                {/* Add more category-specific details here */}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  // RENDER
  console.log("ComparePlansPage rendering with", { 
    selectedPlansCount: selectedPlans.length,
    isLoading,
    hasError,
    fetchedPlansCount: fetchedPlans.length
  });

  return (
    <MainLayout>
      {/* TEST DIV - remove after debugging */}
      <div id="compare-debug" className="bg-yellow-100 p-2 text-xs">
        Debug: Plans page is rendering. Selected plans: {selectedPlans.length}
      </div>
      
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
        
        {/* Display error message if there's an error */}
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
        
        {/* Plan warning for too many plans */}
        {!hasError && renderPlanWarning()}
        
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
              
              <TabsContent value="overview" className="pt-2">
                {renderComparisonCards()}
              </TabsContent>
              
              <TabsContent value="coverage" className="pt-2">
                <Card className="p-5">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Coverage Comparison
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Compare detailed coverage information across your selected plans.
                  </p>
                  
                  {/* Simplified table for this demo */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="border-b p-3 text-left font-medium text-slate-600">Coverage</th>
                          {fetchedPlans.map(plan => (
                            <th key={plan.id} className="border-b p-3 text-left font-medium text-slate-600">
                              {plan.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-b p-3 font-medium">Medical Coverage</td>
                          {fetchedPlans.map(plan => (
                            <td key={plan.id} className="border-b p-3">
                              {formatNumber(plan.medicalCoverage)}
                              {plan.medicalCoverage === bestValues['medicalCoverage'] && (
                                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 text-xs">
                                  Best
                                </Badge>
                              )}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="border-b p-3 font-medium">Trip Cancellation</td>
                          {fetchedPlans.map(plan => (
                            <td key={plan.id} className="border-b p-3">
                              {plan.tripCancellation || "Not Included"}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="border-b p-3 font-medium">Baggage Protection</td>
                          {fetchedPlans.map(plan => (
                            <td key={plan.id} className="border-b p-3">
                              {formatNumber(plan.baggageProtection)}
                              {plan.baggageProtection === bestValues['baggageProtection'] && (
                                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 text-xs">
                                  Best
                                </Badge>
                              )}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="border-b p-3 font-medium">Emergency Evacuation</td>
                          {fetchedPlans.map(plan => (
                            <td key={plan.id} className="border-b p-3">
                              {formatNumber(plan.emergencyEvacuation)}
                              {plan.emergencyEvacuation === bestValues['emergencyEvacuation'] && (
                                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 text-xs">
                                  Best
                                </Badge>
                              )}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="border-b p-3 font-medium">Adventure Activities</td>
                          {fetchedPlans.map(plan => (
                            <td key={plan.id} className="border-b p-3">
                              {plan.adventureActivities ? (
                                <span className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" /> Covered
                                </span>
                              ) : (
                                <span className="flex items-center text-red-600">
                                  <XCircle className="h-4 w-4 mr-1" /> Not Covered
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="border-b p-3 font-medium">Rental Car Coverage</td>
                          {fetchedPlans.map(plan => (
                            <td key={plan.id} className="border-b p-3">
                              {plan.rentalCarCoverage ? formatNumber(plan.rentalCarCoverage) : "Not Included"}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="features" className="pt-2">
                <Card className="p-5">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Features Comparison
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Compare key features and benefits across your selected plans.
                  </p>
                  
                  {/* Placeholder for features comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fetchedPlans.map(plan => (
                      <Card key={plan.id} className="overflow-hidden">
                        <div className="bg-slate-50 p-3">
                          <h4 className="font-medium flex items-center gap-2">
                            {plan.name}
                            <Badge className="ml-auto">{plan.category}</Badge>
                          </h4>
                        </div>
                        <div className="p-4">
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <span>24/7 Emergency Assistance</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <span>Pre-existing Condition Coverage</span>
                            </li>
                            <li className="flex items-start gap-2">
                              {plan.adventureActivities ? (
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                              )}
                              <span>Adventure Activities Protection</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <span>Trip Delay Benefits</span>
                            </li>
                            <li className="flex items-start gap-2">
                              {plan.rentalCarCoverage ? (
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                              )}
                              <span>Rental Car Protection</span>
                            </li>
                          </ul>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="terms" className="pt-2">
                <Card className="p-5">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Terms & Exclusions
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Compare important terms, conditions, and exclusions between your selected plans.
                  </p>
                  
                  {/* Simplified terms comparison */}
                  <div className="space-y-6">
                    {fetchedPlans.map(plan => (
                      <div key={plan.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-50 p-3 flex items-center justify-between">
                          <h4 className="font-medium">{plan.name} by {plan.provider}</h4>
                          <Badge variant="outline" className="capitalize">{plan.category}</Badge>
                        </div>
                        <div className="p-4 space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Key Exclusions</h5>
                            <ul className="list-disc pl-5 space-y-1 text-slate-700">
                              <li>Pre-existing conditions without prior approval</li>
                              <li>Self-inflicted injuries or illness</li>
                              <li>Participation in extreme sports without proper coverage</li>
                              <li>Travel against medical advice</li>
                              <li>Trip cancellations for non-covered reasons</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Claim Process</h5>
                            <p className="text-slate-700">
                              Claims must be filed within 30 days of incident. Documentation including receipts, medical reports, and incident details are required.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      
      {/* Confirmation dialog for clearing plans */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Clear All Selected Plans?
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