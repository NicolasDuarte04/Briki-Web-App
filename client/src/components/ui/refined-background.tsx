import React from "react";

export const RefinedBackground: React.FC<{ 
  className?: string, 
  particleCount?: number 
}> = ({ 
  className = "absolute inset-0 -z-10 overflow-hidden", 
  particleCount = 40 
}) => {
  // Create particles array based on count
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    // Generate random positions
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 3 + 1;
    const opacity = Math.random() * 0.15 + 0.05;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    
    return (
      <circle 
        key={i}
        cx={`${x}%`} 
        cy={`${y}%`} 
        r={size} 
        fill="#FFFFFF" 
        opacity={opacity}
        className="animate-pulse" 
        style={{ 
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`
        }}
      />
    );
  });
  
  return (
    <div className={className}>
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="refined-bg-gradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.2" />
          </radialGradient>
          <linearGradient id="refined-glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Subtle gradient background */}
        <rect width="100" height="100" fill="url(#refined-bg-gradient)" />
        
        {/* Chrome-like accents */}
        <ellipse 
          cx="50" 
          cy="10" 
          rx="70" 
          ry="40" 
          fill="url(#refined-glow-gradient)" 
          opacity="0.2"
        />
        <ellipse 
          cx="80" 
          cy="70" 
          rx="40" 
          ry="30" 
          fill="url(#refined-glow-gradient)" 
          opacity="0.1"
        />
        
        {/* Subtle grid lines */}
        <g stroke="#3B82F6" strokeOpacity="0.1" strokeWidth="0.2">
          {/* Horizontal lines */}
          <line x1="0" y1="20" x2="100" y2="20" />
          <line x1="0" y1="40" x2="100" y2="40" />
          <line x1="0" y1="60" x2="100" y2="60" />
          <line x1="0" y1="80" x2="100" y2="80" />
          
          {/* Vertical lines */}
          <line x1="20" y1="0" x2="20" y2="100" />
          <line x1="40" y1="0" x2="40" y2="100" />
          <line x1="60" y1="0" x2="60" y2="100" />
          <line x1="80" y1="0" x2="80" y2="100" />
        </g>
        
        {/* Particles */}
        {particles}
      </svg>
    </div>
  );
};