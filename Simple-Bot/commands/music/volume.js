module.exports = {
    name: 'volume',
    aliases: [],
    category: 'Music',
    description: 'Sets the music playback volume (1-100%)',
    utilisation: '{prefix}volume [1-100]',

    async execute(client, message, args) {
        if (!message.member?.voice?.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.members.me.voice?.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

        const queue = client.player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.channel.send(`${client.emotes.error} - No music currently playing !`);

        if (!args[0] || isNaN(args[0])) return message.channel.send(`${client.emotes.error} - Please enter a valid number !`);

        const vol = parseInt(args[0], 10);
        if (vol < 1 || vol > 100) return message.channel.send(`${client.emotes.error} - Please enter a valid number (between 1 and 100) !`);

        queue.node.setVolume(vol);

        message.channel.send(`${client.emotes.success} - Volume set to **${vol}%** !`);
    },
};
