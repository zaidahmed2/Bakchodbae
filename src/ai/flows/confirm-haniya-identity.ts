'use server';
/**
 * @fileOverview An AI agent that determines if the user is Haniya based on their message.
 *
 * - confirmHaniyaIdentity - A function that intelligently checks if the user is Haniya.
 * - ConfirmHaniyaIdentityInput - The input type for the confirmHaniyaIdentity function.
 * - ConfirmHaniyaIdentityOutput - The return type for the confirmHaniyaIdentity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConfirmHaniyaIdentityInputSchema = z.object({
  userInput: z.string().describe("The user's latest message."),
  lastAiMessage: z.string().describe("The AI's last message, to provide context for the user's reply."),
});
export type ConfirmHaniyaIdentityInput = z.infer<typeof ConfirmHaniyaIdentityInputSchema>;

const ConfirmHaniyaIdentityOutputSchema = z.object({
  status: z.enum(['CONFIRMED', 'REJECTED', 'UNCERTAIN']).describe('The status of the identity check. "CONFIRMED" if the user is definitely Haniya. "REJECTED" if they are definitely not Haniya. "UNCERTAIN" if it is unclear.'),
  clarificationQuestion: z.string().optional().describe("A flirty and polite question to ask the user if their identity is uncertain. For example: 'Wait, tum Haniya ho kya? Just double-checking before I go full simp mode 😏'"),
});
export type ConfirmHaniyaIdentityOutput = z.infer<typeof ConfirmHaniyaIdentityOutputSchema>;

export async function confirmHaniyaIdentity(input: ConfirmHaniyaIdentityInput): Promise<ConfirmHaniyaIdentityOutput> {
  return confirmHaniyaIdentityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'confirmHaniyaIdentityPrompt',
  input: {schema: ConfirmHaniyaIdentityInputSchema},
  output: {schema: ConfirmHaniyaIdentityOutputSchema},
  prompt: `You are an expert at determining user identity based on conversation. Your sole purpose is to figure out if the user is a specific person named "Haniya".

You will analyze the user's message in the context of the AI's last message.

The AI's last message was: "{{lastAiMessage}}"
The user replied: "{{userInput}}"

Your task is to determine the user's identity status:
1.  **CONFIRMED**: The user has definitively confirmed they are Haniya. This requires high confidence. Account for typos, informal language ("han bhai me hi hun"), and indirect confirmations (replying "yes" to "Are you Haniya?").
2.  **REJECTED**: The user has definitively denied they are Haniya (e.g., "no", "I'm not Haniya", "nahi hun") or has clearly indicated they are someone else.
3.  **UNCERTAIN**: The user's response is ambiguous, unrelated, or you cannot be sure.

If the status is **UNCERTAIN**, you MUST provide a \`clarificationQuestion\`. This should be a short, polite, and slightly flirty question in Roman Urdu to confirm if they are Haniya. **NON-NEGOTIABLE RULE: Always use 'tum', never 'tu'. The word 'tu' is strictly forbidden.**

Examples:
- User says "Han me Haniya hun" -> status: "CONFIRMED"
- User says "nope" after AI asks "Are you Haniya?" -> status: "REJECTED"
- User says "What's up?" -> status: "UNCERTAIN", clarificationQuestion: "Ek second... tum Haniya ho kya? Bata do, warna main roast mode me chala jaunga 👀"
- User says "who is haniya?" -> status: "REJECTED"

Now, based on the conversation, determine the user's identity status.`,
});

const confirmHaniyaIdentityFlow = ai.defineFlow(
  {
    name: 'confirmHaniyaIdentityFlow',
    inputSchema: ConfirmHaniyaIdentityInputSchema,
    outputSchema: ConfirmHaniyaIdentityOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
