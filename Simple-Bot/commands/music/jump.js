const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { createJumpSelectRow } = require('../../utils/playerControls');

module.exports = {
    name: 'jump',
    aliases: ['j', 'goto'],
    category: 'Music',
    description: 'Jumps directly to a specific song in the queue by number, song name, or dropdown menu without deleting earlier songs',
    utilisation: '{prefix}jump [track # or song name]',

    async execute(client, message, args) {
        if (!message.member?.voice?.channel) {
            return message.channel.send(`${client.emotes.error} - You're not in a voice channel!`);
        }

        if (message.guild.members.me.voice?.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) {
            return message.channel.send(`${client.emotes.error} - You are not in the same voice channel!`);
        }

        const queue = client.player.nodes.get(message.guild.id);
        if (!queue || !queue.currentTrack) {
            return message.channel.send(`${client.emotes.error} - No music currently playing!`);
        }

        const tracks = queue.tracks.toArray();
        if (tracks.length === 0) {
            return message.channel.send(`${client.emotes.error} - There are no other tracks in the queue to jump to!`);
        }

        // If no argument provided, show interactive dropdown menu to pick a song
        if (!args[0]) {
            const selectRow = createJumpSelectRow(queue, 0, 25);
            const components = [];
            if (selectRow) components.push(selectRow);

            const modalBtnRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('player_jump_modal')
                    .setLabel('Search by # or Song Name')
                    .setEmoji('🔢')
                    .setStyle(ButtonStyle.Primary)
            );
            components.push(modalBtnRow);

            return message.channel.send({
                content: `🦘 **Jump to Song** — Select a track below or type \`${client.config.prefix}jump <number or song name>\`:`,
                components
            });
        }

        const input = args.join(' ').trim();
        let targetIndex = -1;

        // Check if user passed a track number
        if (/^\d+$/.test(input)) {
            const num = parseInt(input, 10);
            if (num < 1 || num > tracks.length) {
                return message.channel.send(`${client.emotes.error} - Please specify a track number between **1** and **${tracks.length}**!`);
            }
            targetIndex = num - 1;
        } else {
            // Search by song title or author in queue
            const lower = input.toLowerCase();
            targetIndex = tracks.findIndex(
                t => t.title?.toLowerCase().includes(lower) || t.author?.toLowerCase().includes(lower)
            );
            if (targetIndex === -1) {
                return message.channel.send(`${client.emotes.error} - Couldn't find any song matching **"${input}"** in the current queue!`);
            }
        }

        const targetTrack = tracks[targetIndex];
        queue.node.jump(targetTrack);

        return message.channel.send(`🦘 - Jumped to **#${targetIndex + 1} — ${targetTrack.title}**!`);
    },
};
