const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueueRepeatMode, QueryType } = require('discord-player');
const { createPlayerComponents, createNowPlayingEmbed, createJumpSelectRow } = require('../utils/playerControls');

module.exports = async (client, interaction) => {
    // Check if interaction is in a guild
    if (!interaction.guild) return;

    // Handle Modal Submissions (e.g. adding song to queue)
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'modal_add_track') {
            const memberVoice = interaction.member?.voice?.channel;
            if (!memberVoice) {
                return interaction.reply({
                    content: `${client.emotes.error} - You must be in a voice channel to add music!`,
                    ephemeral: true
                });
            }

            const query = interaction.fields.getTextInputValue('track_query');
            if (!query) {
                return interaction.reply({
                    content: `${client.emotes.error} - Please provide a valid title or URL!`,
                    ephemeral: true
                });
            }

            await interaction.deferReply({ ephemeral: true });

            try {
                const playResult = await client.player.play(memberVoice, query, {
                    requestedBy: interaction.user,
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client,
                            requestedBy: interaction.user,
                        },
                        selfDeaf: true,
                        connectionTimeout: 45000,
                        leaveOnEmpty: true,
                        leaveOnEnd: true,
                    },
                    searchEngine: QueryType.AUTO,
                });

                if (playResult?.duplicate) {
                    if (playResult.isPlaylist) {
                        return await interaction.editReply({
                            content: `⚠️ - All **${playResult.totalTracks}** songs from **${playResult.playlistTitle}** are already in the queue!`
                        });
                    }
                    if (playResult.reason === 'playing') {
                        return await interaction.editReply({
                            content: `⚠️ - **${playResult.track.title}** is already currently playing!`
                        });
                    }
                    return await interaction.editReply({
                        content: `⚠️ - **${playResult.track.title}** is already in the queue (Position **#${playResult.position}**)!`
                    });
                }

                const addedTrack = playResult?.track || (playResult?.tracks && playResult.tracks[0]);
                const title = addedTrack?.title || query;

                await interaction.editReply({
                    content: `✅ - Added **${title}** to the queue!`
                });
            } catch (err) {
                console.error('Error adding track via modal:', err);
                await interaction.editReply({
                    content: `${client.emotes.error} - Failed to add that track (${err?.message || err}).`
                });
            }
        } else if (interaction.customId === 'modal_jump_track') {
            const memberVoice = interaction.member?.voice?.channel;
            if (!memberVoice) {
                return interaction.reply({
                    content: `${client.emotes.error} - You must be in a voice channel to jump to a song!`,
                    ephemeral: true
                });
            }

            const queue = client.player?.nodes?.get(interaction.guild.id);
            if (!queue || !queue.currentTrack || queue.tracks.size === 0) {
                return interaction.reply({
                    content: `${client.emotes.error} - There are no tracks in the queue to jump to!`,
                    ephemeral: true
                });
            }

            const input = interaction.fields.getTextInputValue('jump_target')?.trim();
            if (!input) {
                return interaction.reply({
                    content: `${client.emotes.error} - Please provide a track number or song name!`,
                    ephemeral: true
                });
            }

            const tracks = queue.tracks.toArray();
            let targetIndex = -1;

            if (/^\d+$/.test(input)) {
                const num = parseInt(input, 10);
                if (num < 1 || num > tracks.length) {
                    return interaction.reply({
                        content: `${client.emotes.error} - Please specify a track number between **1** and **${tracks.length}**!`,
                        ephemeral: true
                    });
                }
                targetIndex = num - 1;
            } else {
                const lower = input.toLowerCase();
                targetIndex = tracks.findIndex(
                    t => t.title?.toLowerCase().includes(lower) || t.author?.toLowerCase().includes(lower)
                );
                if (targetIndex === -1) {
                    return interaction.reply({
                        content: `${client.emotes.error} - Couldn't find any song matching **"${input}"** in the queue!`,
                        ephemeral: true
                    });
                }
            }

            const targetTrack = tracks[targetIndex];
            queue.node.jump(targetTrack);

            return interaction.reply({
                content: `🦘 - Jumped to **#${targetIndex + 1} — ${targetTrack.title}**!`,
                ephemeral: true
            });
        }
        return;
    }

    // Handle Select Menu Interactions (e.g. jumping to a specific song from dropdown)
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'player_jump_select') {
            const memberVoice = interaction.member?.voice?.channel;
            if (!memberVoice) {
                return interaction.reply({
                    content: `${client.emotes.error} - You must be in a voice channel to use these controls!`,
                    ephemeral: true
                });
            }

            const botVoice = interaction.guild.members.me?.voice?.channel;
            if (botVoice && memberVoice.id !== botVoice.id) {
                return interaction.reply({
                    content: `${client.emotes.error} - You must be in the same voice channel (${botVoice.name})!`,
                    ephemeral: true
                });
            }

            const queue = client.player?.nodes?.get(interaction.guild.id);
            if (!queue || !queue.currentTrack || queue.tracks.size === 0) {
                return interaction.reply({
                    content: `${client.emotes.error} - There are no tracks in the queue to jump to!`,
                    ephemeral: true
                });
            }

            const selectedIndex = parseInt(interaction.values[0], 10);
            const tracks = queue.tracks.toArray();
            if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= tracks.length) {
                return interaction.reply({
                    content: `${client.emotes.error} - That song is no longer at that position in the queue!`,
                    ephemeral: true
                });
            }

            const targetTrack = tracks[selectedIndex];
            queue.node.jump(targetTrack);

            return interaction.reply({
                content: `🦘 - Jumped directly to **#${selectedIndex + 1} — ${targetTrack.title}**!`,
                ephemeral: true
            }).catch(() => {});
        }
        return;
    }

    // Only handle button interactions starting with 'player_'
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith('player_')) return;

    // Check if user is in a voice channel
    const memberVoice = interaction.member?.voice?.channel;
    if (!memberVoice) {
        return interaction.reply({
            content: `${client.emotes.error} - You must be in a voice channel to use these controls!`,
            ephemeral: true
        });
    }

    // Check if user is in the same voice channel as the bot
    const botVoice = interaction.guild.members.me?.voice?.channel;
    if (botVoice && memberVoice.id !== botVoice.id) {
        return interaction.reply({
            content: `${client.emotes.error} - You must be in the same voice channel (${botVoice.name}) to use these controls!`,
            ephemeral: true
        });
    }

    const queue = client.player?.nodes?.get(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
        return interaction.reply({
            content: `${client.emotes.error} - No music is currently playing!`,
            ephemeral: true
        });
    }

    const action = interaction.customId;

    try {
        switch (action) {
            case 'player_pause': {
                const wasPaused = queue.node.isPaused();
                if (wasPaused) {
                    queue.node.resume();
                } else {
                    queue.node.pause();
                }

                const updatedComponents = createPlayerComponents(queue);
                const updatedEmbed = createNowPlayingEmbed(client, queue, queue.currentTrack);
                await interaction.update({ embeds: [updatedEmbed], components: updatedComponents }).catch(() => {});
                break;
            }

            case 'player_skip': {
                const skippedTitle = queue.currentTrack?.title;
                queue.node.skip();
                await interaction.reply({
                    content: `${client.emotes.success} - Skipped **${skippedTitle}**!`,
                    ephemeral: true
                }).catch(() => {});
                break;
            }

            case 'player_loop': {
                switch (queue.repeatMode) {
                    case QueueRepeatMode.OFF:
                        queue.setRepeatMode(QueueRepeatMode.TRACK);
                        break;
                    case QueueRepeatMode.TRACK:
                        queue.setRepeatMode(QueueRepeatMode.QUEUE);
                        break;
                    case QueueRepeatMode.QUEUE:
                        queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                        break;
                    case QueueRepeatMode.AUTOPLAY:
                    default:
                        queue.setRepeatMode(QueueRepeatMode.OFF);
                        break;
                }

                const updatedComponents = createPlayerComponents(queue);
                const updatedEmbed = createNowPlayingEmbed(client, queue, queue.currentTrack);
                await interaction.update({ embeds: [updatedEmbed], components: updatedComponents }).catch(() => {});
                break;
            }

            case 'player_shuffle': {
                if (queue.tracks.size < 2) {
                    return interaction.reply({
                        content: `${client.emotes.error} - Not enough tracks in queue to shuffle!`,
                        ephemeral: true
                    });
                }
                queue.tracks.shuffle();
                await interaction.reply({
                    content: `${client.emotes.success} - Shuffled **${queue.tracks.size}** songs in queue!`,
                    ephemeral: true
                }).catch(() => {});
                break;
            }

            case 'player_stop': {
                queue.delete();
                await interaction.update({
                    content: `${client.emotes.success} - Music playback stopped by ${interaction.user.username}!`,
                    embeds: [],
                    components: []
                }).catch(() => {});
                break;
            }

            case 'player_add_queue': {
                const modal = new ModalBuilder()
                    .setCustomId('modal_add_track')
                    .setTitle('Add Song to Queue');

                const trackInput = new TextInputBuilder()
                    .setCustomId('track_query')
                    .setLabel('Song Title, Artist, or URL')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('e.g. Bohemian Rhapsody or YouTube / SoundCloud link')
                    .setRequired(true);

                const modalRow = new ActionRowBuilder().addComponents(trackInput);
                modal.addComponents(modalRow);

                await interaction.showModal(modal);
                break;
            }

            case 'player_view_queue': {
                const tracks = queue.tracks.toArray();
                const current = queue.currentTrack;

                const trackList = tracks.slice(0, 10).map((t, idx) => `**#${idx + 1}** - [${t.title}](${t.url}) | \`${t.duration}\``).join('\n');

                const queueEmbed = new EmbedBuilder()
                    .setColor('Orange')
                    .setTitle(`🎶 Queue for ${interaction.guild.name}`)
                    .setDescription(`**Now Playing:**\n[${current.title}](${current.url}) | \`${current.duration}\`\n\n**Up Next:**\n${trackList || '*No other tracks in queue.*'}${tracks.length > 10 ? `\n\n*...and ${tracks.length - 10} more songs.*` : ''}`)
                    .addFields(
                        { name: 'Total In Queue', value: `${tracks.length} song(s)`, inline: true },
                        { name: 'Queue Duration', value: `${queue.durationFormatted || 'Unknown'}`, inline: true }
                    );

                const jumpRow = createJumpSelectRow(queue, 0, 25);
                await interaction.reply({
                    embeds: [queueEmbed],
                    components: jumpRow ? [jumpRow] : [],
                    ephemeral: true
                });
                break;
            }

            case 'player_jump': {
                if (queue.tracks.size === 0) {
                    return interaction.reply({
                        content: `${client.emotes.error} - There are no other tracks in the queue to jump to!`,
                        ephemeral: true
                    });
                }

                const jumpSelectRow = createJumpSelectRow(queue, 0, 25);
                const modalBtnRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('player_jump_modal')
                        .setLabel('Search by # or Song Name')
                        .setEmoji('🔢')
                        .setStyle(ButtonStyle.Primary)
                );

                const components = [];
                if (jumpSelectRow) components.push(jumpSelectRow);
                components.push(modalBtnRow);

                await interaction.reply({
                    content: `🦘 **Jump to Song** — Pick a track from the dropdown below${queue.tracks.size > 25 ? ` (showing first 25 of ${queue.tracks.size})` : ''} or click **Search by # or Song Name**:`,
                    components,
                    ephemeral: true
                });
                break;
            }

            case 'player_jump_modal': {
                const modal = new ModalBuilder()
                    .setCustomId('modal_jump_track')
                    .setTitle('Jump to Song in Queue');

                const targetInput = new TextInputBuilder()
                    .setCustomId('jump_target')
                    .setLabel(`Track Number (1-${queue.tracks.size}) or Song Name`)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('e.g. 5 or Bohemian Rhapsody')
                    .setRequired(true);

                const modalRow = new ActionRowBuilder().addComponents(targetInput);
                modal.addComponents(modalRow);

                await interaction.showModal(modal);
                break;
            }

            case 'player_previous': {
                if (queue.history.tracks.size > 0) {
                    const prevTrack = queue.history.previousTrack;
                    await queue.history.back();
                    await interaction.reply({
                        content: `⏮️ - Playing previous song${prevTrack?.title ? `: **${prevTrack.title}**` : ''}!`,
                        ephemeral: true
                    }).catch(() => {});
                } else {
                    await queue.node.seek(0);
                    await interaction.reply({
                        content: `⏮️ - No previous track in history — restarted **${queue.currentTrack.title}** from the beginning!`,
                        ephemeral: true
                    }).catch(() => {});
                }
                break;
            }

            case 'player_clear_queue': {
                if (!queue.tracks.size) {
                    return interaction.reply({
                        content: `${client.emotes.error} - The queue is already empty!`,
                        ephemeral: true
                    });
                }
                const count = queue.tracks.size;
                queue.tracks.clear();

                const updatedComponents = createPlayerComponents(queue);
                const updatedEmbed = createNowPlayingEmbed(client, queue, queue.currentTrack);
                await interaction.update({ embeds: [updatedEmbed], components: updatedComponents }).catch(() => {});
                break;
            }

            default:
                break;
        }
    } catch (error) {
        console.error('Error handling player button:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: `${client.emotes.error} - An error occurred while executing that action!`,
                ephemeral: true
            }).catch(() => {});
        }
    }
};
