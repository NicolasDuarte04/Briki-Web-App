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
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      <filter id="travel-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Contemporary airplane icon with subtle animation */}
    <g filter="url(#travel-glow)" fill="url(#travel-gradient)" stroke="url(#travel-gradient)">
      <path d="M17.8 19.2L16 11l3.5-3.5a2.1 2.1 0 0 0 0-3 2.1 2.1 0 0 0-3 0L13 8l-8.2-1.8a.8.8 0 0 0-.9 1.2l5 5-3.3 3.3a.7.7 0 0 0 0 1l2 2a.7.7 0 0 0 1 0l3.3-3.3 5 5c.3.3.7.3 1 .2.3-.1.5-.4.5-.7l-.6-2.7Z" />
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
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
      <filter id="auto-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Contemporary car icon with subtle glow */}
    <g filter="url(#auto-glow)" fill="url(#auto-gradient)" stroke="url(#auto-gradient)">
      <path d="M7 17h10m-6-6h2M6.5 12v-2c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2v2M5 12l-1 4v3c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h10v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-3l-1-4H5Z" />
      <path d="M7 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM17 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
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
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="pet-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Contemporary pet paw icon with subtle glow */}
    <g filter="url(#pet-glow)" fill="url(#pet-gradient)" stroke="url(#pet-gradient)">
      <path d="M9 11.2a2 2 0 0 0-2-2.7 2 2 0 0 0-1.9 1.4c-.3 1-.2 2.3 1.4 3.3.8.5 1.8 1 3 1.5-.3-1.4-.3-2.6-.5-3.5ZM10.3 7a2 2 0 0 0 1.3-3 2 2 0 0 0-2.2-.7c-1 .2-2 1-2.6 3-.3 1-.5 2 0 3.4 1.1-1 2.3-1.9 3.5-2.7ZM16.5 8.5A2 2 0 0 0 14 7.1a2 2 0 0 0-.7 2.2c.2 1 1 2 3 2.6 1 .3 2 .5 3.4 0a17 17 0 0 0-3.2-3.4ZM17 11.9a2 2 0 0 0-3.3-.5 2 2 0 0 0-.4 2.3c.4 1 1.4 1.7 3.5 1.3a7 7 0 0 0 3-1.4c-1.1-.6-2-1.1-2.8-1.7ZM14.9 16.4c-1.7-1-2.5-.1-4.3 0-1.7.2-2.6-.7-3-1.6-.2-.5-.3-1.1-.2-1.7 0-.6.3-1.1.5-1.6.2-.5.5-1 .6-1.4.2-.5.4-1 .4-1.6 0-.7-.3-1.4-.9-1.7-.2-.1-.5-.2-.8-.2-.3 0-.6 0-.9.1-.4.2-.7.6-.9 1-.2.4-.2.8-.2 1.3 0 .5 0 1 .2 1.4 0 .3 0 .5-.2.7l-.5.6c-.2.2-.4.4-.4.7 0 .3 0 .6.2.9l.3.6c0 .2 0 .5-.2.7l-.7.6c-.6.7-.2 1.8.8 2 1 .1 3.2.4 5.8-.2a8 8 0 0 0 4.4-2.5c.2-.2.3-.4.2-.7l-.2-.4Z" />
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
    
    {/* Contemporary heartbeat icon with subtle glow */}
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