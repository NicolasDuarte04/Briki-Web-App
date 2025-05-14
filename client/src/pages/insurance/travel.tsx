import { MainLayout } from "@/components/layout";
import { PlanCard } from "@/components/plans/PlanCard";
import { travelPlans } from "@/components/plans/mockPlans";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plane, Shield, Globe, ArrowRight, BadgeCheck } from "lucide-react";

export default function TravelInsurancePage() {
  const [, navigate] = useLocation();
  const [selectedPlanIds, setSelectedPlanIds] = useState<(string | number)[]>([]);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleCompareToggle = (id: string | number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPlanIds([...selectedPlanIds, id]);
    } else {
      setSelectedPlanIds(selectedPlanIds.filter(planId => planId !== id));
    }
  };
  
  const handleComparePlans = () => {
    if (selectedPlanIds.length > 1) {
      const planIdsParam = selectedPlanIds.join(',');
      navigate(`/insurance/travel/compare?plans=${planIdsParam}`);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary"
          style={{ 
            backgroundImage: "url('/assets/briki-hero-pattern.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            opacity: 0.9
          }}
        />
        
        <div className="container relative z-10 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl text-center sm:text-left mx-auto sm:mx-0"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Travel with Peace of Mind
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Protect your journey with comprehensive travel insurance plans tailored to your needs.
              From emergency medical coverage to trip cancellation, we've got you covered.
            </p>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <Button 
                size="lg" 
                onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-medium"
              >
                View Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white hover:bg-white/90 text-primary border-white hover:text-primary font-medium"
                onClick={() => navigate("/insurance/travel/learn-more")}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Key Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Why Choose Briki Travel Insurance?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer flexible and comprehensive travel insurance plans that provide coverage for
              unexpected events during your trip.
            </p>
          </motion.div>
          
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
        </div>
      </section>
      
      {/* Plans Section */}
      <section id="plans-section" className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Our Travel Insurance Plans
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of travel insurance plans designed to provide the right coverage for your journey.
            </p>
          </motion.div>
          
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
                onClick={handleComparePlans}
                className="font-medium"
              >
                Compare Selected Plans ({selectedPlanIds.length})
              </Button>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* FAQ or Additional Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to Protect Your Journey?
            </h2>
            <p className="text-muted-foreground mb-8">
              Get the travel protection you need in just a few minutes. Our simplified process 
              makes it easy to find the right coverage for your trip.
            </p>
            <Button 
              size="lg" 
              onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-medium"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}