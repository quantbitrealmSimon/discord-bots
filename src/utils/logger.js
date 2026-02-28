const { EmbedBuilder } = require('discord.js');

class Logger {
    constructor(client) {
        this.client = client;
    }

    async log(guild, type, data) {
        const config = require('../config');
        if (!config.logChannelId) return;

        const channel = guild.channels.cache.get(config.logChannelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setTimestamp()
            .setFooter({ text: `ID: ${data.userId || 'N/A'}` });

        switch (type) {
            case 'KICK':
                embed
                    .setColor(0xFFA500)
                    .setTitle('👢 Member Kicked')
                    .addFields(
                        { name: 'User', value: `<@${data.userId}> (${data.username})`, inline: true },
                        { name: 'Moderator', value: `<@${data.modId}>`, inline: true },
                        { name: 'Reason', value: data.reason || 'No reason provided' }
                    );
                break;

            case 'BAN':
                embed
                    .setColor(0xFF0000)
                    .setTitle('🔨 Member Banned')
                    .addFields(
                        { name: 'User', value: `<@${data.userId}> (${data.username})`, inline: true },
                        { name: 'Moderator', value: `<@${data.modId}>`, inline: true },
                        { name: 'Reason', value: data.reason || 'No reason provided' }
                    );
                break;

            case 'UNBAN':
                embed
                    .setColor(0x00FF00)
                    .setTitle('🔓 Member Unbanned')
                    .addFields(
                        { name: 'User ID', value: data.userId, inline: true },
                        { name: 'Moderator', value: `<@${data.modId}>`, inline: true }
                    );
                break;

            case 'MUTE':
                embed
                    .setColor(0xFFFF00)
                    .setTitle('🔇 Member Muted')
                    .addFields(
                        { name: 'User', value: `<@${data.userId}> (${data.username})`, inline: true },
                        { name: 'Moderator', value: `<@${data.modId}>`, inline: true },
                        { name: 'Duration', value: data.duration || 'Indefinite' },
                        { name: 'Reason', value: data.reason || 'No reason provided' }
                    );
                break;

            case 'UNMUTE':
                embed
                    .setColor(0x00FF00)
                    .setTitle('🔊 Member Unmuted')
                    .addFields(
                        { name: 'User', value: `<@${data.userId}> (${data.username})`, inline: true },
                        { name: 'Moderator', value: `<@${data.modId}>`, inline: true }
                    );
                break;

            case 'WARN':
                embed
                    .setColor(0xFFA500)
                    .setTitle('⚠️ Member Warned')
                    .addFields(
                        { name: 'User', value: `<@${data.userId}> (${data.username})`, inline: true },
                        { name: 'Moderator', value: `<@${data.modId}>`, inline: true },
                        { name: 'Warning #', value: `${data.warningCount}`, inline: true },
                        { name: 'Reason', value: data.reason || 'No reason provided' }
                    );
                break;

            case 'CLEAR':
                embed
                    .setColor(0x3498DB)
                    .setTitle('🧹 Messages Cleared')
                    .addFields(
                        { name: 'Channel', value: `<#${data.channelId}>`, inline: true },
                        { name: 'Amount', value: `${data.amount} messages`, inline: true },
                        { name: 'Moderator', value: `<@${data.modId}>`, inline: true }
                    );
                break;

            case 'LOCK':
                embed
                    .setColor(0x9B59B6)
                    .setTitle('🔒 Channel Locked')
                    .addFields(
                        { name: 'Channel', value: `<#${data.channelId}>`, inline: true },
                        { name: 'Moderator', value: `<@${data.modId}>`, inline: true }
                    );
                break;

            case 'UNLOCK':
                embed
                    .setColor(0x2ECC71)
                    .setTitle('🔓 Channel Unlocked')
                    .addFields(
                        { name: 'Channel', value: `<#${data.channelId}>`, inline: true },
                        { name: 'Moderator', value: `<@${data.modId}>`, inline: true }
                    );
                break;
        }

        try {
            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to send log:', error);
        }
    }
}

module.exports = Logger;