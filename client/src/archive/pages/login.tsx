import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/hooks/use-auth';
import { MainLayout } from '@/components/layout';

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      toast({
        title: "Already logged in",
        description: "You are already logged in to your account.",
      });
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate, toast]);
  
  // Handle email/password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // For now, we just redirect to the Google auth
      // In the future, this would handle email/password login
      window.location.href = "/api/auth/google";
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
      });
      setIsSubmitting(false);
    }
  };
  
  // Animated background gradients
  const gradientVariants = {
    initial: { opacity: 0.5 },
    animate: { 
      opacity: 0.8,
      transition: { 
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse" as const,
      }
    },
  };
  
  return (
    <MainLayout>
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-slate-900 to-black">
        {/* Animated background gradients */}
        <motion.div 
          className="absolute inset-0 -z-10 opacity-30"
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/30 rounded-full blur-3xl"
            variants={gradientVariants}
            custom={1}
          />
          <motion.div 
            className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-3xl"
            variants={gradientVariants}
            custom={2}
          />
          <motion.div 
            className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-cyan-500/20 rounded-full blur-3xl"
            variants={gradientVariants}
            custom={3}
          />
        </motion.div>
        
        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md z-10"
        >
          <GlassCard>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight text-white">Welcome back</CardTitle>
              <CardDescription className="text-gray-300">
                Sign in to your Briki account to continue
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <GoogleLoginButton text="Sign in with Google" />
              
              <div className="flex items-center my-4">
                <Separator className="flex-1" />
                <span className="px-3 text-sm text-gray-300">OR</span>
                <Separator className="flex-1" />
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <Input
                    id="email"
                    type="email" 
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 placeholder:text-gray-400 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-200">Password</Label>
                    <Button 
                      variant="link" 
                      className="p-0 text-sm text-blue-400 hover:text-blue-300"
                      onClick={() => navigate('/auth/forgot-password')}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 placeholder:text-gray-400 text-white"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-300">
                Don't have an account?{" "}
                <Button 
                  variant="link" 
                  onClick={() => navigate('/auth/register')}
                  className="p-0 text-blue-400 hover:text-blue-300"
                >
                  Sign up
                </Button>
              </p>
            </CardFooter>
          </GlassCard>
        </motion.div>
      </div>
    </MainLayout>
  );
}