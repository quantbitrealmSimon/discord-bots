import { Client } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

export async function loadCommands(client: Client) {
  const commandsPath = path.join(__dirname, '../commands');
  
  if (!fs.existsSync(commandsPath)) {
    console.warn('⚠️ Commands directory not found');
    return;
  }
  
  const commandFiles = fs.readdirSync(commandsPath).filter(file => 
    file.endsWith('.ts') || file.endsWith('.js')
  );
  
  console.log(`📁 Loading ${commandFiles.length} commands...`);
  
  for (const file of commandFiles) {
    try {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`   ✅ /${command.data.name}`);
      } else {
        console.warn(`   ⚠️ Command ${file} missing required properties`);
      }
    } catch (error) {
      console.error(`   ❌ Error loading command ${file}:`, error);
    }
  }
}