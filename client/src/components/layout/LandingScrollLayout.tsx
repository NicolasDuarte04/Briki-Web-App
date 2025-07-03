import React, { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';

interface ScrollSection {
  id: string;
  inView: boolean;
}

export const LandingScrollLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { scrollY } = useScroll();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [progress, setProgress] = useState(0);

  // Update scroll progress
  useEffect(() => {
    return scrollY.onChange((latest) => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      setProgress(Math.min(latest / maxScroll, 1));
    });
  }, [scrollY]);

  return (
    <div className="relative min-h-screen">
      {/* Optional: Progress indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: progress }}
      />
      
      {/* Main content container */}
      <div className="relative">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              onViewportEnter: () => {
                const id = child.props.id || '';
                setActiveSection(id);
              }
            });
          }
          return child;
        })}
      </div>

      {/* Optional: Navigation dots */}
      <nav className="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-2 z-50 hidden lg:block">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const id = child.props.id || '';
            return (
              <button
                key={id}
                onClick={() => {
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeSection === id ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Scroll to ${id} section`}
              />
            );
          }
        })}
      </nav>
    </div>
  );
}; 