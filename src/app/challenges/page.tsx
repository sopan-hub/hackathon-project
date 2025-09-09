import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="flex flex-col overflow-hidden">
            <CardHeader className="p-0">
               <Link href={`/challenges/${challenge.id}`}>
                <Image
                  alt={challenge.title}
                  className="aspect-video w-full object-cover"
                  data-ai-hint={challenge.dataAiHint}
                  height={250}
                  src={challenge.imageUrl}
                  width={400}
                />
              </Link>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <Badge className="mb-2 bg-accent text-accent-foreground hover:bg-accent/90">{challenge.ecoPoints} Eco-Points</Badge>
              <CardTitle className="mb-2 font-headline text-xl">
                 <Link href={`/challenges/${challenge.id}`} className="hover:text-primary">{challenge.title}</Link>
              </CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button asChild className="w-full" variant="secondary">
                <Link href={`/challenges/${challenge.id}`}>
                  Accept Challenge <Icons.chevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
