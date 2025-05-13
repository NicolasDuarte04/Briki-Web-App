import React from "react";

export const MinimalTravelIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
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
      <linearGradient id="minimal-travel-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A465F5" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <filter id="minimal-travel-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="0.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Simple airplane icon */}
    <g filter="url(#minimal-travel-glow)" stroke="url(#minimal-travel-gradient)">
      <path d="M17.5 19h2.5l1.5-6-2-1-4 3.5-3-1.5v-6l2.5-2s-5-2-5-2l-.5 4.5-3 1.5-3.5-1-1.5 2 3.5 1.5-1 2.5-2.5.5 1 2 7-2.5 2 4.5z" strokeWidth="1.5" />
    </g>
    
    {/* Subtle animation */}
    <path 
      d="M14 10 L19 7" 
      className="animate-pulse" 
      stroke="url(#minimal-travel-gradient)" 
      strokeWidth="0.5" 
      strokeDasharray="1,1"
      opacity="0.3"
    />
  </svg>
);

export const MinimalAutoIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
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
      <linearGradient id="minimal-auto-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5EEAD4" />
        <stop offset="100%" stopColor="#2DD4BF" />
      </linearGradient>
      <filter id="minimal-auto-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="0.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Simple car icon */}
    <g filter="url(#minimal-auto-glow)" stroke="url(#minimal-auto-gradient)">
      <path d="M5 17h14v-6l-2-5H7L5 11v6zm2 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" strokeWidth="1.5" />
      <path d="M5 13h14" strokeWidth="1" />
    </g>
    
    {/* Subtle animation */}
    <path 
      d="M7 11 L17 11" 
      className="animate-pulse" 
      stroke="url(#minimal-auto-gradient)" 
      strokeWidth="0.5" 
      strokeDasharray="1,1"
      opacity="0.3"
    />
  </svg>
);

export const MinimalPetIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
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
      <linearGradient id="minimal-pet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDBA74" />
        <stop offset="100%" stopColor="#FB923C" />
      </linearGradient>
      <filter id="minimal-pet-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="0.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Simple paw print icon */}
    <g filter="url(#minimal-pet-glow)" stroke="url(#minimal-pet-gradient)">
      <ellipse cx="12" cy="16" rx="6" ry="5" strokeWidth="1.5" />
      <ellipse cx="7.5" cy="9.5" rx="2" ry="2.5" strokeWidth="1.5" />
      <ellipse cx="16.5" cy="9.5" rx="2" ry="2.5" strokeWidth="1.5" />
      <ellipse cx="5" cy="14" rx="1.5" ry="2" strokeWidth="1.5" />
      <ellipse cx="19" cy="14" rx="1.5" ry="2" strokeWidth="1.5" />
    </g>
    
    {/* Subtle animation */}
    <path 
      d="M9 14.5 L15 14.5" 
      className="animate-pulse" 
      stroke="url(#minimal-pet-gradient)" 
      strokeWidth="0.5" 
      strokeDasharray="1,1"
      opacity="0.3"
    />
  </svg>
);

export const MinimalHealthIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
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
      <linearGradient id="minimal-health-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <filter id="minimal-health-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="0.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Medical cross icon */}
    <g filter="url(#minimal-health-glow)" stroke="url(#minimal-health-gradient)">
      <path d="M9 7v4H5v2h4v4h2v-4h4v-2h-4V7H9z" strokeWidth="1.5" />
      <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth="1.5" />
    </g>
    
    {/* Subtle animation */}
    <rect 
      x="9" 
      y="9" 
      width="6" 
      height="6" 
      className="animate-pulse" 
      stroke="url(#minimal-health-gradient)" 
      strokeWidth="0.5" 
      fill="none"
      opacity="0.3"
    />
  </svg>
);

// Export a combined icon component for easy switching
export const MinimalInsuranceIcon: React.FC<{ 
  type: 'travel' | 'auto' | 'pet' | 'health', 
  className?: string 
}> = ({ type, className }) => {
  switch (type) {
    case 'travel':
      return <MinimalTravelIcon className={className} />;
    case 'auto':
      return <MinimalAutoIcon className={className} />;
    case 'pet':
      return <MinimalPetIcon className={className} />;
    case 'health':
      return <MinimalHealthIcon className={className} />;
    default:
      return <MinimalTravelIcon className={className} />;
  }
};

// Generic stroke icon for smaller UI elements
export const MinimalIcon: React.FC<{ 
  type: 'travel' | 'auto' | 'pet' | 'health', 
  className?: string 
}> = ({ type, className = "w-6 h-6" }) => {
  const icons = {
    travel: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19h2.5l1.5-6-2-1-4 3.5-3-1.5v-6l2.5-2s-5-2-5-2l-.5 4.5-3 1.5-3.5-1-1.5 2 3.5 1.5-1 2.5-2.5.5 1 2 7-2.5 2 4.5z" />
      </svg>
    ),
    auto: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17h14v-6l-2-5H7L5 11v6zm2 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        <path d="M5 13h14" />
      </svg>
    ),
    pet: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="16" rx="6" ry="5" />
        <ellipse cx="7.5" cy="9.5" rx="2" ry="2.5" />
        <ellipse cx="16.5" cy="9.5" rx="2" ry="2.5" />
        <ellipse cx="5" cy="14" rx="1.5" ry="2" />
        <ellipse cx="19" cy="14" rx="1.5" ry="2" />
      </svg>
    ),
    health: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 7v4H5v2h4v4h2v-4h4v-2h-4V7H9z" />
        <rect x="5" y="5" width="14" height="14" rx="2" />
      </svg>
    )
  };
  
  return icons[type] || icons.travel;
};