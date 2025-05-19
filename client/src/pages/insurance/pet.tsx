import { PlanCard } from "@/components/plans/PlanCard";
import { petPlans } from "@/components/plans/mockPlans";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, Shield, ArrowRight, BadgeCheck, Search, PawPrint, Syringe, Wallet } from "lucide-react";
import { HeroWrapper, ContentWrapper } from "@/components/layout";
import { useCompareStore } from "@/store/compare-store";
import { ComparePageTrigger } from "@/components/compare-page-trigger";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GradientButton from "@/components/gradient-button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function PetInsurancePage() {
  const [, navigate] = useLocation();
  const { selectedPlans, addPlan, removePlan, isPlanSelected } = useCompareStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recommended");
  const [isLoaded, setIsLoaded] = useState(false);
  
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
      // Find the full plan data from our mock data
      const planToAdd = petPlans.find(p => p.id === id);
      if (!planToAdd) return;
      
      // Try to add the plan to comparison
      const added = addPlan({
        ...planToAdd,
        category: 'pet'
      });
      
      // If adding failed, check why
      if (!added) {
        // Check if we're trying to mix categories
        const selectedCategories = [...new Set(selectedPlans.map(p => p.category))];
        if (selectedCategories.length > 0 && !selectedCategories.includes('pet')) {
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
        description: `${selectedPlans.length + 1} pet insurance plans selected.`
      });
    } else {
      removePlan(id);
    }
  };
  
  // Filter plans based on search query
  const filteredPlans = petPlans.filter(plan => 
    plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort plans based on selected option
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    if (sortOption === "price-low") {
      return a.price - b.price;
    } else if (sortOption === "price-high") {
      return b.price - a.price;
    } else if (sortOption === "rating") {
      return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
    }
    // Default recommended sorting (no change to order)
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero section with modern gradient */}
      <div className="w-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
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
                <PawPrint className="h-3.5 w-3.5 mr-1.5" />
                Pet Insurance
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Compare Pet Insurance Plans
              </h1>
              <p className="text-lg opacity-90 mb-6">
                Protect your furry family members with comprehensive insurance plans that cover veterinary care, emergency treatment, and more for your beloved companions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="font-medium bg-white text-blue-600 hover:bg-white/90"
                >
                  Compare Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-medium border-white/30 text-white hover:bg-white/10"
                  onClick={() => navigate('/insurance/pet/quote')}
                >
                  Tell Us About Your Pet
                </Button>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative w-72 h-72 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
                <PawPrint className="w-40 h-40 text-white/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/40 to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Trust indicators */}
      <div className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center md:justify-between items-center gap-8 text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Accident Coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <Syringe className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Veterinary Care</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Multi-Pet Discounts</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Trusted Providers</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Features section with enhanced styling */}
      <ContentWrapper
        title="Why Choose Briki Pet Insurance?"
        description="We provide comprehensive pet healthcare coverage to keep your furry friends protected and healthy."
        variant="white"
        className="pt-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="rounded-full bg-blue-100 w-14 h-14 flex items-center justify-center mb-5">
              <Shield className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Comprehensive Coverage</h3>
            <p className="text-gray-600">
              Full coverage for accidents, illnesses, surgeries, and routine checkups for your pets.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="rounded-full bg-blue-100 w-14 h-14 flex items-center justify-center mb-5">
              <Wallet className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Multi-Pet Discounts</h3>
            <p className="text-gray-600">
              Save on premiums when you insure multiple pets under the same policy, making protection affordable.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="rounded-full bg-blue-100 w-14 h-14 flex items-center justify-center mb-5">
              <Heart className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Wellness Benefits</h3>
            <p className="text-gray-600">
              Preventive care coverage including vaccinations, dental cleanings, and annual checkups.
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
              <Badge className="bg-blue-600">
                <PawPrint className="h-3.5 w-3.5 mr-1.5" />
                Pet
              </Badge>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{sortedPlans.length} plans available</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Our Pet Insurance Plans</h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Choose from our range of pet insurance options designed to keep your furry family members protected.
            </p>
          </motion.div>
          
          {/* Filter/sort controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search plans..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <Select
                      value={sortOption}
                      onValueChange={setSortOption}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Plan listing */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                variants={item}
                className="h-full"
              >
                <PlanCard
                  id={plan.id}
                  title={plan.title}
                  provider={plan.provider}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  badge={plan.badge}
                  rating={plan.rating}
                  category="pet"
                  onCompareToggle={handleCompareToggle}
                  isSelected={isPlanSelected(plan.id)}
                  className="h-full border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
          
          {/* No results state */}
          {sortedPlans.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria.</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </motion.div>
          )}
          
          {/* Compare plans button */}
          {selectedPlans.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 flex justify-center"
            >
              <GradientButton 
                size="lg" 
                onClick={() => navigate('/compare-plans')}
                className="font-medium shadow-md"
                gradientFrom="from-blue-600"
                gradientTo="to-cyan-500"
                disabled={selectedPlans.length < 2}
              >
                Compare Selected Plans ({selectedPlans.length})
              </GradientButton>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Give Your Pets the Protection They Deserve</h2>
            <p className="text-lg opacity-90 mb-8">
              Your pets are family members too. Ensure they receive the best care possible with our comprehensive pet insurance plans designed by pet lovers for pet lovers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-medium bg-white text-blue-600 hover:bg-white/90"
              >
                View All Plans
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="font-medium border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate('/get-quote')}
              >
                Get Personalized Quote
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Floating Compare Trigger */}
      <ComparePageTrigger />
    </div>
  );
}