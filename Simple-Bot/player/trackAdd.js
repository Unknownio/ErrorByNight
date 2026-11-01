module.exports = (client, queue, track) => {
    const channel = queue?.metadata?.channel;
    if (channel) {
        channel.send(`${client.emotes.music} - **${track.title}** has been added to the queue !`).catch(() => {});
    }
};
