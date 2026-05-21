export type WordStatus = 'learning' | 'reviewing' | 'mastered';
export type ProficiencyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: any; // Firestore Timestamp
  level?: ProficiencyLevel;
  targetLanguage?: 'english' | 'german';
  lastDailyUpdate?: any; // Firestore Timestamp
  dailyWords?: GeminiWordResult[];
}

export interface VocabularyWord {
  id: string; // Document ID
  userId: string;
  word: string;
  meaningEn: string;
  meaningAr: string;
  example: string;
  exampleAr?: string;
  partOfSpeech?: string;
  ipa?: string;
  lastReviewed: any | null; // Firestore Timestamp
  nextReview: any; // Firestore Timestamp
  interval: number; // in days
  easeFactor: number;
  status: WordStatus;
  createdAt: any; // Firestore Timestamp
  language?: 'english' | 'german';
  genderArticle?: 'der' | 'die' | 'das' | '';
}

export interface GeminiWordResult {
  word: string;
  meaningEn: string;
  meaningAr: string;
  example: string;
  exampleAr?: string;
  partOfSpeech?: string;
  ipa?: string;
  language?: 'english' | 'german';
  genderArticle?: 'der' | 'die' | 'das' | '';
}
