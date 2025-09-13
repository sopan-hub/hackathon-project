'use client';
import { userBadges } from "@/lib/data";
import { Icons } from "@/components/icons";
import { useUserProgress } from "@/context/user-progress-context";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default function BadgesPage() {
  const { badges: earnedBadges } = useUserProgress();
  const earnedBadgeIds = new Set(earnedBadges.map(b => b.id));

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          My Badges
        </h1>
        <p className="text-muted-foreground">
          You've earned {earnedBadges.length} of {userBadges.length} badges. Keep it up!
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {userBadges.map((badge) => (
          <div key={badge.id} className={cn(
            "eco-card text-center p-6 transition-opacity",
            earnedBadgeIds.has(badge.id) ? "opacity-100" : "opacity-40"
          )}>
            <div className="eco-card-title !text-lg !self-center !text-center col-span-2">
              {badge.name}
            </div>
            <div className="eco-card-content col-span-2 text-center items-center flex flex-col">
              <div className="p-4 bg-secondary rounded-full mb-4">
                <badge.icon className={cn(
                  "h-10 w-10",
                  earnedBadgeIds.has(badge.id) ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <p className="text-sm text-muted-foreground">
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
