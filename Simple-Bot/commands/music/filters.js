const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'filters',
    aliases: ['w-filters'],
    category: 'Music',
    description: 'Displays all 23 available audio filters and their real-time enabled status',
    utilisation: '{prefix}filters',

    async execute(client, message) {
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

        const disabledEmoji = client.emotes.error;
        const enabledEmoji = client.emotes.success;

        const filtersMap = client.filters || require('../../config/filters.json');
        const filtersList = Object.keys(filtersMap);
        const mid = Math.ceil(filtersList.length / 2);
        const col1 = [];
        const col2 = [];

        // Fetch enabled filters directly and lowercase them for robust comparison
        const enabledFilters = (queue.filters?.ffmpeg?.getFiltersEnabled?.() || queue.filters?.ffmpeg?.filters || []).map(f => f.toLowerCase());

        filtersList.forEach((filterName, i) => {
            const isEnabled = enabledFilters.includes(filterName.toLowerCase());
            const status = `${filtersMap[filterName]}: ${isEnabled ? enabledEmoji : disabledEmoji}`;
            if (i < mid) col1.push(status);
            else col2.push(status);
        });

        const activeCount = enabledFilters.length;

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setAuthor({ name: `Audio Filters (Active: ${activeCount})` })
            .setFooter({ text: 'This bot uses a Github project made by Unknownio (Unknownio/SimpleBot)' })
            .addFields(
                { name: 'Filters', value: col1.join('\n') || 'None', inline: true },
                { name: '** **', value: col2.join('\n') || 'None', inline: true },
            )
            .setTimestamp()
            .setDescription(`Toggle any filter with \`${client.config.prefix}filter <name>\` (e.g. \`${client.config.prefix}filter 8D\`).\nDisable all filters with \`${client.config.prefix}filter off\`.`);

        await message.channel.send({ embeds: [embed] });
    },
};
