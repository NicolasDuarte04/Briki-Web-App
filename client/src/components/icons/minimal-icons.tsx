import React from "react";

export const MinimalTravelIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="travel-gradient" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
      <filter id="travel-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
      </filter>
    </defs>
    
    {/* Circular background */}
    <circle cx="50" cy="50" r="40" fill="url(#travel-gradient)" opacity="0.9" filter="url(#travel-shadow)" />
    
    {/* Simplified globe grid lines */}
    <g stroke="white" strokeOpacity="0.7" strokeWidth="0.75">
      <circle cx="50" cy="50" r="30" fill="none" />
      <path d="M20,50 H80" />
      <path d="M50,20 V80" />
    </g>
    
    {/* Airplane */}
    <g transform="translate(35, 35) rotate(45)" filter="url(#travel-shadow)">
      <path
        d="M0,0 L25,0 L30,5 L25,10 L0,10 L5,5 Z"
        fill="white"
      />
    </g>
    
    {/* Subtle animated flight path */}
    <path 
      d="M30,60 Q50,35 70,60" 
      stroke="white" 
      strokeWidth="1" 
      strokeDasharray="2,2" 
      fill="none"
      className="animate-pulse"
    />
  </svg>
);

export const MinimalAutoIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="auto-gradient" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0EA5E9" />
      </linearGradient>
      <filter id="auto-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
      </filter>
    </defs>
    
    {/* Circular background */}
    <circle cx="50" cy="50" r="40" fill="url(#auto-gradient)" opacity="0.9" filter="url(#auto-shadow)" />
    
    {/* Simplified car */}
    <g fill="white">
      {/* Car body */}
      <path 
        d="M25,55 L30,40 C30,40 40,37 50,37 C60,37 70,40 70,40 L75,55 L25,55 Z"
        filter="url(#auto-shadow)" 
      />
      
      {/* Wheels */}
      <circle cx="35" cy="55" r="7" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.2)" />
      <circle cx="65" cy="55" r="7" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.2)" />
      
      {/* Windows */}
      <path 
        d="M35,40 L40,30 H60 L65,40 Z" 
        fill="rgba(255,255,255,0.5)" 
      />
    </g>
    
    {/* Subtle animation */}
    <path
      d="M30,65 H70"
      stroke="white"
      strokeWidth="0.75"
      strokeDasharray="2,2"
      className="animate-pulse"
    />
  </svg>
);

export const MinimalPetIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="pet-gradient" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#2DD4BF" />
      </linearGradient>
      <filter id="pet-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
      </filter>
    </defs>
    
    {/* Circular background */}
    <circle cx="50" cy="50" r="40" fill="url(#pet-gradient)" opacity="0.9" filter="url(#pet-shadow)" />
    
    {/* Simplified pet silhouette */}
    <g fill="white" filter="url(#pet-shadow)">
      {/* Cat head */}
      <circle cx="50" cy="50" r="20" />
      
      {/* Ears */}
      <path d="M36,38 L30,25 L42,32 Z" />
      <path d="M64,38 L70,25 L58,32 Z" />
      
      {/* Eyes */}
      <circle cx="42" cy="45" r="3" fill="url(#pet-gradient)" />
      <circle cx="58" cy="45" r="3" fill="url(#pet-gradient)" />
      
      {/* Nose */}
      <path d="M47,55 H53 L50,58 Z" fill="url(#pet-gradient)" />
    </g>
    
    {/* Subtle animation */}
    <circle 
      cx="50" 
      cy="70" 
      r="5" 
      stroke="white" 
      strokeWidth="1" 
      fill="none" 
      className="animate-ping" 
      style={{ animationDuration: "3s" }} 
    />
  </svg>
);

export const MinimalHealthIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="health-gradient" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="100%" stopColor="#A78BFA" />
      </linearGradient>
      <filter id="health-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
      </filter>
    </defs>
    
    {/* Circular background */}
    <circle cx="50" cy="50" r="40" fill="url(#health-gradient)" opacity="0.9" filter="url(#health-shadow)" />
    
    {/* Medical cross */}
    <g fill="white" filter="url(#health-shadow)">
      <rect x="40" y="25" width="20" height="50" rx="3" />
      <rect x="25" y="40" width="50" height="20" rx="3" />
    </g>
    
    {/* Heartbeat line */}
    <path
      d="M30,65 L40,65 L45,55 L50,75 L55,55 L60,65 L70,65"
      stroke="white"
      strokeWidth="2"
      fill="none"
      className="animate-pulse"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MinimalAIAssistantIcon: React.FC<{ className?: string, isActive?: boolean }> = ({ 
  className = "w-10 h-10", 
  isActive = false 
}) => (
  <svg
    className={`${className} ${isActive ? 'animate-pulse' : ''}`}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="assistant-gradient" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
      <filter id="assistant-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
      </filter>
    </defs>
    
    {/* Chat bubble */}
    <path 
      d="M85,45 C85,65.33 67.33,82 47,82 L40,90 L40,82 C19.67,82 2,65.33 2,45 C2,24.67 19.67,8 40,8 H47 C67.33,8 85,24.67 85,45 Z" 
      fill="url(#assistant-gradient)"
      opacity="0.9"
      filter="url(#assistant-shadow)"
    />
    
    {/* Simplified chat interface */}
    <g stroke="white" strokeWidth="2" strokeLinecap="round">
      <line x1="25" y1="35" x2="62" y2="35" />
      <line x1="25" y1="45" x2="62" y2="45" />
      <line x1="25" y1="55" x2="50" y2="55" />
    </g>
    
    {/* Animated dot */}
    <circle 
      cx="65" 
      cy="55" 
      r="3" 
      fill="white" 
      className={isActive ? "animate-ping" : ""} 
      style={{ animationDuration: "1.5s" }} 
    />
  </svg>
);