const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Test the welcome message (Admin only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
};