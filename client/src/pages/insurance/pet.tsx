import { PlanCard } from "@/components/plans/PlanCard";
import { petPlans } from "@/components/plans/mockPlans";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, Shield, ArrowRight } from "lucide-react";

export default function PetInsurancePage() {
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
      navigate(`/insurance/pet/compare?plans=${planIdsParam}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#0052aa] via-[#0062cc] to-[#33BFFF] z-0"
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
              Coverage for Your Furry Family
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Protect your pets with comprehensive insurance plans that cover veterinary care,
              emergency treatment, and more for your beloved companions.
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
                onClick={() => navigate("/insurance/pet/learn-more")}
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
              Why Choose Briki Pet Insurance?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive pet healthcare coverage to keep your furry friends protected and healthy.
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
              Our Pet Insurance Plans
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of pet insurance options designed to keep your furry family members protected.
            </p>
          </motion.div>
          
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
      
      {/* Pet Owner Testimonial or CTA Section */}
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
              Give Your Pets the Protection They Deserve
            </h2>
            <p className="text-muted-foreground mb-8">
              Your pets are family members too. Ensure they receive the best care possible with our 
              comprehensive pet insurance plans designed by pet lovers for pet lovers.
            </p>
            <Button 
              size="lg" 
              onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-medium"
            >
              Protect Your Pet
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}