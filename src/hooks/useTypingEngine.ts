import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../store/useStore';

export interface TypingState {
  typed: string;
  errors: Set<number>;
  currentIndex: number;
  isComplete: boolean;
  isStarted: boolean;
  wpm: number;
  accuracy: number;
  mistakeCount: number;
  elapsedTime: number;
}

export function useTypingEngine(text: string = '') {
  const [typed, setTyped] = useState('');
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordKeyError = useStore((s) => s.recordKeyError);

  const currentIndex = typed.length;

  // Timer
  useEffect(() => {
    if (isStarted && !isComplete) {
      timerRef.current = setInterval(() => {
        if (startTime) {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isComplete, startTime]);

  const wpm = startTime && elapsedTime > 0
    ? Math.round((typed.length / 5) / (elapsedTime / 60))
    : 0;

  const accuracy = typed.length > 0
    ? Math.round(((typed.length - errors.size) / typed.length) * 100)
    : 100;

  const handleKeyPress = useCallback((char: string) => {
    if (isComplete) return;

    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    const expected = text[currentIndex];
    const newTyped = typed + char;

    if (char !== expected) {
      setErrors((prev) => new Set([...prev, currentIndex]));
      setMistakeCount((m) => m + 1);
      recordKeyError(expected);
    }

    setTyped(newTyped);

    if (newTyped.length >= text.length) {
      setIsComplete(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }
  }, [typed, text, currentIndex, isStarted, isComplete, startTime, recordKeyError]);

  const handleBackspace = useCallback(() => {
    if (typed.length === 0) return;
    const newTyped = typed.slice(0, -1);
    const newErrors = new Set(errors);
    newErrors.delete(typed.length - 1);
    setTyped(newTyped);
    setErrors(newErrors);
  }, [typed, errors]);

  const reset = useCallback(() => {
    setTyped('');
    setErrors(new Set());
    setIsStarted(false);
    setIsComplete(false);
    setStartTime(null);
    setElapsedTime(0);
    setMistakeCount(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    typed,
    errors,
    currentIndex,
    isStarted,
    isComplete,
    wpm,
    accuracy,
    mistakeCount,
    elapsedTime,
    handleKeyPress,
    handleBackspace,
    reset,
  };
}
