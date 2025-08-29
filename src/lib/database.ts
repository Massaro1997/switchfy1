import Database from 'better-sqlite3';
import path from 'path';

// Configurazione database
const DB_PATH = path.join(process.cwd(), 'data', 'switchfy.db');

// Inizializza database
let db: Database.Database;

try {
  // Assicurati che la directory data esista
  const fs = require('fs');
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
} catch (error) {
  console.error('Errore inizializzazione database:', error);
  throw error;
}

// Schema database
function initializeDatabase() {
  // Tabella leads
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      zip_code TEXT,
      annual_consumption INTEGER,
      current_provider TEXT,
      source TEXT,
      status TEXT DEFAULT 'new',
      priority TEXT DEFAULT 'medium',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabella quiz sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      status TEXT DEFAULT 'started',
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabella quiz answers
  db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_answers (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      step INTEGER NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES quiz_sessions(id)
    )
  `);

  // Tabella analytics events
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      session_id TEXT,
      user_id TEXT,
      page TEXT,
      source TEXT,
      zip_code TEXT,
      step INTEGER,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabella clients
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      address TEXT,
      zip_code TEXT,
      registration_source TEXT,
      status TEXT DEFAULT 'active',
      customer_since DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database inizializzato correttamente');
}

// Inizializza il database
initializeDatabase();

// Funzioni helper per generare ID
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// API per leads
export const leadsAPI = {
  // Crea lead
  create: (leadData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    zipCode?: string;
    annualConsumption?: number;
    currentProvider?: string;
    source?: string;
    notes?: string;
  }) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO leads (id, first_name, last_name, email, phone, zip_code, annual_consumption, current_provider, source, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      leadData.firstName,
      leadData.lastName,
      leadData.email,
      leadData.phone || null,
      leadData.zipCode || null,
      leadData.annualConsumption || null,
      leadData.currentProvider || null,
      leadData.source || 'website',
      leadData.notes || null
    );
    
    return { id, ...leadData };
  },

  // Ottieni tutti i leads
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM leads ORDER BY created_at DESC');
    return stmt.all();
  },

  // Ottieni lead per email
  getByEmail: (email: string) => {
    const stmt = db.prepare('SELECT * FROM leads WHERE email = ?');
    return stmt.get(email);
  },

  // Aggiorna lead
  update: (id: string, updates: any) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    const stmt = db.prepare(`
      UPDATE leads SET ${fields}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run(...values, id);
    
    const getStmt = db.prepare('SELECT * FROM leads WHERE id = ?');
    return getStmt.get(id);
  },

  // Stats
  getStats: () => {
    const total = db.prepare('SELECT COUNT(*) as count FROM leads').get() as { count: number };
    const byStatus = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM leads 
      GROUP BY status
    `).all();
    
    return {
      total: total.count,
      by_status: byStatus.reduce((acc: any, item: any) => {
        acc[item.status] = item.count;
        return acc;
      }, {})
    };
  }
};

// API per quiz
export const quizAPI = {
  // Inizia sessione
  startSession: (userId?: string) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO quiz_sessions (id, user_id)
      VALUES (?, ?)
    `);
    
    stmt.run(id, userId || null);
    
    return {
      session_id: id,
      status: 'started',
      created_at: new Date().toISOString()
    };
  },

  // Salva risposta
  saveAnswer: (answerData: {
    sessionId: string;
    step: number;
    key: string;
    value: string;
  }) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO quiz_answers (id, session_id, step, key, value)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, answerData.sessionId, answerData.step, answerData.key, answerData.value);
    
    return { id, ...answerData };
  },

  // Ottieni sessione
  getSession: (sessionId: string) => {
    const stmt = db.prepare('SELECT * FROM quiz_sessions WHERE id = ?');
    return stmt.get(sessionId);
  }
};

// API per analytics
export const analyticsAPI = {
  // Traccia evento
  track: (eventData: {
    eventType: string;
    sessionId?: string;
    userId?: string;
    metadata?: any;
  }) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO analytics_events (id, event_type, session_id, user_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      eventData.eventType,
      eventData.sessionId || null,
      eventData.userId || null,
      eventData.metadata ? JSON.stringify(eventData.metadata) : null
    );
    
    return { id, ...eventData };
  },

  // Stats
  getStats: () => {
    const total = db.prepare('SELECT COUNT(*) as count FROM analytics_events').get() as { count: number };
    
    return {
      total_events: total.count,
    };
  }
};

export default db;