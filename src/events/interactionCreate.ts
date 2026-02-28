import { Events as DiscordEvents, Interaction } from 'discord.js';
import { logger } from '../utils/logger';

export const name = DiscordEvents.InteractionCreate;
export const once = false;

export const execute = async (interaction: Interaction, db: any) => {
  if (!interaction.isChatInputCommand()) return;

  const command = (interaction.client as any).commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`No command matching ${interaction.commandName} was found`);
    return;
  }

  try {
    await command.execute(interaction, db);
  } catch (error) {
    logger.error(`Error executing ${interaction.commandName}:`, error);
    
    const errorMessage = '❌ There was an error executing this command!';
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
};
