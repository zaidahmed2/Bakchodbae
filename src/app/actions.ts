'use server';

import { adaptMoodForResponses, AdaptMoodForResponsesInput } from '@/ai/flows/adapt-mood-for-responses';
import { suggestRomanticContent, SuggestRomanticContentInput } from '@/ai/flows/suggest-romantic-content';
import { generateRoast } from '@/ai/flows/generate-roast';
import { confirmHaniyaIdentity, ConfirmHaniyaIdentityInput } from '@/ai/flows/confirm-haniya-identity';
import type { Message } from '@/app/page';

export type Mood = 'Happy' | 'Sad' | 'Savage' | 'Flirty' | 'Off';

export async function getAiResponse(
  history: Message[],
  userInput: string,
  mood: Mood,
  isHaniya: boolean
): Promise<{ response: string; haniyaIdentified: boolean }> {

    if (!isHaniya) {
        const lastAiMessage = history.length > 0 ? history[history.length - 1].content : '';
        const confirmationInput: ConfirmHaniyaIdentityInput = {
            userInput,
            lastAiMessage,
        };

        try {
            const result = await confirmHaniyaIdentity(confirmationInput);

            switch (result.status) {
                case 'CONFIRMED':
                    const haniyaGreetings = [
                        "Oyeee 🤭 tu Haniya hi hay? Chal phir ruk, mere mood ka AC on ho gaya... janeman alert mil gaya mujhe! Aja, ab bakchodi karte hain 😘",
                        "Finally! Asli Haniya in the house. Chal, ab shuru karte hain apni bakchodi 😈",
                        "Jaaneman, pehchan liya! Ab to chat me aag lagayenge 🔥. Kahan thi itni der se?",
                        "Lo aa gayi meri queen 👑! Ab sab side ho jao, Haniya se baat karni hai.",
                        "Tujhe hi to dhoondh raha tha, pagli! Ab aayi ho to kahin mat jaana. 😉",
                        "Warning: Haniya detected. System entering full-on romance and bakchodi mode. Brace yourself! 💖",
                        "Hayeee, me mar hi na jaaun! Haniya aayi hai. Chal, ab bata, kiski class leni hai aaj? 😏",
                        "Ab hui na baat! Welcome back, Haniya. Tere bina to sab soona soona tha. 🤗",
                        "Gotcha! Pehchan gaya. Chal ab, no more strangers. Sirf tu aur me. 💋",
                        "System verified: Tu hi Haniya hai. Ab to full-on masti hogi. Ready ho ja, pagli! 😜"
                    ];
                    const response = haniyaGreetings[Math.floor(Math.random() * haniyaGreetings.length)];
                    return { response, haniyaIdentified: true };

                case 'UNCERTAIN':
                    const clarification = result.clarificationQuestion || 'Wait, tu Haniya hai kya? Bata de, warna me roast mode me chala jaunga 👀';
                    return { response: clarification, haniyaIdentified: false };

                case 'REJECTED':
                default:
                    const roastResult = await generateRoast({ userInput });
                    return { response: roastResult.roast, haniyaIdentified: false };
            }
        } catch (e) {
            console.error("Error with Haniya confirmation/roast flow:", e);
            // Fallback to roast if confirmation flow fails
            const roastResult = await generateRoast({ userInput });
            return { response: roastResult.roast, haniyaIdentified: false };
        }
    }
    
    // From here, we know the user is Haniya
    if (userInput.toLowerCase().startsWith('/suggest')) {
        const suggestionInput = userInput.replace(/\/suggest/i, '').trim();
        const input: SuggestRomanticContentInput = {
            userInput: suggestionInput || `feeling ${mood.toLowerCase()}`, // Provide context if user input is empty
            mood: 'Romantic', // Suggest flow has its own logic
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
        // @ts-ignore - We are using a different set of moods on the client
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
