import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types';
import { logger } from '../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('View your AI chat usage statistics');

export const execute = async (interaction: ChatInputCommandInteraction, db: any) => {
  try {
    const userId = interaction.user.id;
    const stats = await db.getUserStats(userId);
    
    const personality = await db.getUserPreference(userId, 'personality') || 'default';
    
    const statsEmbed = {
      color: 0x00ff00,
      title: '📊 Your Chat Statistics',
      fields: [
        {
          name: '💬 Total Messages',
          value: `${stats.totalMessages || 0}`,
          inline: true
        },
        {
          name: '📅 Conversations',
          value: `${stats.conversations || 0}`,
          inline: true
        },
        {
          name: '🎭 Current Personality',
          value: personality.charAt(0).toUpperCase() + personality.slice(1),
          inline: true
        },
        {
          name: '📈 Daily Usage',
          value: `${stats.todayMessages || 0} / 50 messages today`,
          inline: false
        }
      ],
      footer: {
        text: 'Premium users get unlimited messages!'
      },
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [statsEmbed], ephemeral: true });
    logger.info(`Stats viewed by ${interaction.user.tag}`);
  } catch (error) {
    logger.error('Error in stats command:', error);
    await interaction.reply({
      content: '❌ Failed to load statistics. Please try again.',
      ephemeral: true
    });
  }
};

export default { data, execute } as Command;
