const { QueueRepeatMode } = require('discord-player');

module.exports = {
    name: 'loop',
    aliases: ['lp', 'repeat'],
    category: 'Music',
    description: 'Cycles or sets repeat mode: song (🔂), queue (🔁), autoplay (📻), or off',
    utilisation: '{prefix}loop [song | queue | autoplay | off]',

    async execute(client, message, args) {
        if (!message.member?.voice?.channel) {
            return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);
        }

        if (message.guild.members.me.voice?.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) {
            return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);
        }

        const queue = client.player?.nodes?.get(message.guild.id);
        if (!queue || !queue.currentTrack) {
            return message.channel.send(`${client.emotes.error} - No music currently playing !`);
        }

        const modeArg = args[0]?.toLowerCase();

        // Specific mode selection
        if (['song', 'track', 'current', '1'].includes(modeArg)) {
            queue.setRepeatMode(QueueRepeatMode.TRACK);
            return message.channel.send(`🔂 - Looping the **current song** (\`${queue.currentTrack.title}\`) !`);
        }

        if (['queue', 'all', 'q'].includes(modeArg)) {
            queue.setRepeatMode(QueueRepeatMode.QUEUE);
            return message.channel.send(`🔁 - Looping the **entire queue** (**${queue.tracks.size}** songs) !`);
        }

        if (['autoplay', 'auto'].includes(modeArg)) {
            queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            return message.channel.send(`📻 - **Autoplay mode enabled**! The bot will automatically play related songs when the queue ends.`);
        }

        if (['off', 'disable', 'none', 'stop', '0'].includes(modeArg)) {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            return message.channel.send(`${client.emotes.success} - Loop mode **disabled** !`);
        }

        // If no arg (or unknown), cycle through modes:
        // OFF -> TRACK -> QUEUE -> AUTOPLAY -> OFF
        switch (queue.repeatMode) {
            case QueueRepeatMode.OFF:
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                return message.channel.send(`🔂 - Loop mode set to: **Current Song** (\`${queue.currentTrack.title}\`) !`);
            case QueueRepeatMode.TRACK:
                queue.setRepeatMode(QueueRepeatMode.QUEUE);
                return message.channel.send(`🔁 - Loop mode set to: **Entire Queue** (**${queue.tracks.size}** songs) !`);
            case QueueRepeatMode.QUEUE:
                queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                return message.channel.send(`📻 - Loop mode set to: **Autoplay** (auto-plays similar music) !`);
            case QueueRepeatMode.AUTOPLAY:
            default:
                queue.setRepeatMode(QueueRepeatMode.OFF);
                return message.channel.send(`${client.emotes.success} - Loop mode **disabled** !`);
        }
    },
};
