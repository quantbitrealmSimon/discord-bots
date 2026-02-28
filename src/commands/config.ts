import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { config } from '../config';

export const data = new SlashCommandBuilder()
  .setName('config')
  .setDescription('View bot configuration (Admin only)')
  .setDefaultMemberPermissions(0x00000008); // Administrator permission

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('⚙️ Bot Configuration')
    .addFields(
      { name: 'Welcome Channel', value: `<#${config.channels.welcome}>`, inline: true },
      { name: 'Log Channel', value: config.channels.log ? `<#${config.channels.log}>` : 'Not set', inline: true },
      { name: 'Auto-Role', value: config.roles.autoRole ? `<@&${config.roles.autoRole}>` : 'Disabled', inline: true },
      { name: 'DM Welcome', value: config.features.enableDM ? '✅ Enabled' : '❌ Disabled', inline: true },
      { name: 'Environment', value: config.environment, inline: true },
      { name: '\u200B', value: '\u200B', inline: true }
    )
    .setFooter({ text: 'Edit .env file to change settings' })
    .setTimestamp();
    
  await interaction.reply({ embeds: [embed], ephemeral: true });
}