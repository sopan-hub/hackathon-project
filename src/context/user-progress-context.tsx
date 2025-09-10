

'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Badge, UserProfile } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProgressContextType {
  user: User | null;
  userProfile: UserProfile | null;
  ecoPoints: number;
  completedLessons: string[];
  badges: Badge[];
  loading: boolean;
  addEcoPoints: (points: number) => void;
  completeLesson: (lessonId: string) => void;
  addBadge: (badge: Badge) => void;
  fetchUserProfile: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  resetProgress: () => void;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const resetProgress = useCallback(() => {
    setEcoPoints(0);
    setCompletedLessons([]);
    setBadges([]);
    setUserProfile(null);
  }, []);

  const fetchUserProfile = useCallback(async (user: User | null) => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile not found, create it
        console.log('Profile not found for user, creating one.');
        const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({ 
                id: user.id, 
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New User',
                avatar_url: user.user_metadata?.avatar_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.email}`,
                email: user.email
            })
            .select()
            .single();
        
        if(createError) {
            console.error('Error creating profile:', createError);
            setUserProfile(null);
        } else {
            console.log('Profile created successfully.');
            profile = newProfile;
        }
      } else if (error) {
        console.error('Error fetching profile:', error);
        setUserProfile(null);
      }

      if (profile) {
        const userWithEmail: UserProfile = { ...profile, email: user.email };
        setUserProfile(userWithEmail);
        setEcoPoints(userWithEmail.eco_points || 0);
        setCompletedLessons(userWithEmail.completed_lessons || []);
        setBadges(userWithEmail.badges || []);
      }
    } catch (e) {
        console.error("An unexpected error occurred in fetchUserProfile:", e);
        setUserProfile(null);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    const getInitialUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await fetchUserProfile(currentUser);

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          const newCurrentUser = session?.user ?? null;
          setUser(newCurrentUser);
          if (newCurrentUser && newCurrentUser.id !== user?.id) {
            await fetchUserProfile(newCurrentUser);
          } else if (!newCurrentUser) {
            resetProgress();
            setLoading(false);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
    
    getInitialUser();

  }, [fetchUserProfile, resetProgress, user?.id]);


  const updateProfile = async (updates: Partial<UserProfile>) => {
    if(!user) return;
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) {
      console.error('Error updating profile', error);
    }
  }


  const addEcoPoints = (points: number) => {
    setEcoPoints((prevPoints) => {
      const newPoints = prevPoints + points;
      updateProfile({ eco_points: newPoints });
      return newPoints;
    });
  };

  const completeLesson = (lessonId: string) => {
    setCompletedLessons((prevLessons) => {
      if (!prevLessons.includes(lessonId)) {
        const newLessons = [...prevLessons, lessonId];
        updateProfile({ completed_lessons: newLessons });
        return newLessons;
      }
      return prevLessons;
    });
  };

  const addBadge = (badge: Badge) => {
    setBadges((prevBadges) => {
      if (!prevBadges.some(b => b.id === badge.id)) {
        const newBadges = [...prevBadges, badge];
        updateProfile({ badges: newBadges as any[] }); // Cast to any to handle Supabase type
        return newBadges;
      }
      return prevBadges;
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    resetProgress();
  };

  const value = {
    user,
    userProfile,
    ecoPoints,
    completedLessons,
    badges,
    loading,
    addEcoPoints,
    completeLesson,
    addBadge,
    fetchUserProfile: fetchUserProfile as (user: User) => Promise<void>,
    logout,
    resetProgress,
  };

  return (
    <UserProgressContext.Provider value={value}>
      {loading && !userProfile ? (
           <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold">Loading EcoChallenge...</p>
                    <p className="text-muted-foreground">Please wait a moment.</p>
                </div>
            </div>
      ) : children}
    </UserProgressContext.Provider>
  );
}

export function useUserProgress() {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
}
