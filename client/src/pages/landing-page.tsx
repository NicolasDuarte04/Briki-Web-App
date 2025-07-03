import { 
  HeroSection, 
  PDFSummaryAnimation, 
  ProductDemoPanel, 
  AIExplainer, 
  StatsSection, 
  TestimonialsSection, 
  FinalCTA 
} from "../components/landing";
import { LandingScrollLayout } from "../components/layout";
import { PublicLayout } from "../components/layout/public-layout";

/**
 * Landing Page Component
 * 
 * The main entry point for the Briki platform, featuring a scroll-based modular layout:
 * - Hero section with main value proposition
 * - PDF/Document analysis feature showcase
 * - Interactive product demo panel
 * - AI technology explainer
 * - Statistics and social proof
 * - Customer testimonials
 * - Final call-to-action
 * 
 * This redesigned page introduces Briki's features and vision step-by-step
 * as users scroll, providing an engaging and informative experience.
 */
export default function LandingPage() {
  const sectionIds = [
    'hero',
    'pdf-analysis',
    'product-demo',
    'ai-explainer',
    'stats',
    'testimonials',
    'final-cta'
  ];

  const sections = [
    <HeroSection />,
    <PDFSummaryAnimation />,
    <ProductDemoPanel />,
    <AIExplainer />,
    <StatsSection />,
    <TestimonialsSection />,
    <FinalCTA />
  ];

  return (
    <PublicLayout>
      <main className="flex-grow">
        <LandingScrollLayout sectionIds={sectionIds}>
          {sections}
        </LandingScrollLayout>
      </main>
    </PublicLayout>
  );
}