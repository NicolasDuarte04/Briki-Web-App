import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InsurancePlan } from "@shared/schema";
import { useLocation, Link } from "wouter";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CompareModal from "@/components/compare-modal";
import TripSummary from "@/components/trip-summary";
import { PlanGrid } from "@/components/plan-grid";
import { FeatureBreakdown } from "@/components/feature-breakdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Search, Sparkles, ChevronLeft, Medal, ThumbsUp, Zap, Star } from "lucide-react";
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

export default function InsurancePlansPage() {
  const [, navigate] = useLocation();
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState<InsurancePlan[]>([]);
  const [filterPriceRange, setFilterPriceRange] = useState([0, 200]);
  const [filterMedical, setFilterMedical] = useState(false);
  const [filterTrip, setFilterTrip] = useState(false);
  const [filterAdventure, setFilterAdventure] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  // Get insurance plans
  const { data: plans = [], isLoading, error } = useQuery<InsurancePlan[]>({
    queryKey: ["/api/insurance-plans"],
  });
  
  // Filter plans based on criteria
  const filteredPlans = plans.filter(plan => 
    plan.basePrice >= filterPriceRange[0] &&
    plan.basePrice <= filterPriceRange[1] &&
    (!filterMedical || plan.medicalCoverage >= 150000) &&
    (!filterTrip || plan.tripCancellation.includes("100%")) &&
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
    <div className="min-h-screen flex flex-col bg-[#f8f8f6]">
      <Navbar />
      
      <div className="flex-grow mb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* Header with back button */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/trip-info" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-900">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">Seguros de viaje</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredPlans.length} planes disponibles para tu viaje
                  </p>
                </div>
              </div>
              
              {/* Filter trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 h-10">
                    <Filter className="h-4 w-4" />
                    <span>Filtros</span>
                    {getActiveFilterCount() > 0 && (
                      <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
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
          </div>
          
          {/* Trip Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <TripSummary />
          </div>
          
          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="w-full bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="all" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
              >
                Todos
              </TabsTrigger>
              <TabsTrigger 
                value="best" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
              >
                <Medal className="h-3.5 w-3.5 mr-1.5" />
                Mejor valorados
              </TabsTrigger>
              <TabsTrigger 
                value="economy" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
              >
                Económicos
              </TabsTrigger>
              <TabsTrigger 
                value="premium" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
              >
                Premium
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Plan display section */}
          <div className="mt-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-500">Cargando planes de seguro...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4">
                <h3 className="font-medium mb-1">Error al cargar los planes</h3>
                <p className="text-sm">Por favor intenta de nuevo o contacta a soporte.</p>
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <h3 className="text-lg font-medium text-blue-800 mb-2">No se encontraron planes</h3>
                <p className="text-blue-600 mb-4">Intenta ajustar los filtros para ver más opciones.</p>
                <Button variant="outline" onClick={resetFilters} className="mt-2">
                  Restablecer filtros
                </Button>
              </div>
            ) : (
              <>
                {/* If we have a selected plan for details, show the feature breakdown */}
                {selectedPlanForDetails && (
                  <div className="mb-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
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
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button 
                        className="briki-button w-full" 
                        onClick={() => navigate(`/checkout/${selectedPlanForDetails.id}`)}
                      >
                        Seleccionar plan
                      </Button>
                    </div>
                  </div>
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
              </>
            )}
          </div>
        </div>
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