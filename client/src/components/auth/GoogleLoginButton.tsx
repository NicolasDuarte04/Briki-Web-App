import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { trackEvent } from "@/lib/analytics";
import { motion } from "framer-motion";

interface GoogleLoginButtonProps {
  mode?: "login" | "signup";
  text?: string;
  fullWidth?: boolean;
  className?: string;
}

export default function GoogleLoginButton({ 
  mode = "login", 
  text,
  fullWidth = true,
  className = "" 
}: GoogleLoginButtonProps) {
  const handleGoogleLogin = () => {
    // Track the Google authentication attempt in analytics
    trackEvent(
      mode === "login" ? "google_login_attempt" : "google_signup_attempt",
      "authentication",
      `google_auth_${mode}`
    );
    
    // Store the current URL to redirect back after authentication
    if (window.location.pathname !== '/auth') {
      localStorage.setItem('authReturnTo', window.location.pathname);
    }
    
    // Redirect to the Google OAuth endpoint
    window.location.href = "/api/auth/google";
  };
  
  // Text based on mode (login or signup) or custom text if provided
  const buttonText = text || (mode === "login" 
    ? "Continue with Google" 
    : "Sign up with Google");

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full"
    >
      <Button 
        variant="outline"
        onClick={handleGoogleLogin}
        className={`flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 h-11 transition-all ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        <FcGoogle className="h-5 w-5" />
        <span>{buttonText}</span>
      </Button>
    </motion.div>
  );
}