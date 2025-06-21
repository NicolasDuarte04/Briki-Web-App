import { motion } from "framer-motion";
import { ArrowRight, PieChart, LineChart, BarChart3, Database } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Section, AnimatedBlob } from "@/components/ui/section";

/**
 * The insurance partner section for the B2B audience
 */
export default function PartnerSection() {
  const [, navigate] = useLocation();

  const handlePartnerClick = () => {
    navigate('/company-login');
  };

  const partnerFeatures = [
    {
      icon: Database,
      title: "AI-Driven Analytics",
      description: "Leverage cutting-edge AI to understand market trends and customer needs."
    },
    {
      icon: LineChart,
      title: "Growth Opportunities",
      description: "Tap into new customer segments through our global marketplace."
    },
    {
      icon: PieChart,
      title: "Customizable Dashboard",
      description: "Monitor performance with real-time insights and reporting tools."
    },
    {
      icon: BarChart3,
      title: "Enhanced Visibility",
      description: "Showcase your products to qualified, high-intent insurance shoppers."
    }
  ];

  return (
    <Section 
      background="gradient-reverse" 
      divider="wave" 
      className="py-20 md:py-32 relative"
    >
      {/* Subtle animated blobs for depth */}
      <AnimatedBlob 
        className="top-20 right-10 opacity-30" 
        color="primary" 
        size="medium" 
        delay={0} 
      />
      <AnimatedBlob 
        className="bottom-10 left-20 opacity-20" 
        color="cyan" 
        size="large" 
        delay={3} 
      />
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          <motion.div 
            className="flex-1 max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">For Insurance Companies:</span> 
              <span className="block mt-2">Supercharge Your Distribution</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Join Colombia and Mexico's most advanced insurance marketplace. Briki's AI-powered platform connects you directly with qualified customers seeking your exact offerings.
            </p>
            
            <Button 
              size="lg" 
              onClick={handlePartnerClick}
              className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-primary-foreground shadow-lg"
            >
              Partner With Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {partnerFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              >
                <Card className="group h-full p-6 text-left bg-background/80 backdrop-blur-sm hover:bg-background/95 hover:border-primary/30 hover:shadow-xl transition-all transform hover:-translate-y-2">
                  <div className="rounded-xl bg-gradient-to-br from-primary/20 to-cyan-400/20 text-primary w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}