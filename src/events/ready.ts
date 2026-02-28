import { Client, Events as DiscordEvents } from 'discord.js';
import { logger } from '../utils/logger';
import { config } from '../config';

export const name = DiscordEvents.ClientReady;
export const once = true;

export const execute = async (client: Client) => {
  logger.info(`✅ Bot logged in as ${client.user?.tag}`);
  logger.info(`📊 Serving ${client.guilds.cache.size} servers`);
  
  // Set bot activity
  client.user?.setActivity('/help | AI Chatbot', { type: 2 }); // 2 = Listening
  
  // Register slash commands globally
  try {
    if (client.application) {
      await client.application.commands.set(
        Array.from(client.commands.values()).map(cmd => cmd.data.toJSON())
      );
      logger.info('📋 Slash commands registered globally');
    }
  } catch (error) {
    logger.error('Failed to register commands:', error);
  }
};
