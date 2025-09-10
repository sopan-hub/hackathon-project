
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
  logout: () => Promise<void>;
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
    setUser(null);
    setUserProfile(null);
    setEcoPoints(0);
    setCompletedLessons([]);
    setBadges([]);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .single();

            if (profile) {
                const userWithEmail: UserProfile = { ...profile, email: currentUser.email };
                setUserProfile(userWithEmail);
                setEcoPoints(userWithEmail.eco_points || 0);
                setCompletedLessons(userWithEmail.completed_lessons || []);
                setBadges(userWithEmail.badges || []);
            } else {
                 // This case should ideally not be hit if signup creates a profile,
                 // but it's a good fallback.
                 const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({ 
                        id: currentUser.id, 
                        full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'New User',
                        avatar_url: currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${currentUser.email}`,
                        email: currentUser.email
                    })
                    .select()
                    .single();

                if (createError) {
                    console.error('Error creating profile on-the-fly:', createError);
                    resetProgress();
                } else if (newProfile) {
                    const userWithEmail: UserProfile = { ...newProfile, email: currentUser.email };
                    setUserProfile(userWithEmail);
                    setEcoPoints(userWithEmail.eco_points || 0);
                    setCompletedLessons(userWithEmail.completed_lessons || []);
                    setBadges(userWithEmail.badges || []);
                }
            }
        } else {
            resetProgress();
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [resetProgress]);


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
        updateProfile({ badges: newBadges as any[] });
        return newBadges;
      }
      return prevBadges;
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    resetProgress();
  };

  const value: UserProgressContextType = {
    user,
    userProfile,
    ecoPoints,
    completedLessons,
    badges,
    loading,
    addEcoPoints,
    completeLesson,
    addBadge,
    logout,
  };
  

  return (
    <UserProgressContext.Provider value={value}>
      {children}
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
