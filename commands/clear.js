const Discord = require('discord.js');

module.exports = {
    name: 'clear',
    description: "clear message",
    run: async(client, message, args) => {
        const {prefix, token} = require ('../config.json')

        async function clear() {
             message.delete();

            var purge = Number(args[1])

            if(isNaN(purge)) {
                message.channel.send('Please')
            }
            const fetched = await message.channel.message.fetch({limit: purge});
            console.log(fetched.size + 'messages found.');

            message.channel.bulkDelete(fetched)
            message.channel.send('I have deleted ${fetched.size}' ,messages)
        }
        clear();
    }}
