import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KEYBOARD_ROWS, FINGER_COLORS, FINGER_COLORS_DARK, getKeyForChar, HOME_ROW_BUMPS } from '../data/keyboard';
import { useStore } from '../store/useStore';

interface KeyboardProps {
  highlightKey?: string;
  pressedKey?: string;
  showFingerColors?: boolean;
  compact?: boolean;
}

export default function Keyboard({
  highlightKey,
  pressedKey,
  showFingerColors = true,
  compact = false,
}: KeyboardProps) {
  const darkMode = useStore((s) => s.darkMode);
  const [animKey, setAnimKey] = useState<string | null>(null);

  useEffect(() => {
    if (pressedKey) {
      setAnimKey(pressedKey);
      const t = setTimeout(() => setAnimKey(null), 120);
      return () => clearTimeout(t);
    }
  }, [pressedKey]);

  const normalizedHighlight = highlightKey ? getKeyForChar(highlightKey) : null;
  const needsShift = highlightKey ? highlightKey !== highlightKey.toLowerCase() && highlightKey.length === 1 : false;

  const getKeyStyle = (key: string, finger: string) => {
    const k = key.toLowerCase();
    const isHighlighted = normalizedHighlight === k ||
      (k === ' ' && highlightKey === ' ') ||
      (key === 'Shift' && needsShift);
    const isPressed = animKey === k ||
      (k === ' ' && animKey === ' ') ||
      (key === 'Backspace' && (animKey === 'backspace' || animKey === 'delete'));
    const isHomeRow = HOME_ROW_BUMPS.includes(k);

    const colors = darkMode ? FINGER_COLORS_DARK : FINGER_COLORS;
    const fingerColor = colors[finger as keyof typeof colors];

    let bg = darkMode ? '#1e2533' : '#ffffff';
    let border = darkMode ? '#2d3748' : '#d1d5db';
    let textColor = darkMode ? '#9ca3af' : '#374151';
    let shadow = darkMode
      ? '0 2px 0 #0d1117, 0 1px 3px rgba(0,0,0,0.3)'
      : '0 2px 0 #a0aec0, 0 1px 2px rgba(0,0,0,0.08)';

    if (showFingerColors && fingerColor && !isHighlighted) {
      bg = fingerColor.bg;
      textColor = fingerColor.text;
      border = 'transparent';
      shadow = darkMode
        ? `0 2px 0 #0d1117`
        : `0 2px 0 ${fingerColor.bg}bb`;
    }

    if (isHighlighted) {
      bg = darkMode ? '#2563eb' : '#3b82f6';
      textColor = '#ffffff';
      border = darkMode ? '#1d4ed8' : '#1d4ed8';
      shadow = darkMode ? '0 3px 0 #1e3a8a' : '0 3px 0 #1d4ed8';
    }

    if (isPressed) {
      shadow = isHighlighted ? '0 1px 0 #1e3a8a' : '0 1px 0 transparent';
    }

    return { bg, border, textColor, shadow, isHighlighted, isPressed, isHomeRow };
  };

  const keyHeight = compact ? 30 : 40;
  const keyBase = compact ? 28 : 38;
  const fontSize = compact ? 9 : 10.5;
  const gap = compact ? 3 : 4;

  return (
    <div className="w-full overflow-x-auto no-select">
      {/* Finger legend */}
      {showFingerColors && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-3">
          {[
            { key: 'pinky', label: 'Pinky' },
            { key: 'ring', label: 'Ring' },
            { key: 'middle', label: 'Middle' },
            { key: 'index-left', label: 'Index (L)' },
            { key: 'index-right', label: 'Index (R)' },
            { key: 'thumb', label: 'Thumb' },
          ].map(({ key, label }) => {
            const light = FINGER_COLORS[key as keyof typeof FINGER_COLORS];
            const dark = FINGER_COLORS_DARK[key as keyof typeof FINGER_COLORS_DARK];
            return (
              <div key={key} className="flex items-center gap-1">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: darkMode ? dark?.bg : light?.bg }}
                />
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Keyboard rows */}
      <div className="flex flex-col items-center" style={{ gap: `${gap}px` }}>
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex" style={{ gap: `${gap}px` }}>
            {row.map((keyData, keyIdx) => {
              const { bg, border, textColor, shadow, isHighlighted, isPressed, isHomeRow } =
                getKeyStyle(keyData.key, keyData.finger);
              const width = Math.round((keyData.width || 1) * keyBase);
              const displayText = keyData.display || keyData.key.toUpperCase();

              return (
                <motion.div
                  key={`${rowIdx}-${keyIdx}`}
                  animate={
                    isPressed
                      ? { y: 2 }
                      : isHighlighted
                      ? { y: 0, scale: 1.08 }
                      : { y: 0, scale: 1 }
                  }
                  transition={{ duration: 0.08, ease: 'easeOut' }}
                  style={{
                    width,
                    height: keyHeight,
                    backgroundColor: bg,
                    border: `1px solid ${border}`,
                    boxShadow: shadow,
                    color: textColor,
                    fontSize,
                    position: 'relative',
                    borderRadius: 7,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: isHighlighted ? 700 : 500,
                    fontFamily: "'Inter', sans-serif",
                    cursor: 'default',
                    flexShrink: 0,
                    transition: 'background-color 0.12s ease, box-shadow 0.08s ease',
                    letterSpacing: 0,
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {displayText}

                  {/* Home row bump */}
                  {isHomeRow && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 5,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 5,
                        height: 2,
                        backgroundColor: isHighlighted ? 'rgba(255,255,255,0.6)' : (darkMode ? '#4b5563' : '#9ca3af'),
                        borderRadius: 2,
                      }}
                    />
                  )}

                  {/* Highlight pulse */}
                  <AnimatePresence>
                    {isHighlighted && (
                      <motion.div
                        initial={{ opacity: 0.7, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.6 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.0, repeat: Infinity, ease: 'easeOut' }}
                        style={{
                          position: 'absolute',
                          inset: -2,
                          borderRadius: 9,
                          border: '2px solid #3b82f6',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Finger hint */}
      {showFingerColors && highlightKey && highlightKey !== ' ' && (
        <motion.div
          key={highlightKey}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`mt-3 text-center text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
        >
          {getFingerHint(highlightKey)}
        </motion.div>
      )}
      {showFingerColors && highlightKey === ' ' && (
        <motion.div
          key="space"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 text-center text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
        >
          👍 Use either Thumb for Space Bar
        </motion.div>
      )}
    </div>
  );
}

function getFingerHint(char: string): string {
  const key = char.toLowerCase();
  const hints: Record<string, string> = {
    'a': '🤙 Left Pinky → A key', 'q': '🤙 Left Pinky → Q key', 'z': '🤙 Left Pinky → Z key',
    '1': '🤙 Left Pinky → 1 key', '`': '🤙 Left Pinky → ` key',
    's': '💍 Left Ring Finger → S key', 'w': '💍 Left Ring Finger → W key', 'x': '💍 Left Ring Finger → X key',
    '2': '💍 Left Ring → 2 key',
    'd': '🖕 Left Middle Finger → D key', 'e': '🖕 Left Middle Finger → E key', 'c': '🖕 Left Middle Finger → C key',
    '3': '🖕 Left Middle → 3 key',
    'f': '☝️ Left Index Finger → F key (home)', 'r': '☝️ Left Index → R key', 'v': '☝️ Left Index → V key',
    'g': '☝️ Left Index → G key', 't': '☝️ Left Index → T key', 'b': '☝️ Left Index → B key',
    '4': '☝️ Left Index → 4 key', '5': '☝️ Left Index → 5 key',
    'h': '☝️ Right Index Finger → H key', 'y': '☝️ Right Index → Y key', 'n': '☝️ Right Index → N key',
    'j': '☝️ Right Index Finger → J key (home)', 'u': '☝️ Right Index → U key', 'm': '☝️ Right Index → M key',
    '6': '☝️ Right Index → 6 key', '7': '☝️ Right Index → 7 key',
    'k': '🖕 Right Middle Finger → K key', 'i': '🖕 Right Middle → I key', ',': '🖕 Right Middle → , key',
    '8': '🖕 Right Middle → 8 key',
    'l': '💍 Right Ring Finger → L key', 'o': '💍 Right Ring → O key', '.': '💍 Right Ring → . key',
    '9': '💍 Right Ring → 9 key',
    ';': '🤙 Right Pinky Finger → ; key', 'p': '🤙 Right Pinky → P key', '/': '🤙 Right Pinky → / key',
    "'": "🤙 Right Pinky → ' key", '0': '🤙 Right Pinky → 0 key',
  };
  return hints[key] || `Press ${char.toUpperCase()}`;
}
