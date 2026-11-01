module.exports = {
    name: 'pause',
    aliases: [],
    category: 'Music',
    description: 'Pauses the currently playing song',
    utilisation: '{prefix}pause',

    async execute(client, message) {
        if (!message.member?.voice?.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.members.me.voice?.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

        const queue = client.player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.channel.send(`${client.emotes.error} - No music currently playing !`);

        if (queue.node.isPaused()) return message.channel.send(`${client.emotes.error} - The music is already paused !`);

        queue.node.pause();

        message.channel.send(`${client.emotes.success} - Song **${queue.currentTrack?.title}** paused !`);
    },
};
