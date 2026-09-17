import { Achievement, UserProfile, UserProgress } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-story',
    title: 'First Step',
    description: 'Read and understand your first news story',
    icon: 'BookOpen',
    currentProgress: 1,
    maxProgress: 1,
    unlockedAt: '2026-09-10T10:00:00Z'
  },
  {
    id: 'first-quiz',
    title: 'Quiz Initiate',
    description: 'Complete your first 5-question Daily Challenge',
    icon: 'Award',
    currentProgress: 1,
    maxProgress: 1,
    unlockedAt: '2026-09-11T12:00:00Z'
  },
  {
    id: 'streak-7',
    title: '7-Day Streak',
    description: 'Maintain a 7-day continuous news learning habit',
    icon: 'Flame',
    currentProgress: 7,
    maxProgress: 7,
    unlockedAt: '2026-09-12T08:00:00Z'
  },
  {
    id: 'xp-500',
    title: 'Knowledge Apprentice',
    description: 'Accumulate 500 total XP points',
    icon: 'Zap',
    currentProgress: 420,
    maxProgress: 500
  },
  {
    id: 'first-prediction',
    title: 'Future Forecaster',
    description: 'Make your first prediction in "What Happens Next?"',
    icon: 'Compass',
    currentProgress: 1,
    maxProgress: 1,
    unlockedAt: '2026-09-11T15:30:00Z'
  },
  {
    id: 'science-explorer',
    title: 'Science Explorer',
    description: 'Read 5 Science & Technology articles',
    icon: 'Atom',
    currentProgress: 3,
    maxProgress: 5
  },
  {
    id: 'policy-analyst',
    title: 'Policy Analyst',
    description: 'Answer 5 Business & Governance questions correctly',
    icon: 'Scale',
    currentProgress: 4,
    maxProgress: 5
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-student-01',
  name: 'Pavithra Sankari',
  email: 'pavi.sankari26@gmail.com',
  avatar: '',
  role: 'student',
  createdAt: '2026-09-01T00:00:00Z'
};

export const INITIAL_USER_PROGRESS: UserProgress = {
  level: 3,
  levelTitle: 'Knowledge Builder',
  xp: 420,
  xpToNextLevel: 600,
  streakDays: 7,
  longestStreak: 7,
  lastActiveDate: '2026-09-12',
  storiesReadCount: 14,
  savedArticleIds: ['india-semiconductor-mission', 'chandrayaan-space-station'],
  interests: ['Science & Technology', 'Space', 'Business & Economy', 'Education'],
  explanationStyle: 'student',
  quizStats: {
    attempted: 20,
    correct: 17,
    byCategory: {
      'Science & Technology': { attempted: 6, correct: 6 },
      'Space': { attempted: 5, correct: 5 },
      'Business & Economy': { attempted: 5, correct: 3 },
      'Environment': { attempted: 2, correct: 2 },
      'World': { attempted: 2, correct: 1 }
    }
  },
  predictionStats: {
    total: 3,
    resolved: 1,
    correct: 1,
    byCategory: {
      'Science & Technology': { total: 1, correct: 1 },
      'Space': { total: 1, correct: 0 },
      'Business & Economy': { total: 1, correct: 0 }
    }
  },
  achievements: INITIAL_ACHIEVEMENTS,
  readHistory: [
    { articleId: 'india-semiconductor-mission', timestamp: '2026-09-11T16:00:00Z' },
    { articleId: 'chandrayaan-space-station', timestamp: '2026-09-11T16:30:00Z' }
  ]
};
