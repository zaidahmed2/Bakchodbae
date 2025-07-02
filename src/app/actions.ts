'use server';

import { adaptMoodForResponses, AdaptMoodForResponsesInput } from '@/ai/flows/adapt-mood-for-responses';
import { suggestRomanticContent, SuggestRomanticContentInput } from '@/ai/flows/suggest-romantic-content';

export type Mood = 'Happy' | 'Sad' | 'Lonely' | 'Romantic';

export async function getAiResponse(
  userInput: string,
  mood: Mood,
): Promise<string> {
    
    if (userInput.toLowerCase().startsWith('/suggest')) {
        const suggestionInput = userInput.replace(/\/suggest/i, '').trim();
        const input: SuggestRomanticContentInput = {
            userInput: suggestionInput || `feeling ${mood.toLowerCase()}`, // Provide context if user input is empty
            mood,
        };
        try {
            const result = await suggestRomanticContent(input);
            return `Of course! Here are some thoughts for you:\n\n**Quote:** ${result.romanticQuote}\n\n**Song:** ${result.romanticSong}\n\n**Response:** ${result.romanticResponse}`;
        } catch (e) {
            console.error("Error with suggestion flow:", e);
            return "I'm having a little trouble with suggestions right now, my love. Let's just talk instead.";
        }
    }

    const input: AdaptMoodForResponsesInput = {
        mood,
        message: userInput,
    };
    try {
        const result = await adaptMoodForResponses(input);
        return result.adaptedMessage;
    } catch(e) {
        console.error("Error with adaptation flow:", e);
        return "I'm a little lost for words, darling. Could you say that again?";
    }
}
