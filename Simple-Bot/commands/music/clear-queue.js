module.exports = {
    name: 'clear-queue',
    aliases: ['cq'],
    category: 'Music',
    description: 'Removes all upcoming tracks from the queue',
    utilisation: '{prefix}clear-queue',

    async execute(client, message) {
        if (!message.member?.voice?.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.members.me.voice?.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

        const queue = client.player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.channel.send(`${client.emotes.error} - No music currently playing !`);

        queue.tracks.clear();

        message.channel.send(`${client.emotes.success} - The queue has just been **removed** !`);
    },
};
