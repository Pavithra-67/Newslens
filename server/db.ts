import crypto from 'crypto';
import { Db, Collection } from 'mongodb';
import { NewsCategory, QuizQuestion } from '../src/types';
import { INITIAL_USER_PROGRESS } from '../src/data/initialUserProgress';
import { getDatabase, getCollection, ensureIndexes } from './mongodb';

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

/**
 * Strips internal MongoDB _id from returned application documents.
 */
function sanitizeDoc<T>(doc: any): T {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return rest as T;
}

/**
 * MongoDB Atlas persistence service for NewsLens.
 */
class NewsLensDatabase {
  private initialized = false;

  /**
   * Initializes the MongoDB connection and ensures collections and indexes exist.
   */
  public async init(): Promise<void> {
    if (this.initialized) return;
    const db = await getDatabase();
    await ensureIndexes(db);
    this.initialized = true;
  }

  private async getUsersCol(): Promise<Collection<DbUser>> {
    await this.init();
    return getCollection<DbUser>('users');
  }

  private async getSessionsCol(): Promise<Collection<DbSession>> {
    await this.init();
    return getCollection<DbSession>('sessions');
  }

  private async getDailyCol(): Promise<Collection<DbDailyCompletion>> {
    await this.init();
    return getCollection<DbDailyCompletion>('dailyCompletions');
  }

  private async getWeeklyCol(): Promise<Collection<DbWeeklyCompletion>> {
    await this.init();
    return getCollection<DbWeeklyCompletion>('weeklyCompletions');
  }

  // ----------------------------------------------------
  // USER OPERATIONS
  // ----------------------------------------------------

  public async findUserByEmail(email: string): Promise<DbUser | null> {
    const normalized = email.trim().toLowerCase();
    const col = await this.getUsersCol();
    const user = await col.findOne({ email: normalized });
    return user ? sanitizeDoc<DbUser>(user) : null;
  }

  public async findUserById(id: string): Promise<DbUser | null> {
    const col = await this.getUsersCol();
    const user = await col.findOne({ id });
    return user ? sanitizeDoc<DbUser>(user) : null;
  }

  public async createUser(params: {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'admin';
  }): Promise<DbUser> {
    const normalizedEmail = params.email.trim().toLowerCase();
    const existing = await this.findUserByEmail(normalizedEmail);
    if (existing) {
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
      avatar: '',
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
      achievements: INITIAL_USER_PROGRESS.achievements.map(a => ({
        ...a,
        currentProgress: 0,
        unlockedAt: undefined
      })),
      readHistory: [],
      createdAt: new Date().toISOString()
    };

    const col = await this.getUsersCol();
    try {
      await col.insertOne(newUser as any);
    } catch (err: any) {
      if (err?.code === 11000 || err?.message?.includes('duplicate key')) {
        throw new Error('An account with this email already exists.');
      }
      throw err;
    }

    return newUser;
  }

  public async updateUser(userId: string, updates: Partial<DbUser>): Promise<DbUser> {
    const col = await this.getUsersCol();
    // Exclude internal _id or primary id from being overridden
    const { _id, id, ...safeUpdates } = updates as any;

    const result = await col.findOneAndUpdate(
      { id: userId },
      { $set: safeUpdates },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('User not found');
    }

    return sanitizeDoc<DbUser>(result);
  }

  // ----------------------------------------------------
  // SESSION OPERATIONS
  // ----------------------------------------------------

