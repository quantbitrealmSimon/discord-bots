import sqlite3 from 'sqlite3';
import { logger } from '../utils/logger';
import * as path from 'path';
import * as fs from 'fs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export class Database {
  private db: sqlite3.Database | null = null;
  private dbPath: string;

  constructor() {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dbPath = path.join(dataDir, 'chatbot.db');
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          logger.error('Database connection failed:', err);
          reject(err);
        } else {
          logger.info('Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  private async createTables(): Promise<void> {
    const queries = [
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS user_preferences (
        user_id TEXT PRIMARY KEY,
        personality TEXT DEFAULT 'default',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS user_stats (
        user_id TEXT PRIMARY KEY,
        total_messages INTEGER DEFAULT 0,
        today_messages INTEGER DEFAULT 0,
        last_message_date TEXT,
        conversations INTEGER DEFAULT 0
      )`,
      `CREATE INDEX IF NOT EXISTS idx_messages_user_guild ON messages(user_id, guild_id)`,
      `CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)`
    ];

    for (const query of queries) {
      await this.run(query);
    }
  }

  private run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('Database not initialized'));
      this.db.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  private get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('Database not initialized'));
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  private all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('Database not initialized'));
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async saveMessage(userId: string, guildId: string, role: 'user' | 'assistant', content: string): Promise<void> {
    await this.run(
      'INSERT INTO messages (user_id, guild_id, role, content) VALUES (?, ?, ?, ?)',
      [userId, guildId, role, content]
    );

    // Update stats
    const today = new Date().toISOString().split('T')[0];
    await this.run(`
      INSERT INTO user_stats (user_id, total_messages, today_messages, last_message_date)
      VALUES (?, 1, 1, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        total_messages = total_messages + 1,
        today_messages = CASE 
          WHEN last_message_date = ? THEN today_messages + 1 
          ELSE 1 
        END,
        last_message_date = COALESCE(?, last_message_date)
    `, [userId, today, today, today]);
  }

  async getConversationHistory(userId: string, guildId: string, limit: number = 10): Promise<Message[]> {
    const rows = await this.all(
      `SELECT role, content, timestamp FROM messages 
       WHERE user_id = ? AND guild_id = ? 
       ORDER BY timestamp DESC LIMIT ?`,
      [userId, guildId, limit]
    );

    return rows.reverse().map((row: any) => ({
      role: row.role,
      content: row.content,
      timestamp: row.timestamp
    }));
  }

  async clearConversationHistory(userId: string, guildId: string): Promise<void> {
    await this.run(
      'DELETE FROM messages WHERE user_id = ? AND guild_id = ?',
      [userId, guildId]
    );
  }

  async setUserPreference(userId: string, key: string, value: string): Promise<void> {
    if (key === 'personality') {
      await this.run(`
        INSERT INTO user_preferences (user_id, personality)
        VALUES (?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          personality = excluded.personality,
          updated_at = CURRENT_TIMESTAMP
      `, [userId, value]);
    }
  }

  async getUserPreference(userId: string, key: string): Promise<string | null> {
    if (key === 'personality') {
      const row = await this.get(
        'SELECT personality FROM user_preferences WHERE user_id = ?',
        [userId]
      );
      return row?.personality || null;
    }
    return null;
  }

  async getUserStats(userId: string): Promise<any> {
    const row = await this.get(
      'SELECT * FROM user_stats WHERE user_id = ?',
      [userId]
    );

    return row || { totalMessages: 0, todayMessages: 0, conversations: 0 };
  }

  async close(): Promise<void> {
    if (this.db) {
      return new Promise((resolve, reject) => {
        this.db!.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }
}
