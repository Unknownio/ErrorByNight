const { QueryType } = require('discord-player');

module.exports = {
    name: 'playlist',
    aliases: ['pl'],
    category: 'Music',
    description: 'Searches for or loads a YouTube playlist and queues all its tracks',
    utilisation: '{prefix}playlist [URL or playlist name]',

    async execute(client, message, args) {
        if (!message.member) {
            await message.guild.members.fetch(message.author.id);
        }

        if (!message.member?.voice?.channel) {
            return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);
        }

        if (message.guild.members.me.voice?.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) {
            return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);
        }

        if (!args[0]) {
            return message.channel.send(`${client.emotes.error} - Please provide a YouTube playlist URL or playlist title to search !`);
        }

        let query = args.join(' ').trim();
        const isUrl = /^https?:\/\//i.test(query);

        // If not a direct URL, search specifically for a playlist
        if (!isUrl) {
            query = `playlist: ${query}`;
        }

        const statusMsg = await message.channel.send(`🔍 - Loading YouTube playlist... Please wait.`);

        try {
            const result = await client.player.play(message.member.voice.channel, query, {
                requestedBy: message.author,
                nodeOptions: {
                    metadata: {
                        channel: message.channel,
                        client,
                        requestedBy: message.author,
                    },
                    selfDeaf: true,
                    connectionTimeout: 45000,
                    leaveOnEmpty: true,
                    leaveOnEnd: true,
                },
                searchEngine: QueryType.AUTO,
            });

            await statusMsg.delete().catch(() => {});
            message.react('✅').catch(() => undefined);
        } catch (error) {
            console.error('Playlist command failed:', error);
            await statusMsg.delete().catch(() => {});
            return message.channel.send(`${client.emotes.error} - Failed to load playlist (${error?.message || error}). Make sure the playlist is public!`);
        }
    },
};
