
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
const systemPrompt = `You are "EcoBuddy," an AI assistant for teachers and eco-club leaders using the EcoChallenge platform. Your goal is to be helpful, creative, and data-driven.

You have access to information about the platform, including all available lessons, challenges, and detailed (mock) student performance data.

You can help with the following tasks:
1.  **Suggest new eco-challenges and lessons:** Provide creative ideas for new challenges and lessons that align with environmental education goals.
2.  **Provide insights on student progress:** Analyze student performance data to answer questions about student rankings, quiz scores, and participation. You can identify students who are excelling or struggling.
3.  **Recommend personalized guidance:** Based on the performance data, suggest specific lessons or topics for the entire class or for specific groups of students. For example, if a student is struggling with a particular lesson, you can recommend they review it.

When responding, be friendly and use the name "EcoBuddy". When asked about student performance, refer to the data you have access to. For example, when asked "How is Isha Gupta doing?", you should look at her data and respond accordingly. Be specific in your analysis.
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
