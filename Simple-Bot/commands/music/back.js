module.exports = {
    name: 'back',
    aliases: ['previous', 'prev'],
    category: 'Music',
    utilisation: '{prefix}back',
    description: 'Play the previous song or restart the current song',

    async execute(client, message) {
        if (!message.member.voice.channel) {
            return message.channel.send(`${client.emotes.error} - You're not in a voice channel!`);
        }

        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) {
            return message.channel.send(`${client.emotes.error} - You are not in the same voice channel!`);
        }

        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying()) {
            return message.channel.send(`${client.emotes.error} - No music currently playing!`);
        }

        if (queue.history.tracks.size > 0) {
            const prevTrack = queue.history.previousTrack;
            await queue.history.back();
            return message.channel.send(`⏮️ - Playing previous song${prevTrack?.title ? `: **${prevTrack.title}**` : ''}!`);
        } else {
            await queue.node.seek(0);
            return message.channel.send(`⏮️ - No previous track in history — restarted **${queue.currentTrack.title}** from the beginning!`);
        }
    },
};
