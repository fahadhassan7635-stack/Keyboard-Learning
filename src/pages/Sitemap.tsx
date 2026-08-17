import { motion } from 'framer-motion';

interface SitemapEntry {
  title: string;
  description: string;
  tab: string;
  priority: string;
  changefreq: string;
  lastmod: string;
  icon: string;
}

const sitemapData: SitemapEntry[] = [
  {
    title: 'Home',
    description: 'Welcome page – overview of Keyboard Learning features, stats, and daily challenge.',
    tab: 'home',
    priority: '1.0',
    changefreq: 'weekly',
    lastmod: '2026-08-17',
    icon: '🏠',
  },
  {
    title: 'Lessons',
    description: 'Structured keyboard lessons – from basic home row keys to advanced finger placement.',
    tab: 'lessons',
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: '2026-08-17',
    icon: '📚',
  },
  {
    title: 'Practice',
    description: 'Typing practice sessions – real-time WPM tracking, accuracy measurement, and word drills.',
    tab: 'practice',
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: '2026-08-17',
    icon: '⌨️',
  },
  {
    title: 'Falling Game',
    description: 'Typing game where falling letters must be typed quickly – fun way to improve speed.',
    tab: 'game',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2026-08-17',
    icon: '🎮',
  },
  {
    title: 'Progress',
    description: 'Track your typing progress – WPM history, accuracy charts, and achievements.',
    tab: 'progress',
    priority: '0.6',
    changefreq: 'weekly',
    lastmod: '2026-08-17',
    icon: '📈',
  },
];

interface SitemapProps {
  onNavigate?: (tab: string) => void;
}

export default function Sitemap({ onNavigate }: SitemapProps) {
  const baseUrl = 'https://keyboard-learning.vercel.app';

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🗺️</span>
          <h1 className="text-3xl font-bold tracking-tight">Sitemap</h1>
        </div>
        <p className="text-sm opacity-60 ml-12">
          All pages of Keyboard Learning – for users and search engines.
        </p>

        {/* XML Sitemap link */}
        <div className="mt-4 ml-12 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-current opacity-50 hover:opacity-80 transition-opacity">
          <span>📄</span>
          <a
            href={`${baseUrl}/sitemap.xml`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            View XML Sitemap (for Search Engines)
          </a>
        </div>
      </motion.div>

      {/* Sitemap Entries */}
      <div className="space-y-3">
        {sitemapData.map((entry, i) => (
          <motion.div
            key={entry.tab}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="group border rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
            style={{ borderColor: 'currentColor', opacity: 1 }}
            onClick={() => onNavigate?.(entry.tab)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-2xl mt-0.5 flex-shrink-0">{entry.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-base">{entry.title}</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-current opacity-10 font-mono">
                      #{entry.tab}
                    </span>
                  </div>
                  <p className="text-sm opacity-60 mt-1 leading-relaxed">
                    {entry.description}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs opacity-40 font-mono">
                    <span>Priority: {entry.priority}</span>
                    <span>•</span>
                    <span>Updated: {entry.lastmod}</span>
                    <span>•</span>
                    <span>Changes: {entry.changefreq}</span>
                  </div>
                </div>
              </div>

              {/* Navigate arrow */}
              <div className="flex-shrink-0 opacity-30 group-hover:opacity-70 group-hover:translate-x-1 transition-all duration-200 mt-1">
                →
              </div>
            </div>

            {/* URL preview */}
            <div className="mt-3 ml-9 text-xs opacity-30 font-mono truncate">
              {baseUrl}/#{entry.tab}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center text-xs opacity-30"
      >
        Keyboard Learning · sitemap · last updated 2026-08-17
      </motion.p>
    </div>
  );
}
