/**
 * Explicit Data Migration Script: JSON to MongoDB Atlas
 *
 * Usage:
 *   MONGODB_URI="your_mongodb_connection_string" npx tsx scripts/migrate-json-to-mongodb.ts
 *
 * This script is strictly explicit and is NEVER executed automatically on server startup.
 */

import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const JSON_DB_PATH = path.join(process.cwd(), 'data', 'newslens_db.json');
const DB_NAME = 'newslens';

async function runMigration() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ Error: MONGODB_URI environment variable is required to run migration.');
    console.error('Example: MONGODB_URI="mongodb+srv://..." npx tsx scripts/migrate-json-to-mongodb.ts');
    process.exit(1);
  }

  if (!fs.existsSync(JSON_DB_PATH)) {
    console.error(`❌ Error: Source JSON database not found at ${JSON_DB_PATH}`);
    process.exit(1);
  }

  console.log(`[Migration] Reading source JSON file: ${JSON_DB_PATH}...`);
  const raw = fs.readFileSync(JSON_DB_PATH, 'utf-8');
  const sourceData = JSON.parse(raw);

  const users = Array.isArray(sourceData.users) ? sourceData.users : [];
  const sessions = Array.isArray(sourceData.sessions) ? sourceData.sessions : [];
  const dailyCompletions = Array.isArray(sourceData.dailyCompletions) ? sourceData.dailyCompletions : [];
  const weeklyCompletions = Array.isArray(sourceData.weeklyCompletions) ? sourceData.weeklyCompletions : [];

  console.log(`[Migration] Found in JSON: ${users.length} users, ${sessions.length} sessions, ${dailyCompletions.length} daily completions, ${weeklyCompletions.length} weekly completions.`);

  console.log('[Migration] Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(DB_NAME);

  // 1. Ensure indexes
  console.log('[Migration] Ensuring indexes...');
  await Promise.all([
    db.collection('users').createIndex({ email: 1 }, { unique: true }),
    db.collection('users').createIndex({ id: 1 }, { unique: true }),
    db.collection('sessions').createIndex({ token: 1 }, { unique: true }),
    db.collection('dailyCompletions').createIndex({ userId: 1, quizDate: 1 }, { unique: true }),
    db.collection('weeklyCompletions').createIndex({ userId: 1, cycleId: 1 }, { unique: true }),
  ]);

  // 2. Migrate users
  let migratedUsers = 0;
  for (const user of users) {
    const { _id, ...safeUser } = user;
    const res = await db.collection('users').updateOne(
      { id: user.id },
      { $set: safeUser },
      { upsert: true }
    );
    if (res.upsertedCount > 0 || res.modifiedCount > 0) migratedUsers++;
  }
  console.log(`[Migration] Users synced: ${migratedUsers}/${users.length}`);

  // 3. Migrate sessions (active only)
  let migratedSessions = 0;
  const now = Date.now();
  for (const session of sessions) {
    if (new Date(session.expiresAt).getTime() > now) {
      const { _id, ...safeSession } = session;
      const res = await db.collection('sessions').updateOne(
        { token: session.token },
        { $set: safeSession },
        { upsert: true }
      );
      if (res.upsertedCount > 0 || res.modifiedCount > 0) migratedSessions++;
    }
  }
  console.log(`[Migration] Active sessions synced: ${migratedSessions}/${sessions.length}`);

  // 4. Migrate dailyCompletions
  let migratedDaily = 0;
  for (const daily of dailyCompletions) {
    const { _id, ...safeDaily } = daily;
    const res = await db.collection('dailyCompletions').updateOne(
      { userId: daily.userId, quizDate: daily.quizDate },
      { $set: safeDaily },
      { upsert: true }
    );
    if (res.upsertedCount > 0 || res.modifiedCount > 0) migratedDaily++;
  }
  console.log(`[Migration] Daily completions synced: ${migratedDaily}/${dailyCompletions.length}`);

  // 5. Migrate weeklyCompletions
  let migratedWeekly = 0;
  for (const weekly of weeklyCompletions) {
    const { _id, ...safeWeekly } = weekly;
    const res = await db.collection('weeklyCompletions').updateOne(
      { userId: weekly.userId, cycleId: weekly.cycleId },
      { $set: safeWeekly },
      { upsert: true }
    );
    if (res.upsertedCount > 0 || res.modifiedCount > 0) migratedWeekly++;
  }
  console.log(`[Migration] Weekly completions synced: ${migratedWeekly}/${weeklyCompletions.length}`);

  await client.close();
  console.log('✅ [Migration] Migration complete. All data successfully synchronized to MongoDB Atlas.');
}

runMigration().catch(err => {
  console.error('❌ [Migration] Error during migration:', err?.message || err);
  process.exit(1);
});
