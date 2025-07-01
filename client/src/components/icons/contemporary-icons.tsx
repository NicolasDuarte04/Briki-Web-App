import React from "react";
import travelSvg from '../../assets/insurance-types/travel.svg';
import autoSvg from '../../assets/insurance-types/auto.svg';
import petSvg from '../../assets/insurance-types/pet.svg';
import healthSvg from '../../assets/insurance-types/health.svg';

// Export image-based icons using stock images
export const TravelIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <div className={`${className} relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}>
    <img 
      src={travelSvg}
      alt="Travel Insurance" 
      className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105" 
    />
  </div>
);

export const AutoIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <div className={`${className} relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}>
    <img 
      src={autoSvg}
      alt="Auto Insurance" 
      className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105" 
    />
  </div>
);

export const PetIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <div className={`${className} relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}>
    <img 
      src={petSvg}
      alt="Pet Insurance" 
      className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105" 
    />
  </div>
);

export const HealthIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <div className={`${className} relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}>
    <img 
      src={healthSvg}
      alt="Health Insurance" 
      className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105" 
    />
  </div>
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