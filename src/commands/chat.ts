import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { Command } from '../types';
import { aiService } from '../services/ai';
import { logger } from '../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('chat')
  .setDescription('Chat with the AI assistant')
  .addStringOption(option =>
    option
      .setName('message')
      .setDescription('Your message to the AI')
      .setRequired(true)
      .setMaxLength(2000)
  )
  .addBooleanOption(option =>
    option
      .setName('private')
      .setDescription('Reply privately (only you can see)')
      .setRequired(false)
  );

export const execute = async (interaction: ChatInputCommandInteraction, db: any) => {
  try {
    await interaction.deferReply({ ephemeral: interaction.options.getBoolean('private') || false });
    
    const message = interaction.options.getString('message', true);
    const userId = interaction.user.id;
    const guildId = interaction.guild?.id || 'dm';
    
    // Get conversation history
    const history = await db.getConversationHistory(userId, guildId);
    
    // Generate AI response
    const response = await aiService.generateResponse(message, history);
    
    // Save to database
    await db.saveMessage(userId, guildId, 'user', message);
    await db.saveMessage(userId, guildId, 'assistant', response);
    
    // Discord message limit is 2000 characters
    const trimmedResponse = response.length > 2000 
      ? response.substring(0, 1997) + '...' 
      : response;
    
    await interaction.editReply({
      content: `**🤖 AI Response:**\n${trimmedResponse}`
    });
    
    logger.info(`Chat command used by ${interaction.user.tag}`);
  } catch (error) {
    logger.error('Error in chat command:', error);
    await interaction.editReply({
      content: '❌ Sorry, I encountered an error processing your request. Please try again later.'
    });
  }
};

export default { data, execute } as Command;
