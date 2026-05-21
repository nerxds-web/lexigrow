import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {VocabularyWord} from '../types';
import {calculateNextReview} from '../lib/srs';
import {db, handleFirestoreError, OperationType} from '../lib/firebase';
import {doc, updateDoc} from 'firebase/firestore';
import {Check, Repeat, Zap, X, Volume2} from 'lucide-react';
import {playPronunciation} from '../lib/pronounce';
import {cn} from '../lib/utils';

interface ReviewModalProps {
  words: VocabularyWord[];
  onComplete: () => void;
  onClose: () => void;
}

export function ReviewModal({words, onComplete, onClose}: ReviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<'der' | 'die' | 'das' | null>(null);

  const currentWord = words[currentIndex];

  useEffect(() => {
    setShowAnswer(false);
    setSelectedArticle(null);
  }, [currentIndex]);

  const handleReview = async (quality: number) => {
    if (!currentWord) return;

    const stats = calculateNextReview(currentWord, quality);
    const path = `users/${currentWord.userId}/vocabulary/${currentWord.id}`;

    try {
      await updateDoc(doc(db, path), stats);

      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setFinished(true);
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  if (finished) {
    return (
      <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{scale: 0.8, opacity: 0}}
          animate={{scale: 1, opacity: 1}}
          className="bg-white rounded-3xl p-12 text-center space-y-4"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-stone-800">Done for today!</h2>
          <p className="text-stone-500">Your memory is getting stronger.</p>
        </motion.div>
      </div>
    );
  }

  const isGerman = currentWord?.language === 'german' || !!currentWord?.genderArticle;
  const isNoun = isGerman && currentWord?.partOfSpeech?.toLowerCase().includes('noun') && currentWord?.genderArticle;

  return (
    <div className="fixed inset-0 bg-ink/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <button 
        onClick={onClose}
        className="absolute top-12 right-12 text-paper opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <X className="w-10 h-10" />
      </button>

      <div className="w-full max-w-4xl space-y-12">
        <div className="flex justify-between items-end px-2 border-b border-paper/10 pb-4">
          <span className="text-paper/40 font-bold text-[10px] uppercase tracking-[0.4em] font-mono">INDEX {currentIndex + 1} OF {words.length}</span>
          <div className="flex gap-2">
            {words.map((_, i) => (
              <div key={i} className={`h-0.5 w-6 transition-all duration-500 ${i <= currentIndex ? 'bg-paper' : 'bg-paper/10'}`} />
            ))}
          </div>
        </div>

        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord.id + (showAnswer ? '-back' : '-front')}
              initial={{y: 20, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              exit={{y: -20, opacity: 0}}
              transition={{duration: 0.4}}
              className="bg-paper w-full min-h-[500px] p-24 flex flex-col items-center justify-center text-center relative overflow-hidden"
              onClick={() => !showAnswer && setShowAnswer(true)}
            >
              {/* Vertical label */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 vertical-text text-[10px] font-bold uppercase tracking-[0.5em] opacity-10">
                SRS SESSION // ENGINE.44
              </div>

              {!showAnswer ? (
                <div className="space-y-8 flex flex-col items-center justify-center w-full">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Entry Term</span>
                    
                    <div className="flex items-center gap-6 justify-center flex-wrap">
                      <h2 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-ink tracking-tighter capitalize leading-none">
                        {currentWord.word}
                      </h2>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playPronunciation(currentWord.word, isGerman);
                        }}
                        className="p-3.5 bg-ink/5 hover:bg-ink hover:text-paper rounded-full transition-all cursor-pointer hover:scale-105 border border-ink/5"
                        title="Speak Pronunciation"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 justify-center flex-wrap">
                      {currentWord.ipa && (
                        <p className="font-mono text-base text-ink/40 tracking-wider">
                          {currentWord.ipa}
                        </p>
                      )}
                      {currentWord.partOfSpeech && (
                        <span className="bg-ink text-paper text-[9px] uppercase font-bold tracking-widest px-2.5 py-1">
                          {currentWord.partOfSpeech}
                        </span>
                      )}
                      {isGerman && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 border border-amber-200">
                          German
                        </span>
                      )}
                    </div>

                    {/* Recall Grammatical article tool directly inside the front card! */}
                    {isNoun && (
                      <div className="py-4 px-6 border border-ink/10 bg-ink/[0.01] my-4 rounded max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 block mb-2 font-mono">Recall Grammatical Article (der/die/das):</span>
                        <div className="flex gap-2 justify-center">
                          {(['der', 'die', 'das'] as const).map((article) => {
                            const isCorrect = article === currentWord.genderArticle;
                            const isSelected = article === selectedArticle;
                            let btnStyle = "border border-ink/15 text-ink/75 hover:bg-ink hover:text-paper";
                            if (selectedArticle) {
                              if (isCorrect) {
                                btnStyle = "bg-emerald-600 text-white border-emerald-600 font-bold";
                              } else if (isSelected) {
                                btnStyle = "bg-rose-500 text-white border-rose-500 font-bold animate-pulse";
                              } else {
                                btnStyle = "opacity-30 border-ink/5 text-ink/20 cursor-not-allowed";
                              }
                            }
                            return (
                              <button
                                key={article}
                                disabled={!!selectedArticle}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedArticle(article);
                                }}
                                className={cn("px-4 py-2 text-xs font-mono leading-none tracking-widest uppercase transition-all duration-200 cursor-pointer", btnStyle)}
                              >
                                {article}
                              </button>
                            );
                          })}
                        </div>
                        {selectedArticle && (
                          <span className={cn(
                            "text-[10px] uppercase tracking-wider font-semibold block mt-2",
                            selectedArticle === currentWord.genderArticle ? "text-emerald-700" : "text-rose-600"
                          )}>
                            {selectedArticle === currentWord.genderArticle 
                              ? `Correct! It's "${currentWord.genderArticle}"` 
                              : `Incorrect. It's "${currentWord.genderArticle}"`
                            }
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-ink/30 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-4 pt-4 select-none">
                      <span className="h-px w-8 bg-ink/25"></span>
                      Tap Card or Space to Reveal
                      <span className="h-px w-8 bg-ink/25"></span>
                    </p>
                </div>
              ) : (
                <div className="space-y-12 w-full max-w-2xl mx-auto text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Semantic Meaning</span>
                    
                    <div className="flex items-center gap-4 justify-center flex-wrap mb-4 pb-4 border-b border-ink/5">
                      <h3 className="text-4xl sm:text-5xl font-serif font-bold text-ink tracking-tight capitalize leading-none">
                        {isNoun && (
                          <span className="text-emerald-600 font-sans text-sm tracking-widest uppercase mr-3 font-bold border border-emerald-600/30 px-2 py-0.5 rounded bg-emerald-50 align-middle select-none">
                            {currentWord.genderArticle}
                          </span>
                        )}
                        {currentWord.word}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playPronunciation(currentWord.word, isGerman);
                        }}
                        className="p-2 bg-ink/5 hover:bg-ink hover:text-paper rounded-full transition-all cursor-pointer hover:scale-105 border border-ink/5 shadow-sm"
                        title="Speak Pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      {currentWord.ipa && (
                        <span className="font-mono text-sm text-ink/40 tracking-wider">
                          {currentWord.ipa}
                        </span>
                      )}
                      {currentWord.partOfSpeech && (
                        <span className="bg-ink text-paper text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm">
                          {currentWord.partOfSpeech}
                        </span>
                      )}
                    </div>

                    <p className="text-5xl sm:text-6xl font-serif italic text-ink leading-tight dir-rtl">{currentWord.meaningAr}</p>
                    <p className="text-ink/60 text-xl leading-relaxed font-sans mt-4 italic">/ {currentWord.meaningEn}</p>
                  </div>
                  
                  <div className="pt-12 border-t border-ink/10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 block mb-4">Contextual Proof</span>
                    <p className="text-2xl font-serif leading-relaxed text-ink/80 opacity-80">
                      "{currentWord.example}"
                    </p>
                    {currentWord.exampleAr && (
                      <p className="text-lg font-arabic text-ink/45 dir-rtl leading-relaxed mt-2.5">
                        "{currentWord.exampleAr}"
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {showAnswer && (
          <motion.div 
            initial={{y: 20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            className="grid grid-cols-3 gap-8"
          >
            <button
              onClick={() => handleReview(0)}
              className="bg-transparent border border-paper/20 h-24 text-paper uppercase font-bold tracking-[0.2em] text-[10px] hover:bg-paper hover:text-ink transition-all cursor-pointer"
            >
              Repeat
            </button>
            <button
              onClick={() => handleReview(3)}
              className="bg-transparent border border-paper/20 h-24 text-paper uppercase font-bold tracking-[0.2em] text-[10px] hover:bg-paper hover:text-ink transition-all cursor-pointer"
            >
              Mastered
            </button>
            <button
              onClick={() => handleReview(5)}
              className="bg-paper text-ink h-24 uppercase font-bold tracking-[0.2em] text-[10px] hover:opacity-90 transition-all cursor-pointer"
            >
              Easy
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
