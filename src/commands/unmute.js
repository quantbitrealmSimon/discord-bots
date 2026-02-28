const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Remove timeout from a member')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to unmute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for unmuting')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction, client) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) {
            return interaction.reply({ content: '❌ Could not find that member!', ephemeral: true });
        }

        if (!target.isCommunicationDisabled()) {
            return interaction.reply({ content: '❌ This member is not muted!', ephemeral: true });
        }

        try {
            await target.timeout(null, reason);
            
            // Update database
            client.db.deactivateMute(target.id, interaction.guild.id);
            client.db.logAction('UNMUTE', target.id, interaction.guild.id, interaction.user.id, reason);
            
            // Log to channel
            await client.logger.log(interaction.guild, 'UNMUTE', {
                userId: target.id,
                username: target.user.tag,
                modId: interaction.user.id
            });

            await interaction.reply({ content: `🔊 **${target.user.tag}** has been unmuted.\n📋 Reason: ${reason}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ An error occurred while trying to unmute this member.', ephemeral: true });
        }
    }
};