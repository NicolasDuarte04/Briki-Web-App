import { motion } from "framer-motion";
import { useEffect } from "react";
import Footer from "@/components/footer";
import { 
  Hero, 
  AiAssistantSection,
  Features, 
  PartnerSection, 
  Testimonials, 
  CTASection 
} from "@/components/landing";
import { FEATURES } from "@/config";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/language-selector";

/**
 * The new dual-audience landing page for Briki
 * Features sections for both B2C and B2B audiences
 */
export default function LandingPage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();

  // Track page view
  useEffect(() => {
    console.log("Landing page viewed");
  }, []);

  // Navigation handler
  const handleGetStarted = () => {
    if (user) {
      navigate("/trip-info");
    } else {
      navigate("/auth");
    }
  };

  // Main scroll animation for when elements come into view
  const fadeInUpVariants = {
    hidden: { 
      opacity: 0, 
      y: 40 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Custom navbar - sticky with backdrop blur */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/60 dark:bg-gray-900/60 shadow transition border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <h1 className="briki-logo text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                  briki
                </h1>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-1 md:space-x-2">
              <Link href="/insurance-plans" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
                {t('travelInsurance')}
              </Link>
              <Link href="/auto-insurance" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
                {t('autoInsurance')}
              </Link>
              <Link href="/pet-insurance" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
                {t('petInsurance')}
              </Link>
              <Link href="/health-insurance" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
                {t('healthInsurance')}
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
                {t('support')}
              </Link>
            </div>
            
            {/* Auth buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate("/company-login")}
                className="hidden sm:flex items-center justify-center px-5 py-2.5 text-sm font-medium text-indigo-700 border border-indigo-300 bg-white hover:bg-indigo-50/80 hover:text-indigo-800 transition-all shadow-sm rounded-md"
              >
                <span>For Insurance Companies</span>
                <span className="ml-2 text-xs opacity-70">→</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={handleGetStarted}
                  className="text-gray-600 hover:text-primary px-4 py-2.5"
                >
                  {t('signIn')}
                </Button>
                <Button 
                  onClick={handleGetStarted}
                  className="px-5 py-2.5 font-medium shadow-sm"
                >
                  {t('signUp')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section - Consumer Section */}
        <Hero />
        
        {/* AI Assistant Section - Highlight New Feature */}
        <AiAssistantSection />
        
        {/* Features Section - Consumer Benefits */}
        <Features />
        
        {/* Partner Section - B2B focused */}
        <PartnerSection />
        
        {/* Testimonials from both consumers and partners */}
        <Testimonials />
        
        {/* CTA with Countdown */}
        {FEATURES.SHOW_COUNTDOWN && <CTASection />}
        
        {/* SEO and Accessibility Enhancements */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpVariants}
          className="py-16 bg-white dark:bg-gray-950"
        >
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto prose dark:prose-invert prose-lg">
              <h2 className="text-center text-3xl font-bold tracking-tight mb-8">
                About Briki Insurance Platform
              </h2>
              <p>
                Briki is a cutting-edge insurance marketplace designed to make insurance accessible, 
                understandable, and tailored to your unique needs. Operating across Colombia and Mexico, 
                our platform uses intelligent technology to compare insurance options across multiple categories, 
                including travel, auto, pet, and health.
              </p>
              <p>
                For consumers, Briki provides a human-centered experience that simplifies the complex world 
                of insurance. Our AI-powered tools analyze your specific needs and preferences to match you 
                with the perfect coverage options, ensuring you're never over or under-insured.
              </p>
              <p>
                For insurance companies and partners, Briki offers a sophisticated distribution channel to 
                connect with qualified customers. Our advanced analytics platform provides valuable market 
                insights while streamlining the process of showcasing your products to the right audience.
              </p>
            </div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
}