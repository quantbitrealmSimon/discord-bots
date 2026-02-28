const { Events, InteractionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const { commandName } = interaction;

        if (commandName === 'welcome') {
            const embed = new EmbedBuilder()
                .setColor(0x00FF88)
                .setTitle('👋 Welcome Test')
                .setDescription('This is how welcome messages will look!')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (commandName === 'setchannel') {
            const channel = interaction.options.getChannel('channel');
            if (!channel.isTextBased()) {
                return interaction.reply({ content: '❌ Please select a text channel.', ephemeral: true });
            }
            
            // In production, save to database
            client.config.welcomeChannelId = channel.id;
            
            await interaction.reply({ 
                content: `✅ Welcome channel set to ${channel}`, 
                ephemeral: true 
            });
            console.log(`🔧 Welcome channel updated to #${channel.name} (${channel.id}) by ${interaction.user.tag}`);
        }

        if (commandName === 'setrole') {
            const role = interaction.options.getRole('role');
            
            if (!role) {
                client.config.autoRoleId = null;
                return interaction.reply({ content: '✅ Auto-role disabled.', ephemeral: true });
            }
            
            // Check bot permissions
            const botMember = interaction.guild.members.me;
            if (!botMember.permissions.has('ManageRoles')) {
                return interaction.reply({ 
                    content: '❌ I need "Manage Roles" permission to assign roles.', 
                    ephemeral: true 
                });
            }
            
            if (role.position >= botMember.roles.highest.position) {
                return interaction.reply({ 
                    content: '❌ I cannot assign a role higher than my highest role.', 
                    ephemeral: true 
                });
            }
            
            client.config.autoRoleId = role.id;
            await interaction.reply({ 
                content: `✅ Auto-role set to ${role.name}`, 
                ephemeral: true 
            });
            console.log(`🔧 Auto-role updated to "${role.name}" (${role.id}) by ${interaction.user.tag}`);
        }

        if (commandName === 'stats') {
            const stats = client.stats || { welcomesSent: 0, rolesAssigned: 0, startTime: Date.now() };
            const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
            
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('📊 Welcome Bot Statistics')
                .addFields(
                    { name: '👋 Welcomes Sent', value: `${stats.welcomesSent}`, inline: true },
                    { name: '🎭 Roles Assigned', value: `${stats.rolesAssigned}`, inline: true },
                    { name: '⏱️ Uptime', value: `${Math.floor(uptime / 60)}m ${uptime % 60}s`, inline: true }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (commandName === 'help') {
            const embed = new EmbedBuilder()
                .setColor(0xFF9900)
                .setTitle('🤖 Welcome Bot Help')
                .setDescription('A professional welcome bot for your Discord server.')
                .addFields(
                    { name: '📋 Commands', value: [
                        '`/welcome` - Test welcome message (Admin)',
                        '`/setchannel #channel` - Set welcome channel (Admin)',
                        '`/setrole @role` - Set auto-role (Admin)',
                        '`/stats` - View bot statistics',
                        '`/help` - Show this help message'
                    ].join('\n') },
                    { name: '⚙️ Features', value: [
                        '• Automatic welcome messages',
                        '• Custom welcome channel',
                        '• Auto-role assignment',
                        '• Member count tracking',
                        '• Account age display'
                    ].join('\n') },
                    { name: '⭐ Premium Features', value: [
                        '• DM welcome messages',
                        '• Custom message templates',
                        '• Welcome images/cards',
                        '• Analytics dashboard',
                        '• Multiple welcome messages'
                    ].join('\n') }
                )
                .setFooter({ text: 'Built by QuantBitRealm' })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};