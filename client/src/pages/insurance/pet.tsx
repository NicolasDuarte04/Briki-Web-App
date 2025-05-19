import { PlanCard } from "@/components/plans/PlanCard";
import { petPlans } from "@/components/plans/mockPlans";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Heart, Shield, ArrowRight } from "lucide-react";
import { HeroWrapper, ContentWrapper } from "@/components/layout";
import { useCompareStore } from "@/store/compare-store";
import { ComparePageTrigger } from "@/components/compare-page-trigger";
import { useToast } from "@/hooks/use-toast";

export default function PetInsurancePage() {
  const [, navigate] = useLocation();
  const { selectedPlans, addPlan, removePlan, isPlanSelected } = useCompareStore();
  const { toast } = useToast();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
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

  return (
    <div className="min-h-screen flex flex-col">
      <HeroWrapper
        title="Coverage for Your Furry Family"
        description="Protect your pets with comprehensive insurance plans that cover veterinary care, emergency treatment, and more for your beloved companions."
        gradientFrom="[#0052aa]"
        gradientVia="[#0062cc]"
        gradientTo="[#33BFFF]"
        primaryButtonLabel="View Plans"
        secondaryButtonLabel="Learn More"
        secondaryButtonLink="/insurance/pet/learn-more"
      />
      
      <ContentWrapper
        title="Why Choose Briki Pet Insurance?"
        description="We provide comprehensive pet healthcare coverage to keep your furry friends protected and healthy."
        variant="gray"
        className="mt-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-xl border shadow-sm"
          >
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Comprehensive Coverage</h3>
            <p className="text-muted-foreground">
              Full coverage for accidents, illnesses, surgeries, and routine checkups for your pets.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-xl border shadow-sm"
          >
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Multi-Pet Discounts</h3>
            <p className="text-muted-foreground">
              Save on premiums when you insure multiple pets under the same policy, making protection affordable.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-xl border shadow-sm"
          >
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Wellness Benefits</h3>
            <p className="text-muted-foreground">
              Preventive care coverage including vaccinations, dental cleanings, and annual checkups.
            </p>
          </motion.div>
        </div>
      </ContentWrapper>
      
      <ContentWrapper
        id="plans-section"
        title="Our Pet Insurance Plans"
        description="Choose from our range of pet insurance options designed to keep your furry family members protected."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {petPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
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
              />
            </motion.div>
          ))}
        </div>
        
        {selectedPlans.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-center"
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/compare-plans')}
              className="font-medium"
              disabled={selectedPlans.length < 2}
            >
              Compare Selected Plans ({selectedPlans.length})
            </Button>
          </motion.div>
        )}
      </ContentWrapper>
      
      <ContentWrapper
        title="Give Your Pets the Protection They Deserve"
        description="Your pets are family members too. Ensure they receive the best care possible with our comprehensive pet insurance plans designed by pet lovers for pet lovers."
        variant="gray"
      >
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-medium"
          >
            Protect Your Pet
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </ContentWrapper>
      
      {/* Floating Compare Trigger */}
      <ComparePageTrigger />
    </div>
  );
}