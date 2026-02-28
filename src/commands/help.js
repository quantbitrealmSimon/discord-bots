const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands'),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('🛡️ QuantBit Moderation Bot')
            .setDescription('Professional moderation tools for your server')
            .addFields(
                {
                    name: '🔨 Punishment Commands',
                    value: 
                        '`/kick <user> [reason]` — Kick a member\n' +
                        '`/ban <user> [reason] [days]` — Ban a member\n' +
                        '`/unban <user_id> [reason]` — Unban a user\n' +
                        '`/mute <user> <duration> [reason]` — Timeout a member\n' +
                        '`/unmute <user> [reason]` — Remove timeout'
                },
                {
                    name: '⚠️ Warning System',
                    value: 
                        '`/warn <user> <reason>` — Issue a warning\n' +
                        '`/warnings [user]` — View warnings\n' +
                        '`/warnings <user> remove:<id>` — Remove a warning'
                },
                {
                    name: '📋 Management Commands',
                    value: 
                        '`/clear <amount> [user]` — Delete messages\n' +
                        '`/lock [channel] [reason]` — Lock a channel\n' +
                        '`/unlock [channel]` — Unlock a channel\n' +
                        '`/slowmode <seconds> [channel]` — Set slowmode'
                },
                {
                    name: '📊 Info Commands',
                    value: 
                        '`/modlogs <user>` — View mod history'
                },
                {
                    name: '⚡ Auto-Features',
                    value: 
                        '• Auto-ban after 3 warnings\n' +
                        '• Detailed logging to mod-logs channel\n' +
                        '• Persistent warning database'
                }
            )
            .setFooter({ text: 'Made by QuantBitRealm • v1.0.0' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};