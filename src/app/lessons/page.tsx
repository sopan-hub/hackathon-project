import Link from "next/link";
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
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="eco-card">
              <div className="eco-card-title">{lesson.title}</div>
              <div className="eco-card-icon">
                <Icons.bookOpen className="bg-gradient-to-r from-green-400 to-blue-500" />
              </div>
              <div className="eco-card-content">
                  <p className="line-clamp-3">{lesson.description}</p>
                  <div className="flex items-center justify-between mt-4">
                      <Badge variant="secondary">{lesson.ecoPoints} Eco-Points</Badge>
                      <Link href={`/lessons/${lesson.id}/0`} className="text-primary font-semibold hover:underline">
                          Start Lesson <Icons.chevronRight className="inline-block ml-1 h-4 w-4" />
                      </Link>
                  </div>
              </div>
              <div className="eco-card-bar" />
          </div>
        ))}
      </div>
    </div>
  );
}
