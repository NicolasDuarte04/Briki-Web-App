import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

interface GoogleLoginButtonProps {
  text?: string;
  className?: string;
  onClick?: () => void;
}

export function GoogleLoginButton({ 
  text = "Continue with Google", 
  className = "",
  onClick 
}: GoogleLoginButtonProps) {
  
  const handleGoogleLogin = () => {
    // Redirect to the server's Google authentication endpoint
    window.location.href = "/api/auth/google";
    
    // If onClick is provided, call it as well
    if (onClick) onClick();
  };
  
  return (
    <Button 
      type="button" 
      onClick={handleGoogleLogin} 
      variant="outline" 
      className={`w-full relative backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 ${className}`}
    >
      <FcGoogle className="w-5 h-5 absolute left-3" />
      <span className="mx-auto">{text}</span>
    </Button>
  );
}