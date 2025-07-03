import React from 'react';
import { ScrollSection } from '../ScrollSection';

export const StatsSection: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
  return (
    <ScrollSection id="stats" onViewportEnter={onViewportEnter}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { label: 'Users', value: '10K+' },
            { label: 'Documents Processed', value: '100K+' },
            { label: 'Time Saved', value: '1M+ Hours' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-6xl font-bold mb-2">{stat.value}</div>
              <div className="text-lg text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}; 