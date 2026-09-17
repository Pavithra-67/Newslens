import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Article,
  DailyChallenge,
  ExplanationStyle,
  NewsCategory,
  TopicInfo,
  UserProfile,
  UserProgress,
  WeeklyChallenge,
  DailyQuizStatus,
  WeeklyQuizStatus,
  WeeklyQuizCompletion
} from '../types';
import { MOCK_DAILY_CHALLENGE, MOCK_WEEKLY_CHALLENGE } from '../data/mockQuizzes';
import { MOCK_TOPICS } from '../data/mockTopics';
import { INITIAL_USER_PROFILE, INITIAL_USER_PROGRESS } from '../data/initialUserProgress';
import { APP_CATEGORIES, matchesCategory } from '../data/categories';

interface AppContextType {
  activeTab: 'home' | 'explore' | 'challenge' | 'saved' | 'profile';
  setActiveTab: (tab: 'home' | 'explore' | 'challenge' | 'saved' | 'profile') => void;
  selectedArticleId: string | null;
  selectedArticle: Article | null;
  openArticle: (id: string) => void;
  closeArticle: () => void;
  selectedTopicId: string | null;
  selectedTopic: TopicInfo | null;
  openTopic: (id: string) => void;
  closeTopic: () => void;
  articles: Article[];
  topics: TopicInfo[];
  categories: Array<{ name: NewsCategory; count: number }>;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  userProfile: UserProfile;
  userProgress: UserProgress;
  dailyChallenge: DailyChallenge;
  weeklyChallenge: WeeklyChallenge;
  savedArticles: Article[];
  isArticleSaved: (id: string) => boolean;
  toggleSaveArticle: (id: string) => Promise<void>;
  submitQuizAnswer: (
    questionId: string,
    selectedIndex: number,
    category?: NewsCategory
  ) => Promise<{
    isCorrect: boolean;
    correctIndex: number;
    explanation: string;
    xpEarned: number;
    newTotalXp: number;
  }>;
  castPredictionVote: (
    predictionId: string,
    optionIndex: number
  ) => Promise<boolean>;
  updatePreferences: (
    interests: NewsCategory[],
    explanationStyle: ExplanationStyle
  ) => Promise<void>;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  showAdminModal: boolean;
  setShowAdminModal: (show: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  notificationMessage: string | null;
  showNotification: (msg: string) => void;

  // Authentication System
  currentUser: UserProfile | null;
  authToken: string | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role?: 'student' | 'admin') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  refreshProfile: () => Promise<void>;

  // Daily Quiz Server-authoritative state
  dailyQuizStatus: DailyQuizStatus | null;
  checkDailyQuizStatus: () => Promise<DailyQuizStatus | null>;
  submitDailyQuiz: (answers: Record<string, number>) => Promise<{
    success: boolean;
    score?: number;
    totalQuestions?: number;
    xpAwarded?: number;
    streakDays?: number;
    longestStreak?: number;
    newTotalXp?: number;
    level?: number;
    levelTitle?: string;
    results?: any;
    completion?: any;
    error?: string;
  }>;

  // Weekly Practice Server-authoritative 7-day cycle state
  weeklyQuizStatus: WeeklyQuizStatus | null;
  checkWeeklyQuizStatus: () => Promise<WeeklyQuizStatus | null>;
  submitWeeklyQuiz: (answers: Record<string, number>) => Promise<{
    success: boolean;
    score?: number;
    totalQuestions?: number;
    xpAwarded?: number;
    newTotalXp?: number;
    level?: number;
    levelTitle?: string;
    results?: any;
    completion?: any;
    error?: string;
  }>;

