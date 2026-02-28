import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check if the bot is online and responsive')
  .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);

export async function execute(interaction: ChatInputCommandInteraction) {
  const sent = await interaction.reply({ 
    content: '🏓 Pong!',
    fetchReply: true 
  });
  
  const latency = sent.createdTimestamp - interaction.createdTimestamp;
  const apiLatency = Math.round(interaction.client.ws.ping);
  
  await interaction.editReply(
    `🏓 **Pong!**\n` +
    `⏱️ Bot Latency: \`${latency}ms\`\n` +
    `💓 API Latency: \`${apiLatency}ms\``
  );
}
