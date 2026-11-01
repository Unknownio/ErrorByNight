const { QueryType } = require('discord-player');

module.exports = {
    name: 'playnext',
    aliases: ['pn', 'addnext', 'insert'],
    category: 'Music',
    description: 'Searches and inserts a track at the very top of the queue to play next',
    utilisation: '{prefix}playnext [name/URL]',

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
            return message.channel.send(`${client.emotes.error} - Please indicate the title or URL of the song to play next !`);
        }

        const query = args.join(' ');
        const queue = client.player.nodes.get(message.guild.id);

        try {
            // If there's no active playing queue, standard play is sufficient
            if (!queue || !queue.isPlaying()) {
                await client.player.play(message.member.voice.channel, query, {
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
                return message.react('✅').catch(() => undefined);
            }

            // Search for the track/playlist
            const searchResult = await client.player.search(query, {
                requestedBy: message.author,
                searchEngine: QueryType.AUTO,
            });

            if (!searchResult || !searchResult.hasTracks()) {
                return message.channel.send(`${client.emotes.error} - No results found for "${query}" !`);
            }

            if (searchResult.playlist) {
                // Insert tracks at the top of the queue in order
                for (let i = searchResult.tracks.length - 1; i >= 0; i--) {
                    queue.insertTrack(searchResult.tracks[i], 0);
                }
                return message.channel.send(`⏭️ - Added **${searchResult.tracks.length}** songs from playlist **${searchResult.playlist.title}** to play next !`);
            } else {
                const track = searchResult.tracks[0];
                queue.insertTrack(track, 0);
                return message.channel.send(`⏭️ - Added **${track.title}** to play next right after this song !`);
            }
        } catch (error) {
            console.error('Playnext command failed:', error);
            return message.channel.send(`${client.emotes.error} - Failed to insert track into queue (${error?.message || error}).`);
        }
    },
};
