const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const { userInfo } = require('os');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('The bot is online!');
    client.user.setActivity("With Light Saver");
})

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
        msg.reply('2.0!');

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
client.on('message', message =>{
    
    if(!message.content.startsWith() || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'clear'){
        client.commands.get('clear').execute(message, args);
    } else if(command === 'kick'){
        client.commands.get('kick').execute(message, args);
    } else if(command === 'ban'){
        client.commands.get('ban').execute(message, args);
    }
});
client.login(config.token);