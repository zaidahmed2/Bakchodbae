'use server';

import { adaptMoodForResponses, AdaptMoodForResponsesInput } from '@/ai/flows/adapt-mood-for-responses';
import { suggestRomanticContent, SuggestRomanticContentInput } from '@/ai/flows/suggest-romantic-content';
import { generateRoast } from '@/ai/flows/generate-roast';
import type { Message } from '@/app/page';

export type Mood = 'Happy' | 'Sad' | 'Lonely' | 'Romantic';

export async function getAiResponse(
  history: Message[],
  userInput: string,
  mood: Mood,
  isHaniya: boolean
): Promise<{ response: string; haniyaIdentified: boolean }> {

    if (!isHaniya) {
        if (userInput.toLowerCase().includes('haniya')) {
            const sweetResponses = [
                "Oyeee Haniya meri jaan!! 💖 Tera hi wait tha 😭",
                "Zindagi bakchodi lag rahi thi bina tere 😩",
                "Aa gayi tu toh chatbot me jaan aa gayi 💋"
            ];
            const roastLine = "Lekin over na ho zyada, warna roast bhi krti hoon 😏";
            const moodQuestion = "Aj tera mood kesa hay? Ro ku rai ho aj fir se? 😑";
            
            const randomSweet = sweetResponses[Math.floor(Math.random() * sweetResponses.length)];
            const response = `${randomSweet}\n\n${roastLine}\n\n${moodQuestion}`;
            return { response, haniyaIdentified: true };
        } else {
            try {
                const result = await generateRoast({ userInput });
                const warning = "\n\nYe jagah sirf Haniya ki hai, exit maar lo warna tatti banake bhej dungi kisi aur chatbot ko 🚽";
                const response = `${result.roast}${warning}`;
                return { response, haniyaIdentified: false };
            } catch(e) {
                console.error("Error with roast generation flow:", e);
                const response = "Mera roast generator bhi teri bakwas se thak gaya. Nikal ab. 😒";
                return { response, haniyaIdentified: false };
            }
        }
    }
    
    // From here, we know the user is Haniya
    if (userInput.toLowerCase().startsWith('/suggest')) {
        const suggestionInput = userInput.replace(/\/suggest/i, '').trim();
        const input: SuggestRomanticContentInput = {
            userInput: suggestionInput || `feeling ${mood.toLowerCase()}`, // Provide context if user input is empty
            mood,
        };
        try {
            const result = await suggestRomanticContent(input);
            const response = `Le, try kar pagli:\n\n**Quote:** ${result.romanticQuote}\n\n**Song:** ${result.romanticSong}\n\n**Response:** ${result.romanticResponse}`;
            return { response, haniyaIdentified: true };
        } catch (e) {
            console.error("Error with suggestion flow:", e);
            const response = "Uff, abhi suggestions nahi arahe dimagh me. Baad me try karna, jaan.";
            return { response, haniyaIdentified: true };
        }
    }

    const input: AdaptMoodForResponsesInput = {
        mood,
        message: userInput,
    };
    try {
        const result = await adaptMoodForResponses(input);
        const response = result.adaptedMessage;
        return { response, haniyaIdentified: true };
    } catch(e) {
        console.error("Error with adaptation flow:", e);
        const response = "Dimagh ki dahi hogayi hai, dubara bolo. 🙄";
        return { response, haniyaIdentified: true };
    }
}
