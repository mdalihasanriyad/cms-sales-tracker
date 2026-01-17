import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  monthly_target: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface RateLimitInfo {
  retryAfter?: number;
  attemptsRemaining?: number;
  attemptsCount?: number;
}

interface AuthResult {
  error: Error | null;
  rateLimitInfo?: RateLimitInfo | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: AppRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      setProfile(profileData);

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) {
        console.error('Error fetching role:', roleError);
        setRole('user');
        return;
      }

      setRole(roleData.role);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer Supabase calls with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
        }

        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    return { error };
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('rate-limited-auth', {
        body: { email, password, action: 'signin' }
      });

      if (invokeError) {
        return { error: invokeError, rateLimitInfo: null };
      }

      if (data.error) {
        const rateLimitInfo = {
          retryAfter: data.retryAfter,
          attemptsRemaining: data.attemptsRemaining,
          attemptsCount: data.attemptsCount
        };
        return { 
          error: new Error(data.error), 
          rateLimitInfo: data.retryAfter ? rateLimitInfo : null 
        };
      }

      // Set the session from the edge function response
      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });
      }

      return { error: null, rateLimitInfo: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'An unexpected error occurred'), rateLimitInfo: null };
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('rate-limited-auth', {
        body: { email, password, action: 'signup', fullName }
      });

      if (invokeError) {
        return { error: invokeError, rateLimitInfo: null };
      }

      if (data.error) {
        const rateLimitInfo = {
          retryAfter: data.retryAfter,
          attemptsRemaining: data.attemptsRemaining,
          attemptsCount: data.attemptsCount
        };
        return { 
          error: new Error(data.error), 
          rateLimitInfo: data.retryAfter ? rateLimitInfo : null 
        };
      }

      // Set the session from the edge function response
      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });
      }

      return { error: null, rateLimitInfo: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'An unexpected error occurred'), rateLimitInfo: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    role,
    isAdmin: role === 'admin',
    isLoading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
