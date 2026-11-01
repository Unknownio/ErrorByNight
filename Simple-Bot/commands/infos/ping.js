module.exports = {
    name: 'ping',
    aliases: [],
    category: 'Infos',
    description: 'Shows bot latency and WebSocket ping',
    utilisation: '{prefix}ping',

    execute(client, message) {
        message.channel.send(`${client.emotes.success} - Ping : **${client.ws.ping}ms** !`);
    },
};
