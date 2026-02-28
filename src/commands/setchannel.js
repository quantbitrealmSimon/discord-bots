const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Set the welcome channel (Admin only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel for welcome messages')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
};