const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h', 'commands'],
    category: 'Core',
    description: 'Displays all bot commands and interactive features',
    utilisation: '{prefix}help [command name]',

    async execute(client, message, args) {
        const prefix = client.config.prefix;

        if (!args[0]) {
            const musicCmds = message.client.commands
                .filter(c => c.category === 'Music')
                .map(c => `\`${c.name}\``)
                .join(', ');

            const infoCmds = message.client.commands
                .filter(c => c.category === 'Infos' || c.category === 'Core')
                .map(c => `\`${c.name}\``)
                .join(', ');

            const embed = new EmbedBuilder()
                .setColor('Orange')
                .setAuthor({ name: `${client.user.username} - Command & Feature Guide`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`Prefix for this server is \`${prefix}\`\nUse \`${prefix}help <command>\` for detailed usage instructions.`)
                .addFields(
                    { 
                        name: '🎶 Music Commands', 
                        value: musicCmds || 'None', 
                        inline: false 
                    },
                    { 
                        name: 'ℹ️ General & Info', 
                        value: infoCmds || 'None', 
                        inline: false 
                    },
                    {
                        name: '✨ Interactive Features',
                        value: [
                            '• **Raw URL Auto-Play**: Drop any YouTube, SoundCloud, or Spotify link into chat while in voice to play immediately without typing `.play`!',
                            '• **Button Controls**: Interactive buttons under Now Playing (`Pause`, `Skip`, `Loop`, `Shuffle`, `Stop`, `Add Song`, `Queue`, `Previous`, `Clear`).',
                            '• **➕ Add to Queue Modal**: Click the button under Now Playing to open a popup and queue any track.',
                            '• **🔁 4-State Loop**: Supports `Song` (🔂), `Queue` (🔁), `Autoplay` (📻), and `Off`.',
                            '• **📑 YouTube Playlists**: Full support for playlist URLs and searching playlists via `.playlist <name>`.',
                            '• **🎚️ 23 Audio Filters**: `.filters` to see real-time active filters; `.filter <name>` to toggle (`8D`, `bassboost`, `nightcore`, etc.).'
                        ].join('\n'),
                        inline: false
                    }
                )
                .setFooter({ text: `Total Commands: ${client.commands.size} | ErrorByNight Simple-Bot` })
                .setTimestamp();

            return message.channel.send({ embeds: [embed] });
        }

        const query = args.join(' ').toLowerCase();
        const command = message.client.commands.get(query) || 
                        message.client.commands.find(c => c.aliases && c.aliases.includes(query));

        if (!command) {
            return message.channel.send(`${client.emotes.error} - Command \`${args.join(' ')}\` not found! Use \`${prefix}help\` to see all commands.`);
        }

        // Example helpers for popular commands
        const examples = {
            'play': `${prefix}play Bohemian Rhapsody\n${prefix}play https://youtu.be/...\nhttps://youtu.be/... (drop raw URL in chat)`,
            'playlist': `${prefix}playlist https://www.youtube.com/playlist?list=PL...\n${prefix}playlist lofi hip hop`,
            'playnext': `${prefix}playnext Shape of You`,
            'queue': `${prefix}queue\n${prefix}queue 2`,
            'remove': `${prefix}remove 3`,
            'skipto': `${prefix}skipto 4`,
            'loop': `${prefix}loop (cycles mode)\n${prefix}loop song\n${prefix}loop queue\n${prefix}loop autoplay\n${prefix}loop off`,
            'filter': `${prefix}filter 8D\n${prefix}filter bassboost\n${prefix}filter off`,
            'filters': `${prefix}filters`,
            'volume': `${prefix}volume 75`
        };

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setAuthor({ name: `Command: ${command.name}` })
            .addFields(
                { name: 'Description', value: command.description || 'No description provided.', inline: false },
                { name: 'Category', value: command.category || 'General', inline: true },
                { name: 'Aliases', value: command.aliases && command.aliases.length > 0 ? command.aliases.map(a => `\`${a}\``).join(', ') : 'None', inline: true },
                { name: 'Usage', value: command.utilisation ? `\`${command.utilisation.replace('{prefix}', prefix)}\`` : `\`${prefix}${command.name}\``, inline: false }
            )
            .setFooter({ text: 'Mandatory arguments: [arg] | Optional: <arg>' })
            .setTimestamp();

        if (examples[command.name]) {
            embed.addFields({ name: 'Examples', value: `\`\`\`\n${examples[command.name]}\n\`\`\``, inline: false });
        }

        return message.channel.send({ embeds: [embed] });
    },
};
