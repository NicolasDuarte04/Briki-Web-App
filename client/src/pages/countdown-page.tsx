import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Email notification form schema
const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function CountdownPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 20,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Form validation
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Calculate time difference from a fixed global launch date
  useEffect(() => {
    // Set a fixed global launch date (June 1, 2025)
    const targetDate = new Date('2025-06-01T00:00:00');
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Countdown finished
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handlePreTestClick = () => {
    // Using direct window location for consistent navigation
    window.location.href = '/auth';
  };
  
  // Handle email submission
  const onSubmitEmail = (data: EmailFormValues) => {
    console.log("Email subscription:", data.email);
    
    // In a production environment, this would send the email to a database or service
    // For demo purposes, we'll just show a success toast
    toast({
      title: "Thank you for subscribing!",
      description: "We'll notify you when Briki officially launches.",
      variant: "default",
    });
    
    // Reset form and show success state
    form.reset();
    setEmailSubmitted(true);
    
    // Reset success state after a few seconds
    setTimeout(() => {
      setEmailSubmitted(false);
    }, 5000);
  };
  
  // Handle social sharing
  const shareOnSocial = (platform: 'instagram' | 'linkedin') => {
    const shareText = "I'm excited for the launch of Briki - the future of insurance comparison coming June 1, 2025. Join me!";
    const shareUrl = window.location.origin;
    
    let shareLink = "";
    
    if (platform === 'instagram') {
      // Instagram doesn't have a direct share URL, so we'll copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast({
        title: "Ready to share on Instagram!",
        description: "The message has been copied to your clipboard. Open Instagram to paste and share.",
        variant: "default",
      });
      return;
    }
    
    if (platform === 'linkedin') {
      shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
      window.open(shareLink, '_blank');
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background elements - animated gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Content */}
      <div className="z-10 w-full max-w-2xl px-4 text-center">
        {/* Briki Logo */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500">
            Briki
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Global Launch Countdown - June 1, 2025
          </p>
          <p className="mt-2 text-base text-muted-foreground/80">
            The future of insurance comparison is coming soon
          </p>
        </div>
        
        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 md:gap-6 mb-12 animate-fade-in-up">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-xl bg-card/30 backdrop-blur-lg border border-accent/10 shadow-glow flex items-center justify-center">
              <span className="text-3xl md:text-5xl font-bold text-primary">
                {timeLeft.days.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Days</span>
          </div>
          
          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-xl bg-card/30 backdrop-blur-lg border border-accent/10 shadow-glow flex items-center justify-center">
              <span className="text-3xl md:text-5xl font-bold text-primary">
                {timeLeft.hours.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Hours</span>
          </div>
          
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-xl bg-card/30 backdrop-blur-lg border border-accent/10 shadow-glow flex items-center justify-center">
              <span className="text-3xl md:text-5xl font-bold text-primary">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Minutes</span>
          </div>
          
          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-xl bg-card/30 backdrop-blur-lg border border-accent/10 shadow-glow flex items-center justify-center">
              <span className="text-3xl md:text-5xl font-bold text-primary animate-pulse">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Seconds</span>
          </div>
        </div>
        
        {/* Pre-Test Button */}
        <div className="mb-8 animate-fade-in-up animation-delay-300">
          <Button
            onClick={handlePreTestClick}
            size="lg"
            className="w-full md:w-auto px-8 py-6 text-lg bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-glow-sm transition-all duration-300 hover:shadow-glow"
          >
            Pre-Test the App
          </Button>
        </div>
        
        {/* Beta Disclaimer */}
        <div className="animate-fade-in-up animation-delay-500">
          <div className="text-sm text-foreground bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-accent/20 shadow-glow-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span className="font-semibold">Beta Notice</span>
            </div>
            <p>
              You are accessing a beta version of Briki. Payments are currently disabled for testing purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  
  @keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animate-fade-in {
    animation: fade-in 1s ease-out forwards;
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  
  .animation-delay-300 {
    animation-delay: 0.3s;
  }
  
  .animation-delay-500 {
    animation-delay: 0.5s;
  }
  
  .shadow-glow {
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
  }
  
  .shadow-glow-sm {
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
  }
`;
document.head.appendChild(style);