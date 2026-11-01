module.exports = {
    name: 'skipto',
    aliases: ['jump'],
    category: 'Music',
    description: 'Jumps directly to any song in the queue (e.g. .skipto 4)',
    utilisation: '{prefix}skipto [track number]',

    async execute(client, message, args) {
        if (!message.member?.voice?.channel) {
            return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);
        }

        if (message.guild.members.me.voice?.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) {
            return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);
        }

        const queue = client.player.nodes.get(message.guild.id);
        if (!queue || !queue.currentTrack) {
            return message.channel.send(`${client.emotes.error} - No music currently playing !`);
        }

        if (queue.tracks.size === 0) {
            return message.channel.send(`${client.emotes.error} - There are no upcoming tracks in the queue to skip to !`);
        }

        const index = parseInt(args[0], 10);
        if (isNaN(index) || index < 1 || index > queue.tracks.size) {
            return message.channel.send(`${client.emotes.error} - Please specify a valid track number between **1** and **${queue.tracks.size}** !`);
        }

        const trackIndex = index - 1;
        const targetTrack = queue.tracks.toArray()[trackIndex];

        queue.node.skipTo(trackIndex);

        return message.channel.send(`⏭️ - Skipped directly to track **#${index}** (**${targetTrack?.title || 'Unknown track'}**) !`);
    },
};
