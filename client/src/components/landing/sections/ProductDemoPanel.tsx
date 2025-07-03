import React from 'react';
import { ScrollSection } from '../ScrollSection';

export const ProductDemoPanel: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
  return (
    <ScrollSection id="product-demo" onViewportEnter={onViewportEnter}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Product Demo Placeholder
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Interactive product demonstration placeholder text
            </p>
          </div>
          <div className="bg-muted rounded-lg p-8 h-96">
            {/* Placeholder for interactive demo */}
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Interactive Demo Placeholder
            </div>
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}; 