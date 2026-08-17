export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: Level;
  category: 'letters' | 'words' | 'sentences' | 'paragraphs' | 'numbers' | 'symbols' | 'quotes';
  content: string;
  unlockAfter?: string; // lesson id
  targetWPM?: number;
}

export const LESSONS: Lesson[] = [
  // BEGINNER - Letters
  {
    id: 'b1',
    title: 'Home Row Keys',
    description: 'Start with the most important keys: A S D F J K L ;',
    level: 'beginner',
    category: 'letters',
    content: 'asdf jkl; asdf jkl; fdsa ;lkj asdf jkl; asdfjkl; jkl;asdf fdsajkl; asjkl fdjkl; asdfjkl;',
    targetWPM: 15,
  },
  {
    id: 'b2',
    title: 'Left Hand Keys',
    description: 'Practice Q W E R T on the left hand',
    level: 'beginner',
    category: 'letters',
    content: 'qwert qwert trewq qwert qwert rewt qwrt qwert trewq qwert qwert rewt qwrt',
    unlockAfter: 'b1',
    targetWPM: 18,
  },
  {
    id: 'b3',
    title: 'Right Hand Keys',
    description: 'Practice Y U I O P on the right hand',
    level: 'beginner',
    category: 'letters',
    content: 'yuiop yuiop poiuy yuiop yuiop poiuy uiop yuiop poiuy yuiop uio yuiop',
    unlockAfter: 'b2',
    targetWPM: 18,
  },
  {
    id: 'b4',
    title: 'Bottom Row',
    description: 'Practice Z X C V B N M keys',
    level: 'beginner',
    category: 'letters',
    content: 'zxcvb nm zxcvb nm bnmvc zxcvb nm bnm zxcv bnmvc zxcvb nm',
    unlockAfter: 'b3',
    targetWPM: 18,
  },
  {
    id: 'b5',
    title: 'All Letters Mix',
    description: 'Combine all letters of the alphabet',
    level: 'beginner',
    category: 'letters',
    content: 'the quick brown fox jumps over the lazy dog pack my box with five dozen liquor jugs',
    unlockAfter: 'b4',
    targetWPM: 20,
  },

  // BEGINNER - Words
  {
    id: 'b6',
    title: 'Common Short Words',
    description: 'Type frequently used short words',
    level: 'beginner',
    category: 'words',
    content: 'the and for are but not you all can had her was one our out did get has him his how man new now old see two who act age ago ago air',
    unlockAfter: 'b5',
    targetWPM: 25,
  },
  {
    id: 'b7',
    title: 'Simple Words',
    description: 'Practice typing common everyday words',
    level: 'beginner',
    category: 'words',
    content: 'apple ball cake door easy fast gold help item jump keep love made name open play quit road sale time unit very work xray year zero',
    unlockAfter: 'b6',
    targetWPM: 28,
  },

  // INTERMEDIATE - Words & Sentences
  {
    id: 'i1',
    title: 'Medium Words',
    description: 'Challenge yourself with longer words',
    level: 'intermediate',
    category: 'words',
    content: 'about above after again along also area away back been best body both came case come cost days does done down each even ever face fact feel find five',
    unlockAfter: 'b7',
    targetWPM: 30,
  },
  {
    id: 'i2',
    title: 'Simple Sentences',
    description: 'Type complete sentences with proper spacing',
    level: 'intermediate',
    category: 'sentences',
    content: 'The cat sat on the mat. A big dog ran fast. She read a good book. He went to the store. The sun is bright today.',
    unlockAfter: 'i1',
    targetWPM: 35,
  },
  {
    id: 'i3',
    title: 'Everyday Phrases',
    description: 'Common phrases used in daily life',
    level: 'intermediate',
    category: 'sentences',
    content: 'How are you doing today? I am fine thank you. What time is it now? Let me check my watch. Please have a seat here.',
    unlockAfter: 'i2',
    targetWPM: 38,
  },
  {
    id: 'i4',
    title: 'Number Practice',
    description: 'Practice typing numbers and digits',
    level: 'intermediate',
    category: 'numbers',
    content: '1234567890 9876543210 1357924680 2468013579 1029384756 5647382910 1234 5678 9012 3456 7890 1234567890',
    unlockAfter: 'i3',
    targetWPM: 30,
  },
  {
    id: 'i5',
    title: 'Mixed Words',
    description: 'A varied mix of common English words',
    level: 'intermediate',
    category: 'words',
    content: 'problem solution project report system design current future process business service product develop support manage create update remove deploy review',
    unlockAfter: 'i4',
    targetWPM: 40,
  },

  // ADVANCED - Sentences & Paragraphs
  {
    id: 'a1',
    title: 'Complex Sentences',
    description: 'Long sentences with punctuation',
    level: 'advanced',
    category: 'sentences',
    content: 'The development of modern technology has significantly changed how people communicate, work, and interact with each other on a daily basis.',
    unlockAfter: 'i5',
    targetWPM: 45,
  },
  {
    id: 'a2',
    title: 'Symbol Practice',
    description: 'Master special characters and symbols',
    level: 'advanced',
    category: 'symbols',
    content: '!@#$%^&*() !@#$%^&*() (){}[] (){}[] :;,.?! :;,.?! "hello" (world) [test] {code} a+b=c x*y/z',
    unlockAfter: 'a1',
    targetWPM: 30,
  },
  {
    id: 'a3',
    title: 'Full Paragraphs',
    description: 'Extended typing with complete paragraphs',
    level: 'advanced',
    category: 'paragraphs',
    content: 'Typing is a fundamental skill in the modern world. Whether you are writing emails, creating documents, or coding software, the ability to type quickly and accurately saves a tremendous amount of time. Practice consistently every day to improve your speed and accuracy.',
    unlockAfter: 'a2',
    targetWPM: 50,
  },
  {
    id: 'a4',
    title: 'Programming Keywords',
    description: 'Type common programming terms and syntax',
    level: 'advanced',
    category: 'sentences',
    content: 'const function return import export class interface async await promise resolve reject try catch finally throw new delete typeof instanceof',
    unlockAfter: 'a3',
    targetWPM: 45,
  },
  {
    id: 'a5',
    title: 'Speed Challenge',
    description: 'The ultimate typing speed test',
    level: 'advanced',
    category: 'paragraphs',
    content: 'The quick brown fox jumps over the lazy dog. Five boxing wizards jump quickly. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! The five boxing wizards jump quickly. Sphinx of black quartz, judge my vow.',
    unlockAfter: 'a4',
    targetWPM: 60,
  },
];

