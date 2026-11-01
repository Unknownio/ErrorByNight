module.exports = async (client, message) => {
    // Ignore bots and DMs
    if (message.author.bot || !message.guild) return;

    const prefix = client.config.prefix;
    const content = message.content.trim();

    // Check if message starts with prefix
    if (!content.startsWith(prefix)) {
        // Auto-detect music URLs dropped into chat without prefix if user is in a voice channel
        const isMusicUrl = /^https?:\/\/(www\.|music\.)?(youtube\.com|youtu\.be|soundcloud\.com|open\.spotify\.com)\/\S+$/i.test(content);
        if (isMusicUrl && message.member?.voice?.channel) {
            const playCommand = client.commands.get('play');
            if (playCommand) {
                try {
                    await playCommand.execute(client, message, [content]);
                } catch (error) {
                    console.error('Error auto-playing dropped URL:', error);
                }
            }
        }
        return;
    }

    const args = content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    // Find command by name or alias
    const command = client.commands.get(commandName) || 
                    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (command) {
        try {
            await command.execute(client, message, args);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            message.reply('❌ There was an error executing that command!').catch(() => {});
        }
    }
};
