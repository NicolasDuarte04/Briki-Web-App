import { ArrowRight, Shield, Sparkles, Zap } from 'lucide-react';
import { GradientButton, GradientCard, SectionContainer } from '@/components/ui';
import { PublicLayout } from '@/components/layout/public-layout';

export default function DesignSystemDemo() {
  return (
    <PublicLayout>
      {/* Hero Section - Dark variant with grid decoration */}
      <SectionContainer variant="dark" decoration="grid">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Briki Design System
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Foundational components for consistent visual design
          </p>
        </div>
      </SectionContainer>

      {/* Gradient Buttons Section */}
      <SectionContainer variant="light" decoration="dots">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Gradient Buttons</h2>
          
          <div className="space-y-8">
            {/* Primary Buttons */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Primary Variant</h3>
              <div className="flex flex-wrap gap-4">
                <GradientButton size="base">
                  Base Button
                </GradientButton>
                <GradientButton size="lg">
                  Large Button
                </GradientButton>
                <GradientButton size="base" icon={<ArrowRight className="h-4 w-4" />}>
                  With Icon
                </GradientButton>
                <GradientButton size="base" icon={<Shield className="h-4 w-4" />} iconPosition="left">
                  Icon Left
                </GradientButton>
                <GradientButton size="base" loading>
                  Loading State
                </GradientButton>
                <GradientButton size="base" disabled>
                  Disabled
                </GradientButton>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Secondary Variant</h3>
              <div className="flex flex-wrap gap-4">
                <GradientButton variant="secondary" size="base">
                  Secondary Button
                </GradientButton>
                <GradientButton variant="secondary" size="lg" icon={<Sparkles className="h-5 w-5" />}>
                  Large Secondary
                </GradientButton>
                <GradientButton variant="secondary" size="base" loading>
                  Loading
                </GradientButton>
              </div>
            </div>

            {/* Outline Buttons (for dark backgrounds) */}
            <div className="bg-gradient-to-r from-[#0077B6] to-[#00C7C4] p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4 text-white">Outline Variant</h3>
              <div className="flex flex-wrap gap-4">
                <GradientButton variant="outline" size="base">
                  Outline Button
                </GradientButton>
                <GradientButton variant="outline" size="lg" icon={<Zap className="h-5 w-5" />}>
                  Large Outline
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Gradient Cards Section */}
      <SectionContainer variant="gradient" decoration="circles">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Gradient Cards</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Default Card */}
            <GradientCard variant="default">
              <h3 className="text-xl font-semibold mb-3">Default Card</h3>
              <p className="text-gray-600">
                Basic glassmorphic card with subtle hover effects and border styling.
              </p>
            </GradientCard>

            {/* Elevated Card */}
            <GradientCard variant="elevated">
              <h3 className="text-xl font-semibold mb-3">Elevated Card</h3>
              <p className="text-gray-600">
                Enhanced shadow and lift effect on hover for important content.
              </p>
            </GradientCard>

            {/* Outline Card */}
            <GradientCard variant="outline">
              <h3 className="text-xl font-semibold mb-3">Outline Card</h3>
              <p className="text-gray-600">
                Gradient border effect with lighter background for variety.
              </p>
            </GradientCard>
          </div>

          {/* Card with Header and Footer */}
          <div className="mt-8 max-w-2xl mx-auto">
            <GradientCard
              variant="elevated"
              header={
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Card with Slots</h3>
                  <Shield className="h-5 w-5 text-[#0077B6]" />
                </div>
              }
              footer={
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Last updated: Today</span>
                  <GradientButton size="base">
                    Action
                  </GradientButton>
                </div>
              }
            >
              <p className="text-gray-600">
                This card demonstrates the header and footer slots, perfect for structured content
                with actions and metadata.
              </p>
            </GradientCard>
          </div>

          {/* No hover effect example */}
          <div className="mt-8 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <GradientCard hoverEffect={false}>
              <h3 className="text-lg font-semibold mb-2">No Hover Effect</h3>
              <p className="text-gray-600 text-sm">
                For static content that doesn't need interaction feedback.
              </p>
            </GradientCard>

            <GradientCard glassEffect={false} variant="elevated">
              <h3 className="text-lg font-semibold mb-2">No Glass Effect</h3>
              <p className="text-gray-600 text-sm">
                Solid background without backdrop blur for better readability.
              </p>
            </GradientCard>
          </div>
        </div>
      </SectionContainer>

      {/* Section Container Variants */}
      <SectionContainer variant="default">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Section Containers</h2>
          <p className="text-lg text-gray-600">
            This is a default section container with standard padding and no decorations.
            Perfect for clean, simple content sections.
          </p>
        </div>
      </SectionContainer>

      {/* Footer - Dark variant with custom decoration */}
      <SectionContainer 
        variant="dark" 
        customDecoration={
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        }
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Use These Components?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            All components are built with TypeScript, Tailwind CSS, and Framer Motion
            for type safety, consistent styling, and smooth animations.
          </p>
          <GradientButton variant="outline" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
            Start Building
          </GradientButton>
        </div>
      </SectionContainer>
    </PublicLayout>
  );
} 