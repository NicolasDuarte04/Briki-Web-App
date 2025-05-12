import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { Route, Switch, useLocation } from "wouter";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}

export function FadeIn({ children, className = "", duration = 0.5, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
  distance?: number;
}

export function SlideIn({
  children,
  className = "",
  direction = "up",
  duration = 0.5,
  delay = 0,
  distance = 20,
}: SlideInProps) {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  const initial = directionMap[direction];

  return (
    <motion.div
      className={className}
      initial={{ ...initial, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}

export function ScaleIn({
  children,
  className = "",
  duration = 0.5,
  delay = 0,
}: ScaleInProps) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerChildren({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerChildrenProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        return (
          <motion.div variants={item}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

interface LoaderProps {
  className?: string;
  size?: number;
}

export function Loader({ className = "", size = 40 }: LoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className="rounded-full border-2 border-primary border-t-transparent"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function BrikiLoader({ className = "", size = 40 }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        initial={{ opacity: 0.6, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotateY: [0, 180, 360],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <div className="flex items-center justify-center text-primary font-bold text-xl tracking-widest">
          BRIKI
        </div>
      </motion.div>
      <motion.div
        className="mt-2 rounded-full h-1 bg-primary"
        style={{ width: size }}
        initial={{ width: 0 }}
        animate={{ width: size }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

// Page transition component for route animations
interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          duration: 0.3 
        }}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}