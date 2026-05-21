import React from 'react';
import { VocabularyWord } from '../types';
import { Volume2, Play, Sparkles, Check, ArrowRight } from 'lucide-react';
import { playPronunciation } from '../lib/pronounce';

interface ReviseTodayProps {
  dueWords: VocabularyWord[];
  loading: boolean;
  onStartReview: (words: VocabularyWord[]) => void;
}

export function ReviseToday({ dueWords, loading, onStartReview }: ReviseTodayProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-t-2 border-ink rounded-full animate-spin" />
      </div>
    );
  }

  const nounCount = dueWords.filter(w => w.partOfSpeech?.toLowerCase() === 'noun').length;
  const verbCount = dueWords.filter(w => w.partOfSpeech?.toLowerCase() === 'verb').length;
  const otherCount = dueWords.length - nounCount - verbCount;

  return (
    <div className="space-y-10">
      {dueWords.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Hero Session Box */}
          <div className="lg:col-span-1 bg-ink text-paper p-10 flex flex-col justify-between gap-12 relative overflow-hidden group">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 text-[150px] font-serif font-bold text-paper/[0.04] select-none pointer-events-none">
              {dueWords.length}
            </div>
            
            <div className="space-y-4 z-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-paper/50 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-mono" /> Cognitive Queue
              </span>
              <h3 className="text-4xl font-serif font-bold tracking-tighter leading-none italic">
                {dueWords.length} Words <br />
                <span className="not-italic text-paper/55">Awaiting Sync Today.</span>
              </h3>
              <p className="text-xs text-paper/60 font-sans leading-relaxed pt-2">
                Your spaced repetition scheduler lists these entries as ready for active retrieval practice. Spacing intervals help maximize synapse consolidation.
              </p>
            </div>

            <div className="z-10 space-y-6">
              <div className="grid grid-cols-3 gap-2 border-t border-b border-paper/10 py-4 text-[10px] font-mono tracking-widest text-paper/50">
                <div>
                  <span className="block text-xl text-paper font-serif font-bold italic">{nounCount}</span>
                  NOUNS
                </div>
                <div>
                  <span className="block text-xl text-paper font-serif font-bold italic">{verbCount}</span>
                  VERBS
                </div>
                <div>
                  <span className="block text-xl text-paper font-serif font-bold italic">{otherCount}</span>
                  OTHERS
                </div>
              </div>

              <button
                onClick={() => onStartReview(dueWords)}
                className="w-full bg-paper text-ink px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-paper/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-ink text-ink" /> Start Complete Queue
              </button>
            </div>
          </div>

          {/* Cards Grid of Due Words */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {dueWords.map((word) => (
              <div
                key={word.id}
                onClick={() => onStartReview([word])}
                className="bg-paper border border-ink/10 p-8 flex flex-col justify-between group hover:border-ink hover:shadow-sm transition-all duration-300 cursor-pointer relative"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] uppercase font-bold tracking-widest px-2.5 py-1 bg-ink/5 border border-ink/10 scale-95 origin-left">
                      {word.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playPronunciation(word.word, word.language === 'german');
                      }}
                      className="p-1.5 bg-ink/5 hover:bg-ink hover:text-paper rounded-full transition-all cursor-pointer relative z-10"
                      title="Speak Pronunciation"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-3xl font-serif font-bold text-ink capitalize tracking-tighter mb-1 select-none">
                      {word.word}
                    </h4>
                    
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      {word.ipa && (
                        <span className="font-mono text-[10px] text-ink/40 tracking-wider">
                          {word.ipa}
                        </span>
                      )}
                      {word.partOfSpeech && (
                        <span className="bg-ink/5 text-ink/50 text-[7px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm">
                          {word.partOfSpeech}
                        </span>
                      )}
                    </div>

                    <p className="text-2xl font-serif italic text-ink/90 dir-rtl mb-2 leading-none">
                      {word.meaningAr}
                    </p>
                    <p className="text-xs text-ink/60 line-clamp-1 italic font-sans">
                      / {word.meaningEn}
                    </p>
                  </div>
                </div>

                {/* Example sentence snippet */}
                <div className="mt-6 pt-4 border-t border-ink/5 space-y-1.5">
                  <p className="text-[10px] text-ink/50 leading-normal line-clamp-2">
                    "{word.example}"
                  </p>
                  {word.exampleAr && (
                    <p className="text-xs font-arabic text-ink/30 dir-rtl leading-normal line-clamp-1">
                      "{word.exampleAr}"
                    </p>
                  )}
                </div>

                {/* Quick overlay link */}
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-ink/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="border border-ink/10 p-16 text-center space-y-6 bg-paper relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-stone-50/50 opacity-50 select-none pointer-events-none" />
          <div className="w-16 h-16 bg-ink/5 rounded-full flex items-center justify-center mx-auto opacity-80 mb-2">
            <Check className="w-6 h-6 text-ink/60" />
          </div>
          
          <div className="space-y-2 relative z-10 max-w-lg mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">System Clear</span>
            <h3 className="text-3xl font-serif font-bold italic tracking-tighter">Memory Synced.</h3>
            <p className="text-xs text-ink/50 leading-relaxed">
              Every card in your local lexicon is perfectly consolidated. There are zero words due for active recall today. Excellent durability!
            </p>
          </div>

          <div className="pt-2">
             <span className="text-[9px] font-mono tracking-widest text-ink/30">NEXT CYCLE COMES AT MIDNIGHT</span>
          </div>
        </div>
      )}
    </div>
  );
}
