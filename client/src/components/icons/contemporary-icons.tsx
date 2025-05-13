import React from "react";

export const TravelIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
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
      <linearGradient id="travel-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A465F5" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <filter id="travel-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Plane icon with subtle animation */}
    <g filter="url(#travel-glow)" fill="url(#travel-gradient)" stroke="url(#travel-gradient)">
      <path d="M22 16.32A3.73 3.73 0 0 1 18.32 20h-.45a.86.86 0 0 1-.82-.67L16 14l-7 3v3c0 .34-.1.66-.28.94l-2.5 4.44A.56.56 0 0 1 5.5 25h-.06a.62.62 0 0 1-.56-.53l-1.5-6.2a3 3 0 0 1 2.17-3.54L12 13 8.73 9.74a1.36 1.36 0 0 1-.35-1.22l.33-1.59A.8.8 0 0 1 9.5 6.3l2.12.42L16.32 3a.8.8 0 0 1 .68-.18l2.19.54a1.58 1.58 0 0 1 1.19 1.4c.03.4-.12.8-.43 1.11L16.24 10l5.1 1.26a.86.86 0 0 1 .66.82v4.24z" />
    </g>
    
    {/* Animated flight path */}
    <path 
      d="M8 12 L18 8" 
      className="animate-pulse" 
      stroke="white" 
      strokeWidth="0.5" 
      strokeDasharray="1,1"
      opacity="0.7"
    />
  </svg>
);

export const AutoIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
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
      <linearGradient id="auto-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5EEAD4" />
        <stop offset="100%" stopColor="#2DD4BF" />
      </linearGradient>
      <filter id="auto-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Car icon with subtle glow */}
    <g filter="url(#auto-glow)" fill="url(#auto-gradient)" stroke="url(#auto-gradient)">
      <path d="M19 17h2v2h-2m0-6h2v2h-2m-7-2h2v2h-2m0-6h2v2h-2M5 17h2v2H5m0-6h2v2H5m0 6h14v-3h3v-9a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v9h3v3m14-10h-3V5h-8v2H5v2h14v-2Z" />
    </g>
    
    {/* Subtle animation */}
    <path 
      d="M5 14h14" 
      className="animate-pulse" 
      stroke="white" 
      strokeWidth="0.5" 
      strokeDasharray="1,1"
      opacity="0.5"
    />
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
        <stop offset="0%" stopColor="#FDBA74" />
        <stop offset="100%" stopColor="#FB923C" />
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
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#EC4899" />
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