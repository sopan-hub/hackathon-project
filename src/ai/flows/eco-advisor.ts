'use server';
/**
 * @fileOverview An AI-powered environmental advisor that analyzes images.
 *
 * - ecoAdvisor - A function that handles the environmental analysis of an image.
 * - EcoAdvisorInput - The input type for the ecoAdvisor function.
 * - EcoAdvisorOutput - The return type for the ecoAdvisor function.
 * - chatWithAdvisor - A function to handle chat conversations with the advisor.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema for the main advisor flow
const EcoAdvisorInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a real-world environmental situation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EcoAdvisorInput = z.infer<typeof EcoAdvisorInputSchema>;

// Output Schema for the main advisor flow
const EcoAdvisorOutputSchema = z.object({
  aiCategory: z
    .string()
    .describe(
      'The identified category of the environmental situation (e.g., plastic_waste, tree, water_leak, pollution, solar_panel, litter).'
    ),
  aiVerdict: z
    .string()
    .describe('The verdict on whether the situation is eco-friendly or harmful (e.g., positive, negative).'),
  immediateAction: z
    .string()
    .describe('The immediate action the student can take today.'),
  shortTermAction: z
    .string()
    .describe('A short-term action for the next few days/weeks.'),
  longTermAction: z
    .string()
    .describe('A long-term sustainable habit to adopt.'),
});
export type EcoAdvisorOutput = z.infer<typeof EcoAdvisorOutputSchema>;

// Exported wrapper function for the main advisor flow
export async function ecoAdvisor(
  input: EcoAdvisorInput
): Promise<EcoAdvisorOutput> {
  return ecoAdvisorFlow(input);
}

// Prompt for the main advisor flow
const advisorPrompt = ai.definePrompt({
  name: 'ecoAdvisorPrompt',
  input: {schema: EcoAdvisorInputSchema},
  output: {schema: EcoAdvisorOutputSchema},
  prompt: `You are an expert environmental advisor.

A student has uploaded a photo of a real-world environmental situation. Your task is to:

1. Identify and classify what is in the photo (e.g., plastic waste, tree, water leak, pollution, solar panel, litter).
2. Determine whether the situation is eco-friendly or harmful.
3. Provide actionable guidance for the student in three steps:
   a. Immediate Action — what they can do today.
   b. Short-Term Action — what they can do in the next few days/weeks.
   c. Long-Term Habits — sustainable behaviors to maintain or improve the environment.
4. Include encouragement and explanation so the student learns from the feedback.

Analyze this photo: {{media url=photoDataUri}}`,
});

// Main advisor flow definition
const ecoAdvisorFlow = ai.defineFlow(
  {
    name: 'ecoAdvisorFlow',
    inputSchema: EcoAdvisorInputSchema,
    outputSchema: EcoAdvisorOutputSchema,
  },
  async input => {
    const {output} = await advisorPrompt(input);
    return output!;
  }
);


// Schema for the chat functionality
const ChatInputSchema = z.object({
  message: z.string().describe("The user's message to the chat advisor."),
  history: z.array(z.any()).describe("The chat history.")
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI advisor's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


// Exported wrapper function for the chat flow
export async function chatWithAdvisor(input: ChatInput): Promise<ChatOutput> {
    return chatAdvisorFlow(input);
}

// Chat flow definition
const chatAdvisorFlow = ai.defineFlow({
    name: 'chatAdvisorFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
}, async (input) => {
    const history = input.history || [];

    const llmResponse = await ai.generate({
        prompt: input.message,
        history: history,
        model: 'googleai/gemini-2.5-flash',
    });

    return { response: llmResponse.text };
});
