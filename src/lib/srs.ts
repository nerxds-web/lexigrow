import {VocabularyWord} from "../types";
import {Timestamp, serverTimestamp} from "firebase/firestore";

/**
 * Simplified SM-2 algorithm for spaced repetition.
 * @param word The vocabulary word being reviewed.
 * @param quality 0 (Again), 3 (Good), 5 (Easy)
 * @returns Updated SRS stats for the word.
 */
export function calculateNextReview(word: VocabularyWord, quality: number) {
  let { interval, easeFactor, status } = word;

  if (quality >= 3) {
    if (interval === 0) {
      interval = 1;
    } else if (interval === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    
    // Adjust ease factor
    // EF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;
    
    status = interval > 30 ? 'mastered' : 'reviewing';
  } else {
    // quality < 3 (Again)
    interval = 1;
    status = 'learning';
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    interval,
    easeFactor,
    status,
    nextReview: Timestamp.fromDate(nextReviewDate),
    lastReviewed: serverTimestamp()
  };
}
