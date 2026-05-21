import React, {useState} from 'react';
import {Plus, Search, Loader2, Volume2} from 'lucide-react';
import {lookupWord} from '../lib/gemini';
import {db, auth, getEffectiveUid} from '../lib/firebase';
import {doc, getDoc} from 'firebase/firestore';
import {GeminiWordResult} from '../types';
import {addWordToCollection} from '../services/vocabularyService';
import {cn} from '../lib/utils';
import {playPronunciation} from '../lib/pronounce';

interface AddWordProps {
  targetLanguage: 'english' | 'german';
  onWordAdded: () => void;
}

export function AddWord({targetLanguage, onWordAdded}: AddWordProps) {
  const [wordInput, setWordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<GeminiWordResult | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<'der' | 'die' | 'das' | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordInput.trim()) return;
    
    setLoading(true);
    setPreview(null);
    setSelectedArticle(null);
    setLookupError(null);
    try {
      const result = await lookupWord(wordInput, targetLanguage);
      // Ensure local language field is set
      result.language = targetLanguage;
      setPreview(result);
    } catch (error: any) {
      console.error("Search failed:", error);
      let errorMsg = "Lookup failed. Please verify your internet connection and try again.";
      const errorString = String(error?.message || "") + JSON.stringify(error || "");
      if (errorString.includes("429") || errorString.toLowerCase().includes("quota") || errorString.toLowerCase().includes("limit")) {
        errorMsg = "Your daily Gemini free-tier quota (20 requests/day) has been reached. Please check back later or upgrade your key in Settings.";
      }
      setLookupError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const uid = getEffectiveUid();
    if (!preview || !uid) return;

    setLoading(true);
    try {
      await addWordToCollection(uid, preview);
      setWordInput('');
      setPreview(null);
      setSelectedArticle(null);
      setLookupError(null);
      onWordAdded();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const isGerman = targetLanguage === 'german' || preview?.language === 'german';
  const isNoun = isGerman && preview?.partOfSpeech?.toLowerCase().includes('noun') && preview?.genderArticle;

  return (
    <div className="w-full space-y-12">
      <form onSubmit={handleSearch} className="flex gap-4 items-end flex-wrap sm:flex-nowrap">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 ml-2">
            Vocabulary Lookup ({targetLanguage === 'german' ? 'German Mode 🇩🇪' : 'English Mode 🇬🇧'})
          </label>
          <input
            type="text"
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            placeholder={targetLanguage === 'german' ? "E.g. Apfel, Katze, Buch..." : "E.g. ubiquitous, benevolent..."}
            className="w-full px-6 py-4 bg-transparent border border-ink/20 focus:border-ink outline-none transition-all text-xl font-serif"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !wordInput.trim()}
          className="h-[60px] w-full sm:w-auto px-8 bg-ink text-paper uppercase font-bold tracking-[0.2em] text-[10px] hover:opacity-90 disabled:opacity-20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>Lookup</span>
        </button>
      </form>

      {lookupError && (
        <div className="border border-rose-500/10 bg-rose-500/[0.02] p-4 text-xs leading-relaxed text-rose-950/80 max-w-4xl animate-in fade-in duration-200">
          <p className="font-bold uppercase tracking-wider text-[9px] text-rose-700 font-mono mb-1">Lookup Exception</p>
          <p>{lookupError}</p>
        </div>
      )}

      {preview && (
        <div className="bg-white border border-ink p-12 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
          {/* Asymmetric accent */}
          <div className="absolute top-0 right-0 w-1/3 h-full border-l border-ink/5 pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2 block">Transcription</span>
                <div className="flex items-center gap-4 flex-wrap">
                  <h3 className="text-5xl sm:text-6xl font-serif font-bold text-ink capitalize tracking-tight leading-none -ml-1">
                    {isNoun && selectedArticle === preview.genderArticle && (
                      <span className="text-emerald-600 font-sans text-sm tracking-widest uppercase mr-3 font-bold select-none border border-emerald-600/30 px-2 py-0.5 rounded bg-emerald-50 align-middle">
                        {preview.genderArticle}
                      </span>
                    )}
                    {preview.word}
                  </h3>
                  <button
                    onClick={() => playPronunciation(preview.word, isGerman)}
                    className="p-3 bg-ink/5 hover:bg-ink hover:text-paper rounded-full transition-all cursor-pointer shadow-sm"
                    title="Speak Pronunciation"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                
                {preview.ipa && (
                  <p className="font-mono text-sm text-ink/40 tracking-wider mt-2">
                    {preview.ipa}
                  </p>
                )}
                
                <div className="flex items-center gap-2 flex-wrap mt-3">
                  {preview.partOfSpeech && (
                    <span className="inline-block bg-ink text-paper text-[9px] uppercase font-bold tracking-widest px-2.5 py-1">
                      {preview.partOfSpeech}
                    </span>
                  )}
                  {isGerman && (
                    <span className="inline-block bg-amber-100 text-amber-800 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 border border-amber-200">
                      German
                    </span>
                  )}
                </div>
              </div>

              {/* Add interactive der/die/das article selector tool in lookup too! */}
              {isNoun && (
                <div className="py-4 px-4 border border-ink/5 bg-ink/[0.01]">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-ink/40 block mb-2">Gender Article Tool (der/die/das):</span>
                  <div className="flex gap-2">
                    {(['der', 'die', 'das'] as const).map((article) => {
                      const isCorrect = article === preview.genderArticle;
                      const isSelected = article === selectedArticle;
                      let btnStyle = "border border-ink/15 text-ink/60 hover:bg-ink hover:text-paper";
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
                          type="button"
                          disabled={!!selectedArticle}
                          onClick={() => setSelectedArticle(article)}
                          className={cn("px-3 py-1.5 text-xs font-mono leading-none tracking-widest uppercase transition-all duration-200 cursor-pointer", btnStyle)}
                        >
                          {article}
                        </button>
                      );
                    })}
                  </div>
                  {selectedArticle && (
                    <span className={cn(
                      "text-[10px] uppercase tracking-wider font-semibold block mt-2",
                      selectedArticle === preview.genderArticle ? "text-emerald-700" : "text-rose-600"
                    )}>
                      {selectedArticle === preview.genderArticle 
                        ? `Correct! der/die/das for "${preview.word}" is "${preview.genderArticle}"` 
                        : `Incorrect. It is "${preview.genderArticle}"`
                      }
                    </span>
                  )}
                </div>
              )}
              
              <div className="pt-6 border-t border-ink/10 flex items-baseline gap-4">
                <span className="text-4xl font-serif italic text-ink/80 dir-rtl">{preview.meaningAr}</span>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Lexical Definition</p>
                  <p className="text-lg leading-relaxed text-ink/80">{preview.meaningEn}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Usage Context</p>
                  <div className="border-l border-ink/20 pl-6 space-y-3">
                    <p className="text-lg italic font-serif leading-relaxed text-ink/60">
                      "{preview.example}"
                    </p>
                    {preview.exampleAr && (
                      <p className="text-base font-arabic text-ink/45 dir-rtl leading-relaxed font-sans">
                        "{preview.exampleAr}"
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <button
                  onClick={handleSave}
                  className="w-full bg-ink text-paper py-4 uppercase font-bold tracking-[0.2em] text-[10px] hover:opacity-80 transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Index to Vocabulary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
