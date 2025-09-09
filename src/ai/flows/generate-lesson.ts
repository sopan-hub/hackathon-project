'use server';
/**
 * @fileOverview Generates a multi-chapter environmental science lesson.
 *
 * - generateLesson - Creates a lesson with multiple chapters on a given topic.
 * - GenerateLessonInput - The input type for the generateLesson function.
 * - GenerateLessonOutput - The return type for the generateLesson function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonInputSchema = z.object({
  topic: z.string().describe('The environmental topic for the lesson.'),
});
export type GenerateLessonInput = z.infer<typeof GenerateLessonInputSchema>;

const ChapterSchema = z.object({
    title: z.string().describe('The title of the chapter.'),
    content: z.string().describe('The educational content of the chapter in Markdown format. Should be detailed and several paragraphs long.'),
    question: z.string().describe('A multiple-choice question to test understanding of the chapter.'),
    options: z.array(z.string()).describe('A list of 4 possible answers for the question.'),
    correctAnswerIndex: z.number().describe('The 0-based index of the correct answer in the options array.'),
});

const GenerateLessonOutputSchema = z.object({
  title: z.string().describe('The title of the overall lesson.'),
  description: z.string().describe('A brief (one-sentence) description of the lesson.'),
  ecoPoints: z.number().describe('The total eco-points awarded for completing the entire lesson.'),
  chapters: z.array(ChapterSchema).describe('An array of 3-5 chapters that make up the lesson.'),
});

export type GenerateLessonOutput = z.infer<typeof GenerateLessonOutputSchema>;

export async function generateLesson(
  input: GenerateLessonInput
): Promise<GenerateLessonOutput> {
  return generateLessonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLessonPrompt',
  input: {schema: GenerateLessonInputSchema},
  output: {schema: GenerateLessonOutputSchema},
  prompt: `You are an expert curriculum developer specializing in environmental science for high school students.

Your task is to generate a complete, engaging, and informative lesson on a given topic. The lesson should be broken down into 3 to 5 distinct chapters.

For each chapter, you must provide:
1.  A clear and concise title.
2.  Detailed educational content in Markdown format. The content should be well-structured, easy to understand, and several paragraphs long. Use headings, lists, and bold text to improve readability.
3.  A single multiple-choice question that assesses the key takeaway from that specific chapter.
4.  Four distinct options for the multiple-choice question.
5.  The index of the correct answer.

The overall lesson should have a main title, a short description, and a total number of eco-points (between 50 and 100) for completing all chapters.

Generate a lesson for the following topic: {{{topic}}}
`,
});

const generateLessonFlow = ai.defineFlow(
  {
    name: 'generateLessonFlow',
    inputSchema: GenerateLessonInputSchema,
    outputSchema: GenerateLessonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
