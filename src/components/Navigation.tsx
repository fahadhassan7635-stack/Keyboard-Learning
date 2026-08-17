import { motion } from 'framer-motion';
import { Home, BookOpen, Gamepad2, Keyboard, TrendingUp, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../store/useStore';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'lessons', label: 'Lessons', icon: BookOpen },
  { id: 'game', label: 'Game', icon: Gamepad2 },
  { id: 'practice', label: 'Practice', icon: Keyboard },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
];

export default function Navigation() {
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const soundEnabled = useStore((s) => s.soundEnabled);
  const toggleSound = useStore((s) => s.toggleSound);
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);

  return (
    <>
      {/* Top bar */}
      <header
        className={`sticky top-0 z-40 border-b ${
          darkMode
            ? 'bg-gray-900/95 border-gray-800 text-white'
            : 'bg-white/95 border-gray-100 text-gray-900'
        }`}
        style={{ backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 font-bold text-lg tracking-tight"
          >
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <Keyboard className="w-4 h-4 text-white" />
            </div>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
              Keyboard<span className="text-blue-500">Learning</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? darkMode
                        ? 'text-blue-400'
                        : 'text-blue-600'
                      : darkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-lg ${darkMode ? 'bg-blue-900/40' : 'bg-blue-50'}`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled
                ? <Volume2 className="w-4 h-4" />
                : <VolumeX className="w-4 h-4" />
              }
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${
          darkMode
            ? 'bg-gray-900/95 border-gray-800'
            : 'bg-white/95 border-gray-100'
        }`}
        style={{ backdropFilter: 'blur(12px)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors duration-200 ${
                  isActive
                    ? 'text-blue-500'
                    : darkMode
                    ? 'text-gray-500 hover:text-gray-300'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-dot"
                    className="w-1 h-1 rounded-full bg-blue-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
