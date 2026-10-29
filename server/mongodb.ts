import { MongoClient, Db } from 'mongodb';

// Local MongoDB (e.g. the one MongoDB Compass connects to) unless MONGODB_URI is set in .env
const DEFAULT_LOCAL_URI = 'mongodb://localhost:27017/mumora_db';

const MONGODB_URI = (() => {
  const envUri = (process.env.MONGODB_URI || '').trim();
  if (envUri.startsWith('mongodb://') || envUri.startsWith('mongodb+srv://')) {
    return envUri;
  }
  if (envUri) {
    console.warn('[MongoDB] MONGODB_URI must start with mongodb:// or mongodb+srv:// — using local MongoDB instead');
  }
  return DEFAULT_LOCAL_URI;
})();

// Database name comes from the URI path (".../mumora_db?..."), falling back to mumora_db
export const DB_NAME = (() => {
  const match = MONGODB_URI.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/);
  return match?.[1] || 'mumora_db';
})();

// Host part of the URI with credentials stripped, safe to log and show in the admin panel
const MONGODB_HOST = MONGODB_URI.replace(/^mongodb(?:\+srv)?:\/\//, '').split('/')[0].split('@').pop() || '';

const IS_ATLAS = MONGODB_URI.startsWith('mongodb+srv://') || MONGODB_HOST.includes('mongodb.net');

// Full URI with the password masked
const REDACTED_URI = MONGODB_URI.replace(/\/\/([^:@/]+):[^@/]+@/, '//$1:••••••••@');

export interface DatabaseStatus {
  connected: boolean;
  cluster: string;
  database: string;
  isAtlas: boolean;
  redactedUri: string;
  error?: string;
  lastChecked: string;
  outboundIp: string;
  whitelistInstruction?: string;
  stats?: {
    usersCount: number;
    pregnanciesCount: number;
    babiesCount: number;
    documentsCount: number;
    remindersCount: number;
    ticketsCount: number;
  };
}

let client: MongoClient | null = null;
let db: Db | null = null;
let isConnecting = false;
let lastError: string | null = null;
// Outbound IP for MongoDB Atlas whitelist
let cachedOutboundIp = '';

// Dynamic outbound IP detection with fast abort
async function refreshOutboundIp() {
  if (!IS_ATLAS) return;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = (await res.json()) as { ip?: string };
      if (data?.ip) {
        cachedOutboundIp = data.ip;
      }
    }
  } catch {
    // Keep fallback IP
  }
}
refreshOutboundIp();

// In-memory shadow store for seamless operation and offline resilience
const inMemoryStore: Record<string, any> = {
  users: [],
  user_partitions: {},
  support_tickets: [],
  announcements: [],
  report_logs: [],
  audit_logs: [],
};

export async function connectToMongoDB(): Promise<boolean> {
  if (db && client) {
    try {
      await db.command({ ping: 1 });
      lastError = null;
      return true;
    } catch {
      if (client) {
        await client.close().catch(() => {});
      }
      client = null;
      db = null;
    }
  }

  if (isConnecting) return false;
  isConnecting = true;

  let candidateClient: MongoClient | null = null;
  try {
    candidateClient = new MongoClient(MONGODB_URI, {
      family: 4, // IPv4 resolution
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });

    await candidateClient.connect();
    client = candidateClient;
    db = client.db(DB_NAME);
    lastError = null;
    console.log(`[MongoDB] Connected to ${IS_ATLAS ? 'Atlas' : 'MongoDB'} at ${MONGODB_HOST} (database: ${DB_NAME})`);

    // Create required indexes in background
    ensureIndexes().catch(() => {});

    isConnecting = false;
    return true;
  } catch (err: any) {
    if (candidateClient) {
      await candidateClient.close().catch(() => {});
    }
    client = null;
    db = null;

    const rawMessage = String(err?.message || err || '').trim();
    if (!IS_ATLAS) {
      lastError = `Cannot reach MongoDB at ${MONGODB_HOST}. Is MongoDB running locally? (${rawMessage})`;
    } else if (
      rawMessage.includes('SSL alert number 80') ||
      rawMessage.includes('0A000438') ||
      rawMessage.includes('tlsv1 alert') ||
      rawMessage.includes('MongoServerSelectionError')
    ) {
      lastError = `Atlas cluster network access authorization pending. Add ${cachedOutboundIp || 'this server\'s IP'} or 0.0.0.0/0 in MongoDB Atlas Network Access. Operating in local fallback mode.`;
    } else {
      lastError = rawMessage || 'Connection standby';
    }

    console.log(`[MongoDB Status] ${lastError}`);
    isConnecting = false;
    return false;
  }
}

async function ensureIndexes() {
  if (!db) return;
  try {
    await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
    await db.collection('users').createIndex({ phone: 1 }, { sparse: true });
    await db.collection('user_partitions').createIndex({ userId: 1, key: 1 }, { unique: true });
    await db.collection('support_tickets').createIndex({ ticketId: 1 });
  } catch {
    // Indexes already exist or partial
  }
}

// Gentle background reconnect worker (checks every 5 minutes to avoid tight reconnect loops)
setInterval(async () => {
  if (!db) {
    await connectToMongoDB();
  }
}, 300000);

