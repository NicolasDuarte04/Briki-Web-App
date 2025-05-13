import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { InsurancePlan, Trip } from "@shared/schema";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "@/hooks/use-navigation";
import { useToast } from "@/hooks/use-toast";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CompareModal from "@/components/compare-modal";
import TripSummary from "@/components/trip-summary";
import { PlanGrid } from "@/components/plan-grid";
import { FeatureBreakdown } from "@/components/feature-breakdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Search, Sparkles, ChevronLeft, Medal, ThumbsUp, Zap, Star, HelpCircle, RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { FuturisticBackground } from "@/components/ui/futuristic-background";
import { AIAssistant, getComparisonTips } from "@/components/ui/ai-assistant";
import { PlanGridSkeleton, TopProgressBar } from "@/components/ui/skeleton-loaders";
import { ApiErrorsSummary, AllProvidersFailedError } from "@/components/ui/error-display";
import { usePlansForTrip, useInvalidatePlansCache, usePlanErrors } from "@/services/caching/insurance-cache";

export default function InsurancePlansPage() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigation();
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState<InsurancePlan[]>([]);
  const [filterPriceRange, setFilterPriceRange] = useState([0, 200]);
  const [filterMedical, setFilterMedical] = useState(false);
  const [filterTrip, setFilterTrip] = useState(false);
  const [filterAdventure, setFilterAdventure] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  
  // Use our cached and fallback trip data
  // In a real implementation, this would come from a previous step or context
  const tripData = {
    id: 1,
    destination: "Mexico",
    countryOfOrigin: "Colombia",
    departureDate: "2023-12-10",
    returnDate: "2023-12-20",
    travelers: 2,
    userId: null,
    createdAt: null,
    estimatedCost: 1500, // Estimated trip cost for coverage calculations
  } as Trip;
  
  // Get provider API errors
  const { data: apiErrors = {} } = usePlanErrors();
  
  // Get insurance plans using our real API integration and caching
  const { 
    data: plans = [], 
    isLoading, 
    error, 
    isError, 
    refetch 
  } = usePlansForTrip(tripData);
  
  // Cache invalidation mutation
  const invalidateCacheMutation = useInvalidatePlansCache();
  const isInvalidating = invalidateCacheMutation.isPending;
  
  // Helper to handle refreshing data
  const handleRefresh = () => {
    invalidateCacheMutation.mutate({ tripId: tripData.id });
    toast({
      title: "Refreshing data",
      description: "Getting the latest quotes from insurance providers...",
    });
  };
  
  // Show loading state during initial load and invalidation
  const showLoading = isLoading || isInvalidating;
  
  // Get total error count
  const errorCount = Object.keys(apiErrors).length;
  
  // Filter plans based on criteria
  const filteredPlans = plans.filter(plan => 
    plan.basePrice >= filterPriceRange[0] &&
    plan.basePrice <= filterPriceRange[1] &&
    (!filterMedical || (plan.medicalCoverage || 0) >= 150000) &&
    (!filterTrip || (plan.tripCancellation || "").includes("100%")) &&
    (!filterAdventure || plan.adventureActivities) &&
    (activeTab === "all" || 
     (activeTab === "best" && plan.rating && parseFloat(plan.rating) >= 4.5) ||
     (activeTab === "economy" && plan.basePrice < 80) ||
     (activeTab === "premium" && plan.basePrice > 100)
    )
  );
  
  // Selected plan for details
  const [selectedPlanForDetails, setSelectedPlanForDetails] = useState<InsurancePlan | null>(null);
  
  // Reset filters
  const resetFilters = () => {
    setFilterPriceRange([0, 200]);
    setFilterMedical(false);
    setFilterTrip(false);
    setFilterAdventure(false);
  };

  // For badge count on filter button
  const getActiveFilterCount = () => {
    let count = 0;
    if (filterMedical) count++;
    if (filterTrip) count++;
    if (filterAdventure) count++;
    if (filterPriceRange[1] < 200) count++;
    return count;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <FuturisticBackground particleCount={30} interactive={false} />
      </div>
      
      <div className="flex-grow mb-12 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* Header with back button */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={goBack}
                  className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-primary/20 shadow-glow-sm flex items-center justify-center text-foreground hover:text-primary transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold section-header">Seguros de viaje</h1>
                  <p className="text-sm text-foreground/70 mt-1">
                    {filteredPlans.length} planes disponibles para tu viaje
                  </p>
                </div>
              </div>
              
              {/* Filter trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 h-10 bg-background/80 backdrop-blur-sm border border-primary/20 hover:bg-primary/10 transition-colors"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filtros</span>
                    {getActiveFilterCount() > 0 && (
                      <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtrar planes</SheetTitle>
                    <SheetDescription>
                      Personaliza tu búsqueda para encontrar el seguro perfecto.
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="py-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Rango de precio</h3>
                      <div className="px-2">
                        <Slider 
                          defaultValue={[filterPriceRange[1]]} 
                          max={200} 
                          step={10}
                          onValueChange={(value) => setFilterPriceRange([0, value[0]])}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>$0</span>
                          <span>Hasta ${filterPriceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium mb-1">Características de cobertura</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                              <Star className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Alta cobertura médica</p>
                              <p className="text-xs text-gray-500">$150,000+</p>
                            </div>
                          </div>
                          <Checkbox 
                            id="medical" 
                            checked={filterMedical}
                            onCheckedChange={(checked) => setFilterMedical(checked === true)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                              <ThumbsUp className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Cancelación de viaje</p>
                              <p className="text-xs text-gray-500">100% del costo del viaje</p>
                            </div>
                          </div>
                          <Checkbox 
                            id="trip" 
                            checked={filterTrip}
                            onCheckedChange={(checked) => setFilterTrip(checked === true)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center">
                              <Zap className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Actividades de aventura</p>
                              <p className="text-xs text-gray-500">Deportes y actividades extremas</p>
                            </div>
                          </div>
                          <Checkbox 
                            id="adventure" 
                            checked={filterAdventure}
                            onCheckedChange={(checked) => setFilterAdventure(checked === true)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <SheetFooter className="sm:justify-between gap-2">
                    <SheetClose asChild>
                      <Button onClick={resetFilters} variant="outline" className="w-full">
                        Restablecer
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button className="w-full">
                        Ver {filteredPlans.length} resultados
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </motion.div>
          
          {/* Trip Summary Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-background/80 backdrop-blur-sm rounded-xl shadow-glow-sm border border-primary/20 p-4 mb-6"
          >
            <TripSummary />
          </motion.div>
          
          {/* Category Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="w-full bg-background/60 backdrop-blur-sm border border-primary/10 p-1 rounded-xl">
                <TabsTrigger 
                  value="all" 
                  className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-glow-xs rounded-lg transition-all"
                >
                  Todos
                </TabsTrigger>
                <TabsTrigger 
                  value="best" 
                  className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-glow-xs rounded-lg transition-all"
                >
                  <Medal className="h-3.5 w-3.5 mr-1.5" />
                  Mejor valorados
                </TabsTrigger>
                <TabsTrigger 
                  value="economy" 
                  className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-glow-xs rounded-lg transition-all"
                >
                  Económicos
                </TabsTrigger>
                <TabsTrigger 
                  value="premium" 
                  className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-glow-xs rounded-lg transition-all"
                >
                  Premium
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
          
          {/* Loading progress bar */}
          <TopProgressBar isLoading={showLoading} />

          {/* API Error summary section - only show if we have some plans */}
          {errorCount > 0 && plans.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-6"
            >
              <ApiErrorsSummary 
                errors={apiErrors} 
                onRetryAll={handleRefresh} 
              />
            </motion.div>
          )}

          {/* Plan display section */}
          <div className="mt-4">
            <AnimatePresence mode="wait">
              {showLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-4"
                >
                  <div className="flex flex-col items-center justify-center mb-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-foreground/70">Obteniendo cotizaciones de seguros en tiempo real...</p>
                  </div>
                  <PlanGridSkeleton count={6} />
                </motion.div>
              ) : (isError && plans.length === 0) ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AllProvidersFailedError onRetry={handleRefresh} />
                </motion.div>
              ) : filteredPlans.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-xl p-6 text-center shadow-glow-sm"
                >
                  <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron planes</h3>
                  <p className="text-foreground/70 mb-4">Intenta ajustar los filtros para ver más opciones.</p>
                  <Button variant="outline" onClick={resetFilters} className="mt-2">
                    Restablecer filtros
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Refresh button */}
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefresh}
                      className="gap-1.5"
                      disabled={showLoading}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Actualizar cotizaciones
                    </Button>
                  </div>
                  
                  {/* If we have a selected plan for details, show the feature breakdown */}
                  {selectedPlanForDetails && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-background/80 backdrop-blur-sm rounded-xl p-5 shadow-glow-sm border border-primary/20"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">{selectedPlanForDetails.name}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedPlanForDetails(null)}
                        >
                          Ver todos
                        </Button>
                      </div>
                      <FeatureBreakdown 
                        plans={[selectedPlanForDetails]} 
                        maxFeatures={7}
                      />
                      <div className="mt-4 pt-4 border-t border-primary/10">
                        <Button 
                          className="w-full" 
                          onClick={() => navigate(`/checkout/${selectedPlanForDetails.id}`)}
                        >
                          Seleccionar plan
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Plan grid */}
                  <PlanGrid 
                    plans={filteredPlans}
                    onSelectPlan={(plan) => navigate(`/checkout/${plan.id}`)}
                    onComparePlans={(plans) => {
                      setSelectedPlans(plans);
                      setCompareModalOpen(true);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* AI Assistant */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <AIAssistant 
            tips={getComparisonTips()}
            position="bottom-right"
            contextAware={true}
            helpMode={true}
            autoShow={false}
            onUserQuery={(query) => {
              // Handle user query - for now just showing a toast with the query
              toast({
                title: "Question received",
                description: `We'll help with: "${query}"`,
              });
            }}
          />
        </motion.div>
      </div>
      
      {/* Compare modal */}
      <CompareModal 
        open={compareModalOpen} 
        onOpenChange={setCompareModalOpen} 
        plans={selectedPlans} 
      />
      
      <Footer />
    </div>
  );
}