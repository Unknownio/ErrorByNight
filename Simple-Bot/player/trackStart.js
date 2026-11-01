const { createPlayerComponents, createNowPlayingEmbed } = require('../utils/playerControls');

module.exports = async (client, queue, track) => {
    const channel = queue?.metadata?.channel;
    if (channel) {
        try {
            const embed = createNowPlayingEmbed(client, queue, track);
            const components = createPlayerComponents(queue);
            await channel.send({ embeds: [embed], components });
        } catch (error) {
            console.error('Error sending trackStart message:', error);
            const voiceChannelName = queue.channel?.name || 'voice channel';
            channel.send(`${client.emotes.music} - Now playing **${track.title}** into **${voiceChannelName}** ...`).catch(() => {});
        }
    }
};
