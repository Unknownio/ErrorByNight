const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

function createPlayerComponents(queue) {
    const isPaused = queue?.node?.isPaused?.() || false;
    const repeatMode = queue?.repeatMode || QueueRepeatMode.OFF;

    let loopLabel = 'Loop: Off';
    let loopEmoji = '🔁';
    let loopStyle = ButtonStyle.Secondary;

    if (repeatMode === QueueRepeatMode.TRACK) {
        loopLabel = 'Loop: Song';
        loopEmoji = '🔂';
        loopStyle = ButtonStyle.Primary;
    } else if (repeatMode === QueueRepeatMode.QUEUE) {
        loopLabel = 'Loop: Queue';
        loopEmoji = '🔁';
        loopStyle = ButtonStyle.Success;
    } else if (repeatMode === QueueRepeatMode.AUTOPLAY) {
        loopLabel = 'Autoplay';
        loopEmoji = '📻';
        loopStyle = ButtonStyle.Primary;
    }

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('player_previous')
            .setLabel('Previous')
            .setEmoji('⏮️')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('player_pause')
            .setLabel(isPaused ? 'Resume' : 'Pause')
            .setEmoji(isPaused ? '▶️' : '⏸️')
            .setStyle(isPaused ? ButtonStyle.Success : ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('player_skip')
            .setLabel('Skip')
            .setEmoji('⏭️')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('player_loop')
            .setLabel(loopLabel)
            .setEmoji(loopEmoji)
            .setStyle(loopStyle),
        new ButtonBuilder()
            .setCustomId('player_stop')
            .setLabel('Stop')
            .setEmoji('⏹️')
            .setStyle(ButtonStyle.Danger)
    );

    const queueSize = queue?.tracks?.size || 0;

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('player_add_queue')
            .setLabel('Add to Queue')
            .setEmoji('➕')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('player_view_queue')
            .setLabel(`Queue (${queueSize})`)
            .setEmoji('📜')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('player_jump')
            .setLabel('Jump')
            .setEmoji('🦘')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(queueSize === 0),
        new ButtonBuilder()
            .setCustomId('player_shuffle')
            .setLabel('Shuffle')
            .setEmoji('🔀')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('player_clear_queue')
            .setLabel('Clear Queue')
            .setEmoji('🗑️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(queueSize === 0)
    );

    return [row1, row2];
}

// Kept for backward compatibility
function createPlayerRow(queue) {
    return createPlayerComponents(queue)[0];
}

function createNowPlayingEmbed(client, queue, track) {
    const progress = queue?.node?.createProgressBar?.({ timecodes: true }) || '';
    const voiceChannelName = queue.channel?.name || 'Voice Channel';

    let loopStatus = 'Off';
    if (queue?.repeatMode === QueueRepeatMode.TRACK) loopStatus = '🔂 Song';
    else if (queue?.repeatMode === QueueRepeatMode.QUEUE) loopStatus = '🔁 Queue';
    else if (queue?.repeatMode === QueueRepeatMode.AUTOPLAY) loopStatus = '📻 Autoplay';

    const requestedByUser = track?.requestedBy?.username 
        || (typeof track?.requestedBy === 'string' ? track.requestedBy : null)
        || queue?.metadata?.requestedBy?.username 
        || (queue?.repeatMode === QueueRepeatMode.AUTOPLAY ? '📻 Autoplay' : 'Unknown');

    const embed = new EmbedBuilder()
        .setColor('Orange')
        .setAuthor({ name: 'Now Playing 🎵' })
        .setTitle(track?.title || 'Unknown Title')
        .setURL(track?.url || null)
        .addFields(
            { name: 'Channel', value: track?.author || 'Unknown', inline: true },
            { name: 'Requested By', value: requestedByUser, inline: true },
            { name: 'Duration', value: track?.duration || 'Live', inline: true },
            { name: 'Voice Channel', value: `🔊 ${voiceChannelName}`, inline: true },
            { name: 'Volume', value: `${queue?.node?.volume || 100}%`, inline: true },
            { name: 'Loop', value: loopStatus, inline: true }
        )
        .setFooter({ text: 'Use the buttons below to control playback and queue' })
        .setTimestamp();

    if (progress) {
        embed.setDescription(`\`\`\`\n${progress}\n\`\`\``);
    }

    if (track?.thumbnail) {
        embed.setThumbnail(track.thumbnail);
    }

    return embed;
}

function createJumpSelectRow(queue, startOffset = 0, maxItems = 25) {
    const tracks = queue?.tracks?.toArray?.() || [];
    const slice = tracks.slice(startOffset, startOffset + Math.min(maxItems, 25));
    if (slice.length === 0) return null;

    const select = new StringSelectMenuBuilder()
        .setCustomId('player_jump_select')
        .setPlaceholder('🦘 Select a song from the queue to jump to...')
        .addOptions(
            slice.map((track, idx) => {
                const pos = startOffset + idx + 1;
                const rawLabel = `#${pos} - ${track.title || 'Unknown Title'}`;
                const rawDesc = `${track.author || 'Unknown'} • ${track.duration || 'Live'}`;
                return {
                    label: rawLabel.length > 100 ? rawLabel.slice(0, 97) + '...' : rawLabel,
                    description: rawDesc.length > 100 ? rawDesc.slice(0, 97) + '...' : rawDesc,
                    value: String(startOffset + idx),
                    emoji: '🎵'
                };
            })
        );

    return new ActionRowBuilder().addComponents(select);
}

module.exports = {
    createPlayerRow,
    createPlayerComponents,
    createNowPlayingEmbed,
    createJumpSelectRow
};
