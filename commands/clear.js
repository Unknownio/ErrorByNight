module.express ={
    name: 'clear',
    description: "clear message",
    execute(message, args){
        if(!args[0]) return message.reply("please enter the amount of messages that you ment to clear!");
        if(isNaN(args[0])) return message.reply("please enter a real number!");

        if(args[0] > 100) return message.reply("You canno't delete more than 100 messages!");
        if(args[0] < 1) return message.reply("You must delete atleast one more!");
    } 
}