export const QUOTES = [
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
];

export const DAILY_CHALLENGES = [
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.',
  'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
  'She sells seashells by the seashore and the shells she sells are seashells.',
  'Peter Piper picked a peck of pickled peppers and preserved them properly.',
  'A proper cup of coffee from a proper copper coffee pot is proper coffee.',
  'Whether the weather is fine or whether the weather is not, we shall weather the weather.',
  'If two witches were watching two watches, which witch would watch which watch?',
];

export const WEAK_KEY_TEXTS: Record<string, string> = {
  'q': 'quick quiet quite queue queen quilt quart quack quiver quiz quorum quota quest',
  'w': 'word work world water wave walk wide wave well wish word wake warm went will',
  'e': 'every even ever each easy edge else ever ever evenly event eight eleven equal',
  'r': 'real read rest rich ring road room rule race rank rate role rush rare river',
  'z': 'zero zone zoom zebra zigzag zenith zeal zest zap zen zig zag zinc zone zip',
  'x': 'xray extra flex relax index exact oxygen excel exist box fox mix tax wax six',
  'y': 'year your yard yarn yell yoga yoke yore young youth yet yip yam yaw yes yoga',
  'p': 'pack page paid pale park past path peak plan play play plot plus poll post put',
  'b': 'back ball band bank base bath beat been bell best bill bind blue bold bond book',
  'n': 'name near need next nine node none noon note noun now null number night noble',
  'm': 'made mail main make male many mark mass mean meet mild mind mine miss mode moon',
};
