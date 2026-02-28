import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types';
import { logger } from '../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear your conversation history with the AI');

export const execute = async (interaction: ChatInputCommandInteraction, db: any) => {
  try {
    const userId = interaction.user.id;
    const guildId = interaction.guild?.id || 'dm';
    
    await db.clearConversationHistory(userId, guildId);
    
    await interaction.reply({
      content: '🗑️ Your conversation history has been cleared. Starting fresh!',
      ephemeral: true
    });
    
    logger.info(`History cleared by ${interaction.user.tag}`);
  } catch (error) {
    logger.error('Error in clear command:', error);
    await interaction.reply({
      content: '❌ Failed to clear history. Please try again.',
      ephemeral: true
    });
  }
};

export default { data, execute } as Command;
