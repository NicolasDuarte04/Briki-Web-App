import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '@/styles/design-system.css';

type AnimatedLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withText?: boolean;
  variant?: 'default' | 'minimal' | 'gradient';
};

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 'md',
  className = '',
  withText = true,
  variant = 'default',
}) => {
  // Size mapping
  const sizeMap = {
    sm: {
      logoSize: 24,
      textSize: 'text-lg',
      gap: 'gap-1',
    },
    md: {
      logoSize: 32,
      textSize: 'text-xl',
      gap: 'gap-2',
    },
    lg: {
      logoSize: 48,
      textSize: 'text-3xl',
      gap: 'gap-3',
    },
  };

  // Variant styling
  const variantStyles = {
    default: {
      bgFrom: '#ff6b6b',
      bgTo: '#4d7cff',
      shadowColor: 'rgba(77, 124, 255, 0.5)',
    },
    minimal: {
      bgFrom: '#000000',
      bgTo: '#333333',
      shadowColor: 'rgba(0, 0, 0, 0.3)',
    },
    gradient: {
      bgFrom: '#ff6b6b',
      bgTo: '#4d7cff',
      shadowColor: 'rgba(77, 124, 255, 0.5)',
    },
  };

  // Animation variants for the logo
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: { duration: 0.3 },
    },
  };

  // Animation variants for each letter in "Briki"
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + custom * 0.1,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  // Generate the Briki text with animated letters
  const renderText = () => {
    const letters = 'Briki'.split('');

    return (
      <div className="flex">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            className={`font-bold ${sizeMap[size].textSize} ${
              variant === 'minimal' ? 'text-gray-800' : 'bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end bg-clip-text text-transparent'
            }`}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    );
  };

  // The simplified logo SVG
  const LogoIcon = () => (
    <svg
      width={sizeMap[size].logoSize}
      height={sizeMap[size].logoSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M12 2L4 6v12l8 4 8-4V6l-8-4z"
        fill={`url(#gradient-${variant})`}
        stroke="white"
        strokeWidth="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: 1,
          transition: { duration: 1.5, ease: "easeInOut", delay: 0.2 }
        }}
      />
      <motion.path
        d="M12 2v8l8 4m-8-4L4 6"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: 1,
          transition: { duration: 1, ease: "easeInOut", delay: 0.8 }
        }}
      />
      <defs>
        <linearGradient
          id={`gradient-${variant}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={variantStyles[variant].bgFrom} />
          <stop offset="100%" stopColor={variantStyles[variant].bgTo} />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <motion.div
      className={`flex items-center ${sizeMap[size].gap} ${className}`}
      whileHover="hover"
    >
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        style={{
          filter: `drop-shadow(0 2px 5px ${variantStyles[variant].shadowColor})`,
        }}
      >
        <LogoIcon />
      </motion.div>
      
      {withText && renderText()}
    </motion.div>
  );
};

export default AnimatedLogo;