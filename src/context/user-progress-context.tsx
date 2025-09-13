
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Badge, UserProfile } from '@/lib/types';
import { userBadges } from '@/lib/data';

interface UserProgressContextType {
  userProfile: UserProfile | null;
  ecoPoints: number;
  completedLessons: string[];
  badges: Badge[];
  loading: boolean;
  addEcoPoints: (points: number) => void;
  completeLesson: (lessonId: string) => void;
  addBadge: (badge: Badge) => void;
  logout: () => Promise<void>; // Kept for type consistency, but will be a no-op
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

// Mock data for a static user experience
const mockUserProfile: UserProfile = {
  id: 'mock-user-123',
  full_name: 'Alex Doe',
  avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=alexdoe`,
  eco_points: 125,
  completed_lessons: ['1'],
  badges: userBadges.slice(0, 2),
  email: 'alex.doe@example.com',
};


export function UserProgressProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setLoading(true);
    setTimeout(() => {
      setUserProfile(mockUserProfile);
      setEcoPoints(mockUserProfile.eco_points);
      setCompletedLessons(mockUserProfile.completed_lessons);
      setBadges(mockUserProfile.badges);
      setLoading(false);
    }, 500);
  }, []);

  const addEcoPoints = (points: number) => {
    setEcoPoints((prevPoints) => prevPoints + points);
  };

  const completeLesson = (lessonId: string) => {
    setCompletedLessons((prevLessons) => {
      if (!prevLessons.includes(lessonId)) {
        return [...prevLessons, lessonId];
      }
      return prevLessons;
    });
  };

  const addBadge = (badge: Badge) => {
    setBadges((prevBadges) => {
      if (!prevBadges.some(b => b.id === badge.id)) {
        return [...prevBadges, badge];
      }
      return prevBadges;
    });
  };

  const logout = async () => {
    // No-op since authentication is removed
    console.log("Logout function called, but authentication is removed.");
  };

  const value: UserProgressContextType = {
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
