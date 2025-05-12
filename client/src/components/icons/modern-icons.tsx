import React from "react";

export const TravelIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="travel-gradient" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    
    {/* Background circle */}
    <circle cx="50" cy="50" r="40" fill="url(#travel-gradient)" />
    
    {/* Airplane */}
    <path 
      d="M65,42.5 L45,32.5 L42.5,35 L55,45 L42.5,50 L35,45 L32.5,47.5 L40,55 L30,60 L32.5,62.5 L65,55 L75,52.5 L75,45 L65,42.5 Z" 
      fill="white" 
    />

    {/* Flight path - simplified */}
    <path 
      d="M25,65 Q50,40 75,65" 
      stroke="rgba(255,255,255,0.7)" 
      strokeWidth="1.5" 
      strokeDasharray="2,2" 
      fill="none"
      className="animate-pulse"
    />
  </svg>
);

export const AutoIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="auto-gradient" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>
    
    {/* Background circle */}
    <circle cx="50" cy="50" r="40" fill="url(#auto-gradient)" />
    
    {/* Car silhouette - simple, modern style */}
    <path 
      d="M25,55 L30,40 C30,40 35,35 50,35 C65,35 70,40 70,40 L75,55 L25,55 Z" 
      fill="white" 
    />
    
    {/* Windows */}
    <path 
      d="M35,40 L40,35 L60,35 L65,40 Z" 
      fill="rgba(255,255,255,0.3)" 
    />
    
    {/* Wheels */}
    <circle cx="35" cy="55" r="7" fill="#111827" />
    <circle cx="35" cy="55" r="3" fill="white" />
    
    <circle cx="65" cy="55" r="7" fill="#111827" />
    <circle cx="65" cy="55" r="3" fill="white" />
    
    {/* Headlights - animated */}
    <circle cx="30" cy="45" r="2" fill="white" className="animate-pulse" />
    <circle cx="70" cy="45" r="2" fill="white" className="animate-pulse" />
  </svg>
);

export const PetIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="pet-gradient" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    
    {/* Background circle */}
    <circle cx="50" cy="50" r="40" fill="url(#pet-gradient)" />
    
    {/* Paw print */}
    <circle cx="40" cy="40" r="8" fill="white" />
    <circle cx="60" cy="40" r="8" fill="white" />
    <circle cx="35" cy="58" r="8" fill="white" />
    <circle cx="50" cy="65" r="8" fill="white" />
    <circle cx="65" cy="58" r="8" fill="white" />
    
    {/* Center pad */}
    <circle cx="50" cy="50" r="12" fill="white" className="animate-pulse" style={{ animationDuration: "3s" }} />
    
    {/* Subtle heart */}
    <path 
      d="M46,50 C46,48 44,46 42,46 C40,46 38,48 38,50 C38,52 40,54 50,60 C60,54 62,52 62,50 C62,48 60,46 58,46 C56,46 54,48 54,50" 
      fill="rgba(239,68,68,0.6)" 
    />
  </svg>
);

export const HealthIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="health-gradient" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    
    {/* Background circle */}
    <circle cx="50" cy="50" r="40" fill="url(#health-gradient)" />
    
    {/* Heart shape */}
    <path 
      d="M50,70 C50,70 30,55 30,40 C30,35 35,30 40,30 C45,30 50,35 50,40 C50,35 55,30 60,30 C65,30 70,35 70,40 C70,55 50,70 50,70 Z" 
      fill="white" 
      className="animate-pulse" 
      style={{ animationDuration: "2s" }}
    />
    
    {/* Heartbeat line */}
    <path 
      d="M30,50 L40,50 L43,40 L50,60 L55,30 L60,50 L70,50" 
      stroke="white" 
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// AI Assistant with Apple-inspired design
export const ModernAIAssistantIcon: React.FC<{ className?: string, isActive?: boolean }> = ({ 
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
      <linearGradient id="assistant-modern-gradient" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    
    {/* Background circle */}
    <circle cx="50" cy="50" r="40" fill="url(#assistant-modern-gradient)" />
    
    {/* Chat bubble */}
    <rect x="30" y="35" width="40" height="30" rx="15" fill="white" />
    
    {/* Speech connector */}
    <path d="M40,65 L35,75 L50,65" fill="white" />
    
    {/* Text lines */}
    <rect x="37" y="43" width="26" height="2" rx="1" fill="#3B82F6" className={isActive ? 'animate-pulse' : ''} />
    <rect x="37" y="48" width="20" height="2" rx="1" fill="#3B82F6" className={isActive ? 'animate-pulse' : ''} />
    <rect x="37" y="53" width="15" height="2" rx="1" fill="#3B82F6" className={isActive ? 'animate-pulse' : ''} />
  </svg>
);