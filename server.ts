import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { MOCK_ARTICLES } from './src/data/mockArticles';
import { MOCK_DAILY_CHALLENGE, MOCK_WEEKLY_CHALLENGE } from './src/data/mockQuizzes';
import { MOCK_TOPICS } from './src/data/mockTopics';
import { Article, NewsCategory } from './src/types';
import { db, getLocalDateString, getWeeklyCycleInfo, getLevelInfo, DbUser, verifyPassword } from './server/db';
import { getGeminiClient } from './server/gemini';
import { newsService } from './server/newsService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to extract authenticated user
function getAuthUser(req: Request): DbUser | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  return db.getUserBySessionToken(token);
}

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------

// POST /api/auth/signup and /api/auth/register - Create a new user account
app.post(['/api/auth/signup', '/api/auth/register'], (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ error: 'Full name is required.' });
    return;
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'A valid email address is required.' });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    return;
  }

  try {
    const user = db.createUser({
      name: name.trim(),
      email: email.trim(),
      password
    });

    const token = db.createSession(user.id);
    const { level, levelTitle } = getLevelInfo(user.xp);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt
      },
      token,
      progress: {
        level,
        levelTitle,
        xp: user.xp,
        xpToNextLevel: 200 - (user.xp % 200),
        streakDays: user.streakDays,
        longestStreak: user.longestStreak,
        lastActiveDate: user.lastCompletedDate || new Date().toISOString().split('T')[0],
        storiesReadCount: user.storiesReadCount,
        savedArticleIds: user.savedArticleIds,
        interests: user.interests,
        explanationStyle: user.explanationStyle,
        quizStats: user.quizStats,
        predictionStats: user.predictionStats,
        achievements: user.achievements,
        readHistory: user.readHistory
      }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Signup failed' });
  }
});

// POST /api/auth/login - Log in with existing account
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  if (!verifyPassword(password, user.salt, user.passwordHash)) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const token = db.createSession(user.id);
  const { level, levelTitle } = getLevelInfo(user.xp);

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt
    },
    token,
    progress: {
      level,
      levelTitle,
      xp: user.xp,
      xpToNextLevel: 200 - (user.xp % 200),
      streakDays: user.streakDays,
      longestStreak: user.longestStreak,
      lastActiveDate: user.lastCompletedDate || new Date().toISOString().split('T')[0],
      storiesReadCount: user.storiesReadCount,
      savedArticleIds: user.savedArticleIds,
      interests: user.interests,
      explanationStyle: user.explanationStyle,
      quizStats: user.quizStats,
      predictionStats: user.predictionStats,
      achievements: user.achievements,
      readHistory: user.readHistory
    }
  });
});

// POST /api/auth/logout - Sign out and invalidate session
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    db.deleteSession(token);
  }
  res.json({ success: true });
});

// GET /api/auth/me - Validate current session and retrieve profile
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized or session expired' });
    return;
  }

  const { level, levelTitle } = getLevelInfo(user.xp);

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt
    },
    progress: {
      level,
      levelTitle,
      xp: user.xp,
      xpToNextLevel: 200 - (user.xp % 200),
      streakDays: user.streakDays,
      longestStreak: user.longestStreak,
      lastActiveDate: user.lastCompletedDate || new Date().toISOString().split('T')[0],
      storiesReadCount: user.storiesReadCount,
      savedArticleIds: user.savedArticleIds,
      interests: user.interests,
      explanationStyle: user.explanationStyle,
      quizStats: user.quizStats,
      predictionStats: user.predictionStats,
      achievements: user.achievements,
      readHistory: user.readHistory
    }
  });
});

// ----------------------------------------------------
// APPLICATION API ROUTES
// ----------------------------------------------------

app.get('/api/health', (req: Request, res: Response) => {
  const articlesList = newsService.getArticles();
  res.json({
    status: 'ok',
    appName: 'NewsLens',
    articlesCount: articlesList.length,
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY')
  });
});

// GET /api/news - list articles with filtering & search using Real News Service
app.get('/api/news', (req: Request, res: Response) => {
  const { category, search, featured } = req.query;
  const filtered = newsService.getArticles(
    typeof category === 'string' ? category : undefined,
    typeof search === 'string' ? search : undefined,
    featured === 'true'
  );

  res.json({
    articles: filtered,
    total: filtered.length
  });
});

// POST /api/news/refresh - refresh real news via Gemini with Google Search grounding
app.post('/api/news/refresh', async (req: Request, res: Response) => {
  const { category } = req.body || {};
  const result = await newsService.refreshRealNewsFromGemini(category);
  const articlesList = newsService.getArticles();
  res.json({
    ...result,
    totalArticles: articlesList.length
  });
});

