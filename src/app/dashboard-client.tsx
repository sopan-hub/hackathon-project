
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
     <div className="eco-card">
      <div className="eco-card-title">Personalized For You</div>
      <div className="eco-card-icon">
        <Icons.lightbulb className="bg-gradient-to-r from-yellow-400 to-orange-500" />
      </div>
      <div className="eco-card-content space-y-4">
        <p className="text-muted-foreground">
          Based on your recent activity, we suggest these lessons for you.
        </p>
        {loading && (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        )}
        {!loading && suggestions?.suggestedLessons.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-start gap-4 p-4 rounded-lg border bg-background/50"
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
      </div>
       <div className="eco-card-bar" />
        <div className="eco-card-footer">
            <Button asChild className="w-full" variant="outline">
              <Link href="/eco-advisor">
                <Icons.lightbulb className="mr-2 h-4 w-4" />
                Ask your Personal Eco-Coach
              </Link>
            </Button>
        </div>
    </div>
  );
}
