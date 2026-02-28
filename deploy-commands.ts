import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';
import { logger } from './src/utils/logger';

dotenv.config();

const commands: any[] = [];
const commandsPath = join(__dirname, 'src', 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => 
  file.endsWith('.js') || file.endsWith('.ts')
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
    logger.info(`Prepared command: ${command.data.name}`);
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    logger.info(`🔄 Started refreshing ${commands.length} application (/) commands.`);

    if (process.env.GUILD_ID) {
      // Guild-specific commands (instant update for testing)
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID),
        { body: commands }
      );
      logger.info(`✅ Successfully reloaded guild commands for guild ${process.env.GUILD_ID}.`);
    } else {
      // Global commands (can take up to 1 hour to propagate)
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID!),
        { body: commands }
      );
      logger.info('✅ Successfully reloaded global application (/) commands.');
    }
  } catch (error) {
    logger.error('Error deploying commands:', error);
  }
})();
