import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Star, Users, Shield, Zap } from "lucide-react";
import AiAssistantSection from "../components/landing/AiAssistantSection";
import Features from "../components/landing/Features";
import PartnerSection from "../components/landing/PartnerSection";
import Testimonials from "../components/landing/Testimonials";
import AboutSection from "../components/landing/AboutSection";
import { PublicLayout } from "../components/layout/public-layout";
import { Card, CardContent } from "../components/ui/card";

/**
 * Landing Page Component
 * 
 * The main entry point for the Briki platform, showcasing:
 * - Hero section with AI Assistant preview
 * - Key features and benefits
 * - Partner integrations
 * - Customer testimonials
 * - About section with company information
 * 
 * This page serves as the primary marketing and onboarding interface
 * for new users discovering the Briki insurance platform.
 */
export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <PublicLayout>
      <main className="flex-grow">
        {/* Hero Section with AI Assistant */}
        <AiAssistantSection />
        
        {/* Features Section */}
        <Features />
        
        {/* Partners Section */}
        <PartnerSection />
        
        {/* Testimonials */}
        <Testimonials />
        
        {/* About Section */}
        <AboutSection />
        
        {/* CTA Section with gradient background */}
        <section id="cta" className="py-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5" />
          {/* Additional decoration */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 -right-48 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                Ready to Find Your Perfect Coverage?
              </h2>
              <p className="text-xl text-white/90 mb-12 leading-relaxed">
                Join thousands of Colombians who've simplified their insurance journey with <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">briki</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button 
                    size="lg" 
                    variant="secondary"
                    onClick={() => navigate('/ask-briki-ai')}
                    className="h-14 px-8 text-base bg-white text-blue-600 hover:bg-gray-50 hover:shadow-xl hover:shadow-white/20 font-semibold group"
                  >
                    Start with AI Assistant
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/home')}
                    className="h-14 px-8 text-base bg-transparent text-white border-2 border-white/50 hover:bg-white/10 hover:border-white font-medium"
                  >
                    Browse Insurance Plans
                  </Button>
                </motion.div>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-16 flex flex-wrap justify-center gap-12 text-white/90">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>
                  <span className="text-lg">Secure & Private</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-lg">50,000+ Users</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center">
                    <Star className="h-5 w-5" />
                  </div>
                  <span className="text-lg">4.8/5 Rating</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center">
                    <Zap className="h-5 w-5" />
                  </div>
                  <span className="text-lg">Instant Quotes</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}