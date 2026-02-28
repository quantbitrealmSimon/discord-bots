const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages from a channel')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Only delete messages from this user')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction, client) {
        const amount = interaction.options.getInteger('amount');
        const target = interaction.options.getUser('target');
        const channel = interaction.channel;

        // Defer reply since this might take a moment
        await interaction.deferReply({ ephemeral: true });

        try {
            let messages;
            
            if (target) {
                // Fetch and filter messages from target user
                const fetched = await channel.messages.fetch({ limit: 100 });
                messages = fetched.filter(m => m.author.id === target.id).first(amount);
                
                if (messages.length === 0) {
                    return interaction.editReply({ content: `❌ No messages found from **${target.tag}** in the last 100 messages.` });
                }
                
                await channel.bulkDelete(messages, true);
            } else {
                messages = await channel.messages.fetch({ limit: amount });
                await channel.bulkDelete(messages, true);
            }

            // Log the action
            await client.logger.log(interaction.guild, 'CLEAR', {
                channelId: channel.id,
                amount: messages.size || messages.length,
                modId: interaction.user.id
            });

            await interaction.editReply({ 
                content: `✅ Cleared **${messages.size || messages.length}** message(s)${target ? ` from **${target.tag}**` : ''}.` 
            });

            // Delete the reply after 3 seconds
            setTimeout(() => {
                interaction.deleteReply().catch(() => {});
            }, 3000);

        } catch (error) {
            console.error(error);
            await interaction.editReply({ 
                content: '❌ Failed to clear messages. Messages older than 14 days cannot be bulk deleted.' 
            });
        }
    }
};