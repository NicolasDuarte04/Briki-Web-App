import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ScrollSection {
  id: string;
  component: React.ReactNode;
  inView: boolean;
}

interface LandingScrollLayoutProps {
  children: React.ReactNode[];
  sectionIds: string[];
}

export const LandingScrollLayout: React.FC<LandingScrollLayoutProps> = ({
  children,
  sectionIds
}) => {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || '');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Create intersection observers for each section
  const sectionRefs = sectionIds.map((id) => {
    const { ref, inView } = useInView({
      threshold: 0.3, // Section is considered active when 30% visible
      rootMargin: '-10% 0px -10% 0px'
    });

    useEffect(() => {
      if (inView) {
        setActiveSection(id);
      }
    }, [inView, id]);

    return { id, ref, inView };
  });

  return (
    <div className="relative">
      {/* Optional: Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 z-50"
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1 }}
      />

      {/* Sections */}
      {children.map((child, index) => {
        const sectionRef = sectionRefs[index];
        return (
          <motion.section
            key={sectionIds[index]}
            ref={sectionRef?.ref}
            id={sectionIds[index]}
            className="min-h-screen relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {child}
          </motion.section>
        );
      })}

      {/* Optional: Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/70 text-white p-2 rounded text-xs z-50">
          <div>Active: {activeSection}</div>
          <div>Progress: {Math.round(scrollProgress)}%</div>
        </div>
      )}
    </div>
  );
}; 