import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useCompareStore, InsurancePlan } from '@/store/compare-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, FileBarChart, Trash, AlertTriangle, CheckCircle, Info, ArrowRight, XCircle, Award, Tags } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { InsuranceCategory } from '@shared/schema';

export default function ComparePlansPage() {
  // Core state from compare store
  const { 
    selectedPlans, 
    clearPlans, 
    removePlan, 
    getSelectedCategories, 
    getSelectedPlansByCategory, 
    clearCategory 
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
  
  // Effect to handle initial data loading
  useEffect(() => {
    const prepareComparison = async () => {
      setIsLoading(true);
      
      try {
        // Validate that we have plans to compare
        if (selectedPlans.length === 0) {
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
          // Note: This would connect to your actual analytics implementation
          console.log('Analytics: view_comparison', {
            plan_count: selectedPlans.length,
            categories: selectedCategories.join(','),
            plan_ids: selectedPlans.map(p => p.id).join(',')
          });
        } catch (error) {
          console.error('Analytics error:', error);
        }
        
        // Calculate best values for numeric comparison after a short delay
        // to simulate data processing
        setTimeout(() => {
          calculateBestValues();
          setIsLoading(false);
        }, 500);
        
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
  }, [selectedPlans, navigate, toast, selectedCategories]);
  
  // Calculate best values for numeric comparison
  const calculateBestValues = () => {
    const best: Record<string, number | string> = {};
    
    // For price, find the lowest (this is best)
    const prices = selectedPlans
      .map(p => p.price || 0)
      .filter(p => p > 0);
    if (prices.length) best['price'] = Math.min(...prices);
    
    // Category-specific calculations
    // Each category has its own set of important metrics
    selectedCategories.forEach(category => {
      const plansInCategory = getSelectedPlansByCategory(category);
      
      if (category === 'travel') {
        // For travel, calculate best medical coverage, emergency evacuation
        const medicalCoverage = plansInCategory
          .map(p => p.coverage?.medical ? parseInt(p.coverage.medical.replace(/[^0-9]/g, '')) : 0)
          .filter(m => m > 0);
        if (medicalCoverage.length) best[`${category}_medicalCoverage`] = Math.max(...medicalCoverage);
        
        const evacCoverage = plansInCategory
          .map(p => p.coverage?.emergency ? parseInt(p.coverage.emergency.replace(/[^0-9]/g, '')) : 0)
          .filter(e => e > 0);
        if (evacCoverage.length) best[`${category}_emergencyEvacuation`] = Math.max(...evacCoverage);
      }
      
      if (category === 'auto') {
        // For auto, liability coverage is important
        const liability = plansInCategory
          .map(p => {
            const liabilityText = p.features?.find(f => f.toLowerCase().includes('liability'));
            const match = liabilityText?.match(/\d[\d,]*(?:\.\d+)?/g);
            return match ? parseInt(match[0].replace(/,/g, '')) : 0;
          })
          .filter(l => l > 0);
        if (liability.length) best[`${category}_liability`] = Math.max(...liability);
      }
      
      // Add similar logic for health and pet categories
    });
    
    setBestValues(best);
  };
  
  // Format price as currency
  const formatPrice = (price: number | undefined) => {
    if (!price) return "Not specified";
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  // Format large numbers with commas
  const formatNumber = (num: number | undefined) => {
    if (!num) return "Not specified";
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
  
  // Clear plans and navigate away
  const handleConfirmedClear = () => {
    // Store data for analytics before clearing
    const planCount = selectedPlans.length;
    const categories = selectedCategories;
    const planIds = selectedPlans.map(p => p.id);
    
    // Clear plans and close dialog
    clearPlans();
    setIsConfirmDialogOpen(false);
    
    // Navigate to the most common category or default to travel
    const mostCommonCategory = categories.length > 0 
      ? categories.sort((a, b) => 
          selectedPlans.filter(p => p.category === b).length - 
          selectedPlans.filter(p => p.category === a).length
        )[0] 
      : 'travel';
    
    navigate(`/insurance/${mostCommonCategory}`);
    
    // Track the clear comparison event
    console.log('Analytics: clear_comparison', {
      plan_count: planCount,
      categories: categories.join(','),
      plan_ids: planIds.join(',')
    });
  };
  
  // Remove a single plan from comparison
  const handleRemovePlan = (id: string) => {
    // Find the plan before removing
    const planToRemove = selectedPlans.find(p => p.id === id);
    if (!planToRemove) return;
    
    const planCategory = planToRemove.category;
    
    // Remove the plan
    removePlan(id);
    
    // Show notification
    toast({
      title: "Plan removed",
      description: "The plan has been removed from your comparison.",
    });
    
    // Check if we need to redirect (less than 2 plans left)
    if (selectedPlans.length <= 2) {
      navigate(`/insurance/${planCategory}`);
    }
    
    // Track removal event
    console.log('Analytics: remove_plan_from_comparison', {
      plan_id: id,
      plan_category: planCategory,
      remaining_plans: selectedPlans.length - 1
    });
  };
  
  // Clear an entire category
  const handleClearCategory = (category: InsuranceCategory) => {
    const plansInCategory = getSelectedPlansByCategory(category);
    if (plansInCategory.length === 0) return;
    
    // Clear this category
    clearCategory(category);
    
    // Show notification
    toast({
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} plans cleared`,
      description: `All ${category} plans have been removed from your comparison.`,
    });
    
    // Check if we need to redirect
    if (selectedPlans.length < 2) {
      // Get the remaining category, or default to travel
      const remainingCategory = getSelectedCategories()[0] || 'travel';
      navigate(`/insurance/${remainingCategory}`);
    }
    
    // Track category clear event
    console.log('Analytics: clear_category_from_comparison', {
      category,
      plans_removed: plansInCategory.length,
      remaining_plans: selectedPlans.length - plansInCategory.length
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

  // Helper to get category-specific icon color
  const getCategoryColor = (category: InsuranceCategory) => {
    switch(category) {
      case 'travel': return 'text-blue-500';
      case 'auto': return 'text-red-500';
      case 'pet': return 'text-amber-500';
      case 'health': return 'text-emerald-500';
      default: return 'text-primary';
    }
  };

  // Get icon for category
  const getCategoryIcon = (category: InsuranceCategory) => {
    const color = getCategoryColor(category);
    switch(category) {
      case 'travel':
        return <Tags className={`h-5 w-5 ${color}`} />;
      case 'auto':
        return <Tags className={`h-5 w-5 ${color}`} />;
      case 'pet':
        return <Tags className={`h-5 w-5 ${color}`} />;
      case 'health':
        return <Tags className={`h-5 w-5 ${color}`} />;
      default:
        return <Tags className={`h-5 w-5 ${color}`} />;
    }
  };
  
  // Debugging information
  console.log("ComparePlansPage rendering with", { 
    selectedPlansCount: selectedPlans.length,
    categories: selectedCategories,
    isLoading,
    hasError
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
              {selectedCategories.length > 1 && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Cross-Category
                </Badge>
              )}
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
        
        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg text-gray-600">Loading plans for comparison...</p>
          </div>
        ) : (
          <>
            {/* Categories Overview */}
            {selectedCategories.length > 1 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Categories Being Compared</h2>
                <div className="flex flex-wrap gap-3">
                  {selectedCategories.map(category => (
                    <div 
                      key={category}
                      className="flex items-center bg-white border rounded-lg p-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {getCategoryIcon(category)}
                        <div>
                          <div className="font-medium capitalize">{category} Insurance</div>
                          <div className="text-sm text-muted-foreground">
                            {getSelectedPlansByCategory(category).length} plan(s)
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleClearCategory(category)}
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Remove {category}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="coverage">Coverage Details</TabsTrigger>
                <TabsTrigger value="price">Price Analysis</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="border-none p-0">
                <h2 className="text-lg font-medium mb-3">Plan Overview Comparison</h2>
                <ScrollArea className="w-full rounded-md" orientation="horizontal">
                  <div className="flex gap-4 pb-4 min-w-max">
                    {/* First column labels */}
                    <div className="w-64 flex-shrink-0">
                      <div className="h-60 bg-muted/20 rounded-t-lg"></div>
                      
                      <div className="border-t border-border py-3 px-4 font-medium">
                        Provider
                      </div>
                      <div className="border-t border-border py-3 px-4 font-medium">
                        Category
                      </div>
                      <div className="border-t border-border py-3 px-4 font-medium">
                        Country
                      </div>
                      <div className="border-t border-border py-3 px-4 font-medium">
                        Price
                      </div>
                      <div className="border-t border-border py-3 px-4 font-medium">
                        Rating
                      </div>
                      <div className="border-t border-border py-3 px-4 font-medium">
                        Feature Count
                      </div>
                      <div className="border-t border-border py-3 px-4 font-medium rounded-b-lg">
                        Actions
                      </div>
                    </div>
                    
                    {/* Plan columns */}
                    {selectedPlans.map((plan, index) => (
                      <Card 
                        key={plan.id} 
                        className={cn(
                          "w-60 flex-shrink-0 shadow-sm overflow-hidden",
                          plan.badge && "border-primary/50"
                        )}
                      >
                        {/* Plan header */}
                        <div className="relative h-60 bg-gradient-to-br from-muted/20 to-muted/40 flex flex-col justify-between p-4">
                          {plan.badge && (
                            <Badge className="absolute top-2 right-2 bg-primary/90">
                              {plan.badge}
                            </Badge>
                          )}
                          
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-lg line-clamp-2">{plan.name}</h3>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground">
                              {plan.description || `${plan.name} from ${plan.provider}`}
                            </p>
                          </div>
                          
                          {/* Category badge */}
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "mt-4",
                              getCategoryColor(plan.category).replace('text-', 'border-')
                            )}
                          >
                            {getCategoryIcon(plan.category)}
                            <span className="ml-1 capitalize">{plan.category}</span>
                          </Badge>
                        </div>
                        
                        {/* Plan details */}
                        <div className="border-t border-border py-3 px-4">
                          {plan.provider}
                        </div>
                        
                        <div className="border-t border-border py-3 px-4 capitalize">
                          {plan.category} Insurance
                        </div>
                        
                        <div className="border-t border-border py-3 px-4">
                          {plan.country || "Not specified"}
                        </div>
                        
                        <div className="border-t border-border py-3 px-4 font-semibold">
                          {formatPrice(plan.price)}
                          {plan.price === bestValues['price'] && (
                            <Badge variant="outline" className="ml-2 text-xs border-green-500 text-green-600">
                              Best Price
                            </Badge>
                          )}
                        </div>
                        
                        <div className="border-t border-border py-3 px-4">
                          {plan.rating ? (
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4 text-amber-500" />
                              <span>{plan.rating}</span>
                            </div>
                          ) : "Not rated"}
                        </div>
                        
                        <div className="border-t border-border py-3 px-4">
                          {plan.features?.length || "None specified"}
                        </div>
                        
                        <div className="border-t border-border py-3 px-4">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleRemovePlan(plan.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              {/* Features Tab */}
              <TabsContent value="features" className="border-none p-0">
                <h2 className="text-lg font-medium mb-3">Plan Features Comparison</h2>
                <ScrollArea className="w-full rounded-md" orientation="horizontal">
                  <div className="flex gap-4 pb-4 min-w-max">
                    {/* First column - feature names */}
                    <div className="w-64 flex-shrink-0">
                      <div className="h-20 bg-muted/20 rounded-t-lg flex items-center justify-center">
                        <h3 className="font-semibold text-lg">Features</h3>
                      </div>
                      
                      {/* Generate a comprehensive list of all features from all plans */}
                      {selectedCategories.map(category => {
                        const plansInCategory = getSelectedPlansByCategory(category);
                        const allFeatures = new Set<string>();
                        
                        // Collect unique features for this category
                        plansInCategory.forEach(plan => {
                          plan.features?.forEach(feature => allFeatures.add(feature));
                        });
                        
                        return Array.from(allFeatures).length > 0 ? (
                          <div key={category}>
                            <div className="border-t border-border py-3 px-4 font-medium bg-muted/20 capitalize">
                              {getCategoryIcon(category)}
                              <span className="ml-2">{category} Features</span>
                            </div>
                            
                            {Array.from(allFeatures).map((feature, idx) => (
                              <div key={`${category}-${idx}`} className="border-t border-border py-3 px-4">
                                {feature}
                              </div>
                            ))}
                          </div>
                        ) : null;
                      })}
                    </div>
                    
                    {/* Plan columns */}
                    {selectedPlans.map(plan => (
                      <Card 
                        key={plan.id} 
                        className={cn(
                          "w-40 flex-shrink-0 shadow-sm overflow-hidden",
                          plan.badge && "border-primary/50"
                        )}
                      >
                        {/* Plan header */}
                        <div className="h-20 flex flex-col justify-center p-4 border-b">
                          <h3 className="font-medium text-sm text-center line-clamp-2">{plan.name}</h3>
                          <p className="text-xs text-center text-muted-foreground mt-1">{plan.provider}</p>
                        </div>
                        
                        {/* Feature indicators by category */}
                        {selectedCategories.map(category => {
                          // Show all unique features for this category
                          const plansInCategory = getSelectedPlansByCategory(category);
                          const allFeatures = new Set<string>();
                          
                          // Collect unique features
                          plansInCategory.forEach(p => {
                            p.features?.forEach(feature => allFeatures.add(feature));
                          });
                          
                          return Array.from(allFeatures).length > 0 ? (
                            <div key={category}>
                              {/* Category header */}
                              <div className="border-t border-border py-3 h-[50px] flex items-center justify-center">
                                {plan.category === category ? (
                                  <Badge className={cn(
                                    "text-xs",
                                    plan.category === category ? "bg-primary" : "bg-muted text-muted-foreground"
                                  )}>
                                    {plan.category === category ? "Included" : "N/A"}
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground">Different category</span>
                                )}
                              </div>
                              
                              {/* Feature indicators */}
                              {Array.from(allFeatures).map((feature, idx) => {
                                const hasFeature = plan.category === category && 
                                  plan.features?.some(f => f === feature);
                                
                                return (
                                  <div 
                                    key={`${category}-${idx}`} 
                                    className="border-t border-border py-3 flex justify-center"
                                  >
                                    {plan.category === category ? (
                                      hasFeature ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                      )
                                    ) : (
                                      <span className="text-xs text-muted-foreground">N/A</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : null;
                        })}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              {/* Coverage Tab */}
              <TabsContent value="coverage" className="border-none p-0">
                <h2 className="text-lg font-medium mb-3">Coverage Details Comparison</h2>
                
                {/* If coverage details are available, show detailed comparison */}
                {selectedPlans.some(plan => plan.coverageHighlights) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedPlans.map(plan => (
                      <Card 
                        key={plan.id} 
                        className={cn(
                          "shadow-sm overflow-hidden",
                          plan.badge && "border-primary/50"
                        )}
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="flex-1">
                              <h3 className="font-medium text-lg">{plan.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {plan.provider} | {plan.country || "Not specified"}
                              </p>
                              
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "mt-2",
                                  getCategoryColor(plan.category).replace('text-', 'border-')
                                )}
                              >
                                {getCategoryIcon(plan.category)}
                                <span className="ml-1 capitalize">{plan.category}</span>
                              </Badge>
                            </div>
                            
                            {plan.badge && (
                              <Badge className="bg-primary/90">
                                {plan.badge}
                              </Badge>
                            )}
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Price:</h4>
                              <p>{formatPrice(plan.price)}</p>
                              {plan.priceRange && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Range: {plan.priceRange}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Coverage Highlights:</h4>
                              <p className="text-sm">
                                {plan.coverageHighlights || "Coverage details not specified"}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Key Features:</h4>
                              <ul className="list-disc pl-5 text-sm space-y-1">
                                {plan.features?.map((feature, idx) => (
                                  <li key={idx}>{feature}</li>
                                )) || "Features not specified"}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/20 rounded-lg p-6 text-center">
                    <Info className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">Coverage Details Not Available</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Detailed coverage information is not available for the selected plans. 
                      Please refer to the plan overview or features for available information.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              {/* Price Analysis Tab */}
              <TabsContent value="price" className="border-none p-0">
                <h2 className="text-lg font-medium mb-3">Price Analysis</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                  {/* Price statistics */}
                  <Card className="p-5">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Lowest Price</h3>
                    <p className="text-2xl font-bold">
                      {formatPrice(Math.min(...selectedPlans.map(p => p.price || Infinity)))}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Best value option
                    </p>
                  </Card>
                  
                  <Card className="p-5">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Highest Price</h3>
                    <p className="text-2xl font-bold">
                      {formatPrice(Math.max(...selectedPlans.map(p => p.price || 0)))}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Premium option
                    </p>
                  </Card>
                  
                  <Card className="p-5">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Price</h3>
                    <p className="text-2xl font-bold">
                      {formatPrice(
                        selectedPlans.reduce((sum, p) => sum + (p.price || 0), 0) / 
                        selectedPlans.filter(p => p.price).length
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across all selected plans
                    </p>
                  </Card>
                  
                  <Card className="p-5">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Price Difference</h3>
                    <p className="text-2xl font-bold">
                      {formatPrice(
                        Math.max(...selectedPlans.map(p => p.price || 0)) - 
                        Math.min(...selectedPlans.map(p => p.price || Infinity))
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Between highest and lowest
                    </p>
                  </Card>
                </div>
                
                {/* Price comparison by category */}
                {selectedCategories.length > 1 && (
                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-3">Price Comparison by Category</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {selectedCategories.map(category => {
                        const plansInCategory = getSelectedPlansByCategory(category);
                        if (plansInCategory.length === 0) return null;
                        
                        const avgPrice = plansInCategory.reduce((sum, p) => sum + (p.price || 0), 0) / 
                                        plansInCategory.filter(p => p.price).length;
                        
                        return (
                          <Card key={category} className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                              {getCategoryIcon(category)}
                              <h4 className="font-medium capitalize">{category} Insurance</h4>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Average Price</p>
                                <p className="text-lg font-semibold">{formatPrice(avgPrice)}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-muted-foreground">Price Range</p>
                                <p className="text-lg font-semibold">
                                  {formatPrice(Math.min(...plansInCategory.map(p => p.price || Infinity)))} - 
                                  {formatPrice(Math.max(...plansInCategory.map(p => p.price || 0)))}
                                </p>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {/* Call to action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleExitWithConfirmation}
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
              
              <Button 
                className="flex items-center gap-2"
                onClick={() => {
                  // Ideally, this would navigate to checkout or quote request
                  // For now, go to the detailed page of the lowest price plan
                  const lowestPricePlan = selectedPlans.reduce(
                    (lowest, current) => 
                      (current.price || Infinity) < (lowest.price || Infinity) ? current : lowest, 
                    selectedPlans[0]
                  );
                  
                  navigate(`/insurance/${lowestPricePlan.category}/quote?planId=${lowestPricePlan.id}`);
                  
                  // Track this selection
                  console.log('Analytics: select_best_plan_from_comparison', {
                    plan_id: lowestPricePlan.id,
                    plan_category: lowestPricePlan.category,
                    comparison_count: selectedPlans.length
                  });
                }}
              >
                Get Quote for Best Plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
        
        {/* Confirmation Dialog */}
        <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Comparison?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove all selected plans from your comparison. Are you sure you want to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-500 hover:bg-red-600" 
                onClick={handleConfirmedClear}
              >
                Yes, Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}