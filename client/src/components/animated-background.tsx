import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: "consumer" | "partner" | "auth" | "countdown" | "landing";
  className?: string;
  intensity?: "low" | "medium" | "high";
  children?: React.ReactNode;
  animationStyle?: "liquid" | "stripe" | "bubble";
}

/**
 * A dynamic animated background component with liquid/paint-like animations
 * Supports multiple animation styles: liquid (default), stripe (Stripe-inspired), bubble
 */
export default function AnimatedBackground({
  variant = "consumer",
  className = "",
  intensity = "medium",
  animationStyle = "liquid",
  children,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  
  const intensityFactors = {
    low: 0.5,
    medium: 1,
    high: 2
  };
  
  const speedFactor = intensityFactors[intensity];
  
  // Determine color scheme based on variant
  const getColors = () => {
    switch (variant) {
      case "partner":
        return [
          "rgba(15, 23, 42, 0.8)",    // slate-900
          "rgba(30, 41, 59, 0.7)",    // slate-800
          "rgba(15, 23, 42, 0.6)",    // slate-900
          "rgba(51, 65, 85, 0.5)",    // slate-700
          "rgba(6, 182, 212, 0.3)",   // cyan-500
          "rgba(56, 189, 248, 0.2)",  // sky-400
          "rgba(59, 130, 246, 0.15)", // blue-500
          "rgba(6, 90, 143, 0.1)",    // blue-800
        ];
      case "countdown":
        return [
          "rgba(76, 110, 255, 0.4)",   // brand blue (#4C6EFF)
          "rgba(95, 159, 255, 0.35)",  // brand light blue (#5F9FFF)
          "rgba(99, 102, 241, 0.3)",   // indigo-500
          "rgba(79, 70, 229, 0.25)",   // indigo-600
          "rgba(67, 56, 202, 0.2)",    // indigo-700
          "rgba(124, 58, 237, 0.15)",  // purple-600
          "rgba(139, 92, 246, 0.1)",   // purple-500
          "rgba(55, 48, 163, 0.15)",   // indigo-800
        ];
      case "landing":
        return [
          "rgba(76, 110, 255, 0.35)",   // brand blue (#4C6EFF)
          "rgba(95, 159, 255, 0.3)",    // brand light blue (#5F9FFF)
          "rgba(59, 130, 246, 0.25)",   // blue-500
          "rgba(96, 165, 250, 0.2)",    // blue-400
          "rgba(147, 197, 253, 0.25)",  // blue-300
          "rgba(191, 219, 254, 0.15)",  // blue-200
          "rgba(37, 99, 235, 0.15)",    // blue-600
          "rgba(29, 78, 216, 0.1)",     // blue-700
        ];
      case "auth":
        return [
          "rgba(59, 130, 246, 0.4)",  // blue-500
          "rgba(91, 33, 182, 0.25)",  // purple-800
          "rgba(125, 211, 252, 0.3)", // sky-300
          "rgba(199, 210, 254, 0.2)", // indigo-200
          "rgba(79, 70, 229, 0.15)",  // indigo-600
          "rgba(147, 197, 253, 0.25)", // blue-300
          "rgba(37, 99, 235, 0.1)",   // blue-600
          "rgba(191, 219, 254, 0.15)", // blue-200
        ];
      case "consumer":
      default:
        return [
          "rgba(59, 130, 246, 0.25)", // blue-500
          "rgba(56, 189, 248, 0.2)",  // sky-400
          "rgba(6, 182, 212, 0.15)",  // cyan-500
          "rgba(125, 211, 252, 0.3)", // sky-300
          "rgba(147, 197, 253, 0.25)", // blue-300
          "rgba(191, 219, 254, 0.15)", // blue-200
          "rgba(219, 234, 254, 0.1)", // blue-100
          "rgba(37, 99, 235, 0.1)",   // blue-600
        ];
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      if (canvas) {
        // Set canvas dimensions to match parent container
        const parentElement = canvas.parentElement;
        if (parentElement) {
          const { width, height } = parentElement.getBoundingClientRect();
          canvas.width = width;
          canvas.height = height;
          setDimensions({ width, height });
        }
      }
    };

    // Initial resize
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !dimensions.width || !dimensions.height) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get colors for the selected variant
    const colors = getColors();
    
    // Animation objects based on selected style
    if (animationStyle === "stripe") {
      // Stripe-like animation with diagonal flowing gradients
      let time = 0;
      const stripes = Array.from({ length: 6 }, (_, i) => ({
        color: colors[i % colors.length],
        width: 150 + Math.random() * 250, // Width of stripe
        offset: Math.random() * 200, // Initial position offset
        speed: (0.1 + Math.random() * 0.2) * speedFactor, // Movement speed
        angle: 30 + Math.random() * 25, // Angle in degrees (around 45° for diagonal)
        opacity: 0.4 + Math.random() * 0.6, // Varying opacity for depth
      }));
      
      const animate = () => {
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        time += 0.005 * speedFactor;
        
        // Base background gradient
        const baseGradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height);
        
        if (variant === "partner") {
          baseGradient.addColorStop(0, "rgba(15, 23, 42, 0.95)");
          baseGradient.addColorStop(1, "rgba(30, 41, 59, 0.95)");
        } else if (variant === "auth") {
          baseGradient.addColorStop(0, "rgba(241, 245, 249, 0.9)");
          baseGradient.addColorStop(1, "rgba(248, 250, 252, 0.9)");
        } else if (variant === "countdown" || variant === "landing") {
          baseGradient.addColorStop(0, "rgba(241, 245, 249, 0.95)");
          baseGradient.addColorStop(1, "rgba(248, 250, 252, 0.95)");
        } else {
          baseGradient.addColorStop(0, "rgba(241, 245, 249, 0.9)");
          baseGradient.addColorStop(1, "rgba(248, 250, 252, 0.9)");
        }
        
        ctx.fillStyle = baseGradient;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
        
        // Draw animated stripes
        stripes.forEach((stripe) => {
          ctx.save();
          
          // Move stripe position
          stripe.offset += stripe.speed;
          if (stripe.offset > dimensions.width + dimensions.height) {
            stripe.offset = -stripe.width;
          }
          
          // Calculate stripe coordinates based on angle
          const angle = stripe.angle * (Math.PI / 180);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);
          
          // Create gradient for the stripe
          const startX = -stripe.width + stripe.offset * cos;
          const startY = stripe.offset * sin;
          const endX = dimensions.width + stripe.width;
          const endY = dimensions.height;
          
          const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
          gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
          gradient.addColorStop(0.2, stripe.color);
          gradient.addColorStop(0.8, stripe.color);
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
          
          ctx.fillStyle = gradient;
          
          // Rotate context for angled stripes
          ctx.translate(dimensions.width / 2, dimensions.height / 2);
          ctx.rotate(angle);
          ctx.translate(-dimensions.width / 2, -dimensions.height / 2);
          
          // Draw stripe with varying thickness
          const yPos = (stripe.offset * 2) % (dimensions.height * 2) - stripe.width;
          ctx.fillRect(-stripe.width, yPos, dimensions.width + stripe.width * 2, stripe.width);
          
          ctx.restore();
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    } else if (animationStyle === "bubble") {
      // Bubble animation with floating circles
      const bubbles = Array.from({ length: 15 }, () => ({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        radius: 10 + Math.random() * 40,
        dx: (Math.random() - 0.5) * 0.2 * speedFactor,
        dy: -0.1 - Math.random() * 0.3 * speedFactor, // Mostly upward
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.1 + Math.random() * 0.3,
      }));
      
      const animate = () => {
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        
        // Background color
        let bgColor = "rgba(255, 255, 255, 0.97)";
        if (variant === "partner") bgColor = "rgba(15, 23, 42, 0.97)";
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
        
        // Draw bubbles
        bubbles.forEach(bubble => {
          // Update position
          bubble.x += bubble.dx;
          bubble.y += bubble.dy;
          
          // Reset bubbles that go out of bounds
          if (bubble.y + bubble.radius < 0) {
            bubble.y = dimensions.height + bubble.radius;
            bubble.x = Math.random() * dimensions.width;
          }
          
          // Wrap around horizontally
          if (bubble.x - bubble.radius > dimensions.width) bubble.x = -bubble.radius;
          if (bubble.x + bubble.radius < 0) bubble.x = dimensions.width + bubble.radius;
          
          // Draw bubble
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
          ctx.fillStyle = bubble.color;
          ctx.fill();
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    } else {
      // Default liquid animation with wobbly blobs
      const blobs = Array.from({ length: 7 }, (_, i) => ({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        radius: 60 + Math.random() * 120,
        dx: (Math.random() - 0.5) * 0.5 * speedFactor,
        dy: (Math.random() - 0.5) * 0.5 * speedFactor,
        color: colors[i % colors.length],
        phase: Math.random() * Math.PI * 2, // Random starting phase
        phaseSpeed: 0.002 + Math.random() * 0.003, // Random phase speed
        amplitude: 10 + Math.random() * 20, // Random amplitude for wobble
      }));

      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);

        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height);
        if (variant === "partner") {
          gradient.addColorStop(0, "rgba(15, 23, 42, 0.8)");
          gradient.addColorStop(0.8, "rgba(30, 41, 59, 0.7)");
          gradient.addColorStop(1, "rgba(51, 65, 85, 0.5)");
        } else if (variant === "auth") {
          gradient.addColorStop(0, "rgba(241, 245, 249, 0.7)");
          gradient.addColorStop(0.5, "rgba(241, 245, 249, 0.4)");
          gradient.addColorStop(1, "rgba(241, 245, 249, 0.5)");
        } else if (variant === "countdown" || variant === "landing") {
          gradient.addColorStop(0, "rgba(241, 245, 249, 0.8)");
          gradient.addColorStop(0.5, "rgba(241, 245, 249, 0.5)");
          gradient.addColorStop(1, "rgba(241, 245, 249, 0.7)");
        } else {
          gradient.addColorStop(0, "rgba(241, 245, 249, 0.1)");
          gradient.addColorStop(0.5, "rgba(241, 245, 249, 0.05)");
          gradient.addColorStop(1, "rgba(241, 245, 249, 0.1)");
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        // Draw blobs
        blobs.forEach((blob) => {
          ctx.save();
          
          // Update blob position
          blob.x += blob.dx;
          blob.y += blob.dy;
          blob.phase += blob.phaseSpeed;

          // Boundary check and bounce
          if (blob.x < -blob.radius) blob.x = dimensions.width + blob.radius;
          if (blob.x > dimensions.width + blob.radius) blob.x = -blob.radius;
          if (blob.y < -blob.radius) blob.y = dimensions.height + blob.radius;
          if (blob.y > dimensions.height + blob.radius) blob.y = -blob.radius;

          // Draw blob as a wobbly circle
          ctx.beginPath();
          ctx.fillStyle = blob.color;
          
          // Draw a wobbly circle using bezier curves
          for (let i = 0; i < 8; i++) {
            const angle1 = (i / 8) * Math.PI * 2;
            const angle2 = ((i + 1) / 8) * Math.PI * 2;
            
            const wobbleAmount = Math.sin(blob.phase + i) * blob.amplitude;
            
            const x1 = blob.x + (blob.radius + wobbleAmount) * Math.cos(angle1);
            const y1 = blob.y + (blob.radius + wobbleAmount) * Math.sin(angle1);
            
            const midAngle = (angle1 + angle2) / 2;
            const midWobble = Math.sin(blob.phase + i + 0.5) * blob.amplitude;
            const cpX = blob.x + (blob.radius * 1.2 + midWobble) * Math.cos(midAngle);
            const cpY = blob.y + (blob.radius * 1.2 + midWobble) * Math.sin(midAngle);
            
            if (i === 0) {
              ctx.moveTo(x1, y1);
            } else {
              ctx.quadraticCurveTo(cpX, cpY, x1, y1);
            }
          }
          
          // Close the path
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });
      
        animationRef.current = requestAnimationFrame(animate);
      };

      animate();
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, variant, speedFactor, animationStyle]);

  // Determine blur amount based on animation style
  const getBlurAmount = () => {
    switch (animationStyle) {
      case "stripe": return "blur(60px)";
      case "bubble": return "blur(40px)";
      default: return "blur(120px)";
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0"
        style={{ 
          filter: getBlurAmount(),
          opacity: animationStyle === "stripe" ? 0.9 : 1 
        }}
      />
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
}