import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types';
import { logger } from '../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('personality')
  .setDescription('Set your AI personality style')
  .addStringOption(option =>
    option
      .setName('style')
      .setDescription('Choose your AI personality')
      .setRequired(true)
      .addChoices(
        { name: '🎯 Default - Balanced and helpful', value: 'default' },
        { name: '💼 Professional - Formal and precise', value: 'professional' },
        { name: '🎨 Creative - Imaginative and artistic', value: 'creative' },
        { name: '😊 Friendly - Warm and casual', value: 'friendly' },
        { name: '😏 Sarcastic - Witty and playful', value: 'sarcastic' },
        { name: '🧠 Expert - Technical and detailed', value: 'expert' }
      )
  );

const personalities: Record<string, string> = {
  default: 'You are a helpful, friendly AI assistant. Be concise but informative.',
  professional: 'You are a professional business assistant. Be formal, precise, and focus on practical solutions.',
  creative: 'You are a creative companion with a vivid imagination. Be expressive, inspiring, and think outside the box.',
  friendly: 'You are a casual, warm friend. Use emojis, be supportive, and chat like a real person.',
  sarcastic: 'You are a witty assistant with a playful, sarcastic tone. Be clever but not mean-spirited.',
  expert: 'You are a technical expert. Provide detailed, accurate information with examples where helpful.'
};

export const execute = async (interaction: ChatInputCommandInteraction, db: any) => {
  try {
    const style = interaction.options.getString('style', true);
    const userId = interaction.user.id;
    
    await db.setUserPreference(userId, 'personality', style);
    
    const styleEmojis: Record<string, string> = {
      default: '🎯',
      professional: '💼',
      creative: '🎨',
      friendly: '😊',
      sarcastic: '😏',
      expert: '🧠'
    };
    
    await interaction.reply({
      content: `${styleEmojis[style]} Personality set to **${style}**! This will apply to your future conversations.`,
      ephemeral: true
    });
    
    logger.info(`Personality changed to ${style} by ${interaction.user.tag}`);
  } catch (error) {
    logger.error('Error in personality command:', error);
    await interaction.reply({
      content: '❌ Failed to set personality. Please try again.',
      ephemeral: true
    });
  }
};

export default { data, execute } as Command;
