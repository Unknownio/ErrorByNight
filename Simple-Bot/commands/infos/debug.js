module.exports = {
    name: 'debug',
    aliases: [],
    category: 'Infos',
    description: 'Displays current active voice connections across servers',
    utilisation: '{prefix}debug',

    execute(client, message) {
        const activeConnections = client.guilds.cache.filter(g => g.members.me?.voice?.channel).size;
        message.channel.send(`${client.emotes.success} - ${client.user.username} connected in **${activeConnections}** server(s) !`);
    },
};
