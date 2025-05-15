import { PlanCard } from "@/components/plans/PlanCard";
import { healthPlans } from "@/components/plans/mockPlans";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, Shield, Activity, ArrowRight, BadgeCheck } from "lucide-react";

export default function HealthInsurancePage() {
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
      navigate(`/insurance/health/compare?plans=${planIdsParam}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#003087] via-[#0052aa] to-[#0074FF] z-0"
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
              Health Coverage for Every Stage of Life
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Find the right health insurance plan for you and your family with comprehensive coverage
              options that protect what matters most - your health and wellbeing.
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
                onClick={() => navigate("/insurance/health/learn-more")}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Key Benefits */}
      <section className="py-16 bg-gray-50 relative z-10 mt-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Why Choose Briki Health Insurance?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive health coverage options with exceptional service and support.
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
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Extensive Coverage</h3>
              <p className="text-muted-foreground">
                Comprehensive medical coverage including hospitalization, emergency care, and specialist consultations.
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
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Preventive Care</h3>
              <p className="text-muted-foreground">
                Focus on wellness with included preventive services, annual checkups, and health screenings.
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
              <h3 className="text-xl font-bold mb-2">Family Coverage</h3>
              <p className="text-muted-foreground">
                Flexible family plans that provide coverage for every member, with options for children and dependents.
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
              Our Health Insurance Plans
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of health insurance options designed to provide comprehensive coverage for you and your family.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthPlans.map((plan, index) => (
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
                  category="health"
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
      
      {/* FAQ or CTA Section */}
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
              Take Control of Your Health
            </h2>
            <p className="text-muted-foreground mb-8">
              Your health is your most valuable asset. Protect it with comprehensive health insurance 
              that provides access to quality healthcare when you need it most.
            </p>
            <Button 
              size="lg" 
              onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-medium"
            >
              Get Coverage
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}