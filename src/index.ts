import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import { join, extname } from 'path';
import { logger } from './utils/logger';
import { loadCommands } from './services/commandLoader';

dotenv.config();

// Validate required environment variables
if (!process.env.DISCORD_TOKEN) {
  logger.error('DISCORD_TOKEN is required! Check your .env file.');
  process.exit(1);
}

// Create Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Load commands
loadCommands(client);

// Load events
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => 
  file.endsWith('.js') || file.endsWith('.ts')
);

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const event = require(filePath);
  
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Global error handlers
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);

export { client };
