const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const config = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    welcomeChannelId: process.env.WELCOME_CHANNEL_ID,
    autoRoleId: process.env.AUTO_ROLE_ID,
    welcomeMessage: process.env.WELCOME_MESSAGE || 'Welcome to the server, {user}! We\'re glad to have you here.',
    enableDMWelcome: process.env.ENABLE_DM_WELCOME === 'true',
    dmWelcomeMessage: process.env.DM_WELCOME_MESSAGE || 'Hey {user}! Welcome to our community.'
};

// Validate required config
if (!config.token) {
    console.error('❌ DISCORD_TOKEN is required! Check your .env file.');
    process.exit(1);
}

// Create client with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

// Store config on client for access in events
client.config = config;

// Load event handlers
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Login
client.login(config.token).catch(err => {
    console.error('❌ Failed to login:', err.message);
    process.exit(1);
});