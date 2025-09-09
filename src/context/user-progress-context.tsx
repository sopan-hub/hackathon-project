
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Badge } from '@/lib/types';

interface UserProgressContextType {
  ecoPoints: number;
  completedLessons: string[];
  badges: Badge[];
  addEcoPoints: (points: number) => void;
  completeLesson: (lessonId: string) => void;
  addBadge: (badge: Badge) => void;
  resetProgress: () => void;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const [ecoPoints, setEcoPoints] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

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

  const resetProgress = () => {
    setEcoPoints(0);
    setCompletedLessons([]);
    setBadges([]);
  }

  const value = {
    ecoPoints,
    completedLessons,
    badges,
    addEcoPoints,
    completeLesson,
    addBadge,
    resetProgress,
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