  // Real News Retrieval
  refreshNews: (category?: string) => Promise<{ success: boolean; count: number; error?: string }>;
  isRefreshingNews: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Helper to parse hash for routing state persistence
  const parseHash = () => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) return { tab: 'home' as const, articleId: null, topicId: null };

      if (hash.startsWith('topic/')) {
        return { tab: 'explore' as const, articleId: null, topicId: hash.replace('topic/', '') };
      }
      if (hash.startsWith('article/')) {
        return { tab: 'home' as const, articleId: hash.replace('article/', ''), topicId: null };
      }
      if (hash.startsWith('tab/')) {
        const tab = hash.replace('tab/', '') as any;
        if (['home', 'explore', 'challenge', 'saved', 'profile'].includes(tab)) {
          return { tab, articleId: null, topicId: null };
        }
      }
    } catch (e) {}
    return { tab: 'home' as const, articleId: null, topicId: null };
  };

  const initialRoute = parseHash();
  const [activeTab, setActiveTabState] = useState<'home' | 'explore' | 'challenge' | 'saved' | 'profile'>(initialRoute.tab);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(initialRoute.articleId);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(initialRoute.topicId);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [articles, setArticles] = useState<Article[]>([]);
  const [topics] = useState<TopicInfo[]>(MOCK_TOPICS);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(MOCK_DAILY_CHALLENGE);
  const [weeklyChallenge, setWeeklyChallenge] = useState<WeeklyChallenge>(MOCK_WEEKLY_CHALLENGE);
  const [weeklyQuizStatus, setWeeklyQuizStatus] = useState<WeeklyQuizStatus | null>(null);
  const [isRefreshingNews, setIsRefreshingNews] = useState<boolean>(false);

  // Authentication state
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('newslens_auth_token') || null;
  });
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // User Profile and Progress (fallback to INITIAL values for guest preview)
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('newslens_user_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user progress', e);
      }
    }
    return INITIAL_USER_PROGRESS;
  });

  // Daily Quiz Server Status
  const [dailyQuizStatus, setDailyQuizStatus] = useState<DailyQuizStatus | null>(null);

  // Centralized Theme System
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('newslens_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('newslens_onboarding_completed');
  });

  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Centralized theme setter & toggle
  const setDarkMode = useCallback((val: boolean) => {
    setDarkModeState(val);
    if (val) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('newslens_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('newslens_theme', 'light');
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  // Sync theme class on mount and change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('newslens_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('newslens_theme', 'light');
    }
  }, [darkMode]);

  // Persist local user progress for guest preview
  useEffect(() => {
    localStorage.setItem('newslens_user_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const showNotification = useCallback((msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3500);
  }, []);

  // Helper for auth headers
  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  }, [authToken]);

  // Helper to fetch today's daily quiz status from server
  const checkDailyQuizStatus = useCallback(async (): Promise<DailyQuizStatus | null> => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch(`/api/quiz/daily-status?tz=${encodeURIComponent(tz)}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data: DailyQuizStatus = await res.json();
        setDailyQuizStatus(data);
        return data;
      }
    } catch (e) {
      console.warn('Failed to fetch daily quiz status', e);
    }
    return null;
  }, [getAuthHeaders]);

  // Helper to fetch weekly quiz status & challenge from server
  const checkWeeklyQuizStatus = useCallback(async (): Promise<WeeklyQuizStatus | null> => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch(`/api/quiz/weekly?tz=${encodeURIComponent(tz)}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.challenge) setWeeklyChallenge(data.challenge);
        if (data.cycleInfo) {
          const status: WeeklyQuizStatus = {
            cycleId: data.cycleInfo.cycleId,
            cycleLabel: data.cycleInfo.cycleLabel,
            completed: Boolean(data.completed),
            authenticated: Boolean(currentUser),
            nextCycleDate: data.cycleInfo.nextCycleDateStr,
            daysRemaining: data.cycleInfo.daysRemaining,
            completion: data.completion || null
          };
          setWeeklyQuizStatus(status);
          return status;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch weekly quiz status', e);
    }
    return null;
  }, [getAuthHeaders, currentUser]);

  // Helper to refresh authoritative user profile & stats from server
  const refreshProfile = useCallback(async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/user/profile', {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setUserProfile(data.profile);
          setCurrentUser(data.profile);
        }
        if (data.progress) {
          setUserProgress(data.progress);
        }
      }
    } catch (e) {
      console.warn('Failed to refresh user profile', e);
    }
  }, [authToken, getAuthHeaders]);

  // Check auth session on startup
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('newslens_auth_token');
      if (!storedToken) {
        setAuthLoading(false);
        checkDailyQuizStatus();
        checkWeeklyQuizStatus();
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setAuthToken(storedToken);
          setCurrentUser(data.user);
          setUserProfile(data.user);
          if (data.progress) {
            setUserProgress(data.progress);
          }
          // Also fetch daily and weekly quiz statuses with auth
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          fetch(`/api/quiz/daily-status?tz=${encodeURIComponent(tz)}`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          })
            .then(r => r.json())
            .then(status => setDailyQuizStatus(status))
            .catch(() => {});

          fetch(`/api/quiz/weekly?tz=${encodeURIComponent(tz)}`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          })
            .then(r => r.json())
            .then(wData => {
              if (wData.challenge) setWeeklyChallenge(wData.challenge);
              if (wData.cycleInfo) {
                setWeeklyQuizStatus({
                  cycleId: wData.cycleInfo.cycleId,
                  cycleLabel: wData.cycleInfo.cycleLabel,
                  completed: Boolean(wData.completed),
                  authenticated: true,
                  nextCycleDate: wData.cycleInfo.nextCycleDateStr,
                  daysRemaining: wData.cycleInfo.daysRemaining,
                  completion: wData.completion || null
                });
              }
            })
            .catch(() => {});
        } else {
          // Token expired or invalid
          localStorage.removeItem('newslens_auth_token');
          setAuthToken(null);
          setCurrentUser(null);
          checkDailyQuizStatus();
          checkWeeklyQuizStatus();
        }
      } catch (e) {
        console.warn('Session verification failed', e);
      } finally {
        setAuthLoading(false);
      }
    };

    verifySession();
  }, [checkDailyQuizStatus, checkWeeklyQuizStatus]);

  // Fetch articles from API
  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});
  }, []);

  // Ensure category coverage when a category is selected
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'All') {
      fetch(`/api/news?category=${encodeURIComponent(selectedCategory)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.articles && data.articles.length > 0) {
            setArticles(prev => {
              const existingIds = new Set(prev.map(a => a.id));
              const fresh = data.articles.filter((a: Article) => !existingIds.has(a.id));
              return fresh.length > 0 ? [...prev, ...fresh] : prev;
            });
          }
        })
        .catch(() => {});
    }
  }, [selectedCategory]);

  // Auth: Login
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to sign in' };
      }

      localStorage.setItem('newslens_auth_token', data.token);
      setAuthToken(data.token);
      setCurrentUser(data.user);
      setUserProfile(data.user);
      if (data.progress) {
        setUserProgress(data.progress);
      }

      showNotification(`Welcome back, ${data.user.name.split(' ')[0]}! 🌟`);

      // Refresh daily and weekly statuses with new auth token
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      fetch(`/api/quiz/daily-status?tz=${encodeURIComponent(tz)}`, {
        headers: { Authorization: `Bearer ${data.token}` }
      })
        .then(r => r.json())
        .then(status => setDailyQuizStatus(status))
        .catch(() => {});

      checkWeeklyQuizStatus();

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error during login' };
    }
  };

  // Auth: Signup
  const signup = async (name: string, email: string, password: string, role: 'student' | 'admin' = 'student') => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create account' };
      }

      localStorage.setItem('newslens_auth_token', data.token);
      setAuthToken(data.token);
      setCurrentUser(data.user);
      setUserProfile(data.user);
      if (data.progress) {
        setUserProgress(data.progress);
      }

      showNotification(`Account created! Welcome to NewsLens, ${name.split(' ')[0]}! 🎉`);

      // Check daily and weekly statuses with new token
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      fetch(`/api/quiz/daily-status?tz=${encodeURIComponent(tz)}`, {
        headers: { Authorization: `Bearer ${data.token}` }
      })
        .then(r => r.json())
        .then(status => setDailyQuizStatus(status))
        .catch(() => {});

      checkWeeklyQuizStatus();

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error during registration' };
    }
  };

  // Auth: Logout
  const logout = async () => {
    try {
      if (authToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: getAuthHeaders()
        });
      }
    } catch (e) {
      console.warn('Logout error', e);
    } finally {
      localStorage.removeItem('newslens_auth_token');
      setAuthToken(null);
      setCurrentUser(null);
      setUserProfile(INITIAL_USER_PROFILE);
      setUserProgress(INITIAL_USER_PROGRESS);
      setDailyQuizStatus(null);
      setWeeklyQuizStatus(null);
      checkWeeklyQuizStatus();
      showNotification('Signed out successfully.');
    }
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Sync route on hashchange (browser back/forward or manual hash updates)
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseHash();
      setActiveTabState(route.tab);
      setSelectedArticleId(route.articleId);
      setSelectedTopicId(route.topicId);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setActiveTab = (tab: 'home' | 'explore' | 'challenge' | 'saved' | 'profile') => {
    setSelectedArticleId(null);
    setSelectedTopicId(null);
    setActiveTabState(tab);
    window.location.hash = `tab/${tab}`;
  };

  const openArticle = (id: string) => {
    setSelectedArticleId(id);
    setSelectedTopicId(null);
    window.location.hash = `article/${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track read story with auth if available and retrieve full enriched payload
    fetch(`/api/news/${id}`, {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.article) {
          setArticles(prev => prev.map(a => a.id === id ? { ...a, ...data.article } : a));
        }
      })
      .catch(() => {});

    setUserProgress(prev => {
      const alreadyRead = prev.readHistory.some(h => h.articleId === id);
      if (alreadyRead) return prev;
      return {
        ...prev,
        storiesReadCount: prev.storiesReadCount + 1,
        xp: prev.xp + 5,
        readHistory: [{ articleId: id, timestamp: new Date().toISOString() }, ...prev.readHistory]
      };
    });
  };

  const closeArticle = () => {
    setSelectedArticleId(null);
    window.location.hash = `tab/${activeTab}`;
  };

  const openTopic = (id: string) => {
    setSelectedTopicId(id);
    setSelectedArticleId(null);
    window.location.hash = `topic/${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeTopic = () => {
    setSelectedTopicId(null);
    window.location.hash = `tab/explore`;
  };

  const selectedArticle = selectedArticleId
    ? articles.find(a => a.id === selectedArticleId) || null
    : null;

  const selectedTopic = selectedTopicId
    ? topics.find(t => t.id === selectedTopicId) || null
    : null;

  const isArticleSaved = (id: string) => {
    return userProgress.savedArticleIds.includes(id);
  };

  const toggleSaveArticle = async (id: string) => {
    const isSaved = isArticleSaved(id);
    setUserProgress(prev => {
      const newSaved = isSaved
        ? prev.savedArticleIds.filter(item => item !== id)
        : [...prev.savedArticleIds, id];
      return { ...prev, savedArticleIds: newSaved };
    });

    showNotification(isSaved ? 'Story removed from saved items' : 'Story saved to your reading list 🔖');

    try {
      await fetch('/api/user/save-article', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ articleId: id })
      });
    } catch (e) {
      console.warn('Could not sync save state to server', e);
    }
  };

  // Submit practice/single question answer
  const submitQuizAnswer = async (
    questionId: string,
    selectedIndex: number,
    category?: NewsCategory
  ) => {
    try {
      const res = await fetch('/api/quiz/submit-answer', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ questionId, selectedIndex, category })
      });
      if (res.ok) {
        const data = await res.json();
        setUserProgress(prev => ({
          ...prev,
          xp: data.newTotalXp || (prev.xp + (data.xpEarned || 5)),
          level: data.level || prev.level,
          levelTitle: data.levelTitle || prev.levelTitle
        }));
        return data;
      }
    } catch (e) {
      console.warn('Quiz API fallback triggered', e);
    }

    // Client fallback
    const allQ = [...dailyChallenge.questions, ...weeklyChallenge.questions];
    const q = allQ.find(item => item.id === questionId);
    const isCorrect = q ? q.correctIndex === selectedIndex : false;
    const xpEarned = isCorrect ? 20 : 5;

    setUserProgress(prev => ({
      ...prev,
      xp: prev.xp + xpEarned,
      quizStats: {
        ...prev.quizStats,
        attempted: prev.quizStats.attempted + 1,
        correct: prev.quizStats.correct + (isCorrect ? 1 : 0),
        byCategory: {
          ...prev.quizStats.byCategory,
          [category || 'Science & Technology']: {
            attempted: (prev.quizStats.byCategory[category || 'Science & Technology']?.attempted || 0) + 1,
            correct: (prev.quizStats.byCategory[category || 'Science & Technology']?.correct || 0) + (isCorrect ? 1 : 0)
          }
        }
      }
    }));

    return {
      isCorrect,
      correctIndex: q?.correctIndex ?? 0,
      explanation: q?.explanation ?? 'Well done for testing your knowledge!',
      xpEarned,
      newTotalXp: userProgress.xp + xpEarned
    };
  };

  // Submit authoritative daily quiz to server
  const submitDailyQuiz = async (answers: Record<string, number>) => {
    if (!currentUser && !authToken) {
      openAuthModal('login');
      return { success: false, error: 'Please sign in to record your daily quiz completion and maintain your streak.' };
    }

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch('/api/quiz/submit-daily', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ answers, tz })
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          // Already completed today
          setDailyQuizStatus({
            quizDate: data.completion?.quizDate || '',
            completed: true,
            authenticated: true,
            completion: data.completion
          });
        }
        return { success: false, error: data.error || 'Quiz submission failed' };
      }

      // Update state with server response
      setDailyQuizStatus({
        quizDate: data.quizDate,
        completed: true,
        authenticated: true,
        completion: data.completion
      });

      setUserProgress(prev => ({
        ...prev,
        xp: data.newTotalXp,
        level: data.level,
        levelTitle: data.levelTitle,
        streakDays: data.streakDays,
        longestStreak: data.longestStreak ?? Math.max(prev.longestStreak || 0, data.streakDays),
        lastActiveDate: data.quizDate
      }));

      showNotification(`Daily Challenge submitted! +${data.xpAwarded} XP • ${data.streakDays}-Day Streak! 🔥`);

      return {
        success: true,
        score: data.score,
        totalQuestions: data.totalQuestions,
        xpAwarded: data.xpAwarded,
        streakDays: data.streakDays,
        longestStreak: data.longestStreak,
        newTotalXp: data.newTotalXp,
        level: data.level,
        levelTitle: data.levelTitle,
        results: data.results,
        completion: data.completion
      };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to submit quiz to server' };
    }
  };

  // Weekly Practice 7-day cycle submission
  const submitWeeklyQuiz = async (answers: Record<string, number>) => {
    if (!currentUser && !authToken) {
      openAuthModal('login');
      return { success: false, error: 'Please sign in to record your Weekly Practice completion.' };
    }

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch('/api/quiz/submit-weekly', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ answers, tz, cycleId: weeklyQuizStatus?.cycleId })
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setWeeklyQuizStatus(prev => prev ? ({
            ...prev,
            completed: true,
            completion: data.completion
          }) : null);
        }
        return { success: false, error: data.error || 'Weekly Practice submission failed' };
      }

      setWeeklyQuizStatus(prev => ({
        cycleId: data.cycleId,
        cycleLabel: data.cycleLabel,
        completed: true,
        authenticated: true,
        nextCycleDate: data.nextCycleDate,
        daysRemaining: data.daysRemaining,
        completion: data.completion,
        history: [data.completion, ...(prev?.history || [])]
      }));

      setUserProgress(prev => ({
        ...prev,
        xp: data.newTotalXp,
        level: data.level,
        levelTitle: data.levelTitle
      }));

      showNotification(`Weekly Practice completed! +${data.xpAwarded} XP awarded 🎯`);

      return {
        success: true,
        score: data.score,
        totalQuestions: data.totalQuestions,
        xpAwarded: data.xpAwarded,
        newTotalXp: data.newTotalXp,
        level: data.level,
        levelTitle: data.levelTitle,
        results: data.results,
        completion: data.completion
      };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to submit weekly practice' };
    }
  };

  // Refresh Real-Time News via NewsAPI + on-demand Gemini
  const refreshNews = async (category?: string) => {
    setIsRefreshingNews(true);
    try {
      const res = await fetch('/api/news/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ category })
      });
      const data = await res.json();
      const newsRes = await fetch('/api/news');
      const newsData = await newsRes.json();
      if (newsData.articles) {
        setArticles(newsData.articles);
      }
      checkWeeklyQuizStatus();
      showNotification(`Synced ${newsData.articles?.length || data.count || 0} real news stories from NewsAPI! 🌐`);
      return { success: true, count: newsData.articles?.length || 0 };
    } catch (e: any) {
      showNotification('Could not sync fresh news right now. Showing cached coverage.', 'info');
      return { success: false, count: articles.length, error: e.message };
    } finally {
      setIsRefreshingNews(false);
    }
  };

  const castPredictionVote = async (predictionId: string, optionIndex: number) => {
    try {
      const res = await fetch('/api/predictions/vote', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ predictionId, optionIndex })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.prediction) {
          setArticles(prev =>
            prev.map(art => {
              if (!art.predictions) return art;
              return {
                ...art,
                predictions: art.predictions.map(p => (p.id === predictionId ? data.prediction : p))
              };
            })
          );
        }
        setUserProgress(prev => ({
          ...prev,
          xp: data.newTotalXp,
          predictionStats: {
            ...prev.predictionStats,
            total: prev.predictionStats.total + 1
          }
        }));
        showNotification('Forecast submitted! Prediction stats updated 🔮');
        return true;
      }
    } catch (e) {
      console.warn('Prediction API fallback', e);
    }

    // Local fallback - Requirement 4: Forecasting questions must NOT award XP or points
    setArticles(prev =>
      prev.map(art => {
        if (!art.predictions) return art;
        return {
          ...art,
          predictions: art.predictions.map(p => {
            if (p.id !== predictionId) return p;
            const updatedVotes = [...(p.totalVotes || p.options.map(() => 0))];
            updatedVotes[optionIndex] = (updatedVotes[optionIndex] || 0) + 1;
            return {
              ...p,
              userChoice: optionIndex,
              totalVotes: updatedVotes
            };
          })
        };
      })
    );

    setUserProgress(prev => ({
      ...prev,
      predictionStats: { ...prev.predictionStats, total: prev.predictionStats.total + 1 }
    }));
    showNotification('Forecast submitted! Prediction stats updated 🔮');
    return true;
  };

  const updatePreferences = async (
    interests: NewsCategory[],
    explanationStyle: ExplanationStyle
  ) => {
    setUserProgress(prev => ({
      ...prev,
      interests,
      explanationStyle
    }));
    localStorage.setItem('newslens_onboarding_completed', 'true');
    setShowOnboarding(false);

    try {
      await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ interests, explanationStyle })
      });
    } catch (e) {}

    showNotification('Preferences saved! Your feed is tailored for you.');
  };

  const savedArticles = articles.filter(a => userProgress.savedArticleIds.includes(a.id));

  const categories: Array<{ name: NewsCategory; count: number }> = APP_CATEGORIES.map(cat => ({
    name: cat,
    count: articles.filter(a => matchesCategory(a.category, cat)).length
  }));

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedArticleId,
        selectedArticle,
        openArticle,
        closeArticle,
        selectedTopicId,
        selectedTopic,
        openTopic,
        closeTopic,
        articles,
        topics,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        userProfile,
        userProgress,
        dailyChallenge,
        weeklyChallenge,
        savedArticles,
        isArticleSaved,
        toggleSaveArticle,
        submitQuizAnswer,
        castPredictionVote,
        updatePreferences,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        showOnboarding,
        setShowOnboarding,
        showAdminModal,
        setShowAdminModal,
        showSettingsModal,
        setShowSettingsModal,
        notificationMessage,
        showNotification,

        // Auth
        currentUser,
        authToken,
        authLoading,
        login,
        signup,
        logout,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        refreshProfile,

        // Daily Quiz
        dailyQuizStatus,
        checkDailyQuizStatus,
        submitDailyQuiz,

        // Weekly Practice 7-Day Cycle
        weeklyQuizStatus,
        checkWeeklyQuizStatus,
        submitWeeklyQuiz,

        // Real News Refresh
        refreshNews,
        isRefreshingNews
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
