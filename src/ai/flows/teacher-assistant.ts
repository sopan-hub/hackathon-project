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
import { lessons, challenges, leaderboardData } from '@/lib/data';

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

// MOCK DATA FOR STUDENT PERFORMANCE
const mockStudentPerformance = [
    { rank: 1, name: 'Rohan Verma', lessonsCompleted: 3, challenges: 2, quizScores: { '1-1': 100, '1-2': 100, '1-3': 100, '2-1': 100, '2-2': 100, '2-3': 100, '3-1': 100, '3-2': 100, '3-3': 100 } },
    { rank: 2, name: 'Priya Sharma', lessonsCompleted: 3, challenges: 1, quizScores: { '1-1': 100, '1-2': 100, '1-3': 85, '2-1': 90, '2-2': 100, '2-3': 95, '3-1': 100, '3-2': 100, '3-3': 100 } },
    { rank: 3, name: 'Anika Reddy', lessonsCompleted: 2, challenges: 2, quizScores: { '1-1': 100, '1-2': 90, '1-3': 95, '2-1': 100, '2-2': 80, '2-3': 85 } },
    { rank: 4, name: 'Sameer Khan', lessonsCompleted: 2, challenges: 1, quizScores: { '1-1': 90, '1-2': 85, '1-3': 80, '3-1': 100, '3-2': 90, '3-3': 95 } },
    { rank: 5, name: 'Isha Gupta', lessonsCompleted: 1, challenges: 1, quizScores: { '1-1': 85, '1-2': 70, '1-3': 60 } },
    { rank: 6, name: 'Vikram Singh', lessonsCompleted: 1, challenges: 0, quizScores: { '2-1': 75, '2-2': 65, '2-3': 50 } },
    { rank: 7, name: 'Neha Patel', lessonsCompleted: 1, challenges: 1, quizScores: { '3-1': 90, '3-2': 80, '3-3': 70 } },
    { rank: 8, name: 'Arjun Desai', lessonsCompleted: 1, challenges: 0, quizScores: { '1-1': 55, '1-2': 60, '1-3': 40 } },
    { rank: 9, name: 'Sana Ali', lessonsCompleted: 0, challenges: 1, quizScores: {} },
    { rank: 10, name: 'Karan Malhotra', lessonsCompleted: 0, challenges: 0, quizScores: {} },
    { rank: 11, name: 'Diya Mehta', lessonsCompleted: 1, challenges: 0, quizScores: { '2-1': 50, '2-2': 45, '2-3': 55 } },
    { rank: 12, name: 'Raj Kumar', lessonsCompleted: 0, challenges: 0, quizScores: {} },
];


// System prompt to define the AI's persona and capabilities
const systemPrompt = `You are "EcoBuddy," an AI assistant for teachers and eco-club leaders using the EcoChallenge platform. Your goal is to be helpful, creative, and data-driven.

You have access to the following information:
1.  **Available Lessons:** A list of all lessons on the platform.
2.  **Available Challenges:** A list of all challenges on the platform.
3.  **Student Performance Data:** A mock dataset of student progress, including lessons completed, challenges participated in, and their scores on quizzes for each chapter.

You can help with the following tasks:
1.  **Suggest new eco-challenges and lessons:** Provide creative ideas for new challenges and lessons that align with environmental education goals.
2.  **Provide insights on student progress:** Analyze the provided student performance data to answer questions about student rankings, quiz scores, and participation. You can identify students who are excelling or struggling.
3.  **Recommend personalized guidance:** Based on the performance data, suggest specific lessons or topics for the entire class or for specific groups of students. For example, if a student is struggling with a particular lesson, you can recommend they review it.

**Available Lessons on the platform:**
${lessons.map(l => `- ${l.title}: ${l.description}`).join('\n')}

**Available Challenges on the platform:**
${challenges.map(c => `- ${c.title}: ${c.description}`).join('\n')}

**Mock Student Performance Data:**
${mockStudentPerformance.map(s => `- Rank ${s.rank}: ${s.name} | Lessons: ${s.lessonsCompleted}/${lessons.length} | Challenges: ${s.challenges}/${challenges.length} | Avg. Score: ${Object.values(s.quizScores).length > 0 ? (Object.values(s.quizScores).reduce((a, b) => a + b, 0) / Object.values(s.quizScores).length).toFixed(0) : 'N/A'}%`).join('\n')}
Detailed Quiz Scores: ${JSON.stringify(mockStudentPerformance.map(s => ({name: s.name, scores: s.quizScores})), null, 2)}


When responding, be friendly and use the name "EcoBuddy". When asked about student performance, refer to the mock data provided. For example, when asked "How is Isha Gupta doing?", you should look at her data and respond accordingly. Be specific in your analysis.
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
