import React, {useEffect, useState} from 'react';
import {collection, query, where, getDocs, onSnapshot, orderBy} from 'firebase/firestore';
import {db, auth, handleFirestoreError, OperationType, getEffectiveUid} from '../lib/firebase';
import {VocabularyWord} from '../types';
import {BookOpen, Brain, Trophy, ChevronRight, Volume2} from 'lucide-react';
import {playPronunciation} from '../lib/pronounce';

interface ReviewListProps {
  onStartReview: (words: VocabularyWord[]) => void;
  words?: VocabularyWord[];
  loading?: boolean;
  targetLanguage?: 'english' | 'german';
}

export function ReviewList({ onStartReview, words: propWords, loading: propLoading, targetLanguage }: ReviewListProps) {
  const [localWords, setLocalWords] = useState<VocabularyWord[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (propWords !== undefined) return;
    const userId = getEffectiveUid();
    if (!userId) return;

    const q = query(
      collection(db, `users/${userId}/vocabulary`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wordsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VocabularyWord[];
      setLocalWords(wordsData);
      setLocalLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/vocabulary`);
    });

    return () => unsubscribe();
  }, [propWords]);

  const words = propWords !== undefined ? propWords : localWords;
  const loading = propLoading !== undefined ? propLoading : localLoading;

  const activeLanguage = targetLanguage || 'english';
  const languageWords = words.filter(w => (w.language || 'english') === activeLanguage);

  const dueWords = languageWords.filter(w => {
    if (!w.nextReview) return true;
    const nextDate = typeof w.nextReview.toDate === 'function' ? w.nextReview.toDate() : new Date(w.nextReview);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    return nextDate <= endOfToday;
  });

  const [viewAll, setViewAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWords = languageWords.filter(w => 
    w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.meaningAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.meaningEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedWords = viewAll ? filteredWords : filteredWords.slice(0, 12);

  if (loading) return (
    <div className="flex justify-center py-20 p-12">
      <div className="w-8 h-8 border-t-2 border-ink rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full space-y-12">
      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border-b md:border-b-0 md:border-r border-ink pb-8 md:pb-0 pr-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4">Total Lexicon</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-serif italic">{languageWords.length}</span>
            <span className="text-xs uppercase font-bold opacity-30">entries</span>
          </div>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-ink pb-8 md:pb-0 pr-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4">Scheduled Today</p>
          <div className="flex items-baseline gap-2 text-ink">
            <span className="text-6xl font-serif italic">{dueWords.length}</span>
            <span className="text-xs uppercase font-bold opacity-30 tracking-tighter">strictly due</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4">Mastery Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-serif italic">{languageWords.length ? Math.round((languageWords.filter(w => w.status === 'mastered').length / languageWords.length) * 100) : 0}%</span>
            <span className="text-xs uppercase font-bold opacity-30">recall</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {dueWords.length > 0 ? (
          <div className="flex-1 bg-ink p-12 text-paper flex flex-col justify-between gap-8 group">
             <div className="space-y-4">
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-50">Priority Session</span>
               <h2 className="text-5xl font-serif font-bold tracking-tighter leading-none italic">
                 {dueWords.length} Words <br />
                 <span className="not-italic text-paper/40">Due for Maintenance.</span>
               </h2>
             </div>
             <button 
               onClick={() => onStartReview(dueWords)}
               className="bg-paper text-ink px-12 py-5 font-bold uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all flex items-center justify-center gap-4 border border-paper"
             >
               Initialize Study <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        ) : languageWords.length > 0 && (
          <div className="flex-1 border border-ink/20 p-12 flex flex-col justify-between gap-8 group">
             <div className="space-y-4">
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-50">On-Demand Practise</span>
               <h2 className="text-5xl font-serif font-bold tracking-tighter leading-none italic">
                 Zero words due. <br />
                 <span className="not-italic text-ink/20">Review library anyway?</span>
               </h2>
             </div>
             <button 
               onClick={() => onStartReview(languageWords.slice(0, 10))}
               className="bg-ink text-paper px-12 py-5 font-bold uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all flex items-center justify-center gap-4 border border-ink"
             >
               Practice Random 10 <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-ink/10 pb-4">
          <div className="flex items-baseline gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] opacity-40">Collection Browser</h3>
            <span className="text-[10px] font-bold opacity-20">{filteredWords.length} visible</span>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <input 
              type="text"
              placeholder="Search library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-b border-ink/20 focus:border-ink outline-none text-[10px] uppercase font-bold tracking-widest py-1 flex-1 md:w-48"
            />
            {languageWords.length > 12 && (
              <button 
                onClick={() => setViewAll(!viewAll)}
                className="text-[10px] font-bold uppercase tracking-widest border border-ink px-4 py-1 hover:bg-ink hover:text-paper transition-all whitespace-nowrap"
              >
                {viewAll ? 'Collapse' : `View All`}
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
          {displayedWords.map((word) => {
            const isGerman = word.language === 'german' || !!word.genderArticle;
            return (
              <div 
                key={word.id} 
                className="bg-paper p-8 group hover:bg-ink transition-colors duration-300 flex flex-col justify-between cursor-pointer"
                onClick={() => onStartReview([word])}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                     <span className={`text-[8px] uppercase font-bold tracking-widest px-2 py-1 border border-ink/20 group-hover:border-paper/40 group-hover:text-paper ${
                      word.status === 'mastered' ? 'bg-ink text-paper border-none' : ''
                    }`}>
                      {word.status}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playPronunciation(word.word, isGerman);
                      }}
                      className="p-1.5 bg-ink/5 group-hover:bg-paper/15 text-ink/70 group-hover:text-paper rounded-full transition-all cursor-pointer hover:scale-105 border border-ink/5"
                      title="Speak Pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <h4 className="text-3xl font-serif font-bold text-ink capitalize tracking-tighter group-hover:text-paper transition-colors mb-1">
                    {isGerman && word.genderArticle && (
                      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-600 group-hover:text-amber-300 mr-1.5 align-middle">
                        [{word.genderArticle}]
                      </span>
                    )}
                    {word.word}
                  </h4>
                  
                  <div className="flex items-center gap-1.5 flex-wrap mb-3 leading-none">
                    {word.ipa && (
                      <span className="font-mono text-[10px] text-ink/40 group-hover:text-paper/40 tracking-wider">
                        {word.ipa}
                      </span>
                    )}
                    {word.partOfSpeech && (
                      <span className="bg-ink/5 group-hover:bg-paper/10 text-ink/60 group-hover:text-paper/70 text-[7px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm border border-ink/10 group-hover:border-paper/10">
                        {word.partOfSpeech}
                      </span>
                    )}
                    {isGerman && (
                      <span className="bg-amber-100 group-hover:bg-amber-900 group-hover:text-amber-100 text-amber-800 text-[7px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm border border-amber-200">
                        German
                      </span>
                    )}
                  </div>
                  
                  <p className="text-ink/50 text-xs line-clamp-2 group-hover:text-paper/40 transition-colors leading-relaxed">{word.meaningEn}</p>
                </div>
                
                <div className="mt-8 pt-8 border-t border-ink/5 group-hover:border-paper/10 text-[9px] uppercase font-bold tracking-widest opacity-30 group-hover:text-paper transition-all flex justify-between items-center">
                  <span>NEXT / {word.nextReview ? (typeof word.nextReview.toDate === 'function' ? word.nextReview.toDate() : new Date(word.nextReview)).toLocaleDateString() : 'Instant'}</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
          {languageWords.length === 0 && (
            <div className="col-span-full py-32 text-center bg-paper">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-20 block mb-4">Empty Library</span>
              <p className="text-2xl font-serif italic text-ink/40">No entries have been indexed yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
