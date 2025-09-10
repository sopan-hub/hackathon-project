
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
  fetchUserProfile: (userId: string) => Promise<void>;
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

  const fetchUserProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      setUserProfile(null);
    } else if (data) {
      setUserProfile(data);
      setEcoPoints(data.eco_points || 0);
      // Assuming completed_lessons and badges are stored as JSONB or Array fields in your profiles table
      // setCompletedLessons(data.completed_lessons || []);
      // setBadges(data.badges || []);
    }
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
       if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserProfile]);


  const addEcoPoints = async (points: number) => {
    const newPoints = ecoPoints + points;
    setEcoPoints(newPoints);
    if(user) {
        await supabase.from('profiles').update({ eco_points: newPoints }).eq('id', user.id);
    }
  };

  const completeLesson = (lessonId: string) => {
    setCompletedLessons((prevLessons) => {
      if (!prevLessons.includes(lessonId)) {
        // Here you would also update the database
        return [...prevLessons, lessonId];
      }
      return prevLessons;
    });
  };

  const addBadge = (badge: Badge) => {
    setBadges((prevBadges) => {
      if (!prevBadges.some(b => b.id === badge.id)) {
        // Here you would also update the database
        return [...prevBadges, badge];
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
    fetchUserProfile,
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
