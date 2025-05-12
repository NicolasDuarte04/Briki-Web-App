import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  location: string;
}

/**
 * PageTransition - A component that adds smooth transitions between route changes
 * 
 * This component uses framer-motion to create a smooth fade/slide effect when
 * navigating between different pages in the application.
 * 
 * @param {React.ReactNode} children - The content to be rendered with transition effects
 * @param {string} location - The current location/route path used as the transition key
 */
export function PageTransition({ children, location }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

/**
 * FadeIn - A component that animates its children with a fade-in effect
 * 
 * @param {React.ReactNode} children - The content to fade in
 * @param {number} duration - Animation duration in seconds (default: 0.5)
 * @param {number} delay - Delay before animation starts in seconds (default: 0)
 * @param {string} className - Additional CSS classes
 */
export function FadeIn({ 
  children, 
  duration = 0.5, 
  delay = 0,
  className = ""
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
}

/**
 * SlideIn - A component that animates its children with a slide-in effect
 * 
 * @param {React.ReactNode} children - The content to slide in
 * @param {string} direction - Direction to slide from (default: 'up')
 * @param {number} duration - Animation duration in seconds (default: 0.5)
 * @param {number} delay - Delay before animation starts in seconds (default: 0)
 * @param {number} distance - Distance to slide in pixels (default: 50)
 * @param {string} className - Additional CSS classes
 */
export function SlideIn({ 
  children, 
  direction = 'up', 
  duration = 0.5, 
  delay = 0,
  distance = 50,
  className = ""
}: SlideInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -distance, y: 0 };
      case 'right': return { x: distance, y: 0 };
      case 'up': return { x: 0, y: -distance };
      case 'down': return { x: 0, y: distance };
      default: return { x: 0, y: -distance };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  containerDelay?: number;
  containerDuration?: number;
  className?: string;
}

/**
 * StaggerChildren - A component that staggers the animation of its child elements
 * 
 * @param {React.ReactNode} children - React elements to stagger
 * @param {number} staggerDelay - Delay between each child animation (default: 0.1)
 * @param {number} containerDelay - Delay before the container starts animating (default: 0)
 * @param {number} containerDuration - Container animation duration (default: 0.3)
 * @param {string} className - Additional CSS classes
 */
export function StaggerChildren({ 
  children, 
  staggerDelay = 0.1, 
  containerDelay = 0,
  containerDuration = 0.3,
  className = ""
}: StaggerChildrenProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: containerDuration, delay: containerDelay }}
      className={className}
    >
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: containerDelay + (index * staggerDelay) }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}