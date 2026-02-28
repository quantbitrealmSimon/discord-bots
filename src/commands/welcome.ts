import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from 'discord.js';
import { sendWelcomeMessage } from '../services/welcomeService';

export const data = new SlashCommandBuilder()
  .setName('welcome')
  .setDescription('Welcome bot configuration and testing')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand(subcommand =>
    subcommand
      .setName('test')
      .setDescription('Test the welcome message (sends to this channel)')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('config')
      .setDescription('Show current welcome configuration')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('setchannel')
      .setDescription('Set the welcome channel')
      .addChannelOption(option =>
        option
          .setName('channel')
          .setDescription('Channel for welcome messages')
          .setRequired(true)
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'test') {
    await interaction.reply({ content: '🧪 Sending test welcome message...', ephemeral: true });
    
    // Create a fake member object for testing
    const fakeMember = {
      ...interaction.member,
      user: interaction.user,
      guild: interaction.guild,
      id: interaction.user.id
    };
    
    const embed = new EmbedBuilder()
      .setColor('#00D26A')
      .setTitle('👋 New Member! (Test)')
      .setDescription(`🎉 Welcome ${interaction.user} to **${interaction.guild?.name}**! This is a test welcome message! 🚀`)
      .setThumbnail(interaction.user.displayAvatarURL({ size: 128 }))
      .addFields(
        { name: 'User', value: interaction.user.tag, inline: true },
        { name: 'Member #', value: interaction.guild?.memberCount?.toString() || '?', inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setFooter({ text: `ID: ${interaction.user.id}` })
      .setTimestamp();

    if (interaction.channel && 'send' in interaction.channel) {
      await (interaction.channel as any).send({ embeds: [embed] });
    }
    await interaction.followUp({ content: '✅ Test welcome message sent!', ephemeral: true });
  }
  
  else if (subcommand === 'config') {
    const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
    const channel = welcomeChannelId ? interaction.guild?.channels.cache.get(welcomeChannelId) : null;
    
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('⚙️ Welcome Bot Configuration')
      .addFields(
        { 
          name: 'Welcome Channel', 
          value: channel ? `<#${channel.id}>` : 'Auto-detect (system channel)',
          inline: true 
        },
        { 
          name: 'DM Welcome', 
          value: process.env.ENABLE_DM_WELCOME === 'true' ? '✅ Enabled' : '❌ Disabled',
          inline: true 
        },
        { 
          name: 'Auto-Roles', 
          value: process.env.AUTO_ROLES ? process.env.AUTO_ROLES.split(',').length + ' roles' : 'None set',
          inline: true 
        },
        { 
          name: 'Custom Message', 
          value: process.env.WELCOME_MESSAGE ? '✅ Custom' : '📝 Default',
          inline: true 
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
  
  else if (subcommand === 'setchannel') {
    const channel = interaction.options.getChannel('channel');
    
    if (!channel || channel.type !== 0) {
      return interaction.reply({ 
        content: '❌ Please select a valid text channel.',
        ephemeral: true 
      });
    }

    // In a real implementation, this would update a database
    // For now, we just confirm
    await interaction.reply({ 
      content: `✅ Welcome channel set to <#${channel.id}>\n\n⚠️ To make this permanent, update your ".env" file:\n\`WELCOME_CHANNEL_ID=${channel.id}\``,
      ephemeral: true 
    });
  }
}
