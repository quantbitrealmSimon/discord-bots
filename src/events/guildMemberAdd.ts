import { Events, GuildMember } from 'discord.js';
import { sendWelcomeMessage } from '../services/welcomeService';
import { logger } from '../utils/logger';

export const name = Events.GuildMemberAdd;
export const once = false;

export async function execute(member: GuildMember) {
  logger.info(`🎉 New member joined: ${member.user.tag} (${member.guild.name})`);
  await sendWelcomeMessage(member);
}
