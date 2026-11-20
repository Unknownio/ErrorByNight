/**
 * Extracts a canonical identifier for a track URL (e.g. YouTube video ID, SoundCloud path, Spotify track ID)
 */
function extractTrackKey(url) {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();

    try {
        const parsed = new URL(trimmed);
        const host = parsed.hostname.replace(/^(www\.|music\.|m\.)/i, '').toLowerCase();

        // YouTube (youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID)
        if (host === 'youtube.com' || host === 'youtu.be') {
            let videoId = null;
            if (host === 'youtu.be') {
                videoId = parsed.pathname.split('/').filter(Boolean)[0];
            } else if (parsed.pathname === '/watch') {
                videoId = parsed.searchParams.get('v');
            } else if (parsed.pathname.startsWith('/shorts/') || parsed.pathname.startsWith('/embed/')) {
                videoId = parsed.pathname.split('/')[2];
            }
            if (videoId) {
                return `yt:${videoId}`;
            }
        }

        // SoundCloud
        if (host === 'soundcloud.com') {
            const cleanPath = parsed.pathname.replace(/\/+$/, '').toLowerCase();
            if (cleanPath) {
                return `sc:${cleanPath}`;
            }
        }

        // Spotify
        if (host === 'open.spotify.com') {
            const cleanPath = parsed.pathname.replace(/\/+$/, '');
            if (cleanPath) {
                return `sp:${cleanPath}`;
            }
        }

        return `${host}${parsed.pathname.replace(/\/+$/, '')}`.toLowerCase();
    } catch {
        return trimmed.toLowerCase();
    }
}

/**
 * Checks whether two Track objects represent the same song
 */
function isSameTrack(trackA, trackB) {
    if (!trackA || !trackB) return false;

    const keyA = extractTrackKey(trackA.url);
    const keyB = extractTrackKey(trackB.url);

    if (keyA && keyB && keyA === keyB) {
        return true;
    }

    const titleA = trackA.title?.toLowerCase().replace(/\s+/g, ' ').trim();
    const titleB = trackB.title?.toLowerCase().replace(/\s+/g, ' ').trim();
    const authorA = trackA.author?.toLowerCase().replace(/\s+/g, ' ').trim();
    const authorB = trackB.author?.toLowerCase().replace(/\s+/g, ' ').trim();

    if (titleA && titleB && titleA === titleB && authorA && authorB && authorA === authorB) {
        return true;
    }

    return false;
}

/**
 * Checks if a track is already playing or queued in the given GuildQueue.
 * Returns null if not a duplicate, or an object describing where the duplicate is.
 */
function findDuplicateInQueue(queue, candidateTrack) {
    if (!queue || !candidateTrack) return null;

    if (queue.currentTrack && isSameTrack(queue.currentTrack, candidateTrack)) {
        return {
            reason: 'playing',
            track: queue.currentTrack,
            position: 0
        };
    }

    const queuedTracks = queue.tracks ? queue.tracks.toArray() : [];
    for (let i = 0; i < queuedTracks.length; i++) {
        if (isSameTrack(queuedTracks[i], candidateTrack)) {
            return {
                reason: 'queued',
                track: queuedTracks[i],
                position: i + 1
            };
        }
    }

    return null;
}

/**
 * Filters a list of incoming playlist tracks against the current queue and against itself
 * so no duplicate songs are queued.
 */
function filterUniqueTracks(queue, incomingTracks) {
    const uniqueTracks = [];
    let skippedCount = 0;

    for (const track of incomingTracks) {
        const inQueue = findDuplicateInQueue(queue, track);
        const inBatch = uniqueTracks.some(accepted => isSameTrack(accepted, track));

        if (inQueue || inBatch) {
            skippedCount++;
        } else {
            uniqueTracks.push(track);
        }
    }

    return {
        uniqueTracks,
        skippedCount,
        totalTracks: incomingTracks.length
    };
}

module.exports = {
    extractTrackKey,
    isSameTrack,
    findDuplicateInQueue,
    filterUniqueTracks
};