// GET /api/news/:id - full article details
app.get('/api/news/:id', (req: Request, res: Response) => {
  const article = newsService.getArticleById(req.params.id);
  if (!article) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }

  // Record reading in user progress if authenticated
  const user = getAuthUser(req);
  if (user) {
    const existingRead = user.readHistory.find(h => h.articleId === article.id);
    if (!existingRead) {
      user.readHistory.unshift({
        articleId: article.id,
        timestamp: new Date().toISOString()
      });
      user.storiesReadCount += 1;
      user.xp += 5; // +5 XP for reading a new story
      db.updateUser(user.id, {
        readHistory: user.readHistory,
        storiesReadCount: user.storiesReadCount,
        xp: user.xp
      });
    }
  }

  res.json({ article });
});

// GET /api/categories - get all categories with real article count
app.get('/api/categories', (req: Request, res: Response) => {
  const categories: NewsCategory[] = [
    'India',
    'World',
    'Science & Technology',
    'Space',
    'Business',
    'Environment',
    'Sports',
    'Education'
  ];

  const allArticles = newsService.getArticles();
  const categoryStats = categories.map(cat => ({
    name: cat,
    count: allArticles.filter(a => {
      const artCat = a.category.toLowerCase();
      const targetCat = cat.toLowerCase();
      if (artCat === targetCat) return true;
      if (targetCat === 'environment' && artCat.includes('environment')) return true;
      if (targetCat === 'business' && artCat.includes('business')) return true;
      if (targetCat === 'space' && artCat === 'space') return true;
      return false;
    }).length
  }));

  res.json({ categories: categoryStats });
});

// GET /api/topics - educational topics
app.get('/api/topics', (req: Request, res: Response) => {
  res.json({ topics: MOCK_TOPICS });
});

// GET /api/quiz/daily - daily 5-question challenge
app.get('/api/quiz/daily', (req: Request, res: Response) => {
  res.json({ challenge: MOCK_DAILY_CHALLENGE });
});

// GET /api/quiz/weekly - weekly challenge for the current 7-day cycle
app.get('/api/quiz/weekly', (req: Request, res: Response) => {
  const tz = (req.query.tz as string) || undefined;
  const cycleInfo = getWeeklyCycleInfo(new Date(), tz);
  const challenge = newsService.getWeeklyPracticeChallenge(cycleInfo);

  const user = getAuthUser(req);
  if (user) {
    const completion = db.getWeeklyCompletion(user.id, cycleInfo.cycleId);
    res.json({
      challenge: {
        ...challenge,
        completed: Boolean(completion),
        score: completion ? completion.score : undefined
      },
      cycleInfo,
      completed: Boolean(completion),
      completion: completion || null
    });
    return;
  }

  res.json({
    challenge,
    cycleInfo,
    completed: false,
    completion: null
  });
});

// GET /api/quiz/weekly-status - Check 7-day cycle completion status and history
app.get('/api/quiz/weekly-status', (req: Request, res: Response) => {
  const tz = (req.query.tz as string) || undefined;
  const cycleInfo = getWeeklyCycleInfo(new Date(), tz);
  const user = getAuthUser(req);

  if (!user) {
    res.json({
      cycleId: cycleInfo.cycleId,
      cycleLabel: cycleInfo.cycleLabel,
      completed: false,
      authenticated: false,
      nextCycleDate: cycleInfo.nextCycleDateStr,
      daysRemaining: cycleInfo.daysRemaining,
      completion: null,
      history: []
    });
    return;
  }

  const status = db.getWeeklyStatus(user.id, tz);
  res.json({
    ...status,
    authenticated: true
  });
});

