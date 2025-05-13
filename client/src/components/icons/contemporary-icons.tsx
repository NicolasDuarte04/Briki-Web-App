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
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Modern travel icon with plane and globe */}
    <g filter="url(#travel-glow)" fill="none" stroke="url(#travel-gradient)">
      {/* Globe */}
      <circle cx="12" cy="12" r="8" strokeWidth="1.5" />
      
      {/* Latitude lines */}
      <path d="M4 12h16" strokeWidth="0.75" strokeDasharray="1,1" opacity="0.8" />
      <path d="M12 4v16" strokeWidth="0.75" strokeDasharray="1,1" opacity="0.8" />
      <ellipse cx="12" cy="12" rx="5" ry="8" strokeWidth="0.75" strokeDasharray="1,1" opacity="0.8" />
      
      {/* Plane */}
      <path 
        d="M16 8L8 12l-2 5M8 12l2 7M16 8l2-2" 
        strokeWidth="2" 
        stroke="url(#travel-gradient)" 
        fill="url(#travel-gradient)" 
      />
    </g>
    
    {/* Flight trail animation */}
    <path 
      d="M16 8C14 9 12 10 8 12" 
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
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Modern car icon with dashboard and protection concept */}
    <g filter="url(#auto-glow)" stroke="url(#auto-gradient)">
      {/* Car silhouette */}
      <path 
        d="M3 12l2-5h14l2 5" 
        strokeWidth="1.5" 
        fill="none" 
      />
      <path 
        d="M3 12v4h3l1 2h10l1-2h3v-4H3z" 
        strokeWidth="1.5" 
        fill="none" 
      />
      
      {/* Wheels */}
      <circle cx="7" cy="16" r="1.5" fill="url(#auto-gradient)" />
      <circle cx="17" cy="16" r="1.5" fill="url(#auto-gradient)" />
      
      {/* Shield over car (protection concept) */}
      <path 
        d="M12 4l5 2v4a8 8 0 01-5 7.5A8 8 0 017 10V6l5-2z" 
        strokeWidth="1" 
        opacity="0.6" 
        fill="none" 
      />
      
      {/* Dashboard/windshield */}
      <path 
        d="M6 10h12" 
        strokeWidth="1"
        strokeDasharray="1,0.5"
      />
    </g>
    
    {/* Animated protection pulse */}
    <path 
      d="M12 4v9.5" 
      className="animate-pulse" 
      stroke="url(#auto-gradient)" 
      strokeWidth="0.5" 
      strokeDasharray="0.5,0.5"
      opacity="0.7"
    />
    <path 
      d="M9 6 L15 6" 
      className="animate-pulse" 
      stroke="url(#auto-gradient)" 
      strokeWidth="0.5" 
      strokeDasharray="0.5,0.5"
      opacity="0.7"
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
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Modern pet protection icon */}
    <g filter="url(#pet-glow)" stroke="url(#pet-gradient)">
      {/* Heart-shaped protection frame */}
      <path 
        d="M12 21c-1.5-1.5-9-5.5-9-11.5C3 6 5 4 8 4c1.5 0 3 1 4 2 1-1 2.5-2 4-2 3 0 5 2 5 5.5 0 6-7.5 10-9 11.5z" 
        strokeWidth="1.5" 
        fill="none" 
        opacity="0.3"
      />
      
      {/* Paw prints */}
      <g fill="url(#pet-gradient)">
        {/* Main paw */}
        <circle cx="12" cy="13" r="1.2" />
        <circle cx="14.5" cy="11" r="1" />
        <circle cx="9.5" cy="11" r="1" />
        <circle cx="10.5" cy="15" r="1" />
        <circle cx="13.5" cy="15" r="1" />
        
        {/* Small paws */}
        <g opacity="0.6">
          <circle cx="7" cy="9" r="0.8" />
          <circle cx="8" cy="7.5" r="0.6" />
          <circle cx="6" cy="7.5" r="0.6" />
          <circle cx="6.5" cy="10.5" r="0.6" />
          <circle cx="7.5" cy="10.5" r="0.6" />
          
          <circle cx="17" cy="9" r="0.8" />
          <circle cx="18" cy="7.5" r="0.6" />
          <circle cx="16" cy="7.5" r="0.6" />
          <circle cx="16.5" cy="10.5" r="0.6" />
          <circle cx="17.5" cy="10.5" r="0.6" />
        </g>
      </g>
      
      {/* Cat/dog ear silhouette */}
      <path 
        d="M8 6l-2-2v3M16 6l2-2v3" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      
      {/* Collar */}
      <path 
        d="M9 18h6" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      <circle cx="12" cy="18.5" r="0.5" fill="url(#pet-gradient)" />
    </g>
    
    {/* Animated paw pulse */}
    <circle 
      cx="12" 
      cy="13" 
      r="4" 
      className="animate-ping" 
      stroke="url(#pet-gradient)" 
      strokeWidth="0.5"
      opacity="0.2"
      fill="none"
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
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Modern health icon with medical symbol & heartbeat */}
    <g filter="url(#health-glow)" stroke="url(#health-gradient)">
      {/* Heartbeat with shield concept */}
      <path 
        d="M4 12h3l2-2 2 4 2-8 2 12 2-8 1 2h2" 
        strokeWidth="1.5" 
        fill="none" 
      />
      
      {/* Medical cross */}
      <path 
        d="M12 7v10M7 12h10" 
        strokeWidth="2" 
        opacity="0.6" 
        strokeLinecap="round" 
      />
      
      {/* Circular protection */}
      <circle 
        cx="12" 
        cy="12" 
        r="9" 
        strokeWidth="1" 
        fill="none" 
      />
      
      {/* Heart */}
      <path 
        d="M12 18c3.5-2 7-4.5 7-8 0-2-1.5-3-3-3-1 0-2 0.5-3 1.5L12 10l-1-1.5C10 7.5 9 7 8 7c-1.5 0-3 1-3 3 0 3.5 3.5 6 7 8z" 
        strokeWidth="0.75" 
        fill="url(#health-gradient)" 
        opacity="0.5" 
      />
    </g>
    
    {/* Animated heartbeat */}
    <path 
      d="M9 12h6" 
      className="animate-pulse" 
      stroke="url(#health-gradient)" 
      strokeWidth="1"
      opacity="0.7"
    />
    
    {/* Animated protection ring */}
    <circle 
      cx="12" 
      cy="12" 
      r="9" 
      className="animate-ping" 
      stroke="url(#health-gradient)" 
      strokeWidth="0.5"
      opacity="0.2"
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