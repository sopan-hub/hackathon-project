
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { leaderboardData, userBadges, communityPosts } from "@/lib/data";
import { Icons } from "@/components/icons";

export default function LeaderboardPage() {
    const topSchool = leaderboardData.reduce((prev, current) => (prev.points > current.points) ? prev : current);
    const mostActiveUser = leaderboardData[3]; // Mock data for example
    const bestCommunityIdea = communityPosts.sort((a,b) => (b.likes || 0) - (a.likes || 0))[0];


  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          See who's leading the charge for a greener planet.
        </p>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="eco-card p-6">
                <div className="eco-card-title !text-sm !uppercase !font-medium">Top School of the Week</div>
                <div className="eco-card-icon !text-3xl">
                    <Icons.school className="bg-gradient-to-r from-green-400 to-blue-500" />
                </div>
                <div className="eco-card-content">
                    <div className="text-xl font-bold">{topSchool.school}</div>
                    <p className="text-xs text-muted-foreground">{topSchool.points.toLocaleString()} total points</p>
                </div>
            </div>
            <div className="eco-card p-6">
                <div className="eco-card-title !text-sm !uppercase !font-medium">Most Active New User</div>
                <div className="eco-card-icon !text-3xl">
                    <Icons.user className="bg-gradient-to-r from-purple-400 to-pink-500" />
                </div>
                <div className="eco-card-content">
                    <div className="text-xl font-bold">{mostActiveUser.team}</div>
                    <p className="text-xs text-muted-foreground">from {mostActiveUser.school}</p>
                </div>
            </div>
            <div className="eco-card p-6">
                <div className="eco-card-title !text-sm !uppercase !font-medium">Best Community Idea</div>
                <div className="eco-card-icon !text-3xl">
                    <Icons.lightbulb className="bg-gradient-to-r from-yellow-400 to-orange-500" />
                </div>
                <div className="eco-card-content">
                    <div className="text-xl font-bold truncate">{bestCommunityIdea.title}</div>
                    <p className="text-xs text-muted-foreground">by {bestCommunityIdea.author}</p>
                </div>
            </div>
      </div>

      <div className="eco-card">
        <div className="eco-card-title">Top Eco-Teams</div>
        <div className="eco-card-icon">
            <Icons.barChart className="bg-gradient-to-r from-yellow-400 to-orange-500" />
        </div>
        <CardContent className="eco-card-content !p-0">
          <p className="text-muted-foreground mb-4">Updated daily</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Team & School</TableHead>
                <TableHead>Badges</TableHead>
                <TableHead className="text-right">Eco-Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry) => (
                <TableRow key={entry.rank}>
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-foreground">
                      {entry.rank === 1 && <Icons.trophy className="h-4 w-4 text-accent-foreground fill-accent" />}
                      {entry.rank !== 1 && entry.rank}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={entry.avatarUrl} alt={entry.team} />
                        <AvatarFallback>{entry.team.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{entry.team}</div>
                        <div className="text-sm text-muted-foreground">{entry.school}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {userBadges.slice(0, entry.rank === 1 ? 4 : entry.rank === 2 ? 3 : 2).map((badge) => (
                        <div key={badge.id} className="p-1 bg-secondary rounded-full">
                          <badge.icon className="h-4 w-4 text-primary" />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg text-primary">{entry.points.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </div>
    </div>
  );
}
