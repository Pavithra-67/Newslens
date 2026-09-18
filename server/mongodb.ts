import { MongoClient, Db, Collection, Document } from 'mongodb';

export const DB_NAME = 'newslens';

// Module-level connection cache for Express dev & serverless container reuse
let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;
let indexesInitialized = false;

/**
 * Returns a connected MongoClient instance, reusing existing connection pool.
 */
export function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    throw new Error(
      'MONGODB_URI environment variable is missing. Please configure MONGODB_URI in your environment settings.'
    );
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 20,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 4000,
    connectTimeoutMS: 5000,
  });

  cachedClient = client;
  cachedPromise = client
    .connect()
    .then((connectedClient) => {
      console.log('[MongoDB] Connected to database: newslens');
      return connectedClient;
    })
    .catch((err) => {
      // Reset cached promise on connection error so subsequent requests can retry
      cachedClient = null;
      cachedPromise = null;

      const msg = err?.message || String(err);
      if (msg.includes('SSL alert number 80') || msg.includes('tlsv1 alert internal error')) {
        console.log('[MongoDB] Notice: MongoDB Atlas requires 0.0.0.0/0 in Network Access (IP Access List).');
      } else {
        console.log('[MongoDB] Notice: Connection attempt failed, using local database mode.');
      }
      throw err;
    });

  return cachedPromise;
}

/**
 * Probes MongoDB connection without throwing or logging unhandled error traces.
 * Returns true if connected successfully, false if unavailable.
 */
export async function tryConnectMongo(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    return false;
  }

  try {
    const client = await getMongoClient();
    await client.db(DB_NAME).command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats database errors safely for client responses without exposing connection strings, credentials, or internal stack traces.
 */
export function formatDatabaseError(err: any): string {
  const msg = err?.message || String(err);
  if (msg.includes('SSL alert number 80') || msg.includes('tlsv1 alert internal error')) {
    return 'Database connection failed: MongoDB Atlas rejected the TLS handshake. Please ensure 0.0.0.0/0 is added to your MongoDB Atlas Network Access IP Whitelist.';
  }
  if (msg.includes('MONGODB_URI environment variable is missing')) {
    return 'Database configuration error: MONGODB_URI is not set in the server environment.';
  }
  if (msg.includes('duplicate key') || err?.code === 11000) {
    return 'An account with this email already exists.';
  }
  return err?.message || 'A database error occurred. Please try again later.';
}

/**
 * Returns the "newslens" MongoDB database instance.
 */
export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(DB_NAME);
}

/**
 * Returns a typed collection from the "newslens" database.
 */
export async function getCollection<T extends Document = Document>(collectionName: string): Promise<Collection<T>> {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

/**
 * Initializes required unique and lookup indexes across collections once.
 */
export async function ensureIndexes(db: Db): Promise<void> {
  if (indexesInitialized) return;

  try {
    const usersCol = db.collection('users');
    const sessionsCol = db.collection('sessions');
    const dailyCol = db.collection('dailyCompletions');
    const weeklyCol = db.collection('weeklyCompletions');

    await Promise.all([
      // 1. Users: Unique email index
      usersCol.createIndex({ email: 1 }, { unique: true, name: 'uniq_user_email' }),
      usersCol.createIndex({ id: 1 }, { unique: true, name: 'uniq_user_id' }),

      // 2. Sessions: Token index & expiry index
      sessionsCol.createIndex({ token: 1 }, { unique: true, name: 'uniq_session_token' }),
      sessionsCol.createIndex({ expiresAt: 1 }, { name: 'idx_session_expiresAt' }),

      // 3. Daily Completions: Unique compound index on userId + quizDate
      dailyCol.createIndex(
        { userId: 1, quizDate: 1 },
        { unique: true, name: 'uniq_user_daily_quiz' }
      ),

      // 4. Weekly Completions: Unique compound index on userId + cycleId
      weeklyCol.createIndex(
        { userId: 1, cycleId: 1 },
        { unique: true, name: 'uniq_user_weekly_cycle' }
      )
    ]);

    indexesInitialized = true;
    console.log('[MongoDB] Verified indexes on users, sessions, dailyCompletions, and weeklyCompletions.');
  } catch (err: any) {
    // Log server-side warning without leaking sensitive information
    console.warn('[MongoDB] Index creation warning:', err?.message || 'Failed to ensure indexes');
  }
}

/**
 * Gracefully close the MongoDB client connection (e.g. for testing or shutdown).
 */
export async function closeMongoClient(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedPromise = null;
    indexesInitialized = false;
  }
}
