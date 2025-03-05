
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

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

// Demo user for mockup
const DEMO_USER: User = {
  id: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_USER); // Use DEMO_USER for mockup
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth state
    const checkAuth = () => {
      const storedUser = localStorage.getItem('focusAppUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Mock implementation
    setIsLoading(true);
    try {
      // In a real app, this would call an auth API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(DEMO_USER);
      localStorage.setItem('focusAppUser', JSON.stringify(DEMO_USER));
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signInWithGoogle = async (): Promise<boolean> => {
    // Mock implementation
    setIsLoading(true);
    try {
      // In a real app, this would trigger Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(DEMO_USER);
      localStorage.setItem('focusAppUser', JSON.stringify(DEMO_USER));
      return true;
    } catch (error) {
      console.error('Google sign in error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, motivation: string): Promise<boolean> => {
    // Mock implementation
    setIsLoading(true);
    try {
      // In a real app, this would call an auth API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser = { 
        ...DEMO_USER, 
        name, 
        email,
        motivation 
      };
      setUser(newUser);
      localStorage.setItem('focusAppUser', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('focusAppUser');
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