  public async createSession(userId: string): Promise<string> {
    const token = `sess_${crypto.randomBytes(24).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    const session: DbSession = {
      token,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt
    };

    const col = await this.getSessionsCol();
    await col.insertOne(session as any);
    return token;
  }

  public async getUserBySessionToken(token: string): Promise<DbUser | null> {
    if (!token) return null;
    const col = await this.getSessionsCol();
    const session = await col.findOne({ token });
    if (!session) return null;

    // Check expiration
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      await this.deleteSession(token);
      return null;
    }

    return this.findUserById(session.userId);
  }

  public async deleteSession(token: string): Promise<void> {
    if (!token) return;
    const col = await this.getSessionsCol();
    await col.deleteOne({ token });
  }

  // ----------------------------------------------------
  // DAILY QUIZ OPERATIONS
  // ----------------------------------------------------

  public async getDailyCompletion(userId: string, quizDate: string): Promise<DbDailyCompletion | null> {
    const col = await this.getDailyCol();
    const completion = await col.findOne({ userId, quizDate });
    return completion ? sanitizeDoc<DbDailyCompletion>(completion) : null;
  }

  public async getUserStreakInfo(userId: string, todayDateStr: string): Promise<{
    currentStreak: number;
    longestStreak: number;
    lastCompletedDate: string | null;
    completedToday: boolean;
  }> {
    const user = await this.findUserById(userId);
    if (!user) {
      return { currentStreak: 0, longestStreak: 0, lastCompletedDate: null, completedToday: false };
    }

    const col = await this.getDailyCol();
    const completions = await col
      .find({ userId })
      .project<{ quizDate: string }>({ quizDate: 1 })
      .toArray();

    const uniqueDates = Array.from(new Set(completions.map(c => c.quizDate))).sort();

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

  public async recordDailyQuizCompletion(params: {
    userId: string;
    quizId: string;
    quizDate: string; // YYYY-MM-DD
    score: number;
    totalQuestions: number;
    xpEarned: number;
    answers: Record<string, number>;
  }): Promise<{
    completion: DbDailyCompletion;
    user: DbUser;
  }> {
    const { userId, quizId, quizDate, score, totalQuestions, xpEarned, answers } = params;

    const user = await this.findUserById(userId);
    if (!user) throw new Error('User not found');

    // Strict constraint check: userId + quizDate
    const existing = await this.getDailyCompletion(userId, quizDate);
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
      // Same day defensive check
      newStreak = user.streakDays || 1;
    } else {
      // Missed one or more days -> streak resets to 1
      newStreak = 1;
    }

    const newLongestStreak = Math.max(user.longestStreak || 0, newStreak);

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

    // Atomic insert into dailyCompletions collection with unique compound index
    const dailyCol = await this.getDailyCol();
    try {
      await dailyCol.insertOne(completion as any);
    } catch (err: any) {
      if (err?.code === 11000 || err?.message?.includes('duplicate key')) {
        throw new Error("You've already completed today's quiz.");
      }
      throw err;
    }

    // Update streak achievements
    const updatedAchievements = (user.achievements || []).map(ach => {
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

    // Update user stats in MongoDB atomically
    const usersCol = await this.getUsersCol();
    const updatedUserDoc = await usersCol.findOneAndUpdate(
      { id: userId },
      {
        $inc: {
          xp: xpEarned,
          'quizStats.attempted': totalQuestions,
          'quizStats.correct': score
        },
        $set: {
          streakDays: newStreak,
          longestStreak: newLongestStreak,
          lastCompletedDate: quizDate,
          achievements: updatedAchievements
        }
      },
      { returnDocument: 'after' }
    );

    if (!updatedUserDoc) {
      throw new Error('User not found during update');
    }

    return {
      completion,
      user: sanitizeDoc<DbUser>(updatedUserDoc)
    };
  }

  // ----------------------------------------------------
  // WEEKLY PRACTICE OPERATIONS
  // ----------------------------------------------------

  public async getWeeklyCompletion(userId: string, cycleId: string): Promise<DbWeeklyCompletion | null> {
    const col = await this.getWeeklyCol();
    const completion = await col.findOne({ userId, cycleId });
    return completion ? sanitizeDoc<DbWeeklyCompletion>(completion) : null;
  }

  public async getWeeklyStatus(userId: string, timeZone?: string) {
    const cycleInfo = getWeeklyCycleInfo(new Date(), timeZone);
    const completion = await this.getWeeklyCompletion(userId, cycleInfo.cycleId);
    const col = await this.getWeeklyCol();
    const rawHistory = await col.find({ userId }).sort({ completedAt: -1 }).toArray();
    const history = rawHistory.map(h => sanitizeDoc<DbWeeklyCompletion>(h));

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

  public async recordWeeklyCompletion(params: {
    userId: string;
    cycleId: string;
    score: number;
    totalQuestions: number;
    xpEarned: number;
    answers: Record<string, number>;
    questions: QuizQuestion[];
  }): Promise<{
    completion: DbWeeklyCompletion;
    user: DbUser;
  }> {
    const { userId, cycleId, score, totalQuestions, xpEarned, answers, questions } = params;

    const user = await this.findUserById(userId);
    if (!user) throw new Error('User not found');

    // Strict constraint check: userId + cycleId
    const existing = await this.getWeeklyCompletion(userId, cycleId);
    if (existing) {
      throw new Error("You've already completed this week's practice.");
    }

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

    // Atomic insert into weeklyCompletions with unique compound index
    const weeklyCol = await this.getWeeklyCol();
    try {
      await weeklyCol.insertOne(completion as any);
    } catch (err: any) {
      if (err?.code === 11000 || err?.message?.includes('duplicate key')) {
        throw new Error("You've already completed this week's practice.");
      }
      throw err;
    }

    // Award XP server-side (Weekly Practice strictly does NOT touch Daily Quiz streak)
    const usersCol = await this.getUsersCol();
    const updatedUserDoc = await usersCol.findOneAndUpdate(
      { id: userId },
      {
        $inc: {
          xp: xpEarned,
          'quizStats.attempted': totalQuestions,
          'quizStats.correct': score
        }
      },
      { returnDocument: 'after' }
    );

    if (!updatedUserDoc) {
      throw new Error('User not found during update');
    }

    return {
      completion,
      user: sanitizeDoc<DbUser>(updatedUserDoc)
    };
  }
}

export const db = new NewsLensDatabase();
