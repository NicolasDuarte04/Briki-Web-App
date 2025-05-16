import { PlanCard } from "@/components/plans/PlanCard";
import { travelPlans } from "@/components/plans/mockPlans";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Plane, Shield, Globe, ArrowRight, BadgeCheck } from "lucide-react";
import { HeroWrapper, ContentWrapper } from "@/components/layout";
import { useCompareStore } from "@/store/compare-store";
import { ComparePageTrigger } from "@/components/compare-page-trigger";
import { useToast } from "@/hooks/use-toast";

export default function TravelInsurancePage() {
  const [, navigate] = useLocation();
  const { selectedPlans, addPlan, removePlan, isPlanSelected } = useCompareStore();
  const { toast } = useToast();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleCompareToggle = (id: string | number, isSelected: boolean) => {
    if (isSelected) {
      // Check if we're at the maximum number of plans
      if (selectedPlans.length >= 4) {
        toast({
          title: "Máximo de planes alcanzado",
          description: "Puedes comparar un máximo de 4 planes a la vez.",
          variant: "destructive"
        });
        return;
      }
      
      addPlan({ id, category: 'travel' });
      
      // Show a toast when a plan is added
      toast({
        title: "Plan añadido para comparar",
        description: `${selectedPlans.length + 1} planes seleccionados.`
      });
    } else {
      removePlan(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeroWrapper
        title="Travel with Peace of Mind"
        description="Protect your journey with comprehensive travel insurance plans tailored to your needs. From emergency medical coverage to trip cancellation, we've got you covered."
        gradientFrom="primary/90"
        gradientVia="primary/80"
        gradientTo="primary"
        primaryButtonLabel="View Plans"
        secondaryButtonLabel="Learn More"
        secondaryButtonLink="/insurance/travel/learn-more"
      />
      
      <ContentWrapper
        title="Why Choose Briki Travel Insurance?"
        description="We offer flexible and comprehensive travel insurance plans that provide coverage for unexpected events during your trip."
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
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
            <p className="text-muted-foreground">
              Comprehensive worldwide coverage with 24/7 emergency assistance and support in multiple languages.
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
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Complete Protection</h3>
            <p className="text-muted-foreground">
              Medical emergencies, trip cancellations, lost baggage, and other unexpected situations all covered.
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
            <h3 className="text-xl font-bold mb-2">Easy Claims Process</h3>
            <p className="text-muted-foreground">
              Simple, fast claims with digital submission and quick processing for approved claims.
            </p>
          </motion.div>
        </div>
      </ContentWrapper>
      
      <ContentWrapper
        id="plans-section"
        title="Our Travel Insurance Plans"
        description="Choose from our range of travel insurance plans designed to provide the right coverage for your journey."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelPlans.map((plan, index) => (
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
                category="travel"
                onCompareToggle={handleCompareToggle}
              />
            </motion.div>
          ))}
        </div>
        
        {selectedPlanIds.length > 1 && (
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
        title="Ready to Protect Your Journey?"
        description="Get the travel protection you need in just a few minutes. Our simplified process makes it easy to find the right coverage for your trip."
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
    </div>
  );
}