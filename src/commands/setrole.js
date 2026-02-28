const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrole')
        .setDescription('Set the auto-role for new members (Admin only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to assign to new members (leave empty to disable)')
                .setRequired(false)
        ),
};