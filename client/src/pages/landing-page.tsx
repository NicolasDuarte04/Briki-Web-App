import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, Shield, Zap } from "lucide-react";
import AiAssistantSection from "@/components/landing/AiAssistantSection";
import Features from "@/components/landing/Features";
import PartnerSection from "@/components/landing/PartnerSection";
import Testimonials from "@/components/landing/Testimonials";
import AboutSection from "@/components/landing/AboutSection";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent } from "@/components/ui/card";

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
        <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Find Your Perfect Coverage?
              </h2>
              <p className="text-xl text-white/90 mb-10">
                Join thousands of Colombians who've simplified their insurance journey with Briki
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate('/ask-briki-ai')}
                  className="h-14 px-8 text-base bg-white text-blue-600 hover:bg-gray-100"
                >
                  Start with AI Assistant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/home')}
                  className="h-14 px-8 text-base bg-transparent text-white border-white hover:bg-white/10"
                >
                  Browse Insurance Plans
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>50,000+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span>4.8/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span>Instant Quotes</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}