

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

  const fetchUserProfile = useCallback(async (user: User | null) => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      setUserProfile(null);
    } else if (data) {
      setUserProfile({ ...data, email: user.email });
      setEcoPoints(data.eco_points || 0);
      setCompletedLessons(data.completed_lessons || []);
      setBadges(data.badges || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      await fetchUserProfile(user);
      setLoading(false);
    }
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
        resetProgress();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserProfile]);


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
        updateProfile({ badges: newBadges });
        return newBadges;
      }
      return prevBadges;
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    resetProgress();
  };

  const resetProgress = () => {
    setEcoPoints(0);
    setCompletedLessons([]);
    setBadges([]);
  }

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
      {loading ? null : children}
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
