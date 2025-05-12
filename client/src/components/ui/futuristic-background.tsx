import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

interface FuturisticBackgroundProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
}

export const FuturisticBackground: React.FC<FuturisticBackgroundProps> = ({
  className = "",
  particleCount = 60,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);
  const isInitialized = useRef(false);

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: getRandomColor(),
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
  };

  // Get random particle color - blue hues for futuristic look
  const getRandomColor = () => {
    const blueHues = [
      "#3B82F6", // primary blue
      "#60A5FA", // lighter blue
      "#93C5FD", // lightest blue
      "#2563EB", // darker blue
      "#1E40AF", // darkest blue
      "#6366F1", // indigo
    ];
    return blueHues[Math.floor(Math.random() * blueHues.length)];
  };

  // Animation loop
  const animate = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw particles and connections
    particles.current.forEach((particle, index) => {
      // Move particles
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Boundary check
      if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > height) particle.speedY *= -1;

      // Interactive effect - particles react to mouse
      if (interactive && mousePosition.current.x && mousePosition.current.y) {
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 500;
          particle.speedX -= Math.cos(angle) * force;
          particle.speedY -= Math.sin(angle) * force;
        }
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw connections between particles
      for (let j = index + 1; j < particles.current.length; j++) {
        const otherParticle = particles.current[j];
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = particle.color;
          ctx.globalAlpha = (1 - distance / 120) * 0.2;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });

    // Draw glow in the center
    const gradient = ctx.createRadialGradient(
      width / 2, 
      height / 2, 
      0, 
      width / 2, 
      height / 2, 
      width / 3
    );
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.1)");
    gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 0.5;

    // Horizontal lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Continue animation
    animationFrame.current = requestAnimationFrame(animate);
  };

  // Handle resize
  const handleResize = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Set canvas to parent size
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      
      // Reinitialize particles
      if (isInitialized.current) {
        initParticles(canvas.width, canvas.height);
      }
    }
  };

  // Track mouse position
  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current || !interactive) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    mousePosition.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // Initialize on mount
    handleResize();
    initParticles(canvas.width, canvas.height);
    isInitialized.current = true;
    
    // Start animation
    animate();
    
    // Add event listeners
    window.addEventListener("resize", handleResize);
    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [particleCount, interactive]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
    </div>
  );
};

// Static background with data visualization particles
export const DataVisualizationBackground: React.FC<{ className?: string }> = ({ 
  className = "" 
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10" />
      
      {/* Data particles */}
      <div className="ai-data-particle absolute left-[10%] top-[20%] animate-ping" style={{ animationDuration: "4s" }} />
      <div className="ai-data-particle absolute left-[30%] top-[50%] animate-ping" style={{ animationDuration: "6s", animationDelay: "1s" }} />
      <div className="ai-data-particle absolute left-[70%] top-[30%] animate-ping" style={{ animationDuration: "5s", animationDelay: "0.5s" }} />
      <div className="ai-data-particle absolute left-[85%] top-[60%] animate-ping" style={{ animationDuration: "7s", animationDelay: "1.5s" }} />
      <div className="ai-data-particle absolute left-[20%] top-[80%] animate-ping" style={{ animationDuration: "5.5s", animationDelay: "0.7s" }} />
      <div className="ai-data-particle absolute left-[50%] top-[70%] animate-ping" style={{ animationDuration: "4.5s", animationDelay: "1.2s" }} />
      
      {/* Grid lines */}
      <div className="absolute inset-0 grid grid-cols-12 gap-4 opacity-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-full border-r border-primary/30" />
        ))}
      </div>
      
      <div className="absolute inset-0 grid grid-rows-12 gap-4 opacity-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-full border-b border-primary/30" />
        ))}
      </div>
      
      {/* Glow spots */}
      <div className="absolute left-1/4 top-1/3 w-32 h-32 rounded-full bg-primary/5 blur-xl" />
      <div className="absolute right-1/3 bottom-1/4 w-40 h-40 rounded-full bg-blue-500/5 blur-xl" />
    </div>
  );
};