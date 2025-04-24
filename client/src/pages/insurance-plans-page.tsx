import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InsurancePlan } from "@shared/schema";
import { useLocation, Link } from "wouter";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import InsuranceCard from "@/components/insurance-card";
import CompareModal from "@/components/compare-modal";
import TripSummary from "@/components/trip-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function InsurancePlansPage() {
  const [, navigate] = useLocation();
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState<InsurancePlan[]>([]);
  const [filterPriceRange, setFilterPriceRange] = useState([0, 500]);
  const [filterMedical, setFilterMedical] = useState(false);
  const [filterTrip, setFilterTrip] = useState(false);
  const [filterAdventure, setFilterAdventure] = useState(false);
  
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
    (!filterAdventure || plan.adventureActivities)
  );
  
  // Toggle plan selection for comparison
  const togglePlanSelection = (plan: InsurancePlan) => {
    if (selectedPlans.find(p => p.id === plan.id)) {
      setSelectedPlans(selectedPlans.filter(p => p.id !== plan.id));
    } else {
      if (selectedPlans.length < 3) {
        setSelectedPlans([...selectedPlans, plan]);
      }
    }
  };
  
  const resetFilters = () => {
    setFilterPriceRange([0, 500]);
    setFilterMedical(false);
    setFilterTrip(false);
    setFilterAdventure(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        <div className="briki-mobile-container">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link href="/trip-info" className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <h1 className="briki-logo ml-4">
                briki
                <span className="checkmark">✓</span>
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-black">Select a plan</h2>
            <p className="text-sm text-gray-600 mt-2">
              Medical expenses up to $200,000 • Trip cancellation • Baggage
            </p>
          </div>
          
          <div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="hidden">
                  <Filter className="h-4 w-4" />
                  <span>Filter Plans</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Plans</SheetTitle>
                  <SheetDescription>
                    Customize your search to find the perfect insurance plan.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Price Range</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>${filterPriceRange[0]}</span>
                        <span>${filterPriceRange[1]}</span>
                      </div>
                      <Input
                        type="range"
                        min="0"
                        max="500"
                        value={filterPriceRange[1]}
                        onChange={(e) => setFilterPriceRange([filterPriceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium mb-1">Coverage Features</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="medical" 
                        checked={filterMedical}
                        onCheckedChange={(checked) => setFilterMedical(checked === true)}
                      />
                      <label htmlFor="medical" className="text-sm">High Medical Coverage (150k+)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trip" 
                        checked={filterTrip}
                        onCheckedChange={(checked) => setFilterTrip(checked === true)}
                      />
                      <label htmlFor="trip" className="text-sm">100% Trip Cancellation</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="adventure" 
                        checked={filterAdventure}
                        onCheckedChange={(checked) => setFilterAdventure(checked === true)}
                      />
                      <label htmlFor="adventure" className="text-sm">Adventure Activities Coverage</label>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex space-x-2">
                    <Button onClick={resetFilters} variant="outline" className="w-full">Reset</Button>
                    <Button className="w-full">Apply</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Button 
              variant="outline" 
              disabled={selectedPlans.length < 2} 
              onClick={() => setCompareModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Compare {selectedPlans.length > 0 ? `(${selectedPlans.length})` : "Plans"}</span>
            </Button>
          </div>
          
          <TripSummary />
          
          <div className="space-y-6 mt-8">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                Error loading insurance plans. Please try again.
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-blue-800 mb-2">No plans found</h3>
                <p className="text-blue-600">Try adjusting your filters to see more plans.</p>
                <Button variant="outline" onClick={resetFilters} className="mt-4">
                  Reset Filters
                </Button>
              </div>
            ) : (
              filteredPlans.map((plan) => (
                <InsuranceCard
                  key={plan.id}
                  plan={plan}
                  isSelected={selectedPlans.some(p => p.id === plan.id)}
                  onToggleSelect={() => togglePlanSelection(plan)}
                  onSelectPlan={() => navigate(`/checkout/${plan.id}`)}
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      <CompareModal 
        open={compareModalOpen} 
        onOpenChange={setCompareModalOpen} 
        plans={selectedPlans} 
      />
      
      <Footer />
    </div>
  );
}