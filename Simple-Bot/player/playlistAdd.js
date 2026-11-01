const { EmbedBuilder } = require('discord.js');

module.exports = (client, queue, tracks) => {
    const channel = queue?.metadata?.channel;
    if (channel) {
        const count = Array.isArray(tracks) ? tracks.length : tracks?.tracks?.length || 'several';
        const playlistTitle = tracks?.[0]?.playlist?.title || 'Playlist';

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setAuthor({ name: 'Playlist Added 📑' })
            .setTitle(playlistTitle)
            .setDescription(`Successfully queued **${count}** tracks!`)
            .addFields(
                { name: 'Tracks in Queue', value: `${queue.tracks.size} song(s)`, inline: true },
                { name: 'Estimated Duration', value: `${queue.durationFormatted || 'Unknown'}`, inline: true }
            )
            .setTimestamp();

        channel.send({ embeds: [embed] }).catch(() => {
            channel.send(`${client.emotes.music} - Added **${count}** songs from playlist to the queue!`).catch(() => {});
        });
    }
};
