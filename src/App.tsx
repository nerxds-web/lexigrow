import React, {useState, useEffect} from 'react';
import {onAuthStateChanged, signInWithPopup, signOut, User, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
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
  const [activeTab, setActiveTab] = useState<'lexicon' | 'review' | 'settings'>('lexicon');

  const activeLanguage = userProfile?.targetLanguage || 'english';
  const activeLevel = activeLanguage === 'german'
    ? (userProfile?.germanLevel || userProfile?.level || 'A1')
    : (userProfile?.englishLevel || userProfile?.level || 'B2');

  const resolvedUserProfile = userProfile ? {
    ...userProfile,
    level: activeLevel
  } : null;

  // Credentials login states
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!user) {
      setWords([]);
      setWordsLoading(true);
      return;
    }

    const userId = (user.email === 'nerxds@gmail.com' || user.email === 'nerxds@lexigrow.com') ? 'zpGQputpwlevMIYLN3DrjQWyXi52' : user.uid;
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
    const activeLanguage = userProfile?.targetLanguage || 'english';
    const wordLang = w.language || 'english';
    if (wordLang !== activeLanguage) return false;

    if (!w.nextReview) return true;
    const nextDate = typeof w.nextReview.toDate === 'function' ? w.nextReview.toDate() : new Date(w.nextReview);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    return nextDate <= endOfToday;
  });

  useEffect(() => {
    // Safety timeout to prevent being stuck on loading screen
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      clearTimeout(safetyTimer);
      if (u) {
        // Ensure user profile exists in Firestore
        const targetUid = (u.email === 'nerxds@gmail.com' || u.email === 'nerxds@lexigrow.com') ? 'zpGQputpwlevMIYLN3DrjQWyXi52' : u.uid;
        const userRef = doc(db, 'users', targetUid);
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            const newProfile: UserProfile = {
              uid: targetUid,
              email: u.email || '',
              displayName: u.displayName || u.email?.split('@')[0] || 'Learner',
              photoURL: u.photoURL || '',
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          } else {
            setUserProfile(userSnap.data() as UserProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${targetUid}`);
        }
      } else {
        setUserProfile(null);
      }
      setUser(u);
      setLoading(false);
    });
    return () => {
      unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, []);

  const handleSignIn = async () => {
    setErrorMsg("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Sign in failed:", error);
      if (error?.code === 'auth/unauthorized-domain') {
        setErrorMsg("Authorized Domain Error: Your Vercel domain is not authorized in Firebase. Please add your Vercel URL to the 'Authorized Domains' list in Firebase Console > Authentication > Settings.");
      } else if (error?.code === 'auth/popup-closed-by-user') {
        setErrorMsg("The sign-in popup was closed before completion. Please try again.");
      } else if (error?.code === 'auth/popup-blocked') {
        setErrorMsg("The sign-in popup was blocked by your browser. Please enable popups or try the Username / Password sign-in below.");
      } else {
        setErrorMsg(error?.message || "Google sign-in could not be completed. You can use Username / Password login as a fallback!");
      }
    }
  };

  const handleCredentialsAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    setErrorMsg("");
    setLoadingAuth(true);

    const cleanUsername = username.trim().toLowerCase();
    const email = `${cleanUsername}@lexigrow.com`;

    try {
      if (authMode === 'signin') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
          // Auto-register requested admin if not yet registered in Auth
          if (cleanUsername === 'nerxds' && password === 'lexigrow2005' && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
            try {
              await createUserWithEmailAndPassword(auth, email, password);
              return;
            } catch (createErr: any) {
              console.error("Auto registration of requesting credentials failed:", createErr);
            }
          }
          throw error;
        }
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMsg("Invalid username or password.");
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMsg("This username is already taken.");
      } else if (error.code === 'auth/operation-not-allowed') {
        setErrorMsg("Username/Password auth is not enabled in Firebase. Please enable the 'Email/Password' Provider in the Firebase Web Console under Authentication > Sign-in method.");
      } else if (error.code === 'auth/weak-password') {
        setErrorMsg("The password must be at least 6 characters.");
      } else {
        setErrorMsg(error.message || "An authentication error occurred.");
      }
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleSignOut = () => signOut(auth);

  const handleSetLevelForLanguage = async (lang: 'english' | 'german', level: ProficiencyLevel) => {
    if (!user) return;
    const targetUid = (user.email === 'nerxds@gmail.com' || user.email === 'nerxds@lexigrow.com') ? 'zpGQputpwlevMIYLN3DrjQWyXi52' : user.uid;
    const userRef = doc(db, 'users', targetUid);

    const updateObj: any = {};
    if (lang === 'german') {
      updateObj.germanLevel = level;
    } else {
      updateObj.englishLevel = level;
    }

    // Also update generic level for active language for backward compatibility
    if (lang === activeLanguage) {
      updateObj.level = level;
    }

    try {
      await setDoc(userRef, updateObj, { merge: true });
      setUserProfile(prev => prev ? { ...prev, ...updateObj } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${targetUid}`);
    }
  };

  const handleSetLevel = async (level: ProficiencyLevel) => {
    await handleSetLevelForLanguage(activeLanguage, level);
  };

  const handleSetLanguage = async (targetLanguage: 'english' | 'german') => {
    if (!user) return;
    const targetUid = (user.email === 'nerxds@gmail.com' || user.email === 'nerxds@lexigrow.com') ? 'zpGQputpwlevMIYLN3DrjQWyXi52' : user.uid;
    const userRef = doc(db, 'users', targetUid);
    try {
      await setDoc(userRef, { targetLanguage }, { merge: true });
      setUserProfile(prev => prev ? { ...prev, targetLanguage } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${targetUid}`);
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
            className="mt-16 max-w-md mx-auto"
          >
            <div className="bg-white border border-ink p-8 text-left space-y-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex border-b border-ink/10 pb-4 justify-between items-center">
                <span className="text-xs uppercase font-bold tracking-[0.2em] opacity-60">
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </span>
                <button 
                  onClick={() => {
                    setAuthMode(authMode === 'signin' ? 'register' : 'signin');
                    setErrorMsg('');
                  }}
                  className="text-[10px] uppercase font-bold tracking-[0.2em] underline opacity-40 hover:opacity-100 cursor-pointer"
                >
                  {authMode === 'signin' ? 'Register instead' : 'Sign in instead'}
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-500/20 text-red-600 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCredentialsAuth} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 block">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="E.g. nerxds"
                    className="w-full px-4 py-3 bg-transparent border border-ink/20 focus:border-ink outline-none transition-all text-sm font-sans"
                    disabled={loadingAuth}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 block">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-transparent border border-ink/20 focus:border-ink outline-none transition-all text-sm font-sans"
                    disabled={loadingAuth}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingAuth}
                  className="w-full bg-ink text-paper py-4 font-bold uppercase tracking-[0.2em] text-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                >
                  {loadingAuth ? 'Processing...' : authMode === 'signin' ? 'Access App' : 'Register Account'}
                </button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-ink/10"></div>
                <span className="flex-shrink mx-4 text-[9px] uppercase font-bold tracking-[0.2em] opacity-30">or</span>
                <div className="flex-grow border-t border-ink/10"></div>
              </div>

              <button
                onClick={handleSignIn}
                className="w-full border border-ink py-4 font-bold uppercase tracking-[0.2em] hover:bg-ink hover:text-paper transition-all text-[10px] flex items-center justify-center gap-2 cursor-pointer"
              >
                Sign In with Google
              </button>
            </div>
            
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
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex justify-between items-center gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-6 sm:gap-12 w-full">
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tighter">LEXIGROW.</span>
            <div className="flex gap-4 sm:gap-8 text-[10px] uppercase font-bold tracking-[0.15em] sm:tracking-[0.2em]">
              <button 
                onClick={() => setActiveTab('lexicon')}
                className={`transition-all pb-1 cursor-pointer font-bold ${
                  activeTab === 'lexicon' 
                    ? 'text-ink opacity-100 border-b border-ink' 
                    : 'opacity-45 hover:opacity-100'
                }`}
              >
                Lexicon
              </button>
              <button 
                onClick={() => setActiveTab('review')}
                className={`transition-all pb-1 cursor-pointer font-bold flex items-center gap-1.5 ${
                  activeTab === 'review' 
                    ? 'text-ink opacity-100 border-b border-ink' 
                    : 'opacity-45 hover:opacity-100'
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
                onClick={() => setActiveTab('settings')} 
                className={`transition-all pb-1 cursor-pointer font-bold ${
                  activeTab === 'settings' 
                    ? 'text-ink opacity-100 border-b border-ink' 
                    : 'opacity-45 hover:opacity-100'
                }`}
              >
                Settings
              </button>
            </div>
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

        <main className="flex-1 px-6 sm:px-8 py-12 space-y-24">
          {activeTab === 'lexicon' && (
            <>
              {resolvedUserProfile && (
                <section>
                  <DailyDiscovery 
                    userProfile={resolvedUserProfile} 
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
                    <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tighter">Intelligence.</h2>
                  </div>
                </header>
                <AddWord 
                  targetLanguage={(resolvedUserProfile?.targetLanguage as 'english' | 'german') || 'english'}
                  onWordAdded={() => {}} 
                />
              </section>
            </>
          )}

          {activeTab === 'review' && (
            <>
              {/* Revision list today */}
              <section className="space-y-8">
                <header className="flex items-baseline justify-between border-b border-ink/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Priority Revision // Today</span>
                    <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tighter">Revise Today.</h2>
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
                    <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tighter">Archive.</h2>
                  </div>
                </header>
                <ReviewList 
                  words={words} 
                  loading={wordsLoading} 
                  targetLanguage={(resolvedUserProfile?.targetLanguage as 'english' | 'german') || 'english'}
                  onStartReview={(selectedWords) => setReviewingWords(selectedWords)} 
                />
              </section>
            </>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-12">
              <header className="flex items-baseline justify-between border-b border-ink/10 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Application Settings</span>
                  <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tighter">Settings.</h2>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Account card */}
                <div className="border border-ink/10 p-6 sm:p-8 space-y-6 bg-white hover:shadow-[6px_6px_0px_0px_rgba(28,28,28,1)] transition-all duration-300">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 block">User Account</span>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-ink text-paper font-serif italic text-xl flex items-center justify-center font-bold">
                      {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg leading-tight">{user.displayName || 'Learner'}</h3>
                      <p className="text-xs opacity-50 font-mono mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-ink/5">
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-ink text-white py-4 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer border border-ink"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Configurations card */}
                <div className="border border-ink/10 p-6 sm:p-8 space-y-6 bg-white hover:shadow-[6px_6px_0px_0px_rgba(28,28,28,1)] transition-all duration-300">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 block">Course Configurations</span>
                    <h3 className="text-xl font-serif font-bold italic">Language Targets & Grades</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-45 block mb-2">Active Study Stream</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleSetLanguage('english')}
                          className={`text-[10px] font-bold py-3 border transition-all cursor-pointer flex items-center justify-center gap-2 ${activeLanguage === 'english' ? 'bg-ink text-paper border-ink' : 'border-ink/15 opacity-40 hover:opacity-100'}`}
                        >
                          English 🇬🇧 {activeLanguage === 'english' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />}
                        </button>
                        <button 
                          onClick={() => handleSetLanguage('german')}
                          className={`text-[10px] font-bold py-3 border transition-all cursor-pointer flex items-center justify-center gap-2 ${activeLanguage === 'german' ? 'bg-ink text-paper border-ink' : 'border-ink/15 opacity-40 hover:opacity-100'}`}
                        >
                          German 🇩🇪 {activeLanguage === 'german' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 p-4 border border-ink/5 bg-ink/[1%]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold font-serif flex items-center gap-1.5">
                          <span>English Grade</span> 🇬🇧
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-ink/5 px-2 py-0.5 rounded uppercase">
                          Level: {userProfile?.englishLevel || userProfile?.level || 'B2'}
                        </span>
                      </div>
                      <div className="grid grid-cols-6 gap-1">
                        {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as ProficiencyLevel[]).map(level => {
                          const isCurrent = (userProfile?.englishLevel || userProfile?.level || 'B2') === level;
                          return (
                            <button 
                              key={level}
                              onClick={() => handleSetLevelForLanguage('english', level)}
                              className={`text-[9px] font-bold py-2 border transition-all cursor-pointer text-center ${isCurrent ? 'bg-ink text-paper border-ink' : 'border-ink/10 opacity-40 hover:opacity-100 bg-white'}`}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2 p-4 border border-ink/5 bg-ink/[1%]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold font-serif flex items-center gap-1.5">
                          <span>German Grade</span> 🇩🇪
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-ink/5 px-2 py-0.5 rounded uppercase">
                          Level: {userProfile?.germanLevel || userProfile?.level || 'A1'}
                        </span>
                      </div>
                      <div className="grid grid-cols-6 gap-1">
                        {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as ProficiencyLevel[]).map(level => {
                          const isCurrent = (userProfile?.germanLevel || userProfile?.level || 'A1') === level;
                          return (
                            <button 
                              key={level}
                              onClick={() => handleSetLevelForLanguage('german', level)}
                              className={`text-[9px] font-bold py-2 border transition-all cursor-pointer text-center ${isCurrent ? 'bg-ink text-paper border-ink' : 'border-ink/10 opacity-40 hover:opacity-100 bg-white'}`}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <aside className="hidden xl:flex w-64 border-l border-ink p-8 flex-col justify-start gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-6">Cognitive Stats</p>
            <div className="space-y-6">
              <div>
                <span className="text-4xl font-serif italic tracking-tighter leading-none">
                  {activeLevel ? `Grade ${activeLevel}` : 'P-Level 4'}
                </span>
                <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-60">
                  {activeLanguage === 'german' ? 'German' : 'English'} Status Grade
                </p>
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
                  className={`text-[10px] font-bold py-2 border transition-all cursor-pointer ${activeLanguage === 'english' ? 'bg-ink text-paper border-ink' : 'border-ink/10 opacity-30 hover:opacity-100'}`}
                >
                  English 🇬🇧
                </button>
                <button 
                  onClick={() => handleSetLanguage('german')}
                  className={`text-[10px] font-bold py-2 border transition-all cursor-pointer ${activeLanguage === 'german' ? 'bg-ink text-paper border-ink' : 'border-ink/10 opacity-30 hover:opacity-100'}`}
                >
                  German 🇩🇪
                </button>
             </div>
          </div>

          <div className="pt-6 border-t border-ink/10">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2 font-sans">Proficiency Grade</p>
             <p className="text-[9px] opacity-45 mb-3 uppercase tracking-wider font-mono">For {activeLanguage === 'german' ? 'German' : 'English'}:</p>
             <div className="grid grid-cols-3 gap-2">
                {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as ProficiencyLevel[]).map(level => (
                  <button 
                    key={level}
                    onClick={() => handleSetLevel(level)}
                    className={`text-[10px] font-bold py-2 border transition-all cursor-pointer ${activeLevel === level ? 'bg-ink text-paper border-ink' : 'border-ink/10 opacity-30 hover:opacity-100'}`}
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
