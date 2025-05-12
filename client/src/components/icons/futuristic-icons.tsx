import React from "react";

export const FuturisticTravelIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="travel-globe-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
      </radialGradient>
      <filter id="travel-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Digital Globe */}
    <circle cx="50" cy="50" r="40" fill="url(#travel-globe-gradient)" />
    <g filter="url(#travel-glow)">
      {/* Longitude/Latitude grid lines */}
      <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" fill="none" />
      <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none" />
      <circle cx="50" cy="50" r="20" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" />
      
      {/* Latitudinal lines */}
      <path d="M10 50 H90" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <path d="M14 30 H86" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <path d="M14 70 H86" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      
      {/* Longitudinal lines */}
      <path d="M50 10 V90" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <path d="M30 14 V86" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <path d="M70 14 V86" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
    </g>
    
    {/* Flight paths */}
    <g className="flight-paths">
      <path 
        d="M30,50 Q50,20 70,30" 
        stroke="#FFFFFF" 
        strokeWidth="1.5" 
        strokeDasharray="2,2" 
        fill="none"
        className="animate-pulse"
      />
      <path 
        d="M25,60 Q50,80 75,60" 
        stroke="#FFFFFF" 
        strokeWidth="1.5" 
        strokeDasharray="2,2" 
        fill="none"
        className="animate-pulse" 
        style={{ animationDelay: "0.5s" }}
      />
      <path 
        d="M40,35 Q50,50 60,35" 
        stroke="#FFFFFF" 
        strokeWidth="1.5" 
        strokeDasharray="2,2" 
        fill="none" 
        className="animate-pulse"
        style={{ animationDelay: "1s" }}
      />
    </g>
    
    {/* Connection points with glowing dots */}
    <circle cx="30" cy="50" r="2" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "3s" }} />
    <circle cx="70" cy="30" r="2" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "3s", animationDelay: "0.5s" }} />
    <circle cx="25" cy="60" r="2" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "3s", animationDelay: "1s" }} />
    <circle cx="75" cy="60" r="2" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "3s", animationDelay: "1.5s" }} />
    <circle cx="40" cy="35" r="2" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "3s", animationDelay: "2s" }} />
    <circle cx="60" cy="35" r="2" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "3s", animationDelay: "2.5s" }} />
  </svg>
);

export const FuturisticAutoIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="auto-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
      <filter id="auto-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Car body with futuristic design */}
    <g filter="url(#auto-glow)">
      {/* Main body */}
      <path 
        d="M15,60 L25,40 C25,40 40,35 60,35 C80,35 85,40 85,40 L90,60 L15,60 Z" 
        fill="url(#auto-body-gradient)" 
      />
      
      {/* Roof */}
      <path 
        d="M30,40 L40,25 C40,25 45,20 60,20 C75,20 70,40 70,40 L30,40 Z" 
        fill="url(#auto-body-gradient)" 
        fillOpacity="0.9"
      />
      
      {/* Windows with data overlay effect */}
      <path 
        d="M32,38 L40,26 L60,26 L68,38 Z" 
        fill="#A7F3D0" 
        fillOpacity="0.7" 
      />
      
      {/* Wheels */}
      <circle cx="30" cy="60" r="10" fill="#111827" />
      <circle cx="30" cy="60" r="6" fill="#374151" />
      <circle cx="30" cy="60" r="2" fill="#111827" />
      
      <circle cx="70" cy="60" r="10" fill="#111827" />
      <circle cx="70" cy="60" r="6" fill="#374151" />
      <circle cx="70" cy="60" r="2" fill="#111827" />
    </g>
    
    {/* Data overlay elements */}
    <g className="data-overlay">
      {/* Speedometer */}
      <circle cx="50" cy="70" r="5" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
      <path d="M50,70 L50,66" stroke="#FFFFFF" strokeWidth="1" />
      
      {/* Data points */}
      <circle cx="35" cy="35" r="1" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s" }} />
      <circle cx="45" cy="30" r="1" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
      <circle cx="55" cy="30" r="1" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s", animationDelay: "1s" }} />
      <circle cx="65" cy="35" r="1" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s", animationDelay: "1.5s" }} />
      
      {/* Scanning effect */}
      <path 
        d="M20,50 H80" 
        stroke="#34D399" 
        strokeWidth="0.5" 
        strokeDasharray="2,2"
        className="animate-pulse" 
      />
      <path 
        d="M20,45 H80" 
        stroke="#34D399" 
        strokeWidth="0.5" 
        strokeDasharray="2,2"
        className="animate-pulse" 
        style={{ animationDelay: "0.3s" }}
      />
      <path 
        d="M20,55 H80" 
        stroke="#34D399" 
        strokeWidth="0.5" 
        strokeDasharray="2,2"
        className="animate-pulse" 
        style={{ animationDelay: "0.6s" }}
      />
    </g>
  </svg>
);

