const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ Welcome Bot is online! Logged in as ${client.user.tag}`);
        
        // Set bot presence
        client.user.setPresence({
            activities: [
                { 
                    name: 'for new members 👋', 
                    type: ActivityType.Watching 
                }
            ],
            status: 'online'
        });

        // Simple in-memory stats (can be upgraded to database for production)
        client.stats = {
            welcomesSent: 0,
            rolesAssigned: 0,
            startTime: Date.now()
        };

        console.log('📊 Stats initialized');
        console.log(`📝 Welcome channel: ${client.config.welcomeChannelId || 'Not set'}`);
        console.log(`🎭 Auto-role: ${client.config.autoRoleId || 'Disabled'}`);
    }
};