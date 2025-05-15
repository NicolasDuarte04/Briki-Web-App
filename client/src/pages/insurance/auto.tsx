import { PlanCard } from "@/components/plans/PlanCard";
import { autoPlans } from "@/components/plans/mockPlans";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Car, Shield, Clock, ArrowRight, BadgeCheck } from "lucide-react";

export default function AutoInsurancePage() {
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
      navigate(`/insurance/auto/compare?plans=${planIdsParam}`);
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
              Protect Your Vehicle with Confidence
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Find the perfect auto insurance plan that offers comprehensive coverage, competitive rates, 
              and peace of mind on the road.
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
                onClick={() => navigate("/insurance/auto/learn-more")}
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
              Why Choose Briki Auto Insurance?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide tailored auto insurance solutions with exceptional coverage and support.
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
              Our Auto Insurance Plans
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our carefully designed auto insurance plans to find the perfect coverage for your vehicle.
            </p>
          </motion.div>
          
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
      
      {/* CTA Section */}
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
              Drive with Peace of Mind
            </h2>
            <p className="text-muted-foreground mb-8">
              Get comprehensive auto insurance coverage today and protect yourself against unexpected 
              expenses. Our simplified process makes it easy to find the right plan for your needs.
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
    </div>
  );
}