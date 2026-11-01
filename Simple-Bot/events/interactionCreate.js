const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { QueueRepeatMode, QueryType } = require('discord-player');
const { createPlayerComponents, createNowPlayingEmbed } = require('../utils/playerControls');

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

                await interaction.reply({ embeds: [queueEmbed], ephemeral: true });
                break;
            }

            case 'player_previous': {
                if (!queue.history.tracks.size) {
                    return interaction.reply({
                        content: `${client.emotes.error} - No previous track in history!`,
                        ephemeral: true
                    });
                }
                await queue.history.back();
                await interaction.reply({
                    content: `⏮️ - Playing previous song!`,
                    ephemeral: true
                }).catch(() => {});
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
