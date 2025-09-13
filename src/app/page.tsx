
'use client';
import Link from "next/link";
import {
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { challenges, communityPosts, userBadges, lessons } from "@/lib/data";
import { Icons } from "@/components/icons";
import { DashboardClient } from "./dashboard-client";
import { useUserProgress } from "@/context/user-progress-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const { user, userProfile, ecoPoints, completedLessons, badges, loading } = useUserProgress();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  if (loading || !userProfile) {
    return null;
  }
  
  const nextBadge = userBadges.find(b => !badges.some(userBadge => userBadge.id === b.id));
  const lessonsCompletedCount = lessons.filter(l => completedLessons.includes(l.id)).length;
  
  // Mock data for global impact
  const totalTreesPlanted = 1245;
  const totalWaterSaved = 89000;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome{userProfile ? `, ${userProfile.full_name}` : ''}!
        </h1>
        <p className="text-muted-foreground">
          Here's your eco-progress. Let's get started!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="eco-card p-6">
            <div className="eco-card-title !text-sm !uppercase !font-medium">Eco-Points</div>
             <div className="eco-card-icon !text-3xl">
                <Icons.leaf className="bg-gradient-to-r from-green-400 to-blue-500" />
              </div>
            <div className="eco-card-content">
                <div className="text-2xl font-bold">{ecoPoints}</div>
                <p className="text-xs text-muted-foreground">Complete a lesson to earn points</p>
            </div>
        </div>
        <div className="eco-card p-6">
            <div className="eco-card-title !text-sm !uppercase !font-medium">Lessons Completed</div>
            <div className="eco-card-icon !text-3xl">
                <Icons.bookOpen className="bg-gradient-to-r from-purple-400 to-pink-500" />
            </div>
            <div className="eco-card-content">
                <div className="text-2xl font-bold">{lessonsCompletedCount} / {lessons.length}</div>
                <p className="text-xs text-muted-foreground">{(lessonsCompletedCount / lessons.length * 100).toFixed(0)}% of total lessons</p>
            </div>
        </div>
         <div className="eco-card p-6 md:col-span-2 lg:col-span-1">
            <div className="eco-card-title !text-sm !uppercase !font-medium">Next Badge Progress</div>
            <div className="eco-card-icon !text-3xl">
                <Icons.sprout className="bg-gradient-to-r from-lime-400 to-green-500" />
            </div>
            <div className="eco-card-content">
                 <div className="flex items-center gap-4">
                    <div className="w-full">
                         {nextBadge ? (
                          <>
                            <div className="flex justify-between text-sm font-medium mb-1">
                              <span>{nextBadge.name}</span>
                              <span>{badges.length}/{userBadges.length}</span>
                            </div>
                            <Progress value={(badges.length / userBadges.length) * 100} />
                          </>
                        ) : (
                          <div className="text-center text-muted-foreground">You've collected all badges!</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <div className="eco-card">
         <div className="eco-card-title">Global Impact</div>
         <div className="eco-card-icon">
            <Icons.globe className="bg-gradient-to-r from-blue-400 to-purple-500" />
        </div>
        <div className="eco-card-content grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 rounded-lg bg-background/50">
                <Icons.treePine className="h-10 w-10 text-primary" />
                <div>
                    <p className="text-muted-foreground">Total Trees Planted by All Users</p>
                    <p className="text-2xl font-bold">{totalTreesPlanted.toLocaleString()}</p>
                </div>
            </div>
             <div className="flex items-center gap-4 p-6 rounded-lg bg-background/50">
                <Icons.droplets className="h-10 w-10 text-primary" />
                <div>
                    <p className="text-muted-foreground">Liters of Water Saved</p>
                    <p className="text-2xl font-bold">{totalWaterSaved.toLocaleString()}</p>
                </div>
            </div>
        </div>
      </div>

      <DashboardClient />

    </div>
  );
}
