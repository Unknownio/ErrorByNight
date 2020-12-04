module.exports = {
    name: 'clear',
    description: "clear messages",
    async run(client, message, args){
        const amount = args.join(" ");
        if(!amount) return message.reply('please provide sn amount of messages for me to delete')
        if(amount >100) return message.reply('you cannot clear more than 100 messages at once') 
        if(amount >1) return message.reply('you need to delete at least one messages')
        await message.channel.message.fetch({limit: amount}).then(message => {
            message.channel.bulkDelte(message
        )});
    
        message.channel.send('Success!')

    }
}