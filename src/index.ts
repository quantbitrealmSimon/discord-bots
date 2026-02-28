import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from './utils/logger';
import { config } from './config';
import { Database } from './database/db';
import { Command } from './types';

// Extend Client to include commands
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();

// Initialize database
const db = new Database();

async function loadCommands() {
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command: Command = await import(filePath);
    
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      logger.info(`Loaded command: ${command.data.name}`);
    } else {
      logger.warn(`Command at ${filePath} is missing required properties`);
    }
  }
}

async function loadEvents() {
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath);
    
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, db));
    } else {
      client.on(event.name, (...args) => event.execute(...args, db));
    }
    logger.info(`Loaded event: ${event.name}`);
  }
}

async function main() {
  try {
    await db.init();
    logger.info('Database initialized');
    
    await loadCommands();
    await loadEvents();
    
    await client.login(config.discord.token);
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down...');
  await db.close();
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down...');
  await db.close();
  client.destroy();
  process.exit(0);
});

main();
