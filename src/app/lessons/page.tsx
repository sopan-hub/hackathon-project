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
import { lessons } from "@/lib/data";
import { Icons } from "@/components/icons";

export default function LessonsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Lessons
        </h1>
        <p className="text-muted-foreground">
          Expand your knowledge and make a difference.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="flex flex-col overflow-hidden">
            <CardHeader className="p-0">
              <Link href={`/lessons/${lesson.id}`}>
                <Image
                  alt={lesson.title}
                  className="aspect-video w-full object-cover"
                  data-ai-hint={lesson.dataAiHint}
                  height={250}
                  src={lesson.imageUrl}
                  width={400}
                />
              </Link>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <Badge variant="secondary" className="mb-2">{lesson.ecoPoints} Eco-Points</Badge>
              <CardTitle className="mb-2 font-headline text-xl">
                 <Link href={`/lessons/${lesson.id}`} className="hover:text-primary">{lesson.title}</Link>
              </CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button asChild className="w-full">
                <Link href={`/lessons/${lesson.id}`}>
                  Start Lesson <Icons.chevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
