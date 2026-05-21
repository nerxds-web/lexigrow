import {db, handleFirestoreError, OperationType} from '../lib/firebase';
import {collection, addDoc, Timestamp, doc, getDoc, serverTimestamp} from 'firebase/firestore';
import {GeminiWordResult} from '../types';

export async function addWordToCollection(userId: string, wordData: GeminiWordResult) {
  const path = `users/${userId}/vocabulary`;
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error("User profile not found.");
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1);

    await addDoc(collection(db, path), {
      userId,
      word: wordData.word,
      meaningEn: wordData.meaningEn,
      meaningAr: wordData.meaningAr,
      example: wordData.example,
      exampleAr: wordData.exampleAr || '',
      partOfSpeech: wordData.partOfSpeech || '',
      ipa: wordData.ipa || '',
      nextReview: Timestamp.fromDate(nextReview),
      interval: 1,
      easeFactor: 2.5,
      status: 'learning',
      createdAt: serverTimestamp(),
      language: wordData.language || 'english',
      genderArticle: wordData.genderArticle || ''
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}
