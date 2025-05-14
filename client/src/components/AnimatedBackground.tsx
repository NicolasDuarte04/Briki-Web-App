import React from 'react';
import { motion } from 'framer-motion';
import '@/styles/design-system.css';

// Gradient orb component used in the background
const GradientOrb = ({ 
  size = 400, 
  color = 'from-blue-400 to-indigo-500', 
  initialPosition = { x: 0, y: 0 },
  animate = true,
  animationProps = {},
  opacity = 0.2,
  zIndex = -10,
}: { 
  size?: number; 
  color?: string; 
  initialPosition?: { x: number; y: number };
  animate?: boolean;
  animationProps?: any;
  opacity?: number;
  zIndex?: number;
}) => {
  return (
    <motion.div
      className={`absolute blur-3xl rounded-full opacity-${opacity * 100} bg-gradient-to-br ${color}`}
      style={{ 
        width: size, 
        height: size, 
        zIndex,
        ...initialPosition
      }}
      initial={animate ? { x: initialPosition.x, y: initialPosition.y } : undefined}
      animate={animate ? {
        x: [initialPosition.x - 20, initialPosition.x + 20, initialPosition.x - 20],
        y: [initialPosition.y - 20, initialPosition.y + 20, initialPosition.y - 20],
        ...animationProps
      } : undefined}
      transition={animate ? {
        duration: 8 + Math.random() * 5, // Random duration for variety
        repeat: Infinity,
        ease: "easeInOut",
      } : undefined}
    />
  );
};

const AnimatedBackground = ({ density = 'medium' }: { density?: 'low' | 'medium' | 'high' }) => {
  // Define how many orbs to show based on density
  const orbCount = {
    low: 3,
    medium: 5,
    high: 8
  }[density];
  
  // Pre-defined orb configurations for consistent layout
  const orbConfigs = [
    { size: 700, color: 'from-blue-300/30 to-indigo-300/30', position: { x: '10%', y: '10%' } },
    { size: 600, color: 'from-sky-400/20 to-cyan-300/20', position: { x: '70%', y: '15%' } },
    { size: 550, color: 'from-violet-400/20 to-purple-300/20', position: { x: '20%', y: '60%' } },
    { size: 600, color: 'from-blue-400/20 to-teal-300/20', position: { x: '80%', y: '60%' } },
    { size: 500, color: 'from-indigo-300/20 to-blue-200/20', position: { x: '40%', y: '30%' } },
    { size: 450, color: 'from-teal-300/30 to-sky-400/30', position: { x: '60%', y: '80%' } },
    { size: 400, color: 'from-purple-300/20 to-pink-300/20', position: { x: '5%', y: '75%' } },
    { size: 480, color: 'from-cyan-300/20 to-blue-300/20', position: { x: '90%', y: '90%' } },
  ].slice(0, orbCount);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Overlay for gradient texture */}
      <div className="absolute inset-0 z-[-5] noise-texture opacity-[0.03]" />
      
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/50 to-blue-100/30 z-[-20]" />
      
      {/* Gradient orbs */}
      {orbConfigs.map((config, index) => (
        <div 
          key={index}
          className="absolute" 
          style={{ 
            left: config.position.x, 
            top: config.position.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <GradientOrb
            size={config.size}
            color={config.color}
            initialPosition={{ x: 0, y: 0 }}
            animate={true}
            opacity={0.4}
          />
        </div>
      ))}
    </div>
  );
};

export default AnimatedBackground;