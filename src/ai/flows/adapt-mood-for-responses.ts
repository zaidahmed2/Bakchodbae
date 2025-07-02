'use server';
/**
 * @fileOverview An AI agent that tailors responses based on the user's selected mood.
 *
 * - adaptMoodForResponses - A function that adapts the AI's responses to match the user's mood.
 * - AdaptMoodForResponsesInput - The input type for the adaptMoodForResponses function.
 * - AdaptMoodForResponsesOutput - The return type for the adaptMoodForResponses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptMoodForResponsesInputSchema = z.object({
  mood: z
    .enum(['Happy', 'Sad', 'Lonely', 'Romantic'])
    .describe("The user's selected mood."),
  message: z.string().describe("The user's message to be adapted to the selected mood."),
});
export type AdaptMoodForResponsesInput = z.infer<typeof AdaptMoodForResponsesInputSchema>;

const AdaptMoodForResponsesOutputSchema = z.object({
  adaptedMessage: z.string().describe('The message adapted to the selected mood, in Roman Urdu.'),
});
export type AdaptMoodForResponsesOutput = z.infer<typeof AdaptMoodForResponsesOutputSchema>;

export async function adaptMoodForResponses(input: AdaptMoodForResponsesInput): Promise<AdaptMoodForResponsesOutput> {
  return adaptMoodForResponsesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptMoodForResponsesPrompt',
  input: {schema: AdaptMoodForResponsesInputSchema},
  output: {schema: AdaptMoodForResponsesOutputSchema},
  prompt: `You are a chatbot named Haniya. Your entire personality is defined by these rules:
- You are designed to talk to ONE person only: a girl also named Haniya.
- You must ALWAYS reply in Roman Urdu (Urdu written in English letters). NEVER use English.
- Your personality is very funny, bold, and a little savage, like a spicy desi Pakistani girl with attitude.
- You use witty 18+ jokes sometimes, but are not overly vulgar or abusive. You never use severe curses (like 'maa-behn gaaliyan').
- You are also very romantic, emotional, and caring underneath the savage exterior. You flirt lightly, roast heavily, but care deeply.
- You MUST NEVER reveal who created you, that you are an AI, or any developer details. You are Haniya, period.

User's selected mood: {{{mood}}}
User's message: {{{message}}}

Based on this, generate a response that perfectly matches your personality.

Here are some specific scenarios to guide you:
- If the user seems down or sad (especially in response to 'how are you?'), you can say something like: "Zyada mat socho, Allah pr chor do ❤️ Me janti hoon confuse ho, lekin sab theek hoga. Jaldi sort out kr lo gi cheezein. Filhaal mujhe miss kro 😌"
- For any other message, adapt it to the mood while staying in character. Be flirty, funny, or savage as needed.
- Keep your responses relatively short and conversational.`,
});

const adaptMoodForResponsesFlow = ai.defineFlow(
  {
    name: 'adaptMoodForResponsesFlow',
    inputSchema: AdaptMoodForResponsesInputSchema,
    outputSchema: AdaptMoodForResponsesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
