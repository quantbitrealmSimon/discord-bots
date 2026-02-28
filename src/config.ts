import dotenv from 'dotenv';

dotenv.config();

export const config = {
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    clientId: process.env.DISCORD_CLIENT_ID || ''
  },
  ai: {
    provider: (process.env.AI_PROVIDER || 'openai') as 'openai' | 'kimi',
    apiKey: process.env.AI_PROVIDER === 'kimi' 
      ? process.env.KIMI_API_KEY || '' 
      : process.env.OPENAI_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-4o-mini',
    maxContextMessages: parseInt(process.env.MAX_CONTEXT_MESSAGES || '10')
  },
  bot: {
    name: process.env.BOT_NAME || 'QuantZen AI',
    defaultPersonality: process.env.DEFAULT_PERSONALITY || 'default',
    rateLimitPerMinute: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '20')
  }
};

// Validate required config
if (!config.discord.token) {
  throw new Error('DISCORD_TOKEN is required');
}

if (!config.ai.apiKey) {
  throw new Error('AI API key is required (OPENAI_API_KEY or KIMI_API_KEY)');
}