// POST /api/quiz/submit-weekly - Server-authoritative weekly quiz submission & 7-day cycle lock
app.post('/api/quiz/submit-weekly', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ error: 'You must be signed in to submit your Weekly Practice.' });
    return;
  }

  const { answers, tz, cycleId } = req.body;
  if (!answers || typeof answers !== 'object') {
    res.status(400).json({ error: 'Practice answers are required.' });
    return;
  }

  const cycleInfo = getWeeklyCycleInfo(new Date(), tz);
  const targetCycleId = cycleId || cycleInfo.cycleId;

  // Server-authoritative check: Has user completed this 7-day cycle?
  const existing = db.getWeeklyCompletion(user.id, targetCycleId);
  if (existing) {
    res.status(409).json({
      success: false,
      error: "You've already completed this week's practice.",
      alreadyCompleted: true,
      completion: existing
    });
    return;
  }

  const challenge = newsService.getWeeklyPracticeChallenge(cycleInfo);
  const questions = challenge.questions;

  let score = 0;
  const results = questions.map(q => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctIndex;
    if (isCorrect) score += 1;
    return {
      questionId: q.id,
      userAnswer,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  // Calculate XP (+25 XP per correct, +10 XP effort per incorrect)
  const xpEarned = (score * 25) + ((questions.length - score) * 10);

  try {
    const { completion, user: updatedUser } = db.recordWeeklyCompletion({
      userId: user.id,
      cycleId: targetCycleId,
      score,
      totalQuestions: questions.length,
      xpEarned,
      answers,
      questions
    });

    const { level, levelTitle } = getLevelInfo(updatedUser.xp);

    res.json({
      success: true,
      cycleId: targetCycleId,
      cycleLabel: cycleInfo.cycleLabel,
      score,
      totalQuestions: questions.length,
      xpAwarded: xpEarned,
      newTotalXp: updatedUser.xp,
      level,
      levelTitle,
      nextCycleDate: cycleInfo.nextCycleDateStr,
      daysRemaining: cycleInfo.daysRemaining,
      results,
      completion
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to record weekly practice completion' });
  }
});

// GET /api/quiz/daily-status - Server-side check for today's quiz completion
app.get('/api/quiz/daily-status', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const tz = (req.query.tz as string) || undefined;
  const todayDate = getLocalDateString(new Date(), tz);

  if (!user) {
    res.json({
      quizDate: todayDate,
      completed: false,
      completedToday: false,
      authenticated: false,
      streakDays: 0,
      longestStreak: 0
    });
    return;
  }

  const streakInfo = db.getUserStreakInfo(user.id, todayDate);
  const completion = db.getDailyCompletion(user.id, todayDate);

  res.json({
    quizDate: todayDate,
    completed: Boolean(completion),
    completedToday: Boolean(completion),
    authenticated: true,
    streakDays: streakInfo.currentStreak,
    longestStreak: streakInfo.longestStreak,
    completion: completion
      ? {
          quizDate: completion.quizDate,
          score: completion.score,
          totalQuestions: completion.totalQuestions,
          xpAwarded: completion.xpAwarded,
          streakDays: streakInfo.currentStreak,
          completedAt: completion.completedAt,
          answers: completion.answers
        }
      : null
  });
});

// POST /api/quiz/submit-daily - Server-authoritative daily quiz submission & streak/XP verification
app.post('/api/quiz/submit-daily', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ error: 'You must be signed in to submit the daily quiz.' });
    return;
  }

  const { answers, tz } = req.body;
  if (!answers || typeof answers !== 'object') {
    res.status(400).json({ error: 'Quiz answers are required.' });
    return;
  }

  const todayDate = getLocalDateString(new Date(), tz);

  // Server check: Has the user already completed today's quiz?
  const existingCompletion = db.getDailyCompletion(user.id, todayDate);
  if (existingCompletion) {
    res.status(409).json({
      success: false,
      error: "You've already completed today's quiz.",
      alreadyCompleted: true,
      completion: existingCompletion
    });
    return;
  }

  // Validate submitted answers against real answer keys
  const dailyQuestions = MOCK_DAILY_CHALLENGE.questions;
  let score = 0;
  const results = dailyQuestions.map(q => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctIndex;
    if (isCorrect) score += 1;
    return {
      questionId: q.id,
      userAnswer,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  // Calculate XP according to defined rules (+20 XP per correct, +5 XP effort per incorrect)
  const xpEarned = (score * 20) + ((dailyQuestions.length - score) * 5);

  try {
    const { completion, user: updatedUser } = db.recordDailyQuizCompletion({
      userId: user.id,
      quizId: MOCK_DAILY_CHALLENGE.id,
      quizDate: todayDate,
      score,
      totalQuestions: dailyQuestions.length,
      xpEarned,
      answers
    });

    const { level, levelTitle } = getLevelInfo(updatedUser.xp);

    res.json({
      success: true,
      score,
      totalQuestions: dailyQuestions.length,
      xpAwarded: xpEarned,
      streakDays: updatedUser.streakDays,
      longestStreak: updatedUser.longestStreak,
      newTotalXp: updatedUser.xp,
      level,
      levelTitle,
      quizDate: todayDate,
      results,
      completion
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to record quiz completion' });
  }
});

// POST /api/quiz/submit-answer - single practice question scoring
app.post('/api/quiz/submit-answer', (req: Request, res: Response) => {
  const { questionId, selectedIndex, category } = req.body;

  const allQuestions = [
    ...MOCK_DAILY_CHALLENGE.questions,
    ...MOCK_WEEKLY_CHALLENGE.questions
  ];
  const question = allQuestions.find(q => q.id === questionId);

  if (!question) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }

  const isCorrect = question.correctIndex === selectedIndex;
  const xpEarned = isCorrect ? 20 : 5;

  const user = getAuthUser(req);
  if (user) {
    user.xp += xpEarned;
    user.quizStats.attempted += 1;
    if (isCorrect) user.quizStats.correct += 1;

    const cat = category || question.category;
    if (!user.quizStats.byCategory[cat]) {
      user.quizStats.byCategory[cat] = { attempted: 0, correct: 0 };
    }
    user.quizStats.byCategory[cat].attempted += 1;
    if (isCorrect) user.quizStats.byCategory[cat].correct += 1;

    db.updateUser(user.id, {
      xp: user.xp,
      quizStats: user.quizStats
    });

    const { level, levelTitle } = getLevelInfo(user.xp);

    res.json({
      isCorrect,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      xpEarned,
      newTotalXp: user.xp,
      level,
      levelTitle
    });
    return;
  }

  res.json({
    isCorrect,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    xpEarned
  });
});

// POST /api/predictions/vote - record forecast
app.post('/api/predictions/vote', (req: Request, res: Response) => {
  const { predictionId, optionIndex } = req.body;
  const user = getAuthUser(req);

  const allArticles = newsService.getArticles();
  for (const article of allArticles) {
    const pred = article.predictions?.find(p => p.id === predictionId);
    if (pred) {
      if (!pred.totalVotes) {
        pred.totalVotes = pred.options.map(() => 0);
      }
      if (typeof optionIndex === 'number' && optionIndex < pred.options.length) {
        pred.totalVotes[optionIndex] = (pred.totalVotes[optionIndex] || 0) + 1;
        pred.userChoice = optionIndex;

        // Requirement 4: Forecasting questions must NOT award XP or points
        const xpEarned = 0;
        const newTotalXp = user ? user.xp : 0;

        if (user) {
          user.predictionStats.total += 1;
          db.updateUser(user.id, {
            predictionStats: user.predictionStats
          });
        }

        res.json({
          success: true,
          prediction: pred,
          xpEarned: 0,
          xpAwarded: 0,
          newTotalXp
        });
        return;
      }
    }
  }

  res.status(404).json({ error: 'Prediction item not found' });
});

// GET /api/user/profile - get complete user profile and actual DB stats
app.get('/api/user/profile', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const tz = (req.query.tz as string) || undefined;
  const todayDate = getLocalDateString(new Date(), tz);
  const streakInfo = db.getUserStreakInfo(user.id, todayDate);
  const { level, levelTitle } = getLevelInfo(user.xp);

  res.json({
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt
    },
    progress: {
      level,
      levelTitle,
      xp: user.xp,
      xpToNextLevel: 200 - (user.xp % 200),
      streakDays: streakInfo.currentStreak,
      longestStreak: streakInfo.longestStreak,
      lastActiveDate: streakInfo.lastCompletedDate || user.lastCompletedDate || todayDate,
      storiesReadCount: user.storiesReadCount,
      savedArticleIds: user.savedArticleIds,
      interests: user.interests,
      explanationStyle: user.explanationStyle,
      quizStats: user.quizStats,
      predictionStats: user.predictionStats,
      achievements: user.achievements,
      readHistory: user.readHistory
    }
  });
});

