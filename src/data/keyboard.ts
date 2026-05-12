export type FingerColor =
  | 'pinky'
  | 'ring'
  | 'middle'
  | 'index-left'
  | 'index-right'
  | 'thumb'
  | 'neutral';

export interface KeyData {
  key: string;
  display?: string;
  finger: FingerColor;
  hand: 'left' | 'right' | 'both';
  width?: number; // relative width multiplier
}

export const FINGER_COLORS: Record<FingerColor, { bg: string; text: string; label: string }> = {
  pinky:        { bg: '#f0abfc', text: '#86198f', label: 'Pinky' },
  ring:         { bg: '#a5b4fc', text: '#3730a3', label: 'Ring' },
  middle:       { bg: '#6ee7b7', text: '#065f46', label: 'Middle' },
  'index-left': { bg: '#fde68a', text: '#92400e', label: 'Index' },
  'index-right':{ bg: '#fcd34d', text: '#78350f', label: 'Index' },
  thumb:        { bg: '#d1d5db', text: '#374151', label: 'Thumb' },
  neutral:      { bg: '#e5e7eb', text: '#6b7280', label: '' },
};

// Dark mode finger colors
export const FINGER_COLORS_DARK: Record<FingerColor, { bg: string; text: string }> = {
  pinky:        { bg: '#701a75', text: '#f0abfc' },
  ring:         { bg: '#312e81', text: '#a5b4fc' },
  middle:       { bg: '#064e3b', text: '#6ee7b7' },
  'index-left': { bg: '#78350f', text: '#fde68a' },
  'index-right':{ bg: '#713f12', text: '#fcd34d' },
  thumb:        { bg: '#374151', text: '#d1d5db' },
  neutral:      { bg: '#1f2937', text: '#6b7280' },
};

export const KEYBOARD_ROWS: KeyData[][] = [
  // Row 1 - Number row
  [
    { key: '`', display: '`~', finger: 'pinky', hand: 'left' },
    { key: '1', display: '1!', finger: 'pinky', hand: 'left' },
    { key: '2', display: '2@', finger: 'ring', hand: 'left' },
    { key: '3', display: '3#', finger: 'middle', hand: 'left' },
    { key: '4', display: '4$', finger: 'index-left', hand: 'left' },
    { key: '5', display: '5%', finger: 'index-left', hand: 'left' },
    { key: '6', display: '6^', finger: 'index-right', hand: 'right' },
    { key: '7', display: '7&', finger: 'index-right', hand: 'right' },
    { key: '8', display: '8*', finger: 'middle', hand: 'right' },
    { key: '9', display: '9(', finger: 'ring', hand: 'right' },
    { key: '0', display: '0)', finger: 'pinky', hand: 'right' },
    { key: '-', display: '-_', finger: 'pinky', hand: 'right' },
    { key: '=', display: '=+', finger: 'pinky', hand: 'right' },
    { key: 'Backspace', display: '⌫', finger: 'pinky', hand: 'right', width: 2 },
  ],
  // Row 2 - QWERTY
  [
    { key: 'Tab', display: 'Tab', finger: 'pinky', hand: 'left', width: 1.5 },
    { key: 'q', finger: 'pinky', hand: 'left' },
    { key: 'w', finger: 'ring', hand: 'left' },
    { key: 'e', finger: 'middle', hand: 'left' },
    { key: 'r', finger: 'index-left', hand: 'left' },
    { key: 't', finger: 'index-left', hand: 'left' },
    { key: 'y', finger: 'index-right', hand: 'right' },
    { key: 'u', finger: 'index-right', hand: 'right' },
    { key: 'i', finger: 'middle', hand: 'right' },
    { key: 'o', finger: 'ring', hand: 'right' },
    { key: 'p', finger: 'pinky', hand: 'right' },
    { key: '[', display: '[{', finger: 'pinky', hand: 'right' },
    { key: ']', display: ']}', finger: 'pinky', hand: 'right' },
    { key: '\\', display: '\\|', finger: 'pinky', hand: 'right', width: 1.5 },
  ],
  // Row 3 - Home Row
  [
    { key: 'CapsLock', display: 'Caps', finger: 'pinky', hand: 'left', width: 1.75 },
    { key: 'a', finger: 'pinky', hand: 'left' },
    { key: 's', finger: 'ring', hand: 'left' },
    { key: 'd', finger: 'middle', hand: 'left' },
    { key: 'f', finger: 'index-left', hand: 'left' },
    { key: 'g', finger: 'index-left', hand: 'left' },
    { key: 'h', finger: 'index-right', hand: 'right' },
    { key: 'j', finger: 'index-right', hand: 'right' },
    { key: 'k', finger: 'middle', hand: 'right' },
    { key: 'l', finger: 'ring', hand: 'right' },
    { key: ';', display: ';:', finger: 'pinky', hand: 'right' },
    { key: "'", display: "'\"", finger: 'pinky', hand: 'right' },
    { key: 'Enter', display: 'Enter', finger: 'pinky', hand: 'right', width: 2.25 },
  ],
  // Row 4 - ZXCVB
  [
    { key: 'Shift', display: '⇧', finger: 'pinky', hand: 'left', width: 2.25 },
    { key: 'z', finger: 'pinky', hand: 'left' },
    { key: 'x', finger: 'ring', hand: 'left' },
    { key: 'c', finger: 'middle', hand: 'left' },
    { key: 'v', finger: 'index-left', hand: 'left' },
    { key: 'b', finger: 'index-left', hand: 'left' },
    { key: 'n', finger: 'index-right', hand: 'right' },
    { key: 'm', finger: 'index-right', hand: 'right' },
    { key: ',', display: ',<', finger: 'middle', hand: 'right' },
    { key: '.', display: '.>', finger: 'ring', hand: 'right' },
    { key: '/', display: '/?', finger: 'pinky', hand: 'right' },
    { key: 'Shift', display: '⇧', finger: 'pinky', hand: 'right', width: 2.75 },
  ],
  // Row 5 - Space bar
  [
    { key: 'Ctrl', display: 'Ctrl', finger: 'pinky', hand: 'left', width: 1.25 },
    { key: 'Alt', display: 'Alt', finger: 'thumb', hand: 'left', width: 1.25 },
    { key: ' ', display: 'Space', finger: 'thumb', hand: 'both', width: 6 },
    { key: 'Alt', display: 'Alt', finger: 'thumb', hand: 'right', width: 1.25 },
    { key: 'Ctrl', display: 'Ctrl', finger: 'pinky', hand: 'right', width: 1.25 },
  ],
];

// Map: character → key to highlight on keyboard
export function getKeyForChar(char: string): string {
  if (char === ' ') return ' ';
  const lower = char.toLowerCase();
  // Special cases
  const specialMap: Record<string, string> = {
    '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
    '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
    '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\',
    ':': ';', '"': "'", '<': ',', '>': '.', '?': '/',
    '~': '`',
  };
  if (specialMap[char]) return specialMap[char];
  return lower;
}

export const HOME_ROW_KEYS = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
export const HOME_ROW_BUMPS = ['f', 'j']; // keys with physical bumps
