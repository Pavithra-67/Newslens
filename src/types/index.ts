export type NewsCategory =
  | 'India'
  | 'World'
  | 'Science & Technology'
  | 'Space'
  | 'Environment'
  | 'Environment & Climate'
  | 'Business'
  | 'Business & Economy'
  | 'Education'
  | 'Sports';

export type ExplanationStyle = 'simple' | 'student' | 'detailed';

export interface WhyShouldICareItem {
  target: 'Students' | 'Families' | 'India' | 'World' | 'Technology' | 'Future Careers' | 'Environment';
  impact: string;
  isCertain: boolean;
}

export interface KeyTerm {
  term: string;
  definition: string;
  context: string;
  pronunciation?: string;
  category?: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  source?: string;
}

export interface WhatChangedData {
  previously: string;
  now: string;
  highlights: string[];
}

export interface Stakeholder {
  name: string;
  role: string;
  relation: string;
  impactLevel: 'high' | 'medium' | 'low';
}

export interface ViewpointsData {
  topic: string;
  confirmedFacts: string[];
  viewpointA: {
    title: string;
    argument: string;
    sourceOrGroup?: string;
  };
  viewpointB: {
    title: string;
    argument: string;
    sourceOrGroup?: string;
  };
  sources: string[];
}

export interface WhatHappensNextItem {
  scenario: string;
  probability: 'High' | 'Moderate' | 'Developing';
  explanation: string;
}

export interface PredictionItem {
  id: string;
  question: string;
  options: string[];
  expiresAt: string;
  category: NewsCategory;
  userChoice?: number;
  resolved?: boolean;
  winningOption?: number;
  explanation?: string;
  totalVotes?: number[];
}

export interface ArticleSourceRef {
  name: string;
  url: string;
  publishedAt?: string;
}

export interface Article {
  id: string;
  title: string;
  headline: string;
  category: NewsCategory;
  heroImage: string;
  imageUrl?: string;
  description?: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  readingTimeMinutes: number;
  isFeatured?: boolean;
  author?: string;
  retrievedAt?: string;
  isEnriched?: boolean;
  isSensitive?: boolean;
  sensitiveReason?: string;
  coveredSourcesCount: number;
  otherSources?: ArticleSourceRef[];

  // Deep Learning Sections
  whatHappened: string;
  inSimpleWords: string;
  explanationModes: {
    simple: string;
    student: string;
    detailed: string;
  };
  whyShouldICare: WhyShouldICareItem[];
  keyTerms: KeyTerm[];
  timeline: TimelineEvent[];
  whatChanged: WhatChangedData;
  stakeholders: Stakeholder[];
  viewpoints?: ViewpointsData;
  whatHappensNext: WhatHappensNextItem[];
  predictions?: PredictionItem[];
  relatedArticleIds?: string[];
  chunks?: string[];
  quizQuestions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  articleId?: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'scenario' | 'reasoning';
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
  category: NewsCategory;
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  questions: QuizQuestion[];
  xpTotal: number;
  completed: boolean;
  score?: number;
}

export interface WeeklyChallenge {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  xpTotal: number;
  completed: boolean;
  score?: number;
}

export interface TopicInfo {
  id: string;
  name: string;
  category: NewsCategory;
  icon: string;
  tagline: string;
  summary: string;
  keyConcepts: Array<{ term: string; explanation: string; concept?: string }>;
  articleIds: string[];
  quickQuiz: QuizQuestion[];
  title?: string;
  description?: string;
  fundamentalConcept?: string;
  whyItMattersForStudents?: string;
  relatedArticleIds?: string[];
  quizQuestions?: QuizQuestion[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  currentProgress: number;
  maxProgress: number;
}

export interface UserProgress {
  level: number;
  levelTitle: string;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  longestStreak: number;
  lastActiveDate: string;
  storiesReadCount: number;
  savedArticleIds: string[];
  interests: NewsCategory[];
  explanationStyle: ExplanationStyle;
  quizStats: {
    attempted: number;
    correct: number;
    byCategory: Record<string, { attempted: number; correct: number }>;
  };
  predictionStats: {
    total: number;
    resolved: number;
    correct: number;
    byCategory: Record<string, { total: number; correct: number }>;
  };
  achievements: Achievement[];
  readHistory: Array<{ articleId: string; timestamp: string }>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'admin';
  createdAt: string;
}

export interface DailyQuizCompletion {
  quizDate: string;
  score: number;
  totalQuestions: number;
  xpAwarded: number;
  streakDays: number;
  completedAt: string;
  answers?: Record<string, number>;
}

export interface DailyQuizStatus {
  quizDate: string;
  completed: boolean;
  authenticated: boolean;
  completion: DailyQuizCompletion | null;
}

export interface WeeklyQuizCompletion {
  id: string;
  cycleId: string;
  score: number;
  totalQuestions: number;
  xpAwarded: number;
  completedAt: string;
  answers: Record<string, number>;
  questions?: QuizQuestion[];
}

export interface WeeklyQuizStatus {
  cycleId: string;
  cycleLabel: string;
  completed: boolean;
  authenticated: boolean;
  nextCycleDate: string;
  daysRemaining: number;
  completion: WeeklyQuizCompletion | null;
  history?: WeeklyQuizCompletion[];
}

