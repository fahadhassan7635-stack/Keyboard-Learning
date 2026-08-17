import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

interface StatsPanelProps {
  wpm: number;
  accuracy: number;
  mistakes: number;
  elapsedTime: number;
  targetWPM?: number;
}

export default function StatsPanel({ wpm, accuracy, mistakes, elapsedTime, targetWPM }: StatsPanelProps) {
  const darkMode = useStore((s) => s.darkMode);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const accuracyColor = accuracy >= 95 ? '#22c55e' : accuracy >= 80 ? '#f59e0b' : '#ef4444';
  const wpmColor = '#3b82f6';

  const stats = [
    {
      label: 'WPM',
      value: wpm,
      suffix: '',
      color: wpmColor,
      icon: '⚡',
      progress: targetWPM ? Math.min((wpm / targetWPM) * 100, 100) : null,
      progressColor: wpmColor,
      bg: darkMode ? '#1e3a5f' : '#eff6ff',
    },
    {
      label: 'Accuracy',
      value: accuracy,
      suffix: '%',
      color: accuracyColor,
      icon: '🎯',
      progress: accuracy,
      progressColor: accuracyColor,
      bg: darkMode
        ? accuracy >= 95 ? '#14532d' : accuracy >= 80 ? '#451a03' : '#450a0a'
        : accuracy >= 95 ? '#f0fdf4' : accuracy >= 80 ? '#fffbeb' : '#fef2f2',
    },
    {
      label: 'Mistakes',
      value: mistakes,
      suffix: '',
      color: mistakes === 0 ? '#22c55e' : '#ef4444',
      icon: mistakes === 0 ? '✨' : '⚠️',
      progress: null,
      progressColor: '',
      bg: darkMode
        ? mistakes === 0 ? '#14532d' : '#450a0a'
        : mistakes === 0 ? '#f0fdf4' : '#fef2f2',
    },
    {
      label: 'Time',
      value: formatTime(elapsedTime),
      suffix: '',
      color: '#8b5cf6',
      icon: '⏱️',
      progress: null,
      progressColor: '',
      bg: darkMode ? '#2d1b69' : '#faf5ff',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          className="rounded-xl p-3 transition-colors duration-300"
          style={{ backgroundColor: stat.bg }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {stat.label}
            </span>
            <span className="text-sm">{stat.icon}</span>
          </div>
          <div
            className="text-2xl font-bold font-mono leading-none"
            style={{ color: stat.color }}
          >
            {stat.value}{stat.suffix}
          </div>
          {stat.progress !== null && (
            <div className="mt-2 h-1 rounded-full" style={{ backgroundColor: darkMode ? '#374151' : '#e5e7eb' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: stat.progressColor }}
              />
            </div>
          )}
          {stat.label === 'WPM' && targetWPM && (
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Target: {targetWPM}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
