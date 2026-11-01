// Ensure max-http-header-size is at least 65536 to prevent HPE_HEADER_OVERFLOW on YouTube responses
const http = require('http');
if (http.maxHeaderSize < 65536 && !process.env._HEADER_SIZE_FIXED) {
    const { spawn } = require('child_process');
    const child = spawn(process.execPath, ['--max-http-header-size=65536', ...process.argv.slice(1)], {
        stdio: 'inherit',
        env: { ...process.env, _HEADER_SIZE_FIXED: '1' }
    });
    child.on('close', code => process.exit(code ?? 0));
    return;
}

// Modern Discord.js v14 Bot - Updated 2026
require('dotenv').config();

// Alias discord-voip to @discordjs/voice to enable full DAVE / E2EE voice protocol support
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    if (id === 'discord-voip') {
        return originalRequire.call(this, '@discordjs/voice');
    }
    return originalRequire.apply(this, arguments);
};

const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActivityType } = require('discord.js');
const { Player } = require('discord-player');
const fs = require('fs');
const path = require('path');
const express = require('express');

// Initialize Express server
const app = express();
const server = http.createServer(app);

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

client.setMaxListeners(15);

// Initialize Discord Player v7
client.player = new Player(client);

// Backward compatibility shim for getQueue
client.player.getQueue = (messageOrGuildId) => {
    const guildId = typeof messageOrGuildId === 'string'
        ? messageOrGuildId
        : messageOrGuildId?.guild?.id || messageOrGuildId?.guildId;
    return client.player.nodes.get(guildId);
};

// Player debug logs
client.player.events.on('debug', (queue, message) => {
    console.log(`[Player Debug] [${queue.guild?.name || queue.id}]: ${message}`);
});

// Load extractors (SoundCloud, Spotify, Apple Music, Attachments, etc.)
const { DefaultExtractors } = require('@discord-player/extractor');
client.player.extractors.loadMulti(DefaultExtractors);

// Load custom YouTube extractor powered by @distube/ytdl-core to bypass YouTube blocking
const PlayDlExtractor = require('./extractors/PlayDlExtractor');
client.player.extractors.register(PlayDlExtractor, {});

// Load configurations from .env and config files
client.config = {
    prefix: process.env.PREFIX || '.',
};
client.emotes = require('./config/emojis.json');
client.filters = require('./config/filters.json');
client.commands = new Collection();

// Express routes
app.get('/', (req, res) => {
    console.log('Ping received');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('DISCORD BOT IS ONLINE');
});

// Start Express server
const PORT = process.env.PORT || 3000;
const listener = server.listen(PORT, () => {
    console.log(`🌐 Web server listening on port ${listener.address().port}`);
});

// YouTube Notification Setup (Optional)
if (process.env.HUB_CALLBACK && process.env.CHANNEL_ID) {
    try {
        const YouTubeNotifier = require('youtube-notification');
        const notifier = new YouTubeNotifier({
            hubCallback: process.env.HUB_CALLBACK,
            secret: process.env.HUB_SECRET || 'SECRET'
        });

        notifier.on('notified', data => {
            console.log('📹 New YouTube video detected');
            const channel = client.channels.cache.get(process.env.SERVER_CHANNEL_ID);
            if (channel) {
                channel.send(`**${data.channel.name}** just uploaded a new video - **${data.video.link}**`);
            }
        });

        const channelIds = process.env.CHANNEL_ID.split(',');
        channelIds.forEach(id => notifier.subscribe(id.trim()));
        
        app.use('/yt', notifier.listener());
        console.log(`👀 Watching ${channelIds.length} YouTube channel(s)`);
    } catch (error) {
        console.warn('⚠️ YouTube notification setup failed:', error.message);
    }
}

// Load commands from directories
const commandFolders = ['core', 'infos', 'music'];
for (const folder of commandFolders) {
    const commandPath = path.join(__dirname, 'commands', folder);
    if (fs.existsSync(commandPath)) {
        const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            try {
                const command = require(path.join(commandPath, file));
                if (command.name) {
                    client.commands.set(command.name.toLowerCase(), command);
                    console.log(`✅ Loaded command: ${folder}/${file}`);
                }
            } catch (error) {
                console.error(`❌ Error loading command ${folder}/${file}:`, error);
            }
        }
    }
}

// Load events
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
        try {
            const event = require(path.join(eventsPath, file));
            const eventName = file.split('.')[0];
            
            // Map old event names to new Discord.js v14+ names
            let actualEventName = eventName;
            if (eventName === 'message') {
                actualEventName = 'messageCreate';
            } else if (eventName === 'ready') {
                actualEventName = 'clientReady';
            }
            
            client.on(actualEventName, event.bind(null, client));
            console.log(`✅ Loaded event: ${file}`);
        } catch (error) {
            console.error(`❌ Error loading event ${file}:`, error);
        }
    }
}

// Load player events
const playerPath = path.join(__dirname, 'player');
if (fs.existsSync(playerPath)) {
    const playerFiles = fs.readdirSync(playerPath).filter(file => file.endsWith('.js'));
    
    // Map legacy discord-player v5 event names to v7 event names
    const eventNameMap = {
        trackStart: 'playerStart',
        trackAdd: 'audioTrackAdd',
        playlistAdd: 'audioTracksAdd',
        queueEnd: 'emptyQueue',
        channelEmpty: 'emptyChannel',
        botDisconnect: 'disconnect',
        error: 'error',
        playerError: 'playerError'
    };

    for (const file of playerFiles) {
        try {
            const event = require(path.join(playerPath, file));
            const rawEventName = file.split('.')[0];
            const eventName = eventNameMap[rawEventName] || rawEventName;
            client.player.events.on(eventName, (...args) => event(client, ...args));
            console.log(`✅ Loaded player event: ${file} -> ${eventName}`);
        } catch (error) {
            console.error(`❌ Error loading player event ${file}:`, error);
        }
    }
}

// Ready event (using clientReady for Discord.js v14+)
client.once('clientReady', () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Bot is online as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} server(s)`);
    console.log(`👥 Watching ${client.users.cache.size} user(s)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Set bot activity
    client.user.setActivity('Music | ' + client.config.prefix + 'help', { 
        type: ActivityType.Playing 
    });
});

// Error handling
process.on('unhandledRejection', error => {
    if (error?.code === 'ABORT_ERR' || error?.name === 'AbortError') {
        console.warn('⚠️ Voice connection timeout/aborted (network or permission issue):', error.message);
        return;
    }
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

// Login to Discord
const token = process.env.TOKEN;
if (!token) {
    console.error('❌ No bot token found! Please set TOKEN in .env file');
    process.exit(1);
}

client.login(token)
    .then(() => console.log('🔐 Successfully logged in'))
    .catch(error => {
        console.error('❌ Failed to login:', error);
        process.exit(1);
    });
