import React from "react";

export const RefinedTravelIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="refined-travel-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
      </linearGradient>
      <filter id="refined-travel-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Modern Globe */}
    <circle cx="50" cy="50" r="40" fill="url(#refined-travel-gradient)" opacity="0.9" />
    
    {/* Subtle grid lines */}
    <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none">
      <circle cx="50" cy="50" r="38" />
      <circle cx="50" cy="50" r="30" />
      <circle cx="50" cy="50" r="20" />
      
      {/* Latitudinal lines */}
      <path d="M10 50 H90" />
      <path d="M14 30 H86" />
      <path d="M14 70 H86" />
      
      {/* Longitudinal lines */}
      <path d="M50 10 V90" />
      <path d="M30 14 V86" />
      <path d="M70 14 V86" />
    </g>
    
    {/* Airplane with subtle animation */}
    <g filter="url(#refined-travel-glow)" className="animate-float" style={{ 
      animationDuration: '6s', 
      transformOrigin: 'center',
      animationTimingFunction: 'ease-in-out'
    }}>
      <path 
        d="M55,30 L70,25 L67,28 L72,30 L67,32 L70,35 L55,30 Z" 
        fill="#FFFFFF" 
      />
      <path 
        d="M35,60 L50,55 L47,58 L52,60 L47,62 L50,65 L35,60 Z" 
        fill="#FFFFFF" 
        opacity="0.7"
      />
    </g>
    
    {/* Flight paths - more subtle */}
    <g stroke="#FFFFFF" strokeOpacity="0.4" fill="none">
      <path 
        d="M30,50 Q50,20 70,30" 
        strokeWidth="1" 
        strokeDasharray="3,3" 
        className="animate-pulse" 
        style={{ animationDuration: '4s' }}
      />
      <path 
        d="M25,60 Q50,80 75,60" 
        strokeWidth="1" 
        strokeDasharray="3,3" 
        className="animate-pulse" 
        style={{ animationDuration: '4s', animationDelay: "2s" }}
      />
    </g>
    
    {/* Connection points with subtle glow */}
    <circle cx="30" cy="50" r="1.5" fill="#FFFFFF" opacity="0.7" />
    <circle cx="70" cy="30" r="1.5" fill="#FFFFFF" opacity="0.7" />
    <circle cx="25" cy="60" r="1.5" fill="#FFFFFF" opacity="0.7" />
    <circle cx="75" cy="60" r="1.5" fill="#FFFFFF" opacity="0.7" />
  </svg>
);

export const RefinedAutoIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="refined-auto-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
      <filter id="refined-auto-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Modern car shape - sleeker design */}
    <g filter="url(#refined-auto-glow)">
      {/* Main body with subtle chrome effect */}
      <path 
        d="M15,60 C15,60 17,50 25,45 C33,40 40,38 50,38 C60,38 67,40 75,45 C83,50 85,60 85,60 L90,60 C90,65 90,65 85,65 L85,70 C85,70 75,70 75,65 L25,65 C25,70 15,70 15,65 L15,60 Z" 
        fill="url(#refined-auto-gradient)" 
      />
      
      {/* Windows with chrome finish */}
      <path 
        d="M35,45 L65,45 C65,45 63,40 50,40 C37,40 35,45 35,45 Z" 
        fill="#D1FAE5" 
        fillOpacity="0.7" 
      />
      
      {/* Refined wheels */}
      <g opacity="0.9">
        <circle cx="30" cy="65" r="8" fill="#1F2937" />
        <circle cx="30" cy="65" r="5" fill="#374151" />
        <circle cx="30" cy="65" r="2" fill="#1F2937" />
        
        <circle cx="70" cy="65" r="8" fill="#1F2937" />
        <circle cx="70" cy="65" r="5" fill="#374151" />
        <circle cx="70" cy="65" r="2" fill="#1F2937" />
      </g>
      
      {/* Headlights */}
      <path d="M25,50 C25,50 25,45 25,45 L20,45 C20,45 20,50 20,50 L25,50 Z" fill="#FFFFFF" opacity="0.9" />
      <path d="M75,50 C75,50 75,45 75,45 L80,45 C80,45 80,50 80,50 L75,50 Z" fill="#FFFFFF" opacity="0.9" />
    </g>
    
    {/* Subtle tech elements */}
    <g stroke="#A7F3D0" strokeOpacity="0.5" strokeWidth="0.5" fill="none">
      <path d="M30,55 H70" className="animate-pulse" style={{ animationDuration: '5s' }} />
    </g>
  </svg>
);

export const RefinedPetIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="refined-pet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="refined-pet-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Professional paw print design */}
    <g filter="url(#refined-pet-glow)">
      {/* Main paw pad */}
      <ellipse cx="50" cy="60" rx="16" ry="14" fill="url(#refined-pet-gradient)" opacity="0.9" />
      
      {/* Toe pads */}
      <circle cx="35" cy="40" r="10" fill="url(#refined-pet-gradient)" opacity="0.9" />
      <circle cx="50" cy="35" r="10" fill="url(#refined-pet-gradient)" opacity="0.9" />
      <circle cx="65" cy="40" r="10" fill="url(#refined-pet-gradient)" opacity="0.9" />
    </g>
    
    {/* Elegant outline with subtle animation */}
    <g stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1" fill="none">
      <ellipse cx="50" cy="60" rx="15" ry="13" />
      <circle cx="35" cy="40" r="9" />
      <circle cx="50" cy="35" r="9" />
      <circle cx="65" cy="40" r="9" />
    </g>
    
    {/* Subtle animation element */}
    <g className="animate-pulse" style={{ animationDuration: '5s' }}>
      <circle cx="50" cy="50" r="30" stroke="#FEF3C7" strokeOpacity="0.2" strokeWidth="10" fill="none" />
    </g>
  </svg>
);

export const RefinedHealthIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="refined-health-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
      <filter id="refined-health-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Professional medical cross */}
    <g filter="url(#refined-health-glow)">
      <circle cx="50" cy="50" r="30" fill="#FFFFFF" opacity="0.1" />
      <rect x="45" y="20" width="10" height="60" rx="2" fill="url(#refined-health-gradient)" />
      <rect x="20" y="45" width="60" height="10" rx="2" fill="url(#refined-health-gradient)" />
    </g>
    
    {/* Subtle heartbeat line */}
    <g filter="url(#refined-health-glow)">
      <path 
        d="M20,50 H35 L40,40 L45,60 L50,45 L55,55 L60,35 L65,50 H80" 
        stroke="url(#refined-health-gradient)" 
        strokeWidth="1.5"
        strokeOpacity="0.7"
        fill="none"
        className="animate-pulse"
        style={{ animationDuration: '4s' }}
      />
    </g>
    
    {/* Circular indicators */}
    <circle cx="50" cy="50" r="40" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="1" fill="none" />
    
    {/* Subtle animation elements */}
    <circle 
      cx="50" 
      cy="50" 
      r="35" 
      stroke="#FFFFFF" 
      strokeOpacity="0.1" 
      strokeWidth="15" 
      fill="none"
      className="animate-pulse"
      style={{ animationDuration: '3s' }}
    />
  </svg>
);

// Add this to your CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
  }
  
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
`;
document.head.appendChild(style);