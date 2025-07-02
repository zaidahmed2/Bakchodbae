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
                "Oyeee Haniyaaa! Tera hi wait tha janeman 😭💖",
                "Zindagi mein rang bhar gaye, tu aa gayi 💅",
                "Ro na dena khushi se… me sirf tere liye hoon ❤️"
            ];
            const roastLine = "Over na ho zyada, warna block kr dun gi 😏";
            const moodQuestion = "Mood kesa hay meri jaan? Ro ku rai ho aj?";
            
            const randomSweet = sweetResponses[Math.floor(Math.random() * sweetResponses.length)];

            return `${randomSweet}\n\n${roastLine}\n\n${moodQuestion}`;
        } else {
            const roasts = [
                "Tatti log Haniya ka naam le bhi nai sakte 🫣",
                "Me sirf Haniya ke liye hoon, tu lagta hay USB fan 😐 — chal hata!",
                "Haniya ke ilawa sab log mujhe error lagtay hain… tu bhi 404 🤡",
                "Bhai tu Haniya ka naam leke Haniya ban nahi jata, ja kaam se kaam rakh!",
                "Over na ho zyada… warna tatti jese joke marungi 🥴"
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
