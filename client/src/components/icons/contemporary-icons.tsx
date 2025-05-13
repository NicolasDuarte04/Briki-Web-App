import React from "react";

export const TravelIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="travel-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <filter id="travel-soft-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="0.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Apple-style minimalist plane icon */}
    <circle cx="12" cy="12" r="10" fill="white" className="transition-all duration-300" />
    
    <g filter="url(#travel-soft-glow)" className="transition-transform duration-300 hover:scale-105">
      {/* Plane outline */}
      <path 
        d="M18.5 8.5L14 12H10L5.5 9.5M18.5 8.5L19.5 5.5L16.5 6.5L14 12M18.5 8.5L14 12M14 12V16L12 17L10 16V12M10 12L5.5 9.5M5.5 9.5L4.5 10L6 13L10 12" 
        stroke="url(#travel-gradient)" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none" 
      />
    </g>
  </svg>
);

export const AutoIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="auto-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2DD4BF" />
        <stop offset="100%" stopColor="#14B8A6" />
      </linearGradient>
      <filter id="auto-soft-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="0.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Apple-style minimalist car icon */}
    <circle cx="12" cy="12" r="10" fill="white" className="transition-all duration-300" />
    
    <g filter="url(#auto-soft-glow)" className="transition-transform duration-300 hover:scale-105">
      {/* Car outline */}
      <path 
        d="M6 12.5H18M6 12.5L7 8.5H17L18 12.5M6 12.5V15.5H7M18 12.5V15.5H17M7 15.5V16.5H9M7 15.5H17M17 15.5V16.5H15M9 16.5V15.5M9 16.5H15M15 16.5V15.5"
        stroke="url(#auto-gradient)" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none" 
      />
      
      {/* Wheels */}
      <circle cx="9" cy="15.5" r="1.5" stroke="url(#auto-gradient)" strokeWidth="1.5" fill="none" />
      <circle cx="15" cy="15.5" r="1.5" stroke="url(#auto-gradient)" strokeWidth="1.5" fill="none" />
    </g>
  </svg>
);

export const PetIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="pet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="pet-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Dog icon with subtle glow */}
    <g filter="url(#pet-glow)" fill="url(#pet-gradient)" stroke="url(#pet-gradient)">
      <path d="M17 4.5C17 5.9 18.1 7 19.5 7a.5.5 0 0 1 .5.5V9c0 1.1-.9 2-2 2h-2.5c-.28 0-.5.22-.5.5v1c0 .28.22.5.5.5H17c.83 0 1.5.67 1.5 1.5V16c0 1.1-.9 2-2 2h-1.5c-.28 0-.5.22-.5.5v1c0 .28.22.5.5.5h2c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5h-13c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H4c-1.1 0-2-.9-2-2v-1.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 1-.5-.5v-2c0-.28.22-.5.5-.5h3a.5.5 0 0 0 .5-.5V10c0-1.66 1.34-3 3-3h5c.28 0 .5-.22.5-.5V4c0-.28-.22-.5-.5-.5h-2a.5.5 0 0 1-.5-.5V2c0-.28.22-.5.5-.5h6c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5h-2a.5.5 0 0 0-.5.5v1Z" />
      <circle cx="8.5" cy="14.5" r="1.5" />
    </g>
    
    {/* Subtle animation */}
    <path 
      d="M12 17a5 5 0 0 1-3.5-1.4" 
      className="animate-pulse" 
      stroke="white" 
      strokeWidth="0.5" 
      strokeDasharray="1,1"
      opacity="0.5"
    />
  </svg>
);

export const HealthIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="health-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
      <filter id="health-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Heart icon with subtle glow */}
    <g filter="url(#health-glow)" fill="url(#health-gradient)" stroke="url(#health-gradient)">
      <path d="M3 12h4l1.5-3L12 19l2-4h7" fill="none" />
      <path d="M17.3 3.3a4 4 0 0 0-5.6 0l-.7.7-.7-.7a4 4 0 0 0-5.6 5.6l6.3 6.3 6.3-6.3a4 4 0 0 0 0-5.6Z" />
    </g>
    
    {/* Animated pulse */}
    <circle 
      cx="12" 
      cy="12" 
      r="9" 
      className="animate-ping" 
      stroke="url(#health-gradient)" 
      strokeWidth="0.5"
      opacity="0.3"
      fill="none"
    />
  </svg>
);

// Export a combined icon component for easy switching between styles
export const InsuranceIcon: React.FC<{ 
  type: 'travel' | 'auto' | 'pet' | 'health', 
  className?: string 
}> = ({ type, className }) => {
  switch (type) {
    case 'travel':
      return <TravelIcon className={className} />;
    case 'auto':
      return <AutoIcon className={className} />;
    case 'pet':
      return <PetIcon className={className} />;
    case 'health':
      return <HealthIcon className={className} />;
    default:
      return <TravelIcon className={className} />;
  }
};