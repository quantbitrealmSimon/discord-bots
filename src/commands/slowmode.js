const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set slowmode for a channel')
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('Slowmode delay in seconds (0 to disable)')
                .setMinValue(0)
                .setMaxValue(21600)
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel (default: current channel)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction, client) {
        const seconds = interaction.options.getInteger('seconds');
        const channel = interaction.options.getChannel('channel') || interaction.channel;

        try {
            await channel.setRateLimitPerUser(seconds);

            if (seconds === 0) {
                await interaction.reply({ content: `🐇 Slowmode disabled in **${channel.name}**.` });
            } else {
                const timeStr = seconds < 60 ? `${seconds}s` : seconds < 3600 ? `${Math.floor(seconds / 60)}m` : `${Math.floor(seconds / 3600)}h`;
                await interaction.reply({ content: `🐢 Slowmode set to **${timeStr}** in **${channel.name}**.` });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ An error occurred while setting slowmode.', ephemeral: true });
        }
    }
};