

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
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') { // "Not found" error, profile doesn't exist
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
            } else if (newProfile) {
                setUserProfile({ ...newProfile, email: user.email });
                setEcoPoints(newProfile.eco_points || 0);
                setCompletedLessons(newProfile.completed_lessons || []);
                setBadges(newProfile.badges || []);
            }
        } else {
            setUserProfile(null);
        }
      } else if (data) {
        setUserProfile({ ...data, email: user.email });
        setEcoPoints(data.eco_points || 0);
        setCompletedLessons(data.completed_lessons || []);
        setBadges(data.badges || []);
      }
    } catch (e) {
        console.error("An unexpected error occurred in fetchUserProfile:", e);
        setUserProfile(null);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchUserProfile(currentUser);
        } else {
          setUserProfile(null);
          resetProgress();
        }
        setLoading(false);
      }
    );

    // Initial check for user session on component mount
    const checkInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
            await fetchUserProfile(currentUser);
        }
        setLoading(false);
    };

    checkInitialSession();


    return () => {
      subscription.unsubscribe();
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
        updateProfile({ badges: newBadges as any[] }); // Cast to any to handle Supabase type
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
      {loading ? (
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