export async function getDbStatus(): Promise<DatabaseStatus> {
  let isConnected = false;
  if (db) {
    try {
      await db.command({ ping: 1 });
      isConnected = true;
      lastError = null;
    } catch {
      isConnected = false;
      lastError = 'Atlas connection lost; reconnecting';
      if (client) {
        await client.close().catch(() => {});
      }
      client = null;
      db = null;
    }
  }

  let stats = {
    usersCount: inMemoryStore.users.length,
    pregnanciesCount: 0,
    babiesCount: 0,
    documentsCount: 0,
    remindersCount: 0,
    ticketsCount: inMemoryStore.support_tickets.length,
  };

  if (isConnected && db) {
    try {
      const [uCount, partCount, tCount] = await Promise.all([
        db.collection('users').countDocuments(),
        db.collection('user_partitions').countDocuments(),
        db.collection('support_tickets').countDocuments(),
      ]);
      stats.usersCount = uCount;
      stats.ticketsCount = tCount;
    } catch {
      // fallback
    }
  }

  return {
    connected: isConnected,
    cluster: MONGODB_HOST,
    database: DB_NAME,
    isAtlas: IS_ATLAS,
    redactedUri: REDACTED_URI,
    error: lastError || undefined,
    lastChecked: new Date().toISOString(),
    outboundIp: cachedOutboundIp,
    whitelistInstruction:
      !isConnected && IS_ATLAS
        ? `To allow this app to read and write directly to your MongoDB Atlas cluster: Open MongoDB Atlas → Security → Network Access → Click 'Add IP Address' → Select 'Allow Access from Anywhere' (0.0.0.0/0) or add IP: ${cachedOutboundIp}`
        : undefined,
    stats,
  };
}

// --- USER REPOSITORY ---
export async function dbFindUserByEmailOrPhone(identifier: string) {
  const norm = identifier.trim().toLowerCase();
  if (db) {
    try {
      const user = await db.collection('users').findOne({
        $or: [{ email: norm }, { phone: identifier.trim() }],
      });
      if (user) return user;
    } catch {
      // Memory fallback
    }
  }

  // Memory fallback
  return inMemoryStore.users.find(
    (u: any) => u.email.toLowerCase() === norm || u.phone === identifier.trim()
  );
}

export async function dbUpsertUser(user: any) {
  // Sync to memory
  const idx = inMemoryStore.users.findIndex((u: any) => u.id === user.id || u.email === user.email);
  if (idx >= 0) {
    inMemoryStore.users[idx] = { ...inMemoryStore.users[idx], ...user };
  } else {
    inMemoryStore.users.push(user);
  }

  if (db) {
    try {
      await db.collection('users').updateOne(
        { id: user.id },
        { $set: { ...user, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } catch {
      // Memory fallback preserved
    }
  }
  return user;
}

export async function dbGetAllUsers() {
  if (db) {
    try {
      const users = await db.collection('users').find().toArray();
      if (users.length > 0) return users;
    } catch {
      // Memory fallback
    }
  }
  return inMemoryStore.users;
}

// --- USER DATA PARTITIONS (Pregnancy, Babies, Documents, Reminders) ---
export async function dbSaveUserData(userId: string, key: string, payload: any) {
  const compositeKey = `${userId}::${key}`;
  inMemoryStore.user_partitions[compositeKey] = payload;

  if (db) {
    try {
      await db.collection('user_partitions').updateOne(
        { userId, key },
        {
          $set: {
            userId,
            key,
            payload,
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
    } catch {
      // Memory fallback
    }
  }
  return { success: true };
}

export async function dbGetUserData(userId: string, key: string) {
  if (db) {
    try {
      const doc = await db.collection('user_partitions').findOne({ userId, key });
      if (doc && doc.payload !== undefined) {
        return doc.payload;
      }
    } catch {
      // Memory fallback
    }
  }
  const compositeKey = `${userId}::${key}`;
  return inMemoryStore.user_partitions[compositeKey] || null;
}

// --- SUPPORT TICKETS ---
export async function dbGetTickets() {
  if (db) {
    try {
      const tickets = await db.collection('support_tickets').find().sort({ createdAt: -1 }).toArray();
      if (tickets.length > 0) return tickets;
    } catch {
      // Memory fallback
    }
  }
  return inMemoryStore.support_tickets;
}

export async function dbUpsertTicket(ticket: any) {
  const idx = inMemoryStore.support_tickets.findIndex((t: any) => t.id === ticket.id);
  if (idx >= 0) inMemoryStore.support_tickets[idx] = ticket;
  else inMemoryStore.support_tickets.unshift(ticket);

  if (db) {
    try {
      await db.collection('support_tickets').updateOne(
        { id: ticket.id },
        { $set: ticket },
        { upsert: true }
      );
    } catch {
      // Memory fallback
    }
  }
  return ticket;
}

// --- ANNOUNCEMENTS ---
export async function dbGetAnnouncements() {
  if (db) {
    try {
      const items = await db.collection('announcements').find().sort({ createdAt: -1 }).toArray();
      if (items.length > 0) return items;
    } catch {
      // Memory fallback
    }
  }
  return inMemoryStore.announcements;
}

export async function dbInsertAnnouncement(ann: any) {
  inMemoryStore.announcements.unshift(ann);
  if (db) {
    try {
      await db.collection('announcements').insertOne(ann);
    } catch {
      // Memory fallback
    }
  }
  return ann;
}
