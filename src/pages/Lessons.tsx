import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, ChevronRight, RotateCcw, ArrowLeft, BookOpen } from 'lucide-react';
import { LESSONS, type Lesson } from '../data/lessons';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useStore } from '../store/useStore';
import TypingArea from '../components/TypingArea';
import StatsPanel from '../components/StatsPanel';
import Keyboard from '../components/Keyboard';
import ResultModal from '../components/ResultModal';
import { useSounds } from '../hooks/useSound';

export default function Lessons() {
  const darkMode = useStore((s) => s.darkMode);
  const unlockedLessons = useStore((s) => s.unlockedLessons);
  const unlockLesson = useStore((s) => s.unlockLesson);
  const addSession = useStore((s) => s.addSession);
  const updateStreak = useStore((s) => s.updateStreak);

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentKey, setCurrentKey] = useState('');
  const [pressedKey, setPressedKey] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const { playSuccess } = useSounds();
  const pressTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const {
    typed, errors, currentIndex, isComplete,
    wpm, accuracy, mistakeCount, elapsedTime,
    handleKeyPress, handleBackspace, reset,
  } = useTypingEngine(selectedLesson?.content || '');

  // When lesson completes
  useEffect(() => {
    if (isComplete && selectedLesson) {
      playSuccess();
      updateStreak();
      const currentIdx = LESSONS.findIndex((l) => l.id === selectedLesson.id);
      if (currentIdx < LESSONS.length - 1) {
        unlockLesson(LESSONS[currentIdx + 1].id);
      }
      addSession({
        lessonId: selectedLesson.id,
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

  const handleKeyDown = useCallback((char: string) => {
    setPressedKey(char);
    if (pressTimeout.current) clearTimeout(pressTimeout.current);
    pressTimeout.current = setTimeout(() => setPressedKey(''), 150);
    handleKeyPress(char);
  }, [handleKeyPress]);

  const handleCurrentKey = useCallback((key: string) => {
    setCurrentKey(key);
  }, []);

  const handleRetry = () => {
    reset();
    setShowResult(false);
    setCurrentKey('');
  };

  const handleNext = () => {
    const idx = LESSONS.findIndex((l) => l.id === selectedLesson?.id);
    if (idx < LESSONS.length - 1) {
      const nextLesson = LESSONS[idx + 1];
      setSelectedLesson(nextLesson);
      reset();
      setShowResult(false);
      setCurrentKey('');
    }
  };

  const filteredLessons = filter === 'all' ? LESSONS : LESSONS.filter((l) => l.level === filter);

  const levelConfig = {
    beginner: {
      bg: darkMode ? 'bg-emerald-900/25' : 'bg-emerald-50',
      text: 'text-emerald-500',
      border: darkMode ? 'border-emerald-900' : 'border-emerald-100',
      dot: 'bg-emerald-400',
    },
    intermediate: {
      bg: darkMode ? 'bg-amber-900/25' : 'bg-amber-50',
      text: 'text-amber-500',
      border: darkMode ? 'border-amber-900' : 'border-amber-100',
      dot: 'bg-amber-400',
    },
    advanced: {
      bg: darkMode ? 'bg-rose-900/25' : 'bg-rose-50',
      text: 'text-rose-500',
      border: darkMode ? 'border-rose-900' : 'border-rose-100',
      dot: 'bg-rose-400',
    },
  };

  // Lesson select screen
  if (!selectedLesson) {
    const completedCount = LESSONS.filter((_l, i) => {
      const nextIdx = i + 1;
      return nextIdx < LESSONS.length && unlockedLessons.includes(LESSONS[nextIdx].id);
    }).length;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Typing Lessons
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {completedCount} of {LESSONS.length} lessons completed
              </p>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className={`h-2 rounded-full mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / LESSONS.length) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
            />
          </div>

          {/* Filter pills */}
          <div className={`inline-flex gap-1 p-1 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  filter === f
                    ? 'bg-blue-500 text-white shadow-sm'
                    : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Lesson grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredLessons.map((lesson, i) => {
            const isUnlocked = unlockedLessons.includes(lesson.id);
            const lessonIdx = LESSONS.findIndex((l) => l.id === lesson.id);
            const isCompleted = lessonIdx + 1 < LESSONS.length && unlockedLessons.includes(LESSONS[lessonIdx + 1].id);
            const cfg = levelConfig[lesson.level];

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.035 }}
                whileHover={isUnlocked ? { y: -2, transition: { duration: 0.12 } } : {}}
                onClick={() => isUnlocked && setSelectedLesson(lesson)}
                className={`relative p-4 rounded-2xl border transition-all duration-200 ${
                  isUnlocked
                    ? `cursor-pointer shadow-sm ${cfg.bg} ${cfg.border}`
                    : darkMode
                    ? 'bg-gray-800/50 border-gray-800 cursor-not-allowed'
                    : 'bg-gray-50 border-gray-100 cursor-not-allowed'
                } ${!isUnlocked ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${cfg.text}`}>
                        {lesson.level}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} capitalize`}>
                        · {lesson.category}
                      </span>
                    </div>
                    <h3 className={`font-bold text-sm leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {lesson.title}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {lesson.description}
                    </p>
                    {lesson.targetWPM && isUnlocked && (
                      <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } ${cfg.text}`}>
                        🎯 Target: {lesson.targetWPM} WPM
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 mt-0.5">
                    {!isUnlocked ? (
                      <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <Lock className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                    ) : isCompleted ? (
                      <div className="p-1.5 rounded-lg bg-green-500/10">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      </div>
                    ) : (
                      <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                        <ChevronRight className={`w-3.5 h-3.5 ${cfg.text}`} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active lesson screen
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setSelectedLesson(null); reset(); setCurrentKey(''); }}
          className={`p-2.5 rounded-xl border transition-colors ${
            darkMode
              ? 'border-gray-700 hover:bg-gray-700 text-gray-400'
              : 'border-gray-200 hover:bg-gray-100 text-gray-500'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.button>
        <div className="flex-1 min-w-0">
          <h2 className={`font-bold text-lg truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {selectedLesson.title}
          </h2>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {selectedLesson.description}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRetry}
          className={`p-2.5 rounded-xl border transition-colors ${
            darkMode
              ? 'border-gray-700 hover:bg-gray-700 text-gray-400'
              : 'border-gray-200 hover:bg-gray-100 text-gray-500'
          }`}
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Lesson progress */}
      <div className={`h-1.5 rounded-full mb-5 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <motion.div
          animate={{ width: `${(currentIndex / selectedLesson.content.length) * 100}%` }}
          transition={{ duration: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
        />
      </div>

      {/* Stats */}
      <div className="mb-4">
        <StatsPanel
          wpm={wpm}
          accuracy={accuracy}
          mistakes={mistakeCount}
          elapsedTime={elapsedTime}
          targetWPM={selectedLesson.targetWPM}
        />
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
          text={selectedLesson.content}
          typed={typed}
          errors={errors}
          currentIndex={currentIndex}
          isComplete={isComplete}
          onKeyPress={handleKeyDown}
          onBackspace={handleBackspace}
          onCurrentKey={handleCurrentKey}
        />
      </motion.div>

      {/* Keyboard guide */}
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
        <Keyboard
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
        targetWPM={selectedLesson.targetWPM}
        lessonTitle={selectedLesson.title}
        onRetry={handleRetry}
        onNext={LESSONS.findIndex((l) => l.id === selectedLesson.id) < LESSONS.length - 1 ? handleNext : undefined}
        onClose={() => setShowResult(false)}
      />
    </div>
  );
}
