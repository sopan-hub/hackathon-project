
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPersonalizedLessonSuggestions } from "@/ai/flows/personalized-lesson-suggestions";
import type { PersonalizedLessonSuggestionsOutput } from "@/ai/flows/personalized-lesson-suggestions";
import { lessons } from "@/lib/data";
import { Icons } from "@/components/icons";

// Mock data to simulate new student performance
const mockQuizResults = [
  { lessonId: "1", score: 0, totalQuestions: 3 },
  { lessonId: "2", score: 0, totalQuestions: 3 },
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
      <div className="eco-card-content">
        <div className="space-y-4">
            <p className="text-muted-foreground">
            Based on your recent activity, we suggest these lessons for you.
            </p>
            {loading && (
            <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </>
            )}
            {!loading && suggestions?.suggestedLessons.map((suggestion) => (
            <div
                key={suggestion.id}
                className="eco-card p-6 grid-cols-[1fr_auto] !gap-x-4"
            >
                <div className="eco-card-title !text-lg !normal-case !self-start">
                    {suggestion.title}
                </div>
                 <div className="eco-card-icon !text-3xl">
                    <Icons.bookOpen className="bg-gradient-to-r from-green-400 to-blue-500" />
                </div>
                <div className="eco-card-content col-span-2 flex items-end justify-between gap-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {suggestion.reason}
                    </p>
                    <Button asChild variant="secondary" size="sm" className="!w-auto flex-shrink-0">
                        <Link href={`/lessons/${suggestion.id}`}>Start Lesson</Link>
                    </Button>
                </div>
            </div>
            ))}
            {!loading && (!suggestions || suggestions?.suggestedLessons.length === 0) && (
                <p className="text-center text-muted-foreground">No specific suggestions for now. Choose any lesson to begin!</p>
            )}
        </div>
      </div>
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

