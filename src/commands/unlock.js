const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock a channel to allow members to send messages')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to unlock (default: current channel)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction, client) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;

        try {
            // Unlock the channel for @everyone
            await channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                { SendMessages: null }
            );

            // Log the action
            await client.logger.log(interaction.guild, 'UNLOCK', {
                channelId: channel.id,
                modId: interaction.user.id
            });

            await interaction.reply({ content: `🔓 **${channel.name}** has been unlocked.` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ An error occurred while trying to unlock the channel.', ephemeral: true });
        }
    }
};