import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Flame,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Compass,
  Zap,
  Moon,
  Sun,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingScreen: React.FC = () => {
  const { login, signup, darkMode, toggleDarkMode, articles } = useApp();

  const [authView, setAuthView] = useState<'landing' | 'signup' | 'login'>('landing');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const res = await login(trimmedEmail, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Invalid email or password.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);
    const res = await signup(trimmedName, trimmedEmail, password, role);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div
            onClick={() => {
              setAuthView('landing');
              resetForm();
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
            id="landing-logo-btn"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                NewsLens
              </span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Student Edition
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80 transition-colors cursor-pointer"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              id="landing-theme-toggle"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {authView === 'landing' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    resetForm();
                    setAuthView('login');
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  id="landing-nav-login-btn"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setAuthView('signup');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  id="landing-nav-signup-btn"
                >
                  Create an Account
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  resetForm();
                  setAuthView('landing');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                id="landing-nav-back-btn"
              >
                ← Back to Overview
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        {authView === 'landing' && (
          <div className="max-w-4xl w-full space-y-12 py-8 sm:py-12 animate-in fade-in duration-300">
            {/* Hero Section */}
            <div className="text-center space-y-5 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Current Affairs Learning</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  NEWSLENS
                </h1>
                <p className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  “Understand the news. Not just the headline.”
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
                NewsLens helps students and curious thinkers truly understand current news rather than memorizing sensational headlines.
              </p>

              {/* Two Clear Authentication Paths */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
                <button
                  onClick={() => {
                    resetForm();
                    setAuthView('signup');
                  }}
                  className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="landing-primary-signup-btn"
                >
                  <span>Create an Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    resetForm();
                    setAuthView('login');
                  }}
                  className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="landing-secondary-login-btn"
                >
                  <span>Already have an account? Log In</span>
                </button>
              </div>
            </div>

            {/* Core NewsLens Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Simple Explanations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Switch between Simple, Student, and In-Depth modes to read at the comfort level that matches your needs.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Historical & Global Context</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Timelines, key background, and multiple verified perspectives so you understand how today's event connects to history.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Why It Matters</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Direct impact analyses for students, families, society, future career paths, and sovereign economies.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Key Concepts Glossaries</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Interactive breakdowns of complex terms like Repo Rate, Semiconductor Fabs, Loss & Damage, and DPI.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Quizzes & Streaks</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Test your comprehension with 5 daily questions, build habit streaks, and level up with earned XP.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Guided Learning & Topics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Deep-dive concept guides across India, World, Science & Tech, Business, Environment, Sports, and Space.
                </p>
              </div>
            </div>

            {/* Live Stories Preview Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/10 via-slate-900/5 to-transparent border border-indigo-200/60 dark:border-indigo-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Today's Verified News Stories
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sign in or create your free account to read full interactive breakdowns
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {articles.length} stories ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {articles.slice(0, 3).map(art => (
                  <div
                    key={art.id}
                    onClick={() => {
                      resetForm();
                      setAuthView('signup');
                    }}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer space-y-1.5 shadow-2xs"
                  >
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {art.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                      {art.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {art.inSimpleWords}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Sign Up View */}
        {authView === 'signup' && (
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white pt-1">
                Create your NewsLens Account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Start your daily current affairs journey & build your knowledge streak
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Pavithra Sankari"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    id="signup-name-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    id="signup-email-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    id="signup-password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    id="signup-password-eye-btn"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-indigo-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    id="signup-confirm-password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    id="signup-confirm-password-eye-btn"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-indigo-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                id="signup-submit-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Start Learning</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setAuthView('login');
                }}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                id="signup-goto-login-btn"
              >
                Log In
              </button>
            </div>
          </div>
        )}

        {/* Dedicated Login View */}
        {authView === 'login' && (
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white pt-1">
                Log In to NewsLens
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Welcome back! Enter your credentials to sync your progress
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    id="login-email-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    id="login-password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    id="login-password-eye-btn"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-indigo-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                id="login-submit-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Log In to NewsLens</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              <span>Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setAuthView('signup');
                }}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                id="login-goto-signup-btn"
              >
                Create one
              </button>
            </div>

            {/* Quick Demo Credentials */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Test Account:</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('pavi.elangumaran3@gmail.com');
                  setPassword('password123');
                }}
                className="w-full text-left p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-indigo-600 dark:text-indigo-300 font-mono text-[11px] transition-colors cursor-pointer"
                id="login-quick-demo-btn"
              >
                Click to load demo: pavi.elangumaran3@gmail.com
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 NewsLens. Understand the news. Not just the headline.</p>
      </footer>
    </div>
  );
};
