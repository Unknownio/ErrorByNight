module.exports = (client, queue, error) => {
    console.error('Player error occurred:', error);

    // Clean up broken connection on abort/timeout so next play attempt starts fresh
    if (error?.name === 'AbortError' || error?.code === 'ABORT_ERR') {
        try {
            queue?.delete();
        } catch (_) {}
        const channel = queue?.metadata?.channel;
        if (channel) {
            channel.send(`${client.emotes.error} - Voice connection timed out. Please check that I have **Connect** and **Speak** permissions in your voice channel, and try again!`).catch(() => {});
        }
        return;
    }

    const channel = queue?.metadata?.channel;
    if (channel) {
        channel.send(`${client.emotes.error} - An error occurred: ${error?.message || error}`).catch(() => {});
    }
};
