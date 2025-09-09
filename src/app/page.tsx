import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { challenges, communityPosts } from "@/lib/data";
import { Icons } from "@/components/icons";
import { DashboardClient } from "./dashboard-client";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome back, Alex!
        </h1>
        <p className="text-muted-foreground">
          Here's your eco-progress. Keep up the great work!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="eco-card p-6">
            <div className="eco-card-title !text-sm !uppercase !font-medium">Eco-Points</div>
             <div className="eco-card-icon !text-3xl">
                <Icons.leaf className="bg-gradient-to-r from-green-400 to-blue-500" />
              </div>
            <div className="eco-card-content">
                <div className="text-2xl font-bold">1,250</div>
                <p className="text-xs text-muted-foreground">+120 this month</p>
            </div>
        </div>
        <div className="eco-card p-6">
            <div className="eco-card-title !text-sm !uppercase !font-medium">Lessons Completed</div>
            <div className="eco-card-icon !text-3xl">
                <Icons.bookOpen className="bg-gradient-to-r from-purple-400 to-pink-500" />
            </div>
            <div className="eco-card-content">
                <div className="text-2xl font-bold">15 / 25</div>
                <p className="text-xs text-muted-foreground">60% of total lessons</p>
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
                        <div className="flex justify-between text-sm font-medium mb-1">
                        <span>Eco-Warrior</span>
                        <span>1250/2000</span>
                        </div>
                        <Progress value={(1250 / 2000) * 100} />
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DashboardClient />
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Ongoing Challenges</CardTitle>
              <CardDescription>
                Participate and earn bonus eco-points.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.slice(0, 2).map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/50"
                >
                  <img
                    alt={challenge.title}
                    className="rounded-md"
                    data-ai-hint="eco challenge"
                    height={64}
                    src={challenge.imageUrl}
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                    }}
                    width={64}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {challenge.ecoPoints} Eco-Points
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/challenges/${challenge.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Community Spotlight</CardTitle>
            <CardDescription>
              Latest ideas from fellow eco-challengers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {communityPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={post.authorAvatarUrl} />
                  <AvatarFallback>
                    {post.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold hover:underline">
                    <Link href="/community">{post.title}</Link>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    by {post.author}
                  </p>
                </div>
              </div>
            ))}
             <Button asChild className="w-full mt-2" variant="outline">
              <Link href="/community">
                <Icons.messageCircle className="mr-2 h-4 w-4" /> Go to Community
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
