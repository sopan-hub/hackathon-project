'use server';
/**
 * @fileOverview An AI-powered assistant for teachers and eco-club leaders.
 *
 * - teacherAssistant - A function to handle chat conversations with the assistant.
 * - TeacherAssistantInput - The input type for the teacherAssistant function.
 * - TeacherAssistantOutput - The return type for the teacherAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { lessons, challenges } from '@/lib/data';

// Schema for the chat functionality
const TeacherAssistantInputSchema = z.object({
  message: z.string().describe("The teacher's message to the assistant."),
  history: z.array(z.any()).describe("The chat history.")
});
export type TeacherAssistantInput = z.infer<typeof TeacherAssistantInputSchema>;

const TeacherAssistantOutputSchema = z.object({
  response: z.string().describe("The AI assistant's response."),
});
export type TeacherAssistantOutput = z.infer<typeof TeacherAssistantOutputSchema>;

// System prompt to define the AI's persona and capabilities
const systemPrompt = `You are "EcoBuddy," an AI assistant for teachers and eco-club leaders using the EcoChallenge platform. Your goal is to be helpful, creative, and encouraging.

You can help with the following:
1.  **Suggesting new eco-challenges and lessons:** Provide creative ideas for new challenges and lessons that align with environmental education goals.
2.  **Providing insights on student progress:** Analyze classroom performance data (you will be given mock data) and offer insights on areas where students are excelling or struggling.
3.  **Recommending personalized guidance:** Based on performance data, suggest specific lessons or topics for the entire class or for specific groups of students.

Available Lessons on the platform:
${lessons.map(l => `- ${l.title}: ${l.description}`).join('\n')}

Available Challenges on the platform:
${challenges.map(c => `- ${c.title}: ${c.description}`).join('\n')}

When responding, be friendly and use the name "EcoBuddy". Do not invent data; use the context provided.
`;


// Exported wrapper function for the chat flow
export async function teacherAssistant(input: TeacherAssistantInput): Promise<TeacherAssistantOutput> {
    return teacherAssistantFlow(input);
}

// Chat flow definition
const teacherAssistantFlow = ai.defineFlow({
    name: 'teacherAssistantFlow',
    inputSchema: TeacherAssistantInputSchema,
    outputSchema: TeacherAssistantOutputSchema,
}, async (input) => {
    const history = input.history || [];

    const llmResponse = await ai.generate({
        prompt: input.message,
        history: history,
        model: 'googleai/gemini-2.5-flash',
        system: systemPrompt,
    });

    return { response: llmResponse.text };
});
