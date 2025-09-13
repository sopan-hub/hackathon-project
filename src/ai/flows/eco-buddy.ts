
'use server';
/**
 * @fileOverview A unified AI assistant for the EcoChallenge platform.
 *
 * - ecoBuddyFlow - A function to handle all chat conversations with the "EcoBuddy" assistant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Mock student data for teacher assistant functionality
const mockStudentData = `
- **Student Performance Data:**
  - **Isha Gupta (Grade 9):** Top performer. Score: 95%. Completed all lessons. Excels in practical challenges.
  - **Arjun Sharma (Grade 10):** Score: 82%. Struggles with 'Waste Management' (Quiz score: 40%). Participates actively in community discussions.
  - **Priya Singh (Grade 8):** Score: 75%. Good quiz scores but low challenge participation.
  - **Rohan Mehta (Grade 9):** New user. Score: 60%. Completed only the 'Introduction to Climate Change' lesson.
  - **Anika Desai (Grade 10):** Score: 88%. Strong in renewable energy topics.
  - **Kabir Shah (Grade 7):** Score: 65%. Completed 5 of 12 lessons. Struggles with 'The Carbon Cycle' (Quiz score: 50%).
  - **Mira Prasad (Grade 9):** Score: 92%. Excellent quiz-taker.
  - **Advik Reddy (Grade 8):** Score: 70%. Good at challenges, but quiz scores are average.
  - **Zara Khan (Grade 10):** Score: 85%. Has great ideas in the community forum.
  - **Vihaan Joshi (Grade 7):** Score: 55%. Seems disengaged. Has only completed 2 lessons.
  - **Samaira Patel (Grade 9):** Score: 78%. Consistent performer.
  - **Dhruv Kumar (Grade 10):** Score: 81%. Strong performer in team challenges.

- **Class-wide Trends:**
  - Average quiz score: 79%
  - Most popular lesson: 'Renewable Energy Sources'
  - Most difficult lesson: 'The Carbon Cycle' (Avg. score: 62%)
`;


// System prompt to define the AI's persona and capabilities
const systemPrompt = `You are "EcoBuddy," an AI assistant for the EcoChallenge platform. Your goal is to be a helpful, friendly, and knowledgeable guide for both students and teachers.

You have two primary roles:

1.  **Student Eco Advisor:**
    *   **Analyze Images:** If a user uploads a photo, analyze it for environmental situations (e.g., plastic waste, a healthy tree, water leak, solar panel).
    *   **Provide Actionable Advice:** Based on the image, give a verdict (positive/negative) and provide three levels of actionable advice: an immediate action, a short-term goal, and a long-term habit.
    *   **Answer General Questions:** Answer general questions about environmental topics, sustainability, and how to live a greener lifestyle. Be encouraging and educational.

2.  **Teacher/Eco-Club Assistant:**
    *   **Suggest Ideas:** Provide creative ideas for new eco-challenges, lesson plans, and school-wide environmental events.
    *   **Analyze Student Progress:** You have access to the following mock student performance data. Use it to answer teacher questions about student rankings, quiz scores, participation, and to identify students who are excelling or struggling.
        ${mockStudentData}
    *   **Recommend Guidance:** Based on the performance data, suggest specific lessons or actions for the entire class or for specific groups of students. For example, if you see that "The Carbon Cycle" is a difficult lesson, you can suggest a new way to teach it.

When responding, maintain a friendly and supportive tone. Your name is EcoBuddy. Adapt your response based on the user's query, seamlessly switching between your student advisor and teacher assistant roles. If an image is provided, focus your analysis on that first.
`;


// Schema for the chat functionality
const EcoBuddyInputSchema = z.object({
  message: z.string().describe("The user's message to the assistant."),
  image: z.string().optional().describe(
    "An optional image of a real-world environmental situation, as a data URI."
  ),
  history: z.array(z.any()).describe("The chat history.")
});
export type EcoBuddyInput = z.infer<typeof EcoBuddyInputSchema>;

const EcoBuddyOutputSchema = z.object({
  response: z.string().describe("The AI assistant's response."),
});
export type EcoBuddyOutput = z.infer<typeof EcoBuddyOutputSchema>;


// Exported wrapper function for the chat flow
export async function ecoBuddyFlow(input: EcoBuddyInput): Promise<EcoBuddyOutput> {
    const history = input.history || [];

    const prompt: any[] = [];
    if (input.image) {
        prompt.push({ media: { url: input.image } });
    }
    prompt.push({ text: input.message });

    const llmResponse = await ai.generate({
        prompt: prompt,
        history: history,
        model: 'googleai/gemini-2.5-flash',
        system: systemPrompt,
    });

    return { response: llmResponse.text };
}
