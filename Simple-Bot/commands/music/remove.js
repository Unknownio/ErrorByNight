module.exports = {
    name: 'remove',
    aliases: ['rm', 'delete'],
    category: 'Music',
    description: 'Removes a specific track from the queue by its number (e.g. .remove 3)',
    utilisation: '{prefix}remove [track number]',

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
            return message.channel.send(`${client.emotes.error} - The queue is already empty (only current song playing) !`);
        }

        const index = parseInt(args[0], 10);
        if (isNaN(index) || index < 1 || index > queue.tracks.size) {
            return message.channel.send(`${client.emotes.error} - Please specify a valid track number between **1** and **${queue.tracks.size}** !`);
        }

        const trackIndex = index - 1;
        const targetTrack = queue.tracks.toArray()[trackIndex];
        const removed = queue.node.remove(trackIndex);

        if (removed || targetTrack) {
            return message.channel.send(`🗑️ - Removed **#${index}** (**${targetTrack?.title || 'Unknown track'}**) from the queue !`);
        } else {
            return message.channel.send(`${client.emotes.error} - Could not remove track #${index} !`);
        }
    },
};
