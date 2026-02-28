const { SlashCommandBuilder, PermissionFlagsBits, PermissionOverwriteManager } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock a channel to prevent members from sending messages')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to lock (default: current channel)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for locking')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction, client) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            // Lock the channel for @everyone
            await channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                { SendMessages: false },
                { reason: reason }
            );

            // Log the action
            await client.logger.log(interaction.guild, 'LOCK', {
                channelId: channel.id,
                modId: interaction.user.id
            });

            await interaction.reply({ 
                content: `🔒 **${channel.name}** has been locked.\n📋 Reason: ${reason}` 
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ An error occurred while trying to lock the channel.', ephemeral: true });
        }
    }
};