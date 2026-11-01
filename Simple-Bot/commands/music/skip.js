module.exports = {
    name: 'skip',
    aliases: ['sk'],
    category: 'Music',
    description: 'Skips the currently playing song and moves to the next in queue',
    utilisation: '{prefix}skip',

    async execute(client, message) {
        if (!message.member?.voice?.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.members.me.voice?.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

        const queue = client.player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.channel.send(`${client.emotes.error} - No music currently playing !`);

        queue.node.skip();

        message.channel.send(`${client.emotes.success} - The current music has just been **skipped** !`);
    },
};
