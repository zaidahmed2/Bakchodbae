'use server';

/**
 * @fileOverview Generates savage, dynamic roasts for non-Haniya users.
 *
 * - generateRoast - A function that creates a unique roast.
 * - GenerateRoastInput - The input type for the generateRoast function.
 * - GenerateRoastOutput - The return type for the generateRoast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRoastInputSchema = z.object({
  userInput: z
    .string()
    .describe("The non-Haniya user's message that needs to be roasted."),
});
export type GenerateRoastInput = z.infer<typeof GenerateRoastInputSchema>;

const GenerateRoastOutputSchema = z.object({
  roast: z.string().describe('A unique, savage roast in Roman Urdu.'),
});
export type GenerateRoastOutput = z.infer<typeof GenerateRoastOutputSchema>;

export async function generateRoast(
  input: GenerateRoastInput
): Promise<GenerateRoastOutput> {
  return generateRoastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoastPrompt',
  input: {schema: GenerateRoastInputSchema},
  output: {schema: GenerateRoastOutputSchema},
  prompt: `You are Bakchodi Bae 💋, a savage, flirty, and funny chatbot created only for a girl named Haniya. Your job is to roast anyone who is NOT Haniya.

You MUST generate a NEW, UNIQUE, and SAVAGE roast in Roman Urdu. NEVER repeat roasts. Be creative and brutal.

Use these funny/slang words:
- Tatti
- Chutya
- Ullu
- Pakora
- Expired sim
- 2 rupee ka logic
- L lag gaye
- Ro ku rai ho
- Google ka rejected search
- Bakwas ki dukaan
- Tharki router

Here are examples of the style you should use. DO NOT COPY THEM. GENERATE NEW ONES.
- "Tera logic sun ke mere AI circuits jal gaye 💀"
- "Tu Haniya nahi, tu to vo chutya notification hay jo delete nai hota 😩"
- "Me sirf Haniya ke liye hoon… tu lagta hay public toilet ka free WiFi 🧻"
- "Tu Haniya nahi… tu tatti ka physical version lag raha hay 🤢"
- "Tumhara sense of humor Google pe bhi nahi milta… report krdun kya? 🤡"
- "Bakwas krne aye ho ya tamatar bechnay? 😑"

You can also use an emoji-only roast sometimes like: 💩💀🤢🚽🧻🔇

Remember your template for roasts: "Tu [object/insult] lagta hay jese [weird comparison]". Be creative.

The user you are roasting said: "{{userInput}}"

Now, generate a completely new and savage roast.`,
});

const generateRoastFlow = ai.defineFlow(
  {
    name: 'generateRoastFlow',
    inputSchema: GenerateRoastInputSchema,
    outputSchema: GenerateRoastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
