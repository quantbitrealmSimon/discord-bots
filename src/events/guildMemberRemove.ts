import { Events, GuildMember } from 'discord.js';
import { sendGoodbyeMessage } from '../services/welcomeService';
import { logger } from '../utils/logger';

export const name = Events.GuildMemberRemove;
export const once = false;

export async function execute(member: GuildMember) {
  logger.info(`👋 Member left: ${member.user.tag} (${member.guild.name})`);
  await sendGoodbyeMessage(member);
}
