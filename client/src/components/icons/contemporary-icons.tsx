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
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="pet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#F97316" />
      </linearGradient>
      <filter id="pet-soft-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="0.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Apple-style minimalist pet icon */}
    <circle cx="12" cy="12" r="10" fill="white" className="transition-all duration-300" />
    
    <g filter="url(#pet-soft-glow)" className="transition-transform duration-300 hover:scale-105">
      {/* Paw outline */}
      <path 
        d="M9 12.5C9 11.12 9.5 9 11 9C12.5 9 13 11.12 13 12.5"
        stroke="url(#pet-gradient)" 
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none" 
      />
      
      <path 
        d="M11 12.5C11 11.12 11.5 9 13 9C14.5 9 15 11.12 15 12.5"
        stroke="url(#pet-gradient)" 
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none" 
      />
      
      <path 
        d="M7 13.5C7 12.12 7.5 10 9 10C10.5 10 11 12.12 11 13.5"
        stroke="url(#pet-gradient)" 
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none" 
      />
      
      <path 
        d="M13 13.5C13 12.12 13.5 10 15 10C16.5 10 17 12.12 17 13.5"
        stroke="url(#pet-gradient)" 
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none" 
      />
      
      {/* Central pad */}
      <path 
        d="M9 15C9 13.62 10.5 13 12 13C13.5 13 15 13.62 15 15C15 16.38 13.5 17 12 17C10.5 17 9 16.38 9 15Z"
        stroke="url(#pet-gradient)" 
        strokeWidth="1.5"
        fill="none" 
      />
    </g>
  </svg>
);

export const HealthIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="health-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
      <filter id="health-soft-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="0.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Apple-style minimalist health icon */}
    <circle cx="12" cy="12" r="10" fill="white" className="transition-all duration-300" />
    
    <g filter="url(#health-soft-glow)" className="transition-transform duration-300 hover:scale-105">
      {/* Medical cross */}
      <path 
        d="M12 7V17M7 12H17" 
        stroke="url(#health-gradient)" 
        strokeWidth="1.5" 
        strokeLinecap="round"
        fill="none" 
      />
      
      {/* Heart monitor line */}
      <path 
        d="M7 15L9 15L10 13L12 17L14 11L15 15L17 15" 
        stroke="url(#health-gradient)" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none" 
      />
      
      {/* Subtle circle */}
      <circle 
        cx="12" 
        cy="12" 
        r="7" 
        stroke="url(#health-gradient)" 
        strokeWidth="1"
        opacity="0.3"
        fill="none" 
      />
    </g>
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