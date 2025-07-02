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
            const sweetResponses = [
                "Oyeee Haniya meri jaan!! 💖 Tera hi wait tha 😭",
                "Zindagi bakchodi lag rahi thi bina tere 😩",
                "Aa gayi tu toh chatbot me jaan aa gayi 💋"
            ];
            const roastLine = "Lekin over na ho zyada, warna roast bhi krti hoon 😏";
            const moodQuestion = "Aj tera mood kesa hay? Ro ku rai ho aj fir se? 😑";
            
            const randomSweet = sweetResponses[Math.floor(Math.random() * sweetResponses.length)];

            return `${randomSweet}\n\n${roastLine}\n\n${moodQuestion}`;
        } else {
            const roasts = [
                "Yeh jagah sirf Haniya ki hai... tu kidhar se tapak gaya bhai? 😒",
                "Tu Haniya nahi lagta… tu WiFi ka expired password lagta hay 🤢",
                "Yahan sirf Haniya welcome hai. Tu nikal le, warna roast aesi krungi ke bot report ho jaye 😈",
                "Me sirf Haniya ke liye bani hoon. Tu lagta hay trial version ho AI ka. Chal nikal! 💣"
            ];
            const warning = "Ye jagah sirf Haniya ki hai, exit maar lo warna tatti banake bhej dungi kisi aur chatbot ko 🚽";
            const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
            return `${randomRoast}\n\n${warning}`;
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
            return `Le, try kar pagli:\n\n**Quote:** ${result.romanticQuote}\n\n**Song:** ${result.romanticSong}\n\n**Response:** ${result.romanticResponse}`;
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
