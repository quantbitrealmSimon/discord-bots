import { User } from 'discord.js';

/**
 * Format welcome message with placeholders
 * Placeholders: {user}, {username}, {server}, {count}
 */
export function formatWelcomeMessage(
  template: string,
  user: User,
  serverName: string,
  memberCount: number
): string {
  return template
    .replace(/{user}/g, `<@${user.id}>`)
    .replace(/{username}/g, user.username)
    .replace(/{server}/g, serverName)
    .replace(/{count}/g, memberCount.toString());
}