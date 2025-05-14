import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import '@/styles/design-system.css';

export type GradientButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'tertiary';
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
};

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  type = 'button',
  onClick,
  size = 'md',
  variant = 'primary',
  loading = false,
  loadingText,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
}) => {
  // Size variants
  const sizeStyles = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };

  // Style variants
  const variantStyles = {
    primary: {
      background: 'bg-gradient-to-r from-accent-blue to-accent-purple',
      text: 'text-white',
      hover: 'hover:shadow-lg hover:brightness-110',
    },
    secondary: {
      background: 'bg-gradient-to-r from-pink-500 to-accent-orange',
      text: 'text-white',
      hover: 'hover:shadow-lg hover:brightness-110',
    },
    tertiary: {
      background: 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-md',
      text: 'text-gray-800',
      hover: 'hover:bg-opacity-30 hover:shadow-md',
    },
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      className={`
        rounded-full font-medium 
        ${variantStyles[variant].background} 
        ${variantStyles[variant].text} 
        ${sizeStyles[size]} 
        ${variantStyles[variant].hover}
        ${fullWidth ? 'w-full' : ''} 
        ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        flex items-center justify-center
        transition-all duration-300 ease-out
        shadow-md
        ${className}
      `}
      whileHover={isDisabled ? {} : { y: -3, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
      whileTap={isDisabled ? {} : { y: -1, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)' }}
      disabled={isDisabled}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {loading && loadingText ? loadingText : children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
};

export default GradientButton;