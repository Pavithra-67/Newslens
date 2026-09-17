import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Article, DailyChallenge, NewsCategory, TopicInfo, UserProgress, WeeklyChallenge, QuizQuestion } from '../src/types';
import { MOCK_ARTICLES } from '../src/data/mockArticles';
import { MOCK_DAILY_CHALLENGE, MOCK_WEEKLY_CHALLENGE } from '../src/data/mockQuizzes';
import { MOCK_TOPICS } from '../src/data/mockTopics';
import { INITIAL_USER_PROGRESS } from '../src/data/initialUserProgress';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'student' | 'admin';
  avatar: string;
  xp: number;
  streakDays: number;
  longestStreak: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
  storiesReadCount: number;
  savedArticleIds: string[];
  interests: NewsCategory[];
  explanationStyle: 'simple' | 'student' | 'detailed';
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
  achievements: any[];
  readHistory: Array<{ articleId: string; timestamp: string }>;
  createdAt: string;
}

export interface DbSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface DbDailyCompletion {
  id: string;
  userId: string;
  quizId: string;
  quizDate: string; // YYYY-MM-DD
  score: number;
  totalQuestions: number;
  xpAwarded: number;
  answers: Record<string, number>;
  completedAt: string;
}

export interface DbWeeklyCompletion {
  id: string;
  userId: string;
  cycleId: string; // e.g. '2026-W38'
  score: number;
  totalQuestions: number;
  xpAwarded: number;
  answers: Record<string, number>;
  questions: QuizQuestion[];
  completedAt: string;
}

export interface WeeklyCycleInfo {
  cycleId: string;
  cycleLabel: string;
  startDateStr: string;
  endDateStr: string;
  nextCycleDateStr: string;
  daysRemaining: number;
}

interface DatabaseSchema {
  users: DbUser[];
  sessions: DbSession[];
  dailyCompletions: DbDailyCompletion[];
  weeklyCompletions: DbWeeklyCompletion[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'newslens_db.json');

// Ensure data folder exists
const dataDir = path.dirname(DB_FILE_PATH);
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    console.error('Failed to create data directory:', e);
  }
}

// Password hashing helpers
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const hash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

export function getLevelInfo(xp: number): { level: number; levelTitle: string } {
  const level = Math.floor(xp / 200) + 1;
  const titles = [
    'Curious Reader',
    'News Explorer',
    'Knowledge Builder',
    'Current Affairs Pro',
    'Master Analyst',
    'Global Strategist'
  ];
  const levelTitle = titles[Math.min(level - 1, titles.length - 1)];
  return { level, levelTitle };
}

// Timezone date calculation helper
export function getLocalDateString(date: Date = new Date(), timeZone?: string): string {
  if (timeZone) {
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return formatter.format(date); // YYYY-MM-DD
    } catch (e) {
      console.warn('Invalid timezone passed, falling back to UTC', timeZone);
    }
  }
  return date.toISOString().split('T')[0];
}

