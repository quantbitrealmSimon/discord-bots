const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'welcome',
        description: 'Send a test welcome message',
        default_member_permissions: '8' // Admin only
    },
    {
        name: 'setchannel',
        description: 'Set the welcome channel',
        options: [
            {
                name: 'channel',
                description: 'The channel for welcome messages',
                type: 7, // Channel type
                required: true
            }
        ],
        default_member_permissions: '8'
    },
    {
        name: 'setrole',
        description: 'Set the auto-role for new members',
        options: [
            {
                name: 'role',
                description: 'The role to assign to new members',
                type: 8, // Role type
                required: false
            }
        ],
        default_member_permissions: '8'
    },
    {
        name: 'stats',
        description: 'Show welcome bot statistics'
    },
    {
        name: 'help',
        description: 'Show welcome bot help and commands'
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🚀 Started refreshing application (/) commands.');

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
})();