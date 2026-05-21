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
  
  // Normalize languages for case-insensitive matching that handles underscores/dashes on varying systems
  const targetTag = isGerman ? 'de' : 'en';
  const targetFull = isGerman ? 'de-de' : 'en-us';
  
  const matchLang = (voiceLang: string, exact: boolean) => {
    const normal = voiceLang.toLowerCase().replace('_', '-');
    if (exact) {
      return normal === targetFull;
    }
    return normal === targetTag || normal.startsWith(targetTag + '-');
  };

  // Attempt to select preferred voices with clean fallbacks
  const voice = 
    // 1. High-fidelity Natural voices matching the exact dialect (e.g., 'en-US' or 'de-DE')
    voices.find(v => matchLang(v.lang, true) && v.name.toLowerCase().includes('natural')) ||
    // 2. High-fidelity Natural voices matching the language family (e.g., any 'en' or 'de')
    voices.find(v => matchLang(v.lang, false) && v.name.toLowerCase().includes('natural')) ||
    // 3. Premium Google voices (high clarity)
    voices.find(v => matchLang(v.lang, true) && v.name.toLowerCase().includes('google')) ||
    // 4. Any voice matching the exact dialect (e.g. en-US)
    voices.find(v => matchLang(v.lang, true)) ||
    // 5. Any voice matching the language family (e.g. en-UK, de-CH)
    voices.find(v => matchLang(v.lang, false)) ||
    // 6. Generic system fallback
    voices.find(v => v.lang.toLowerCase().startsWith(targetTag));

  if (voice) {
    utterance.voice = voice;
  }

  // Slightly reduce speed (0.82 - 0.85) to optimize for linguistic articulation and clear learner feedback
  utterance.rate = isGerman ? 0.82 : 0.85;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}
