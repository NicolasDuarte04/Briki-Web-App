import { motion } from "framer-motion";
import { Link } from "wouter";
import { cn } from "../../lib/utils";
import { useSupabaseAuth } from "../../contexts/SupabaseAuthContext";

interface HeroProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  gradient?: string;
  imageUrl?: string;
  centered?: boolean;
  className?: string;
}

/**
 * Reusable Hero component for category and landing pages
 * Supports primary and secondary CTAs, background gradients and optional images
 */
export function Hero({
  title,
  description,
  ctaText,
  ctaLink = "/auth",
  secondaryCtaText,
  secondaryCtaLink,
  gradient = "from-primary/90 via-primary/80 to-primary",
  imageUrl,
  centered = true,
  className,
}: HeroProps) {
  const { isAuthenticated } = useSupabaseAuth();
  
  // If user is authenticated, redirect CTA to the appropriate authenticated route
  const primaryCtaLink = isAuthenticated && ctaLink === "/auth" 
    ? "/categories" 
    : ctaLink;

  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Background gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${gradient}`}
        aria-hidden="true"
      />
      
      {/* Optional background image with overlay */}
      {imageUrl && (
        <div 
          className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />
      )}
      
      {/* Content container */}
      <div className="relative pt-20 pb-24 md:pt-32 md:pb-32 container mx-auto px-4">
        <div className={cn(
          "max-w-2xl text-white",
          centered ? "mx-auto text-center" : "mx-0 text-left"
        )}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl mb-8 text-white/90"
          >
            {description}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "flex flex-col sm:flex-row gap-4",
              centered ? "justify-center" : "justify-start"
            )}
          >
            {/* Primary CTA button */}
            {primaryCtaLink.startsWith("#") ? (
              <a 
                href={primaryCtaLink} 
                className="px-6 py-3 bg-white text-primary font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                {ctaText}
              </a>
            ) : (
              <Link 
                href={primaryCtaLink} 
                className="px-6 py-3 bg-white text-primary font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                {ctaText}
              </Link>
            )}
            
            {/* Optional secondary CTA button */}
            {secondaryCtaText && secondaryCtaLink && (
              <Link 
                href={secondaryCtaLink} 
                className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all"
              >
                {secondaryCtaText}
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}