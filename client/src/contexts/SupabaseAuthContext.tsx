import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';
import { useLocation } from 'wouter';

// Define the User type for our app
export interface AppUser {
  id: string;
  email: string;
  name?: string | null;
  avatar_url?: string | null;
  role?: string | null;
}

// Auth context type definition
export interface SupabaseAuthContextType {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: (returnTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Creating the context with a default value
export const SupabaseAuthContext = createContext<SupabaseAuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function SupabaseAuthProvider({ children }: Props) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Convert Supabase User to our AppUser format
  const convertSupabaseUser = (supabaseUser: User | null): AppUser | null => {
    if (!supabaseUser) return null;
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || 
             supabaseUser.user_metadata?.name ||
             supabaseUser.email?.split('@')[0] ||
             'User',
      avatar_url: supabaseUser.user_metadata?.avatar_url || null,
      role: supabaseUser.user_metadata?.role || 'user'
    };
  };

  // Load user on mount and handle auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping auth initialization');
      setIsLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(convertSupabaseUser(initialSession.user));
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(convertSupabaseUser(session?.user || null));
        setIsLoading(false);

        // Handle auth events
        if (event === 'SIGNED_IN' && session?.user) {
          toast({
            title: 'Welcome to Briki!',
            description: `Signed in as ${session.user.email}`,
          });
          
          // Redirect to home or dashboard
          navigate('/');
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: 'Signed out',
            description: 'You have been successfully signed out.',
          });
          
          // Redirect to home page
          navigate('/');
        }
      }
    );

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [toast, navigate]);

  // Sign in with Google
  const signInWithGoogle = async (returnTo?: string) => {
    if (!isSupabaseConfigured()) {
      toast({
        title: 'Authentication unavailable',
        description: 'Supabase is not configured. Please contact support.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: returnTo || `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google sign in error:', error);
        toast({
          title: 'Sign in failed',
          description: error.message || 'Failed to sign in with Google',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        title: 'Sign in failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  // Sign out
  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      toast({
        title: 'Sign out unavailable',
        description: 'Supabase is not configured.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: 'Sign out failed',
          description: error.message || 'Failed to sign out',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign out failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(convertSupabaseUser(currentUser));
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: SupabaseAuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
    refreshUser,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

// Hook to use the Supabase auth context
export function useSupabaseAuth(): SupabaseAuthContextType {
  const context = useContext(SupabaseAuthContext);
  
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  
  return context;
} 