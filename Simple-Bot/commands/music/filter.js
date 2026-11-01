module.exports = {
    name: 'filter',
    aliases: [],
    category: 'Music',
    description: 'Toggles an audio filter (e.g. 8D, bassboost, nightcore) or turns filters off',
    utilisation: '{prefix}filter [filter name / off]',

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

        if (!queue.filters?.ffmpeg) {
            return message.channel.send(`${client.emotes.error} - Filters are not available on this player !`);
        }

        if (!args[0]) {
            return message.channel.send(`${client.emotes.error} - Please specify a filter name (e.g. \`8D\`, \`bassboost\`, \`nightcore\`) or use \`${client.config.prefix}filters\` to see all filters!`);
        }

        const input = args[0].trim();
        const filtersMap = client.filters || require('../../config/filters.json');

        // Option to reset/disable all filters
        if (['off', 'clear', 'reset', 'disable'].includes(input.toLowerCase())) {
            await queue.filters.ffmpeg.setFilters([]);
            return message.channel.send(`${client.emotes.success} - All audio filters have been **disabled** !`);
        }

        // Case-insensitive match against registered filters
        const filterKey = Object.keys(filtersMap).find(
            f => f.toLowerCase() === input.toLowerCase()
        ) || (queue.filters.ffmpeg.isValidFilter(input) ? input : null);

        if (!filterKey) {
            return message.channel.send(`${client.emotes.error} - Filter **${input}** does not exist ! Use \`${client.config.prefix}filters\` to see available filters.`);
        }

        try {
            await queue.filters.ffmpeg.toggle(filterKey);
            const enabledList = (queue.filters.ffmpeg.getFiltersEnabled?.() || queue.filters.ffmpeg.filters || []).map(f => f.toLowerCase());
            const isNowEnabled = enabledList.includes(filterKey.toLowerCase());

            message.channel.send(`${client.emotes.music} - Filter **${filtersMap[filterKey] || filterKey}** is now ${isNowEnabled ? '**enabled**' : '**disabled**'} ! (The music will seamlessly adjust)`);
        } catch (error) {
            console.error('Error toggling filter:', error);
            return message.channel.send(`${client.emotes.error} - Failed to apply filter **${input}**: ${error.message}`);
        }
    },
};
