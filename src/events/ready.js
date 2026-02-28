module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`🤖 Logged in as ${client.user.tag}`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        console.log(`✅ Bot is ready!`);
        
        // Set bot status
        client.user.setActivity('/help | Moderation Bot', { type: 3 }); // Type 3 = Watching
    }
};