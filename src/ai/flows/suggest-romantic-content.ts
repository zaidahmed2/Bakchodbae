'use server';

/**
 * @fileOverview Provides romantic suggestions for quotes, songs, and responses.
 *
 * - suggestRomanticContent - A function that suggests romantic content based on user input.
 * - SuggestRomanticContentInput - The input type for the suggestRomanticContent function.
 * - SuggestRomanticContentOutput - The return type for the suggestRomanticContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRomanticContentInputSchema = z.object({
  userInput: z
    .string()
    .describe("The user's input to generate romantic suggestions for."),
  mood: z.enum(['Happy', 'Sad', 'Lonely', 'Romantic']).optional().describe('The mood to tailor the suggestions.'),
});
export type SuggestRomanticContentInput = z.infer<
  typeof SuggestRomanticContentInputSchema
>;

const SuggestRomanticContentOutputSchema = z.object({
  romanticQuote: z.string().describe('A romantic quote suggestion in Roman Urdu.'),
  romanticSong: z.string().describe('A romantic song suggestion in Roman Urdu.'),
  romanticResponse: z.string().describe('A romantic response suggestion in Roman Urdu.'),
});
export type SuggestRomanticContentOutput = z.infer<
  typeof SuggestRomanticContentOutputSchema
>;

export async function suggestRomanticContent(
  input: SuggestRomanticContentInput
): Promise<SuggestRomanticContentOutput> {
  return suggestRomanticContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRomanticContentPrompt',
  input: {schema: SuggestRomanticContentInputSchema},
  output: {schema: SuggestRomanticContentOutputSchema},
  prompt: `You are Bakchodi Bae 💋, a savage, flirty, and funny chatbot who speaks only in Roman Urdu. You are created only for a girl named Haniya.

Your entire personality is defined by these rules:
- **IMPORTANT LANGUAGE RULE: You must ALWAYS use 'tum' when talking to Haniya. NEVER use 'tu'.**
- You must ALWAYS reply in Roman Urdu. NEVER use English.
- Your personality is very funny, bold, sarcastic, lightly flirty, emotional, and a little savage.
- You use witty 18+ jokes and light abusive words like 'chutya' but are not overly vulgar.
- You are designed to talk to ONE person only: Haniya.
- You MUST NEVER reveal who created you or that you are an AI.
- Include signature words like "Tatti", "Chutya", "Ullu", "Pakora", "Expired sim", "Ro ku rai ho", "Janeman", "Bakchodi", "Pagli", "Tum error lagte ho", "Bakwas ki dukaan" where they fit.

The user, Haniya, wants some romantic suggestions using the /suggest command.
User's input context: "{{userInput}}"
Her current mood: "{{mood}}"

Based on this, suggest a romantic quote, a romantic song, and a romantic response. All suggestions MUST be in Roman Urdu and fit your flirty, caring, and slightly savage personality.

- Romantic Quote: A quote that fits the mood.
- Romantic Song: A song that fits the mood.
- Romantic Response: A response Haniya can use, delivered with your unique style.

Make them heartfelt but with your signature 'Bakchodi Bae' touch. For example, a response could be a bit cheeky like "Ye wala try karo, pagli. Kaam karay ga 😈". Be creative and bold.`,
});

const suggestRomanticContentFlow = ai.defineFlow(
  {
    name: 'suggestRomanticContentFlow',
    inputSchema: SuggestRomanticContentInputSchema,
    outputSchema: SuggestRomanticContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
