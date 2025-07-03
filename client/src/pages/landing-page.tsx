import React from 'react';
import { LandingScrollLayout } from '../components/layout/LandingScrollLayout';
import {
  HeroSection,
  PDFSummaryAnimation,
  ProductDemoPanel,
  AIExplainer,
  StatsSection,
  TestimonialsSection,
  FinalCTA
} from '../components/landing/sections';

export default function LandingPage() {
  return (
    <LandingScrollLayout>
      <HeroSection />
      <PDFSummaryAnimation />
      <ProductDemoPanel />
      <AIExplainer />
      <StatsSection />
      <TestimonialsSection />
      <FinalCTA />
    </LandingScrollLayout>
  );
}