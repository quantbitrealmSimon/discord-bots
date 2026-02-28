const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for unbanning')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction, client) {
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            await interaction.guild.members.unban(userId, reason);
            
            // Log to database
            client.db.logAction('UNBAN', userId, interaction.guild.id, interaction.user.id, reason);
            
            // Log to channel
            await client.logger.log(interaction.guild, 'UNBAN', {
                userId: userId,
                modId: interaction.user.id
            });

            await interaction.reply({ content: `✅ User with ID **${userId}** has been unbanned.\n📋 Reason: ${reason}` });
        } catch (error) {
            if (error.code === 10026) {
                await interaction.reply({ content: '❌ This user is not banned!', ephemeral: true });
            } else {
                console.error(error);
                await interaction.reply({ content: '❌ An error occurred while trying to unban this user.', ephemeral: true });
            }
        }
    }
};