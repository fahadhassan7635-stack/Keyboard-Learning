import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Hash, Calendar, AlertTriangle, RotateCcw, ArrowRight, Star, ArrowLeft, Keyboard } from 'lucide-react';
import { QUOTES, DAILY_CHALLENGES, WEAK_KEY_TEXTS } from '../data/lessons';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useStore } from '../store/useStore';
import TypingArea from '../components/TypingArea';
import StatsPanel from '../components/StatsPanel';
import KeyboardComp from '../components/Keyboard';
import ResultModal from '../components/ResultModal';
import { useSounds } from '../hooks/useSound';

type PracticeMode = 'quotes' | 'numbers' | 'daily' | 'weakkeys' | 'speed';

const SPEED_TEXTS = [
  'the quick brown fox jumps over the lazy dog and the dog barked loudly back at the fox',
  'she sells seashells by the seashore and the shells she sells are surely perfect seashells',
  'how much wood would a woodchuck chuck if a woodchuck could chuck wood it could chuck a lot',
];

export default function Practice() {
  const darkMode = useStore((s) => s.darkMode);
  const weakKeys = useStore((s) => s.weakKeys);
  const addSession = useStore((s) => s.addSession);
  const updateStreak = useStore((s) => s.updateStreak);
  const setDailyChallengeCompleted = useStore((s) => s.setDailyChallengeCompleted);
  const dailyChallengeCompleted = useStore((s) => s.dailyChallengeCompleted);

  const [mode, setMode] = useState<PracticeMode | null>(null);
  const [practiceText, setPracticeText] = useState('');
  const [currentKey, setCurrentKey] = useState('');
  const [pressedKey, setPressedKey] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const { playSuccess } = useSounds();
  const pressTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const {
    typed, errors, currentIndex, isComplete,
    wpm, accuracy, mistakeCount, elapsedTime,
    handleKeyPress, handleBackspace, reset,
  } = useTypingEngine(practiceText);

  useEffect(() => {
    if (isComplete && mode) {
      playSuccess();
      updateStreak();
      if (mode === 'daily') setDailyChallengeCompleted(true);
      addSession({
        lessonId: `practice-${mode}`,
        wpm,
        accuracy,
        mistakes: mistakeCount,
        duration: elapsedTime,
        date: new Date().toISOString(),
      });
      setTimeout(() => setShowResult(true), 600);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  const startMode = (m: PracticeMode) => {
    let text = '';
    switch (m) {
      case 'quotes': {
        const idx = Math.floor(Math.random() * QUOTES.length);
        setQuoteIndex(idx);
        text = QUOTES[idx].text;
        break;
      }
      case 'numbers':
        text = '1234567890 9876543210 1357 2468 1029 3847 5623 7810 4592 3761 8045 1234567890 9087654321';
        break;
      case 'daily': {
        const today = new Date();
        const idx = today.getDate() % DAILY_CHALLENGES.length;
        text = DAILY_CHALLENGES[idx];
        break;
      }
      case 'weakkeys': {
        const topWeak = Object.entries(weakKeys)
          .sort(([, a], [, b]) => b - a).slice(0, 3).map(([k]) => k);
        if (topWeak.length === 0) {
          text = 'Great job! No weak keys yet. Practice more lessons to discover which keys need improvement.';
        } else {
          text = topWeak.map((k) => WEAK_KEY_TEXTS[k] || `${k} ${k} ${k} ${k}`).join(' ');
        }
        break;
      }
      case 'speed':
        text = SPEED_TEXTS[Math.floor(Math.random() * SPEED_TEXTS.length)];
        break;
    }
    setPracticeText(text);
    setMode(m);
    reset();
    setCurrentKey('');
    setShowResult(false);
  };

  const handleKeyDown = useCallback((char: string) => {
    setPressedKey(char);
    if (pressTimeout.current) clearTimeout(pressTimeout.current);
    pressTimeout.current = setTimeout(() => setPressedKey(''), 150);
    handleKeyPress(char);
  }, [handleKeyPress]);

  const handleRetry = () => { reset(); setShowResult(false); };

  const handleNext = () => {
    if (mode === 'quotes') {
      const newIdx = (quoteIndex + 1) % QUOTES.length;
      setQuoteIndex(newIdx);
      setPracticeText(QUOTES[newIdx].text);
    } else {
      startMode(mode!);
    }
    reset();
    setShowResult(false);
  };

  const modes = [
    {
      id: 'quotes' as PracticeMode,
      icon: Quote,
      title: 'Quote Typing',
      description: 'Type famous quotes and inspirational words from great minds',
      iconBg: 'bg-blue-500',
      cardBg: darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-blue-50/50',
      border: darkMode ? 'border-gray-700 hover:border-blue-800' : 'border-gray-100 hover:border-blue-200',
      badge: `${QUOTES.length} quotes`,
      badgeColor: 'text-blue-500',
    },
    {
      id: 'numbers' as PracticeMode,
      icon: Hash,
      title: 'Numbers & Digits',
      description: 'Build number pad accuracy with digit sequence drills',
      iconBg: 'bg-green-500',
      cardBg: darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-green-50/50',
      border: darkMode ? 'border-gray-700 hover:border-green-800' : 'border-gray-100 hover:border-green-200',
      badge: 'Number row',
      badgeColor: 'text-green-500',
    },
    {
      id: 'daily' as PracticeMode,
      icon: Calendar,
      title: 'Daily Challenge',
      description: dailyChallengeCompleted ? '✓ Completed! Come back tomorrow.' : "Today's special challenge — changes every day",
      iconBg: dailyChallengeCompleted ? 'bg-green-500' : 'bg-yellow-500',
      cardBg: dailyChallengeCompleted
        ? (darkMode ? 'bg-gray-800' : 'bg-white')
        : (darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-yellow-50/50'),
      border: dailyChallengeCompleted
        ? (darkMode ? 'border-green-900' : 'border-green-100')
        : (darkMode ? 'border-gray-700 hover:border-yellow-800' : 'border-gray-100 hover:border-yellow-200'),
      badge: dailyChallengeCompleted ? '✓ Done' : 'Daily',
      badgeColor: dailyChallengeCompleted ? 'text-green-500' : 'text-yellow-500',
    },
    {
      id: 'weakkeys' as PracticeMode,
      icon: AlertTriangle,
      title: 'Weak Key Focus',
      description: Object.keys(weakKeys).length > 0
        ? `Top errors: ${Object.entries(weakKeys).sort(([,a],[,b]) => b-a).slice(0,3).map(([k]) => k.toUpperCase()).join(', ')}`
        : 'Complete lessons to discover your weakest keys',
      iconBg: 'bg-orange-500',
      cardBg: darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-orange-50/50',
      border: darkMode ? 'border-gray-700 hover:border-orange-800' : 'border-gray-100 hover:border-orange-200',
      badge: Object.keys(weakKeys).length > 0 ? `${Object.keys(weakKeys).length} weak keys` : 'No data yet',
      badgeColor: 'text-orange-500',
    },
    {
      id: 'speed' as PracticeMode,
      icon: Star,
      title: 'Speed Test',
      description: 'Measure and push your WPM with sentences designed for speed',
      iconBg: 'bg-purple-500',
      cardBg: darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-purple-50/50',
      border: darkMode ? 'border-gray-700 hover:border-purple-800' : 'border-gray-100 hover:border-purple-200',
      badge: 'Beat your best',
      badgeColor: 'text-purple-500',
    },
  ];

  // Mode select screen
  if (!mode) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Practice Modes
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Choose your practice style
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modes.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2, transition: { duration: 0.12 } }}
              onClick={() => startMode(m.id)}
              className={`p-5 rounded-2xl cursor-pointer border shadow-sm transition-all duration-200 ${m.cardBg} ${m.border}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${m.iconBg} rounded-xl flex items-center justify-center`}
                  style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  <m.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${m.badgeColor}`}>{m.badge}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${m.badgeColor}`} />
                </div>
              </div>
              <h3 className={`font-bold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {m.title}
              </h3>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {m.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const modeInfo = modes.find((m) => m.id === mode)!;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setMode(null); reset(); setCurrentKey(''); }}
          className={`p-2.5 rounded-xl border transition-colors ${
            darkMode ? 'border-gray-700 hover:bg-gray-700 text-gray-400' : 'border-gray-200 hover:bg-gray-100 text-gray-500'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.button>
        <div className="flex-1">
          <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {modeInfo.title}
          </h2>
          {mode === 'quotes' && (
            <p className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              — {QUOTES[quoteIndex]?.author}
            </p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRetry}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
            darkMode ? 'border-gray-700 hover:bg-gray-700 text-gray-400' : 'border-gray-200 hover:bg-gray-100 text-gray-500'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restart
        </motion.button>
      </div>

      {/* Stats */}
      <div className="mb-4">
        <StatsPanel wpm={wpm} accuracy={accuracy} mistakes={mistakeCount} elapsedTime={elapsedTime} />
      </div>

      {/* Typing area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl px-5 py-4 mb-4 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        } shadow-sm`}
      >
        <TypingArea
          text={practiceText}
          typed={typed}
          errors={errors}
          currentIndex={currentIndex}
          isComplete={isComplete}
          onKeyPress={handleKeyDown}
          onBackspace={handleBackspace}
          onCurrentKey={(key) => setCurrentKey(key)}
        />
      </motion.div>

      {/* Keyboard */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl px-4 py-5 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        } shadow-sm`}
      >
        <div className={`text-xs font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          KEYBOARD GUIDE
        </div>
        <KeyboardComp
          highlightKey={currentKey}
          pressedKey={pressedKey}
          showFingerColors={true}
        />
      </motion.div>

      <ResultModal
        isOpen={showResult}
        wpm={wpm}
        accuracy={accuracy}
        mistakes={mistakeCount}
        elapsedTime={elapsedTime}
        lessonTitle={modeInfo.title}
        onRetry={handleRetry}
        onNext={handleNext}
        onClose={() => setShowResult(false)}
      />
    </div>
  );
}
