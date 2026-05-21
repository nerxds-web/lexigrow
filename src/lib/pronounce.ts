/**
 * Pronounces a given English word using the native Web Speech API (SpeechSynthesis).
 * Curates local speech synthesis engines to choose clean, natural English voices with clarity optimization.
 */
export function playPronunciation(word: string, isGerman: boolean = false) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn("Speech synthesis is not supported in this browser environment.");
    return;
  }

  // Cancel any ongoing utterance to allow instant replay
  try {
    window.speechSynthesis.cancel();
  } catch (err) {
    console.warn("Could not cancel existing SpeechSynthesis queue:", err);
  }

  const utterance = new SpeechSynthesisUtterance(word);
  const langCode = isGerman ? 'de-DE' : 'en-US';
  utterance.lang = langCode;

  // Get available system voices
  const voices = window.speechSynthesis.getVoices();
  
  // Attempt to select preferred voices
  const voice = voices.find(v => v.lang === langCode && v.name.includes('Natural')) ||
                voices.find(v => v.lang === langCode && !v.name.includes('Google')) ||
                voices.find(v => v.lang === langCode) ||
                voices.find(v => v.lang.startsWith(isGerman ? 'de' : 'en'));

  if (voice) {
    utterance.voice = voice;
  }

  // Slightly reduce speed (0.85) to optimize for linguistic articulation and clear learner feedback
  utterance.rate = 0.85;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}
