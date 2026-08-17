import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, BookOpen, FlaskConical } from 'lucide-react';
import { useStore } from '../store/useStore';

// ─── FAQ Data ────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'How long does it take to learn touch typing?',
    a: 'Most beginners can reach 40 WPM with touch typing within 4–8 weeks of daily 20-minute practice sessions. Reaching 60–80 WPM (professional level) typically takes 3–6 months of consistent effort. The key is accuracy first — speed follows naturally.',
  },
  {
    q: 'What is the average typing speed?',
    a: 'The average typing speed for adults is around 40 WPM with ~92% accuracy. Professional typists typically type at 65–75 WPM. Top competitive typists can exceed 130 WPM. You can measure your current WPM with a free typing test at fixedaim.com/typing-test.',
  },
  {
    q: 'What is the home row and why does it matter?',
    a: 'The home row keys are A S D F (left hand) and J K L ; (right hand). Your fingers rest here by default. All other keys are reached by stretching from the home row and returning immediately. Mastering home row positioning is the #1 foundation of fast, accurate touch typing.',
  },
  {
    q: 'Should I look at the keyboard while learning?',
    a: 'No — looking at the keyboard is the most common bad habit that limits speed growth. Train yourself to look only at the screen from day one. Use finger placement memory (proprioception) instead of visual cues. It feels slow at first, but unlocks much higher speeds.',
  },
  {
    q: 'Is it worth learning touch typing as a programmer?',
    a: 'Absolutely. Developers type for hours daily — code, documentation, emails, terminals. Improving from 40 to 80 WPM effectively doubles your text input throughput. Many programmers report that touch typing reduces cognitive load, so they can focus more on logic than mechanics.',
  },
  {
    q: 'How do I improve typing accuracy, not just speed?',
    a: 'Practice at a pace where you make fewer than 5% mistakes. Use dedicated accuracy drills on weak keys (our app tracks your weak keys automatically). Slow down, type correctly, then gradually increase speed. Rushing causes bad habits that are hard to unlearn.',
  },
  {
    q: 'What WPM do I need for a typing job or data entry?',
    a: 'Most data entry jobs require a minimum of 40–50 WPM with 95%+ accuracy. Administrative and transcription roles typically ask for 60–80 WPM. Legal transcription can require 90+ WPM. Use a free typing speed test to benchmark yourself before applying.',
  },
  {
    q: 'Can I use this app on mobile?',
    a: 'Keyboard Learning is designed primarily for desktop and laptop keyboards. While the interface is responsive, touch typing practice requires a physical keyboard. We recommend using a Bluetooth keyboard if practicing on a tablet.',
  },
];

