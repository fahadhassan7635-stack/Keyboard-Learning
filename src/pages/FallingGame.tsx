import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Zap, Shield, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSounds } from '../hooks/useSound';

interface FallingLetter {
  id: number;
  char: string;
  x: number;
  speed: number;
  startTime: number;
  color: string;
}

type GameState = 'idle' | 'playing' | 'gameover';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const LETTER_COLORS_LIGHT = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
];
const LETTER_COLORS_DARK = [
  '#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f87171',
  '#22d3ee', '#f472b6', '#a3e635', '#fb923c', '#818cf8',
];

let letterIdCounter = 0;

export default function FallingGame() {
  const darkMode = useStore((s) => s.darkMode);
  const soundEnabled = useStore((s) => s.soundEnabled);
  const toggleSound = useStore((s) => s.toggleSound);

  const [gameState, setGameState] = useState<GameState>('idle');
  const [letters, setLetters] = useState<FallingLetter[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [timeAlive, setTimeAlive] = useState(0);
  const [comboText, setComboText] = useState('');
  const [hitEffects, setHitEffects] = useState<{id: number; x: number; char: string; color: string}[]>([]);

  const { playCorrect, playError, playCombo } = useSounds();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const lettersRef = useRef<FallingLetter[]>([]);
  const livesRef = useRef(3);
  const gameStateRef = useRef<GameState>('idle');

  lettersRef.current = letters;
  livesRef.current = lives;
  gameStateRef.current = gameState;

  const getSpeed = (lvl: number) => Math.max(9 - lvl * 0.8, 2.2);
  const getSpawnInterval = (lvl: number) => Math.max(2800 - lvl * 250, 500);
  const colorPalette = darkMode ? LETTER_COLORS_DARK : LETTER_COLORS_LIGHT;

  const spawnLetter = useCallback((lvl: number) => {
    const char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    const x = Math.random() * 80 + 5;
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    const newLetter: FallingLetter = {
      id: ++letterIdCounter,
      char,
      x,
      speed: getSpeed(lvl),
      startTime: Date.now(),
      color,
    };
    setLetters((prev) => [...prev, newLetter]);
  }, [colorPalette]);

  const clearAllTimers = () => {
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
  };

  const startGame = () => {
    clearAllTimers();
    setGameState('playing');
    setLetters([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setLevel(1);
    setTimeAlive(0);
    setComboText('');
    setHitEffects([]);
    letterIdCounter = 0;
  };

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    clearAllTimers();

    // Initial spawn
    setTimeout(() => spawnLetter(level), 400);

    spawnIntervalRef.current = setInterval(() => {
      spawnLetter(level);
      // Occasionally spawn 2 letters at higher levels
      if (level >= 5 && Math.random() > 0.6) {
        setTimeout(() => spawnLetter(level), 300);
      }
    }, getSpawnInterval(level));

    timerRef.current = setInterval(() => {
      setTimeAlive((t) => t + 1);
    }, 1000);

    checkIntervalRef.current = setInterval(() => {
      setLetters((prev) => {
        const now = Date.now();
        const survived: FallingLetter[] = [];
        let missed = 0;
        prev.forEach((l) => {
          const elapsed = (now - l.startTime) / 1000;
          if (elapsed / l.speed >= 1.05) {
            missed++;
          } else {
            survived.push(l);
          }
        });
        if (missed > 0) {
          playError();
          setCombo(0);
          setLives((lv) => {
            const newLives = lv - missed;
            if (newLives <= 0) {
              clearAllTimers();
              setGameState('gameover');
              return 0;
            }
            return newLives;
          });
        }
        return survived;
      });
    }, 150);

    return clearAllTimers;
  }, [gameState, level]);

  // Level up
  useEffect(() => {
    if (score > 0 && score % 8 === 0 && gameState === 'playing') {
      setLevel((l) => Math.min(l + 1, 12));
    }
  }, [score, gameState]);

  // Keyboard handler
  useEffect(() => {
    if (gameState !== 'playing') return;
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key.length !== 1 || !ALPHABET.includes(key)) return;
      e.preventDefault();

      const matching = lettersRef.current
        .filter((l) => l.char === key)
        .sort((a, b) => {
          // Prioritize letters that have fallen furthest
          const now = Date.now();
          return (now - b.startTime) / b.speed - (now - a.startTime) / a.speed;
        });

      if (matching.length > 0) {
        const hit = matching[0];
        const hitX = hit.x;
        const hitColor = hit.color;

        setLetters((prev) => prev.filter((l) => l.id !== hit.id));

        // Hit effect
        const effectId = Date.now() + Math.random();
        setHitEffects((prev) => [...prev, { id: effectId, x: hitX, char: key.toUpperCase(), color: hitColor }]);
        setTimeout(() => setHitEffects((prev) => prev.filter((e) => e.id !== effectId)), 600);

        setScore((s) => s + 1);
        setCombo((c) => {
          const newCombo = c + 1;
          setMaxCombo((m) => Math.max(m, newCombo));
          if (newCombo >= 10) {
            playCombo();
            setComboText(`🔥 ${newCombo}x ULTRA COMBO!`);
          } else if (newCombo >= 5) {
            playCombo();
            setComboText(`⚡ ${newCombo}x COMBO!`);
          } else {
            playCorrect();
            setComboText('');
          }
          return newCombo;
        });
      } else {
        setCombo(0);
        setComboText('');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, playCorrect, playCombo]);

  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Falling Letters
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Type letters before they reach the bottom!
          </p>
        </div>
        <button
          onClick={toggleSound}
          className={`p-2.5 rounded-xl border transition-colors ${
            darkMode ? 'border-gray-700 hover:bg-gray-700 text-gray-400' : 'border-gray-200 hover:bg-gray-100 text-gray-500'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Stats bar - playing */}
      <AnimatePresence>
        {gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center justify-between mb-3 px-4 py-3 rounded-2xl border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            } shadow-sm`}
          >
            {/* Lives */}
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  animate={{ scale: i <= lives ? 1 : 0.7, opacity: i <= lives ? 1 : 0.3 }}
                  className="text-lg"
                >
                  ♥
                </motion.span>
              ))}
            </div>

            {/* Score */}
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className={`font-bold font-mono text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {score}
              </span>
            </div>

            {/* Level */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              darkMode ? 'bg-purple-900/40' : 'bg-purple-50'
            }`}>
              <Shield className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-purple-500 font-semibold text-sm">Lvl {level}</span>
            </div>

            {/* Combo */}
            {combo >= 3 && (
              <motion.div
                key={combo}
                initial={{ scale: 1.4 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1"
              >
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-orange-500 font-bold">{combo}x</span>
              </motion.div>
            )}

            {/* Timer */}
            <span className={`font-mono text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatTime(timeAlive)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className={`relative rounded-2xl overflow-hidden border ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        }`}
        style={{
          height: 440,
          background: darkMode
            ? 'linear-gradient(180deg, #0f172a 0%, #111827 100%)'
            : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* Idle Screen */}
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl"
            >
              ⌨️
            </motion.div>
            <div className="text-center">
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Ready to Play?
              </h2>
              <p className={`text-sm max-w-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Letters fall from the top. Type them before they reach the bottom. 3 misses and it's game over!
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: '0 8px 24px rgba(59,130,246,0.35)',
              }}
            >
              <Play className="w-4 h-4 fill-white" />
              Start Game
            </motion.button>
          </motion.div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6"
            style={{
              background: darkMode
                ? 'rgba(17,24,39,0.92)'
                : 'rgba(248,250,252,0.92)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
            </motion.div>
            <div className="text-center">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Game Over!
              </h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Great effort! Here's how you did:
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {[
                { label: 'Final Score', value: score, color: 'text-blue-500', icon: '🎯' },
                { label: 'Level Reached', value: level, color: 'text-purple-500', icon: '🏆' },
                { label: 'Best Combo', value: `${maxCombo}x`, color: 'text-orange-500', icon: '🔥' },
                { label: 'Time Alive', value: formatTime(timeAlive), color: 'text-green-500', icon: '⏱️' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
                >
                  <div className="text-base mb-0.5">{s.icon}</div>
                  <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</div>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: '0 6px 20px rgba(59,130,246,0.3)',
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </motion.button>
          </motion.div>
        )}

        {/* Falling Letters */}
        {gameState === 'playing' && (
          <>
            <AnimatePresence>
              {letters.map((letter) => {
                const elapsed = (Date.now() - letter.startTime) / 1000;
                const progress = Math.min(elapsed / letter.speed, 1);
                const gameH = gameAreaRef.current?.clientHeight || 440;
                const yPos = progress * (gameH + 60) - 60;

                return (
                  <motion.div
                    key={letter.id}
                    initial={{ y: -60, opacity: 0, scale: 0.5 }}
                    animate={{ y: yPos, opacity: 1, scale: 1 }}
                    exit={{ scale: 1.8, opacity: 0 }}
                    transition={{
                      y: { duration: letter.speed - elapsed, ease: 'linear' },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 },
                    }}
                    style={{
                      position: 'absolute',
                      left: `${letter.x}%`,
                      top: 0,
                      transform: `translateX(-50%)`,
                      willChange: 'transform',
                    }}
                  >
                    <div
                      className="w-11 h-11 flex items-center justify-center rounded-xl font-mono font-bold text-lg shadow-lg"
                      style={{
                        backgroundColor: letter.color + (darkMode ? '22' : '15'),
                        color: letter.color,
                        border: `2px solid ${letter.color}50`,
                        boxShadow: `0 4px 16px ${letter.color}30`,
                        fontSize: 18,
                      }}
                    >
                      {letter.char.toUpperCase()}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Hit effects */}
            <AnimatePresence>
              {hitEffects.map((effect) => (
                <motion.div
                  key={effect.id}
                  initial={{ opacity: 1, scale: 0.5, y: 0 }}
                  animate={{ opacity: 0, scale: 2, y: -40 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    left: `${effect.x}%`,
                    top: '30%',
                    transform: 'translateX(-50%)',
                    color: effect.color,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 800,
                    fontSize: 20,
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                >
                  +1
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Combo banner */}
            <AnimatePresence>
              {comboText && (
                <motion.div
                  key={comboText}
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.2, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none"
                >
                  <div
                    className="px-4 py-2 rounded-full font-bold text-white text-sm"
                    style={{
                      background: 'linear-gradient(135deg, #f97316, #ef4444)',
                      boxShadow: '0 4px 20px rgba(249,115,22,0.4)',
                    }}
                  >
                    {comboText}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Danger line */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'linear-gradient(90deg, transparent, #ef444480, transparent)',
              }}
            />

            {/* Keyboard hint */}
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: 11,
                color: darkMode ? '#374151' : '#cbd5e1',
                pointerEvents: 'none',
              }}
            >
              Use keyboard to type the letters
            </div>
          </>
        )}
      </div>

      {/* How to play */}
      {gameState === 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mt-4 p-4 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm`}
        >
          <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            📖 How to Play
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '🔤', text: 'Letters fall from the top' },
              { icon: '⌨️', text: 'Type the letter to destroy it' },
              { icon: '❤️', text: '3 lives — don\'t let them pass' },
              { icon: '🔥', text: '5+ combos for bonus power' },
              { icon: '⚡', text: 'Speed increases every 8 pts' },
              { icon: '🏆', text: 'Beat your high score!' },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-sm ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-xs">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
