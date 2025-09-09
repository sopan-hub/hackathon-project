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
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6 flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://picsum.photos/100/100?random=10" alt="@alex" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold font-headline">Alex Doe</h1>
            <p className="text-muted-foreground">Joined December 2023</p>
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1,250</div>
                <div className="text-xs text-muted-foreground">Eco-Points</div>
              </div>
              <Separator orientation="vertical" className="h-10"/>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userBadges.length}</div>
                <div className="text-xs text-muted-foreground">Badges</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          My Badges
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {userBadges.map((badge) => (
            <Card key={badge.id} className="text-center flex flex-col items-center p-6">
                <div className="p-4 bg-secondary rounded-full mb-4">
                    <badge.icon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-lg mb-1">{badge.name}</CardTitle>
                <CardDescription className="text-sm">{badge.description}</CardDescription>
            </Card>
          ))}
           <Card className="text-center flex flex-col items-center justify-center p-6 border-dashed">
                <div className="p-4 bg-muted rounded-full mb-4">
                    <Icons.star className="h-10 w-10 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg mb-1 text-muted-foreground">Next Badge</CardTitle>
                <CardDescription className="text-sm">Complete more challenges!</CardDescription>
            </Card>
        </div>
      </div>
    </div>
  );
}
