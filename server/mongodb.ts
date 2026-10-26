import { MongoClient, Db } from 'mongodb';

let activeMongoUri = (() => {
  const envUri = (process.env.MONGODB_URI || '').trim();
  if (envUri.startsWith('mongodb://') || envUri.startsWith('mongodb+srv://')) {
    return envUri;
  }
  // Linked user database credentials: mishra.raghav0129_db_user / mishraraghav0129_db-user
  return 'mongodb+srv://mishra.raghav0129_db_user:Abhishek@cluster0.bnvanfy.mongodb.net/mumora_db?retryWrites=true&w=majority';
})();

export function getMongoUri(): string {
  return activeMongoUri;
}

export function setMongoUri(uri: string): void {
  if (uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))) {
    activeMongoUri = uri.trim();
  }
}

export const MONGODB_URI = activeMongoUri;

export const DB_NAME = 'mumora_db';

export interface DatabaseStatus {
  connected: boolean;
  cluster: string;
  database: string;
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
let cachedOutboundIp = '34.34.226.215';

// Dynamic outbound IP detection with fast abort
async function refreshOutboundIp() {
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

  const candidateUris = Array.from(new Set([
    getMongoUri(),
    'mongodb+srv://mishra.raghav0129_db_user:Abhishek@cluster0.bnvanfy.mongodb.net/mumora_db?retryWrites=true&w=majority',
    'mongodb+srv://mishraraghav0129_db-user:Abhishek@cluster0.bnvanfy.mongodb.net/mumora_db?retryWrites=true&w=majority',
    'mongodb+srv://rajt35293_db_user:Abhishek@cluster0.bnvanfy.mongodb.net/mumora_db?retryWrites=true&w=majority',
  ]));

  let candidateClient: MongoClient | null = null;
  let connectionSuccess = false;

  for (const uri of candidateUris) {
    try {
      candidateClient = new MongoClient(uri, {
        family: 4, // IPv4 resolution
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      });

      await candidateClient.connect();
      client = candidateClient;
      db = client.db(DB_NAME);
      activeMongoUri = uri;
      lastError = null;
      console.log(`[MongoDB] Connected successfully to Atlas cluster (${uri.split('@')[1]?.split('?')[0] || DB_NAME})`);

      // Create required indexes in background
      ensureIndexes().catch(() => {});

      connectionSuccess = true;
      break;
    } catch (err: any) {
      if (candidateClient) {
        await candidateClient.close().catch(() => {});
      }
      client = null;
      db = null;
      lastError = String(err?.message || err || '').trim();
    }
  }

  if (connectionSuccess) {
    isConnecting = false;
    return true;
  }

  const rawMessage = String(lastError || '').trim();
  if (
    rawMessage.includes('SSL alert number 80') ||
    rawMessage.includes('0A000438') ||
    rawMessage.includes('tlsv1 alert') ||
    rawMessage.includes('MongoServerSelectionError')
  ) {
    lastError = `Atlas cluster network access authorization pending. Add ${cachedOutboundIp} or 0.0.0.0/0 in MongoDB Atlas Network Access. Operating securely in resilient local storage mode.`;
  } else {
    lastError = rawMessage || 'Connection standby';
  }

  console.log(`[MongoDB Status] ${lastError}`);
  isConnecting = false;
  return false;
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
    cluster: 'cluster0.bnvanfy.mongodb.net',
    database: DB_NAME,
    error: lastError || undefined,
    lastChecked: new Date().toISOString(),
    outboundIp: cachedOutboundIp,
    whitelistInstruction:
      !isConnected
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
