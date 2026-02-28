const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class ModerationDB {
    constructor(dbPath) {
        // Ensure data directory exists
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        this.db = new Database(dbPath);
        this.init();
    }

    init() {
        // Warnings table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS warnings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                guild_id TEXT NOT NULL,
                moderator_id TEXT NOT NULL,
                reason TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Mutes table (for timed mutes)
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS mutes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                guild_id TEXT NOT NULL,
                moderator_id TEXT NOT NULL,
                ends_at DATETIME,
                reason TEXT,
                active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Mod actions log
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS mod_actions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action_type TEXT NOT NULL,
                user_id TEXT NOT NULL,
                guild_id TEXT NOT NULL,
                moderator_id TEXT NOT NULL,
                reason TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    // Warning methods
    addWarning(userId, guildId, moderatorId, reason) {
        const stmt = this.db.prepare(
            'INSERT INTO warnings (user_id, guild_id, moderator_id, reason) VALUES (?, ?, ?, ?)'
        );
        return stmt.run(userId, guildId, moderatorId, reason);
    }

    getWarnings(userId, guildId) {
        const stmt = this.db.prepare(
            'SELECT * FROM warnings WHERE user_id = ? AND guild_id = ? ORDER BY created_at DESC'
        );
        return stmt.all(userId, guildId);
    }

    getWarningCount(userId, guildId) {
        const stmt = this.db.prepare(
            'SELECT COUNT(*) as count FROM warnings WHERE user_id = ? AND guild_id = ?'
        );
        return stmt.get(userId, guildId).count;
    }

    removeWarning(warningId, guildId) {
        const stmt = this.db.prepare(
            'DELETE FROM warnings WHERE id = ? AND guild_id = ?'
        );
        return stmt.run(warningId, guildId);
    }

    clearWarnings(userId, guildId) {
        const stmt = this.db.prepare(
            'DELETE FROM warnings WHERE user_id = ? AND guild_id = ?'
        );
        return stmt.run(userId, guildId);
    }

    // Mute methods
    addMute(userId, guildId, moderatorId, endsAt, reason) {
        const stmt = this.db.prepare(
            'INSERT INTO mutes (user_id, guild_id, moderator_id, ends_at, reason) VALUES (?, ?, ?, ?, ?)'
        );
        return stmt.run(userId, guildId, moderatorId, endsAt, reason);
    }

    getActiveMutes(guildId) {
        const stmt = this.db.prepare(
            'SELECT * FROM mutes WHERE guild_id = ? AND active = 1'
        );
        return stmt.all(guildId);
    }

    deactivateMute(userId, guildId) {
        const stmt = this.db.prepare(
            'UPDATE mutes SET active = 0 WHERE user_id = ? AND guild_id = ?'
        );
        return stmt.run(userId, guildId);
    }

    // Mod action logging
    logAction(actionType, userId, guildId, moderatorId, reason) {
        const stmt = this.db.prepare(
            'INSERT INTO mod_actions (action_type, user_id, guild_id, moderator_id, reason) VALUES (?, ?, ?, ?, ?)'
        );
        return stmt.run(actionType, userId, guildId, moderatorId, reason);
    }

    getModActions(userId, guildId, limit = 10) {
        const stmt = this.db.prepare(
            'SELECT * FROM mod_actions WHERE user_id = ? AND guild_id = ? ORDER BY created_at DESC LIMIT ?'
        );
        return stmt.all(userId, guildId, limit);
    }
}

module.exports = ModerationDB;