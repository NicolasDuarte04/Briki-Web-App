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
    <div className="min-h-screen bg-gradient-page flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background elements - animated radial gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-radial-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-radial-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-radial-accent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Content */}
      <div className="z-10 w-full max-w-3xl px-4 text-center">
        {/* Briki Logo */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-primary">
            Briki
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Global Launch Countdown - June 1, 2025
          </p>
          <p className="mt-2 text-base text-muted-foreground/80">
            The future of multi-category insurance comparison is coming soon
          </p>
        </div>
        
        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 md:gap-6 mb-10 animate-fade-in-up">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-xl bg-card/30 backdrop-blur-lg border border-primary/10 glow-primary flex items-center justify-center premium-card">
              <span className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-primary">
                {timeLeft.days.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Days</span>
          </div>
          
          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-xl bg-card/30 backdrop-blur-lg border border-secondary/10 glow-secondary flex items-center justify-center premium-card">
              <span className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-secondary">
                {timeLeft.hours.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Hours</span>
          </div>
          
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-xl bg-card/30 backdrop-blur-lg border border-secondary/10 glow-secondary flex items-center justify-center premium-card">
              <span className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-secondary">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Minutes</span>
          </div>
          
          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-xl bg-card/30 backdrop-blur-lg border border-accent/10 glow-accent flex items-center justify-center premium-card">
              <span className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-accent animate-pulse">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Seconds</span>
          </div>
        </div>
        
        {/* Email notification form */}
        <div className="mb-8 animate-fade-in-up animation-delay-300">
          <div className="max-w-md mx-auto bg-card/30 backdrop-blur-lg rounded-xl p-6 border border-primary/10 glow-primary">
            <h3 className="font-semibold text-lg mb-3">Get notified when we launch</h3>
            
            <form onSubmit={form.handleSubmit(onSubmitEmail)} className="flex flex-col sm:flex-row gap-2">
              <Input
                {...form.register("email")}
                placeholder="Your email address"
                className="flex-1 bg-background/90 border-secondary/20 focus:border-secondary/60"
                disabled={emailSubmitted}
              />
              <Button 
                type="submit" 
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={emailSubmitted}
              >
                {emailSubmitted ? "Subscribed!" : "Notify Me"}
              </Button>
            </form>
            
            {form.formState.errors.email && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
            
            <p className="text-xs text-muted-foreground mt-3">
              We respect your privacy and will never share your email.
            </p>
          </div>
        </div>
        
        {/* Social sharing buttons */}
        <div className="mb-8 animate-fade-in-up animation-delay-400">
          <h3 className="font-semibold text-base mb-3">Share Briki with your network</h3>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => shareOnSocial('instagram')} 
              variant="outline"
              className="flex items-center gap-2 bg-gradient-page border border-secondary/20 hover:border-secondary/40 hover:bg-secondary/5 hover:glow-secondary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pink-500"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram
            </Button>
            <Button 
              onClick={() => shareOnSocial('linkedin')} 
              variant="outline"
              className="flex items-center gap-2 bg-gradient-page border border-primary/20 hover:border-primary/40 hover:bg-primary/5 hover:glow-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              LinkedIn
            </Button>
          </div>
        </div>
        
        {/* Pre-Test Button */}
        <div className="mb-8 animate-fade-in-up animation-delay-500">
          <Button
            onClick={handlePreTestClick}
            size="lg"
            className="animated-border relative px-8 py-6 text-lg z-10 bg-gradient-secondary hover:opacity-90 transition-opacity"
          >
            <span className="relative z-10">Pre-Test the App</span>
          </Button>
        </div>
        
        {/* Beta Disclaimer */}
        <div className="animate-fade-in-up animation-delay-600">
          <div className="text-sm text-foreground bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-accent/10 glow-accent">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span className="font-semibold">Pre-Launch Demo</span>
            </div>
            <p>
              You are accessing a pre-launch version of Briki with our latest features. Please use the feedback button to share your thoughts!
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