// Calendar day difference (consecutive day check)
export function isYesterday(lastDateStr: string | null, todayDateStr: string): boolean {
  if (!lastDateStr) return false;
  try {
    const [ly, lm, ld] = lastDateStr.split('-').map(Number);
    const [ty, tm, td] = todayDateStr.split('-').map(Number);

    const lastUtc = Date.UTC(ly, lm - 1, ld);
    const todayUtc = Date.UTC(ty, tm - 1, td);

    const diffDays = Math.round((todayUtc - lastUtc) / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  } catch (e) {
    return false;
  }
}

export function isSameDay(dateStr1: string | null, dateStr2: string): boolean {
  if (!dateStr1) return false;
  return dateStr1 === dateStr2;
}

export function getYesterdayDateString(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().split('T')[0];
}

export function getWeeklyCycleInfo(date: Date = new Date(), timeZone?: string): WeeklyCycleInfo {
  let d = new Date(date);
  if (timeZone) {
    try {
      const s = date.toLocaleString('en-US', { timeZone });
      d = new Date(s);
    } catch (e) {}
  }

  // Calculate Monday of current week
  const day = d.getDay(); // 0 is Sunday, 1 is Monday...
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  nextMonday.setHours(0, 0, 0, 0);

  // ISO 8601 week number calculation
  const target = new Date(monday.valueOf());
  const dayNr = (monday.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNum = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  const year = monday.getFullYear();
  const cycleId = `${year}-W${weekNum.toString().padStart(2, '0')}`;

  const fmt = (dt: Date) => {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const startDateStr = fmt(monday);
  const endDateStr = fmt(sunday);
  const nextCycleDateStr = fmt(nextMonday);

  const nowMs = d.getTime();
  const nextMs = nextMonday.getTime();
  const daysRemaining = Math.max(1, Math.ceil((nextMs - nowMs) / (1000 * 60 * 60 * 24)));

  const startMonthName = monday.toLocaleDateString('en-US', { month: 'short' });
  const endMonthName = sunday.toLocaleDateString('en-US', { month: 'short' });
  const cycleLabel = `${startMonthName} ${monday.getDate()} – ${endMonthName} ${sunday.getDate()}, ${year}`;

  return {
    cycleId,
    cycleLabel,
    startDateStr,
    endDateStr,
    nextCycleDateStr,
    daysRemaining
  };
}

class NewsLensDatabase {
  private data: DatabaseSchema = {
    users: [],
    sessions: [],
    dailyCompletions: [],
    weeklyCompletions: []
  };

  constructor() {
    this.load();
    this.seedDefaultUserIfEmpty();
  }

  private load() {
    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        this.data = JSON.parse(raw);
        if (!this.data.weeklyCompletions) {
          this.data.weeklyCompletions = [];
        }
      } catch (err) {
        console.error('Error loading database file, starting fresh', err);
        this.data = { users: [], sessions: [], dailyCompletions: [], weeklyCompletions: [] };
      }
    } else {
      this.data = { users: [], sessions: [], dailyCompletions: [], weeklyCompletions: [] };
    }
  }

  private save() {
    try {
      const tmpPath = `${DB_FILE_PATH}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_FILE_PATH);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private seedDefaultUserIfEmpty() {
    if (this.data.users.length === 0 || !this.findUserByEmail('pavi.sankari26@gmail.com')) {
      const paviSalt = generateSalt();
      const paviPasswordHash = hashPassword('password123', paviSalt);
      const paviUser: DbUser = {
        id: 'usr_pavi_default',
        name: 'Pavithra Sankari',
        email: 'pavi.sankari26@gmail.com',
        passwordHash: paviPasswordHash,
        salt: paviSalt,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        xp: 420,
        streakDays: 7,
        longestStreak: 12,
        lastCompletedDate: null,
        storiesReadCount: 18,
        savedArticleIds: ['india-semiconductor-mission', 'spadex-space-docking-isro'],
        interests: ['Science & Technology', 'Space', 'Business & Economy', 'Education'],
        explanationStyle: 'student',
        quizStats: {
          attempted: 25,
          correct: 22,
          byCategory: {
            'Science & Technology': { attempted: 12, correct: 11 },
            'Space': { attempted: 8, correct: 7 },
            'Business & Economy': { attempted: 5, correct: 4 }
          }
        },
        predictionStats: {
          total: 6,
          resolved: 4,
          correct: 3,
          byCategory: {}
        },
        achievements: INITIAL_USER_PROGRESS.achievements,
        readHistory: [
          { articleId: 'india-semiconductor-mission', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { articleId: 'spadex-space-docking-isro', timestamp: new Date(Date.now() - 172800000).toISOString() }
        ],
        createdAt: new Date().toISOString()
      };

      if (!this.findUserByEmail('pavi.sankari26@gmail.com')) {
        this.data.users.push(paviUser);
      }
    }

    if (this.data.users.length === 0) {
      const salt = generateSalt();
      const passwordHash = hashPassword('student123', salt);
      const defaultUser: DbUser = {
        id: 'usr_student_demo',
        name: 'Aarav Sharma',
        email: 'student@newslens.edu',
        passwordHash,
        salt,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        xp: 145,
        streakDays: 3,
        longestStreak: 5,
        lastCompletedDate: null,
        storiesReadCount: 6,
        savedArticleIds: ['india-semiconductor-mission', 'spadex-space-docking-isro'],
        interests: ['Science & Technology', 'Space', 'Business & Economy', 'Education'],
        explanationStyle: 'student',
        quizStats: {
          attempted: 15,
          correct: 12,
          byCategory: {
            'Science & Technology': { attempted: 8, correct: 7 },
            'Space': { attempted: 4, correct: 3 },
            'Business & Economy': { attempted: 3, correct: 2 }
          }
        },
        predictionStats: {
          total: 4,
          resolved: 2,
          correct: 2,
          byCategory: {}
        },
        achievements: INITIAL_USER_PROGRESS.achievements,
        readHistory: [
          { articleId: 'india-semiconductor-mission', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { articleId: 'spadex-space-docking-isro', timestamp: new Date(Date.now() - 172800000).toISOString() }
        ],
        createdAt: new Date().toISOString()
      };

      this.data.users.push(defaultUser);
    }
    this.save();
  }

  // --- User Operations ---

  public findUserByEmail(email: string): DbUser | undefined {
    const normalized = email.trim().toLowerCase();
    return this.data.users.find(u => u.email.toLowerCase() === normalized);
  }

  public findUserById(id: string): DbUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(params: {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'admin';
  }): DbUser {
    const normalizedEmail = params.email.trim().toLowerCase();
    if (this.findUserByEmail(normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(params.password, salt);
    const id = `usr_${crypto.randomBytes(8).toString('hex')}`;

    const newUser: DbUser = {
      id,
      name: params.name.trim(),
      email: normalizedEmail,
      passwordHash,
      salt,
      role: params.role || 'student',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(params.name)}`,
      xp: 0,
      streakDays: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      storiesReadCount: 0,
      savedArticleIds: [],
      interests: ['India', 'World', 'Science & Technology', 'Environment'],
      explanationStyle: 'student',
      quizStats: {
        attempted: 0,
        correct: 0,
        byCategory: {}
      },
      predictionStats: {
        total: 0,
        resolved: 0,
        correct: 0,
        byCategory: {}
      },
      achievements: INITIAL_USER_PROGRESS.achievements.map(a => ({ ...a, currentProgress: 0, unlockedAt: undefined })),
      readHistory: [],
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(userId: string, updates: Partial<DbUser>): DbUser {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');

    Object.assign(user, updates);
    this.save();
    return user;
  }

  // --- Session Operations ---

  public createSession(userId: string): string {
    const token = `sess_${crypto.randomBytes(24).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    this.data.sessions.push({
      token,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt
    });
    this.save();
    return token;
  }

  public getUserBySessionToken(token: string): DbUser | null {
    if (!token) return null;
    const session = this.data.sessions.find(s => s.token === token);
    if (!session) return null;

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      this.deleteSession(token);
      return null;
    }

    const user = this.findUserById(session.userId);
    return user || null;
  }

  public deleteSession(token: string) {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.save();
  }

  // --- Daily Quiz Operations ---

  public getDailyCompletion(userId: string, quizDate: string): DbDailyCompletion | undefined {
    return this.data.dailyCompletions.find(
      c => c.userId === userId && c.quizDate === quizDate
    );
  }

  public getUserStreakInfo(userId: string, todayDateStr: string): {
    currentStreak: number;
    longestStreak: number;
    lastCompletedDate: string | null;
    completedToday: boolean;
  } {
    const user = this.findUserById(userId);
    if (!user) {
      return { currentStreak: 0, longestStreak: 0, lastCompletedDate: null, completedToday: false };
    }

    const completions = this.data.dailyCompletions
      .filter(c => c.userId === userId)
      .map(c => c.quizDate);
    const uniqueDates = Array.from(new Set(completions)).sort();

    if (uniqueDates.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: user.longestStreak || 0,
        lastCompletedDate: null,
        completedToday: false
      };
    }

    const completedToday = uniqueDates.includes(todayDateStr);
    const lastDate = uniqueDates[uniqueDates.length - 1];

    // Compute longest consecutive run from actual records
    let longestStreak = 1;
    let tempRun = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      if (isYesterday(uniqueDates[i - 1], uniqueDates[i])) {
        tempRun++;
      } else {
        tempRun = 1;
      }
      if (tempRun > longestStreak) longestStreak = tempRun;
    }

    let currentStreak = 0;
    if (completedToday) {
      currentStreak = 1;
      let checkDate = todayDateStr;
      while (true) {
        const prev = getYesterdayDateString(checkDate);
        if (uniqueDates.includes(prev)) {
          currentStreak++;
          checkDate = prev;
        } else {
          break;
        }
      }
    } else if (isYesterday(lastDate, todayDateStr)) {
      currentStreak = 1;
      let checkDate = lastDate;
      while (true) {
        const prev = getYesterdayDateString(checkDate);
        if (uniqueDates.includes(prev)) {
          currentStreak++;
          checkDate = prev;
        } else {
          break;
        }
      }
    } else {
      currentStreak = 0;
    }

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, user.longestStreak || 0, currentStreak),
      lastCompletedDate: lastDate,
      completedToday
    };
  }

  public recordDailyQuizCompletion(params: {
    userId: string;
    quizId: string;
    quizDate: string; // YYYY-MM-DD
    score: number;
    totalQuestions: number;
    xpEarned: number;
    answers: Record<string, number>;
  }): {
    completion: DbDailyCompletion;
    user: DbUser;
  } {
    const { userId, quizId, quizDate, score, totalQuestions, xpEarned, answers } = params;

    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');

    // Strict constraint check: userId + quizDate
    const existing = this.getDailyCompletion(userId, quizDate);
    if (existing) {
      throw new Error("You've already completed today's quiz.");
    }

    // Calculate Streak based on requirement rules
    let newStreak = 1;
    if (!user.lastCompletedDate) {
      // First completed day
      newStreak = 1;
    } else if (isYesterday(user.lastCompletedDate, quizDate)) {
      // Consecutive day
      newStreak = (user.streakDays || 0) + 1;
    } else if (isSameDay(user.lastCompletedDate, quizDate)) {
      // Same day (should have been caught by existing check, but defense in depth)
      newStreak = user.streakDays || 1;
    } else {
      // Missed one or more days -> streak resets to 1
      newStreak = 1;
    }

    const newLongestStreak = Math.max(user.longestStreak || 0, newStreak);

    // Update user stats
    user.xp += xpEarned;
    user.streakDays = newStreak;
    user.longestStreak = newLongestStreak;
    user.lastCompletedDate = quizDate;
    user.quizStats.attempted += totalQuestions;
    user.quizStats.correct += score;

    // Check streak achievements
    user.achievements = user.achievements.map(ach => {
      if (ach.id === 'streak-7') {
        const prog = Math.min(ach.maxProgress, newStreak);
        return {
          ...ach,
          currentProgress: prog,
          unlockedAt: prog >= ach.maxProgress ? (ach.unlockedAt || new Date().toISOString()) : undefined
        };
      }
      if (ach.id === 'quiz-ace' && score === totalQuestions) {
        return {
          ...ach,
          currentProgress: 1,
          unlockedAt: ach.unlockedAt || new Date().toISOString()
        };
      }
      return ach;
    });

    // Create completion record
    const completion: DbDailyCompletion = {
      id: `comp_${crypto.randomBytes(8).toString('hex')}`,
      userId,
      quizId,
      quizDate,
      score,
      totalQuestions,
      xpAwarded: xpEarned,
      answers,
      completedAt: new Date().toISOString()
    };

    this.data.dailyCompletions.push(completion);
    this.save();

    return { completion, user };
  }

  // --- Weekly Practice Operations ---

  public getWeeklyCompletion(userId: string, cycleId: string): DbWeeklyCompletion | undefined {
    return this.data.weeklyCompletions.find(
      c => c.userId === userId && c.cycleId === cycleId
    );
  }

  public getWeeklyStatus(userId: string, timeZone?: string) {
    const cycleInfo = getWeeklyCycleInfo(new Date(), timeZone);
    const completion = this.getWeeklyCompletion(userId, cycleInfo.cycleId);
    const history = this.data.weeklyCompletions
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    return {
      cycleId: cycleInfo.cycleId,
      cycleLabel: cycleInfo.cycleLabel,
      completed: Boolean(completion),
      nextCycleDate: cycleInfo.nextCycleDateStr,
      daysRemaining: cycleInfo.daysRemaining,
      completion: completion || null,
      history
    };
  }

  public recordWeeklyCompletion(params: {
    userId: string;
    cycleId: string;
    score: number;
    totalQuestions: number;
    xpEarned: number;
    answers: Record<string, number>;
    questions: QuizQuestion[];
  }): {
    completion: DbWeeklyCompletion;
    user: DbUser;
  } {
    const { userId, cycleId, score, totalQuestions, xpEarned, answers, questions } = params;

    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');

    // Strict constraint check: userId + cycleId
    const existing = this.getWeeklyCompletion(userId, cycleId);
    if (existing) {
      throw new Error("You've already completed this week's practice.");
    }

    // Award XP server-side (Note: Weekly Practice does NOT touch Daily Quiz streak)
    user.xp += xpEarned;
    user.quizStats.attempted += totalQuestions;
    user.quizStats.correct += score;

    const completion: DbWeeklyCompletion = {
      id: `wcomp_${crypto.randomBytes(8).toString('hex')}`,
      userId,
      cycleId,
      score,
      totalQuestions,
      xpAwarded: xpEarned,
      answers,
      questions,
      completedAt: new Date().toISOString()
    };

    this.data.weeklyCompletions.push(completion);
    this.save();

    return { completion, user };
  }
}

export const db = new NewsLensDatabase();
