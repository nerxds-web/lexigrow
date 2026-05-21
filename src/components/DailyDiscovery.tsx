import React, {useState, useEffect} from 'react';
import {UserProfile, ProficiencyLevel, GeminiWordResult} from '../types';
import {getDailyWords} from '../lib/gemini';
import {db, handleFirestoreError, OperationType} from '../lib/firebase';
import {doc, setDoc, serverTimestamp} from 'firebase/firestore';
import {Loader2, Check, Plus, X, Sparkles, ChevronRight, Volume2, Globe} from 'lucide-react';
import {addWordToCollection} from '../services/vocabularyService';
import {motion, AnimatePresence} from 'motion/react';
import {playPronunciation} from '../lib/pronounce';
import {cn} from '../lib/utils';

interface DailyDiscoveryProps {
  userProfile: UserProfile;
  onLevelSet: (level: ProficiencyLevel) => void;
  onLanguageSet: (lang: 'english' | 'german') => void;
  onWordAdded: () => void;
}

export function DailyDiscovery({userProfile, onLevelSet, onLanguageSet, onWordAdded}: DailyDiscoveryProps) {
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState<GeminiWordResult[]>(userProfile.dailyWords || []);

  const currentLanguage = userProfile.targetLanguage || 'english';

  const fetchNewBatch = async (level: ProficiencyLevel, lang: 'english' | 'german' = currentLanguage) => {
    setLoading(true);
    try {
      const dailyWords = await getDailyWords(level, lang);
      // Ensure language is set for each word
      const updatedDailyWords = dailyWords.map(w => ({
        ...w,
        language: lang
      }));

      const userRef = doc(db, 'users', userProfile.uid);
      try {
        await setDoc(userRef, {
          dailyWords: updatedDailyWords,
          lastDailyUpdate: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${userProfile.uid}`);
      }
      setWords(updatedDailyWords);
    } catch (error) {
      console.error("Discovery error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Safely update DailyDiscovery when userProfile targetLanguage or level changes
  useEffect(() => {
    if (userProfile.level) {
      // Check if current batch matches targetLanguage. If not of matching language, clear or fetch new.
      const hasMismatch = userProfile.dailyWords && userProfile.dailyWords.length > 0 &&
        userProfile.dailyWords[0].language !== currentLanguage;

      if (!userProfile.dailyWords || userProfile.dailyWords.length === 0 || hasMismatch) {
        fetchNewBatch(userProfile.level, currentLanguage);
      } else {
        setWords(userProfile.dailyWords);
      }
    } else {
      setWords([]);
    }
  }, [userProfile.level, userProfile.uid, userProfile.targetLanguage, userProfile.dailyWords]);

  const handleLevelSelect = (level: ProficiencyLevel) => {
    onLevelSet(level);
    fetchNewBatch(level, currentLanguage);
  };

  const handleLanguageSelect = (lang: 'english' | 'german') => {
    onLanguageSet(lang);
    if (userProfile.level) {
      fetchNewBatch(userProfile.level, lang);
    }
  };

  const handleAdd = async (word: GeminiWordResult) => {
    try {
      await addWordToCollection(userProfile.uid, word);
      const updatedWords = words.filter(w => w.word !== word.word);
      setWords(updatedWords);
      
      const userRef = doc(db, 'users', userProfile.uid);
      try {
        await setDoc(userRef, { dailyWords: updatedWords }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${userProfile.uid}`);
      }
      onWordAdded();
    } catch (error) {
      console.error("Failed to add word:", error);
    }
  };

  const handleSkip = async (word: GeminiWordResult) => {
    const updatedWords = words.filter(w => w.word !== word.word);
    setWords(updatedWords);
    
    const userRef = doc(db, 'users', userProfile.uid);
    try {
      await setDoc(userRef, { dailyWords: updatedWords }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userProfile.uid}`);
    }
  };

  if (!userProfile.level) {
    return (
      <div className="bg-ink p-12 text-paper space-y-12 animate-in fade-in slide-in-from-bottom-4">
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-50">Configuration Required</span>
          <h2 className="text-5xl font-serif font-bold tracking-tighter leading-none italic">
            Select Language & <br />
            <span className="not-italic text-paper/40">Proficiency Grade.</span>
          </h2>
          <p className="text-paper/60 max-w-md text-sm leading-relaxed">
            Choose your target language and level to receive personalized daily vocabulary recommendations.
          </p>
        </div>

        {/* Language Selection first inside initial config screen */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 block">1. Select Target Language</span>
          <div className="flex gap-4">
            <button
              onClick={() => handleLanguageSelect('english')}
              className={cn(
                "flex-1 max-w-[200px] py-4 border text-center transition-all font-serif italic text-lg cursor-pointer",
                currentLanguage === 'english'
                  ? "bg-paper text-ink border-paper"
                  : "border-paper/20 hover:border-paper text-paper/60 hover:text-paper"
              )}
            >
              English 🇬🇧
            </button>
            <button
              onClick={() => handleLanguageSelect('german')}
              className={cn(
                "flex-1 max-w-[200px] py-4 border text-center transition-all font-serif italic text-lg cursor-pointer",
                currentLanguage === 'german'
                  ? "bg-paper text-ink border-paper"
                  : "border-paper/20 hover:border-paper text-paper/60 hover:text-paper"
              )}
            >
              German 🇩🇪
            </button>
          </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t border-paper/10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 block">2. Select Vocabulary Level</span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as ProficiencyLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => handleLevelSelect(level)}
                className="border border-paper/20 py-4 font-serif italic text-xl hover:bg-paper hover:text-ink transition-all cursor-pointer"
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border border-ink/10 p-12 flex flex-col items-center justify-center gap-6 bg-paper">
        <Loader2 className="w-8 h-8 animate-spin opacity-20" />
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-30 italic">Curating Lexical Discovery...</span>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="border border-ink/10 p-12 flex flex-col items-center justify-center text-center space-y-6 bg-paper">
        <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center">
          <Check className="w-6 h-6 opacity-20" />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-30 block">Discovery Complete</span>
            <p className="text-2xl font-serif italic text-ink/40">You've curated all recommendations for {currentLanguage === 'german' ? 'German' : 'English'}.</p>
          </div>
          <button 
            onClick={() => fetchNewBatch(userProfile.level!)}
            className="text-[10px] font-bold uppercase tracking-widest border border-ink px-8 py-3 hover:bg-ink hover:text-paper transition-all cursor-pointer"
          >
            Generate 5 More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 bg-paper">
      <header className="flex justify-between items-end border-b border-ink pb-4 flex-wrap gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Discovery Layer</span>
          <h2 className="text-5xl font-serif font-bold tracking-tighter italic">
            Lexical Discovery{' '}
            <span className="not-italic text-ink/25">
              // {userProfile.level} ({currentLanguage === 'german' ? 'German 🇩🇪' : 'English 🇬🇧'})
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => handleLanguageSelect(currentLanguage === 'english' ? 'german' : 'english')}
              className="text-[8px] font-bold uppercase tracking-widest border border-ink/25 px-2.5 py-1 hover:border-ink transition-all flex items-center gap-1.5 cursor-pointer bg-ink/5"
            >
              <Globe className="w-2.5 h-2.5" />
              Switch to {currentLanguage === 'english' ? 'German' : 'English'}
            </button>
            <button 
               onClick={() => fetchNewBatch(userProfile.level!)}
               className="text-[8px] font-bold uppercase tracking-widest border border-ink/20 px-3 py-1 hover:border-ink transition-all cursor-pointer"
            >
              Generate New Batch
            </button>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-35 font-mono">
            {words.length} Entries Remaining
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink border border-ink overflow-hidden">
        <AnimatePresence mode="popLayout">
          {words.map((word, idx) => (
            <DiscoveryCard
              key={word.word}
              word={word}
              idx={idx}
              userProfile={userProfile}
              onSkip={handleSkip}
              onAdd={handleAdd}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Separate helper component to manage local interactive state of gender article options cleanly!
interface DiscoveryCardProps {
  key?: string;
  word: GeminiWordResult;
  idx: number;
  userProfile: UserProfile;
  onSkip: (w: GeminiWordResult) => void;
  onAdd: (w: GeminiWordResult) => void;
}

function DiscoveryCard({ word, idx, userProfile, onSkip, onAdd }: DiscoveryCardProps) {
  const [selectedArticle, setSelectedArticle] = useState<'der' | 'die' | 'das' | null>(null);

  const isGerman = word.language === 'german' || (userProfile.targetLanguage === 'german' && word.genderArticle !== undefined);
  const isNoun = isGerman && word.partOfSpeech?.toLowerCase().includes('noun') && word.genderArticle;

  return (
    <motion.div
      layout
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, scale: 0.95}}
      transition={{delay: idx * 0.1}}
      className="bg-paper p-10 flex flex-col justify-between group h-[450px] relative"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold opacity-25 uppercase tracking-[0.3em] font-mono">Entry 0{idx + 1}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => onSkip(word)}
              className="p-2 rounded-full border border-ink/5 hover:bg-ink hover:text-paper transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              title="I know this"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1 min-w-0 flex-wrap">
              <h3 className={cn(
                "font-serif font-bold tracking-tighter text-ink capitalize leading-none truncate",
                word.word.length > 10 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
              )} title={word.word}>
                {isNoun && selectedArticle === word.genderArticle && (
                  <span className="text-emerald-600 font-sans text-sm tracking-widest uppercase mr-2 font-bold select-none border border-emerald-600/30 px-1.5 py-0.5 rounded-sm bg-emerald-50">
                    {word.genderArticle}
                  </span>
                )}
                {word.word}
              </h3>
              <button
                onClick={() => playPronunciation(word.word, isGerman)}
                className="p-1.5 bg-ink/5 hover:bg-ink hover:text-paper rounded-full transition-all cursor-pointer shrink-0"
                title="Speak Pronunciation"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
           
           <div className="flex items-center gap-2 flex-wrap mb-2 mt-1">
             {word.ipa && (
               <span className="font-mono text-[11px] text-ink/40 tracking-wider">
                 {word.ipa}
               </span>
             )}
             {word.partOfSpeech && (
               <span className="bg-ink/5 text-ink/75 text-[8px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm border border-ink/10">
                 {word.partOfSpeech}
               </span>
             )}
             {isGerman && (
               <span className="bg-amber-50 text-amber-800 text-[8px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm border border-amber-200">
                 German
               </span>
             )}
           </div>
          </div>

          {/* Interactive Grammatical Article choice tool */}
          {isNoun && (
            <div className="py-2.5 px-3 border border-ink/5 bg-ink/[0.01]">
              <span className="text-[8px] font-bold uppercase tracking-widest text-ink/40 block mb-1.5">Gender Article Tool (der/die/das):</span>
              <div className="flex gap-1.5">
                {(['der', 'die', 'das'] as const).map((article) => {
                  const isCorrect = article === word.genderArticle;
                  const isSelected = article === selectedArticle;
                  let btnStyle = "border border-ink/10 text-ink/60 hover:bg-ink hover:text-paper";
                  if (selectedArticle) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-600 text-white border-emerald-600 font-bold";
                    } else if (isSelected) {
                      btnStyle = "bg-rose-500 text-white border-rose-500 font-bold";
                    } else {
                      btnStyle = "opacity-30 border-ink/5 text-ink/20 cursor-not-allowed";
                    }
                  }
                  return (
                    <button
                      key={article}
                      disabled={!!selectedArticle}
                      onClick={() => setSelectedArticle(article)}
                      className={cn("px-2.5 py-1 text-[9px] font-mono leading-none tracking-widest uppercase transition-all duration-200 cursor-pointer", btnStyle)}
                    >
                      {article}
                    </button>
                  );
                })}
              </div>
              {selectedArticle && (
                <span className={cn(
                  "text-[9px] uppercase tracking-wider font-semibold block mt-1.5",
                  selectedArticle === word.genderArticle ? "text-emerald-700" : "text-rose-600"
                )}>
                  {selectedArticle === word.genderArticle 
                    ? `Correct! der/die/das is "${word.genderArticle}"` 
                    : `Incorrect. It is "${word.genderArticle}"`
                  }
                </span>
              )}
            </div>
          )}

          <div>
            <span className="text-xl font-serif italic text-ink/75 dir-rtl block mb-1">{word.meaningAr}</span>
            <p className="text-xs text-ink/50 leading-relaxed font-sans line-clamp-2 italic">/ {word.meaningEn}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="space-y-1.5 bg-ink/[5%] p-4 min-h-[75px] flex flex-col justify-center">
          <p className="text-[10px] font-sans text-ink/75 leading-relaxed italic">"{word.example}"</p>
          {word.exampleAr && (
            <p className="text-xs font-arabic text-ink/45 dir-rtl leading-relaxed">"{word.exampleAr}"</p>
          )}
        </div>
        <button
          onClick={() => onAdd(word)}
          className="w-full bg-ink text-paper py-3.5 text-[10px] uppercase font-bold tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          Index to Study
        </button>
      </div>
    </motion.div>
  );
}
