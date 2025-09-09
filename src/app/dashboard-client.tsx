"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPersonalizedLessonSuggestions } from "@/ai/flows/personalized-lesson-suggestions";
import type { PersonalizedLessonSuggestionsOutput } from "@/ai/flows/personalized-lesson-suggestions";
import { lessons } from "@/lib/data";
import { Icons } from "@/components/icons";

// Mock data to simulate student performance
const mockQuizResults = [
  { lessonId: "1", score: 1, totalQuestions: 2 },
  { lessonId: "2", score: 2, totalQuestions: 2 },
];

const availableLessons = lessons.map((l) => ({
  id: l.id,
  title: l.title,
  description: l.description,
}));

export function DashboardClient() {
  const [suggestions, setSuggestions] = useState<PersonalizedLessonSuggestionsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        setLoading(true);
        const result = await getPersonalizedLessonSuggestions({
          quizResults: mockQuizResults,
          availableLessons,
        });
        setSuggestions(result);
      } catch (error) {
        console.error("Failed to get lesson suggestions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSuggestions();
  }, []);

  return (
     <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Icons.lightbulb className="text-accent-foreground h-6 w-6 fill-accent"/>
            <CardTitle className="font-headline">Personalized For You</CardTitle>
        </div>
        <CardDescription>
          Based on your recent activity, we suggest these lessons for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        )}
        {!loading && suggestions?.suggestedLessons.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-start gap-4 p-2 rounded-lg border"
          >
            <div className="flex-1">
              <h3 className="font-semibold">{suggestion.title}</h3>
              <p className="text-sm text-muted-foreground">
                {suggestion.reason}
              </p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link href={`/lessons/${suggestion.id}`}>Start Lesson</Link>
            </Button>
          </div>
        ))}
        {!loading && suggestions?.suggestedLessons.length === 0 && (
            <p className="text-center text-muted-foreground">Great job! No specific suggestions for now.</p>
        )}
      </CardContent>
    </Card>
  );
}
