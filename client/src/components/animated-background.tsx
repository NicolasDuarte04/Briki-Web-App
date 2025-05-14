import React from 'react';

type AnimatedBackgroundProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'vibrant' | 'subtle';
};

/**
 * Animated liquid gradient background component
 * Inspired by Stripe and modern AI product interfaces
 */
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const getGradientStyle = () => {
    switch (variant) {
      case 'vibrant':
        return {
          backgroundImage: `radial-gradient(circle at 25% 10%, #FF53C0, transparent 55%), 
                            radial-gradient(circle at 90% 5%, #5D5FEF, transparent 35%), 
                            radial-gradient(circle at 10% 40%, #4C6EFF, transparent 45%), 
                            radial-gradient(circle at 80% 80%, #00C2FF, transparent 35%), 
                            radial-gradient(circle at 40% 85%, #5F9FFF, transparent 55%)`,
          backgroundSize: '200% 200%',
          animation: 'gradientMove 30s ease infinite alternate'
        };
      case 'subtle':
        return {
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.7), transparent 35%), 
                            radial-gradient(circle at 80% 25%, rgba(236, 242, 255, 0.7), transparent 25%), 
                            linear-gradient(145deg, #EEF2FF, #E4EDFF, #F6F8FF)`,
          backgroundSize: '200% 200%',
          animation: 'subtleMove 40s ease infinite alternate'
        };
      default:
        return {
          backgroundImage: `radial-gradient(circle at 15% 15%, rgba(240, 247, 255, 1), transparent 25%), 
                            radial-gradient(circle at 85% 25%, rgba(230, 241, 255, 1), transparent 25%), 
                            radial-gradient(circle at 40% 80%, rgba(223, 233, 255, 1), transparent 35%), 
                            radial-gradient(circle at 75% 70%, rgba(233, 238, 255, 1), transparent 30%), 
                            linear-gradient(145deg, #F0F7FF, #E6F1FF, #DFE9FF, #E9EEFF, #F6F8FF)`,
          backgroundSize: '200% 200%',
          animation: 'gradientMove 25s ease infinite alternate'
        };
    }
  };

  return (
    <div 
      className={`relative min-h-screen ${className}`}
      style={getGradientStyle()}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradientMove {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 100%;
          }
        }
        
        @keyframes subtleMove {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
      `}} />
      {children}
    </div>
  );
};

export default AnimatedBackground;