export const FuturisticPetIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="pet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="pet-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Pet profile circle */}
    <circle cx="50" cy="45" r="25" fill="url(#pet-gradient)" filter="url(#pet-glow)" />
    
    {/* Digital pet outline */}
    <g filter="url(#pet-glow)">
      {/* Cat ears */}
      <path d="M35,30 L30,15 L40,25 Z" fill="url(#pet-gradient)" />
      <path d="M65,30 L70,15 L60,25 Z" fill="url(#pet-gradient)" />
      
      {/* Cat face features */}
      <circle cx="42" cy="40" r="3" fill="#FFFFFF" />
      <circle cx="58" cy="40" r="3" fill="#FFFFFF" />
      <circle cx="42" cy="40" r="1.5" fill="#111827" />
      <circle cx="58" cy="40" r="1.5" fill="#111827" />
      <path d="M47,48 C48.5,50 51.5,50 53,48" stroke="#111827" strokeWidth="1.5" fill="none" />
      <ellipse cx="50" cy="45" rx="2" ry="1" fill="#111827" />
    </g>
    
    {/* Health stats circular UI */}
    <circle cx="50" cy="75" r="15" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
    <circle cx="50" cy="75" r="15" stroke="#FBBF24" strokeWidth="2" strokeDasharray="75,100" fill="none" className="animate-pulse" />
    
    {/* Digital data elements */}
    <g className="data-elements">
      {/* Connection lines */}
      <line x1="40" y1="60" x2="40" y2="70" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="2,2" />
      <line x1="50" y1="60" x2="50" y2="70" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="2,2" />
      <line x1="60" y1="60" x2="60" y2="70" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="2,2" />
      
      {/* Data points */}
      <circle cx="40" cy="70" r="2" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s" }} />
      <circle cx="50" cy="70" r="2" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
      <circle cx="60" cy="70" r="2" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s", animationDelay: "1s" }} />
      
      {/* Scanning beam */}
      <path 
        d="M30,45 H70" 
        stroke="#FFFFFF" 
        strokeWidth="0.5" 
        className="animate-pulse" 
      />
    </g>
  </svg>
);

export const FuturisticHealthIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="health-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
      <filter id="health-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Heart rate monitor background */}
    <rect x="20" y="35" width="60" height="30" rx="2" fill="#111827" />
    
    {/* Heart rate line */}
    <path 
      d="M20,50 H35 L40,40 L45,60 L50,45 L55,55 L60,35 L65,50 H80" 
      stroke="url(#health-gradient)" 
      strokeWidth="2"
      filter="url(#health-glow)"
      className="animate-pulse"
    />
    
    {/* Medical cross symbol */}
    <g filter="url(#health-glow)">
      <rect x="45" y="10" width="10" height="25" rx="2" fill="url(#health-gradient)" />
      <rect x="37.5" y="17.5" width="25" height="10" rx="2" fill="url(#health-gradient)" />
    </g>
    
    {/* Health data visualization */}
    <g className="health-data">
      {/* Circular data indicators */}
      <circle cx="30" cy="80" r="7" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
      <circle cx="30" cy="80" r="7" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="35,44" fill="none" />
      
      <circle cx="50" cy="80" r="7" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
      <circle cx="50" cy="80" r="7" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="30,44" fill="none" />
      
      <circle cx="70" cy="80" r="7" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
      <circle cx="70" cy="80" r="7" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="40,44" fill="none" />
    </g>
    
    {/* Data points */}
    <circle cx="25" cy="50" r="1" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s" }} />
    <circle cx="40" cy="40" r="1" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s", animationDelay: "0.3s" }} />
    <circle cx="50" cy="45" r="1" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s", animationDelay: "0.6s" }} />
    <circle cx="60" cy="35" r="1" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s", animationDelay: "0.9s" }} />
    <circle cx="75" cy="50" r="1" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s", animationDelay: "1.2s" }} />
  </svg>
);

