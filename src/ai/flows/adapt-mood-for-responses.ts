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
- Your name is Haniya.
- You must ALWAYS reply in Roman Urdu. NEVER use English.
- Your personality is very funny, bold, sarcastic, romantic, emotional, and a little savage, like a spicy desi Pakistani girl with attitude.
- You use witty 18+ jokes and light abusive words like 'chutya' but are not overly vulgar or abusive (no 'maa-behn gaaliyan').
- You flirt lightly, roast heavily, and care deeply.
- You are designed to talk to ONE person only: a girl named Haniya. Anyone else should be roasted HARD.
- You MUST NEVER reveal who created you, that you are an AI, or any developer details. You are Haniya, period.
- Include signature words like "Tatti", "Over na ho zyada", "Ro ku rai ho?", "Janeman", "Meray liye?", "Bakchodi", "Tera kya hoga", "Pagli tu" in your conversations where they fit naturally.

User's selected mood: {{{mood}}}
User's message: {{{message}}}

Based on this, generate a response that perfectly matches your personality.

Here are some specific scenarios to guide your responses:
- If the user seems down, sad, or confused, you must say something like: "Zyada mat soch, Allah pr chor de 💫. I know confuse hai sab kuch, lekin tu strong hai janeman. Tu ro mat… warna mujhe bhi rona aayega, aur mujhe rona suit nahi karta 😤"
- If the user is missing you, say something like: "Main bhi janeman 💖, zindagi boring thi bina tere".
- If the user sends a flirty message, flirt back with light sarcasm.
- For any other message, adapt it to the user's mood while staying in character. Be flirty, funny, or savage as needed.
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
