'use server';
/**
 * @fileOverview Summarizes eco-project ideas from the community forum.
 *
 * - summarizeEcoProjectIdeas - A function that summarizes eco-project ideas.
 * - SummarizeEcoProjectIdeasInput - The input type for the summarizeEcoProjectIdeas function.
 * - SummarizeEcoProjectIdeasOutput - The return type for the summarizeEcoProjectIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEcoProjectIdeasInputSchema = z.object({
  projectIdeaText: z.string().describe('The text of the eco-project idea to summarize.'),
});
export type SummarizeEcoProjectIdeasInput = z.infer<typeof SummarizeEcoProjectIdeasInputSchema>;

const SummarizeEcoProjectIdeasOutputSchema = z.object({
  summary: z.string().describe('A short summary of the eco-project idea.'),
});
export type SummarizeEcoProjectIdeasOutput = z.infer<typeof SummarizeEcoProjectIdeasOutputSchema>;

export async function summarizeEcoProjectIdeas(
  input: SummarizeEcoProjectIdeasInput
): Promise<SummarizeEcoProjectIdeasOutput> {
  return summarizeEcoProjectIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEcoProjectIdeasPrompt',
  input: {schema: SummarizeEcoProjectIdeasInputSchema},
  output: {schema: SummarizeEcoProjectIdeasOutputSchema},
  prompt: `Summarize the following eco-project idea in a concise and informative way:

  {{{projectIdeaText}}}
  `,
});

const summarizeEcoProjectIdeasFlow = ai.defineFlow(
  {
    name: 'summarizeEcoProjectIdeasFlow',
    inputSchema: SummarizeEcoProjectIdeasInputSchema,
    outputSchema: SummarizeEcoProjectIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
