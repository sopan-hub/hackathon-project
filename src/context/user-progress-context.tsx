
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import type { Badge, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const profileData = userDoc.data() as UserProfile;
          setUserProfile(profileData);
          setEcoPoints(profileData.eco_points || 0);
          setCompletedLessons(profileData.completed_lessons || []);
          setBadges(profileData.badges || []);
        } else {
          // Handle case where user is authenticated but has no profile document
          setUserProfile({
            id: firebaseUser.uid,
            full_name: firebaseUser.displayName || 'New User',
            email: firebaseUser.email || '',
            avatar_url: firebaseUser.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${firebaseUser.uid}`,
            eco_points: 0,
            completed_lessons: [],
            badges: [],
            role: 'Student',
          });
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setEcoPoints(0);
        setCompletedLessons([]);
        setBadges([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addEcoPoints = (points: number) => {
    // This will be updated later to write to Firestore
    setEcoPoints((prevPoints) => prevPoints + points);
  };

  const completeLesson = (lessonId: string) => {
    // This will be updated later to write to Firestore
    setCompletedLessons((prevLessons) => {
      if (!prevLessons.includes(lessonId)) {
        return [...prevLessons, lessonId];
      }
      return prevLessons;
    });
  };

  const addBadge = (badge: Badge) => {
     // This will be updated later to write to Firestore
    setBadges((prevBadges) => {
      if (!prevBadges.some(b => b.id === badge.id)) {
        return [...prevBadges, badge];
      }
      return prevBadges;
    });
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
