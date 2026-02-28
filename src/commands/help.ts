import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show help information about the Welcome Bot')
  .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('🤖 Welcome Bot Help')
    .setDescription('Welcome Bot automatically greets new members when they join your server!')
    .addFields(
      { 
        name: '📋 Available Commands',
        value: '`/ping` - Check bot latency\n`/help` - Show this help message\n`/welcome test` - Test welcome message (Admin only)\n`/welcome config` - View current configuration'
      },
      { 
        name: '✨ Features',
        value: '• Automatic welcome messages in designated channel\n• Member count tracking\n• Rich embed formatting\n• Goodbye messages when members leave\n• Account creation timestamp\n• Configurable custom messages'
      },
      { 
        name: '🚀 Premium Features',
        value: '• DM welcome messages to new members\n• Auto-role assignment on join\n• Custom welcome message templates\n• Analytics dashboard'
      },
      { 
        name: '⚙️ Configuration',
        value: 'Set `WELCOME_CHANNEL_ID` in your .env file or let the bot auto-detect the system channel.'
      }
    )
    .setFooter({ text: 'Welcome Bot v1.0.0 | QuantBitRealm' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
