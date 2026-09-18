import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Db, Collection } from 'mongodb';
import { NewsCategory, QuizQuestion } from '../src/types';
import { INITIAL_USER_PROGRESS } from '../src/data/initialUserProgress';
import { getDatabase, getCollection, ensureIndexes, tryConnectMongo } from './mongodb';

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

const JSON_DB_PATH = path.join(process.cwd(), 'data', 'newslens_db.json');

interface LocalDbStore {
  users: DbUser[];
  sessions: DbSession[];
  dailyCompletions: DbDailyCompletion[];
  weeklyCompletions: DbWeeklyCompletion[];
}

let localStore: LocalDbStore = {
  users: [],
  sessions: [],
  dailyCompletions: [],
  weeklyCompletions: []
};

let localStoreLoaded = false;

function loadLocalStore(): void {
  if (localStoreLoaded) return;
  try {
    if (fs.existsSync(JSON_DB_PATH)) {
      const raw = fs.readFileSync(JSON_DB_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      localStore = {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
        dailyCompletions: Array.isArray(parsed.dailyCompletions) ? parsed.dailyCompletions : [],
        weeklyCompletions: Array.isArray(parsed.weeklyCompletions) ? parsed.weeklyCompletions : []
      };
      console.log(`[NewsLens DB] Loaded local store with ${localStore.users.length} users and ${localStore.dailyCompletions.length} daily completions.`);
    }
  } catch (err) {
    console.warn('[NewsLens DB] Warning reading local JSON database:', err);
  }
  localStoreLoaded = true;
}

function saveLocalStore(): void {
  try {
    const dir = path.dirname(JSON_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(localStore, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[NewsLens DB] Warning saving local JSON database:', err);
  }
}

/**
 * Robust persistence service for NewsLens:
 * Connects to MongoDB Atlas when MONGODB_URI is provided, or seamlessly
 * operates with high-fidelity in-memory/JSON store fallback.
 */
class NewsLensDatabase {
  private initialized = false;
  private useMongo = false;

  /**
   * Initializes the database connection and ensures schema readiness.
   */
  public async init(): Promise<void> {
    if (this.initialized) return;

    loadLocalStore();

    const uri = process.env.MONGODB_URI;
    if (uri && uri.trim() !== '') {
      const isConnected = await tryConnectMongo();
      if (isConnected) {
        try {
          const db = await getDatabase();
          await ensureIndexes(db);
          this.useMongo = true;
          console.log('[NewsLens DB] Connected to MongoDB Atlas.');
        } catch {
          this.useMongo = false;
          console.log('[NewsLens DB] Operating in resilient local persistence mode.');
        }
      } else {
        this.useMongo = false;
        console.log('[NewsLens DB] Operating in resilient local persistence mode.');
      }
    } else {
      console.log('[NewsLens DB] Operating in self-contained JSON persistence mode.');
      this.useMongo = false;
    }

    this.initialized = true;
  }

  public async getDatabaseStatus() {
    const hasUri = Boolean(process.env.MONGODB_URI?.trim());
    let usersCount = localStore.users.length;
    let dailyCount = localStore.dailyCompletions.length;
    let weeklyCount = localStore.weeklyCompletions.length;

    if (this.useMongo) {
      try {
        const usersCol = await this.getUsersCol();
        const dailyCol = await this.getDailyCol();
        const weeklyCol = await this.getWeeklyCol();
        usersCount = await usersCol.countDocuments();
        dailyCount = await dailyCol.countDocuments();
        weeklyCount = await weeklyCol.countDocuments();
      } catch {
        // Fall back to local counts
      }
    }

    return {
      mode: this.useMongo ? 'mongodb_atlas' : 'local_json',
      isMongoActive: this.useMongo,
      hasMongoUri: hasUri,
      statusMessage: this.useMongo
        ? 'MongoDB Atlas (Connected)'
        : hasUri
        ? 'Local JSON Persistence Active (Atlas requires 0.0.0.0/0 IP Whitelist in Network Access)'
        : 'Local JSON Persistence Active',
      totalUsers: usersCount,
      totalDailyCompletions: dailyCount,
      totalWeeklyCompletions: weeklyCount
    };
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
    await this.init();
    const normalized = email.trim().toLowerCase();

    if (this.useMongo) {
      try {
        const col = await this.getUsersCol();
        const user = await col.findOne({ email: normalized });
        if (user) return sanitizeDoc<DbUser>(user);
      } catch (err) {
        console.warn('[NewsLens DB] MongoDB findUserByEmail failed, using local store:', err);
      }
    }

    const user = localStore.users.find(u => u.email.trim().toLowerCase() === normalized);
    return user ? sanitizeDoc<DbUser>(JSON.parse(JSON.stringify(user))) : null;
  }

  public async findUserById(id: string): Promise<DbUser | null> {
    await this.init();

    if (this.useMongo) {
      try {
        const col = await this.getUsersCol();
        const user = await col.findOne({ id });
        if (user) return sanitizeDoc<DbUser>(user);
      } catch (err) {
        console.warn('[NewsLens DB] MongoDB findUserById failed, using local store:', err);
      }
    }

    const user = localStore.users.find(u => u.id === id);
    return user ? sanitizeDoc<DbUser>(JSON.parse(JSON.stringify(user))) : null;
  }

  public async createUser(params: {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'admin';
  }): Promise<DbUser> {
    await this.init();
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

    if (this.useMongo) {
      try {
        const col = await this.getUsersCol();
        await col.insertOne(newUser as any);
        return newUser;
      } catch (err: any) {
        if (err?.code === 11000 || err?.message?.includes('duplicate key')) {
          throw new Error('An account with this email already exists.');
        }
        console.warn('[NewsLens DB] MongoDB createUser failed, writing to local store:', err);
      }
    }

    localStore.users.push(newUser);
    saveLocalStore();
    return newUser;
  }

  public async updateUser(userId: string, updates: Partial<DbUser>): Promise<DbUser> {
    await this.init();
    const { _id, id, ...safeUpdates } = updates as any;

    if (this.useMongo) {
      try {
        const col = await this.getUsersCol();
        const result = await col.findOneAndUpdate(
          { id: userId },
          { $set: safeUpdates },
          { returnDocument: 'after' }
        );
        if (result) {
          return sanitizeDoc<DbUser>(result);
        }
      } catch (err) {
        console.warn('[NewsLens DB] MongoDB updateUser failed, falling back to local store:', err);
      }
    }

    const index = localStore.users.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    localStore.users[index] = {
      ...localStore.users[index],
      ...safeUpdates
    };
    saveLocalStore();
    return sanitizeDoc<DbUser>(JSON.parse(JSON.stringify(localStore.users[index])));
  }

  // ----------------------------------------------------
  // SESSION OPERATIONS
  // ----------------------------------------------------

  public async createSession(userId: string): Promise<string> {
    await this.init();
    const token = `sess_${crypto.randomBytes(24).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    const session: DbSession = {
      token,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt
    };

    if (this.useMongo) {
      try {
        const col = await this.getSessionsCol();
        await col.insertOne(session as any);
        return token;
      } catch (err) {
        console.warn('[NewsLens DB] MongoDB createSession failed, falling back to local store:', err);
      }
    }

    localStore.sessions.push(session);
    saveLocalStore();
    return token;
  }

  public async getUserBySessionToken(token: string): Promise<DbUser | null> {
    await this.init();
    if (!token) return null;

    if (this.useMongo) {
      try {
        const col = await this.getSessionsCol();
        const session = await col.findOne({ token });
        if (session) {
          if (new Date(session.expiresAt).getTime() < Date.now()) {
            await this.deleteSession(token);
            return null;
          }
          return this.findUserById(session.userId);
        }
      } catch (err) {
        console.warn('[NewsLens DB] MongoDB getUserBySessionToken failed, using local store:', err);
      }
    }

    const localSession = localStore.sessions.find(s => s.token === token);
    if (!localSession) return null;

    if (new Date(localSession.expiresAt).getTime() < Date.now()) {
      await this.deleteSession(token);
      return null;
    }

    return this.findUserById(localSession.userId);
  }

  public async deleteSession(token: string): Promise<void> {
    await this.init();
    if (!token) return;

    if (this.useMongo) {
      try {
        const col = await this.getSessionsCol();
        await col.deleteOne({ token });
      } catch (err) {
        console.warn('[NewsLens DB] MongoDB deleteSession failed:', err);
      }
    }

    localStore.sessions = localStore.sessions.filter(s => s.token !== token);
    saveLocalStore();
  }

  // ----------------------------------------------------
  // DAILY QUIZ OPERATIONS
  // ----------------------------------------------------

  public async getDailyCompletion(userId: string, quizDate: string): Promise<DbDailyCompletion | null> {
    await this.init();

    if (this.useMongo) {
      try {
        const col = await this.getDailyCol();
        const completion = await col.findOne({ userId, quizDate });
        if (completion) return sanitizeDoc<DbDailyCompletion>(completion);
      } catch (err) {
        console.warn('[NewsLens DB] MongoDB getDailyCompletion failed, using local store:', err);
      }
    }

    const comp = localStore.dailyCompletions.find(c => c.userId === userId && c.quizDate === quizDate);
    return comp ? sanitizeDoc<DbDailyCompletion>(JSON.parse(JSON.stringify(comp))) : null;
  }

  public async getUserStreakInfo(userId: string, todayDateStr: string): Promise<{
    currentStreak: number;
    longestStreak: number;
    lastCompletedDate: string | null;
    completedToday: boolean;
  }> {
    await this.init();
    const user = await this.findUserById(userId);
    if (!user) {
      return { currentStreak: 0, longestStreak: 0, lastCompletedDate: null, completedToday: false };
    }

    let uniqueDates: string[] = [];
    if (this.useMongo) {
      try {
        const col = await this.getDailyCol();
        const completions = await col
          .find({ userId })
          .project<{ quizDate: string }>({ quizDate: 1 })
          .toArray();
        uniqueDates = Array.from(new Set(completions.map(c => c.quizDate))).sort();
      } catch (err) {
        console.warn('[NewsLens DB] MongoDB getUserStreakInfo failed, reading local store:', err);
      }
    }

    if (uniqueDates.length === 0) {
      uniqueDates = Array.from(
        new Set(
          localStore.dailyCompletions
            .filter(c => c.userId === userId)
            .map(c => c.quizDate)
        )
      ).sort();
    }

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
    await this.init();
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
      newStreak = 1;
    } else if (isYesterday(user.lastCompletedDate, quizDate)) {
      newStreak = (user.streakDays || 0) + 1;
    } else if (isSameDay(user.lastCompletedDate, quizDate)) {
      newStreak = user.streakDays || 1;
    } else {
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

    if (this.useMongo) {
      try {
        const dailyCol = await this.getDailyCol();
        await dailyCol.insertOne(completion as any);

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

        if (updatedUserDoc) {
          return {
            completion,
            user: sanitizeDoc<DbUser>(updatedUserDoc)
          };
        }
      } catch (err: any) {
        if (err?.code === 11000 || err?.message?.includes('duplicate key')) {
          throw new Error("You've already completed today's quiz.");
        }
        console.warn('[NewsLens DB] MongoDB recordDailyQuizCompletion failed, using local store:', err);
      }
    }

    // Local in-memory / JSON fallback
    localStore.dailyCompletions.push(completion);
    const updatedUser = await this.updateUser(userId, {
      xp: (user.xp || 0) + xpEarned,
      streakDays: newStreak,
      longestStreak: newLongestStreak,
      lastCompletedDate: quizDate,
      achievements: updatedAchievements,
      quizStats: {
        attempted: (user.quizStats?.attempted || 0) + totalQuestions,
        correct: (user.quizStats?.correct || 0) + score,
        byCategory: user.quizStats?.byCategory || {}
      }
    });

    return {
      completion,
      user: updatedUser
    };
  }

  // ----------------------------------------------------
  // WEEKLY PRACTICE OPERATIONS
  // ----------------------------------------------------

  public async getWeeklyCompletion(userId: string, cycleId: string): Promise<DbWeeklyCompletion | null> {
    await this.init();

    if (this.useMongo) {
      try {
        const col = await this.getWeeklyCol();
        const completion = await col.findOne({ userId, cycleId });
        if (completion) return sanitizeDoc<DbWeeklyCompletion>(completion);
      } catch (err) {
        console.warn('[NewsLens DB] MongoDB getWeeklyCompletion failed, checking local store:', err);
      }
    }

    const comp = localStore.weeklyCompletions.find(c => c.userId === userId && c.cycleId === cycleId);
    return comp ? sanitizeDoc<DbWeeklyCompletion>(JSON.parse(JSON.stringify(comp))) : null;
  }

  public async getWeeklyStatus(userId: string, timeZone?: string) {
    await this.init();
    const cycleInfo = getWeeklyCycleInfo(new Date(), timeZone);
    const completion = await this.getWeeklyCompletion(userId, cycleInfo.cycleId);

    let history: DbWeeklyCompletion[] = [];
    if (this.useMongo) {
      try {
        const col = await this.getWeeklyCol();
        const rawHistory = await col.find({ userId }).sort({ completedAt: -1 }).toArray();
        history = rawHistory.map(h => sanitizeDoc<DbWeeklyCompletion>(h));
      } catch (err) {
        console.warn('[NewsLens DB] MongoDB getWeeklyStatus failed, checking local store:', err);
      }
    }

    if (history.length === 0) {
      history = localStore.weeklyCompletions
        .filter(c => c.userId === userId)
        .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
        .map(h => sanitizeDoc<DbWeeklyCompletion>(JSON.parse(JSON.stringify(h))));
    }

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
    await this.init();
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

    if (this.useMongo) {
      try {
        const weeklyCol = await this.getWeeklyCol();
        await weeklyCol.insertOne(completion as any);

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

        if (updatedUserDoc) {
          return {
            completion,
            user: sanitizeDoc<DbUser>(updatedUserDoc)
          };
        }
      } catch (err: any) {
        if (err?.code === 11000 || err?.message?.includes('duplicate key')) {
          throw new Error("You've already completed this week's practice.");
        }
        console.warn('[NewsLens DB] MongoDB recordWeeklyCompletion failed, saving to local store:', err);
      }
    }

    // Local fallback
    localStore.weeklyCompletions.push(completion);
    const updatedUser = await this.updateUser(userId, {
      xp: (user.xp || 0) + xpEarned,
      quizStats: {
        attempted: (user.quizStats?.attempted || 0) + totalQuestions,
        correct: (user.quizStats?.correct || 0) + score,
        byCategory: user.quizStats?.byCategory || {}
      }
    });

    return {
      completion,
      user: updatedUser
    };
  }
}

export const db = new NewsLensDatabase();
