# ErrorByNight

**ErrorByNight** (by [Unknownio](https://github.com/Unknownio)) is a multi-project repository containing a modern Discord music bot alongside a Windows batch prank utility.

## Projects Overview

| Project | Platform / Stack | Description |
| :--- | :--- | :--- |
| [`Simple-Bot/`](Simple-Bot/) | Node.js / Discord.js v14 | Full-featured Discord music bot with interactive controls, 23 audio filters, YouTube/SoundCloud/Spotify playback, duplicate guard, and optional YouTube upload notifications. |
| [`FakeVirus/`](FakeVirus/) | Windows Batch | Shutdown-prank documentation and a `cancel the operation.bat` helper that aborts a pending Windows shutdown (`shutdown -a`). |

## Repository Structure

```text
ErrorByNight/
├── .github/
│   └── workflows/
│       └── codeql-analysis.yml
├── FakeVirus/
│   ├── README.md
│   └── cancel the operation.bat
├── Simple-Bot/
│   ├── Hi (come here if your installing the bot)/
│   ├── Security/
│   ├── commands/
│   │   ├── core/
│   │   ├── infos/
│   │   ├── music/
│   │   └── warn/
│   ├── config/
│   │   ├── emojis.json
│   │   └── filters.json
│   ├── events/
│   ├── extractors/
│   │   └── PlayDlExtractor.js
│   ├── player/
│   ├── utils/
│   │   ├── playerControls.js
│   │   └── queueUtils.js
│   ├── LICENSE
│   ├── Procfile
│   ├── index.js
│   ├── package.json
│   └── start.bat
├── README.md
└── SECURITY.md
```

---

## `Simple-Bot` — Discord Music & Utility Bot

A modernized Discord music bot built on `discord.js` v14 and `discord-player` v7 with interactive buttons, select menus, modals, and multi-platform audio playback.

### Tech Stack

- **Runtime:** Node.js `>= 18.0.0`
- **Discord & Voice:** `discord.js` (`^14.16.3`), `discord-player` (`^7.1.0`), `@discordjs/voice`, `@snazzah/davey` (DAVE / E2EE voice protocol support)
- **Audio Extractors & Transcoding:** `@distube/ytdl-core` via custom [`extractors/PlayDlExtractor.js`](Simple-Bot/extractors/PlayDlExtractor.js), `@discord-player/extractor` (`DefaultExtractors` for SoundCloud, Spotify, Apple Music, attachments, etc.), `ffmpeg-static`
- **Web & Notifications:** `express` (keep-alive HTTP server), optional `youtube-notification`

### Key Features

- **Interactive Player Controls** ([`utils/playerControls.js`](Simple-Bot/utils/playerControls.js), [`events/interactionCreate.js`](Simple-Bot/events/interactionCreate.js)): Now Playing embeds include two rows of interactive buttons (`Previous`, `Pause`/`Resume`, `Skip`, 4-state `Loop`, `Stop`, `Add to Queue` modal, `Queue` viewer with dropdown, `Jump` dropdown + search modal, `Shuffle`, `Clear Queue`).
- **Raw URL Auto-Play** ([`events/message.js`](Simple-Bot/events/message.js)): Dropping a YouTube (`youtube.com`, `youtu.be`, `music.youtube.com`), SoundCloud, or Spotify link directly into chat while connected to a voice channel queues or plays it automatically without a command prefix.
- **Duplicate Song Guard** ([`utils/queueUtils.js`](Simple-Bot/utils/queueUtils.js)): Prevents adding tracks or playlist entries that are already playing or present in the queue.
- **4-State Loop:** Cycles between `Off`, `Song`, `Queue`, and `Autoplay`.
- **YouTube Playlists & Search:** Supports YouTube playlist URLs (`list=`) as well as searching for playlists via `.playlist <name>`.
- **23 FFmpeg Audio Filters:** Toggle filters live via `.filter <name>` or `.filter off`, and inspect filter states via `.filters`. Includes an FFmpeg output-seeking patch in [`index.js`](Simple-Bot/index.js) so HLS `.m3u8` streams (such as SoundCloud) continue playing cleanly when toggling audio filters.
- **HTTP Keep-Alive & Optional YouTube Alerts:** Built-in Express server responds with `DISCORD BOT IS ONLINE` on `GET /` (using `PORT`, default `3000`) and optionally mounts a PubSubHubbub YouTube upload webhook on `/yt`.
- **HTTP Header Safeguard:** Automatically relaunches Node.js with `--max-http-header-size=65536` when needed to avoid `HPE_HEADER_OVERFLOW` errors on YouTube responses.

### Setup & Running

#### Prerequisites

- **Node.js `>= 18.0.0`**
- A Discord Bot application from the [Discord Developer Portal](https://discord.com/developers/applications) with **Message Content Intent** and **Server Members Intent** enabled (required by `GatewayIntentBits` in [`index.js`](Simple-Bot/index.js))

#### Installation

```bash
cd Simple-Bot
npm install
```

#### Configuration (`Simple-Bot/.env`)

Create a `.env` file inside `Simple-Bot/` with your bot credentials and settings:

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `TOKEN` | Yes | — | Discord bot token. |
| `PREFIX` | No | `.` | Command prefix used in chat. |
| `PORT` | No | `3000` | Port for the built-in Express HTTP server. |
| `HUB_CALLBACK` | No | — | Public callback URL for YouTube notifications (enables `/yt` when set alongside `CHANNEL_ID`). |
| `HUB_SECRET` | No | `SECRET` | Verification secret for the YouTube notification hub. |
| `CHANNEL_ID` | No | — | Comma-separated YouTube channel IDs to watch for uploads. |
| `SERVER_CHANNEL_ID` | No | — | Discord text channel ID where new YouTube upload notifications are posted. |

#### Running the Bot

```bash
# Start the bot (also available as `npm run dev`)
npm start

# Run ESLint
npm run lint
```

On Windows, [`Simple-Bot/start.bat`](Simple-Bot/start.bat) also provides a quick launcher (`node .`).

> [!NOTE]
> [`Simple-Bot/Hi (come here if your installing the bot)/`](Simple-Bot/Hi%20%28come%20here%20if%20your%20installing%20the%20bot%29/) contains legacy Windows Scoop/Node.js/Python installer and uninstall batch/PowerShell scripts. Using `npm install` with a `.env` file as shown above is recommended.

### Commands Reference

Default prefix is `.` (configurable via `PREFIX`). Below are all 23 commands loaded by [`index.js`](Simple-Bot/index.js):

#### Core & Info

| Command | Aliases | Usage | Description |
| :--- | :--- | :--- | :--- |
| `help` | `h`, `commands` | `.help [command name]` | Displays all commands, interactive features, or detailed usage for a specific command. |
| `ping` | — | `.ping` | Shows bot latency and WebSocket ping. |
| `debug` | — | `.debug` | Displays the number of servers with active voice connections. |

#### Music

| Command | Aliases | Usage | Description |
| :--- | :--- | :--- | :--- |
| `play` | `p` | `.play [name/URL]` | Plays a song or playlist from YouTube, SoundCloud, Spotify, or search term. |
| `playlist` | `pl` | `.playlist [URL or playlist name]` | Loads a YouTube playlist URL or searches for a playlist and queues its tracks. |
| `playnext` | `pn`, `addnext`, `insert` | `.playnext [name/URL]` | Searches and inserts a track at the top of the queue to play next. |
| `search` | `sr` | `.search [name/URL]` | Searches YouTube and plays the top result. |
| `nowplaying` | `np` | `.nowplaying` | Displays the currently playing track with a progress bar and interactive control buttons. |
| `queue` | `q` | `.queue [page]` | Displays the paginated song queue with duration, loop status, and a jump dropdown. |
| `pause` | — | `.pause` | Pauses the currently playing song. |
| `resume` | — | `.resume` | Resumes playback of a paused song. |
| `skip` | `sk` | `.skip` | Skips the currently playing song and moves to the next track. |
| `back` | `previous`, `prev` | `.back` | Plays the previous song from history or restarts the current song. |
| `jump` | `j`, `goto` | `.jump [track # or song name]` | Jumps to a queued song by number, name, or dropdown without removing earlier songs. |
| `skipto` | `st` | `.skipto [track # or song name]` | Skips directly to a queued track and removes the songs before it. |
| `remove` | `rm`, `delete` | `.remove [track number]` | Removes a specific track from the queue by its position number. |
| `clear-queue` | `cq` | `.clear-queue` | Removes all upcoming tracks from the queue. |
| `shuffle` | `sh` | `.shuffle` | Randomly shuffles all upcoming tracks in the queue. |
| `loop` | `lp`, `repeat` | `.loop [song \| queue \| autoplay \| off]` | Cycles or sets repeat mode (`song`, `queue`, `autoplay`, or `off`). |
| `volume` | — | `.volume [1-100]` | Sets music playback volume between `1` and `100`. |
| `filter` | — | `.filter [filter name / off]` | Toggles an audio filter or disables all active filters. |
| `filters` | `w-filters` | `.filters` | Displays all 23 available audio filters and their enabled/disabled status. |
| `stop` | `dc` | `.stop` | Stops playback, clears the queue, and disconnects from voice. |

> [!NOTE]
> [`Simple-Bot/commands/warn/`](Simple-Bot/commands/warn/) contains legacy MongoDB warning command files (`warn.js`, `list-warnings.js`) that are not loaded by [`index.js`](Simple-Bot/index.js).

#### Available Audio Filters

<details>
<summary>View all 23 audio filters defined in <code>Simple-Bot/config/filters.json</code></summary>

`bassboost`, `8D`, `vaporwave`, `nightcore`, `phaser`, `tremolo`, `vibrato`, `reverse`, `treble`, `normalizer`, `surrounding`, `pulsator`, `subboost`, `karaoke`, `flanger`, `gate`, `haas`, `mcompand`, `lofi`, `mono`, `chorus`, `compressor`, `earrape`

</details>

---

## `FakeVirus` — Windows Shutdown Prank Utility

- **Files:** [`FakeVirus/README.md`](FakeVirus/README.md), [`FakeVirus/cancel the operation.bat`](FakeVirus/cancel%20the%20operation.bat) (Windows)

Documents a harmless Windows shutdown prank (which does not delete any programs or files) and provides [`cancel the operation.bat`](FakeVirus/cancel%20the%20operation.bat), which runs `shutdown -a` to abort a pending Windows shutdown timer.

---

## Security, CI & License

- **CodeQL Analysis:** [`.github/workflows/codeql-analysis.yml`](.github/workflows/codeql-analysis.yml) runs GitHub CodeQL JavaScript analysis on pushes and pull requests to `master`, as well as on a weekly schedule.
- **Security Policy:** See [`SECURITY.md`](SECURITY.md) (and [`Simple-Bot/Security/SECURITY.md`](Simple-Bot/Security/SECURITY.md)).
- **License:** `Simple-Bot` is licensed under the GNU Affero General Public License v3.0 — see [`Simple-Bot/LICENSE`](Simple-Bot/LICENSE).
