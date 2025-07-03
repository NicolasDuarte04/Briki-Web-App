import React from 'react';
import { ScrollSection } from '../ScrollSection';

export const AIExplainer: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
  return (
    <ScrollSection id="ai-explainer" onViewportEnter={onViewportEnter} className="bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">
            AI Capabilities Placeholder
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Feature {i}</h3>
                <p className="text-muted-foreground">
                  AI feature description placeholder text
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}; 