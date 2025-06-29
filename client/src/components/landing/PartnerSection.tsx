import { motion } from "framer-motion";
import { ArrowRight, PieChart, LineChart, BarChart3, Database } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <section id="partners" className="py-32 bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden scroll-mt-20">
      {/* Subtle background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        {/* Mesh pattern for texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <motion.div 
            className="flex-1 max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 font-bold">For Insurance Companies</span>
              <span className="block mt-3 text-white">Supercharge Your Distribution</span>
            </h2>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Join Colombia and Mexico's most advanced insurance marketplace. Briki's AI-powered platform connects you directly with qualified customers seeking your exact offerings.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button 
                size="lg" 
                onClick={handlePartnerClick}
                className="h-14 px-8 text-base bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-xl hover:shadow-blue-600/25 transition-all duration-300 font-semibold group"
              >
                Partner With Us
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
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
                <Card className="group h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/15 hover:shadow-2xl hover:shadow-blue-600/20 hover:scale-[1.02] hover:border-white/30 transition-all duration-300 overflow-hidden">
                  <CardHeader className="p-6">
                    <div className="rounded-xl w-12 h-12 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:from-blue-600/30 group-hover:to-cyan-500/30 transition-all duration-300">
                      <feature.icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <CardDescription className="text-base leading-relaxed text-white/70">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}