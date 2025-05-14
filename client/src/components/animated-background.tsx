import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: "consumer" | "partner" | "auth";
  className?: string;
  intensity?: "low" | "medium" | "high";
  children?: React.ReactNode;
}

/**
 * A dynamic animated background component with liquid/paint-like animations
 */
export default function AnimatedBackground({
  variant = "consumer",
  className = "",
  intensity = "medium",
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

    // Create blobs
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

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, variant, speedFactor]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0"
        style={{ filter: "blur(120px)" }}
      />
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
}