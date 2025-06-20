import PlanCard from "@/components/briki-ai-assistant/PlanCard";
import { insuranceAPI, type InsurancePlan } from "@/services/insurance-api";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { Heart, Shield, Activity, ArrowRight, BadgeCheck, Stethoscope, UserPlus, Search, Filter } from "lucide-react";
import { HeroWrapper, ContentWrapper } from "@/components/layout";
import { useCompareStore } from "@/store/compare-store";
import { ComparePageTrigger } from "@/components/compare-page-trigger";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GradientButton from "@/components/gradient-button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import FilterSidebar, { type FilterOptions } from "@/components/insurance/FilterSidebar";
import PlanSort, { type SortOption, applySorting } from "@/components/insurance/PlanSort";
import PlanPagination from "@/components/insurance/PlanPagination";
import { useInsurancePlans } from "@/hooks/useInsurancePlans";

export default function HealthInsurancePage() {
  const [, navigate] = useLocation();
  const { selectedPlans, addPlan, removePlan, isPlanSelected } = useCompareStore();
  const { toast } = useToast();
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Advanced filtering state
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 1000],
    providers: [],
    coverageAmount: [0, 100000],
    features: [],
    rating: 0,
    deductible: [0, 1000],
    tags: []
  });

  // Use the insurance plans hook for better data management
  const {
    plans,
    filteredPlans,
    loading,
    error,
    metadata,
    searchQuery,
    setSearchQuery
  } = useInsurancePlans({ 
    category: 'health',
    autoLoad: true 
  });
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    }
  };
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set isLoaded to true after a short delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleCompareToggle = (id: string | number, isSelected: boolean) => {
    if (isSelected) {
      // Find the full plan data from our plans
      const planToAdd = plans.find(p => p.planId === id.toString());
      if (!planToAdd) return;
      
      // Try to add the plan to comparison
      const added = addPlan(planToAdd);
      
      // If adding failed, check why
      if (!added) {
        // Check if we're trying to mix categories
        const selectedCategories = Array.from(new Set(selectedPlans.map(p => p.category)));
        if (selectedCategories.length > 0 && !selectedCategories.includes('health')) {
          toast({
            title: "Cannot compare plans from different categories",
            description: "You can only compare plans from the same insurance category. Please clear your selection or remove plans from other categories first.",
            variant: "destructive"
          });
          return;
        }
        
        // Otherwise, it's probably a maximum plans issue
        if (selectedPlans.length >= 4) {
          toast({
            title: "Maximum plans reached",
            description: "You can compare a maximum of 4 plans at once.",
            variant: "destructive"
          });
          return;
        }
      }
      
      // Show a toast when a plan is added
      toast({
        title: "Plan added to comparison",
        description: `${selectedPlans.length + 1} health insurance plans selected.`
      });
    } else {
      removePlan(id.toString());
    }
  };

  // Apply client-side filtering and sorting
  const finalFilteredPlans = useMemo(() => {
    let filtered = filteredPlans || plans;
    
    // Apply advanced filters
    if (filters.priceRange) {
      filtered = filtered.filter(plan => 
        plan.basePrice >= filters.priceRange[0] && 
        plan.basePrice <= filters.priceRange[1]
      );
    }

    if (filters.providers && filters.providers.length > 0) {
      filtered = filtered.filter(plan => 
        filters.providers.includes(plan.provider)
      );
    }

    if (filters.coverageAmount) {
      filtered = filtered.filter(plan => 
        plan.coverageAmount >= filters.coverageAmount[0] && 
        plan.coverageAmount <= filters.coverageAmount[1]
      );
    }

    if (filters.features && filters.features.length > 0) {
      filtered = filtered.filter(plan =>
        filters.features.some(feature => 
          plan.features.some(planFeature => 
            planFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
      );
    }

    if (filters.rating && filters.rating > 0) {
      filtered = filtered.filter(plan => 
        plan.rating && plan.rating >= filters.rating
      );
    }

    // Apply sorting
    return applySorting(filtered, sortOption);
  }, [filteredPlans, plans, filters, sortOption]);

  // Pagination
  const totalPages = Math.ceil(finalFilteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlans = finalFilteredPlans.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero section with modern gradient */}
      <div className="w-full bg-gradient-to-br from-green-600 to-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="max-w-2xl">
              <Badge 
                variant="outline" 
                className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm"
              >
                <Heart className="h-3.5 w-3.5 mr-1.5" />
                Health Insurance
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Your Health, Our Priority
              </h1>
              <p className="text-lg opacity-90 mb-6">
                Comprehensive health insurance plans to protect you and your family. From preventive care to emergency treatment, we ensure you get the care you need.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="font-medium bg-white text-green-600 hover:bg-white/90"
                >
                  Compare Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-medium border-white/30 text-white hover:bg-white/10"
                  onClick={() => navigate('/insurance/health/quote')}
                >
                  Get Health Quote
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-48 h-48 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 flex items-center justify-center"
              >
                <Heart className="h-20 w-20 text-white" />
              </motion.div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  x: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -top-6 -right-6 w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 flex items-center justify-center"
              >
                <Stethoscope className="h-8 w-8 text-white" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  x: [0, -3, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/15 rounded-xl backdrop-blur-sm border border-white/25 flex items-center justify-center"
              >
                <Activity className="h-6 w-6 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Benefits section */}
      <ContentWrapper className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Why Choose Our Health Insurance?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive healthcare coverage with access to top medical professionals and facilities.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="rounded-full bg-green-100 w-14 h-14 flex items-center justify-center mb-5">
              <Shield className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Complete Coverage</h3>
            <p className="text-gray-600">
              Comprehensive medical coverage including hospitalization, surgeries, and specialist treatments.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="rounded-full bg-green-100 w-14 h-14 flex items-center justify-center mb-5">
              <Stethoscope className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Top Medical Network</h3>
            <p className="text-gray-600">
              Access to a vast network of qualified doctors, specialists, and healthcare facilities.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="rounded-full bg-green-100 w-14 h-14 flex items-center justify-center mb-5">
              <Activity className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Preventive Care</h3>
            <p className="text-gray-600">
              Regular health check-ups, vaccinations, and wellness programs to maintain optimal health.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="rounded-full bg-green-100 w-14 h-14 flex items-center justify-center mb-5">
              <UserPlus className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Family Protection</h3>
            <p className="text-gray-600">
              Comprehensive family plans that cover all members with special benefits for children and seniors.
            </p>
          </motion.div>
        </div>
      </ContentWrapper>
      
      {/* Plans section with filtering/sorting */}
      <div id="plans-section" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-green-600">
                <Heart className="h-3.5 w-3.5 mr-1.5" />
                Health
              </Badge>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{finalFilteredPlans.length} plans available</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Our Health Insurance Plans</h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Choose from our carefully designed health insurance plans to ensure you and your family get the best medical care.
            </p>
          </motion.div>
          
          {/* Search and Filter Controls */}
          <div className="mb-8 flex flex-col lg:flex-row gap-6">
            {/* Search and Sort */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search health insurance plans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {(filters.providers.length > 0 || filters.features.length > 0 || filters.rating > 0) && (
                    <Badge variant="secondary" className="ml-1">
                      {filters.providers.length + filters.features.length + (filters.rating > 0 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </div>
              
              <PlanSort 
                sortOption={sortOption} 
                setSortOption={setSortOption}
                planCount={finalFilteredPlans.length}
              />
            </div>
          </div>

          {/* Filters Sidebar */}
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFiltersChange={setFilters}
            availableProviders={metadata?.providers || []}
            availableFeatures={metadata?.features || []}
            availableTags={metadata?.tags || []}
            category="health"
            priceRange={metadata?.priceRange || [0, 1000]}
            coverageRange={metadata?.coverageRange || [0, 100000]}
            deductibleRange={[0, 1000]}
          />
          
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Error loading plans</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          )}

          {/* Plan listing */}
          {!loading && !error && (
            <>
              <motion.div
                variants={container}
                initial="hidden"
                animate={isLoaded ? "show" : "hidden"}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedPlans.map((plan, index) => (
                  <motion.div
                    key={plan.planId}
                    variants={item}
                    className="h-full"
                  >
                    <PlanCard
                      id={plan.planId}
                      title={plan.name}
                      provider={plan.provider}
                      price={plan.basePrice}
                      description={plan.description}
                      features={plan.features}
                      rating={plan.rating}
                      category="health"
                      onCompareToggle={handleCompareToggle}
                      isSelected={isPlanSelected(plan.planId)}
                      className="h-full border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300"
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <PlanPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                    totalItems={finalFilteredPlans.length}
                  />
                </div>
              )}

              {/* No results state */}
              {finalFilteredPlans.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setFilters({
                      priceRange: [0, 1000],
                      providers: [],
                      coverageAmount: [0, 100000],
                      features: [],
                      rating: 0,
                      deductible: [0, 1000],
                      tags: []
                    });
                  }}>
                    Clear All Filters
                  </Button>
                </motion.div>
              )}
            </>
          )}
          
          {/* Compare plans button */}
          {selectedPlans.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <ComparePageTrigger />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}