// POST /api/user/save-article - toggle bookmark in database
app.post('/api/user/save-article', (req: Request, res: Response) => {
  const { articleId } = req.body;
  if (!articleId) {
    res.status(400).json({ error: 'articleId required' });
    return;
  }

  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ error: 'Sign in to save articles.' });
    return;
  }

  const index = user.savedArticleIds.indexOf(articleId);
  let saved = false;
  if (index >= 0) {
    user.savedArticleIds.splice(index, 1);
    saved = false;
  } else {
    user.savedArticleIds.push(articleId);
    saved = true;
  }

  db.updateUser(user.id, { savedArticleIds: user.savedArticleIds });

  res.json({
    saved,
    savedArticleIds: user.savedArticleIds
  });
});

// POST /api/user/onboarding - save preferences
app.post('/api/user/onboarding', (req: Request, res: Response) => {
  const { interests, explanationStyle } = req.body;
  const user = getAuthUser(req);

  if (user) {
    if (Array.isArray(interests)) user.interests = interests;
    if (explanationStyle && ['simple', 'student', 'detailed'].includes(explanationStyle)) {
      user.explanationStyle = explanationStyle;
    }
    db.updateUser(user.id, {
      interests: user.interests,
      explanationStyle: user.explanationStyle
    });
    res.json({ success: true, progress: user });
    return;
  }

  res.json({ success: true });
});

// POST /api/admin/articles - moderation
app.post('/api/admin/articles', (req: Request, res: Response) => {
  const { articleId, isFeatured, isSensitive, category } = req.body;
  const article = newsService.getArticles().find(a => a.id === articleId);
  if (!article) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }

  if (typeof isFeatured === 'boolean') article.isFeatured = isFeatured;
  if (typeof isSensitive === 'boolean') article.isSensitive = isSensitive;
  if (category) article.category = category;

  res.json({ success: true, article });
});

// ----------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NewsLens server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

