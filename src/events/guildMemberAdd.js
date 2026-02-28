const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member, client) {
        const config = client.config;
        
        console.log(`👋 New member joined: ${member.user.tag} (${member.id})`);

        // 1. Assign auto-role if configured
        if (config.autoRoleId) {
            try {
                const role = member.guild.roles.cache.get(config.autoRoleId);
                if (role) {
                    await member.roles.add(role);
                    console.log(`🎭 Assigned role "${role.name}" to ${member.user.tag}`);
                    if (client.stats) client.stats.rolesAssigned++;
                } else {
                    console.warn(`⚠️ Auto-role ${config.autoRoleId} not found in guild`);
                }
            } catch (error) {
                console.error(`❌ Failed to assign role to ${member.user.tag}:`, error.message);
            }
        }

        // 2. Send welcome message to channel
        if (config.welcomeChannelId) {
            try {
                const channel = await member.guild.channels.fetch(config.welcomeChannelId);
                if (channel && channel.isTextBased()) {
                    const welcomeText = config.welcomeMessage.replace(/{user}/g, `<@${member.id}>`);
                    
                    const embed = new EmbedBuilder()
                        .setColor(0x00FF88)
                        .setTitle('👋 Welcome to the Server!')
                        .setDescription(welcomeText)
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                        .addFields(
                            { name: '📊 Member Count', value: `${member.guild.memberCount}`, inline: true },
                            { name: '📅 Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ 
                            text: `User ID: ${member.id}`, 
                            iconURL: member.guild.iconURL({ dynamic: true }) 
                        });

                    await channel.send({ embeds: [embed] });
                    console.log(`💬 Welcome message sent to #${channel.name}`);
                    if (client.stats) client.stats.welcomesSent++;
                }
            } catch (error) {
                console.error(`❌ Failed to send welcome message:`, error.message);
            }
        }

        // 3. Send DM welcome if enabled (Premium feature placeholder)
        if (config.enableDMWelcome) {
            try {
                const dmText = config.dmWelcomeMessage.replace(/{user}/g, member.user.username);
                await member.send(dmText);
                console.log(`📩 DM welcome sent to ${member.user.tag}`);
            } catch (error) {
                console.log(`⚠️ Could not DM ${member.user.tag} (DMs disabled or blocked)`);
            }
        }
    }
};