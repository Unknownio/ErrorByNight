module.exports = (client, queue) => {
    const channel = queue?.metadata?.channel;
    if (channel) {
        channel.send(`${client.emotes.error} - Music stopped as I have been disconnected from the channel !`).catch(() => {});
    }
};
