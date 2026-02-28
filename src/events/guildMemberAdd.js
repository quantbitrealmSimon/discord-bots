module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        // Check if user is banned (rejoining)
        const warnings = client.db.getWarningCount(member.id, member.guild.id);
        
        if (warnings > 0) {
            console.log(`⚠️ User ${member.user.tag} rejoined with ${warnings} warnings`);
            // Optionally log this to mod channel
        }
    }
};