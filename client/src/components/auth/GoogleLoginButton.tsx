import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useLocation } from "wouter";

interface GoogleLoginButtonProps {
  mode: "login" | "signup";
  fullWidth?: boolean;
  className?: string;
}

export default function GoogleLoginButton({ 
  mode, 
  fullWidth = true,
  className = "" 
}: GoogleLoginButtonProps) {
  const { loginWithGoogle } = useAuth();
  const [location] = useLocation();
  
  const handleGoogleLogin = () => {
    // Use current location as return URL if not on auth page
    const returnTo = location.startsWith('/auth') ? undefined : location;
    loginWithGoogle(returnTo);
  };
  
  // Text based on mode (login or signup)
  const buttonText = mode === "login" 
    ? "Continue with Google" 
    : "Sign up with Google";

  return (
    <Button 
      variant="outline"
      onClick={handleGoogleLogin}
      className={`flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <FcGoogle className="h-5 w-5" />
      <span>{buttonText}</span>
    </Button>
  );
}