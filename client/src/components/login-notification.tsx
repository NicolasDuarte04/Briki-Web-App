import React, { useEffect } from "react";
import { useToast } from "../hooks/use-toast";
import { useSupabaseAuth } from "../contexts/SupabaseAuthContext";
import { LayoutGroup, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function LoginNotification() {
  const { toast } = useToast();
  const { user } = useSupabaseAuth();

  useEffect(() => {
    // Only show the notification when the component mounts and user exists
    if (user) {
      // Use a timeout to delay the toast slightly for better user experience
      const timer = setTimeout(() => {
        toast({
          title: "Welcome to Briki",
          description: "Your AI-powered insurance platform is ready to assist you. Public beta v0.9.2",
          duration: 6000, // 6 seconds
          variant: "default",
          className: "login-notification-toast bg-gradient-to-r from-card to-card/95 backdrop-blur-sm border border-primary/10 shadow-md",
        });
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [toast, user]);

  return null; // This component doesn't render anything visible
}