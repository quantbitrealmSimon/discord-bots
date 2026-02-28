import { Client, TextChannel, GuildMember, EmbedBuilder } from 'discord.js';
import { logger } from '../utils/logger';

/**
 * Sends a welcome message when a new member joins
 */
export async function sendWelcomeMessage(member: GuildMember): Promise<void> {
  try {
    const guild = member.guild;
    
    // Get welcome channel
    let welcomeChannel: TextChannel | null = null;
    
    // Try configured channel first
    if (process.env.WELCOME_CHANNEL_ID) {
      const channel = guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
      if (channel && channel.isTextBased()) {
        welcomeChannel = channel as TextChannel;
      }
    }
    
    // Fallback to system channel
    if (!welcomeChannel && guild.systemChannel) {
      welcomeChannel = guild.systemChannel;
    }
    
    // Fallback to first text channel
    if (!welcomeChannel) {
      welcomeChannel = guild.channels.cache.find(
        (ch): ch is TextChannel => ch.isTextBased() && ch.type === 0
      ) || null;
    }
    
    if (!welcomeChannel) {
      logger.warn(`No welcome channel found for guild: ${guild.name}`);
      return;
    }

    // Build welcome message
    const welcomeMessage = buildWelcomeMessage(member, guild.name, guild.memberCount);
    
    // Create embed for nicer presentation
    const embed = new EmbedBuilder()
      .setColor('#00D26A')
      .setTitle('👋 New Member!')
      .setDescription(welcomeMessage)
      .setThumbnail(member.user.displayAvatarURL({ size: 128 }))
      .addFields(
        { name: 'User', value: member.user.tag, inline: true },
        { name: 'Member #', value: guild.memberCount.toString(), inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setFooter({ text: `ID: ${member.id}` })
      .setTimestamp();

    await welcomeChannel.send({ embeds: [embed] });
    logger.info(`Welcomed ${member.user.tag} to ${guild.name}`);

    // Send DM if enabled (Premium feature)
    if (process.env.ENABLE_DM_WELCOME === 'true') {
      await sendDMWelcome(member, guild.name);
    }

    // Auto-assign roles if configured (Premium feature)
    if (process.env.AUTO_ROLES) {
      await assignAutoRoles(member);
    }

  } catch (error) {
    logger.error(`Error sending welcome message:`, error);
  }
}

/**
 * Send a welcome DM to the new member
 */
async function sendDMWelcome(member: GuildMember, serverName: string): Promise<void> {
  try {
    const dmMessage = process.env.DM_WELCOME_MESSAGE || 
      `Welcome to {server}! We're glad to have you here.`;
    
    const formattedMessage = dmMessage
      .replace(/{user}/g, member.user.toString())
      .replace(/{server}/g, serverName)
      .replace(/{username}/g, member.user.username);

    await member.send(formattedMessage);
    logger.info(`Sent DM welcome to ${member.user.tag}`);
  } catch (error) {
    logger.warn(`Could not send DM to ${member.user.tag} (likely has DMs disabled)`);
  }
}

/**
 * Assign auto-roles to new member
 */
async function assignAutoRoles(member: GuildMember): Promise<void> {
  try {
    const roleIds = process.env.AUTO_ROLES?.split(',').map(r => r.trim()) || [];
    
    for (const roleId of roleIds) {
      const role = member.guild.roles.cache.get(roleId);
      if (role && role.position < member.guild.members.me!.roles.highest.position) {
        await member.roles.add(role);
        logger.info(`Assigned role ${role.name} to ${member.user.tag}`);
      }
    }
  } catch (error) {
    logger.error(`Error assigning auto-roles:`, error);
  }
}

/**
 * Build welcome message from template or default
 */
function buildWelcomeMessage(member: GuildMember, serverName: string, memberCount: number): string {
  const template = process.env.WELCOME_MESSAGE || 
    '🎉 Welcome {user} to **{server}**! You are our {count}th member! Enjoy your stay! 🚀';
  
  // Add ordinal suffix to count
  const ordinalCount = addOrdinalSuffix(memberCount);
  
  return template
    .replace(/{user}/g, member.user.toString())
    .replace(/{server}/g, serverName)
    .replace(/{count}/g, ordinalCount)
    .replace(/{username}/g, member.user.username);
}

/**
 * Add ordinal suffix to number (1st, 2nd, 3rd, etc.)
 */
function addOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) return num + 'st';
  if (j === 2 && k !== 12) return num + 'nd';
  if (j === 3 && k !== 13) return num + 'rd';
  return num + 'th';
}

/**
 * Send goodbye message when member leaves
 */
export async function sendGoodbyeMessage(member: GuildMember): Promise<void> {
  try {
    const guild = member.guild;
    
    let goodbyeChannel: TextChannel | null = null;
    
    if (process.env.WELCOME_CHANNEL_ID) {
      const channel = guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
      if (channel && channel.isTextBased()) {
        goodbyeChannel = channel as TextChannel;
      }
    }
    
    if (!goodbyeChannel && guild.systemChannel) {
      goodbyeChannel = guild.systemChannel;
    }
    
    if (!goodbyeChannel) {
      goodbyeChannel = guild.channels.cache.find(
        (ch): ch is TextChannel => ch.isTextBased() && ch.type === 0
      ) || null;
    }
    
    if (!goodbyeChannel) return;

    const embed = new EmbedBuilder()
      .setColor('#ED4245')
      .setDescription(`👋 **${member.user.tag}** has left the server. We're now ${guild.memberCount} members.`)
      .setFooter({ text: `ID: ${member.id}` })
      .setTimestamp();

    await goodbyeChannel.send({ embeds: [embed] });
    logger.info(`Sent goodbye for ${member.user.tag} from ${guild.name}`);
  } catch (error) {
    logger.error(`Error sending goodbye message:`, error);
  }
}
