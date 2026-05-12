import { useCallback, useRef } from 'react';
import { useStore } from '../store/useStore';

// Generate soft sounds using Web Audio API
function createAudioContext() {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainVal = 0.15,
  fadeOut = true
) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gainNode.gain.setValueAtTime(gainVal, ctx.currentTime);
  if (fadeOut) {
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  }

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export function useSounds() {
  const soundEnabled = useStore((s) => s.soundEnabled);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext();
    }
    return audioCtxRef.current;
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const playKeyClick = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    // Soft click: low-frequency short pop
    playTone(ctx, 800, 0.04, 'square', 0.05, true);
  }, [soundEnabled, getCtx]);

  const playCorrect = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    playTone(ctx, 1200, 0.08, 'sine', 0.08, true);
  }, [soundEnabled, getCtx]);

  const playError = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    playTone(ctx, 220, 0.15, 'sawtooth', 0.06, true);
  }, [soundEnabled, getCtx]);

  const playSuccess = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    // Ascending arpeggio
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => playTone(ctx, freq, 0.2, 'sine', 0.1, true), i * 80);
    });
  }, [soundEnabled, getCtx]);

  const playCombo = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    playTone(ctx, 880, 0.12, 'sine', 0.12, true);
  }, [soundEnabled, getCtx]);

  return { playKeyClick, playCorrect, playError, playSuccess, playCombo };
}
