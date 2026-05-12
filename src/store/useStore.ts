import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TypingSession {
  lessonId: string;
  wpm: number;
  accuracy: number;
  mistakes: number;
  duration: number;
  date: string;
}

interface StoreState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Unlocked lessons
  unlockedLessons: string[];
  unlockLesson: (id: string) => void;

  // Streak
  streak: number;
  lastPracticeDate: string;
  updateStreak: () => void;

  // History
  sessions: TypingSession[];
  addSession: (session: TypingSession) => void;

  // Weak keys
  weakKeys: Record<string, number>; // key -> error count
  recordKeyError: (key: string) => void;
  clearWeakKeys: () => void;

  // Daily challenge
  dailyChallengeCompleted: boolean;
  setDailyChallengeCompleted: (v: boolean) => void;
  lastChallengeDate: string;
  checkDailyChallenge: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Theme
      darkMode: false,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // Sound
      soundEnabled: true,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      // Navigation
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Unlocked lessons
      unlockedLessons: ['b1'],
      unlockLesson: (id) =>
        set((s) => ({
          unlockedLessons: s.unlockedLessons.includes(id)
            ? s.unlockedLessons
            : [...s.unlockedLessons, id],
        })),

      // Streak
      streak: 0,
      lastPracticeDate: '',
      updateStreak: () => {
        const today = new Date().toDateString();
        const { lastPracticeDate, streak } = get();
        if (lastPracticeDate === today) return;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = lastPracticeDate === yesterday.toDateString();
        set({
          streak: wasYesterday ? streak + 1 : 1,
          lastPracticeDate: today,
        });
      },

      // History
      sessions: [],
      addSession: (session) =>
        set((s) => ({
          sessions: [session, ...s.sessions].slice(0, 50),
        })),

      // Weak keys
      weakKeys: {},
      recordKeyError: (key) =>
        set((s) => ({
          weakKeys: {
            ...s.weakKeys,
            [key]: (s.weakKeys[key] || 0) + 1,
          },
        })),
      clearWeakKeys: () => set({ weakKeys: {} }),

      // Daily challenge
      dailyChallengeCompleted: false,
      lastChallengeDate: '',
      setDailyChallengeCompleted: (v) => set({ dailyChallengeCompleted: v }),
      checkDailyChallenge: () => {
        const today = new Date().toDateString();
        const { lastChallengeDate } = get();
        if (lastChallengeDate !== today) {
          set({ dailyChallengeCompleted: false, lastChallengeDate: today });
        }
      },
    }),
    {
      name: 'keyboard-learning-store',
    }
  )
);
