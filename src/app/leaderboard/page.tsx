import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { leaderboardData } from "@/lib/data";
import { Icons } from "@/components/icons";

export default function LeaderboardPage() {
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

      <Card>
        <CardHeader>
          <CardTitle>Top Eco-Teams</CardTitle>
          <CardDescription>Updated daily</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Team & School</TableHead>
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
                  <TableCell className="text-right font-bold text-lg text-primary">{entry.points.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
