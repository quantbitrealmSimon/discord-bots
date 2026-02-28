import { Client } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

export async function loadEvents(client: Client) {
  const eventsPath = path.join(__dirname, '../events');
  
  if (!fs.existsSync(eventsPath)) {
    console.warn('⚠️ Events directory not found');
    return;
  }
  
  const eventFiles = fs.readdirSync(eventsPath).filter(file => 
    file.endsWith('.ts') || file.endsWith('.js')
  );
  
  console.log(`📁 Loading ${eventFiles.length} events...`);
  
  for (const file of eventFiles) {
    try {
      const filePath = path.join(eventsPath, file);
      const event = await import(filePath);
      
      if ('execute' in event) {
        event.execute(client);
        console.log(`   ✅ ${file.replace('.ts', '').replace('.js', '')}`);
      } else {
        console.warn(`   ⚠️ Event ${file} missing execute function`);
      }
    } catch (error) {
      console.error(`   ❌ Error loading event ${file}:`, error);
    }
  }
}