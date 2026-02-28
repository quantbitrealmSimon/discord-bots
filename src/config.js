require('dotenv').config();

module.exports = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    defaultPrefix: process.env.DEFAULT_PREFIX || '!',
    logChannelId: process.env.LOG_CHANNEL_ID,
    mutedRoleId: process.env.MUTED_ROLE_ID,
    maxWarningsBeforeBan: parseInt(process.env.MAX_WARNINGS_BEFORE_BAN) || 3,
    autoDeleteInvites: process.env.AUTO_DELETE_INVITES === 'true',
    autoDeleteSpam: process.env.AUTO_DELETE_SPAM === 'true',
    spamThreshold: parseInt(process.env.SPAM_THRESHOLD) || 5,
    databasePath: process.env.DATABASE_PATH || './data/moderation.db'
};