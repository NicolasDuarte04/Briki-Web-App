import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

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
    // Redirect to the Google OAuth endpoint
    window.location.href = "/api/auth/google";
  };
  
  // Text based on mode (login or signup) or custom text if provided
  const buttonText = text || (mode === "login" 
    ? "Continue with Google" 
    : "Sign up with Google");

  return (
    <Button 
      variant="outline"
      onClick={handleGoogleLogin}
      className={`flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 h-11 ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <FcGoogle className="h-5 w-5" />
      <span>{buttonText}</span>
    </Button>
  );
}