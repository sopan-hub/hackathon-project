import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { challenges } from "@/lib/data";
import { Icons } from "@/components/icons";

export default function ChallengesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Challenges
        </h1>
        <p className="text-muted-foreground">
          Put your knowledge into action and earn bonus points.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
           <div key={challenge.id} className="eco-card">
              <div className="eco-card-title">{challenge.title}</div>
              <div className="eco-card-icon">
                <Icons.trophy className="bg-gradient-to-r from-yellow-400 to-orange-500" />
              </div>
              <div className="eco-card-content">
                  <p className="line-clamp-3">{challenge.description}</p>
                   <div className="flex items-center justify-between mt-4">
                      <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">{challenge.ecoPoints} Eco-Points</Badge>
                      <Button asChild size="sm">
                        <Link href={`/challenges/${challenge.id}`}>
                            Accept <Icons.chevronRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                  </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
