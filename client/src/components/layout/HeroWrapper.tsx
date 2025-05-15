import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface HeroWrapperProps {
  title: string;
  description: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  primaryButtonLabel?: string;
  primaryButtonAction?: () => void;
  secondaryButtonLabel?: string;
  secondaryButtonLink?: string;
  backgroundPattern?: string;
  children?: ReactNode;
}

export const HeroWrapper = ({
  title,
  description,
  gradientFrom = "[#003087]",
  gradientVia = "[#0052aa]",
  gradientTo = "[#0074FF]",
  primaryButtonLabel = "View Plans",
  primaryButtonAction,
  secondaryButtonLabel = "Learn More",
  secondaryButtonLink,
  backgroundPattern = "/assets/briki-hero-pattern.svg",
  children
}: HeroWrapperProps) => {
  const [, navigate] = useLocation();
  
  const defaultPrimaryAction = () => 
    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative overflow-hidden">
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-${gradientFrom} via-${gradientVia} to-${gradientTo} z-0`}
        style={{ 
          backgroundImage: `url('${backgroundPattern}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          opacity: 0.9
        }}
      />
      
      <div className="container relative z-10 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl text-center sm:text-left mx-auto sm:mx-0"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            {title}
          </h1>
          <p className="text-lg text-white/90 mb-8">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {primaryButtonLabel && (
              <Button 
                size="lg" 
                onClick={primaryButtonAction || defaultPrimaryAction}
                className="font-medium"
              >
                {primaryButtonLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {secondaryButtonLabel && secondaryButtonLink && (
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white hover:bg-white/90 text-primary border-white hover:text-primary font-medium"
                onClick={() => navigate(secondaryButtonLink)}
              >
                {secondaryButtonLabel}
              </Button>
            )}
            
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
};