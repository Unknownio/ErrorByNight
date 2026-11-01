module.exports = {
    name: 'stop',
    aliases: ['dc'],
    category: 'Music',
    description: 'Stops music playback, clears the queue, and leaves voice',
    utilisation: '{prefix}stop',

    async execute(client, message) {
        if (!message.member?.voice?.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.members.me.voice?.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

        const queue = client.player.nodes.get(message.guild.id);
        if (!queue) return message.channel.send(`${client.emotes.error} - No music currently playing !`);

        queue.delete();

        message.channel.send(`${client.emotes.success} - Music **stopped** in this server !`);
    },
};
