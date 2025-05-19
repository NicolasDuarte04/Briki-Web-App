import { PlanCard } from "@/components/plans/PlanCard";
import { autoPlans } from "@/components/plans/mockPlans";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Car, Shield, Clock, ArrowRight, BadgeCheck } from "lucide-react";
import { HeroWrapper, ContentWrapper } from "@/components/layout";
import { useCompareStore } from "@/store/compare-store";
import { ComparePageTrigger } from "@/components/compare-page-trigger";
import { useToast } from "@/hooks/use-toast";

export default function AutoInsurancePage() {
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
      const planToAdd = autoPlans.find(p => p.id === id);
      if (!planToAdd) return;
      
      // Try to add the plan to comparison
      const added = addPlan({
        ...planToAdd,
        category: 'auto'
      });
      
      // If adding failed, check why
      if (!added) {
        // Check if we're trying to mix categories
        const selectedCategories = [...new Set(selectedPlans.map(p => p.category))];
        if (selectedCategories.length > 0 && !selectedCategories.includes('auto')) {
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
        description: `${selectedPlans.length + 1} auto insurance plans selected.`
      });
    } else {
      removePlan(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeroWrapper
        title="Protect Your Vehicle with Confidence"
        description="Find the perfect auto insurance plan that offers comprehensive coverage, competitive rates, and peace of mind on the road."
        gradientFrom="[#003087]"
        gradientVia="[#0052aa]"
        gradientTo="[#0074FF]"
        primaryButtonLabel="View Plans"
        secondaryButtonLabel="Learn More"
        secondaryButtonLink="/insurance/auto/learn-more"
      />
      
      <ContentWrapper
        title="Why Choose Briki Auto Insurance?"
        description="We provide tailored auto insurance solutions with exceptional coverage and support."
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
              Full protection against accidents, theft, natural disasters, and third-party liability.
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
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quick Claim Processing</h3>
            <p className="text-muted-foreground">
              Fast and efficient claims handling with minimal paperwork and rapid approvals.
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
              <BadgeCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">24/7 Roadside Assistance</h3>
            <p className="text-muted-foreground">
              Around-the-clock assistance for breakdowns, towing, battery jump-starts, and more.
            </p>
          </motion.div>
        </div>
      </ContentWrapper>
      
      <ContentWrapper
        id="plans-section"
        title="Our Auto Insurance Plans"
        description="Choose from our carefully designed auto insurance plans to find the perfect coverage for your vehicle."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {autoPlans.map((plan, index) => (
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
                category="auto"
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
        title="Drive with Peace of Mind"
        description="Get comprehensive auto insurance coverage today and protect yourself against unexpected expenses. Our simplified process makes it easy to find the right plan for your needs."
        variant="gray"
      >
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-medium"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </ContentWrapper>
      
      {/* Floating Compare Trigger */}
      <ComparePageTrigger />
    </div>
  );
}