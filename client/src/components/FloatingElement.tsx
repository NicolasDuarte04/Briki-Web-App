import { useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import '@/styles/design-system.css';

type FloatingElementProps = {
  children: React.ReactNode;
  amplitude?: number; // Movement amplitude (px)
  duration?: number; // Animation duration (seconds)
  delay?: number; // Animation delay (seconds)
  className?: string;
  rotate?: boolean; // Enable slight rotation
  interactive?: boolean; // Enable mouse interaction
};

const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  amplitude = 15,
  duration = 6,
  delay = 0,
  className = '',
  rotate = false,
  interactive = false,
}) => {
  const controls = useAnimation();
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Motion values for mouse interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    // Start the floating animation
    controls.start({
      y: [0, -amplitude, 0, amplitude, 0],
      x: rotate ? [0, amplitude/2, 0, -amplitude/2, 0] : 0,
      rotate: rotate ? [0, 1, 0, -1, 0] : 0,
      transition: {
        duration,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
        repeat: Infinity,
        delay,
      },
    });
  }, [controls, amplitude, duration, delay, rotate]);

  // Mouse interaction handler
  useEffect(() => {
    if (!interactive || !elementRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const element = elementRef.current;
      if (!element) return;

      // Get element bounds
      const rect = element.getBoundingClientRect();
      
      // Calculate element center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from mouse to center
      const distanceX = (e.clientX - centerX) / 20;
      const distanceY = (e.clientY - centerY) / 20;
      
      // Update motion values with dampening effect
      mouseX.set(distanceX);
      mouseY.set(distanceY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive, mouseX, mouseY]);

  return (
    <motion.div
      ref={elementRef}
      className={`relative ${className}`}
      animate={controls}
      style={interactive ? { x: mouseX, y: mouseY } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement;