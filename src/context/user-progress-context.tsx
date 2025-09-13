
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
      if (firebaseUser) {
        if (!userProfile || userProfile.id !== firebaseUser.uid) {
          setLoading(true);
          setUser(firebaseUser);
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const profileData = userDoc.data() as UserProfile;
              setUserProfile(profileData);
              setEcoPoints(profileData.eco_points || 0);
              setCompletedLessons(profileData.completed_lessons || []);
              setBadges(profileData.badges || []);
            }
          } catch (error) {
             console.error("Error fetching user document:", error);
          } finally {
            setLoading(false);
          }
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setEcoPoints(0);
        setCompletedLessons([]);
        setBadges([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [userProfile]);

  const updateUserProfileInFirestore = async (updatedProfile: Partial<UserProfile>) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await setDoc(userDocRef, updatedProfile, { merge: true });
      } catch (error) {
        console.error("Error updating user profile:", error);
        toast({
            variant: "destructive",
            title: "Sync Error",
            description: "Could not save your progress to the cloud."
        });
      }
    }
  };

  const addEcoPoints = (points: number) => {
    setEcoPoints((prevPoints) => {
        const newPoints = prevPoints + points;
        const currentProfile = userProfile ?? { id: user!.uid, full_name: user!.displayName!, avatar_url: user!.photoURL!, email: user!.email! };
        updateUserProfileInFirestore({ ...currentProfile, eco_points: newPoints, badges, completed_lessons: completedLessons });
        return newPoints;
    });
  };

  const completeLesson = (lessonId: string) => {
    setCompletedLessons((prevLessons) => {
      if (!prevLessons.includes(lessonId)) {
        const newLessons = [...prevLessons, lessonId];
         const currentProfile = userProfile ?? { id: user!.uid, full_name: user!.displayName!, avatar_url: user!.photoURL!, email: user!.email! };
        updateUserProfileInFirestore({ ...currentProfile, completed_lessons: newLessons, eco_points: ecoPoints, badges });
        return newLessons;
      }
      return prevLessons;
    });
  };

  const addBadge = (badge: Badge) => {
    setBadges((prevBadges) => {
      if (!prevBadges.some(b => b.id === badge.id)) {
        const newBadges = [...prevBadges, badge];
        const currentProfile = userProfile ?? { id: user!.uid, full_name: user!.displayName!, avatar_url: user!.photoURL!, email: user!.email! };
        updateUserProfileInFirestore({ ...currentProfile, badges: newBadges, eco_points: ecoPoints, completed_lessons: completedLessons });
        return newBadges;
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
