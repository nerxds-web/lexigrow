import React, {useState, useEffect} from 'react';
import {onAuthStateChanged, signInWithPopup, signOut, User} from 'firebase/auth';
import {auth, googleProvider, db, handleFirestoreError, OperationType} from './lib/firebase';
import {doc, getDoc, setDoc, Timestamp, serverTimestamp, query, collection, onSnapshot, orderBy} from 'firebase/firestore';
import {AddWord} from './components/AddWord';
import {ReviewList} from './components/ReviewList';
import {ReviewModal} from './components/ReviewModal';
import {DailyDiscovery} from './components/DailyDiscovery';
import {ReviseToday} from './components/ReviseToday';
import {UserProfile, VocabularyWord, ProficiencyLevel} from './types';
import {LogOut, GraduationCap, Github, Twitter, Sparkles, Settings} from 'lucide-react';
import {motion} from 'motion/react';

export default function App() {
  console.log('App component rendering, user:', auth.currentUser?.uid);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewingWords, setReviewingWords] = useState<VocabularyWord[] | null>(null);
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [wordsLoading, setWordsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lexicon' | 'review'>('lexicon');

  useEffect(() => {
    if (!user) {
      setWords([]);
      setWordsLoading(true);
      return;
    }

    const userId = user.uid;
    const q = query(
      collection(db, `users/${userId}/vocabulary`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wordsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VocabularyWord[];
      setWords(wordsData);
      setWordsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/vocabulary`);
    });

    return () => unsubscribe();
  }, [user]);

  const dueWords = words.filter(w => {
    if (!w.nextReview) return true;
    const nextDate = w.nextReview.toDate();
    return nextDate <= new Date();
  });

  useEffect(() => {
    // Safety timeout to prevent being stuck on loading screen
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(safetyTimer);
      if (user) {
        // Ensure user profile exists in Firestore
        const userRef = doc(db, 'users', user.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Learner',
              photoURL: user.photoURL || '',
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          } else {
            setUserProfile(userSnap.data() as UserProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
        }
      } else {
        setUserProfile(null);
      }
      setUser(user);
      setLoading(false);
    });
    return () => {
      unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleSignOut = () => signOut(auth);

  const handleSetLevel = async (level: ProficiencyLevel) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userRef, { level }, { merge: true });
      setUserProfile(prev => prev ? { ...prev, level } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleSetLanguage = async (targetLanguage: 'english' | 'german') => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userRef, { targetLanguage }, { merge: true });
      setUserProfile(prev => prev ? { ...prev, targetLanguage } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-paper overflow-hidden relative selection:bg-ink selection:text-paper">
        <header className="relative z-10 px-8 py-6 flex justify-between items-center border-b border-ink">
          <div className="flex items-center gap-12">
            <span className="text-3xl font-serif font-bold tracking-tighter">LEXIGROW.</span>
            <nav className="hidden md:flex gap-8 text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">
              <a href="#" className="hover:opacity-100 transition-opacity">Archive</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Method</a>
              <a href="#" className="hover:opacity-100 transition-opacity">About</a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <Twitter className="w-4 h-4 opacity-30 hover:opacity-100 cursor-pointer transition-opacity" />
            <Github className="w-4 h-4 opacity-30 hover:opacity-100 cursor-pointer transition-opacity" />
          </div>
        </header>

        <main className="relative z-10 max-w-6xl mx-auto px-8 py-24 text-center">
          <motion.div 
            initial={{y: 20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            className="space-y-8"
          >
            <div className="inline-block border border-ink/20 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
              Intelligence in Language
            </div>
            <h1 className="text-7xl md:text-9xl font-serif font-bold leading-none tracking-tighter text-ink">
              Cultivate <br />
              <span className="italic font-normal text-ink/40">Vocabulary</span>
            </h1>
            <p className="text-lg md:text-xl text-ink/60 max-w-2xl mx-auto font-sans leading-relaxed mt-8">
              A meticulously crafted English-Arabic lexicon builder using Spaced Repetition to ensure cognitive retention.
            </p>
          </motion.div>

          <motion.div
            initial={{y: 20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{delay: 0.2}}
            className="mt-16"
          >
            <button
              onClick={handleSignIn}
              className="bg-ink text-paper px-12 py-5 font-bold uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all active:scale-95"
            >
              Sign up with Google
            </button>
            <p className="mt-8 text-ink/30 text-[10px] font-bold uppercase tracking-[0.2em]">50,000+ words mastered this week</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-ink mt-32 divide-x divide-ink border-x border-b">
            {[
              { title: "Semantic AI", desc: "Context-aware Arabic meanings and usage." },
              { title: "Cognitive Load", desc: "Optimized SRS algorithms for efficient recall." },
              { title: "Universal Sync", desc: "Your library, persists across every dimension." }
            ].map((f, i) => (
              <div key={i} className="p-12 text-left group hover:bg-ink transition-colors duration-500">
                <span className="text-[10px] font-bold opacity-30 group-hover:opacity-100 group-hover:text-paper transition-all">0{i+1}</span>
                <h3 className="font-serif font-bold text-2xl mt-4 group-hover:text-paper">{f.title}</h3>
                <p className="text-ink/60 mt-4 leading-relaxed group-hover:text-paper/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans text-ink selection:bg-ink selection:text-paper">
      <nav className="bg-paper border-b border-ink sticky top-0 z-40 w-full shrink-0">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-serif font-bold tracking-tighter">LEXIGROW.</span>
            <div className="hidden lg:flex gap-8 text-[10px] uppercase font-bold tracking-[0.2em]">
              <button 
                onClick={() => setActiveTab('lexicon')}
                className={`transition-all pb-1 cursor-pointer font-bold ${
                  activeTab === 'lexicon' 
                    ? 'text-ink opacity-100 border-b border-ink' 
                    : 'opacity-40 hover:opacity-100'
                }`}
              >
                Lexicon
              </button>
              <button 
                onClick={() => setActiveTab('review')}
                className={`transition-all pb-1 cursor-pointer font-bold flex items-center gap-1.5 ${
                  activeTab === 'review' 
                    ? 'text-ink opacity-100 border-b border-ink' 
                    : 'opacity-40 hover:opacity-100'
                }`}
              >
                Review
                {dueWords.length > 0 && (
                  <span className="bg-ink text-paper text-[8px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none shrink-0">
                    {dueWords.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {}} 
                disabled
                className="opacity-25 cursor-not-allowed font-bold"
              >
                Settings
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end pr-4 border-r border-ink/20">
              <span className="text-xs font-bold">{user.displayName}</span>
              <span className="text-[10px] uppercase font-bold opacity-30 tracking-widest">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-[10px] uppercase font-bold tracking-[0.2em] border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex-1 flex w-full">
        {/* Left Sidebar Accent */}
        <aside className="hidden xl:flex w-16 border-r border-ink flex-col items-center py-12 justify-between">
           <span className="vertical-text text-[10px] font-bold uppercase tracking-[0.5em] opacity-20">SYSTEM LOG 2026</span>
           <div className="flex flex-col gap-8 opacity-40">
             <Twitter className="w-4 h-4" />
             <Github className="w-4 h-4" />
           </div>
        </aside>

        <main className="flex-1 px-8 py-12 space-y-24">
          {activeTab === 'lexicon' ? (
            <>
              {userProfile && (
                <section>
                  <DailyDiscovery 
                    userProfile={userProfile} 
                    onLevelSet={handleSetLevel} 
                    onLanguageSet={handleSetLanguage}
                    onWordAdded={() => {}} 
                  />
                </section>
              )}

              <section className="space-y-8">
                <header className="flex items-baseline justify-between border-b border-ink/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Add New Entry</span>
                    <h2 className="text-5xl font-serif font-bold tracking-tighter">Intelligence.</h2>
                  </div>
                </header>
                <AddWord 
                  targetLanguage={(userProfile?.targetLanguage as 'english' | 'german') || 'english'}
                  onWordAdded={() => {}} 
                />
              </section>
            </>
          ) : (
            <>
              {/* Revision list today */}
              <section className="space-y-8">
                <header className="flex items-baseline justify-between border-b border-ink/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Priority Revision // Today</span>
                    <h2 className="text-5xl font-serif font-bold tracking-tighter">Revise Today.</h2>
                  </div>
                </header>
                <ReviseToday 
                  dueWords={dueWords} 
                  loading={wordsLoading} 
                  onStartReview={(selectedWords) => setReviewingWords(selectedWords)} 
                />
              </section>

              <section className="space-y-8">
                <header className="flex items-baseline justify-between border-b border-ink/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 font-sans">Curation Dashboard</span>
                    <h2 className="text-5xl font-serif font-bold tracking-tighter">Archive.</h2>
                  </div>
                </header>
                <ReviewList 
                  words={words} 
                  loading={wordsLoading} 
                  onStartReview={(selectedWords) => setReviewingWords(selectedWords)} 
                />
              </section>
            </>
          )}
        </main>

        <aside className="hidden xl:flex w-64 border-l border-ink p-8 flex-col justify-start gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-6">Cognitive Stats</p>
            <div className="space-y-6">
              <div>
                <span className="text-4xl font-serif italic tracking-tighter leading-none">
                  {userProfile?.level ? `Grade ${userProfile.level}` : 'P-Level 4'}
                </span>
                <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-60">Status Grade</p>
              </div>
              <div className="pt-6 border-t border-ink/10">
                <span className="text-2xl font-serif font-bold tracking-tighter">98.2%</span>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Accuracy Ratio</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-ink/10">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4">Target Language</p>
             <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleSetLanguage('english')}
                  className={`text-[10px] font-bold py-2 border transition-all cursor-pointer ${(!userProfile?.targetLanguage || userProfile?.targetLanguage === 'english') ? 'bg-ink text-paper border-ink' : 'border-ink/10 opacity-30 hover:opacity-100'}`}
                >
                  English 🇬🇧
                </button>
                <button 
                  onClick={() => handleSetLanguage('german')}
                  className={`text-[10px] font-bold py-2 border transition-all cursor-pointer ${userProfile?.targetLanguage === 'german' ? 'bg-ink text-paper border-ink' : 'border-ink/10 opacity-30 hover:opacity-100'}`}
                >
                  German 🇩🇪
                </button>
             </div>
          </div>

          <div className="pt-6 border-t border-ink/10">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4 font-sans">Proficiency Grade</p>
             <div className="grid grid-cols-3 gap-2">
                {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as ProficiencyLevel[]).map(level => (
                  <button 
                    key={level}
                    onClick={() => handleSetLevel(level)}
                    className={`text-[10px] font-bold py-2 border transition-all cursor-pointer ${userProfile?.level === level ? 'bg-ink text-paper border-ink' : 'border-ink/10 opacity-30 hover:opacity-100'}`}
                  >
                    {level}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="mt-auto vertical-text text-[8px] font-bold uppercase tracking-[0.5em] opacity-10 pb-4 self-center">
            LE-XIGROW V.1.0 // ENGINE.44
          </div>
        </aside>
      </div>

      {reviewingWords && (
        <ReviewModal 
          words={reviewingWords} 
          onComplete={() => setReviewingWords(null)}
          onClose={() => setReviewingWords(null)}
        />
      )}
    </div>
  );
}
