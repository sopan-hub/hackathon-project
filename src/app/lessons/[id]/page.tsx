import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { lessons } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

export default function LessonPage({ params }: { params: { id: string } }) {
  const lesson = lessons.find((l) => l.id === params.id);

  if (!lesson) {
    notFound();
  }

  // A simple markdown to HTML converter
  const renderMarkdown = (text: string) => {
    return text
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-6 mb-2 font-headline">{paragraph.substring(3)}</h2>;
        }
        if (paragraph.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold mt-4 mb-2 font-headline">{paragraph.substring(4)}</h3>;
        }
        if (paragraph.startsWith('*   ')) {
          const items = paragraph.split('\n').map((item, i) => <li key={i} className="mb-2 ml-4 list-disc">{item.substring(4)}</li>);
          return <ul key={index}>{items}</ul>
        }
        if (paragraph.startsWith('![') && paragraph.includes('](')) {
          const parts = paragraph.match(/!\[(.*)\]\((.*)\s"(.*)"\)/);
          if (parts) {
            return <Image key={index} alt={parts[1]} src={parts[2]} title={parts[3]} width={600} height={400} className="rounded-lg my-4 mx-auto" data-ai-hint="lesson illustration" />;
          }
        }
        return <p key={index} className="leading-relaxed text-foreground/90">{paragraph}</p>;
      })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="mb-4">
            <Link href="/lessons" className="text-sm text-primary hover:underline">
              &larr; Back to Lessons
            </Link>
          </div>
          <Badge variant="default" className="w-fit mb-2">{lesson.ecoPoints} Eco-Points</Badge>
          <CardTitle className="text-4xl font-headline">{lesson.title}</CardTitle>
          <CardDescription className="text-lg">{lesson.description}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none space-y-4">
          {renderMarkdown(lesson.content)}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-bold mb-4 font-headline">Ready to test your knowledge?</h3>
            <p className="text-muted-foreground mb-4">Complete the quiz to earn your eco-points and solidify your learning.</p>
            <Button asChild size="lg">
              <Link href={`/lessons/${lesson.id}/quiz`}>
                Take the Quiz <Icons.chevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
