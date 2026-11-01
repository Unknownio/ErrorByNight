module.exports = (client, queue, error) => {
    console.error('Player playback error:', error);
    const channel = queue?.metadata?.channel;
    if (channel) {
        channel.send(`${client.emotes.error} - Playback error: ${error?.message || error}`).catch(() => {});
    }
};
