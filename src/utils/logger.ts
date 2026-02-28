// Simple logger utility
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const currentLevel = LOG_LEVELS[(process.env.LOG_LEVEL as keyof typeof LOG_LEVELS) || 'info'];

function log(level: keyof typeof LOG_LEVELS, message: string, ...args: any[]) {
  if (LOG_LEVELS[level] >= currentLevel) {
    const timestamp = new Date().toISOString();
    const emoji = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌'
    }[level];
    
    console.log(`[${timestamp}] ${emoji} [${level.toUpperCase()}] ${message}`, ...args);
  }
}

export const logger = {
  debug: (message: string, ...args: any[]) => log('debug', message, ...args),
  info: (message: string, ...args: any[]) => log('info', message, ...args),
  warn: (message: string, ...args: any[]) => log('warn', message, ...args),
  error: (message: string, ...args: any[]) => log('error', message, ...args)
};
