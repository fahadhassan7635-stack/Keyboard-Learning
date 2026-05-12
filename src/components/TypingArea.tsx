import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useSounds } from '../hooks/useSound';

interface TypingAreaProps {
  text: string;
  typed: string;
  errors: Set<number>;
  currentIndex: number;
  isComplete: boolean;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onCurrentKey?: (key: string) => void;
}

export default function TypingArea({
  text,
  typed,
  errors,
  currentIndex,
  isComplete,
  onKeyPress,
  onBackspace,
  onCurrentKey,
}: TypingAreaProps) {
  const darkMode = useStore((s) => s.darkMode);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playKeyClick, playError } = useSounds();
  const cursorRef = useRef<HTMLSpanElement>(null);

  // Focus on mount
  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

  // Notify parent of current expected key
  useEffect(() => {
    if (onCurrentKey && currentIndex < text.length) {
      onCurrentKey(text[currentIndex]);
    }
  }, [currentIndex, text, onCurrentKey]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isComplete) return;
      e.preventDefault();

      if (e.key === 'Backspace') {
        onBackspace();
        return;
      }

      if (e.key.length === 1) {
        const expected = text[currentIndex];
        if (e.key !== expected) {
          playError();
        } else {
          playKeyClick();
        }
        onKeyPress(e.key);
      }
    },
    [isComplete, onBackspace, onKeyPress, text, currentIndex, playKeyClick, playError]
  );

  // Scroll cursor into view
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [currentIndex]);

  const progress = text.length > 0 ? (currentIndex / text.length) * 100 : 0;

  return (
    <div ref={containerRef} tabIndex={0} onKeyDown={handleKeyDown} className="outline-none w-full">
      {/* Text display area */}
      <div
        className={`relative rounded-xl font-mono text-lg md:text-xl leading-loose tracking-wide select-none cursor-text transition-all duration-200 ${
          darkMode ? 'text-gray-600' : 'text-gray-300'
        }`}
        style={{
          wordBreak: 'break-word',
          padding: '16px 0 8px 0',
        }}
        onClick={() => containerRef.current?.focus()}
      >
        {text.split('').map((char, i) => {
          const isTyped = i < currentIndex;
          const isCurrent = i === currentIndex && !isComplete;
          const isError = errors.has(i);
          const isCorrect = isTyped && !isError;

          return (
            <span key={i} className="relative inline">
              <span
                style={{
                  color: isError
                    ? '#ef4444'
                    : isCorrect
                    ? darkMode ? '#e5e7eb' : '#1f2937'
                    : undefined,
                  borderBottom: isError ? '2px solid #ef4444' : undefined,
                  transition: 'color 0.08s ease',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
              {isCurrent && (
                <span
                  ref={cursorRef}
                  className="cursor-blink"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 2,
                    bottom: 2,
                    width: 2,
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#60a5fa' : '#3b82f6',
                    display: 'inline-block',
                  }}
                />
              )}
            </span>
          );
        })}

        {isComplete && (
          <motion.span
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-2 text-green-500 font-semibold text-base"
          >
            ✓ Complete!
          </motion.span>
        )}
      </div>

      {/* Progress bar */}
      <div className={`mt-3 h-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.15 }}
          className="h-full rounded-full bg-blue-500"
        />
      </div>

      {/* Start hint */}
      <AnimatePresence>
        {!typed && !isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex items-center justify-center gap-2 mt-4 text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
          >
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <span className="text-xs">Click here and start typing</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
