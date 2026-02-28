const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modlogs')
        .setDescription('View moderation history for a member')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to check history for')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction, client) {
        const target = interaction.options.getUser('target');
        
        const actions = client.db.getModActions(target.id, interaction.guild.id, 15);
        
        if (actions.length === 0) {
            return interaction.reply({ content: `✅ No moderation history found for **${target.tag}**.`, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle(`📋 Moderation History: ${target.tag}`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        actions.forEach(action => {
            const mod = interaction.guild.members.cache.get(action.moderator_id);
            const emoji = {
                'KICK': '👢',
                'BAN': '🔨',
                'UNBAN': '🔓',
                'MUTE': '🔇',
                'UNMUTE': '🔊',
                'WARN': '⚠️',
                'AUTO_BAN': '🔨'
            }[action.action_type] || '📝';

            embed.addFields({
                name: `${emoji} ${action.action_type} — ${new Date(action.created_at).toLocaleDateString()}`,
                value: `**Reason:** ${action.reason || 'N/A'}\n**By:** ${mod ? mod.user.tag : 'Unknown'}`,
                inline: false
            });
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};