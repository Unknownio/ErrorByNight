const { BaseExtractor, Track, Playlist } = require('discord-player');
const { Ytdl } = require('@distube/ytdl-core');

const ytdl = new Ytdl();

class PlayDlExtractor extends BaseExtractor {
    static get identifier() {
        return 'com.discord-player.playdlextractor';
    }

    async validate(query, type) {
        if (typeof query !== 'string') return false;
        const isUrl = /^https?:\/\//i.test(query.trim());
        if (isUrl) {
            return /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.be)\//i.test(query.trim());
        }
        return true;
    }

    async getRelatedTracks(track) {
        return [];
    }

    async handle(query, context) {
        console.log('PlayDlExtractor handling query:', query);
        try {
            const trimmed = query.trim();
            const isUrl = /^https?:\/\/(www\.|music\.)?(youtube\.com|youtu\.be)\//i.test(trimmed);

            if (isUrl) {
                // Check if URL contains a playlist parameter (list=)
                if (trimmed.includes('list=')) {
                    try {
                        console.log('Detected YouTube playlist URL, fetching:', trimmed);
                        const playlistData = await ytdl.getPlaylist(trimmed, { limit: 100 });
                        const videoItems = playlistData.videos || playlistData.items || [];

                        if (videoItems.length > 0) {
                            const tracks = videoItems.map(video => {
                                const thumbnail = Array.isArray(video.thumbnails) && video.thumbnails.length > 0
                                    ? video.thumbnails[video.thumbnails.length - 1].url
                                    : (video.thumbnail || null);

                                return new Track(this.context.player, {
                                    title: video.title || 'Unknown YouTube Track',
                                    description: video.title || '',
                                    author: video.author?.name || playlistData.author?.name || 'YouTube',
                                    url: video.url,
                                    thumbnail: thumbnail,
                                    duration: video.lengthSeconds ? `${video.lengthSeconds}s` : '0s',
                                    views: video.viewCount || 0,
                                    requestedBy: context.requestedBy,
                                    source: 'youtube'
                                });
                            });

                            const playlist = new Playlist(this.context.player, {
                                title: playlistData.title || 'YouTube Playlist',
                                description: playlistData.description || playlistData.title || 'YouTube Playlist',
                                thumbnail: Array.isArray(playlistData.thumbnails) && playlistData.thumbnails.length > 0
                                    ? playlistData.thumbnails[playlistData.thumbnails.length - 1].url
                                    : null,
                                type: 'playlist',
                                source: 'youtube',
                                author: {
                                    name: playlistData.author?.name || 'YouTube',
                                    url: playlistData.author?.url || null
                                },
                                id: playlistData.id,
                                url: playlistData.url || trimmed,
                                tracks
                            });

                            console.log(`Successfully loaded YouTube playlist "${playlist.title}" with ${tracks.length} tracks.`);
                            return this.createResponse(playlist, tracks);
                        }
                    } catch (e) {
                        console.warn('Playlist fetch failed or not found, falling back to single video:', e.message);
                    }
                }

                // Single video extraction
                const info = await ytdl.getInfo(trimmed);
                const track = new Track(this.context.player, {
                    title: info.videoDetails.title,
                    description: info.videoDetails.description || info.videoDetails.title,
                    author: info.videoDetails.author?.name || 'YouTube',
                    url: info.videoDetails.video_url || trimmed,
                    thumbnail: info.videoDetails.thumbnails?.[info.videoDetails.thumbnails.length - 1]?.url || info.videoDetails.thumbnails?.[0]?.url,
                    duration: `${info.videoDetails.lengthSeconds}s`,
                    views: parseInt(info.videoDetails.viewCount, 10) || 0,
                    requestedBy: context.requestedBy,
                    source: 'youtube'
                });
                return this.createResponse(null, [track]);
            } else {
                // If query asks for a playlist specifically
                if (/^(playlist:|ytplaylist:)/i.test(trimmed)) {
                    const searchTerm = trimmed.replace(/^(playlist:|ytplaylist:)/i, '').trim();
                    try {
                        const playlistResults = await ytdl.search(searchTerm, { type: 'playlist' });
                        if (playlistResults && playlistResults.length > 0 && playlistResults[0].url) {
                            const firstPlaylist = playlistResults[0];
                            console.log('Found YouTube playlist via search:', firstPlaylist.title, firstPlaylist.url);
                            const playlistData = await ytdl.getPlaylist(firstPlaylist.url, { limit: 100 });
                            const videoItems = playlistData.videos || playlistData.items || [];

                            if (videoItems.length > 0) {
                                const tracks = videoItems.map(video => {
                                    const thumbnail = Array.isArray(video.thumbnails) && video.thumbnails.length > 0
                                        ? video.thumbnails[video.thumbnails.length - 1].url
                                        : null;

                                    return new Track(this.context.player, {
                                        title: video.title || 'Unknown Track',
                                        description: video.title || '',
                                        author: video.author?.name || playlistData.author?.name || 'YouTube',
                                        url: video.url,
                                        thumbnail: thumbnail,
                                        duration: video.lengthSeconds ? `${video.lengthSeconds}s` : '0s',
                                        views: video.viewCount || 0,
                                        requestedBy: context.requestedBy,
                                        source: 'youtube'
                                    });
                                });

                                const playlist = new Playlist(this.context.player, {
                                    title: playlistData.title || firstPlaylist.title,
                                    description: playlistData.description || firstPlaylist.title,
                                    thumbnail: firstPlaylist.thumbnails?.[0]?.url || null,
                                    type: 'playlist',
                                    source: 'youtube',
                                    author: {
                                        name: playlistData.author?.name || firstPlaylist.author?.name || 'YouTube',
                                        url: playlistData.author?.url || null
                                    },
                                    id: playlistData.id || firstPlaylist.id,
                                    url: playlistData.url || firstPlaylist.url,
                                    tracks
                                });

                                return this.createResponse(playlist, tracks);
                            }
                        }
                    } catch (e) {
                        console.warn('Playlist search failed, falling back to standard video search:', e.message);
                    }
                }

                // Standard video search
                const results = await ytdl.search(trimmed);
                if (!results || results.length === 0) {
                    console.log('No results found for query:', trimmed);
                    return this.createResponse(null, []);
                }

                console.log(`Found ${results.length} results`);

                const tracks = results.slice(0, 10).map(video => new Track(this.context.player, {
                    title: video.title,
                    description: video.title,
                    author: video.author?.name || 'YouTube',
                    url: video.url,
                    thumbnail: video.thumbnails?.[video.thumbnails.length - 1]?.url || video.thumbnails?.[0]?.url,
                    duration: `${video.lengthSeconds}s`,
                    views: video.viewCount || 0,
                    requestedBy: context.requestedBy,
                    source: 'youtube'
                }));

                return this.createResponse(null, tracks);
            }
        } catch (error) {
            console.error('PlayDlExtractor error:', error);
            return this.createResponse(null, []);
        }
    }

    async stream(info) {
        return await ytdl.download(info.url, {
            filter: { hasAudio: true, hasVideo: false },
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });
    }
}

module.exports = PlayDlExtractor;
