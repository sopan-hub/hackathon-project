import { userBadges } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";

export default function ProfilePage() {
    const earnedBadges: typeof userBadges = []; // Simulate user having earned no badges
    const unearnedBadges = userBadges;

  return (
    <div className="space-y-8">
      <div className="eco-card">
        <div className="eco-card-content !p-0">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://picsum.photos/100/100?random=10" alt="@alex" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold font-headline">Alex Doe</h1>
              <p className="text-muted-foreground">Joined December 2023</p>
              <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-xs text-muted-foreground">Eco-Points</div>
                </div>
                <Separator orientation="vertical" className="h-10"/>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{earnedBadges.length}</div>
                  <div className="text-xs text-muted-foreground">Badges</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          My Badges
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {earnedBadges.length === 0 && (
             <div className="eco-card text-center p-6 col-span-full">
                <div className="eco-card-content col-span-2 text-center items-center flex flex-col">
                    <p className="text-lg text-muted-foreground">You haven't earned any badges yet. Complete lessons and challenges to get started!</p>
                </div>
            </div>
          )}
          {earnedBadges.map((badge) => (
            <div key={badge.id} className="eco-card text-center p-6">
                <div className="eco-card-title !text-lg !self-center !text-center col-span-2">{badge.name}</div>
                <div className="eco-card-content col-span-2 text-center items-center flex flex-col">
                  <div className="p-4 bg-secondary rounded-full mb-4">
                      <badge.icon className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
            </div>
          ))}
           {unearnedBadges.map((badge) => (
            <div key={badge.id} className="eco-card text-center p-6 opacity-50">
                <div className="eco-card-title !text-lg !self-center !text-center col-span-2 text-muted-foreground">{badge.name}</div>
                <div className="eco-card-content col-span-2 text-center items-center flex flex-col">
                  <div className="p-4 bg-muted rounded-full mb-4">
                      <badge.icon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
