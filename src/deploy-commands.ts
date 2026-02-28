import { REST, Routes } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  console.error('❌ Missing DISCORD_TOKEN or CLIENT_ID in .env');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => 
  file.endsWith('.ts') || file.endsWith('.js')
);

// Load command data
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command) {
    commands.push(command.data.toJSON());
    console.log(`📋 Loaded command: ${command.data.name}`);
  }
}

// Deploy commands
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`🚀 Deploying ${commands.length} slash commands...`);
    
    // For global commands (takes up to 1 hour to propagate)
    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    ) as any[];
    
    console.log(`✅ Successfully deployed ${data.length} commands!`);
    console.log('📋 Commands:');
    data.forEach(cmd => console.log(`   /${cmd.name}`));
    
    // Note about guild-specific commands
    console.log('\n💡 Tip: Commands are global and may take up to 1 hour to appear.');
    console.log('   For instant testing, deploy to a specific guild instead.');
    
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
    process.exit(1);
  }
})();