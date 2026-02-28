const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Timeout/mute a member')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to mute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration (e.g., 1h, 30m, 1d)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for muting')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction, client) {
        const target = interaction.options.getMember('target');
        const durationStr = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) {
            return interaction.reply({ content: '❌ Could not find that member!', ephemeral: true });
        }

        if (!target.moderatable) {
            return interaction.reply({ content: '❌ I cannot mute this member! They may have higher permissions.', ephemeral: true });
        }

        // Parse duration
        const durationMs = parseDuration(durationStr);
        if (!durationMs || durationMs > 2419200000) { // Max 28 days
            return interaction.reply({ content: '❌ Invalid duration! Use format like: 1h, 30m, 1d, 7d (max 28 days)', ephemeral: true });
        }

        try {
            await target.timeout(durationMs, reason);
            
            const endsAt = new Date(Date.now() + durationMs);
            
            // Log to database
            client.db.addMute(target.id, interaction.guild.id, interaction.user.id, endsAt.toISOString(), reason);
            client.db.logAction('MUTE', target.id, interaction.guild.id, interaction.user.id, reason);
            
            // Log to channel
            await client.logger.log(interaction.guild, 'MUTE', {
                userId: target.id,
                username: target.user.tag,
                modId: interaction.user.id,
                duration: durationStr,
                reason: reason
            });

            await interaction.reply({ 
                content: `🔇 **${target.user.tag}** has been muted for **${durationStr}**.\n📋 Reason: ${reason}` 
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ An error occurred while trying to mute this member.', ephemeral: true });
        }
    }
};

function parseDuration(str) {
    const match = str.match(/^(\d+)([smhd])$/);
    if (!match) return null;
    
    const num = parseInt(match[1]);
    const unit = match[2];
    
    const multipliers = {
        's': 1000,
        'm': 60000,
        'h': 3600000,
        'd': 86400000
    };
    
    return num * multipliers[unit];
}