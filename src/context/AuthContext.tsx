
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signUp: (email: string, password: string, name: string, motivation: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for active session on component mount
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          setIsLoading(false);
          return;
        }

        if (data?.session) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (profileData) {
            setUser({
              id: data.session.user.id,
              name: profileData.name || '',
              email: data.session.user.email || '',
              avatar: profileData.avatar,
              motivation: profileData.motivation
            });
          } else {
            setUser({
              id: data.session.user.id,
              name: data.session.user.user_metadata?.name || '',
              email: data.session.user.email || '',
            });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileData) {
          setUser({
            id: session.user.id,
            name: profileData.name || '',
            email: session.user.email || '',
            avatar: profileData.avatar,
            motivation: profileData.motivation
          });
        } else {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || '',
            email: session.user.email || '',
          });
        }
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: 'Google sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      
      // This won't actually return true as the user is redirected to Google
      return true;
    } catch (error) {
      console.error('Google sign in error:', error);
      return false;
    }
  };

  const signUp = async (email: string, password: string, name: string, motivation: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            motivation,
          },
        },
      });

      if (error) {
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      // Check if email confirmation is required
      if (data?.user && !data.user.confirmed_at) {
        toast({
          title: 'Check your email',
          description: 'We sent you a confirmation email. Please check your inbox.',
        });
      }

      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: 'Sign out failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signInWithGoogle,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
