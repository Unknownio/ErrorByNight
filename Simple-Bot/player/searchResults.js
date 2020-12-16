module.exports = (client, message, query, tracks) => {
    message.channel.send({
        embed: {
            color: 'ORGANE',
            author: { name: `Here are your search results for ${query}` },
            footer: { text: 'This bot uses a Github project made by Unknownio (Unknownio/SimpleBot)' },
            timestamp: new Date(),
            description: `${tracks.map((t, i) => `**${i + 1}** - ${t.title}`).join('\n')}`,
        },
    });
};