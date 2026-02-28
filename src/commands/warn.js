const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for warning')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction, client) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason');

        if (!target) {
            return interaction.reply({ content: '❌ Could not find that member!', ephemeral: true });
        }

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot warn yourself!', ephemeral: true });
        }

        if (target.id === client.user.id) {
            return interaction.reply({ content: '❌ You cannot warn me!', ephemeral: true });
        }

        try {
            // Add warning to database
            client.db.addWarning(target.id, interaction.guild.id, interaction.user.id, reason);
            
            // Get updated warning count
            const warningCount = client.db.getWarningCount(target.id, interaction.guild.id);
            
            // Log action
            client.db.logAction('WARN', target.id, interaction.guild.id, interaction.user.id, reason);
            
            // Log to channel
            await client.logger.log(interaction.guild, 'WARN', {
                userId: target.id,
                username: target.user.tag,
                modId: interaction.user.id,
                warningCount: warningCount,
                reason: reason
            });

            // Check if should auto-ban
            const maxWarnings = config.maxWarningsBeforeBan;
            let banMessage = '';
            
            if (warningCount >= maxWarnings) {
                try {
                    await target.ban({ reason: `Auto-banned: Reached ${maxWarnings} warnings` });
                    client.db.logAction('AUTO_BAN', target.id, interaction.guild.id, client.user.id, `Reached ${maxWarnings} warnings`);
                    banMessage = `\n🔨 **${target.user.tag}** has been automatically banned for reaching ${maxWarnings} warnings.`;
                } catch (err) {
                    banMessage = `\n⚠️ Could not auto-ban: ${err.message}`;
                }
            }

            // DM the user
            try {
                const embed = new EmbedBuilder()
                    .setColor(0xFFA500)
                    .setTitle(`⚠️ Warning from ${interaction.guild.name}`)
                    .setDescription(`You have received a warning.`)
                    .addFields(
                        { name: 'Reason', value: reason },
                        { name: 'Warning #', value: `${warningCount}/${maxWarnings}` }
                    )
                    .setTimestamp();
                
                await target.send({ embeds: [embed] });
            } catch {
                // User has DMs disabled
            }

            await interaction.reply({ 
                content: `⚠️ **${target.user.tag}** has been warned.\n📋 Reason: ${reason}\n📊 Total warnings: ${warningCount}/${maxWarnings}${banMessage}` 
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ An error occurred while trying to warn this member.', ephemeral: true });
        }
    }
};