// ─── Source / Research Links ──────────────────────────────────────────────────
const sourceLinks = [
  {
    category: 'Typing Speed Test',
    icon: '⌨️',
    links: [
      {
        title: 'Free Typing Speed Test – FixedAim',
        url: 'https://fixedaim.com/typing-test',
        desc: 'Measure your WPM and accuracy in real time. Free, no login required.',
        isMain: true,
      },
      {
        title: 'FixedAim – Gaming & Productivity Tools',
        url: 'https://fixedaim.com',
        desc: 'The home of free online speed and accuracy training tools.',
        isMain: false,
      },
      {
        title: 'Key Visualizer – See Which Keys You Struggle With',
        url: 'https://fixedaim.com/key-visualizer',
        desc: 'Visualize your keyboard key press patterns. Identify problem keys, weak fingers, and improve accuracy on specific letters.',
        isMain: true,
      },
    ],
  },
  {
    category: 'Research & Studies',
    icon: '🔬',
    links: [
      {
        title: 'How People Type – Cambridge Motor Control Lab',
        url: 'https://www.nature.com/articles/s41562-018-0281-4',
        desc: 'Nature study (2018): Most people use 6 fingers on average, not 10. Habit, not instruction, drives most typing.',
      },
      {
        title: 'Typing Speed and Cognitive Load – ResearchGate',
        url: 'https://www.researchgate.net/publication/335733897',
        desc: 'Research showing that faster typists allocate less cognitive load to transcription, freeing working memory.',
      },
      {
        title: 'QWERTY vs Dvorak Layout Comparison',
        url: 'https://en.wikipedia.org/wiki/Dvorak_keyboard_layout',
        desc: 'Wikipedia overview of alternative layouts and their typing efficiency research.',
      },
      {
        title: 'Average Typing Speeds by Age – TypingMaster Research',
        url: 'https://www.typingmaster.com/typing-speed-test/',
        desc: 'Reference data on average WPM benchmarks across age groups and professions.',
      },
    ],
  },
  {
    category: 'Learning Resources',
    icon: '📚',
    links: [
      {
        title: 'Touch Typing Guide – Wikipedia',
        url: 'https://en.wikipedia.org/wiki/Touch_typing',
        desc: 'Comprehensive overview of touch typing history, techniques, and research.',
      },
      {
        title: 'Keyboard Layout – MDN Web Docs',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent',
        desc: 'Technical reference for KeyboardEvent API used in typing apps and games.',
      },
    ],
  },
  {
    category: 'Fix Key Problems',
    icon: '🔑',
    links: [
      {
        title: 'Key Visualizer – FixedAim',
        url: 'https://fixedaim.com/key-visualizer',
        desc: 'See a heatmap of which keyboard keys you press most and least. Perfect for finding weak keys and correcting finger habits.',
        isMain: true,
      },
      {
        title: 'Why Do I Keep Mistyping Certain Keys?',
        url: 'https://en.wikipedia.org/wiki/Touch_typing#Errors_and_correction',
        desc: 'Wikipedia section on common typing errors — wrong finger assignment is the #1 cause of repeated key mistakes.',
      },
    ],
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const darkMode = useStore((s) => s.darkMode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-xl border overflow-hidden transition-colors duration-200 ${
        darkMode
          ? open ? 'bg-gray-800 border-blue-800' : 'bg-gray-800 border-gray-700'
          : open ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-gray-100'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className={`font-semibold text-sm leading-snug ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className={`px-5 pb-4 text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SeoArticle() {
  const darkMode = useStore((s) => s.darkMode);

  const prose = darkMode ? 'text-gray-300' : 'text-gray-600';
  const heading2 = `text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`;
  const card = `rounded-2xl border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm`;
  const h2inner = `text-base font-bold mt-5 mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`;
  const inlineLink = `underline underline-offset-2 font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`;
  const inlineCode = `px-1.5 py-0.5 rounded text-xs font-mono ${darkMode ? 'bg-gray-700 text-blue-300' : 'bg-blue-50 text-blue-700'}`;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="max-w-4xl mx-auto px-4 pb-12 space-y-10"
      aria-label="Keyboard learning guide and resources"
    >
      {/* ── SEO Article ─────────────────────────────────────────────── */}
      <div className={card}>
        <h2 className={heading2}>
          📖 The Complete Guide to Learning Touch Typing
        </h2>
        <div className={`space-y-4 text-sm leading-7 ${prose}`}>
          <p>
            Touch typing is the ability to type without looking at the keyboard, using muscle memory
            to place each finger on the correct key. It is one of the highest-ROI skills you can
            develop — once learned, it saves thousands of hours over a lifetime of computer use.
          </p>

          <h2 className={h2inner}>Why Typing Speed Matters in 2025</h2>
          <p>
            The average knowledge worker types for 3–6 hours per day. At 40 WPM, that's roughly
            7,200 words per hour of productive output. Doubling to 80 WPM means producing the same
            work in half the time — or spending the saved time on higher-value thinking. Whether
            you're a developer, writer, student, or office worker, faster and more accurate typing
            directly multiplies your productivity.
          </p>

          <h2 className={h2inner}>The Four Pillars of Keyboard Mastery</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Finger placement</strong> — each finger is responsible for a specific column of keys. Deviating from this creates bottlenecks and errors.</li>
            <li><strong>Home row anchoring</strong> — always return fingers to A S D F and J K L ; after each keystroke. This is the foundation of speed.</li>
            <li><strong>Rhythm over speed</strong> — type at a consistent, even tempo. Erratic bursting then pausing is slower than steady rhythm in the long run.</li>
            <li><strong>Look at the screen</strong> — train your proprioception (muscle memory) so your eyes stay on the text you're copying, not the keyboard.</li>
          </ul>

          <h2 className={h2inner}>How to Measure Your Typing Speed</h2>
          <p>
            Words Per Minute (WPM) is the standard metric. One "word" = 5 characters including spaces.
            A 1-minute test at{' '}
            <a href="https://fixedaim.com/typing-test" target="_blank" rel="noopener noreferrer" className={inlineLink}>
              fixedaim.com/typing-test
            </a>{' '}
            gives you a reliable WPM and accuracy score.
            Test yourself before starting lessons, and retest every two weeks to track growth.
          </p>

          <h2 className={h2inner}>Recommended Daily Practice Routine</h2>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li><strong>5 min</strong> — Warm up with home row letter drills (our Lessons tab)</li>
            <li><strong>10 min</strong> — Structured lesson on new key zones</li>
            <li><strong>5 min</strong> — Free typing practice or timed test</li>
            <li><strong>Weekly</strong> — Take a WPM speed test to benchmark progress</li>
          </ol>

          <h2 className={h2inner}>How to Fix Specific Key Problems</h2>
          <p>
            If you repeatedly mistype the same keys (e.g. confusing{' '}
            <code className={inlineCode}>b/v</code>,{' '}
            <code className={inlineCode}>p/q</code>, or number keys), the root cause is usually
            wrong finger assignment. Use a <strong>Key Visualizer</strong> to see exactly which keys
            you struggle with — then target those in focused drills. Try the free tool at{' '}
            <a href="https://fixedaim.com/key-visualizer" target="_blank" rel="noopener noreferrer" className={inlineLink}>
              fixedaim.com/key-visualizer
            </a>{' '}
            to get a heatmap of your weak keys and fix them one by one.
          </p>
        </div>
      </div>

      {/* ── FAQ Section ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
            <BookOpen className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h2 className={heading2} style={{ marginBottom: 0 }}>
            Frequently Asked Questions
          </h2>
        </div>

        {/* JSON-LD FAQ Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>

      {/* ── Source & Research Links ──────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${darkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
            <FlaskConical className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <h2 className={heading2} style={{ marginBottom: 0 }}>
            Sources &amp; Research
          </h2>
        </div>

        <div className="space-y-4">
          {sourceLinks.map((group, gi) => (
            <motion.div
              key={gi}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.08 }}
              className={card}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{group.icon}</span>
                <h3 className={`font-bold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {group.category}
                </h3>
              </div>

              <div className="space-y-3">
                {group.links.map((link, li) => (
                  <a
                    key={li}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-start gap-3 p-3 rounded-xl group transition-all duration-200 ${
                      (link as { isMain?: boolean }).isMain
                        ? darkMode
                          ? 'bg-blue-900/30 hover:bg-blue-900/50 border border-blue-800'
                          : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                        : darkMode
                        ? 'bg-gray-700/50 hover:bg-gray-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <ExternalLink
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        (link as { isMain?: boolean }).isMain
                          ? darkMode ? 'text-blue-400' : 'text-blue-500'
                          : darkMode ? 'text-gray-400' : 'text-gray-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className={`text-sm font-semibold leading-snug ${
                        (link as { isMain?: boolean }).isMain
                          ? darkMode ? 'text-blue-300' : 'text-blue-700'
                          : darkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {link.title}
                        {(link as { isMain?: boolean }).isMain && (
                          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            darkMode ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-600'
                          }`}>
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className={`text-xs mt-0.5 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {link.desc}
                      </div>
                      <div className={`text-xs mt-1 font-mono truncate ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {link.url}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Footer Credit ────────────────────────────────────────────── */}
      <p className={`text-center text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        Keyboard Learning · Free touch typing practice ·{' '}
        <a
          href="https://fixedaim.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`underline underline-offset-2 hover:opacity-80 transition-opacity ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
        >
          fixedaim.com
        </a>
      </p>
    </motion.section>
  );
}
