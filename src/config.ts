import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Validate required environment variables
const requiredEnv = ['DISCORD_TOKEN', 'CLIENT_ID', 'WELCOME_CHANNEL_ID'];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  console.error('Please check your .env file');
  process.exit(1);
}

export const config = {
  discord: {
    token: process.env.DISCORD_TOKEN!,
    clientId: process.env.CLIENT_ID!,
  },
  channels: {
    welcome: process.env.WELCOME_CHANNEL_ID!,
    log: process.env.LOG_CHANNEL_ID || null,
  },
  roles: {
    autoRole: process.env.AUTO_ROLE_ID || null,
  },
  features: {
    enableDM: process.env.ENABLE_DM_WELCOME === 'true',
  },
  messages: {
    welcome: process.env.WELCOME_MESSAGE || 
      '🎉 Welcome {user} to **{server}**! You are our **{count}th** member!',
    leave: process.env.LEAVE_MESSAGE || 
      '👋 {username} has left the server.',
  },
  status: process.env.STATUS_MESSAGE || 'over new members',
  environment: process.env.NODE_ENV || 'development',
};