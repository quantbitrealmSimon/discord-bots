const { REST, Routes } = require('discord.js');
const config = require('./config');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`📋 Registered: ${command.data.name}`);
    }
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log(`🚀 Deploying ${commands.length} commands...`);

        // For guild-specific deployment (faster for testing)
        if (config.guildId) {
            await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: commands }
            );
            console.log(`✅ Deployed ${commands.length} commands to guild ${config.guildId}`);
        }

        // For global deployment
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands }
        );
        console.log(`✅ Deployed ${commands.length} commands globally`);

    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
})();