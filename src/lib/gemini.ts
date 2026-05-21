import {GoogleGenAI, Type} from "@google/genai";
import {GeminiWordResult, ProficiencyLevel} from "../types";

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY') {
    console.warn("GEMINI_API_KEY is not set or using placeholder.");
  }
  return key || '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export async function lookupWord(word: string, language: 'english' | 'german' = 'english'): Promise<GeminiWordResult> {
  const languagePrompt = language === 'german' 
    ? `Look up the German word "${word}". Provide:
- its clear German definition/meaning translated to English
- its natural Arabic translation
- one natural German example sentence using the word
- a natural English translation of that German example sentence
- a natural Arabic translation of that German example sentence
- its part of speech (noun, verb, adjective, adverb, etc.)
- its phonetic IPA transcription for German pronunciation
- its matching singular nominative definite article ("der", "die", or "das") in genderArticle if it is a noun, or an empty string otherwise.`
    : `Look up the English word "${word}". Provide:
- its clear English definition
- its natural Arabic translation
- one natural English example sentence using the word
- a natural Arabic translation of that English example sentence
- its part of speech (noun, verb, adjective, adverb, etc.)
- its phonetic IPA transcription.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: languagePrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          meaningEn: { type: Type.STRING, description: "Clear definition in English" },
          meaningAr: { type: Type.STRING, description: "Accurate Arabic translation of the meaning" },
          example: { type: Type.STRING, description: "A natural example sentence in the target language (English or German)" },
          exampleAr: { type: Type.STRING, description: "Accurate Arabic translation of the example sentence" },
          partOfSpeech: { type: Type.STRING, description: "The part of speech, e.g., verb, noun, adjective, adverb" },
          ipa: { type: Type.STRING, description: "The IPA phonetic spelling" },
          language: { type: Type.STRING, description: "Must be 'german' or 'english' matching the target language" },
          genderArticle: { type: Type.STRING, description: "Must be 'der', 'die', or 'das' if it is a German noun. Otherwise empty string." }
        },
        required: ["word", "meaningEn", "meaningAr", "example", "exampleAr", "partOfSpeech", "ipa", "language", "genderArticle"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Could not get a response from Gemini.");
  }

  return JSON.parse(response.text.trim());
}

export async function getDailyWords(level: ProficiencyLevel, language: 'english' | 'german' = 'english'): Promise<GeminiWordResult[]> {
  const languagePrompt = language === 'german'
    ? `Provide 5 high-quality, commonly used German vocabulary words suitable for a German learner at the ${level} level. For each word, provide:
- the German word itself (singular dictionary form, without article attached in the main word field)
- its German definition or meaning translated to English
- its Arabic translation
- one natural German example sentence using the word
- a natural English translation of that German example sentence
- a natural Arabic translation of that German example sentence
- its part of speech (noun, verb, adjective, adverb, etc.)
- its phonetic IPA transcription for German pronunciation
- its matching singular nominative definite article ("der", "die", or "das") in genderArticle if it is a noun, or an empty string otherwise.`
    : `Provide 5 high-quality, commonly used English vocabulary words suitable for an English learner at the ${level} level. For each word, provide:
- its English definition
- its Arabic translation
- one natural English example sentence using the word
- a natural Arabic translation of that English example sentence
- its part of speech (noun, verb, adjective, adverb, etc.)
- its phonetic IPA transcription.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: languagePrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          results: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                meaningEn: { type: Type.STRING },
                meaningAr: { type: Type.STRING },
                example: { type: Type.STRING },
                exampleAr: { type: Type.STRING, description: "Accurate Arabic translation of the example sentence" },
                partOfSpeech: { type: Type.STRING, description: "The part of speech, e.g., verb, noun, adjective, adverb" },
                ipa: { type: Type.STRING, description: "The IPA phonetic transcription" },
                language: { type: Type.STRING, description: "Must be 'german' or 'english' matching the target language" },
                genderArticle: { type: Type.STRING, description: "Must be 'der', 'die', or 'das' if it is a German noun. Otherwise empty string." }
              },
              required: ["word", "meaningEn", "meaningAr", "example", "exampleAr", "partOfSpeech", "ipa", "language", "genderArticle"]
            }
          }
        },
        required: ["results"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Could not get a response from Gemini.");
  }

  const result = JSON.parse(response.text.trim());
  return result.results;
}
