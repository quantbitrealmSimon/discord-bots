import { Events, Client } from 'discord.js';
import { logger } from '../utils/logger';

export const name = Events.ClientReady;
export const once = true;

export async function execute(client: Client) {
  logger.info(`✅ Ready! Logged in as ${client.user?.tag}`);
  logger.info(`🤖 Serving ${client.guilds.cache.size} servers`);
  logger.info(`👥 Watching ${client.users.cache.size} users`);
  
  // Set bot activity
  client.user?.setActivity('/help | Welcome Bot', { type: 2 }); // 2 = Listening
}
