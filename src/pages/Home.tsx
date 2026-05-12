import { motion } from 'framer-motion';
import {
  Keyboard, BookOpen, Gamepad2, Flame, TrendingUp,
  Trophy, ChevronRight, Calendar, Zap, Star
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Home() {
  const darkMode = useStore((s) => s.darkMode);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const streak = useStore((s) => s.streak);
  const sessions = useStore((s) => s.sessions);
  const unlockedLessons = useStore((s) => s.unlockedLessons);
  const dailyChallengeCompleted = useStore((s) => s.dailyChallengeCompleted);

  const avgWPM = sessions.length > 0
    ? Math.round(sessions.slice(0, 10).reduce((a, b) => a + b.wpm, 0) / Math.min(sessions.length, 10))
    : 0;
  const bestWPM = sessions.length > 0
    ? Math.max(...sessions.map((s) => s.wpm))
    : 0;
  const avgAcc = sessions.length > 0
    ? Math.round(sessions.slice(0, 10).reduce((a, b) => a + b.accuracy, 0) / Math.min(sessions.length, 10))
    : 0;

  const features = [
    {
      icon: BookOpen,
      title: 'Typing Lessons',
      description: 'Structured path from beginner to advanced with finger-zone guidance',
      tab: 'lessons',
      badge: `${unlockedLessons.length}/15 unlocked`,
      badgeColor: 'text-blue-500',
      iconBg: 'bg-blue-500',
      cardBg: darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-blue-50/50',
      border: darkMode ? 'border-gray-700 hover:border-blue-700' : 'border-gray-100 hover:border-blue-200',
    },
    {
      icon: Gamepad2,
      title: 'Falling Letters',
      description: 'Type falling letters before they hit the ground — with combos!',
      tab: 'game',
      badge: 'Play Now',
      badgeColor: 'text-purple-500',
      iconBg: 'bg-purple-500',
      cardBg: darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-purple-50/50',
      border: darkMode ? 'border-gray-700 hover:border-purple-700' : 'border-gray-100 hover:border-purple-200',
    },
    {
      icon: Keyboard,
      title: 'Practice Modes',
      description: 'Quotes, speed tests, daily challenge, and weak key training',
      tab: 'practice',
      badge: dailyChallengeCompleted ? '✓ Daily done' : 'Daily available',
      badgeColor: dailyChallengeCompleted ? 'text-green-500' : 'text-yellow-500',
      iconBg: 'bg-green-500',
      cardBg: darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-green-50/50',
      border: darkMode ? 'border-gray-700 hover:border-green-700' : 'border-gray-100 hover:border-green-200',
    },
    {
      icon: TrendingUp,
      title: 'Your Progress',
      description: 'WPM history, accuracy charts, streak tracker and weak key analysis',
      tab: 'progress',
      badge: sessions.length > 0 ? `${sessions.length} sessions` : 'Start tracking',
      badgeColor: 'text-orange-500',
      iconBg: 'bg-orange-500',
      cardBg: darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-orange-50/50',
      border: darkMode ? 'border-gray-700 hover:border-orange-700' : 'border-gray-100 hover:border-orange-200',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center w-18 h-18 rounded-2xl mb-5"
          style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            boxShadow: '0 12px 40px rgba(59,130,246,0.3)',
          }}
        >
          <Keyboard className="text-white" style={{ width: 36, height: 36 }} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl md:text-5xl font-extrabold mb-3 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
        >
          Master Your{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Typing
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-base md:text-lg max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
        >
          Build speed, accuracy and confidence — from home row to professional typist.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setActiveTab('lessons')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
          }}
        >
          Start Learning
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Stats bar (only when have sessions) */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          } shadow-sm`}
        >
          {[
            { label: 'Best WPM', value: bestWPM, icon: Zap, color: 'text-blue-500' },
            { label: 'Avg Accuracy', value: `${avgAcc}%`, icon: Trophy, color: 'text-yellow-500' },
            { label: 'Avg WPM', value: avgWPM, icon: Star, color: 'text-purple-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="text-center"
            >
              <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
              <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Streak & Daily Challenge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-4 rounded-2xl flex items-center gap-3 border ${
              darkMode ? 'bg-gray-800 border-orange-900' : 'bg-orange-50 border-orange-100'
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-500/10">
              <Flame className="w-5 h-5 text-orange-500 flicker" />
            </div>
            <div>
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="text-orange-500 text-lg">{streak}</span> Day Streak!
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Keep it going — practice today
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          onClick={() => setActiveTab('practice')}
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 border cursor-pointer group transition-all duration-200 ${
            dailyChallengeCompleted
              ? darkMode ? 'bg-gray-800 border-green-900' : 'bg-green-50 border-green-100'
              : darkMode ? 'bg-gray-800 border-blue-900 hover:border-blue-700' : 'bg-blue-50 border-blue-100 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${
              dailyChallengeCompleted ? 'bg-green-500/10' : 'bg-blue-500/10'
            }`}>
              <Calendar className={`w-5 h-5 ${dailyChallengeCompleted ? 'text-green-500' : 'text-blue-500'}`} />
            </div>
            <div>
              <div className={`font-semibold text-sm ${dailyChallengeCompleted ? 'text-green-500' : (darkMode ? 'text-blue-300' : 'text-blue-700')}`}>
                {dailyChallengeCompleted ? '✓ Daily Complete!' : "Daily Challenge"}
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {dailyChallengeCompleted ? 'Great work! See you tomorrow.' : 'Tap to start today\'s challenge'}
              </div>
            </div>
          </div>
          {!dailyChallengeCompleted && (
            <ChevronRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          )}
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {features.map((feature, i) => (
          <motion.div
            key={feature.tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            onClick={() => setActiveTab(feature.tab)}
            className={`p-5 rounded-2xl cursor-pointer border transition-all duration-200 ${feature.cardBg} ${feature.border} shadow-sm`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${feature.iconBg} rounded-xl flex items-center justify-center`}
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xs font-semibold ${feature.badgeColor}`}>
                {feature.badge}
              </span>
            </div>
            <h3 className={`font-bold text-base mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {feature.title}
            </h3>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`rounded-2xl p-5 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        } shadow-sm`}
      >
        <h3 className={`font-bold text-sm mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          💡 Typing Tips for Beginners
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            '🏠 Keep fingers on the home row (ASDF JKL;)',
            '👀 Look at the screen, not the keyboard',
            '🎯 Accuracy before speed — don\'t rush!',
            '📅 Practice 15-20 min daily for fast gains',
            '✋ Keep wrists flat and fingers curved',
            '🔤 Use the correct finger for each key',
          ].map((tip, i) => (
            <div
              key={i}
              className={`text-sm py-1.5 px-3 rounded-lg ${darkMode ? 'text-gray-300 bg-gray-700/50' : 'text-gray-600 bg-gray-50'}`}
            >
              {tip}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