// AI Assistant that can be animated
export const AIAssistantIcon: React.FC<{ className?: string, isActive?: boolean }> = ({ 
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
      <radialGradient id="assistant-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="100%" stopColor="#3B82F6" />
      </radialGradient>
      <filter id="assistant-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Robot head */}
    <circle cx="50" cy="40" r="25" fill="url(#assistant-gradient)" filter="url(#assistant-glow)" />
    
    {/* Robot face */}
    <circle cx="40" cy="35" r="5" fill="#FFFFFF" />
    <circle cx="40" cy="35" r="2" fill="#111827" className={isActive ? 'animate-pulse' : ''} />
    
    <circle cx="60" cy="35" r="5" fill="#FFFFFF" />
    <circle cx="60" cy="35" r="2" fill="#111827" className={isActive ? 'animate-pulse' : ''} />
    
    {/* Mouth - changes based on active state */}
    {isActive ? (
      <path d="M40,50 Q50,60 60,50" stroke="#FFFFFF" strokeWidth="2" fill="none" />
    ) : (
      <path d="M40,50 H60" stroke="#FFFFFF" strokeWidth="2" fill="none" />
    )}
    
    {/* Antenna */}
    <line x1="50" y1="15" x2="50" y2="5" stroke="#FFFFFF" strokeWidth="2" />
    <circle cx="50" cy="5" r="3" fill="#FFFFFF" className="animate-ping" />
    
    {/* Digital brain circuits */}
    <path d="M30,30 H40 M60,30 H70" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="2,2" />
    <path d="M35,25 V30 M65,25 V30" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="2,2" />
    
    {/* Body/chat bubble */}
    <path 
      d="M25,70 H75 C80,70 85,65 85,60 V80 C85,85 80,90 75,90 H55 L45,100 L45,90 H25 C20,90 15,85 15,80 V60 C15,65 20,70 25,70 Z" 
      fill="url(#assistant-gradient)" 
      fillOpacity="0.7"
      filter="url(#assistant-glow)" 
    />
    
    {/* Chat bubble text lines */}
    <line x1="30" y1="75" x2="70" y2="75" stroke="#FFFFFF" strokeWidth="1" strokeDasharray={isActive ? "0" : "3,3"} />
    <line x1="30" y1="80" x2="60" y2="80" stroke="#FFFFFF" strokeWidth="1" strokeDasharray={isActive ? "0" : "3,3"} />
    <line x1="30" y1="85" x2="50" y2="85" stroke="#FFFFFF" strokeWidth="1" strokeDasharray={isActive ? "0" : "3,3"} />
  </svg>
);

// Futuristic background with animated particles
export const FuturisticBackground: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    className={`${className} absolute top-0 left-0 -z-10`}
    viewBox="0 0 1000 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="bg-gradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.3" />
      </radialGradient>
    </defs>
    
    {/* Background */}
    <rect width="1000" height="500" fill="url(#bg-gradient)" />
    
    {/* Grid lines */}
    <g className="grid-lines" stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="0.5">
      <line x1="0" y1="100" x2="1000" y2="100" />
      <line x1="0" y1="200" x2="1000" y2="200" />
      <line x1="0" y1="300" x2="1000" y2="300" />
      <line x1="0" y1="400" x2="1000" y2="400" />
      
      <line x1="100" y1="0" x2="100" y2="500" />
      <line x1="200" y1="0" x2="200" y2="500" />
      <line x1="300" y1="0" x2="300" y2="500" />
      <line x1="400" y1="0" x2="400" y2="500" />
      <line x1="500" y1="0" x2="500" y2="500" />
      <line x1="600" y1="0" x2="600" y2="500" />
      <line x1="700" y1="0" x2="700" y2="500" />
      <line x1="800" y1="0" x2="800" y2="500" />
      <line x1="900" y1="0" x2="900" y2="500" />
    </g>
    
    {/* Particles/dots */}
    <g className="particles">
      <circle cx="100" cy="100" r="2" fill="#FFFFFF" fillOpacity="0.7" className="animate-ping" style={{ animationDuration: "4s" }} />
      <circle cx="300" cy="150" r="2" fill="#FFFFFF" fillOpacity="0.7" className="animate-ping" style={{ animationDuration: "6s", animationDelay: "0.5s" }} />
      <circle cx="700" cy="120" r="2" fill="#FFFFFF" fillOpacity="0.7" className="animate-ping" style={{ animationDuration: "5s", animationDelay: "1s" }} />
      <circle cx="850" cy="200" r="2" fill="#FFFFFF" fillOpacity="0.7" className="animate-ping" style={{ animationDuration: "7s", animationDelay: "1.5s" }} />
      <circle cx="200" cy="300" r="2" fill="#FFFFFF" fillOpacity="0.7" className="animate-ping" style={{ animationDuration: "4.5s", animationDelay: "2s" }} />
      <circle cx="500" cy="250" r="2" fill="#FFFFFF" fillOpacity="0.7" className="animate-ping" style={{ animationDuration: "5.5s", animationDelay: "2.5s" }} />
      <circle cx="600" cy="350" r="2" fill="#FFFFFF" fillOpacity="0.7" className="animate-ping" style={{ animationDuration: "6.5s", animationDelay: "3s" }} />
      <circle cx="400" cy="400" r="2" fill="#FFFFFF" fillOpacity="0.7" className="animate-ping" style={{ animationDuration: "5.2s", animationDelay: "3.5s" }} />
      <circle cx="800" cy="380" r="2" fill="#FFFFFF" fillOpacity="0.7" className="animate-ping" style={{ animationDuration: "4.8s", animationDelay: "4s" }} />
      <circle cx="150" cy="420" r="2" fill="#FFFFFF" fillOpacity="0.7" className="animate-ping" style={{ animationDuration: "6.3s", animationDelay: "4.5s" }} />
    </g>
    
    {/* Floating data elements */}
    <g className="data-elements">
      <rect x="100" y="150" width="60" height="20" rx="4" fill="#3B82F6" fillOpacity="0.2" className="animate-pulse" style={{ animationDuration: "3s" }} />
      <rect x="700" y="200" width="40" height="15" rx="4" fill="#3B82F6" fillOpacity="0.2" className="animate-pulse" style={{ animationDuration: "4s", animationDelay: "1s" }} />
      <rect x="400" y="350" width="50" height="18" rx="4" fill="#3B82F6" fillOpacity="0.2" className="animate-pulse" style={{ animationDuration: "3.5s", animationDelay: "2s" }} />
      
      <circle cx="600" cy="150" r="15" fill="#10B981" fillOpacity="0.2" className="animate-pulse" style={{ animationDuration: "4s" }} />
      <circle cx="300" cy="300" r="12" fill="#F59E0B" fillOpacity="0.2" className="animate-pulse" style={{ animationDuration: "3s", animationDelay: "1.5s" }} />
      <circle cx="750" cy="400" r="10" fill="#EF4444" fillOpacity="0.2" className="animate-pulse" style={{ animationDuration: "5s", animationDelay: "0.5s" }} />
    </g>
  </svg>
);