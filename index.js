const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const { userInfo } = require('os');
const client = new Discord.Client();

client.on("ready", () => {
    client.user.setActivity("Anime", { type: "STREAMING", url: "https://www.twitch.tv/thewhiteknightx" })
})

client.on('message', message => {
    if (message.channel.type != 'text' || message.author.bot)
      return;
  
    let command = message.content.split(' ')[0].slice(1);
    let args = message.content.replace('.' + command, '').trim();
  
    switch (command) {
      case 'ping': {
        message.channel.send('Pong! (~ ' + client.ping + 'ms)');
        break;
      }
  
  
      case 'uptime': {
        // client.uptime is in millseconds
        // this is just maths, I won't explain much of it
        // % is modulo, AKA the remainder of a division
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;
  
        message.channel.send(`__Uptime:__\n${days}d ${hours}h ${minutes}m ${seconds}s`);
        break;
      }
    }
  });

console.log('The bot is online!');
client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const command = args.shift();

    var number = -1; 
    var folder = -1; 

    if (config.folder.includes(command)) {
        folder = config.folder.indexOf(command);

        fs.readdir('./' + config.folder[folder], (err, files) => {
            number = files.length;

            if (!args.length) {
                imageNumber = Math.floor(Math.random() * number) + 1;
            } else {
                imageNumber = args[0];

                if (imageNumber > number) { 
                    return message.channel.send("Possible arguments: " + config.prefix + command + " [1-" + number + "]."); 
                }
            }

            message.channel.send ({files: ["./" + config.folder[folder] + "\\" + imageNumber + ".png"]} )
        });
    } else if (command === "random") {
        folder = Math.floor(Math.random() * config.folder.length);
        fs.readdir('./' + config.folder[folder], (err, files) => {
            number = files.length;
            imageNumber = Math.floor(Math.random() * number) + 1;
            message.channel.send ({files: ["./" + config.folder[folder] + "\\" + imageNumber + ".png"]} )
        });
    }
});

client.on('message', msg=>{
    if(msg.content === "!hello"){
       msg.reply('HELLO FRIEND!');
    }   
})

client.on('message', msg=>{
    if(msg.content === "!info"){
        msg.reply('2.0.0!');

    }
})

client.on('message', msg=>{
    if(msg.content === "!bday"){
        msg.reply('Happy Birthday my Friend 🥳');

    }
})

client.on('message', msg=>{
    if(msg.content === "!hi"){
       msg.reply('hi nice to meet you :)');
    }   
})

client.on('message', msg =>{
    if(msg.content === "!youtube"){
       msg.reply('https://www.youtube.com/channel/UC-gxQ1O2J4TtW8PLHlBv0Ng?view_as=subscriber');
    }
})  

client.on('message', msg =>{
    if(msg.content === "!yt"){
       msg.reply('https://www.youtube.com/channel/UC-gxQ1O2J4TtW8PLHlBv0Ng?view_as=subscriber');
    }
})

client.on('message', msg =>{
    if(msg.content === "!8ball"){
       msg.reply('I can see you going to have good day ;)');
    }
})
client.login(config.token);