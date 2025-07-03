import React from 'react';
import { ScrollSection } from '../ScrollSection';

export const TestimonialsSection: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
  return (
    <ScrollSection id="testimonials" onViewportEnter={onViewportEnter} className="bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-background p-6 rounded-lg shadow-sm">
              <div className="mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-muted-foreground mb-4">
                "Testimonial placeholder text that showcases the value of our platform."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-muted mr-3" />
                <div>
                  <div className="font-semibold">User Name</div>
                  <div className="text-sm text-muted-foreground">Company</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}; 