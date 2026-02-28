const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for banning')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Days of messages to delete (0-7)')
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction, client) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const deleteDays = interaction.options.getInteger('days') || 0;

        if (!target) {
            return interaction.reply({ content: '❌ Could not find that member!', ephemeral: true });
        }

        if (!target.bannable) {
            return interaction.reply({ content: '❌ I cannot ban this member! They may have higher permissions.', ephemeral: true });
        }

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot ban yourself!', ephemeral: true });
        }

        if (target.id === client.user.id) {
            return interaction.reply({ content: '❌ Nice try, but you cannot ban me!', ephemeral: true });
        }

        try {
            await target.ban({ deleteMessageDays: deleteDays, reason: reason });
            
            // Log to database
            client.db.logAction('BAN', target.id, interaction.guild.id, interaction.user.id, reason);
            
            // Log to channel
            await client.logger.log(interaction.guild, 'BAN', {
                userId: target.id,
                username: target.user.tag,
                modId: interaction.user.id,
                reason: reason
            });

            await interaction.reply({ 
                content: `✅ **${target.user.tag}** has been banned.\n📋 Reason: ${reason}${deleteDays > 0 ? `\n🗑️ Deleted ${deleteDays} days of messages` : ''}` 
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ An error occurred while trying to ban this member.', ephemeral: true });
        }
    }
};