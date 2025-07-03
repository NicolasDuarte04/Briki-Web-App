import React from 'react';
import { ScrollSection } from '../ScrollSection';
import { Button } from '../../ui/button';

export const FinalCTA: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
  return (
    <ScrollSection id="cta" onViewportEnter={onViewportEnter} className="bg-gradient-to-t from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who are already saving time with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="min-w-[200px]">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px]">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}; 