import React from "react";

export const RefinedAIAssistantIcon: React.FC<{
  className?: string;
  animated?: boolean;
}> = ({ className = "w-12 h-12", animated = true }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <g>
        {/* Circle background */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="url(#refined-ai-gradient)"
          className={animated ? "animate-pulse" : ""}
          style={{ animationDuration: "3s" }}
        />
        
        {/* Brain graphic */}
        <path
          d="M12 7.5C11.0572 7.5 10.3045 8.2231 10.3045 9.13158C10.3045 9.90108 10.8548 10.5426 11.5909 10.7156V15.7674C11.5909 16.5895 12.1811 16.9212 12.409 17C12.6369 16.9212 13.2271 16.5895 13.2271 15.7674V10.7156C13.9632 10.5426 14.5135 9.90108 14.5135 9.13158C14.5135 8.2231 13.7608 7.5 12.818 7.5H12Z"
          fill="white"
        />
        
        {/* Connection lines - simplified */}
        <path
          d="M7.5 12.5C9 14 10.5 15 12 15C13.5 15 15 14 16.5 12.5"
          stroke="white"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>
      
      {/* Define gradient */}
      <defs>
        <linearGradient id="refined-ai-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
};