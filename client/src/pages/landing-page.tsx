import { motion } from "framer-motion";
import { useEffect } from "react";
import { 
  Hero, 
  AiAssistantSection,
  Features, 
  PartnerSection, 
  Testimonials, 
  CTASection 
} from "@/components/landing";
import { FEATURES } from "@/config";
import { PublicLayout } from "@/components/layout/public-layout";

/**
 * The new dual-audience landing page for Briki
 * Features sections for both B2C and B2B audiences
 */
export default function LandingPage() {
  // Track page view
  useEffect(() => {
    console.log("Landing page viewed");
  }, []);

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
    <PublicLayout>
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
    </PublicLayout>
  );
}