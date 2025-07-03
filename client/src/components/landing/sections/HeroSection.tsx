import React from 'react';
import { ScrollSection } from '../ScrollSection';

export const HeroSection: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
  return (
    <ScrollSection id="hero" onViewportEnter={onViewportEnter} className="bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Placeholder Hero Title
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Placeholder hero description text
          </p>
        </div>
      </div>
    </ScrollSection>
  );
}; 