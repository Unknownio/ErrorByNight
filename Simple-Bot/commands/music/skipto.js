module.exports = {
    name: 'skipto',
    aliases: ['st'],
    category: 'Music',
    description: 'Skips directly to a song in the queue and removes the songs before it (use .jump to keep skipped songs)',
    utilisation: '{prefix}skipto [track # or song name]',

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

        if (!args[0]) {
            return message.channel.send(`${client.emotes.error} - Please specify a track number (1-${queue.tracks.size}) or song title!`);
        }

        const tracks = queue.tracks.toArray();
        const input = args.join(' ').trim();
        let trackIndex = -1;

        if (/^\d+$/.test(input)) {
            const index = parseInt(input, 10);
            if (index < 1 || index > tracks.length) {
                return message.channel.send(`${client.emotes.error} - Please specify a valid track number between **1** and **${tracks.length}** !`);
            }
            trackIndex = index - 1;
        } else {
            const lower = input.toLowerCase();
            trackIndex = tracks.findIndex(
                t => t.title?.toLowerCase().includes(lower) || t.author?.toLowerCase().includes(lower)
            );
            if (trackIndex === -1) {
                return message.channel.send(`${client.emotes.error} - Couldn't find any song matching **"${input}"** in the queue!`);
            }
        }

        const targetTrack = tracks[trackIndex];
        queue.node.skipTo(trackIndex);

        return message.channel.send(`⏭️ - Skipped directly to track **#${trackIndex + 1}** (**${targetTrack?.title || 'Unknown track'}**) !`);
    },
};
