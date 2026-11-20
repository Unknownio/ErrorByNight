const { EmbedBuilder } = require('discord.js');

module.exports = (client, queue, tracks) => {
    const channel = queue?.metadata?.channel;
    if (channel) {
        const count = Array.isArray(tracks) ? tracks.length : tracks?.tracks?.length || 'several';
        const playlistTitle = tracks?.[0]?.playlist?.title || 'Playlist';
        const skippedDuplicates = tracks?.[0]?._skippedDuplicates || tracks?.[0]?.playlist?.skippedDuplicates || 0;

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setAuthor({ name: 'Playlist Added 📑' })
            .setTitle(playlistTitle)
            .setDescription(
                `Successfully queued **${count}** track(s)!` +
                (skippedDuplicates > 0 ? `\n⚠️ *Skipped **${skippedDuplicates}** duplicate song(s) already in the queue.*` : '')
            )
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
