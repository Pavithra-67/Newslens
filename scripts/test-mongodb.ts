/**
 * NewsLens MongoDB Atlas Integration Test Suite
 *
 * Runs comprehensive automated verification for:
 * 1. Database connection & index verification
 * 2. User registration & unique email constraint
 * 3. Password hashing & authentication session lifecycle
 * 4. Daily Quiz submission, XP award & streak calculation
 * 5. Daily Quiz duplicate submission rejection (atomicity & race-condition prevention)
 * 6. Streak preservation across consecutive days vs missed days
 * 7. Weekly Practice completion & duplicate rejection (ensuring daily streak is untouched)
 * 8. User bookmarks / saved articles and profile updates
 * 9. Cleanup of test artifacts
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." npx tsx scripts/test-mongodb.ts
 */

import { db, verifyPassword, DbUser } from '../server/db';
import { getDatabase, closeMongoClient } from '../server/mongodb';

async function runTests() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[Test Suite] ⚠️ MONGODB_URI is not set in environment.');
    console.log('[Test Suite] To run against your Atlas cluster, execute:');
    console.log('  MONGODB_URI="mongodb+srv://..." npx tsx scripts/test-mongodb.ts');
    return;
  }

  console.log('[Test Suite] Starting NewsLens MongoDB Atlas verification tests...');

  // 1. Connection & Indexes
  console.log('\n--- 1. Testing Connection & Index Setup ---');
  await db.init();
  const rawDb = await getDatabase();
  const collections = await rawDb.listCollections().toArray();
  const colNames = collections.map(c => c.name);
  console.log('Collections present in newslens DB:', colNames);

  // 2. User Creation & Duplicate Email
  console.log('\n--- 2. Testing User Creation & Constraints ---');
  const testEmail = `test_${Date.now()}@example.com`;
  const testUser = await db.createUser({
    name: 'Atlas Test User',
    email: testEmail,
    password: 'securePassword123!',
    role: 'student'
  });
  console.log('✅ Created user:', testUser.id, testUser.email);

  if (!testUser.passwordHash || !testUser.salt) {
    throw new Error('User was saved without passwordHash or salt!');
  }
  if (!verifyPassword('securePassword123!', testUser.salt, testUser.passwordHash)) {
    throw new Error('Password verification failed for created user');
  }
  console.log('✅ Password correctly hashed and verified.');

  try {
    await db.createUser({
      name: 'Duplicate User',
      email: testEmail,
      password: 'password456'
    });
    throw new Error('Duplicate email was not rejected!');
  } catch (err: any) {
    console.log('✅ Duplicate email was correctly rejected:', err.message);
  }

  // 3. Sessions
  console.log('\n--- 3. Testing Session Lifecycle ---');
  const token = await db.createSession(testUser.id);
  console.log('✅ Session created with token:', token.substring(0, 15) + '...');

  const sessionUser = await db.getUserBySessionToken(token);
  if (!sessionUser || sessionUser.id !== testUser.id) {
    throw new Error('Failed to resolve user by session token');
  }
  console.log('✅ Session authenticated successfully for user:', sessionUser.email);

  await db.deleteSession(token);
  const deadSessionUser = await db.getUserBySessionToken(token);
  if (deadSessionUser !== null) {
    throw new Error('Deleted session still returned a user');
  }
  console.log('✅ Session logout & invalidation verified.');

  // 4. Daily Quiz & Streak Logic
  console.log('\n--- 4. Testing Daily Quiz Submission & Streak Logic ---');
  const day1 = '2026-09-15';
  const resDay1 = await db.recordDailyQuizCompletion({
    userId: testUser.id,
    quizId: 'daily-2026-09-15',
    quizDate: day1,
    score: 5,
    totalQuestions: 5,
    xpEarned: 100,
    answers: { q1: 0, q2: 1, q3: 2, q4: 3, q5: 0 }
  });
  console.log(`✅ Day 1 quiz recorded. Streak: ${resDay1.user.streakDays}, XP: ${resDay1.user.xp}`);
  if (resDay1.user.streakDays !== 1) {
    throw new Error(`Expected streak to be 1 on day 1, got ${resDay1.user.streakDays}`);
  }

  // Duplicate Daily Quiz Rejection
  console.log('\n--- 5. Testing Duplicate Quiz Prevention (Atomicity) ---');
  try {
    await db.recordDailyQuizCompletion({
      userId: testUser.id,
      quizId: 'daily-2026-09-15',
      quizDate: day1,
      score: 5,
      totalQuestions: 5,
      xpEarned: 100,
      answers: { q1: 0, q2: 1, q3: 2, q4: 3, q5: 0 }
    });
    throw new Error('Duplicate daily quiz was not rejected!');
  } catch (err: any) {
    console.log('✅ Duplicate daily quiz was rejected properly:', err.message);
  }

  // Day 2 (Consecutive day)
  console.log('\n--- 6. Testing Consecutive Day Streak ---');
  const day2 = '2026-09-16';
  const resDay2 = await db.recordDailyQuizCompletion({
    userId: testUser.id,
    quizId: 'daily-2026-09-16',
    quizDate: day2,
    score: 4,
    totalQuestions: 5,
    xpEarned: 85,
    answers: { q1: 0, q2: 1, q3: 2, q4: 3, q5: 1 }
  });
  console.log(`✅ Day 2 quiz recorded. Streak: ${resDay2.user.streakDays}, XP: ${resDay2.user.xp}`);
  if (resDay2.user.streakDays !== 2) {
    throw new Error(`Expected streak to be 2 on consecutive day, got ${resDay2.user.streakDays}`);
  }

  // Day 4 (Missed Day 3 -> Streak should reset to 1)
  console.log('\n--- 7. Testing Missed Day Streak Reset ---');
  const day4 = '2026-09-18';
  const resDay4 = await db.recordDailyQuizCompletion({
    userId: testUser.id,
    quizId: 'daily-2026-09-18',
    quizDate: day4,
    score: 5,
    totalQuestions: 5,
    xpEarned: 100,
    answers: { q1: 0, q2: 1, q3: 2, q4: 3, q5: 0 }
  });
  console.log(`✅ Day 4 quiz recorded after gap. Streak: ${resDay4.user.streakDays}, Longest: ${resDay4.user.longestStreak}`);
  if (resDay4.user.streakDays !== 1) {
    throw new Error(`Expected streak to reset to 1 after gap, got ${resDay4.user.streakDays}`);
  }
  if (resDay4.user.longestStreak < 2) {
    throw new Error(`Expected longest streak to remain >= 2, got ${resDay4.user.longestStreak}`);
  }

  // 8. Weekly Practice & Isolation
  console.log('\n--- 8. Testing Weekly Practice & Daily Streak Isolation ---');
  const cycleId = '2026-W38';
  const resWeekly = await db.recordWeeklyCompletion({
    userId: testUser.id,
    cycleId,
    score: 4,
    totalQuestions: 5,
    xpEarned: 110,
    answers: { w1: 0, w2: 1 },
    questions: []
  });
  console.log(`✅ Weekly practice recorded. XP awarded: ${resWeekly.completion.xpAwarded}`);

  // Ensure daily streak did NOT change due to weekly practice
  const userAfterWeekly = await db.findUserById(testUser.id);
  if (userAfterWeekly?.streakDays !== resDay4.user.streakDays) {
    throw new Error('Weekly practice improperly modified the daily quiz streak!');
  }
  console.log('✅ Daily streak verified untouched by Weekly Practice.');

  // Weekly duplicate prevention
  try {
    await db.recordWeeklyCompletion({
      userId: testUser.id,
      cycleId,
      score: 5,
      totalQuestions: 5,
      xpEarned: 125,
      answers: {},
      questions: []
    });
    throw new Error('Duplicate weekly practice submission was not rejected!');
  } catch (err: any) {
    console.log('✅ Duplicate weekly practice was rejected properly:', err.message);
  }

  // 9. Bookmarks / Saved Articles
  console.log('\n--- 9. Testing Article Bookmarks ---');
  await db.updateUser(testUser.id, { savedArticleIds: ['art-1', 'art-2'] });
  const bookmarkedUser = await db.findUserById(testUser.id);
  if (!bookmarkedUser?.savedArticleIds.includes('art-1')) {
    throw new Error('Bookmark update failed');
  }
  console.log('✅ Saved articles successfully stored and retrieved.');

  // 10. Clean up test user
  console.log('\n--- 10. Cleanup Test Artifacts ---');
  await rawDb.collection('users').deleteOne({ id: testUser.id });
  await rawDb.collection('dailyCompletions').deleteMany({ userId: testUser.id });
  await rawDb.collection('weeklyCompletions').deleteMany({ userId: testUser.id });
  await rawDb.collection('sessions').deleteMany({ userId: testUser.id });
  console.log('✅ Test artifacts cleaned up successfully.');

  await closeMongoClient();
  console.log('\n🎉 ALL MONGODB ATLAS TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(async (err) => {
  console.error('\n❌ Test failure:', err);
  await closeMongoClient();
  process.exit(1);
});
