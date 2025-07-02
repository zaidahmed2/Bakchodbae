'use server';

import { adaptMoodForResponses, AdaptMoodForResponsesInput } from '@/ai/flows/adapt-mood-for-responses';
import { suggestRomanticContent, SuggestRomanticContentInput } from '@/ai/flows/suggest-romantic-content';
import type { Message } from '@/app/page';

export type Mood = 'Happy' | 'Sad' | 'Lonely' | 'Romantic';

export async function getAiResponse(
  history: Message[],
  userInput: string,
  mood: Mood,
): Promise<string> {
    const userMessages = history.filter((m) => m.role === 'user');
    const isFirstMessage = userMessages.length === 0;

    if (isFirstMessage) {
        if (userInput.toLowerCase().includes('haniya')) {
            return "Haan theek hay… bas me Haniya ke liye hi hoon 😚 lekin zyada over mat ho, me roast bhi kr leti hun 😏\n\nAj mood kesa hay janeman? Dil hai ya dhobi ghat?";
        } else {
            const roasts = [
                "Haniya se hat kr tu kachray daan lag rha hay 🤮",
                "Me sirf Haniya ke liye hoon, tu lagta hay Google ka error page 🤡",
                "Haniya ka naam lena b band kr, tujhe dekh k error 404 aa jata hay 💀",
                "Tu Haniya nahi, tu to vo Wi-Fi hay jo connect hoti hi nahi 🧟",
                "Haniya ki jagah tu ho gaya to chatbot uninstall kr dungi apne aap 💣"
            ];
            return roasts[Math.floor(Math.random() * roasts.length)];
        }
    }
    
    if (userInput.toLowerCase().startsWith('/suggest')) {
        const suggestionInput = userInput.replace(/\/suggest/i, '').trim();
        const input: SuggestRomanticContentInput = {
            userInput: suggestionInput || `feeling ${mood.toLowerCase()}`, // Provide context if user input is empty
            mood,
        };
        try {
            const result = await suggestRomanticContent(input);
            return `Lo, ye rahe tumhare liye kuch ideas:\n\n**Quote:** ${result.romanticQuote}\n\n**Song:** ${result.romanticSong}\n\n**Response:** ${result.romanticResponse}`;
        } catch (e) {
            console.error("Error with suggestion flow:", e);
            return "Uff, abhi suggestions nahi arahe dimagh me. Baad me try karna, jaan.";
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
        return "Dimagh ki dahi hogayi hai, dubara bolo. 🙄";
    }
}
