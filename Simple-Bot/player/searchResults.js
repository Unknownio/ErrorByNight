const { EmbedBuilder } = require('discord.js');

module.exports = async (client, message, query, tracks) => {
    const embed = new EmbedBuilder()
        .setColor('Blue')
        .setAuthor({ name: `Here are your search results for ${query}` })
        .setFooter({ text: 'This bot uses a Github project made by Unknownio (Unknownio/ErrorByNight)' })
        .setTimestamp()
        .setDescription(tracks?.map((t, i) => `**${i + 1}** - ${t.title}`).join('\n') || 'No tracks found');

    await message.channel.send({ embeds: [embed] });
};
