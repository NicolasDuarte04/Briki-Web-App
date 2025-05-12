import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Spring animation properties similar to Apple's animations
const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};

// Fade in animation with subtle scaling
export const FadeScale: React.FC<{
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}> = ({ children, duration = 0.3, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ ...springConfig, delay }}
  >
    {children}
  </motion.div>
);

// Slide up animation like iOS cards
export const SlideUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 20, opacity: 0 }}
    transition={{ ...springConfig, delay }}
  >
    {children}
  </motion.div>
);

// Card hover effect similar to macOS UI
export const CardHover: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.02 : 1,
        y: isHovered ? -4 : 0,
        boxShadow: isHovered 
          ? "0 10px 30px -10px rgba(0,0,0,0.2)" 
          : "0 2px 5px rgba(0,0,0,0.05)",
      }}
      transition={springConfig}
      className="rounded-xl overflow-hidden"
    >
      {children}
    </motion.div>
  );
};

// Staggered list animation for multiple items
export const StaggeredList: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
}> = ({ children, staggerDelay = 0.05 }) => {
  const childArray = React.Children.toArray(children);
  
  return (
    <AnimatePresence>
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ 
            ...springConfig, 
            delay: index * staggerDelay 
          }}
        >
          {child}
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

// Parallax scroll effect for headers
export const ParallaxHeader: React.FC<{
  children: React.ReactNode;
  height: number;
  scrollFactor?: number;
}> = ({ children, height, scrollFactor = 0.5 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div 
      ref={ref} 
      style={{ 
        height: `${height}px`, 
        position: "relative",
        overflow: "hidden" 
      }}
    >
      <motion.div
        style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          y: scrollY * scrollFactor,
          height: `${height + (height * scrollFactor)}px`,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Focus spotlight effect
export const FocusSpotlight: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };
  
  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden"
      initial={{ background: "none" }}
      animate={{
        background: isHovered 
          ? `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1), transparent)`
          : "none"
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};