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
    .describe('The user input to generate romantic suggestions for.'),
  mood: z.enum(['Happy', 'Sad', 'Lonely', 'Romantic']).optional().describe('The mood to tailor the suggestions.'),
});
export type SuggestRomanticContentInput = z.infer<
  typeof SuggestRomanticContentInputSchema
>;

const SuggestRomanticContentOutputSchema = z.object({
  romanticQuote: z.string().describe('A romantic quote suggestion.'),
  romanticSong: z.string().describe('A romantic song suggestion.'),
  romanticResponse: z.string().describe('A romantic response suggestion.'),
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
  prompt: `Based on the user input: "{{userInput}}" and mood: "{{mood}}", suggest a romantic quote, a romantic song, and a romantic response.

    Romantic Quote: A quote that reflects the user's input and mood.
    Romantic Song: A song that aligns with the user's input and mood.
    Romantic Response: A response that the user can use in a romantic context.

    Ensure each suggestion is appropriate and tailored to create a heartfelt connection.
`,
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
