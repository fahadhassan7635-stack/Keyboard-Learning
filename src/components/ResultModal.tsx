import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, ChevronRight, Star, Zap, Target, Clock, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

interface ResultModalProps {
  isOpen: boolean;
  wpm: number;
  accuracy: number;
  mistakes: number;
  elapsedTime: number;
  targetWPM?: number;
  lessonTitle: string;
  onRetry: () => void;
  onNext?: () => void;
  onClose: () => void;
}

export default function ResultModal({
  isOpen,
  wpm,
  accuracy,
  mistakes,
  elapsedTime,
  targetWPM,
  lessonTitle,
  onRetry,
  onNext,
  onClose,
}: ResultModalProps) {
  const darkMode = useStore((s) => s.darkMode);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const rating = accuracy >= 95 && wpm >= (targetWPM || 0)
    ? 3
    : accuracy >= 85 || wpm >= (targetWPM || 0) * 0.8
    ? 2
    : 1;

  const ratingText = ['', 'Keep Practicing!', 'Good Job!', 'Excellent!'][rating];
  const ratingColor = ['', 'text-orange-500', 'text-yellow-500', 'text-green-500'][rating];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 mb-3"
              >
                <Trophy className="w-8 h-8 text-blue-500" />
              </motion.div>
              <h2 className="text-2xl font-bold">{lessonTitle}</h2>
              <p className={`text-sm mt-1 font-semibold ${ratingColor}`}>{ratingText}</p>

              {/* Stars */}
              <div className="flex justify-center gap-1 mt-2">
                {[1, 2, 3].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + star * 0.1, type: 'spring' }}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'text-yellow-400 fill-yellow-400' : (darkMode ? 'text-gray-600' : 'text-gray-200')
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: Zap, label: 'WPM', value: `${wpm}`, color: 'text-blue-500', subtext: targetWPM ? `Target: ${targetWPM}` : '' },
                { icon: Target, label: 'Accuracy', value: `${accuracy}%`, color: accuracy >= 95 ? 'text-green-500' : 'text-yellow-500', subtext: '' },
                { icon: AlertCircle, label: 'Mistakes', value: `${mistakes}`, color: mistakes === 0 ? 'text-green-500' : 'text-red-500', subtext: mistakes === 0 ? 'Perfect!' : '' },
                { icon: Clock, label: 'Time', value: formatTime(elapsedTime), color: 'text-purple-500', subtext: '' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</span>
                  </div>
                  <div className={`text-xl font-bold font-mono ${item.color}`}>{item.value}</div>
                  {item.subtext && (
                    <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.subtext}</div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={onRetry}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              {onNext && (
                <button
                  onClick={onNext}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
