
'use client';

import { useUserProgress } from '@/context/user-progress-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { userBadges } from '@/lib/data';

export default function ProfilePage() {
  const { userProfile, ecoPoints, badges: earnedBadges, logout } = useUserProgress();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!userProfile) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }
  
  const earnedBadgeIds = new Set(earnedBadges.map(b => b.id));

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Avatar className="h-24 w-24 border-4 border-primary/50">
          <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name} />
          <AvatarFallback className="text-3xl">
            {userProfile.full_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-4xl font-bold font-headline">{userProfile.full_name}</h1>
          <p className="text-muted-foreground">{userProfile.email}</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <Icons.logOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="eco-card">
        <div className="eco-card-title">My Progress</div>
        <div className="eco-card-icon">
          <Icons.barChart className="bg-gradient-to-r from-yellow-400 to-orange-500" />
        </div>
        <div className="eco-card-content grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 rounded-lg bg-background/50">
                <Icons.leaf className="h-10 w-10 text-primary" />
                <div>
                    <p className="text-muted-foreground">Eco-Points</p>
                    <p className="text-2xl font-bold">{ecoPoints}</p>
                </div>
            </div>
             <div className="flex items-center gap-4 p-6 rounded-lg bg-background/50">
                <Icons.award className="h-10 w-10 text-primary" />
                <div>
                    <p className="text-muted-foreground">Badges Earned</p>
                    <p className="text-2xl font-bold">{earnedBadges.length} / {userBadges.length}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="eco-card">
        <div className="eco-card-title">My Badges</div>
         <div className="eco-card-icon">
          <Icons.award className="bg-gradient-to-r from-purple-400 to-pink-500" />
        </div>
        <div className="eco-card-content">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {userBadges.map((badge) => (
              <div key={badge.id} className={cn(
                "text-center p-4 rounded-lg transition-opacity",
                 earnedBadgeIds.has(badge.id) ? "opacity-100 bg-background/80" : "opacity-40 bg-background/30"
              )}>
                  <div className="p-3 bg-secondary rounded-full inline-block mb-2">
                    <badge.icon className={cn(
                      "h-8 w-8",
                      earnedBadgeIds.has(badge.id) ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <h3 className="font-semibold text-sm">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.description}
                  </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
