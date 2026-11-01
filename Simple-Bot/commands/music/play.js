const { QueryType } = require('discord-player');

module.exports = {
	name: 'play',
	aliases: ['p'],
	category: 'Music',
	description: 'Plays a song or playlist from YouTube, SoundCloud, or search term (also auto-plays raw URLs dropped in chat)',
	utilisation: '{prefix}play [name/URL]',

	async execute(client, message, args) {
		// Ensure member is fetched
		if (!message.member) {
			await message.guild.members.fetch(message.author.id);
		}

		if (!message.member?.voice?.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

		if (message.guild.members.me.voice?.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

		if (!args[0]) return message.channel.send(`${client.emotes.error} - Please indicate the title of a song !`);

		const query = args.join(' ');

		try {
			await client.player.play(message.member.voice.channel, query, {
				requestedBy: message.author,
				nodeOptions: {
					metadata: {
						channel: message.channel,
						client,
						requestedBy: message.author,
					},
					selfDeaf: true,
					connectionTimeout: 45000,
					leaveOnEmpty: true,
					leaveOnEnd: true,
				},
				searchEngine: QueryType.AUTO,
			});

			message.react('✅').catch(() => undefined);
		} catch (error) {
			console.error('Play command failed:', error);
			return message.channel.send(`${client.emotes.error} - I couldn't play that track (${error?.message || error}). Try again!`);
		}
	},
};
