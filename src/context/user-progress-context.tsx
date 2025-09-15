
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
import type { Badge, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { userBadges } from '@/lib/data';

// Mock user profile data
const mockUserProfile: UserProfile = {
  id: 'mock-user-123',
  full_name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=alex`,
  role: 'Student',
  eco_points: 125,
  completed_lessons: ['1'],
  badges: [userBadges[0], userBadges[4]],
};


interface UserProgressContextType {
  userProfile: UserProfile;
  ecoPoints: number;
  completedLessons: string[];
  badges: Badge[];
  loading: boolean;
  addEcoPoints: (points: number) => void;
  completeLesson: (lessonId: string) => void;
  addBadge: (badge: Badge) => void;
  chatOpen: boolean;
  setChatOpen: Dispatch<SetStateAction<boolean>>;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [ecoPoints, setEcoPoints] = useState(mockUserProfile.eco_points);
  const [completedLessons, setCompletedLessons] = useState<string[]>(mockUserProfile.completed_lessons);
  const [badges, setBadges] = useState<Badge[]>(mockUserProfile.badges);
  const [loading, setLoading] = useState(false); // No real loading anymore
  const [chatOpen, setChatOpen] = useState(false);

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
        toast({
            title: "Badge Unlocked!",
            description: `You've earned the "${badge.name}" badge.`
        })
        return [...prevBadges, badge];
      }
      return prevBadges;
    });
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
    chatOpen,
    setChatOpen
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
