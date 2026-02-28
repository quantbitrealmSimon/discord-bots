const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('View or manage warnings for a member')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to check warnings for')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('remove')
                .setDescription('Warning ID to remove (use with target)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction, client) {
        const target = interaction.options.getMember('target') || interaction.member;
        const removeId = interaction.options.getInteger('remove');

        if (removeId) {
            // Remove specific warning
            if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                return interaction.reply({ content: '❌ You need Moderate Members permission to remove warnings!', ephemeral: true });
            }
            
            const result = client.db.removeWarning(removeId, interaction.guild.id);
            if (result.changes > 0) {
                return interaction.reply({ content: `✅ Warning #${removeId} has been removed.` });
            } else {
                return interaction.reply({ content: '❌ Could not find that warning ID.', ephemeral: true });
            }
        }

        // View warnings
        const warnings = client.db.getWarnings(target.id, interaction.guild.id);
        
        if (warnings.length === 0) {
            return interaction.reply({ content: `✅ **${target.user.tag}** has no warnings.`, ephemeral: target.id === interaction.user.id });
        }

        const embed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle(`⚠️ Warnings for ${target.user.tag}`)
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Total warnings: **${warnings.length}**`)
            .setTimestamp();

        warnings.slice(0, 10).forEach((warning, index) => {
            const mod = interaction.guild.members.cache.get(warning.moderator_id);
            embed.addFields({
                name: `Warning #${warning.id} — ${new Date(warning.created_at).toLocaleDateString()}`,
                value: `**Reason:** ${warning.reason}\n**By:** ${mod ? mod.user.tag : 'Unknown'}`,
                inline: false
            });
        });

        if (warnings.length > 10) {
            embed.setFooter({ text: `Showing 10 of ${warnings.length} warnings` });
        }

        await interaction.reply({ embeds: [embed], ephemeral: target.id === interaction.user.id });
    }
};