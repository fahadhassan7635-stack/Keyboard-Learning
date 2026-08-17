import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import FallingGame from './pages/FallingGame';
import Practice from './pages/Practice';
import Progress from './pages/Progress';
import Sitemap from './pages/Sitemap';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function App() {
  const darkMode = useStore((s) => s.darkMode);
  const activeTab = useStore((s) => s.activeTab);
  const checkDailyChallenge = useStore((s) => s.checkDailyChallenge);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111827';
      document.body.style.color = '#f9fafb';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb';
      document.body.style.color = '#111827';
    }
  }, [darkMode]);

  // Check daily challenge on mount
  useEffect(() => {
    checkDailyChallenge();
  }, [checkDailyChallenge]);

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'lessons': return <Lessons />;
      case 'game': return <FallingGame />;
      case 'practice': return <Practice />;
      case 'progress': return <Progress />;
      case 'sitemap': return <Sitemap onNavigate={(tab) => useStore.getState().setActiveTab(tab)} />;
      default: return <Home />;
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: darkMode ? '#111827' : '#f9fafb',
        color: darkMode ? '#f9fafb' : '#111827',
      }}
    >
      <Navigation />

      <main
        className="pb-20 md:pb-0"
        style={{ minHeight: 'calc(100vh - 56px)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
