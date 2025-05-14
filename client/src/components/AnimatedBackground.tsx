import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import '@/styles/design-system.css';

type AnimatedBackgroundProps = {
  children: React.ReactNode;
  variant?: 'default' | 'auth' | 'travel' | 'auto' | 'pet' | 'health' | 'company';
  className?: string;
};

// Define gradient maps for different variants
const gradientMap = {
  default: {
    colors: ['#ff6b6b', '#ffb347', '#4d7cff'],
    directions: '135deg',
  },
  auth: {
    colors: ['#ff9966', '#ff5e62', '#6543d2'],
    directions: '135deg',
  },
  travel: {
    colors: ['#00c6fb', '#005bea', '#72EDF2'],
    directions: '135deg',
  },
  auto: {
    colors: ['#f093fb', '#f5576c', '#4b96f3'],
    directions: '135deg',
  },
  pet: {
    colors: ['#a1c4fd', '#c2e9fb', '#7f7fd5'],
    directions: '135deg',
  },
  health: {
    colors: ['#84fab0', '#8fd3f4', '#65c4f7'],
    directions: '135deg',
  },
  company: {
    colors: ['#6b46c1', '#4534b9', '#3c1874'],
    directions: '135deg',
  },
};

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = gradientMap[variant].colors;
  const direction = gradientMap[variant].directions;

  // Canvas animation for the flowing liquid gradient effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId: number;
    
    // Handle resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    // Create gradient background
    const createGradientBackground = (ctx: CanvasRenderingContext2D) => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    // Create flowing effect particles
    class Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      color: string;
      opacity: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 40 + 20;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.2 + 0.1; // Lower opacity for subtle effect
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        
        // Fade in and out
        if (this.life < 20) {
          this.opacity = (this.life / 20) * 0.2;
        } else if (this.life > this.maxLife - 20) {
          this.opacity = ((this.maxLife - this.life) / 20) * 0.2;
        }

        // Respawn when life is over or out of bounds
        if (this.life >= this.maxLife || 
            this.x < -this.size || this.x > width + this.size || 
            this.y < -this.size || this.y > height + this.size) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.life = 0;
          this.vx = Math.random() * 2 - 1;
          this.vy = Math.random() * 2 - 1;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        ctx.closePath();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    const particleCount = Math.min(Math.max(width, height) / 20, 30); // Responsive count

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      // Apply a semi-transparent layer to create trailing effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.01)'; // Very subtle fade
      ctx.fillRect(0, 0, width, height);
      
      // Redraw the gradient base periodically
      if (Math.random() < 0.02) { // ~2% chance each frame
        createGradientBackground(ctx);
      }

      // Apply blur for smoother effect (can be performance intensive)
      ctx.filter = 'blur(60px)';
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      // Reset filter
      ctx.filter = 'none';
      
      animationId = requestAnimationFrame(animate);
    };

    // Initial gradient
    createGradientBackground(ctx);
    
    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [variant, colors]);

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Animated gradient canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10">{children}</div>
      
      {/* Optional subtle pattern overlay */}
      <div 
        className="absolute inset-0 z-[1] opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;