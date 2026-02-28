import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types';
import { logger } from '../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Get help with the bot');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const helpEmbed = {
    color: 0x0099ff,
    title: '🤖 QuantZen AI Chatbot',
    description: 'Your intelligent Discord companion powered by advanced AI.',
    fields: [
      {
        name: '📝 Commands',
        value: `
**\`/chat <message>\`** - Chat with the AI
• Add \`private:true\` for confidential responses
• Supports up to 2000 characters per message

**\`/personality <style>\`** - Set your AI personality
• Options: default, professional, creative, friendly, sarcastic

**\`/clear\`** - Clear your conversation history

**\`/stats\`** - View your usage statistics

**\`/help\`** - Show this help message
        `.trim()
      },
      {
        name: '✨ Features',
        value: `
• 💬 Natural AI conversations with memory
• 🔒 Private mode for sensitive queries
• 🎭 Customizable AI personalities
• 📊 Usage tracking and analytics
• ⚡ Fast responses powered by GPT-4
        `.trim()
      },
      {
        name: '💎 Premium (Coming Soon)',
        value: `
• Unlimited messages (free: 50/day)
• Image generation
• Custom knowledge base
• Priority support
• API access
        `.trim()
      },
      {
        name: '🔗 Links',
        value: '[GitHub](https://github.com/quantbitrealmSimon/discord-bots) • [Support](https://discord.gg/quantzen) • [Invite Bot](https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2147485696&scope=bot%20applications.commands)'
      }
    ],
    footer: {
      text: 'Built by QuantBitRealm • Version 1.0.0'
    },
    timestamp: new Date().toISOString()
  };

  await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
  logger.info(`Help command used by ${interaction.user.tag}`);
};

export default { data, execute } as Command;
