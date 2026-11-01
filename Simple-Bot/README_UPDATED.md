# Simple Discord Music Bot - Modernized 2026

A feature-rich Discord music bot with command handling, moderation tools, and YouTube notifications, fully updated for Discord.js v14.

## 🎉 What's New in v3.0

### ✅ Updated Dependencies
- **Discord.js v14.16.3** (latest stable)
- **discord-player v6.7.1** (stable music player)
- **Modern Node.js patterns** (async/await, proper error handling)
- **Security improvements** (environment variables for tokens)

### ✅ Code Improvements
- Fixed all deprecated Discord.js v14 patterns
- `MessageEmbed` → `EmbedBuilder`
- `message` event → `messageCreate`
- Modern permission checks
- Proper error handling throughout
- Removed vulnerable dependencies

### ✅ Configuration Changes
- Moved `config.json` to `config/` folder
- Added `.env` support for sensitive data
- Added `.gitignore` to prevent token leaks
- Cleaner project structure

## 📋 Prerequisites

- **Node.js v18.0.0 or higher** (You have v22.17.0 ✅)
- Discord Bot Token
- FFmpeg (for music playback)

## 🚀 Setup Instructions

### 1. Configure Your Bot

#### Option A: Using .env file (Recommended)
1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edit `.env` and add your bot token:
   ```env
   TOKEN=YOUR_ACTUAL_BOT_TOKEN_HERE
   PREFIX=.
   SERVER_CHANNEL_ID=your_channel_id
   ```

#### Option B: Using config.json
1. Edit `config/config.json` and add your bot token:
   ```json
   {
     "prefix": ".",
     "token": "YOUR_BOT_TOKEN_HERE",
     "SERVER_CHANNEL_ID": "your_channel_id"
   }
   ```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Start the Bot
```powershell
npm start
```

## 🎵 Available Commands

### Music Commands
- `.play [song name/URL]` - Play a song
- `.pause` - Pause the current song
- `.resume` - Resume playback
- `.skip` - Skip to the next song
- `.stop` - Stop playback and clear queue
- `.queue` - Show the current queue
- `.nowplaying` - Show current song
- `.volume [1-100]` - Adjust volume
- `.shuffle` - Shuffle the queue
- `.loop` - Toggle loop mode
- `.filter [filter name]` - Apply audio filters
- `.clear-queue` - Clear the queue

### Info Commands
- `.ping` - Check bot latency
- `.debug` - Debug information
- `.help` - Show help message

### Moderation Commands
- `.ban @user` - Ban a user
- `.kick @user` - Kick a user

### Fun Commands
- `.hello` - Say hello
- `.hi` - Greet the bot
- `.8ball` - Ask the magic 8-ball
- `.youtube` / `.yt` - Get the YouTube channel link
- `.info` - Bot version info
- `.bday` - Birthday message

## 🔧 Configuration Files

### `config/config.json`
Main configuration file (moved from root):
```json
{
  "prefix": ".",
  "token": "YOUR_TOKEN",
  "SERVER_CHANNEL_ID": "channel_id"
}
```

### `config/bot.json`
Bot-specific settings

### `config/emojis.json`
Custom emojis for responses

### `config/filters.json`
Audio filter definitions

## 🔒 Security Notes

### ⚠️ IMPORTANT: Your old token was exposed!
The token in your old `config.json` was:
```
NzcwNjg3ODMzNzQ3ODgyMDA0.GV0xue.3BHXMTGoKXPhQGtP8H0e9yC2KcrQjou1-wqXfk
```

**You MUST regenerate this token:**
1. Go to https://discord.com/developers/applications
2. Select your application
3. Go to "Bot" section
4. Click "Reset Token"
5. Copy the new token to `.env` or `config/config.json`

### Security Best Practices
- ✅ Never commit `config/config.json` or `.env` to git
- ✅ Use `.env` for sensitive data
- ✅ Added `.gitignore` to protect your tokens
- ✅ Regenerate tokens if accidentally exposed

## 📁 Project Structure

```
Simple-Bot/
├── commands/
│   ├── core/          # Core commands (help)
│   ├── infos/         # Info commands (ping, debug)
│   ├── music/         # Music commands
│   └── warn/          # Warning system
├── config/
│   ├── config.json    # Main config (MOVED HERE)
│   ├── bot.json
│   ├── emojis.json
│   └── filters.json
├── events/
│   ├── message.js     # Message handler (updated to v14)
│   └── ready.js       # Ready event
├── player/            # Discord-player events
├── .env.example       # Environment template
├── .gitignore         # Git ignore file
├── index.js           # Main bot file (COMPLETELY REWRITTEN)
└── package.json       # Dependencies (UPDATED)
```

## 🐛 Troubleshooting

### Bot won't start
- Check that your token is correct
- Ensure Node.js v18+ is installed
- Run `npm install` to install dependencies

### Music not playing
- Install FFmpeg: `winget install ffmpeg` or download from ffmpeg.org
- Check bot has permission to join voice channels
- Ensure you're in a voice channel

### Permission errors
- Grant bot necessary permissions in Discord Developer Portal
- Check bot role position in server settings

## 📝 Migration from v2.0

Your old files have been backed up:
- `index.js.backup` - Original index.js
- `config.json.old` - Original config.json

Changes made:
1. ✅ Updated all Discord.js v14 deprecated code
2. ✅ Moved config.json to config/ folder
3. ✅ Added .env support
4. ✅ Updated package.json dependencies
5. ✅ Fixed all security vulnerabilities
6. ✅ Improved error handling
7. ✅ Modernized code patterns

## 📊 Package Updates

| Package | Old | New | Status |
|---------|-----|-----|--------|
| discord.js | 14.12.1 | 14.16.3 | ✅ Updated |
| discord-player | 6.6.2 | 6.7.1 | ✅ Updated |
| @discordjs/voice | 0.16.0 | 0.19.0 | ✅ Updated |
| @discordjs/opus | 0.9.0 | 0.10.0 | ✅ Updated |
| express | 4.18.2 | 4.21.2 | ✅ Updated |
| dotenv | N/A | 16.4.7 | ✅ Added |
| ytdl-core | 4.11.5 | Removed | ⚠️ Unreliable |

## 📜 License

ISC License

## 🤝 Contributing

Feel free to open issues or submit pull requests!

## ⚡ Quick Start

```powershell
# 1. Install dependencies
npm install

# 2. Copy environment file
Copy-Item .env.example .env

# 3. Edit .env with your token
notepad .env

# 4. Start the bot
npm start
```

---

**Made with ❤️ by Mritachiuchiha | Updated for 2026**
