const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kicking')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction, client) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) {
            return interaction.reply({ content: '❌ Could not find that member!', ephemeral: true });
        }

        if (!target.kickable) {
            return interaction.reply({ content: '❌ I cannot kick this member! They may have higher permissions.', ephemeral: true });
        }

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot kick yourself!', ephemeral: true });
        }

        if (target.id === client.user.id) {
            return interaction.reply({ content: '❌ You cannot kick me!', ephemeral: true });
        }

        try {
            await target.kick(reason);
            
            // Log to database
            client.db.logAction('KICK', target.id, interaction.guild.id, interaction.user.id, reason);
            
            // Log to channel
            await client.logger.log(interaction.guild, 'KICK', {
                userId: target.id,
                username: target.user.tag,
                modId: interaction.user.id,
                reason: reason
            });

            await interaction.reply({ content: `✅ **${target.user.tag}** has been kicked.\n📋 Reason: ${reason}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ An error occurred while trying to kick this member.', ephemeral: true });
        }
    }
};