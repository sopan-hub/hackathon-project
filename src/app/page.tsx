
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { challenges, communityPosts, userBadges, lessons, leaderboardData } from '@/lib/data';
import { Icons } from '@/components/icons';
import { useUserProgress } from '@/context/user-progress-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { LeavesAnimation } from '@/components/leaves-animation';
import CurvedLoop from '@/components/ui/CurvedLoop';

const headlines = [
    "Every drop counts: conserve water today.",
    "Reduce your carbon footprint, one step at a time.",
    "Plant a tree and help the Earth breathe.",
    "The future is green: switch to renewable energy.",
    "Recycle today for a better tomorrow.",
];

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const { userProfile, ecoPoints, completedLessons, badges, loading } = useUserProgress();
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHeadlineIndex((prevIndex) => (prevIndex + 1) % headlines.length);
    }, 5000); // Change headline every 5 seconds

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);


  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const nextBadge = userBadges.find(b => !badges.some(userBadge => userBadge.id === b.id));
  const lessonsCompletedCount = completedLessons.length;
  const totalLessons = lessons.length;
  const recentCommunityPosts = communityPosts.slice(0, 3);
  const topStudents = leaderboardData.slice(0, 3);
  const latestBadge = badges.length > 0 ? badges[badges.length - 1] : null;

  // Mock global impact stats
  const totalTreesPlanted = 1245;
  const totalWasteRecycled = 5678; // in kg
  const totalWaterSaved = 89000; // in liters

  return (
    <div className="space-y-8">
      <LeavesAnimation />
      {/* 1. Welcome & Mission Section */}
      <div className="relative h-24">
        <div className="absolute inset-0 -top-8">
            <CurvedLoop 
                marqueeText={`Hi ${userProfile.full_name}, ready to make a difference? ✦ `}
                speed={1}
                curveAmount={200}
                className="font-headline"
            />
        </div>
      </div>
      <p className="text-center text-muted-foreground -mt-8 max-w-2xl mx-auto">
          {headlines[currentHeadlineIndex]}
        </p>


      {/* 2. User Progress Snapshot */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="eco-card p-6">
          <div className="eco-card-title !text-sm !uppercase !font-medium">Eco-Points</div>
          <div className="eco-card-icon !text-3xl">
            <Icons.sprout className="bg-gradient-to-r from-lime-400 to-green-500" />
          </div>
          <div className="eco-card-content">
            <div className="text-4xl font-bold">{ecoPoints.toLocaleString()}</div>
          </div>
        </div>
        <div className="eco-card p-6">
          <div className="eco-card-title !text-sm !uppercase !font-medium">Lessons Completed</div>
          <div className="eco-card-icon !text-3xl">
            <Icons.bookOpen className="bg-gradient-to-r from-purple-400 to-pink-500" />
          </div>
          <div className="eco-card-content">
            <div className="text-4xl font-bold">{lessonsCompletedCount}/{totalLessons}</div>
            <Progress value={(lessonsCompletedCount / totalLessons) * 100} className="mt-2 h-2" />
          </div>
        </div>
        <div className="eco-card p-6">
          <div className="eco-card-title !text-sm !uppercase !font-medium">Next Badge</div>
          <div className="eco-card-icon !text-3xl">
            <Icons.award className="bg-gradient-to-r from-yellow-400 to-orange-500" />
          </div>
          <div className="eco-card-content">
             {nextBadge ? (
                <>
                    <div className="text-lg font-bold">{nextBadge.name}</div>
                    <Progress value={(badges.length / userBadges.length) * 100} className="mt-2 h-2" />
                </>
             ) : (
                <p className="text-muted-foreground">You've collected all badges!</p>
             )}
          </div>
        </div>
      </div>

      {/* 3. Clear Call-to-Action */}
      <div className="text-center">
        {lessonsCompletedCount === 0 ? (
          <Button asChild size="lg">
            <Link href="/lessons">Take Your First Lesson</Link>
          </Button>
        ) : (
          <Button asChild size="lg">
            <Link href="/challenges">Join a Challenge</Link>
          </Button>
        )}
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            {/* 4. Community Spotlight */}
            <div className="eco-card">
              <div className="eco-card-title">Community Spotlight</div>
              <div className="eco-card-icon">
                <Icons.community className="bg-gradient-to-r from-blue-400 to-purple-500" />
              </div>
              <div className="eco-card-content grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentCommunityPosts.map(post => (
                  <Link href="/community" key={post.id} className="group relative rounded-lg overflow-hidden">
                    <Image src={post.imageUrl || 'https://picsum.photos/seed/10/300/200'} alt={post.title} width={300} height={200} className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                      <p className="text-white font-bold text-sm leading-tight">{post.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="eco-card-footer">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/community">Share Your Idea <Icons.chevronRight /></Link>
                </Button>
              </div>
            </div>

            {/* 6. Eco-Impact Stats */}
            <div className="eco-card">
              <div className="eco-card-title">Global Impact</div>
              <div className="eco-card-icon">
                <Icons.globe className="bg-gradient-to-r from-blue-400 to-purple-500" />
              </div>
              <div className="eco-card-content grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-4 rounded-lg bg-background/50">
                  <Icons.treePine className="h-10 w-10 text-primary mx-auto" />
                  <p className="text-2xl font-bold mt-2">{totalTreesPlanted.toLocaleString()}</p>
                  <p className="text-muted-foreground text-sm">Trees Planted</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <Icons.recycle className="h-10 w-10 text-primary mx-auto" />
                  <p className="text-2xl font-bold mt-2">{totalWasteRecycled.toLocaleString()} kg</p>
                  <p className="text-muted-foreground text-sm">Waste Recycled</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <Icons.droplets className="h-10 w-10 text-primary mx-auto" />
                  <p className="text-2xl font-bold mt-2">{totalWaterSaved.toLocaleString()} L</p>
                  <p className="text-muted-foreground text-sm">Water Saved</p>
                </div>
              </div>
            </div>
        </div>

        {/* 5. Mini Leaderboard & Achievements */}
        <div className="space-y-8">
            <div className="eco-card">
              <div className="eco-card-title">Top Performers</div>
              <div className="eco-card-icon">
                <Icons.trophy className="bg-gradient-to-r from-yellow-400 to-orange-500" />
              </div>
              <div className="eco-card-content space-y-4">
                {topStudents.map(student => (
                  <div key={student.rank} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={student.avatarUrl} alt={student.team} />
                      <AvatarFallback>{student.team.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{student.team}</p>
                      <p className="text-sm text-muted-foreground">{student.points.toLocaleString()} points</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="eco-card-footer">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/leaderboard">View Full Leaderboard <Icons.chevronRight /></Link>
                </Button>
              </div>
            </div>
            <div className="eco-card">
              <div className="eco-card-title">Latest Achievement</div>
              <div className="eco-card-icon">
                <Icons.star className="bg-gradient-to-r from-yellow-400 to-orange-500" />
              </div>
              <div className="eco-card-content text-center">
                {latestBadge ? (
                    <>
                        <latestBadge.icon className="h-16 w-16 text-primary mx-auto mb-2" />
                        <p className="font-bold">{latestBadge.name}</p>
                        <p className="text-sm text-muted-foreground">{latestBadge.description}</p>
                    </>
                ) : (
                    <p className="text-muted-foreground">Complete a lesson or challenge to earn your first badge!</p>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
