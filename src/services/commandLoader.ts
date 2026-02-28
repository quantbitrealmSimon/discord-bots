import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { logger } from '../utils/logger';

// Extend Client type to include commands
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>;
  }
}

export function loadCommands(client: Client): void {
  const commandsPath = join(__dirname, '..', 'commands');
  
  // Initialize commands collection
  client.commands = new Collection();
  
  try {
    const commandFiles = readdirSync(commandsPath).filter(file =>
      file.endsWith('.js') || file.endsWith('.ts')
    );

    for (const file of commandFiles) {
      const filePath = join(commandsPath, file);
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        logger.info(`Loaded command: ${command.data.name}`);
      } else {
        logger.warn(`Command ${file} is missing required properties`);
      }
    }
  } catch (error) {
    logger.error('Error loading commands:', error);
  }
}
