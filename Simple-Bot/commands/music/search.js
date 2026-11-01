module.exports = {
    name: 'search',
    aliases: ['sr'],
    category: 'Music',
    description: 'Searches YouTube for a song and plays the top result',
    utilisation: '{prefix}search [name/URL]',

    async execute(client, message, args) {
        const playCommand = client.commands.get('play');
        if (playCommand) {
            return playCommand.execute(client, message, args);
        }
    },
};
