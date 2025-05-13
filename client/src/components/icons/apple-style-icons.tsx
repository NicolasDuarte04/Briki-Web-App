import React, { useState, useEffect } from "react";

// Apple-style animation effect for the icon background
const AnimatedBackground: React.FC<{
  gradientId: string;
  color1: string;
  color2: string;
  children: React.ReactNode;
}> = ({ gradientId, color1, color2, children }) => {
  const [pulseSize, setPulseSize] = useState(0);
  
  useEffect(() => {
    // Subtle continuous pulsing effect
    const interval = setInterval(() => {
      setPulseSize((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  const pulseOpacity = Math.sin(pulseSize * 0.0628) * 0.15 + 0.2; // Oscillates between 0.05 and 0.35
  
  return (
    <>
      <defs>
        <radialGradient 
          id={gradientId} 
          cx="50%" 
          cy="50%" 
          r="70%" 
          fx="30%" 
          fy="30%"
        >
          <stop offset="0%" stopColor={color1} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.7" />
        </radialGradient>
        <filter id={`${gradientId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Animating background circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="40" 
        fill={`url(#${gradientId})`} 
        opacity={0.9 + pulseOpacity * 0.1}
      />
      
      {/* Outer glow that animates */}
      <circle 
        cx="50" 
        cy="50" 
        r={42 + pulseOpacity * 3} 
        fill="none" 
        stroke={color1} 
        strokeWidth="0.5" 
        opacity={pulseOpacity}
      />
      
      {children}
    </>
  );
};

// Apple-style Travel Icon (Plane)
export const AppleTravelIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <AnimatedBackground 
        gradientId="apple-travel-gradient"
        color1="#A465F5" 
        color2="#8B5CF6"
      >
        {/* Plane path (Apple-style minimalistic) */}
        <path 
          d="M65,35 L50,50 L65,65 L36,58 L28,50 L36,42 Z" 
          fill="white"
          stroke="white"
          strokeWidth="0.5"
          filter="url(#apple-travel-gradient-glow)"
        />
        
        {/* Circular path indication */}
        <path 
          d="M50,25 A25,25 0 1,1 25,50 A25,25 0 1,1 50,75 A25,25 0 1,1 75,50 A25,25 0 1,1 50,25"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          strokeDasharray="1,3"
          opacity="0.5"
          className="animate-spin"
          style={{ animationDuration: '15s', transformOrigin: 'center' }}
        />
        
        {/* Small glowing dots to represent waypoints */}
        <circle cx="75" cy="50" r="1.5" fill="white" className="animate-ping" style={{ animationDuration: '3s' }} />
        <circle cx="50" cy="25" r="1.5" fill="white" className="animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
        <circle cx="25" cy="50" r="1.5" fill="white" className="animate-ping" style={{ animationDuration: '3s', animationDelay: '2s' }} />
      </AnimatedBackground>
    </svg>
  );
};

// Apple-style Auto Icon (Car)
export const AppleAutoIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <AnimatedBackground 
        gradientId="apple-auto-gradient"
        color1="#5EEAD4" 
        color2="#2DD4BF"
      >
        {/* Car shape (Apple-style minimalistic) */}
        <path 
          d="M30,55 L30,60 L70,60 L70,55 L75,50 L75,45 L70,40 L60,35 L40,35 L30,40 L25,45 L25,50 L30,55 Z" 
          fill="white"
          filter="url(#apple-auto-gradient-glow)"
        />
        
        {/* Windows */}
        <path 
          d="M35,40 L40,40 L40,50 L35,50 Z" 
          fill="#5EEAD4"
          opacity="0.3"
        />
        <path 
          d="M45,40 L55,40 L55,50 L45,50 Z" 
          fill="#5EEAD4"
          opacity="0.3"
        />
        <path 
          d="M60,40 L65,40 L65,50 L60,50 Z" 
          fill="#5EEAD4"
          opacity="0.3"
        />
        
        {/* Wheels */}
        <circle cx="35" cy="60" r="5" fill="#333" />
        <circle cx="35" cy="60" r="2" fill="#555" />
        <circle cx="65" cy="60" r="5" fill="#333" />
        <circle cx="65" cy="60" r="2" fill="#555" />
        
        {/* Road/path beneath the car */}
        <path 
          d="M20,65 L80,65" 
          stroke="white"
          strokeWidth="0.5"
          strokeDasharray="2,2"
          opacity="0.5"
          className="animate-pulse"
        />
      </AnimatedBackground>
    </svg>
  );
};

// Apple-style Pet Icon (Dog)
export const ApplePetIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <AnimatedBackground 
        gradientId="apple-pet-gradient"
        color1="#FDBA74"
        color2="#FB923C"
      >
        {/* Dog face - Apple style simplification */}
        <path 
          d="M35,45 C35,35 45,30 50,30 C55,30 65,35 65,45 C65,55 60,65 50,65 C40,65 35,55 35,45 Z" 
          fill="white"
          filter="url(#apple-pet-gradient-glow)"
        />
        
        {/* Ears */}
        <path 
          d="M30,40 C25,35 25,25 30,20 C35,25 35,35 30,40 Z" 
          fill="white"
          filter="url(#apple-pet-gradient-glow)"
        />
        <path 
          d="M70,40 C75,35 75,25 70,20 C65,25 65,35 70,40 Z" 
          fill="white"
          filter="url(#apple-pet-gradient-glow)"
        />
        
        {/* Eyes */}
        <circle cx="43" cy="45" r="3" fill="#333" />
        <circle cx="57" cy="45" r="3" fill="#333" />
        
        {/* Nose */}
        <circle cx="50" cy="52" r="2.5" fill="#333" />
        
        {/* Animated tail wag */}
        <path 
          d="M65,60 Q70,65 72,70 Q75,75 78,70"
          stroke="white"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
          style={{ transformOrigin: '65px 60px', animationDuration: '2s' }}
        />
      </AnimatedBackground>
    </svg>
  );
};

// Apple-style Health Icon (Heart)
export const AppleHealthIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => {
  const [pulseEffect, setPulseEffect] = useState(0);
  
  useEffect(() => {
    // Heart beat animation effect
    const interval = setInterval(() => {
      setPulseEffect((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  // Mimics a heartbeat pattern with two pulses followed by a pause
  const heartScale = pulseEffect < 25 ? 1 + (pulseEffect / 100) : 
                     pulseEffect < 35 ? 1 + ((35 - pulseEffect) / 50) :
                     pulseEffect < 50 ? 1 + ((pulseEffect - 35) / 75) :
                     pulseEffect < 65 ? 1 + ((65 - pulseEffect) / 50) : 1;
  
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <AnimatedBackground 
        gradientId="apple-health-gradient"
        color1="#F472B6"
        color2="#EC4899"
      >
        {/* Heart shape - Apple style simplified */}
        <g style={{ transform: `scale(${heartScale})`, transformOrigin: 'center' }}>
          <path 
            d="M50,65 C50,65 25,50 25,35 C25,25 35,20 42.5,25 C46,27.5 48,32.5 50,40 C52,32.5 54,27.5 57.5,25 C65,20 75,25 75,35 C75,50 50,65 50,65 Z" 
            fill="white"
            filter="url(#apple-health-gradient-glow)"
          />
        </g>
        
        {/* Pulse line animation */}
        <path 
          d="M20,70 L35,70 L40,60 L45,80 L55,50 L60,70 L80,70"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="100"
          strokeDashoffset={100 - pulseEffect}
          style={{ transition: 'stroke-dashoffset 0.2s ease' }}
        />
      </AnimatedBackground>
    </svg>
  );
};

// Combined Insurance Icon component
export const AppleInsuranceIcon: React.FC<{ 
  type: 'travel' | 'auto' | 'pet' | 'health', 
  className?: string 
}> = ({ type, className }) => {
  switch (type) {
    case 'travel':
      return <AppleTravelIcon className={className} />;
    case 'auto':
      return <AppleAutoIcon className={className} />;
    case 'pet':
      return <ApplePetIcon className={className} />;
    case 'health':
      return <AppleHealthIcon className={className} />;
    default:
      return <AppleTravelIcon className={className} />;
  }
};