// src/ai/flows/personalized-lesson-suggestions.ts
'use server';

/**
 * @fileOverview Provides personalized lesson suggestions based on student quiz performance.
 *
 * - getPersonalizedLessonSuggestions - A function that suggests lessons based on quiz performance.
 * - PersonalizedLessonSuggestionsInput - The input type for the getPersonalizedLessonSuggestions function.
 * - PersonalizedLessonSuggestionsOutput - The return type for the getPersonalizedLessonSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedLessonSuggestionsInputSchema = z.object({
  quizResults: z
    .array(
      z.object({
        lessonId: z.string().describe('The ID of the lesson.'),
        score: z.number().describe('The score achieved on the quiz for the lesson.'),
        totalQuestions: z.number().describe('Total number of questions in the quiz.'),
      })
    )
    .describe('An array of quiz results for the student.'),
  availableLessons: z
    .array(
      z.object({
        id: z.string().describe('The ID of the lesson.'),
        title: z.string().describe('The title of the lesson.'),
        description: z.string().describe('A brief description of the lesson.'),
      })
    )
    .describe('An array of available lessons to suggest.'),
});

export type PersonalizedLessonSuggestionsInput = z.infer<
  typeof PersonalizedLessonSuggestionsInputSchema
>;

const PersonalizedLessonSuggestionsOutputSchema = z.object({
  suggestedLessons: z
    .array(
      z.object({
        id: z.string().describe('The ID of the suggested lesson.'),
        title: z.string().describe('The title of the suggested lesson.'),
        reason: z.string().describe('The reason why this lesson is suggested.'),
      })
    )
    .describe('An array of lessons suggested for the student.'),
});

export type PersonalizedLessonSuggestionsOutput = z.infer<
  typeof PersonalizedLessonSuggestionsOutputSchema
>;

export async function getPersonalizedLessonSuggestions(
  input: PersonalizedLessonSuggestionsInput
): Promise<PersonalizedLessonSuggestionsOutput> {
  return personalizedLessonSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedLessonSuggestionsPrompt',
  input: {schema: PersonalizedLessonSuggestionsInputSchema},
  output: {schema: PersonalizedLessonSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized lesson suggestions to students based on their quiz performance.

Given the following quiz results and available lessons, suggest lessons that the student should focus on to improve their understanding of the material.

Quiz Results:
{{#each quizResults}}
- Lesson ID: {{this.lessonId}}, Score: {{this.score}}/{{this.totalQuestions}}
{{/each}}

Available Lessons:
{{#each availableLessons}}
- ID: {{this.id}}, Title: {{this.title}}, Description: {{this.description}}
{{/each}}

Consider the following when suggesting lessons:
- Lessons with low scores should be prioritized.
- Lessons that cover foundational concepts for other lessons should also be considered.
- Provide a brief reason for each suggested lesson.

Output the suggested lessons in the following format:
{
  "suggestedLessons": [
    {
      "id": "lesson_id",
      "title": "Lesson Title",
      "reason": "Brief explanation of why this lesson is suggested."
    }
  ]
}
`,
});

const personalizedLessonSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedLessonSuggestionsFlow',
    inputSchema: PersonalizedLessonSuggestionsInputSchema,
    outputSchema: PersonalizedLessonSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
