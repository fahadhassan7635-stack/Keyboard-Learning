import { motion } from 'framer-motion';
import { TrendingUp, Flame, Trash2, Trophy, Target, Zap, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Progress() {
  const darkMode = useStore((s) => s.darkMode);
  const sessions = useStore((s) => s.sessions);
  const streak = useStore((s) => s.streak);
  const weakKeys = useStore((s) => s.weakKeys);
  const clearWeakKeys = useStore((s) => s.clearWeakKeys);
  const unlockedLessons = useStore((s) => s.unlockedLessons);

  const _avgWPM = sessions.length > 0
    ? Math.round(sessions.reduce((a, b) => a + b.wpm, 0) / sessions.length)
    : 0;
  void _avgWPM;
  const avgAcc = sessions.length > 0
    ? Math.round(sessions.reduce((a, b) => a + b.accuracy, 0) / sessions.length)
    : 0;
  const bestWPM = sessions.length > 0
    ? Math.max(...sessions.map((s) => s.wpm))
    : 0;
  const totalTime = sessions.reduce((a, b) => a + b.duration, 0);

  const topWeakKeys = Object.entries(weakKeys)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const recentSessions = sessions.slice(0, 10);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const maxWPM = recentSessions.length > 0 ? Math.max(...recentSessions.map((s) => s.wpm)) : 60;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Progress
        </h1>
        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Track your typing improvement over time
        </p>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
      >
        {[
          { label: 'Best WPM', value: bestWPM, icon: Zap, color: 'text-blue-500', bg: darkMode ? 'bg-blue-900/30' : 'bg-blue-50' },
          { label: 'Avg Accuracy', value: `${avgAcc}%`, icon: Target, color: 'text-green-500', bg: darkMode ? 'bg-green-900/30' : 'bg-green-50' },
          { label: 'Day Streak', value: streak, icon: Flame, color: 'text-orange-500', bg: darkMode ? 'bg-orange-900/30' : 'bg-orange-50' },
          { label: 'Total Time', value: formatTime(totalTime), icon: Clock, color: 'text-purple-500', bg: darkMode ? 'bg-purple-900/30' : 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className={`${stat.bg} rounded-2xl p-4`}
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
            <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* WPM Chart */}
      {recentSessions.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`rounded-2xl p-5 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <h2 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            <TrendingUp className="w-4 h-4 text-blue-500" />
            WPM History (Last 10 sessions)
          </h2>
          <div className="flex items-end gap-2 h-28">
            {recentSessions.reverse().map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((s.wpm / Math.max(maxWPM, 1)) * 100, 4)}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                  className="w-full rounded-t-md bg-blue-500 opacity-80 hover:opacity-100 transition-opacity min-h-1"
                  style={{ minHeight: 4 }}
                  title={`${s.wpm} WPM`}
                />
                <span className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {s.wpm}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Lessons Unlocked */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl p-5 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-semibold text-sm flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            <Trophy className="w-4 h-4 text-yellow-500" />
            Lessons Unlocked
          </h2>
          <span className={`text-sm font-mono font-bold text-yellow-500`}>
            {unlockedLessons.length} / 15
          </span>
        </div>
        <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedLessons.length / 15) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
          />
        </div>
        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Keep completing lessons to unlock more challenges!
        </p>
      </motion.div>

      {/* Weak Keys */}
      {topWeakKeys.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`rounded-2xl p-5 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className={`font-semibold text-sm flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              ⚠️ Weak Keys
            </h2>
            <button
              onClick={clearWeakKeys}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {topWeakKeys.map(([key, count]) => (
              <div
                key={key}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${
                  darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-100'
                }`}
              >
                <span className={`font-mono font-bold text-red-500 uppercase`}>{key}</span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {count} errors
                </span>
              </div>
            ))}
          </div>
          <p className={`text-xs mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Go to Practice → Weak Key Practice to improve these keys
          </p>
        </motion.div>
      )}

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <h2 className={`font-semibold text-sm mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            📋 Recent Sessions
          </h2>
          <div className="space-y-2">
            {sessions.slice(0, 8).map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div>
                  <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} capitalize`}>
                    {s.lessonId.replace('practice-', '').replace('b', 'Beginner ').replace('i', 'Intermediate ').replace('a', 'Advanced ')}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatDate(s.date)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className={`font-mono font-bold text-blue-500 text-sm`}>{s.wpm}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>WPM</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-mono font-bold text-sm ${s.accuracy >= 95 ? 'text-green-500' : 'text-yellow-500'}`}>
                      {s.accuracy}%
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Acc</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {sessions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <div className="text-4xl mb-3">📊</div>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>No sessions yet</h3>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Complete some lessons or practice modes to see your progress here
          </p>
        </motion.div>
      )}
    </div>
  );
}
