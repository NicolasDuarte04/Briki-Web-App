import React from 'react';
import { ScrollSection } from '../ScrollSection';

export const PDFSummaryAnimation: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
  return (
    <ScrollSection id="pdf-summary" onViewportEnter={onViewportEnter} className="bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            PDF Summary Placeholder
          </h2>
          <div className="w-full max-w-2xl mx-auto h-96 bg-background/50 rounded-lg shadow-lg">
            {/* Placeholder for PDF animation */}
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              PDF Animation Placeholder
            </div>
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}; 