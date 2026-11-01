const { EmbedBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    name: 'queue',
    aliases: ['q'],
    category: 'Music',
    description: 'Displays the paginated song queue with duration and active loop status',
    utilisation: '{prefix}queue [page]',

    async execute(client, message, args) {
        if (!message.member?.voice?.channel) {
            return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);
        }

        if (message.guild.members.me.voice?.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) {
            return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);
        }

        const queue = client.player.nodes.get(message.guild.id);
        if (!queue || !queue.currentTrack) {
            return message.channel.send(`${client.emotes.error} - No songs currently playing !`);
        }

        const tracks = queue.tracks.toArray();
        const current = queue.currentTrack;

        const pageSize = 10;
        const totalPages = Math.ceil(tracks.length / pageSize) || 1;
        let page = parseInt(args[0], 10);
        if (isNaN(page) || page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        const startIndex = (page - 1) * pageSize;
        const currentTracks = tracks.slice(startIndex, startIndex + pageSize);

        let repeatStatus = 'Off';
        if (queue.repeatMode === QueueRepeatMode.TRACK) repeatStatus = '🔂 Song';
        else if (queue.repeatMode === QueueRepeatMode.QUEUE) repeatStatus = '🔁 Queue';
        else if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) repeatStatus = '📻 Autoplay';

        const currentRequester = current.requestedBy?.username 
            || (typeof current.requestedBy === 'string' ? current.requestedBy : null) 
            || queue.metadata?.requestedBy?.username 
            || (queue.repeatMode === QueueRepeatMode.AUTOPLAY ? '📻 Autoplay' : 'Unknown');

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle(`🎶 Queue for ${message.guild.name}`)
            .setDescription(`**Now Playing:**\n[${current.title}](${current.url}) | \`${current.duration}\` (requested by ${currentRequester})\n\n**Up Next:**\n${
                currentTracks.length > 0
                    ? currentTracks.map((t, idx) => {
                        const req = t.requestedBy?.username || queue.metadata?.requestedBy?.username || 'Unknown';
                        return `**#${startIndex + idx + 1}** - [${t.title}](${t.url}) | \`${t.duration}\` (${req})`;
                    }).join('\n')
                    : '*No other tracks in queue.*'
            }`)
            .addFields(
                { name: 'Total Songs', value: `${tracks.length + 1}`, inline: true },
                { name: 'Estimated Duration', value: `${queue.durationFormatted || 'Unknown'}`, inline: true },
                { name: 'Loop Mode', value: repeatStatus, inline: true }
            )
            .setFooter({ text: `Page ${page}/${totalPages} | Use "${client.config.app.px}queue <page>" to navigate` })
            .setTimestamp();

        if (current.thumbnail) {
            embed.setThumbnail(current.thumbnail);
        }

        return message.channel.send({ embeds: [embed] });
    },
};
