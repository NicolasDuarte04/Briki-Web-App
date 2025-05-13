import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function LoginNotification() {
  const { toast } = useToast();

  useEffect(() => {
    // Show the notification when the component mounts
    const welcomeToast = toast({
      title: "Welcome to Briki",
      description: "Your AI-powered insurance platform is ready to use.",
      duration: 5000, // 5 seconds
      className: "login-notification-toast",
    });

    // Clean up the toast when the component unmounts
    return () => {
      welcomeToast.dismiss();
    };
  }, [toast]);

  return null; // This component doesn't render anything visible
}