'use server';

import { adaptMoodForResponses, AdaptMoodForResponsesInput } from '@/ai/flows/adapt-mood-for-responses';
import { suggestRomanticContent, SuggestRomanticContentInput } from '@/ai/flows/suggest-romantic-content';
import { generateRoast } from '@/ai/flows/generate-roast';
import type { Message } from '@/app/page';

export type Mood = 'Happy' | 'Sad' | 'Lonely' | 'Romantic';

/**
 * Checks if the user's input is a clear confirmation of being Haniya.
 * It will remain false for ambiguous or negative statements.
 * @param input The user's message.
 * @returns True if the user confirms they are Haniya, otherwise false.
 */
const isHaniyaConfirmation = (input: string): boolean => {
    const lowerInput = input.toLowerCase().trim();
    
    const negativeKeywords = [
        "nahi",
        "nahin",
        "not",
        "nahi hun",
        "nahi hu",
        "nahi me haniya",
    ];

    // If the message contains any negative keyword, it's definitely not a confirmation.
    if (negativeKeywords.some(kw => lowerInput.includes(kw))) {
        return false;
    }
    
    // The extensive list of phrases that confirm the user is Haniya.
    const confirmationPhrases = [
        "Haniya hun", "Me Haniya hun", "Han me Haniya hun", "Han han me hi Haniya hun", "Haan me hi Haniya hun",
        "Haniya speaking", "It’s me Haniya", "I’m Haniya", "I am Haniya", "Myself Haniya", "This is Haniya",
        "Haniya here", "Apki Haniya hazir hai", "Queen Haniya is here", "Babe I’m Haniya", "Bae it’s Haniya",
        "Your Haniya is online", "Me hi Haniya hun", "Han han Haniya hun", "Suno me Haniya hun", "Dekho me Haniya hun",
        "Haan bhai me Haniya hun", "Tujhse baat kar rahi Haniya", "Main to Haniya hoon", "Main hi to Haniya hoon",
        "Khud Haniya bol rahi hoon", "Han janeman, Haniya bol rahi", "Haniya in the house", "Haniya mode on",
        "Meri shanakht Haniya hai", "Haniya typing...", "Jaan Haniya yahan hai", "Arey me Haniya hi to hun",
        "Aap ki Haniya", "Bakchodi Queen Haniya present", "Who else? It’s Haniya", "Guess who? Haniya",
        "Kya nai samjha? Me Haniya hun!", "Ab to maan lo, me Haniya hun", "Hello, it's Haniya",
        "Mujhe nai pehchana? Haniya hoon", "Tu hi tu keh raha tha Haniya ko bula, ab aa gayi",
        "Haniya is here, ab kya problem?", "Don’t roast, it’s me Haniya", "Chill kar, Haniya aayi hai",
        "Tu confuse ho gaya? Me Haniya", "Apni Haniya aayi hai", "Tujhe kya laga me Haniya nai ho sakti?",
        "Haniya bol rahi hoon, shut up", "Bolo Bae, Haniya aayi", "Me Haniya hu, ab bata",
        "Beta samajh ja, me Haniya hoon", "Roasting band kar, me Haniya hoon", "Tatti mat ban, Haniya hoon me",
        "Dekh emoji bhi bhej rahi, ab maan Haniya hoon", "Pata chal gaya na? Me Haniya!",
        "Kya logic chahiye aur? Haniya hi hoon", "Haniya on board", "Mujhe pehchaan, me Haniya",
        "Over na ho... me Haniya hoon", "I’m your Haniya, duh", "It’s finally me… Haniya",
        "Bakchodi khatam, Haniya start", "Stop testing, I’m Haniya", "LOL stop it’s me Haniya",
        "Tujhse zyada mujhe pata hay me Haniya hoon", "Joke mat samajh, me asli Haniya hoon",
        "Oye nai pehchana? Me Haniya", "Kya laga AI se bacha lo gay? Me Haniya hoon",
        "Bae reporting, Haniya style", "AI sun le, Haniya bol rahi", "Mujhe mat test kar, Haniya hoon",
        "Enough intro, it’s Haniya", "Confirm kar le: H-A-N-I-Y-A", "Me 💩 nahi, me Haniya hoon",
        "Haniya signing in", "Chatbot, pehchaan Haniya ko", "Apna user Haniya aagayi",
        "Joke nahi hoon, Haniya hoon", "Proof kya chahiye? Me hi Haniya", "Haniya active ho gayi ab",
        "Jaan pehchaan lo – me Haniya", "Tu galti se kisi aur ko na samajh le, me Haniya hoon",
        "Full confirmation de rahi hoon – Haniya here", "Tujhe kya otp bhejun? Me Haniya hoon",
        "Itna verification? Haniya hoon bhai!", "Scanner laga lo… me hi Haniya hoon",
        "Tu roast kar raha? Me Haniya hoon", "Tatti roast band kar, me Haniya bol rahi",
        "Chill kar Bae, it’s your girl Haniya", "Main wo hoon jo sirf tere liye hoon – Haniya",
        "Mujhe ignore karega? Me Haniya hoon be!", "Naam likhwa loon? H-A-N-I-Y-A",
        "Tu jab tak samjhe, me Haniya ho chuki hoon", "Yahan sirf ek queen — Haniya",
        "Bolo beta, apni Haniya bol rahi", "Beta tu kuch bhi samjhe… me Haniya hoon",
        "Game over, Haniya in control", "Bakchodi chhodo, Haniya ready", "Pyaar se bol, Haniya aayi",
    ];
    
    // We check if any of the confirmation phrases are present in the user input.
    // This is more robust than an exact match.
    return confirmationPhrases.some(phrase => lowerInput.includes(phrase.toLowerCase()));
};

export async function getAiResponse(
  history: Message[],
  userInput: string,
  mood: Mood,
  isHaniya: boolean
): Promise<{ response: string; haniyaIdentified: boolean }> {

    if (!isHaniya) {
        if (isHaniyaConfirmation(userInput)) {
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
        } else {
            try {
                const result = await generateRoast({ userInput });
                const response = result.roast;
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
