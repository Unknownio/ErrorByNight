module.exports = (client, queue) => {
    const channel = queue?.metadata?.channel;
    if (channel) {
        channel.send(`${client.emotes.error} - Music stopped as there is no more music in the queue !`).catch(() => {});
    }
};
