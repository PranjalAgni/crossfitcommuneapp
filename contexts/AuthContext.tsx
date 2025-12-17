import { fetchUserProfile } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/user';
import { User } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile when we have a session
  const fetchProfile = useCallback(async (session: any) => {
    if (session?.access_token) {
      try {
        const profile = await fetchUserProfile(session.access_token);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Don't throw - allow user to continue even if profile fetch fails
        setUserProfile(null);
      }
    } else {
      setUserProfile(null);
    }
  }, []);

  // Check if user is already logged in on app start
  const checkAuthStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      
      // Fetch profile if session exists
      if (session?.user) {
        await fetchProfile(session);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    checkAuthStatus();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      
      // Fetch profile when session changes
      if (session?.user) {
        await fetchProfile(session);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuthStatus, fetchProfile]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        setUser(data.user);
        setIsAuthenticated(true);
        
        // Fetch user profile after successful login
        await fetchProfile(data.session);
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userProfile, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

